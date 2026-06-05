import type { AgentMessage, AgentName } from "@/types/workflow";

const roomMessages: AgentMessage[] = [];

export function publishMessage(message: AgentMessage) {
  roomMessages.push(message);
}

export function getMessages() {
  return [...roomMessages];
}

export function getLatestMessage(agent: AgentName) {
  const filtered = roomMessages.filter(
    (msg) => msg.agent === agent
  );

  return filtered[filtered.length - 1];
}

export function resetMessages() {
  roomMessages.length = 0;
}