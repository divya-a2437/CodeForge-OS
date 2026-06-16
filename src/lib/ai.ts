const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.API_KEY;
const AI_MODEL = process.env.AI_MODEL ?? 'gpt-4o';

export async function getOpenAiResponse(
  prompt: string,
  systemPrompt = 'You are a helpful AI assistant that supports software delivery workflows.'
) {
  // If the API key is not configured or is a placeholder, use high-quality mockup fallbacks
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY.includes('YOUR_') || OPENROUTER_API_KEY.startsWith('sk-or-v1-placeholder')) {
    console.warn('OPENROUTER_API_KEY is not configured or using placeholder. Falling back to high-quality mock.');
    return getMockResponse(prompt, systemPrompt);
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000'
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 600
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`OpenRouter request failed: ${response.status} ${errorText}. Falling back to mock.`);
      return getMockResponse(prompt, systemPrompt);
    }

    const payload = await response.json();
    return payload?.choices?.[0]?.message?.content?.trim() ?? getMockResponse(prompt, systemPrompt);
  } catch (error) {
    console.warn('Failed to contact OpenRouter API. Falling back to mock. Error:', error);
    return getMockResponse(prompt, systemPrompt);
  }
}

function getMockResponse(prompt: string, systemPrompt: string): string {
  const lowercaseSystemPrompt = systemPrompt.toLowerCase();
  
  if (lowercaseSystemPrompt.includes('product manager')) {
    return JSON.stringify({
      projectSummary: "A functional application for " + prompt + ", focusing on core user needs.",
      featureList: ["User dashboard", "Data entry forms", "Search and filter functionality"],
      userStories: [
        "As a user, I want to view my data in a central dashboard.",
        "As a user, I want to add new items via a simple form.",
        "As a user, I want to filter my items to find specific information."
      ],
      functionalRequirements: [
        { requirement: "Data persistence", justification: "Ensures user data is saved between sessions as requested by the nature of the app." },
        { requirement: "Responsive UI", justification: "Required for accessibility across different device types." }
      ],
      nonFunctionalRequirements: ["Basic data validation", "Sub-2s page load time"],
      edgeCases: ["Handling empty data states", "Invalid user input in forms"],
      successCriteria: ["User can successfully add, view, and filter data."]
    }, null, 2);
  }

  if (lowercaseSystemPrompt.includes('architect')) {
    return JSON.stringify({
      systemDesign: "A monolithic web application structure using a modern frontend framework and a relational database for data integrity.",
      recommendedTechStack: {
        frontend: { tool: "React", reason: "Rich ecosystem and efficient state management for this scale of app.", alternative: "Vue.js" },
        backend: { tool: "Node.js (Express)", reason: "JavaScript consistency across the stack and fast development.", alternative: "Python (Flask)" },
        database: { tool: "SQLite", reason: "Lightweight and sufficient for the current data requirements without extra overhead.", alternative: "PostgreSQL" }
      },
      databaseDesign: "Simple relational tables for users and their associated items.",
      apiDesign: "RESTful API endpoints for CRUD operations on data entities.",
      securityConsiderations: "HTTPS encryption and basic session-based authentication.",
      scalabilityDiscussion: "N/A for current scope. Simple vertical scaling will suffice."
    }, null, 2);
  }

  if (lowercaseSystemPrompt.includes('engineer') || lowercaseSystemPrompt.includes('technical lead')) {
    return JSON.stringify({
      implementationRoadmap: ["Initialize project structure", "Setup database and API routes", "Build UI components", "Connect frontend to backend"],
      folderStructure: ["src/components/", "src/pages/", "src/api/", "src/db/"],
      componentBreakdown: ["Dashboard: Main view", "ItemForm: Data entry", "ItemList: Filterable list display"],
      apiImplementationPlan: "Express routes for GET /items, POST /items, and DELETE /items.",
      databaseSchema: {
        tables: [{ name: "items", columns: ["id: INTEGER", "title: TEXT", "description: TEXT", "user_id: INTEGER"] }]
      },
      codeSnippets: [{ "description": "Basic Express route", "code": "app.get('/items', (req, res) => { /* logic */ });" }]
    }, null, 2);
  }

  if (lowercaseSystemPrompt.includes('qa')) {
    return JSON.stringify({
      testCases: [{ scenario: "User adds a valid item", expectedResult: "Item appears in the dashboard list" }],
      edgeCaseTesting: ["Attempting to save an item with no title"],
      acceptanceCriteria: ["All CRUD operations work", "UI is responsive on mobile"],
      securityTesting: "Verification that users can only access their own data.",
      performanceTesting: "Load testing the /items endpoint with 50 concurrent requests."
    }, null, 2);
  }

  if (lowercaseSystemPrompt.includes('release manager')) {
    return JSON.stringify({
      deploymentPlan: "Deploy using a standard cloud provider (e.g., Vercel or Railway) with automated Git integration.",
      launchChecklist: ["Verify environment variables", "Run final database migrations", "Smoke test the live URL"],
      monitoringPlan: "Basic error logging using a service like Sentry.",
      futureEnhancements: ["User profile customization", "Data export to CSV"],
      riskAssessment: "Low risk due to standard tech stack and clear requirements."
    }, null, 2);
  }

  if (lowercaseSystemPrompt.includes('code generator')) {
    // Extract the action requested from the prompt if possible, otherwise use a generic message.
    const actionMatch = prompt.match(/The user has requested the following action: (.*)/);
    const action = actionMatch ? actionMatch[1] : "Code Generation";
    return JSON.stringify({
      generatedAsset: `// Mocked generated asset for: ${action}\n\n// To see real generated assets, please configure a valid OPENROUTER_API_KEY in your .env.local file.\n\nexport function example() {\n  console.log("Hello from mock!");\n}`,
      explanation: "This is a mocked generated output because no valid API key is provided.",
      filesToCreate: ["src/mock/GeneratedFile.ts"]
    }, null, 2);
  }

  return JSON.stringify({ message: "Mock response for: " + prompt }, null, 2);
}
