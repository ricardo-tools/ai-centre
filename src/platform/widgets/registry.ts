'use client';

// ── Platform shell widgets ───────────────────────────────────────────
import { TopNavWidget } from '@/platform/shell/TopNavWidget';
import { ThemeSwitcherWidget } from '@/platform/shell/ThemeSwitcherWidget';

// ── Feature: skill-library ───────────────────────────────────────────
import { SkillCardWidget } from '@/features/skill-library/widgets/SkillCardWidget/SkillCardWidget';
import { SkillListWidget } from '@/features/skill-library/widgets/SkillListWidget/SkillListWidget';

// ── Feature: skill-detail (original 8) ───────────────────────────────
import { SkillDetailWidget } from '@/features/skill-detail/widgets/SkillDetailWidget/SkillDetailWidget';
import BrandDesignShowcaseWidget from '@/features/skill-detail/widgets/BrandDesignShowcaseWidget/BrandDesignShowcaseWidget';
import AppLayoutShowcaseWidget from '@/features/skill-detail/widgets/AppLayoutShowcaseWidget/AppLayoutShowcaseWidget';
import FrontendArchitectureShowcaseWidget from '@/features/skill-detail/widgets/FrontendArchitectureShowcaseWidget/FrontendArchitectureShowcaseWidget';
import DesignFoundationsShowcaseWidget from '@/features/skill-detail/widgets/DesignFoundationsShowcaseWidget/DesignFoundationsShowcaseWidget';
import PresentationShowcaseWidget from '@/features/skill-detail/widgets/PresentationShowcaseWidget/PresentationShowcaseWidget';
import PrintDesignShowcaseWidget from '@/features/skill-detail/widgets/PrintDesignShowcaseWidget/PrintDesignShowcaseWidget';
import PptxExportShowcaseWidget from '@/features/skill-detail/widgets/PptxExportShowcaseWidget/PptxExportShowcaseWidget';
import CreativeToolkitShowcaseWidget from '@/features/skill-detail/widgets/CreativeToolkitShowcaseWidget/CreativeToolkitShowcaseWidget';

// ── Feature: skill-detail (new 28 showcases) ─────────────────────────
import AccessibilityShowcaseWidget from '@/features/skill-detail/widgets/AccessibilityShowcaseWidget/AccessibilityShowcaseWidget';
import AiMediaGenerationShowcaseWidget from '@/features/skill-detail/widgets/AiMediaGenerationShowcaseWidget/AiMediaGenerationShowcaseWidget';
import AppLayoutPatternsReferenceShowcaseWidget from '@/features/skill-detail/widgets/AppLayoutPatternsReferenceShowcaseWidget/AppLayoutPatternsReferenceShowcaseWidget';
import BackendPatternsShowcaseWidget from '@/features/skill-detail/widgets/BackendPatternsShowcaseWidget/BackendPatternsShowcaseWidget';
import BrandTokensReferenceShowcaseWidget from '@/features/skill-detail/widgets/BrandTokensReferenceShowcaseWidget/BrandTokensReferenceShowcaseWidget';
import ClaudeApiShowcaseWidget from '@/features/skill-detail/widgets/ClaudeApiShowcaseWidget/ClaudeApiShowcaseWidget';
import CleanArchitectureShowcaseWidget from '@/features/skill-detail/widgets/CleanArchitectureShowcaseWidget/CleanArchitectureShowcaseWidget';
import CodingStandardsShowcaseWidget from '@/features/skill-detail/widgets/CodingStandardsShowcaseWidget/CodingStandardsShowcaseWidget';
import ContentDesignShowcaseWidget from '@/features/skill-detail/widgets/ContentDesignShowcaseWidget/ContentDesignShowcaseWidget';
import CreativeToolkitChartsReferenceShowcaseWidget from '@/features/skill-detail/widgets/CreativeToolkitChartsReferenceShowcaseWidget/CreativeToolkitChartsReferenceShowcaseWidget';
import DocumentationResearchShowcaseWidget from '@/features/skill-detail/widgets/DocumentationResearchShowcaseWidget/DocumentationResearchShowcaseWidget';
import EvalDrivenDevelopmentShowcaseWidget from '@/features/skill-detail/widgets/EvalDrivenDevelopmentShowcaseWidget/EvalDrivenDevelopmentShowcaseWidget';
import InteractionMotionShowcaseWidget from '@/features/skill-detail/widgets/InteractionMotionShowcaseWidget/InteractionMotionShowcaseWidget';
import McpServerPatternsShowcaseWidget from '@/features/skill-detail/widgets/McpServerPatternsShowcaseWidget/McpServerPatternsShowcaseWidget';
import NextjsAppRouterTurbopackShowcaseWidget from '@/features/skill-detail/widgets/NextjsAppRouterTurbopackShowcaseWidget/NextjsAppRouterTurbopackShowcaseWidget';
import ObservabilityShowcaseWidget from '@/features/skill-detail/widgets/ObservabilityShowcaseWidget/ObservabilityShowcaseWidget';
import PlaywrightE2eShowcaseWidget from '@/features/skill-detail/widgets/PlaywrightE2eShowcaseWidget/PlaywrightE2eShowcaseWidget';
import PresentationHtmlImplementationShowcaseWidget from '@/features/skill-detail/widgets/PresentationHtmlImplementationShowcaseWidget/PresentationHtmlImplementationShowcaseWidget';
import QualityAssuranceShowcaseWidget from '@/features/skill-detail/widgets/QualityAssuranceShowcaseWidget/QualityAssuranceShowcaseWidget';
import ResponsivenessShowcaseWidget from '@/features/skill-detail/widgets/ResponsivenessShowcaseWidget/ResponsivenessShowcaseWidget';
import SecurityReviewShowcaseWidget from '@/features/skill-detail/widgets/SecurityReviewShowcaseWidget/SecurityReviewShowcaseWidget';
import SkillCreationShowcaseWidget from '@/features/skill-detail/widgets/SkillCreationShowcaseWidget/SkillCreationShowcaseWidget';
import SkillReviewShowcaseWidget from '@/features/skill-detail/widgets/SkillReviewShowcaseWidget/SkillReviewShowcaseWidget';
import StrategicContextShowcaseWidget from '@/features/skill-detail/widgets/StrategicContextShowcaseWidget/StrategicContextShowcaseWidget';
import TestingStrategyShowcaseWidget from '@/features/skill-detail/widgets/TestingStrategyShowcaseWidget/TestingStrategyShowcaseWidget';
import UserExperienceShowcaseWidget from '@/features/skill-detail/widgets/UserExperienceShowcaseWidget/UserExperienceShowcaseWidget';
import WebPerformanceShowcaseWidget from '@/features/skill-detail/widgets/WebPerformanceShowcaseWidget/WebPerformanceShowcaseWidget';

