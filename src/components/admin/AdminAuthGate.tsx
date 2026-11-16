'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Lock,
  ArrowRight,
  AlertCircle,
  KeyRound,
  RefreshCw,
} from 'lucide-react';

export default function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('a4s_admin_authenticated');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!password) {
      setError('Please enter the staff security passphrase.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('a4s_admin_authenticated', 'true');
        if (data.token) {
          localStorage.setItem('a4s_admin_token', data.token);
        }
        setIsAuthenticated(true);
        setError('');
      } else {
        setError(data.error || 'Invalid authorization passphrase. Please verify your staff credentials.');
      }
    } catch {
      setError('Unable to authenticate with security server. Please try again.');
    } finally {
      setLoading(false);
    }
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
                alt="Adrenaline4Schools"
                className="h-10 w-auto object-contain"
              />
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#09653d] text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#09653d]/25 font-bold">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Staff Administration Gateway</h1>
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#09653d] focus:border-transparent transition-all"
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
              className="w-full py-3.5 rounded-xl bg-[#09653d] hover:bg-[#064e2e] disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-[#09653d]/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Unlock Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center pt-4 border-t border-slate-800/80">
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
