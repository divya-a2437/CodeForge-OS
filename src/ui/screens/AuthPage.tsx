"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth delay
    await new Promise(resolve => setTimeout(resolve, 800));
    // Navigate to workspace
    router.push('/workspace');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6 py-12 relative overflow-hidden grid-bg">
      {/* Subtle thin background line elements */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 0 50 L 100 50" stroke="rgba(0,0,0,0.02)" strokeWidth="0.1" />
          <path d="M 50 0 L 50 100" stroke="rgba(0,0,0,0.02)" strokeWidth="0.1" />
        </svg>
      </div>

      <div className="w-full max-w-md bg-white border border-neutral-200 p-10 relative z-10 space-y-8 animate-scale-in">
        {/* Wireframe Logo */}
        <div className="text-center">
          <div className="h-16 flex items-center justify-center mb-4">
            <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-black stroke-[1] fill-none">
              <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" className="logo-draw-animation" />
              <path d="M50 10 L50 90" className="logo-draw-animation" style={{ animationDelay: '0.2s' }} />
              <path d="M15 30 L50 50 L85 30" className="logo-draw-animation" style={{ animationDelay: '0.4s' }} />
            </svg>
          </div>
          <span className="text-[10px] font-semibold tracking-[0.25em] text-neutral-400 uppercase">CodeForge OS</span>
          <h1 className="text-xl font-light tracking-tight text-black mt-3">
            {isLogin ? 'Initialize Workspace' : 'Create Operator Account'}
          </h1>
          <p className="text-xs text-neutral-500 font-light mt-1">
            {isLogin
              ? 'Provide operator credentials to gain access'
              : 'Configure a new platform operator'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-[9px] font-semibold uppercase tracking-wider text-neutral-400">
              Operator Identity
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@codeforge.local"
              className="w-full bg-white border border-neutral-200 px-3 py-2 text-xs outline-none transition placeholder-neutral-400 focus:border-black focus:ring-0 text-black"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-[9px] font-semibold uppercase tracking-wider text-neutral-400">
              Access Code
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white border border-neutral-200 px-3 py-2 text-xs outline-none transition placeholder-neutral-400 focus:border-black focus:ring-0 text-black"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-black text-white py-2.5 text-xs font-semibold uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <span className="inline-flex gap-1.5 justify-center items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </span>
            ) : (
              isLogin ? 'Authenticate' : 'Register Operator'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200"></div>
          </div>
          <span className="relative px-3 bg-white text-[9px] uppercase tracking-wider text-neutral-400 font-mono">OR</span>
        </div>

        {/* Social Authentication */}
        <div className="grid grid-cols-2 gap-3 z-10 relative">
          <button 
            type="button" 
            onClick={() => router.push('/workspace')} 
            className="border border-neutral-200 bg-white py-2 text-xs font-medium text-black hover:bg-neutral-50 transition-colors"
          >
            GitHub
          </button>
          <button 
            type="button" 
            onClick={() => router.push('/workspace')} 
            className="border border-neutral-200 bg-white py-2 text-xs font-medium text-black hover:bg-neutral-50 transition-colors"
          >
            Google
          </button>
        </div>

        {/* State Switch and Links */}
        <div className="text-center pt-2 space-y-4">
          <p className="text-[10px] text-neutral-500 font-light">
            {isLogin ? "New operator?" : "Registered operator?"}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1.5 font-semibold text-black hover:opacity-60 transition-opacity border-b border-black/30"
            >
              {isLogin ? 'Create Account' : 'Sign In'}
            </button>
          </p>
          <div className="text-[9px] text-neutral-400 uppercase tracking-wider flex justify-center gap-4">
            <Link href="/" className="hover:text-black transition-colors">Return Home</Link>
            <span>•</span>
            <button type="button" className="hover:text-black transition-colors">Security Audit</button>
          </div>
        </div>
      </div>
    </div>
  );
}
