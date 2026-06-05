import { resetMessages, getMessages } from '@/lib/band';
import { runPmAgent } from '@/agents/pmAgentImpl';
import { runArchitectAgent } from '@/agents/architectAgent';
import { runEngineerAgent } from '@/agents/engineerAgent';
import { runQaAgent } from '@/agents/qaAgent';
import { runReleaseAgent } from '@/agents/releaseAgent';
import type { ProjectRequest } from '@/types/workflow';

export async function runWorkflow(prompt: string) {
  resetMessages();

  const projectRequest: ProjectRequest = {
    prompt,
    projectId: `codeforge-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  await runPmAgent(projectRequest);
  await runArchitectAgent(projectRequest);
  await runEngineerAgent(projectRequest);
  await runQaAgent(projectRequest);
  await runReleaseAgent(projectRequest);

  return getMessages();
}
