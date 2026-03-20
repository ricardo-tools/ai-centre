'use client';

import type { ParsedSkillContent } from '@/platform/domain/ParsedSkill';
import { SkillShowcaseFallback } from '@/platform/components/SkillShowcaseFallback';
import type { SizeVariant } from '@/platform/screen-renderer/types';

// ── Original 8 showcases ─────────────────────────────────────────────
import { BrandDesignShowcaseWidget } from '@/features/skill-detail/widgets/BrandDesignShowcaseWidget';
import { AppLayoutShowcaseWidget } from '@/features/skill-detail/widgets/AppLayoutShowcaseWidget';
import { FrontendArchitectureShowcaseWidget } from '@/features/skill-detail/widgets/FrontendArchitectureShowcaseWidget';
import { DesignFoundationsShowcaseWidget } from '@/features/skill-detail/widgets/DesignFoundationsShowcaseWidget';
import { PresentationShowcaseWidget } from '@/features/skill-detail/widgets/PresentationShowcaseWidget';
import { PrintDesignShowcaseWidget } from '@/features/skill-detail/widgets/PrintDesignShowcaseWidget';
import { PptxExportShowcaseWidget } from '@/features/skill-detail/widgets/PptxExportShowcaseWidget';
import { CreativeToolkitShowcaseWidget } from '@/features/skill-detail/widgets/CreativeToolkitShowcaseWidget';

// ── Batch 1: Architecture & Code ─────────────────────────────────────
import CleanArchitectureShowcaseWidget from '@/features/skill-detail/widgets/CleanArchitectureShowcaseWidget/CleanArchitectureShowcaseWidget';
import CodingStandardsShowcaseWidget from '@/features/skill-detail/widgets/CodingStandardsShowcaseWidget/CodingStandardsShowcaseWidget';
import NextjsAppRouterTurbopackShowcaseWidget from '@/features/skill-detail/widgets/NextjsAppRouterTurbopackShowcaseWidget/NextjsAppRouterTurbopackShowcaseWidget';
import BackendPatternsShowcaseWidget from '@/features/skill-detail/widgets/BackendPatternsShowcaseWidget/BackendPatternsShowcaseWidget';

// ── Batch 2: Testing & Quality ───────────────────────────────────────
import TestingStrategyShowcaseWidget from '@/features/skill-detail/widgets/TestingStrategyShowcaseWidget/TestingStrategyShowcaseWidget';
import PlaywrightE2eShowcaseWidget from '@/features/skill-detail/widgets/PlaywrightE2eShowcaseWidget/PlaywrightE2eShowcaseWidget';
import QualityAssuranceShowcaseWidget from '@/features/skill-detail/widgets/QualityAssuranceShowcaseWidget/QualityAssuranceShowcaseWidget';
import VerificationLoopShowcaseWidget from '@/features/skill-detail/widgets/VerificationLoopShowcaseWidget/VerificationLoopShowcaseWidget';

// ── Batch 3: Design & UX ────────────────────────────────────────────
import InteractionMotionShowcaseWidget from '@/features/skill-detail/widgets/InteractionMotionShowcaseWidget/InteractionMotionShowcaseWidget';
import ResponsivenessShowcaseWidget from '@/features/skill-detail/widgets/ResponsivenessShowcaseWidget/ResponsivenessShowcaseWidget';
import UserExperienceShowcaseWidget from '@/features/skill-detail/widgets/UserExperienceShowcaseWidget/UserExperienceShowcaseWidget';
import ContentDesignShowcaseWidget from '@/features/skill-detail/widgets/ContentDesignShowcaseWidget/ContentDesignShowcaseWidget';
import AccessibilityShowcaseWidget from '@/features/skill-detail/widgets/AccessibilityShowcaseWidget/AccessibilityShowcaseWidget';

// ── Batch 4: AI & Dev Ops ────────────────────────────────────────────
import ClaudeApiShowcaseWidget from '@/features/skill-detail/widgets/ClaudeApiShowcaseWidget/ClaudeApiShowcaseWidget';
import EvalDrivenDevelopmentShowcaseWidget from '@/features/skill-detail/widgets/EvalDrivenDevelopmentShowcaseWidget/EvalDrivenDevelopmentShowcaseWidget';
import AiMediaGenerationShowcaseWidget from '@/features/skill-detail/widgets/AiMediaGenerationShowcaseWidget/AiMediaGenerationShowcaseWidget';
import ObservabilityShowcaseWidget from '@/features/skill-detail/widgets/ObservabilityShowcaseWidget/ObservabilityShowcaseWidget';

