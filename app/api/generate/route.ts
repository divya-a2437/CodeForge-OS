import { NextResponse } from 'next/server';
import { getOpenAiResponse } from '@/lib/ai';
import { CODE_GENERATOR_SYSTEM_PROMPT } from '@/agents/prompts/systemPrompts';
import { AgentMessage } from '@/types/workflow';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, messages } = body;

    if (!action || !messages) {
      return NextResponse.json({ error: 'Action and messages are required' }, { status: 400 });
    }

    const context = JSON.stringify(messages, null, 2);
    const prompt = `Context of the project synthesis so far:\n${context}\n\nThe user has requested the following action: ${action}\nPlease generate the appropriate assets.`;

    const responseText = await getOpenAiResponse(prompt, CODE_GENERATOR_SYSTEM_PROMPT);
    
    let payload = {};
    try {
      // Find the first { and last } to extract JSON in case there's markdown wrapper
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        payload = JSON.parse(responseText.slice(jsonStart, jsonEnd + 1));
      } else {
        payload = JSON.parse(responseText);
      }
    } catch (e) {
      payload = { generatedAsset: responseText, explanation: "Failed to parse structured JSON. Here is the raw output." };
    }

    const message: AgentMessage = {
      projectId: messages[0]?.projectId || 'unknown',
      agent: 'Code Generator',
      status: 'completed',
      timestamp: new Date().toISOString(),
      payload
    };

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json({ error: 'Failed to process generation request' }, { status: 500 });
  }
}
