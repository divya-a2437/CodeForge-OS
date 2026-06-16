const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const AI_MODEL = process.env.AI_MODEL ?? 'gpt-4o';

export async function getOpenAiResponse(
  prompt: string,
  systemPrompt = 'You are a helpful AI assistant that supports software delivery workflows.'
) {
  // If the API key is not configured or is a placeholder, use high-quality mockup fallbacks
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY.includes('YOUR_') || OPENROUTER_API_KEY.startsWith('sk-or-v1-placeholder')) {
    console.warn('OPENROUTER_API_KEY is not configured or using placeholder. Falling back to high-quality mock.');
    return getMockResponse(prompt, systemPrompt);
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000'
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 600
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`OpenRouter request failed: ${response.status} ${errorText}. Falling back to mock.`);
      return getMockResponse(prompt, systemPrompt);
    }

    const payload = await response.json();
    return payload?.choices?.[0]?.message?.content?.trim() ?? getMockResponse(prompt, systemPrompt);
  } catch (error) {
    console.warn('Failed to contact OpenRouter API. Falling back to mock. Error:', error);
    return getMockResponse(prompt, systemPrompt);
  }
}

function getMockResponse(prompt: string, systemPrompt: string): string {
  const lowercasePrompt = prompt.toLowerCase();
  
  if (systemPrompt.toLowerCase().includes('product manager') || prompt.toLowerCase().includes('product manager')) {
    return `Product Description: A specialized application designed to address: "${prompt}".
Key Requirements:
1. Operator Workspace Interface: A clean, minimalistic three-column panel.
2. Contextual AI Querying: Real-time queries linked to agent execution outputs.
3. Production Milestones: Multi-phase planning and deployment guidelines.`;
  }

  if (systemPrompt.toLowerCase().includes('architect') || prompt.toLowerCase().includes('architect')) {
    return JSON.stringify({
      frontendPages: ["/landing", "/auth", "/workspace", "/settings"],
      components: ["Header", "Timeline", "ProjectInput", "AgentStream", "ChatAssistant"],
      backendServices: ["AuthService", "WorkflowEngine", "AiChatService", "RoadmapGenerator"],
      databaseTables: ["users", "projects", "messages", "milestones"],
      apiEndpoints: [
        { path: "/api/auth", method: "POST", purpose: "Authenticate user" },
        { path: "/api/workflow", method: "POST", purpose: "Run multi-agent system" },
        { path: "/api/chat", method: "POST", purpose: "Ask follow-up questions" }
      ],
      architectureDecisions: [
        "Use Next.js App Router for layout transitions and server rendering.",
        "Adopt monochrome line-art CSS styling to maximize readability and premium feel.",
        "Implement state-based progressive agent playback to simulate live streaming."
      ]
    }, null, 2);
  }

  if (systemPrompt.toLowerCase().includes('senior software engineer') || prompt.toLowerCase().includes('senior software engineer') || prompt.toLowerCase().includes('engineer')) {
    return JSON.stringify({
      folderStructure: [
        "app/api/workflow/route.ts",
        "src/agents/roles/pm.agent.ts",
        "src/ui/screens/WorkspacePage.tsx",
        "src/ui/components/ChatAssistant.tsx"
      ],
      components: [
        "WorkflowTimeline: renders vertical connecting lines and node status changes",
        "AgentActivityStream: renders live status changes and formatted insights",
        "ChatAssistant: parses agent outputs to answer user questions"
      ],
      apiEndpoints: [
        { path: "/api/workflow", method: "POST", purpose: "Process project and trigger agents" },
        { path: "/api/chat", method: "POST", purpose: "Contextual assistance" }
      ],
      databaseSchema: {
        projects: ["id", "prompt", "status", "createdAt"],
        messages: ["id", "projectId", "agent", "status", "payload"]
      },
      implementationSteps: [
        "Phase 1: Setup minimal border theme and Tailwind configuration.",
        "Phase 2: Redesign pages to centered, clean line-art interface.",
        "Phase 3: Hook up context-aware AI assistant utilizing message state."
      ],
      technicalRisks: [
        "OpenRouter rate limit could cause agent execution to hang.",
        "Responsive columns might get cramped on narrow laptop viewports."
      ]
    }, null, 2);
  }

  if (systemPrompt.toLowerCase().includes('qa') || prompt.toLowerCase().includes('qa')) {
    return JSON.stringify({
      testCases: [
        "Verify logo reveal animation triggers correctly on page mount",
        "Verify auth redirect works upon successful mock login submit",
        "Verify project launch triggers timeline status transitions from pending to completed"
      ],
      edgeCases: [
        "Empty user prompt input on launch button click",
        "API failure fallback when OpenRouter key is unauthorized"
      ],
      securityChecks: [
        "Sanitize prompt input against markdown injection",
        "Prevent API key leakage through Next.js environment configurations"
      ],
      performanceChecks: [
        "Confirm CSS line-art keyframes do not cause frame drops",
        "Optimize bundle size by lazy-loading heavy React components"
      ],
      releaseRecommendation: "Ready. Pass quality criteria after validation of workflow simulation."
    }, null, 2);
  }

  return `Mock output for prompt "${prompt}": All stages successfully completed and validated. Ready for deployment.`;
}
