import { type NextRequest } from 'next/server';
import { getSession } from '@/platform/lib/auth';
import { createConversation, addMessage, getMessages, updateConversationTitle } from '@/features/chat/action';
import { buildSystemPrompt } from '@/features/chat/prompts/system-prompt';
import { getSkillCatalog } from '@/platform/lib/skills';
import { DOMAINS, FEATURE_ADDONS } from '@/platform/lib/toolkit-composition';
import { shouldPreSearch, extractSearchQuery, formatPreSearchResults } from '@/features/chat/prompts/pre-search';
import { searchSkillsDefinition, executeSearchSkills } from '@/features/chat/tools/search-skills';
import { composeToolkitDefinition, executeComposeToolkit } from '@/features/chat/tools/compose-toolkit';
import { generateProjectDefinition, executeGenerateProject } from '@/features/chat/tools/generate-project';
import { navigateDefinition, executeNavigate } from '@/features/chat/tools/navigate';
import { getSkillDetailDefinition, executeGetSkillDetail } from '@/features/chat/tools/get-skill-detail';
import { validateSkillReferences } from '@/features/chat/validation/validate-skill-references';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'mistralai/mistral-small-2603';

const tools = [
  searchSkillsDefinition,
  getSkillDetailDefinition,
  composeToolkitDefinition,
  generateProjectDefinition,
  navigateDefinition,
];

const toolExecutors: Record<string, (args: Record<string, unknown>) => Promise<string>> = {
  search_skills: (args) => executeSearchSkills(args as Parameters<typeof executeSearchSkills>[0]),
  get_skill_detail: (args) => executeGetSkillDetail(args as Parameters<typeof executeGetSkillDetail>[0]),
  compose_toolkit: (args) => executeComposeToolkit(args as Parameters<typeof executeComposeToolkit>[0]),
  generate_project: (args) => executeGenerateProject(args as Parameters<typeof executeGenerateProject>[0]),
  navigate: (args) => executeNavigate(args as Parameters<typeof executeNavigate>[0]),
};

const COMPLEX_KEYWORDS = /\b(research|think|analyze|compare|explain in detail|pros and cons|deep dive|evaluate|plan|strategy|architecture|trade-?offs|comprehensive|thorough)\b/i;

/** Determine reasoning effort for Mistral Small 4 based on query complexity. */
function getReasoningEffort(message: string): 'none' | 'high' {
  if (message.length > 150 && COMPLEX_KEYWORDS.test(message)) return 'high';
  if (COMPLEX_KEYWORDS.test(message)) return 'high';
  return 'none';
}

/**
 * POST /api/chat — Streaming chat endpoint.
 *
 * Body: { conversationId?: string, message: string }
 * Response: Server-Sent Events stream
 */
