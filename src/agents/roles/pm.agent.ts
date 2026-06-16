import { publishMessage } from '@/lib/band';
import { getOpenAiResponse } from '@/lib/ai';
import { PM_SYSTEM_PROMPT } from '../prompts/systemPrompts';
import type { ProjectRequest, AgentMessage } from '@/types/workflow';

const agentName = 'Product Manager' as const;

export async function runPmAgent(request: ProjectRequest) {
  const aiOutput = await getOpenAiResponse(
    `Project request: ${request.prompt}`,
    PM_SYSTEM_PROMPT
  );

  let payload: any;
  try {
    payload = JSON.parse(aiOutput);
  } catch (e) {
    // Fallback if AI doesn't return valid JSON
    payload = {
      projectSummary: aiOutput,
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
