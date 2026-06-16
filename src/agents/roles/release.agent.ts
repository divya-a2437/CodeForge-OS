import { publishMessage, getLatestMessage } from '@/lib/band';
import { getOpenAiResponse } from '@/lib/ai';
import { RELEASE_MANAGER_SYSTEM_PROMPT } from '../prompts/systemPrompts';
import type { ProjectRequest, AgentMessage } from '@/types/workflow';

const agentName = 'Release Manager' as const;

export async function runReleaseAgent(request: ProjectRequest) {
  const pmOutput = getLatestMessage('Product Manager');
  const architectOutput = getLatestMessage('Architect');
  const engineerOutput = getLatestMessage('Engineer');
  const qaOutput = getLatestMessage('QA');

  const context = `
Product Requirements:
${JSON.stringify(pmOutput?.payload, null, 2)}

Architecture Design:
${JSON.stringify(architectOutput?.payload, null, 2)}

Implementation Plan:
${JSON.stringify(engineerOutput?.payload, null, 2)}

QA Strategy:
${JSON.stringify(qaOutput?.payload, null, 2)}

Original Project Request:
${request.prompt}
`;

  const aiOutput = await getOpenAiResponse(
    context,
    RELEASE_MANAGER_SYSTEM_PROMPT
  );

  let payload: any;
  try {
    payload = JSON.parse(aiOutput);
  } catch (e) {
    payload = {
      executiveSummary: aiOutput,
      error: "AI failed to return valid JSON"
    };
  }

  const message: AgentMessage = {
    projectId: request.projectId,
    agent: agentName,
    status: 'completed',
    timestamp: new Date().toISOString(),
    payload
  };

  await publishMessage(message);
}