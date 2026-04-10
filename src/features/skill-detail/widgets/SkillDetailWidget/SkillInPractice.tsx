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
import SkillReviewShowcaseWidget from '@/features/skill-detail/widgets/SkillReviewShowcaseWidget/SkillReviewShowcaseWidget';
import StrategicContextShowcaseWidget from '@/features/skill-detail/widgets/StrategicContextShowcaseWidget/StrategicContextShowcaseWidget';
import SecurityReviewShowcaseWidget from '@/features/skill-detail/widgets/SecurityReviewShowcaseWidget/SecurityReviewShowcaseWidget';

// ── Batch 6: Specialized ─────────────────────────────────────────────
import McpServerPatternsShowcaseWidget from '@/features/skill-detail/widgets/McpServerPatternsShowcaseWidget/McpServerPatternsShowcaseWidget';
import PresentationHtmlImplementationShowcaseWidget from '@/features/skill-detail/widgets/PresentationHtmlImplementationShowcaseWidget/PresentationHtmlImplementationShowcaseWidget';
import WebPerformanceShowcaseWidget from '@/features/skill-detail/widgets/WebPerformanceShowcaseWidget/WebPerformanceShowcaseWidget';

// ── Batch 7: Auth & Authz ───────────────────────────────────────────
import AuthenticationShowcaseWidget from '@/features/skill-detail/widgets/AuthenticationShowcaseWidget/AuthenticationShowcaseWidget';
import AuthClerkShowcaseWidget from '@/features/skill-detail/widgets/AuthClerkShowcaseWidget/AuthClerkShowcaseWidget';
import AuthCustomOtpShowcaseWidget from '@/features/skill-detail/widgets/AuthCustomOtpShowcaseWidget/AuthCustomOtpShowcaseWidget';
import AuthorizationShowcaseWidget from '@/features/skill-detail/widgets/AuthorizationShowcaseWidget/AuthorizationShowcaseWidget';
import AuthzRbacDrizzleShowcaseWidget from '@/features/skill-detail/widgets/AuthzRbacDrizzleShowcaseWidget/AuthzRbacDrizzleShowcaseWidget';

// ── Batch 8: Database & Storage ─────────────────────────────────────
import DatabaseDesignShowcaseWidget from '@/features/skill-detail/widgets/DatabaseDesignShowcaseWidget/DatabaseDesignShowcaseWidget';
import DbNeonDrizzleShowcaseWidget from '@/features/skill-detail/widgets/DbNeonDrizzleShowcaseWidget/DbNeonDrizzleShowcaseWidget';
import DbRedisShowcaseWidget from '@/features/skill-detail/widgets/DbRedisShowcaseWidget/DbRedisShowcaseWidget';
import DbSupabaseShowcaseWidget from '@/features/skill-detail/widgets/DbSupabaseShowcaseWidget/DbSupabaseShowcaseWidget';
import FileStorageShowcaseWidget from '@/features/skill-detail/widgets/FileStorageShowcaseWidget/FileStorageShowcaseWidget';
import StorageVercelBlobShowcaseWidget from '@/features/skill-detail/widgets/StorageVercelBlobShowcaseWidget/StorageVercelBlobShowcaseWidget';

// ── Batch 9: Email, Social & User ───────────────────────────────────
import EmailSendingShowcaseWidget from '@/features/skill-detail/widgets/EmailSendingShowcaseWidget/EmailSendingShowcaseWidget';
import EmailMailgunShowcaseWidget from '@/features/skill-detail/widgets/EmailMailgunShowcaseWidget/EmailMailgunShowcaseWidget';
import SocialFeaturesShowcaseWidget from '@/features/skill-detail/widgets/SocialFeaturesShowcaseWidget/SocialFeaturesShowcaseWidget';
import CommentsReactionsShowcaseWidget from '@/features/skill-detail/widgets/CommentsReactionsShowcaseWidget/CommentsReactionsShowcaseWidget';
import ActivityNotificationsShowcaseWidget from '@/features/skill-detail/widgets/ActivityNotificationsShowcaseWidget/ActivityNotificationsShowcaseWidget';
import UserManagementShowcaseWidget from '@/features/skill-detail/widgets/UserManagementShowcaseWidget/UserManagementShowcaseWidget';

// ── Batch 10: AI & Misc ─────────────────────────────────────────────
import AiCapabilitiesShowcaseWidget from '@/features/skill-detail/widgets/AiCapabilitiesShowcaseWidget/AiCapabilitiesShowcaseWidget';
import AiOpenrouterShowcaseWidget from '@/features/skill-detail/widgets/AiOpenrouterShowcaseWidget/AiOpenrouterShowcaseWidget';
import LocalDevelopmentShowcaseWidget from '@/features/skill-detail/widgets/LocalDevelopmentShowcaseWidget/LocalDevelopmentShowcaseWidget';
import RoadmapShowcaseWidget from '@/features/skill-detail/widgets/RoadmapShowcaseWidget/RoadmapShowcaseWidget';
import FlowShowcaseWidget from '@/features/skill-detail/widgets/FlowShowcaseWidget/FlowShowcaseWidget';