// ── Batch 5: Meta & Process ──────────────────────────────────────────
import SkillCreationShowcaseWidget from '@/features/skill-detail/widgets/SkillCreationShowcaseWidget/SkillCreationShowcaseWidget';
import SkillReviewShowcaseWidget from '@/features/skill-detail/widgets/SkillReviewShowcaseWidget/SkillReviewShowcaseWidget';
import StrategicContextShowcaseWidget from '@/features/skill-detail/widgets/StrategicContextShowcaseWidget/StrategicContextShowcaseWidget';
import DocumentationResearchShowcaseWidget from '@/features/skill-detail/widgets/DocumentationResearchShowcaseWidget/DocumentationResearchShowcaseWidget';
import SecurityReviewShowcaseWidget from '@/features/skill-detail/widgets/SecurityReviewShowcaseWidget/SecurityReviewShowcaseWidget';

// ── Batch 6: Specialized ─────────────────────────────────────────────
import McpServerPatternsShowcaseWidget from '@/features/skill-detail/widgets/McpServerPatternsShowcaseWidget/McpServerPatternsShowcaseWidget';
import PresentationHtmlImplementationShowcaseWidget from '@/features/skill-detail/widgets/PresentationHtmlImplementationShowcaseWidget/PresentationHtmlImplementationShowcaseWidget';
import WebPerformanceShowcaseWidget from '@/features/skill-detail/widgets/WebPerformanceShowcaseWidget/WebPerformanceShowcaseWidget';

// ── Batch 7: Reference Companions ────────────────────────────────────
import AppLayoutPatternsReferenceShowcaseWidget from '@/features/skill-detail/widgets/AppLayoutPatternsReferenceShowcaseWidget/AppLayoutPatternsReferenceShowcaseWidget';
import BrandTokensReferenceShowcaseWidget from '@/features/skill-detail/widgets/BrandTokensReferenceShowcaseWidget/BrandTokensReferenceShowcaseWidget';
import CreativeToolkitChartsReferenceShowcaseWidget from '@/features/skill-detail/widgets/CreativeToolkitChartsReferenceShowcaseWidget/CreativeToolkitChartsReferenceShowcaseWidget';

const showcaseMap: Record<string, React.ComponentType<{ size: SizeVariant }>> = {
  // Original 8
  'brand-design-system': BrandDesignShowcaseWidget,
  'app-layout': AppLayoutShowcaseWidget,
  'frontend-architecture': FrontendArchitectureShowcaseWidget,
  'design-foundations': DesignFoundationsShowcaseWidget,
  'presentation': PresentationShowcaseWidget,
  'print-design': PrintDesignShowcaseWidget,
  'pptx-export': PptxExportShowcaseWidget,
  'creative-toolkit': CreativeToolkitShowcaseWidget,
  // Batch 1
  'clean-architecture': CleanArchitectureShowcaseWidget,
  'coding-standards': CodingStandardsShowcaseWidget,
  'nextjs-app-router-turbopack': NextjsAppRouterTurbopackShowcaseWidget,
  'backend-patterns': BackendPatternsShowcaseWidget,
  // Batch 2
  'testing-strategy': TestingStrategyShowcaseWidget,
  'playwright-e2e': PlaywrightE2eShowcaseWidget,
  'quality-assurance': QualityAssuranceShowcaseWidget,
  'verification-loop': VerificationLoopShowcaseWidget,
  // Batch 3
  'interaction-motion': InteractionMotionShowcaseWidget,
  'responsiveness': ResponsivenessShowcaseWidget,
  'user-experience': UserExperienceShowcaseWidget,
  'content-design': ContentDesignShowcaseWidget,
  'accessibility': AccessibilityShowcaseWidget,
  // Batch 4
  'claude-api': ClaudeApiShowcaseWidget,
  'eval-driven-development': EvalDrivenDevelopmentShowcaseWidget,
  'ai-media-generation': AiMediaGenerationShowcaseWidget,
  'observability': ObservabilityShowcaseWidget,
  // Batch 5
  'skill-creation': SkillCreationShowcaseWidget,
  'skill-review': SkillReviewShowcaseWidget,
  'strategic-context': StrategicContextShowcaseWidget,
  'documentation-research': DocumentationResearchShowcaseWidget,
  'security-review': SecurityReviewShowcaseWidget,
  // Batch 6
  'mcp-server-patterns': McpServerPatternsShowcaseWidget,
  'presentation-html-implementation': PresentationHtmlImplementationShowcaseWidget,
  'web-performance': WebPerformanceShowcaseWidget,
  // Batch 7
  'app-layout-patterns-reference': AppLayoutPatternsReferenceShowcaseWidget,
  'brand-tokens-reference': BrandTokensReferenceShowcaseWidget,
  'creative-toolkit-charts-reference': CreativeToolkitChartsReferenceShowcaseWidget,
};

interface SkillInPracticeProps {
  slug: string;
  parsed: ParsedSkillContent;
  size?: SizeVariant;
}

export function SkillInPractice({ slug, parsed, size = 'lg' }: SkillInPracticeProps) {
  const ShowcaseWidget = showcaseMap[slug];
  if (!ShowcaseWidget) {
    return <SkillShowcaseFallback parsed={parsed} />;
  }
  return <ShowcaseWidget size={size} />;
}
