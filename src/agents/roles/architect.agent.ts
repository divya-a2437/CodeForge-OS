import { publishMessage, getLatestMessage } from '@/lib/band';
import { getOpenAiResponse } from '@/lib/ai';
import { buildArchitecture } from '../prompts/prompts';
import type { ProjectRequest, AgentMessage } from '@/types/workflow';

const agentName = 'Architect' as const;

export async function runArchitectAgent(request: ProjectRequest) {
  const pmMessage = getLatestMessage('Product Manager');

  const requirements = pmMessage?.payload?.requirements;
  const requirementsText = requirements ? JSON.stringify(requirements, null, 2) : 'No requirements available yet.';

  const aiAnalysis = await getOpenAiResponse(
    `You are a software architect. Review these requirements:\n${requirementsText}\n\nProject prompt:\n${request.prompt}\n\nReturn ONLY valid JSON.

You are a software architect.

Requirements:
${requirementsText}

Project:
${request.prompt}

Generate:

{
  "frontendPages": [],
  "components": [],
  "backendServices": [],
  "databaseTables": [],
  "apiEndpoints": [],
  "architectureDecisions": []
}

Return valid JSON only.`
  );

  const payload = {
    ...buildArchitecture(request.prompt),
    derivedFromRequirements: requirements,
    aiAnalysis
  };

  const message: AgentMessage = {
    projectId: request.projectId,
    agent: agentName,
    status: 'completed',
    timestamp: new Date().toISOString(),
    payload
  };

  await publishMessage(message);
}