// ── Feature: archetypes ──────────────────────────────────────────────
import { ArchetypeCardWidget } from '@/features/archetypes/widgets/ArchetypeCardWidget/ArchetypeCardWidget';

// ── Feature: generate-project ────────────────────────────────────────
import { ProjectGeneratorWidget } from '@/features/generate-project/widgets/ProjectGeneratorWidget/ProjectGeneratorWidget';
import { CompositionWizardWidget } from '@/features/generate-project/widgets/CompositionWizardWidget/CompositionWizardWidget';

// ── Feature: auth ────────────────────────────────────────────────────
import { LoginWidget } from '@/features/auth/widgets/LoginWidget/LoginWidget';
import { OAuthConsentWidget } from '@/features/auth/widgets/OAuthConsentWidget/OAuthConsentWidget';

// ── Feature: user-management ────────────────────────────────────────
import { UserListWidget } from '@/features/user-management/widgets/UserListWidget/UserListWidget';

// ── Feature: audit-log ──────────────────────────────────────────────
import { AuditLogWidget } from '@/features/audit-log/widgets/AuditLogWidget/AuditLogWidget';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const widgetRegistry: Record<string, React.ComponentType<any>> = {
  'skill-card': SkillCardWidget,
  'skill-list': SkillListWidget,
  'skill-detail': SkillDetailWidget,
  'archetype-card': ArchetypeCardWidget,
  'project-generator': ProjectGeneratorWidget,
  'composition-wizard': CompositionWizardWidget,
  'top-nav': TopNavWidget,
  'theme-switcher': ThemeSwitcherWidget,
  'login': LoginWidget,
  'oauth-consent': OAuthConsentWidget,
  'user-list': UserListWidget,
  'audit-log': AuditLogWidget,
  // Original 8 showcases
  'brand-design-showcase': BrandDesignShowcaseWidget,
  'app-layout-showcase': AppLayoutShowcaseWidget,
  'frontend-architecture-showcase': FrontendArchitectureShowcaseWidget,
  'design-foundations-showcase': DesignFoundationsShowcaseWidget,
  'presentation-showcase': PresentationShowcaseWidget,
  'print-design-showcase': PrintDesignShowcaseWidget,
  'pptx-export-showcase': PptxExportShowcaseWidget,
  'creative-toolkit-showcase': CreativeToolkitShowcaseWidget,
  // New 28 showcases
  'accessibility-showcase': AccessibilityShowcaseWidget,
  'ai-media-generation-showcase': AiMediaGenerationShowcaseWidget,
  'app-layout-patterns-reference-showcase': AppLayoutPatternsReferenceShowcaseWidget,
  'backend-patterns-showcase': BackendPatternsShowcaseWidget,
  'brand-tokens-reference-showcase': BrandTokensReferenceShowcaseWidget,
  'claude-api-showcase': ClaudeApiShowcaseWidget,
  'clean-architecture-showcase': CleanArchitectureShowcaseWidget,
  'coding-standards-showcase': CodingStandardsShowcaseWidget,
  'content-design-showcase': ContentDesignShowcaseWidget,
  'creative-toolkit-charts-reference-showcase': CreativeToolkitChartsReferenceShowcaseWidget,
  'documentation-research-showcase': DocumentationResearchShowcaseWidget,
  'eval-driven-development-showcase': EvalDrivenDevelopmentShowcaseWidget,
  'interaction-motion-showcase': InteractionMotionShowcaseWidget,
  'mcp-server-patterns-showcase': McpServerPatternsShowcaseWidget,
  'nextjs-app-router-turbopack-showcase': NextjsAppRouterTurbopackShowcaseWidget,
  'observability-showcase': ObservabilityShowcaseWidget,
  'playwright-e2e-showcase': PlaywrightE2eShowcaseWidget,
  'presentation-html-showcase': PresentationHtmlImplementationShowcaseWidget,
  'quality-assurance-showcase': QualityAssuranceShowcaseWidget,
  'responsiveness-showcase': ResponsivenessShowcaseWidget,
  'security-review-showcase': SecurityReviewShowcaseWidget,
  'skill-creation-showcase': SkillCreationShowcaseWidget,
  'skill-review-showcase': SkillReviewShowcaseWidget,
  'strategic-context-showcase': StrategicContextShowcaseWidget,
  'testing-strategy-showcase': TestingStrategyShowcaseWidget,
  'user-experience-showcase': UserExperienceShowcaseWidget,
  'web-performance-showcase': WebPerformanceShowcaseWidget,
};
