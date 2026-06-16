import { publishMessage, getLatestMessage } from '@/lib/band';
import { getOpenAiResponse } from '@/lib/ai';
import { ENGINEER_SYSTEM_PROMPT } from '../prompts/systemPrompts';
import type { ProjectRequest, AgentMessage } from '@/types/workflow';

const agentName = 'Engineer' as const;

export async function runEngineerAgent(request: ProjectRequest) {
  const pmMessage = getLatestMessage('Product Manager');
  const architectMessage = getLatestMessage('Architect');

  const context = `
Product Requirements:
${JSON.stringify(pmMessage?.payload, null, 2)}

Architecture Design:
${JSON.stringify(architectMessage?.payload, null, 2)}

Original Project Request:
${request.prompt}
`;

  const aiOutput = await getOpenAiResponse(
    context,
    ENGINEER_SYSTEM_PROMPT
  );

  let payload: any;
  try {
    payload = JSON.parse(aiOutput);
  } catch (e) {
    payload = {
      implementationPlan: aiOutput,
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