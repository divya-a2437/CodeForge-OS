const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
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
      max_tokens: 2000
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
      projectSummary: `A comprehensive development plan for "${prompt}". This application focuses on delivering a high-quality user experience with robust core features and scalable foundations.`,
      featureList: [
      "User Authentication & Profile Management: Secure login, signup, and profile customization.",
      "Interactive Dashboard: Real-time data visualization and activity overview.",
      "Resource Management: Comprehensive CRUD operations for core project entities.",
      "Search & Discovery: Advanced filtering and full-text search capabilities.",
      "Notification System: Real-time alerts for key system events."
      ],
      userStories: [
      "As a registered user, I want to securely log in so that I can access my personalized dashboard and saved data.",
      "As a manager, I want to create and assign tasks to my team members so that we can track project progress effectively.",
      "As a developer, I want to see detailed error logs so that I can quickly debug and resolve system issues.",
      "As a user, I want to filter my search results by date and category so that I can find exactly what I'm looking for faster."
      ],
      functionalRequirements: [
      { requirement: "Secure Data Persistence", justification: "Critical for maintaining user state and historical data across sessions." },
      { requirement: "Real-time Updates", justification: "Ensures the dashboard reflects the latest system changes without manual refreshes." },
      { requirement: "Role-Based Access Control", justification: "Necessary to protect sensitive data and ensure users only see what they are authorized to see." }
      ],
      nonFunctionalRequirements: [
      "Performance: Page load times under 1.5 seconds for optimal user retention.",
      "Reliability: 99.9% uptime for core services.",
      "Scalability: Support for up to 10,000 concurrent users with minimal latency.",
      "Security: TLS 1.3 encryption for all data in transit."
      ],
      edgeCases: [
      "Handling network connectivity loss during data submission.",
      "Managing concurrent edits to the same resource by different users.",
      "Handling extremely large data sets in the search interface."
      ],
      successCriteria: [
      "100% completion of core functional requirements.",
      "Positive user feedback during beta testing phases.",
      "Zero critical security vulnerabilities identified in audits."
      ]
      }, null, 2);
      }

      if (lowercaseSystemPrompt.includes('architect')) {
      return JSON.stringify({
      systemDesign: "The system follows a modern microservices-inspired architecture, emphasizing decoupling and scalability. It utilizes a Next.js frontend for server-side rendering and a robust Node.js/Express backend for business logic.",
      recommendedTechStack: {
      frontend: { 
        tool: "Next.js (App Router) + Tailwind CSS", 
        reason: "Provides excellent SEO, fast initial load times, and a highly maintainable styling system.", 
        alternative: "Vite + React" 
      },
      backend: { 
        tool: "Node.js with TypeScript & Prisma", 
        reason: "Offers type safety across the stack and a powerful ORM for efficient database interactions.", 
        alternative: "NestJS" 
      },
      database: { 
        tool: "PostgreSQL", 
        reason: "A reliable relational database with advanced features like JSONB for flexible data storage where needed.", 
        alternative: "MongoDB" 
      }
      },
      databaseDesign: "The database schema will include tables for 'Users', 'Profiles', 'Projects', and 'Tasks'. Relationships will be established using foreign keys, with appropriate indexing for optimized query performance.",
      apiDesign: "A RESTful API architecture using standard HTTP methods. Versioning (e.g., /api/v1) will be implemented to ensure backward compatibility as the system evolves.",
      securityConsiderations: "Implementation of JWT-based authentication, CSRF protection, and thorough input sanitization to prevent common web vulnerabilities.",
      scalabilityDiscussion: "The architecture supports horizontal scaling of the backend services and utilizes a CDN for static asset delivery to handle increased global traffic."
      }, null, 2);
      }

      if (lowercaseSystemPrompt.includes('engineer')) {
      return JSON.stringify({
      implementationRoadmap: [
      "Phase 1: Environment setup and database schema initialization with Prisma.",
      "Phase 2: Core API development for authentication and project management.",
      "Phase 3: Frontend development focusing on the dashboard and resource lists.",
      "Phase 4: Integration testing and final performance optimizations."
      ],
      folderStructure: [
      "src/app/(auth)/login/page.tsx",
      "src/app/(dashboard)/layout.tsx",
      "src/components/ui/button.tsx",
      "src/lib/prisma.ts",
      "src/services/api/taskService.ts"
      ],
      componentBreakdown: [
      "DashboardLayout: Manages sidebars and overall page structure.",
      "DataTable: A reusable component for displaying and filtering project data.",
      "TaskForm: A complex form with validation for task creation and editing."
      ],
      apiImplementationPlan: "Implement standard CRUD endpoints for tasks at /api/tasks. Use middleware for JWT verification and rate limiting.",
      databaseSchema: {
      tables: [
        { name: "User", columns: ["id: UUID (PK)", "email: String (Unique)", "password: Hash", "createdAt: DateTime"] },
        { name: "Task", columns: ["id: UUID (PK)", "title: String", "status: Enum", "userId: UUID (FK)", "projectId: UUID (FK)"] }
      ]
      },
      codeSnippets: [
      { 
        description: "Prisma Schema for Task", 
        code: "model Task {\n  id        String   @id @default(uuid())\n  title     String\n  status    String   @default(\"PENDING\")\n  userId    String\n  user      User     @relation(fields: [userId], references: [id])\n  createdAt DateTime @default(now())\n}" 
      },
      {
        description: "API Route for fetching tasks",
        code: "export async function GET() {\n  const tasks = await prisma.task.findMany();\n  return NextResponse.json(tasks);\n}"
      }
      ]
      }, null, 2);
      }

      if (lowercaseSystemPrompt.includes('qa')) {
      return JSON.stringify({
      testCases: [
      { scenario: "Successful user login with valid credentials", expectedResult: "User is redirected to the dashboard with a valid session token." },
      { scenario: "Prevent task creation with an empty title", expectedResult: "System displays a validation error message and does not submit the form." },
      { scenario: "Verify role-based access to admin settings", expectedResult: "Regular users receive a 403 Forbidden error when accessing /admin." }
      ],
      edgeCaseTesting: [
      "Rapidly clicking the 'Submit' button multiple times during task creation.",
      "Uploading an extremely large file (over 100MB) to the document manager.",
      "Accessing the application with a highly unstable internet connection."
      ],
      acceptanceCriteria: [
      "User can create, edit, and delete tasks seamlessly.",
      "All API responses return in under 300ms.",
      "The UI is fully responsive on devices down to 320px width."
      ],
      securityTesting: "Automated vulnerability scanning with OWASP ZAP and manual penetration testing for SQL injection.",
      performanceTesting: "Load testing with k6 to simulate 500 concurrent users performing typical dashboard operations."
      }, null, 2);
      }

      if (lowercaseSystemPrompt.includes('release manager')) {
      return JSON.stringify({
      deploymentPlan: "Deployment to Vercel for the frontend and AWS App Runner for the backend. A CI/CD pipeline using GitHub Actions will automate testing and deployment.",
      launchChecklist: [
      "Configure production environment variables.",
      "Run database migration scripts on the production instance.",
      "Perform a final smoke test of the entire user flow on the live environment."
      ],
      monitoringPlan: "Use Sentry for error tracking and Datadog for system performance monitoring and log aggregation.",
      futureEnhancements: [
      "Integration with third-party tools like Slack and Jira.",
      "Implementation of a mobile-native application using React Native.",
      "Advanced AI-driven task recommendations for users."
      ],
      riskAssessment: "Potential bottleneck in the database during high-traffic periods; mitigated by planned read-replica implementation."
      }, null, 2);
      }

      return JSON.stringify({ message: "Mock response for: " + prompt }, null, 2);
      }
