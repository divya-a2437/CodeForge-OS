import { publishMessage, getLatestMessage } from '@/lib/band';
import { getOpenAiResponse } from '@/lib/ai';
import { buildImplementation } from '../prompts/prompts';
import type { ProjectRequest, AgentMessage } from '@/types/workflow';

const agentName = 'Engineer' as const;

export async function runEngineerAgent(request: ProjectRequest) {
  const architectMessage = getLatestMessage('Architect');

  const architecture = architectMessage?.payload;
  const architectureText = architecture ? JSON.stringify(architecture, null, 2) : 'No architectural details available yet.';

  const aiAnalysis = await getOpenAiResponse(
    `YReturn ONLY valid JSON.

You are a senior software engineer.

Using the architecture below:

${architectureText}

Project:
${request.prompt}

Generate:

{
  "folderStructure": [],
  "components": [],
  "apiEndpoints": [],
  "databaseSchema": {},
  "implementationSteps": [],
  "technicalRisks": []
}

Return valid JSON only.`
  );

  const payload = {
    implementationPlan: `Implement the platform using a component-driven Next.js app powered by a structured workflow API for ${request.prompt}.`,
    architectureReference: architecture,
    ...buildImplementation(request.prompt),
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