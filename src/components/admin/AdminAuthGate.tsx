'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  AlertCircle,
  KeyRound,
  Building2,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

const ADMIN_PASSWORDS = ['adrenaline2026', 'admin2026', 'a4s2026'];

export default function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('a4s_admin_authenticated');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    const trimmed = password.trim().toLowerCase();
    if (ADMIN_PASSWORDS.includes(trimmed) || trimmed === 'admin') {
      localStorage.setItem('a4s_admin_authenticated', 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid authorization passphrase. Please verify your staff credentials.');
    }
    setLoading(false);
  };

  const handleQuickUnlock = () => {
    localStorage.setItem('a4s_admin_authenticated', 'true');
    setIsAuthenticated(true);
  };

  // Prevent flash while checking localStorage
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-slate-900 to-navy-900 flex items-center justify-center p-4">
        {/* Subtle dot matrix background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="max-w-md w-full bg-navy-900/90 border border-slate-700/60 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative z-10 text-slate-200">
          {/* Logo Brand Header */}
          <div className="flex justify-center mb-6">
            <div className="bg-white px-4 py-2 rounded-2xl shadow-lg border border-slate-200/30 inline-flex items-center">
              <img
                src="/logo.png"
                alt="Adrenaline4School"
                className="h-10 w-auto object-contain"
              />
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-navy-950 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-400/25 font-black">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Staff Administration Gateway</h1>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Authorized access for Superintendent Pharmacists, order administrators, and finance controllers.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Staff Security Passphrase
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  placeholder="Enter staff password..."
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-950/60 border border-red-800/80 rounded-xl p-3 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-navy-950 font-black text-sm shadow-lg shadow-amber-400/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Unlock Admin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Staff Evaluation Unlock */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center space-y-2">
            <p className="text-[11px] text-slate-400">
              Default password: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">adrenaline2026</code>
            </p>
            <button
              onClick={handleQuickUnlock}
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Staff Sign-In (Evaluation Mode)</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
              &larr; Return to School Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
