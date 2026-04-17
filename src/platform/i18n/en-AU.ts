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
  'nav.gallery': 'Gallery',

  // Theme
  'theme.light': 'Light',
  'theme.night': 'Night',
  'theme.switchTo': 'Switch to {theme} mode',

  // Home page
  'home.title': 'AI Centre',
  'home.subtitle': 'The AI skill library for every team.',
  'home.browseSkills': 'Browse Skills',
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
