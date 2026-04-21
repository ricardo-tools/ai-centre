export const enAU = {
  common: {
    home: 'Home',
    projects: 'Projects',
    prototypes: 'Prototypes',
    notes: 'Notes',
    help: 'Help',
  },
  home: {
    title: 'Projects',
    subtitle: (count: number) => `${count} project${count !== 1 ? 's' : ''} — browse prototypes, sorted by last updated.`,
    description: 'Prototype viewer for reviewing and comparing UI iterations across agents and versions.',
    emptyTitle: 'No projects yet',
    emptyDescription: 'Create a project folder in projects/ to get started.',
    prototypesWithBreakdown: (total: number, strict: number, adaptive: number, creative: number) => {
      const parts = [`${total} prototype${total !== 1 ? 's' : ''}`];
      if (strict > 0) parts.push(`${strict}S`);
      if (adaptive > 0) parts.push(`${adaptive}A`);
      if (creative > 0) parts.push(`${creative}C`);
      return parts.join(' \u00b7 ');
    },
    versionRange: (count: number) => {
      if (count === 0) return '';
      if (count === 1) return 'v1 (1 iter)';
      return `v1 \u2192 v${count} (${count} iter)`;
    },
    latestLabel: 'Latest',
    openPins: (count: number) => `${count} open pin${count !== 1 ? 's' : ''}`,
    noPins: 'No open pins',
    createdLabel: 'Created',
    updatedLabel: 'Updated',
  },
  project: {
    prototypesLabel: 'Prototypes',
    prototypesCount: (count: number) => `${count} prototype${count !== 1 ? 's' : ''}, sorted by last updated.`,
    briefTab: 'Brief',
    decisionsTab: 'Decisions',
    createdBy: 'Created by',
    lastUpdated: 'Last updated',
    totalPrototypes: 'Prototypes',
    openPins: 'Open pins',
    iterations: 'Iterations',
    agents: 'Agents',
    versionPrototypes: (count: number) => `${count} prototype${count !== 1 ? 's' : ''}`,
    noPrototypes: 'No prototypes yet',
    pinCount: (count: number) => `${count} pin${count !== 1 ? 's' : ''}`,
  },
  prototype: {
    loading: 'Loading prototype...',
    notFoundTitle: 'Prototype not found',
    notFoundDescription: 'Make sure page.tsx exists in the prototype folder.',
  },
  comments: {
    title: 'Comments',
    empty: 'No comments yet. Be the first to add a note.',
    namePlaceholder: 'Your name',
    textPlaceholder: 'Add a note...',
    delete: 'Delete',
  },
  shell: {
    brandLabel: 'Prototypes',
    backHome: 'Home',
    backProject: 'Project',
  },
  sidebar: {
    versionLabels: {
      v1: 'Base',
      v2: 'Filters',
      v3: 'Merged',
      v4: 'Columns & Actions',
      v5: 'Polish',
    } as Record<string, string>,
  },
  theme: {
    light: 'Light',
    dark: 'Dark',
    night: 'Night',
  },
  identity: {
    promptTitle: 'Who are you?',
    promptSubtitle: 'Enter your name to start reviewing. This is saved locally.',
    namePlaceholder: 'Your full name',
    startReviewing: 'Start reviewing',
    cancel: 'Cancel',
    nameRequired: 'Please enter your name',
  },
  toolbar: {
    shellLabel: 'Shell',
    noShell: 'No shell',
    reviewLabel: 'Review',
  },
  shells: {
    'ezycollect-legacy': 'EzyCollect Legacy',
    'new-workflows': 'New Workflows',
    'simplypaid': 'SimplyPaid',
    'none': 'No shell',
  },
  review: {
    modeLabel: 'Review',
    pinPlaceholder: 'Add your feedback...',
    pinPost: 'Post',
    pinCancel: 'Cancel',
    pinResolve: 'Resolve',
    pinResolved: 'Resolved',
    pinReplies: (count: number) => count === 1 ? '1 reply' : `${count} replies`,
    openPins: (count: number) => count === 1 ? '1 open' : `${count} open`,
    clickToPin: 'Click anywhere to add feedback',
    threadTitle: 'Pin Thread',
    repliesLabel: (count: number) => count === 1 ? '1 reply' : `${count} replies`,
    replyPlaceholder: 'Add a reply...',
    replyPost: 'Post',
    resolvePin: 'Resolve',
    deletePin: 'Delete',
    resolvedBy: (name: string, date: string) => `Resolved by ${name} · ${date}`,
    positionLabel: (x: number, y: number) => `Position: ${x}% × ${y}%`,
    loading: 'Loading...',
    noReplies: 'No replies yet.',
    addFeedback: 'Add feedback',
  },
} as const;

export type TranslationKeys = typeof enAU;
