const enAU = {
  // Common
  'common.loading': 'Loading...',
  'common.noResults': 'No results found.',

  // App
  'app.name': 'AI Centre',
  'app.description': 'AI-assisted project generation and skill marketplace',

  // Navigation
  'nav.home': 'Home',
  'nav.skills': 'Skills',
  'nav.toolkits': 'Toolkits',
  'nav.generate': 'Generate',
  'nav.gallery': 'Gallery',

  // Theme
  'theme.light': 'Light',
  'theme.night': 'Night',
  'theme.switchTo': 'Switch to {theme} mode',

  // Home page
  'home.title': 'AI Centre',
  'home.subtitle': 'Select a toolkit, choose your skills, describe your idea — download a project ready for Claude Code.',
  'home.browseSkills': 'Browse Skills',
  'home.generateProject': 'Generate Project',
  'home.officialSkills': 'Official Skills ({count})',

  // Skills Library
  'skills.title': 'Skill Library',
  'skills.subtitle': 'Browse and download skills to use with Claude Code.',
  'skills.official': 'Official',
  'skills.view': 'View',

  // Skill Detail
  'skillDetail.backToSkills': 'Back to Skills',
  'skillDetail.download': 'Download SKILL.md',
  'skillDetail.skillInPractice': 'Skill in Practice',
  'skillDetail.viewSkillMd': 'View SKILL.md',
  'skillDetail.sections': 'Sections',
  'skillDetail.codeExamples': 'Code examples',
  'skillDetail.referenceTables': 'Reference tables',
  'skillDetail.version': 'Version',
  'skillDetail.noShowcase': 'Visual showcase not yet available for this skill. Use the "View SKILL.md" tab to see the full specification.',

  // Archetypes (kept for backward compatibility)
  'archetypes.title': 'Archetypes',
  'archetypes.subtitle': 'Pre-configured project templates that suggest the right skills for your use case.',
  'archetypes.suggestedSkills': 'Suggested Skills',
  'archetypes.useThis': 'Use this archetype →',

  // Toolkits
  'toolkits.title': 'Toolkits',
  'toolkits.subtitle': 'Pre-configured skill bundles that give you the right tools for your project type.',

  // Generate
  'generate.title': 'Generate Project',
  'generate.subtitle': 'Select a toolkit, choose skills, describe your idea — get a project ready for Claude Code.',
  'generate.step1': '1. Select Toolkit',
  'generate.step2': '2. Choose Skills',
  'generate.step3': '3. Describe Your Idea',
  'generate.custom': 'Custom',
  'generate.customDescription': 'Pick your own skills',
  'generate.placeholder': 'Describe what you want to build. Claude Code will use this along with the selected skills to guide development...',
  'generate.button': 'Generate & Download ZIP',
  'generate.generating': 'Generating...',
  'generate.includes': 'Your ZIP will include: CLAUDE.md + {count} skill{plural}',
  'generate.includesTemplate': ' + presentation template',

  // Login
  'login.title': 'Sign in to AI Centre',
  'login.emailLabel': 'Work email address',
  'login.emailPlaceholder': 'you@company.com',
  'login.domainHint': 'Use your ezycollect.com.au, ezycollect.io, or sidetrade.com email.',
  'login.sendCode': 'Send Code',
  'login.checkEmail': 'Check your email',
  'login.codeSentTo': 'We sent a verification code to',
  'login.verify': 'Verify',
  'login.resend': 'Resend code',
  'login.resendIn': 'Resend in {seconds}s',
  'login.invalidDomain': 'Please use your work email (ezycollect or sidetrade).',
  'login.invalidCode': 'Invalid code. {remaining} attempts remaining.',
  'login.expired': 'Code expired. Please request a new one.',
  'login.tooManyAttempts': 'Too many attempts. Please request a new code.',
  'login.signOut': 'Sign out',
} as const;

export default enAU;

export type TranslationKey = keyof typeof enAU;
