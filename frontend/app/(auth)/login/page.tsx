'use client';
import { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-screen w-full flex bg-[#12121d] text-[#e3e0f1] font-sans selection:bg-[#8083ff] selection:text-white">
      {/* Left Panel - Visual Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#0b0b14] items-center justify-center overflow-hidden border-r border-[#464554]/30">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#c0c1ff]/10 blur-[120px] rounded-full point-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#8083ff]/10 blur-[100px] rounded-full point-events-none" />
        
        {/* Background Abstract Image */}
        <img 
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity" 
          src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop" 
          alt="Abstract architecture"
        />
        
        {/* Overlay Content */}
        <div className="relative z-10 p-16 max-w-xl w-full">
          <div className="mb-12 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#c0c1ff] to-[#8083ff] flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(192,193,255,0.4)]">
              <svg className="w-6 h-6 text-[#1000a9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">ProjectPulse</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white mb-6">
            Design your <br/>
            <span className="text-[#8083ff]" style={{ textShadow: '0 0 20px rgba(128,131,255,0.4)' }}>Digital Future.</span>
          </h1>
          <p className="text-lg text-[#c7c4d7] max-w-md leading-relaxed">
            The premium project management ecosystem built for dynamic teams and visionary creators. Stay in sync, move fast, and build better.
          </p>
          
          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-4">
              <img className="w-10 h-10 rounded-full border-2 border-[#12121d]" src="https://i.pravatar.cc/100?img=1" alt="Avatar 1"/>
              <img className="w-10 h-10 rounded-full border-2 border-[#12121d]" src="https://i.pravatar.cc/100?img=2" alt="Avatar 2"/>
              <img className="w-10 h-10 rounded-full border-2 border-[#12121d]" src="https://i.pravatar.cc/100?img=3" alt="Avatar 3"/>
              <div className="w-10 h-10 rounded-full border-2 border-[#12121d] bg-[#1f1e2a] flex items-center justify-center text-xs font-bold text-[#c0c1ff]">+2k</div>
            </div>
            <p className="text-sm font-medium text-[#c7c4d7]">Trusted by forward-thinking teams.</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form (Takes full width on mobile) */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 relative bg-[#12121d] overflow-y-auto">
        <div className="w-full max-w-lg my-auto py-8">
          
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#c0c1ff] to-[#8083ff] flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(192,193,255,0.3)]">
              <svg className="w-6 h-6 text-[#1000a9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">ProjectPulse</span>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="text-[#908fa0] mt-2 font-medium">
              {mode === 'login' 
                ? 'Enter your credentials to access your workspace.' 
                : 'Join ProjectPulse and supercharge your team.'}
            </p>
          </div>

          {mode === 'login' ? (
            <LoginForm />
          ) : (
            <SignupForm />
          )}

          {/* Divider */}
          <div className="relative flex items-center py-4 mt-6">
            <div className="grow border-t border-[#464554]/30"></div>
            <span className="shrink-0 mx-4 text-[#64748b] text-sm font-medium">OR CONTINUE WITH</span>
            <div className="grow border-t border-[#464554]/30"></div>
          </div>

          {/* Social Auth */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <button className="flex items-center justify-center gap-3 h-11 rounded-lg bg-[#1f1e2a] hover:bg-[#292935] border border-[#464554]/20 transition-all text-sm font-semibold text-white group">
              <img alt="Google logo" className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4GZAvd-Q1GbPrdgyJpfO8Xc_0Zwi48HULv-lQhEpdZ29x0ZMVLY_gO0cakOsq00MS2AN6QTneD5TpE3_ViYGDGxlZzPpxCzwemugKkjFpjWWXc6tpKJnOXdtT5ebYyo_9T6GclflL1fezaMFGN475KFgitmbU4cK81N7fWjoiLChJ9p4YTFYX9Q379y81Tm3k0UvXXKWVZ2m6vmq2IHIJIA-yh0-xulEUGTUss82A9OTRadSWNjN1TSDaCoL_wdAK6Gfk9y49Aqyf"/>
              Google
            </button>
            <button className="flex items-center justify-center gap-3 h-11 rounded-lg bg-[#1f1e2a] hover:bg-[#292935] border border-[#464554]/20 transition-all text-sm font-semibold text-white group">
              <svg className="w-5 h-5 text-[#c7c4d7] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </button>
          </div>

          <div className="text-center pt-6">
            <p className="text-[#c7c4d7] text-sm font-medium">
              {mode === 'login' ? "Don't have an account? " : "Already part of the fleet? "}
              <button 
                type="button" 
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} 
                className="text-[#8083ff] hover:text-[#c0c1ff] font-bold ml-1 transition-colors"
              >
                {mode === 'login' ? 'Create one now' : 'Sign in here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