// ── Batch 11: Flow Family ───────────────────────────────────────────
import FlowTddShowcaseWidget from '@/features/skill-detail/widgets/FlowTddShowcaseWidget/FlowTddShowcaseWidget';
import FlowObservabilityShowcaseWidget from '@/features/skill-detail/widgets/FlowObservabilityShowcaseWidget/FlowObservabilityShowcaseWidget';
import FlowPlanningShowcaseWidget from '@/features/skill-detail/widgets/FlowPlanningShowcaseWidget/FlowPlanningShowcaseWidget';
import FlowPlanLogShowcaseWidget from '@/features/skill-detail/widgets/FlowPlanLogShowcaseWidget/FlowPlanLogShowcaseWidget';
import FlowResearchShowcaseWidget from '@/features/skill-detail/widgets/FlowResearchShowcaseWidget/FlowResearchShowcaseWidget';
import FlowProjectDocsShowcaseWidget from '@/features/skill-detail/widgets/FlowProjectDocsShowcaseWidget/FlowProjectDocsShowcaseWidget';
import FlowProjectReferenceShowcaseWidget from '@/features/skill-detail/widgets/FlowProjectReferenceShowcaseWidget/FlowProjectReferenceShowcaseWidget';
import FlowPrototypeShowcaseWidget from '@/features/skill-detail/widgets/FlowPrototypeShowcaseWidget/FlowPrototypeShowcaseWidget';

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
  // Batch 3
  'interaction-motion': InteractionMotionShowcaseWidget,
  'responsiveness': ResponsivenessShowcaseWidget,
  'user-experience': UserExperienceShowcaseWidget,
  'content-design': ContentDesignShowcaseWidget,
  'accessibility': AccessibilityShowcaseWidget,
  // Batch 4
  'ai-claude': ClaudeApiShowcaseWidget,
  'flow-eval-driven': EvalDrivenDevelopmentShowcaseWidget,
  'ai-fal-media': AiMediaGenerationShowcaseWidget,
  'observability': ObservabilityShowcaseWidget,
  // Batch 5
  'skill-review': SkillReviewShowcaseWidget,
  'flow-strategic-context': StrategicContextShowcaseWidget,
  'security-review': SecurityReviewShowcaseWidget,
  // Batch 6
  'mcp-server-patterns': McpServerPatternsShowcaseWidget,
  'presentation-html': PresentationHtmlImplementationShowcaseWidget,
  'web-performance': WebPerformanceShowcaseWidget,
  // Batch 7: Auth & Authz
  'authentication': AuthenticationShowcaseWidget,
  'auth-clerk': AuthClerkShowcaseWidget,
  'auth-custom-otp': AuthCustomOtpShowcaseWidget,
  'authorization': AuthorizationShowcaseWidget,
  'authz-rbac-drizzle': AuthzRbacDrizzleShowcaseWidget,
  // Batch 8: Database & Storage
  'database-design': DatabaseDesignShowcaseWidget,
  'db-neon-drizzle': DbNeonDrizzleShowcaseWidget,
  'db-redis-upstash': DbRedisShowcaseWidget,
  'db-supabase': DbSupabaseShowcaseWidget,
  'file-storage': FileStorageShowcaseWidget,
  'storage-vercel-blob': StorageVercelBlobShowcaseWidget,
  // Batch 9: Email, Social & User
  'email-sending': EmailSendingShowcaseWidget,
  'email-mailgun': EmailMailgunShowcaseWidget,
  'social-features': SocialFeaturesShowcaseWidget,
  'comments-reactions': CommentsReactionsShowcaseWidget,
  'activity-notifications': ActivityNotificationsShowcaseWidget,
  'user-management': UserManagementShowcaseWidget,
  // Batch 10: AI & Misc
  'ai-capabilities': AiCapabilitiesShowcaseWidget,
  'ai-openrouter': AiOpenrouterShowcaseWidget,
  'local-development': LocalDevelopmentShowcaseWidget,
  'flow-roadmap': RoadmapShowcaseWidget,
  'flow': FlowShowcaseWidget,
  // Batch 11: Flow Family
  'flow-tdd': FlowTddShowcaseWidget,
  'flow-observability': FlowObservabilityShowcaseWidget,
  'flow-planning': FlowPlanningShowcaseWidget,
  'flow-plan-log': FlowPlanLogShowcaseWidget,
  'flow-research': FlowResearchShowcaseWidget,
  'flow-project-docs': FlowProjectDocsShowcaseWidget,
  'flow-project-reference': FlowProjectReferenceShowcaseWidget,
  'flow-prototype': FlowPrototypeShowcaseWidget,
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
