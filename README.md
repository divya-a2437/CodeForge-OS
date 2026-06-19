# CodeForge OS

CodeForge OS is a Next.js prototype for simulating a five-agent software delivery workflow. A user enters a project brief, then the workspace displays structured outputs from:

- Product Manager
- Architect
- Engineer
- QA
- Release Manager

The prototype is currently optimized for mock data so it remains usable even when the API key is missing, invalid, or unreliable.

## Features

- Multi-agent workflow view with progressive agent output cards.
- Mock fallback data for all five agents.
- Action Center buttons for generating prototype assets:
  - Frontend
  - Backend
  - Database Schema
  - API Endpoints
  - Deployment Plan
- Next Steps section with five expandable panels.
- Persistent chat assistant UI for follow-up questions.
- Developer console for workflow logs.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- OpenRouter-compatible AI API integration with mock fallback

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the workspace:

```text
http://localhost:3000/workspace
```

## Environment Variables

Mock data is enabled by default. This is intentional for prototype demos.

To keep using mock data, no API key is required.

To use a real AI provider, create `.env.local` and set:

```bash
OPENROUTER_API_KEY=your_openrouter_key
AI_MODEL=gpt-4o
USE_MOCK_DATA=false
```

If `USE_MOCK_DATA` is not set, the app uses mock data. If the real API request fails, the app falls back to mock data.

## Project Structure

```text
app/
  api/
    workflow/route.ts    Workflow endpoint for the five-agent run
    generate/route.ts    Action Center generation endpoint
  workspace/page.tsx     Workspace route

src/
  agents/
    prompts/             Agent system prompts
    roles/               Agent execution wrappers
  lib/
    ai.ts                AI client and mock response generator
    workflow.ts          Agent orchestration entry point
  ui/
    components/          Agent cards, timeline, next steps, chat
    screens/             Workspace and landing screens
  types/
    workflow.ts          Shared workflow types
```

## Mock Workflow Behavior

The mock workflow returns complete structured data for every required agent:

- Product Manager: project summary, features, user stories, requirements, success criteria
- Architect: system design, tech stack, database design, API design, security, scalability
- Engineer: implementation roadmap, folder structure, components, API plan, schema, code snippets
- QA: test cases, edge cases, acceptance criteria, security testing, performance testing
- Release Manager: deployment plan, launch checklist, monitoring plan, future enhancements, risk assessment

The workflow API also fills in any missing agent output with mock data, so the UI can always display a complete prototype run.

## Useful Commands

Run type checking:

```bash
npx tsc --noEmit
```

Build for production:

```bash
npm run build
```

Start production server after build:

```bash
npm run start
```

## Notes

- The app is a prototype and does not currently write generated files to disk from the Action Center.
- Action Center responses are displayed as generated assets inside the workspace.
- If an action is not implemented in mock mode, it should return an `Upcoming` message rather than silently failing.
