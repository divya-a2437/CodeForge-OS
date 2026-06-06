export function buildRequirements(prompt: string) {
  return {
    summary: `Translate the request into clear product requirements for: ${prompt}`,
    highlights: [
      'Deliver a functional application with a polished UI',
      'Support core workflows for the requested product',
      'Provide a reliable release-ready plan'
    ]
  };
}

export function buildUserStories(prompt: string) {
  return [
    `As a user, I want to use ${prompt.toLowerCase()} so I can manage my tasks efficiently.`,
    'As an administrator, I want to review progress and status in a dashboard layout.',
    'As a team member, I want clear reusable APIs so development can be efficient.'
  ];
}

export function buildArchitecture(prompt: string) {
  return {
    coreSystems: ['Frontend dashboard', 'Backend API layer', 'Data storage and persistence', 'QA and release validation'],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'REST API'],
    designPrinciples: ['modular components', 'clean separation of concerns', 'enterprise-grade reliability']
  };
}

export function buildImplementation(prompt: string) {
  return {
    apiEndpoints: [
      { path: '/api/projects', method: 'POST', purpose: 'Create a new project' },
      { path: '/api/workflow', method: 'POST', purpose: 'Trigger the end-to-end Band workflow' }
    ],
    databaseSchema: {
      projects: ['id', 'name', 'description', 'createdAt', 'status'],
      agents: ['id', 'name', 'status', 'lastMessage']
    }
  };
}

export function buildQaReport(prompt: string) {
  return {
    reviewNotes: `Review key deliverables for ${prompt}. Confirm the API contract, architecture decisions, and user experience flow.`,
    issues: ['Validate endpoint structure', 'Confirm progress feedback in UI', 'Review message payload consistency']
  };
}
