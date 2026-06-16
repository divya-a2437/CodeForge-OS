"use client";

import { useState, useRef, useEffect } from 'react';
import type { AgentMessage } from '@/types/workflow';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

function safeParse(val: any) {
  if (!val) return null;
  if (typeof val === 'object') return val;
  try {
    let cleaned = val.trim();
    if (cleaned.startsWith('```json')) cleaned = cleaned.substring(7);
    if (cleaned.endsWith('```')) cleaned = cleaned.substring(0, cleaned.length - 3);
    return JSON.parse(cleaned.trim());
  } catch (e) {
    return null;
  }
}

export function ChatAssistant({ messages = [] }: { messages?: AgentMessage[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'System loaded. I am your technical assistant. You can query any architectural details, database schemas, or API definitions once the synthesis is complete.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleQuestion = async (queryText: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: queryText,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Extract agent insights from props
    const pmMsg = messages.find(m => m.agent === 'Product Manager');
    const archMsg = messages.find(m => m.agent === 'Architect');
    const engMsg = messages.find(m => m.agent === 'Engineer');
    const qaMsg = messages.find(m => m.agent === 'QA');
    const releaseMsg = messages.find(m => m.agent === 'Release Manager');

    const archData = safeParse(archMsg?.payload?.aiAnalysis);
    const engData = safeParse(engMsg?.payload?.aiAnalysis);
    const qaData = safeParse(qaMsg?.payload?.aiAnalysis);

    let answer = "";
    const cleanQuery = queryText.toLowerCase().trim();

    if (messages.length === 0) {
      answer = "Operator, there is no active project synthesis loaded in the current workspace state. Please input a project prompt and trigger the workflow first.";
    } else {
      const projectName = pmMsg?.projectId.replace('codeforge-', '') || 'active project';

      if (cleanQuery.includes('architecture') || cleanQuery.includes('explain the architecture')) {
        const layers = archMsg?.payload?.coreSystems as string[] || ['Frontend layer', 'Backend routing services'];
        const decisions = archData?.architectureDecisions || [
          "Separate frontend render trees from backend orchestration layers.",
          "Adopt a monochrome, CSS-grid-driven user interface for performance."
        ];
        answer = `System Architecture for [${projectName}]:\n\n` +
                 `Core Modules:\n${layers.map((l, i) => `• ${l}`).join('\n')}\n\n` +
                 `Architecture Decisions:\n${decisions.map((d: string, i: number) => `[${i+1}] ${d}`).join('\n')}`;
      } 
      else if (cleanQuery.includes('stack') || cleanQuery.includes('why was this stack selected') || cleanQuery.includes('why this stack')) {
        const stack = archMsg?.payload?.stack as string[] || ['Next.js', 'TypeScript', 'Tailwind CSS'];
        answer = `Selected Technology Stack:\n\n` +
                 `${stack.map(s => `• ${s}`).join('\n')}\n\n` +
                 `Rationale:\nNext.js provides App Router transitions and optimized production bundles. TypeScript enforces clean type safety between API response payloads and layout UI components. Tailwind is loaded to maintain clean styling standards.`;
      } 
      else if (cleanQuery.includes('build first') || cleanQuery.includes('what should i build first')) {
        const steps = engData?.implementationSteps || [
          "Establish project scaffold and Git environment boundaries.",
          "Initialize API routes for agent synthesis and user queries.",
          "Create timeline and stream layouts."
        ];
        answer = `Suggested Implementation Order:\n\n` +
                 `1. Initialize code repositories and environments.\n` +
                 `2. Build the primary backend routes and service structures.\n` +
                 `3. Implement frontend layout interfaces.\n\n` +
                 `Specific Action Steps:\n${steps.map((s: string, i: number) => `${i+1}. ${s}`).join('\n')}`;
      } 
      else if (cleanQuery.includes('schema') || cleanQuery.includes('create database schema')) {
        const schema = engData?.databaseSchema || {
          projects: ['id', 'prompt', 'status', 'createdAt'],
          messages: ['id', 'projectId', 'agent', 'payload']
        };
        
        let schemaStr = "";
        Object.entries(schema).map(([table, cols]: [string, any]) => {
          schemaStr += `CREATE TABLE ${table} (\n` +
                       `  ${cols.map((c: string) => `${c} TEXT`).join(',\n  ')}\n` +
                       `);\n\n`;
        });
        
        answer = `Database Schema (SQL Blueprint):\n\n\`\`\`sql\n${schemaStr}\`\`\``;
      } 
      else if (cleanQuery.includes('api') || cleanQuery.includes('endpoint') || cleanQuery.includes('generate api endpoints')) {
        const endpoints = engData?.apiEndpoints || [
          { path: '/api/projects', method: 'POST', purpose: 'Create project' },
          { path: '/api/workflow', method: 'POST', purpose: 'Trigger workflow' }
        ];
        answer = `API Endpoint Specifications:\n\n` +
                 endpoints.map((ep: any) => `• [${ep.method}] ${ep.path}\n  Purpose: ${ep.purpose}`).join('\n\n');
      } 
      else {
        answer = `I have parsed the synthesis context for project [${projectName}]. I can answer queries relating to:\n` +
                 `• System Architecture\n` +
                 `• Stack Choices\n` +
                 `• Action Roadmap\n` +
                 `• Database Schema\n` +
                 `• API Endpoints\n\n` +
                 `Please use one of the suggested prompts or keywords to view technical code definitions.`;
      }
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: answer,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleQuestion(input);
    setInput('');
  };

  const suggestedQuestions = [
    'Explain the architecture',
    'Why was this stack selected',
    'What should I build first',
    'Create database schema',
    'Generate API endpoints'
  ];

  return (
    <>
      {/* Persistent Chat button */}
      <button
        id="chat-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 w-12 h-12 border flex items-center justify-center transition-all z-40 ${
          isOpen
            ? 'bg-black text-white border-black'
            : 'bg-white text-black border-neutral-300 hover:border-black'
        }`}
      >
        {isOpen ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-8 w-96 max-w-[calc(100vw-2rem)] bg-white border border-neutral-200 shadow-xl flex flex-col h-[520px] z-40 animate-scale-in">
          {/* Header */}
          <div className="border-b border-neutral-100 p-4">
            <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">ASSISTANT LOG CONTEXT</span>
            <h3 className="text-xs font-semibold text-black mt-0.5">Specifications Audit</h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {chatMessages.map(msg => (
              <div
                key={msg.id}
                className={`animate-slide-in ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div
                  className={`inline-block max-w-[85%] px-4 py-2.5 text-xs ${
                    msg.role === 'user'
                      ? 'bg-black text-white'
                      : 'bg-neutral-50 text-black border border-neutral-150'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
                <p className="text-[9px] text-neutral-400 mt-1 font-mono uppercase">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
            {isLoading && (
              <div className="text-left animate-slide-in">
                <div className="inline-block bg-neutral-50 border border-neutral-150 text-black px-4 py-2">
                  <span className="inline-flex gap-1.5 justify-center items-center">
                    <span className="h-1 w-1 rounded-full bg-black animate-ping" style={{ animationDelay: '0ms' }}></span>
                    <span className="h-1 w-1 rounded-full bg-black animate-ping" style={{ animationDelay: '200ms' }}></span>
                    <span className="h-1 w-1 rounded-full bg-black animate-ping" style={{ animationDelay: '400ms' }}></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions */}
          {chatMessages.length === 1 && !isLoading && (
            <div className="border-t border-neutral-100 px-4 py-3 space-y-2">
              <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider block">Suggested Queries</span>
              <div className="space-y-1">
                {suggestedQuestions.map(question => (
                  <button
                    key={question}
                    onClick={() => handleQuestion(question)}
                    className="w-full text-left text-[11px] px-2 py-1.5 border border-neutral-200 bg-white hover:border-black transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSendMessage} className="border-t border-neutral-150 p-4 bg-neutral-50">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask follow-up query..."
                className="flex-1 bg-transparent border-b border-neutral-200 outline-none text-xs px-0 py-1.5 placeholder-neutral-400 text-black"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="text-xs uppercase tracking-wider font-semibold text-black hover:opacity-60 disabled:opacity-40 transition-opacity"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
