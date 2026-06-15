import { NextResponse } from 'next/server';
import { runWorkflow } from '@/lib/workflow';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body?.prompt || typeof body.prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
    }

    const messages = await runWorkflow(body.prompt);
    return NextResponse.json({ messages });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Workflow error:', message);
    return NextResponse.json({ error: 'Unable to execute workflow', details: message }, { status: 500 });
  }
}
