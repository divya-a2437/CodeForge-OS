"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

function ScrollRevealNode({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add a tiny delay for sequence
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${isVisible ? 'scroll-revealed' : 'scroll-hidden'} ${className}`}
    >
      {children}
    </div>
  );
}

export function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] text-black font-sans relative overflow-x-hidden selection:bg-black/5 selection:text-black grid-bg">
      {/* Subtle floating lines in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
        <svg className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%]" viewBox="0 0 1440 900" fill="none">
          {/* Wave 1 */}
          <path 
            d="M -100,300 C 300,100 800,600 1600,200" 
            stroke="rgba(0,0,0,0.06)" 
            strokeWidth="0.75" 
            className="line-flow-animation" 
          />
          {/* Wave 2 */}
          <path 
            d="M -50,450 C 400,650 900,150 1500,550" 
            stroke="rgba(0,0,0,0.04)" 
            strokeWidth="0.75" 
            className="line-flow-animation" 
            style={{ animationDuration: '45s', animationDelay: '-10s' }}
          />
          {/* Wave 3 */}
          <path 
            d="M 100,150 C 600,450 700,50 1300,750" 
            stroke="rgba(0,0,0,0.05)" 
            strokeWidth="0.5" 
            className="line-flow-animation" 
            style={{ animationDuration: '60s', animationDelay: '-25s' }}
          />
        </svg>
      </div>

      {/* Navigation */}
      <header className={`w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-between relative z-10 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center gap-2">
          {/* Tiny wireframe icon */}
          <svg className="w-5 h-5 stroke-black stroke-[1] fill-none" viewBox="0 0 24 24">
            <path d="M12 2 L22 7.5 L22 16.5 L12 22 L2 16.5 L2 7.5 Z" />
            <path d="M12 2 L12 22" />
            <path d="M2 7.5 L12 12 L22 7.5" />
          </svg>
          <span className="text-xs font-semibold tracking-widest uppercase">CodeForge OS</span>
        </div>
        <div>
          <Link 
            href="/auth" 
            className="text-xs tracking-wider uppercase font-medium hover:opacity-60 transition-opacity border-b border-black pb-0.5"
          >
            Start Building
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-6 z-10">
        <div className="text-center max-w-4xl space-y-12">
          {/* Elegant Logo Reveal */}
          <div className="h-24 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-20 h-20 stroke-black stroke-[0.75] fill-none">
              <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" className="logo-draw-animation" />
              <path d="M50 10 L50 90" className="logo-draw-animation" style={{ animationDelay: '0.4s' }} />
              <path d="M15 30 L50 50 L85 30" className="logo-draw-animation" style={{ animationDelay: '0.8s' }} />
              <path d="M15 70 L50 50 L85 70" className="logo-draw-animation" style={{ animationDelay: '1.2s' }} />
            </svg>
          </div>

          {/* Subtitle tag */}
          <div className={`flex items-center justify-center gap-3 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '300ms' }}>
            <div className="w-12 h-px bg-black/20"></div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500">Autonomous Software Delivery</span>
            <div className="w-12 h-px bg-black/20"></div>
          </div>

          {/* Main Headline */}
          <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-98'}`} style={{ transitionDelay: '500ms' }}>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight text-black leading-[1.15]">
              From Idea to Production.
            </h1>
          </div>

          {/* Subheading */}
          <div className={`transition-all duration-1000 max-w-2xl mx-auto ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '700ms' }}>
            <p className="text-base md:text-lg text-neutral-500 font-light leading-relaxed">
              Watch specialized AI agents collaborate, review, and prepare your software project for execution.
            </p>
          </div>

          {/* CTA */}
          <div className={`transition-all duration-1000 pt-4 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '900ms' }}>
            <Link
              href="/auth"
              className="inline-block px-10 py-3.5 bg-black text-white text-xs font-semibold uppercase tracking-widest hover:bg-neutral-800 transition-all border border-black"
            >
              Start Building
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 ${isLoaded ? 'opacity-40' : 'opacity-0'}`} style={{ transitionDelay: '1400ms' }}>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">Scroll to view flow</span>
            <div className="w-px h-10 bg-gradient-to-b from-neutral-400 to-transparent animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-32 z-10 max-w-5xl mx-auto">
        <ScrollRevealNode className="mb-24 text-center">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-black mb-4">The Synthesis Process</h2>
          <p className="text-sm text-neutral-500 max-w-md mx-auto font-light">
            Your vision is processed through a structured pipeline of specialized nodes, transforming abstract goals into blueprint implementations.
          </p>
        </ScrollRevealNode>

        {/* Vertical line-art pipeline */}
        <div className="relative w-full max-w-lg mx-auto flex flex-col items-center">
          
          {/* Dash line backdrop */}
          <div className="absolute top-6 bottom-6 w-px border-l border-dashed border-neutral-300 pointer-events-none z-0"></div>

          {/* Workflow nodes */}
          <div className="w-full space-y-20 relative z-10">
            {[
              { step: 'Idea', role: 'Origin', desc: 'You describe the objective, features, and constraints of your target application.' },
              { step: 'Product Manager', role: 'Requirements Specialist', desc: 'Deconstructs the prompt into actionable feature highlights and structural user stories.' },
              { step: 'Architect', role: 'System Planner', desc: 'Determines system layers, tech stack, modular components, and core API designs.' },
              { step: 'Engineer', role: 'Technical Implementer', desc: 'Maps out codebase folder hierarchies, database schemas, and implementation schedules.' },
              { step: 'QA', role: 'Quality Guardian', desc: 'Drafts test cases, inspects edge cases, and verifies security and performance requirements.' },
              { step: 'Release Manager', role: 'Deployment Coordinator', desc: 'Packages the build, verifies integration standards, and compiles the roadmap.' },
              { step: 'Production Roadmap', role: 'Ready Blueprint', desc: 'Your structured, actionable milestone checklist and deploy instructions are finalized.' }
            ].map((item, index, arr) => (
              <ScrollRevealNode key={index} className="flex items-start w-full relative" delay={50}>
                {/* Node connector dot */}
                <div className="absolute left-1/2 -translate-x-1/2 top-1.5 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full border border-neutral-300 bg-white flex items-center justify-center z-10 transition-colors hover:border-black group">
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 transition-colors group-hover:bg-black"></div>
                  </div>
                </div>

                {/* Left Side Content (Alternating or left-aligned) */}
                <div className="w-[45%] text-right pr-8">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-mono">{item.role}</span>
                  <h3 className="text-sm font-semibold text-black mt-0.5">{item.step}</h3>
                </div>

                {/* Gap for the middle dot */}
                <div className="w-[10%]"></div>

                {/* Right Side Content */}
                <div className="w-[45%] pl-8 text-left">
                  <p className="text-xs text-neutral-500 font-light leading-relaxed">{item.desc}</p>
                </div>
              </ScrollRevealNode>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-neutral-200 py-24 px-6 z-10 relative bg-white/50 backdrop-blur-sm">
        <ScrollRevealNode className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-light tracking-tight text-black">Construct a system.</h2>
          <p className="text-sm text-neutral-500 font-light max-w-md mx-auto">
            Ready to design your specifications? Launch the workspace and run the synthesis process.
          </p>
          <div className="pt-4">
            <Link
              href="/auth"
              className="inline-block px-8 py-3 bg-black text-white text-xs font-semibold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
            >
              Initialize OS
            </Link>
          </div>
        </ScrollRevealNode>
      </section>
    </div>
  );
}
