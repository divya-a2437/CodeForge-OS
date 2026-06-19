import { NextResponse } from 'next/server';
import { runWorkflow } from '@/lib/workflow';
import { getMockResponse } from '@/lib/ai';
import {
  ARCHITECT_SYSTEM_PROMPT,
  ENGINEER_SYSTEM_PROMPT,
  PM_SYSTEM_PROMPT,
  QA_SYSTEM_PROMPT,
  RELEASE_MANAGER_SYSTEM_PROMPT
} from '@/agents/prompts/systemPrompts';
import type { AgentMessage, AgentName } from '@/types/workflow';

export async function POST(request: Request) {
  let prompt = 'Build a Student Task Manager';

  try {
    const body = await request.json();

    if (!body?.prompt || typeof body.prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
    }

    prompt = body.prompt;
    const messages = await runWorkflow(prompt);
    return NextResponse.json({ messages: ensureCompleteWorkflowMessages(messages, prompt) });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Workflow error:', message);
    return NextResponse.json({
      messages: buildMockWorkflowMessages(prompt),
      fallback: true,
      details: message
    });
  }
}

function buildMockWorkflowMessages(prompt: string): AgentMessage[] {
  const projectId = `codeforge-mock-${Date.now()}`;
  const specs: Array<{ agent: AgentName; systemPrompt: string }> = [
    { agent: 'Product Manager', systemPrompt: PM_SYSTEM_PROMPT },
    { agent: 'Architect', systemPrompt: ARCHITECT_SYSTEM_PROMPT },
    { agent: 'Engineer', systemPrompt: ENGINEER_SYSTEM_PROMPT },
    { agent: 'QA', systemPrompt: QA_SYSTEM_PROMPT },
    { agent: 'Release Manager', systemPrompt: RELEASE_MANAGER_SYSTEM_PROMPT }
  ];

  return specs.map(({ agent, systemPrompt }) => ({
    projectId,
    agent,
    status: 'completed',
    timestamp: new Date().toISOString(),
    payload: JSON.parse(getMockResponse(prompt, systemPrompt))
  }));
}

function ensureCompleteWorkflowMessages(messages: AgentMessage[], prompt: string): AgentMessage[] {
  const fallbackMessages = buildMockWorkflowMessages(prompt);
  const byAgent = new Map<AgentName, AgentMessage>();

  [...fallbackMessages, ...messages].forEach((message) => {
    byAgent.set(message.agent, message);
  });

  return fallbackMessages.map((fallback) => byAgent.get(fallback.agent) ?? fallback);
}
