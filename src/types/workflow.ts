export type AgentName =
  | 'Product Manager'
  | 'Architect'
  | 'Engineer'
  | 'QA'
  | 'Release Manager';

export type AgentStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface AgentMessage {
  projectId: string;
  agent: AgentName;
  status: AgentStatus;
  timestamp: string;
  payload: Record<string, unknown>;
}

export interface ProjectRequest {
  prompt: string;
  projectId: string;
  createdAt: string;
}

export interface AgentResult {
  agent: AgentName;
  status: AgentStatus;
  message: string;
  details: Record<string, unknown>;
}