export async function POST(request: NextRequest) {
  // Auth
  const session = await getSession();
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // API key check
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Chat is not configured — OPENROUTER_API_KEY not set' }), { status: 503 });
  }

  // Parse body
  let body: { conversationId?: string; message: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  const { message } = body;
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return new Response(JSON.stringify({ error: 'Message is required' }), { status: 400 });
  }
  if (message.length > 10000) {
    return new Response(JSON.stringify({ error: 'Message too long (max 10000 characters)' }), { status: 400 });
  }

  // Get or create conversation
  let conversationId = body.conversationId;
  if (!conversationId) {
    const convResult = await createConversation(session.userId);
    if (!convResult.ok) {
      return new Response(JSON.stringify({ error: 'Failed to create conversation' }), { status: 500 });
    }
    conversationId = convResult.value.id;
  }

  // Save user message
  await addMessage(conversationId, 'user', message.trim());

  // Load conversation history
  const historyResult = await getMessages(conversationId);
  const history = historyResult.ok ? historyResult.value : [];

  // Pre-search: run search_skills on user's message for grounding
  let relevantSkillContent: string | undefined;
  if (shouldPreSearch(message)) {
    try {
      const query = extractSearchQuery(message);
      const resultJson = await executeSearchSkills({ query, limit: 8 });
      const parsed = JSON.parse(resultJson);
      if (parsed.skills?.length > 0) {
        relevantSkillContent = formatPreSearchResults(parsed.skills);
      }
    } catch { /* non-critical */ }
  }

  // Build system prompt with skill catalog for grounding
  const skillCatalog = getSkillCatalog();
  const priorMessageCount = history.length - 1; // -1 because we just added the user message
  const systemPrompt = buildSystemPrompt({
    skillCatalog,
    domains: DOMAINS.map((d) => d.title),
    addons: FEATURE_ADDONS.map((f) => f.title),
    messageCount: Math.max(0, priorMessageCount),
    relevantSkillContent,
  });

  // Build OpenRouter messages
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map((m) => ({
      role: m.role,
      content: m.content,
      ...(m.toolCalls ? { tool_calls: m.toolCalls.map((tc) => ({ id: tc.id, type: 'function' as const, function: { name: tc.name, arguments: tc.arguments } })) } : {}),
      ...(m.role === 'tool' && m.toolResults?.[0] ? { tool_call_id: m.toolResults[0].toolCallId } : {}),
    })),
  ];

  // Stream response
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const reasoningEffort = getReasoningEffort(message);
        const fullResponse = await callOpenRouter(apiKey, messages, controller, encoder, conversationId!, 0, reasoningEffort);

        // Validate and clean skill references before saving
        let finalContent = fullResponse.content;
        if (finalContent) {
          const validSlugs = new Set(skillCatalog.map((s) => s.slug));
          const { cleaned, invalidRefs } = validateSkillReferences(finalContent, validSlugs);
          if (invalidRefs.length > 0) {
            console.warn('[chat] Stripped invalid skill refs:', invalidRefs);
          }
          finalContent = cleaned;
        }

        // Save assistant message
        if (finalContent) {
          await addMessage(conversationId!, 'assistant', finalContent, {
            tokenUsage: fullResponse.tokenUsage ?? undefined,
            thinking: fullResponse.reasoning || undefined,
          });
        }

        // Auto-generate conversation title (async, non-blocking)
        const userMsgCount = history.filter((m) => m.role === 'user').length;
        if (userMsgCount <= 2) {
          generateTitle(apiKey, message.trim(), fullResponse.content, conversationId!).catch(() => {});
        }

        // Send conversation ID + title update
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'meta', conversationId })}\n\n`));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch (err) {
        console.error('[chat] Stream error:', err);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: String(err) })}\n\n`));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

interface OpenRouterResponse {
  content: string;
  reasoning: string;
  tokenUsage: { promptTokens: number; completionTokens: number; totalTokens: number } | null;
}

