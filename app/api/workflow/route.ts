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
    return NextResponse.json({ error: 'Unable to execute workflow' }, { status: 500 });
  }
}
