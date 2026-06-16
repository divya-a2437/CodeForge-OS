import { NextResponse } from 'next/server';
import { getOpenAiResponse } from '@/lib/ai';
import { CHAT_ASSISTANT_SYSTEM_PROMPT } from '@/agents/prompts/systemPrompts';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, query } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const context = JSON.stringify(messages, null, 2);
    const prompt = `Context of the project synthesis so far:\n${context}\n\nUser Question: ${query}`;

    const response = await getOpenAiResponse(prompt, CHAT_ASSISTANT_SYSTEM_PROMPT);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Failed to process chat request' }, { status: 500 });
  }
}