async function callOpenRouter(
  apiKey: string,
  messages: Record<string, unknown>[],
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  conversationId: string,
  depth = 0,
  reasoningEffort: 'none' | 'high' = 'none',
): Promise<OpenRouterResponse> {
  if (depth > 5) throw new Error('Too many tool call iterations');

  const model = process.env.OPENROUTER_MODEL ?? DEFAULT_MODEL;

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://ai-centre.vercel.app',
      'X-Title': 'AI Centre Chat',
    },
    body: JSON.stringify({
      model,
      messages,
      tools,
      stream: true,
      // Dynamic reasoning effort — 'none' for fast chat, 'high' for complex queries
      ...(reasoningEffort === 'high' ? { reasoning: { effort: 'high' } } : {}),
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenRouter error (${response.status}): ${text}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';
  let fullContent = '';
  let fullReasoning = '';
  let toolCalls: { id: string; name: string; arguments: string }[] = [];
  let tokenUsage: OpenRouterResponse['tokenUsage'] = null;

  // Accumulate partial tool call arguments
  const partialToolCalls = new Map<number, { id: string; name: string; args: string }>();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    while (true) {
      const lineEnd = buffer.indexOf('\n');
      if (lineEnd === -1) break;

      const line = buffer.slice(0, lineEnd).trim();
      buffer = buffer.slice(lineEnd + 1);

      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6);
      if (data === '[DONE]') break;
      if (data.startsWith(': ')) continue; // keepalive comment

      try {
        const parsed = JSON.parse(data);

        if (parsed.error) {
          throw new Error(`OpenRouter stream error: ${parsed.error.message}`);
        }

        const choice = parsed.choices?.[0];
        if (!choice) continue;

        const delta = choice.delta;

        // Reasoning / thinking tokens — use delta.reasoning (primary); fall back to
        // delta.reasoning_details only when reasoning is absent. Qwen3 sends the same
        // content through BOTH fields, so emitting from both causes duplication.
        if (delta?.reasoning) {
          fullReasoning += delta.reasoning;
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'reasoning', content: delta.reasoning })}\n\n`));
        } else if (delta?.reasoning_details) {
          for (const detail of delta.reasoning_details) {
            if (detail?.text) {
              fullReasoning += detail.text;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'reasoning', content: detail.text })}\n\n`));
            }
          }
        }

        // Text content (the actual response)
        if (delta?.content) {
          fullContent += delta.content;
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'token', content: delta.content })}\n\n`));
        }

        // Tool calls (accumulated across chunks)
        if (delta?.tool_calls) {
          for (const tc of delta.tool_calls) {
            const idx = tc.index ?? 0;
            if (tc.id) {
              partialToolCalls.set(idx, { id: tc.id, name: tc.function?.name ?? '', args: tc.function?.arguments ?? '' });
            } else if (partialToolCalls.has(idx)) {
              const existing = partialToolCalls.get(idx)!;
              if (tc.function?.name) existing.name = tc.function.name;
              if (tc.function?.arguments) existing.args += tc.function.arguments;
            }
          }
        }

        // Token usage (final chunk)
        if (parsed.usage) {
          tokenUsage = {
            promptTokens: parsed.usage.prompt_tokens ?? 0,
            completionTokens: parsed.usage.completion_tokens ?? 0,
            totalTokens: parsed.usage.total_tokens ?? 0,
          };
        }

        // Finish reason
        if (choice.finish_reason === 'tool_calls') {
          toolCalls = Array.from(partialToolCalls.values()).map((tc) => ({
            id: tc.id,
            name: tc.name,
            arguments: tc.args,
          }));
        }
      } catch {
        // Skip unparseable chunks
      }
    }
  }

  // If there are tool calls, execute them and continue
  if (toolCalls.length > 0) {
    // Notify client about tool execution
    for (const tc of toolCalls) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'tool_call', name: tc.name, id: tc.id })}\n\n`));
    }

    // Save assistant message with tool calls
    await addMessage(conversationId, 'assistant', fullContent || '', { toolCalls });

    // Add assistant message with tool_calls to context ONCE (before the loop)
    messages.push({
      role: 'assistant',
      content: fullContent || null,
      tool_calls: toolCalls.map((t) => ({
        id: t.id, type: 'function',
        function: { name: t.name, arguments: t.arguments },
      })),
    });

    // Execute each tool and push results
    for (const tc of toolCalls) {
      const executor = toolExecutors[tc.name];
      let result: string;
      if (executor) {
        try {
          const args = JSON.parse(tc.arguments);
          result = await executor(args);
        } catch (err) {
          result = JSON.stringify({ error: `Tool execution failed: ${String(err)}` });
        }
      } else {
        result = JSON.stringify({ error: `Unknown tool: ${tc.name}` });
      }

      // If generate_project returned base64, emit a download event and strip base64
      let resultForModel = result;
      if (tc.name === 'generate_project') {
        try {
          const parsed = JSON.parse(result);
          if (parsed.base64 && parsed.fileName) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'download', base64: parsed.base64, filename: parsed.fileName })}\n\n`));
            const { base64: _, ...rest } = parsed;
            resultForModel = JSON.stringify(rest);
          }
        } catch { /* not JSON, pass through */ }
      }

      // Save tool result
      await addMessage(conversationId, 'tool', resultForModel, {
        toolResults: [{ toolCallId: tc.id, content: resultForModel }],
      });

      // Notify client
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'tool_result', name: tc.name, id: tc.id, result: resultForModel })}\n\n`));

      // Add tool result to context for next call
      messages.push({
        role: 'tool',
        tool_call_id: tc.id,
        content: resultForModel,
      });
    }

    // Continue conversation with tool results
    return callOpenRouter(apiKey, messages, controller, encoder, conversationId, depth + 1, reasoningEffort);
  }

  return { content: fullContent, reasoning: fullReasoning, tokenUsage };
}

/** Generate a short title for the conversation (non-blocking, cheap call) */
async function generateTitle(apiKey: string, userMessage: string, assistantResponse: string, conversationId: string) {
  try {
    const res = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-haiku-4.5',
        messages: [
          {
            role: 'user',
            content: `Generate a short title (3-6 words) for this conversation. Plain text only — no quotes, no hashtags, no markdown, no special characters.\n\nUser: ${userMessage.substring(0, 200)}\nAssistant: ${assistantResponse.substring(0, 300)}`,
          },
        ],
        max_tokens: 20,
      }),
    });

    if (!res.ok) return;
    const data = await res.json();
    let title = data.choices?.[0]?.message?.content?.trim();
    if (title) {
      // Strip markdown heading prefixes, quotes, and asterisks
      title = title.replace(/^[#*>"]+\s*/, '').replace(/[*"]+$/g, '').trim();
    }
    if (title && title.length > 0 && title.length < 60) {
      await updateConversationTitle(conversationId, title);
    }
  } catch {
    // Non-critical — silently fail
  }
}
