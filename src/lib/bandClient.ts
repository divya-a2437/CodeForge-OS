const BANDS_API_URL = process.env.BANDS_API_URL;
const BANDS_API_KEY = process.env.BANDS_API_KEY;

if (!BANDS_API_URL) {
  // band client can be a no-op when not configured
  // callers should guard by checking env var presence
}

export async function createBandRoom(projectId: string) {
  if (!BANDS_API_URL || !BANDS_API_KEY) return undefined;

  const res = await fetch(`${BANDS_API_URL.replace(/\/$/, '')}/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${BANDS_API_KEY}`
    },
    body: JSON.stringify({ name: `project-${projectId}`, projectId })
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to create Band room: ${res.status} ${txt}`);
  }

  const payload = await res.json();
  return payload?.id ?? payload?.roomId ?? undefined;
}

export async function publishToBand(roomId: string, message: unknown, agentId?: string) {
  if (!BANDS_API_URL || !BANDS_API_KEY) return undefined;

  const res = await fetch(`${BANDS_API_URL.replace(/\/$/, '')}/rooms/${roomId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${BANDS_API_KEY}`,
      ...(agentId ? { 'X-Agent-Id': agentId } : {})
    },
    body: JSON.stringify({ payload: message })
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to publish to Band room: ${res.status} ${txt}`);
  }

  return await res.json();
}

export async function fetchBandMessages(roomId: string) {
  if (!BANDS_API_URL || !BANDS_API_KEY) return [];

  const res = await fetch(`${BANDS_API_URL.replace(/\/$/, '')}/rooms/${roomId}/messages`, {
    headers: {
      Authorization: `Bearer ${BANDS_API_KEY}`
    }
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to fetch Band messages: ${res.status} ${txt}`);
  }

  const payload = await res.json();
  return payload?.messages ?? payload ?? [];
}
