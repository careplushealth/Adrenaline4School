'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Truck, ShieldCheck, Zap } from 'lucide-react';

interface UrgencyTimerProps {
  variant?: 'banner' | 'card' | 'inline';
  className?: string;
}

export default function UrgencyTimer({ variant = 'banner', className = '' }: UrgencyTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 3,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    // Calculate time until next pharmacy dispatch cut-off (e.g. 16:00 UK time)
    const calculateTimeRemaining = () => {
      const now = new Date();
      const cutoff = new Date();
      cutoff.setHours(16, 0, 0, 0);

      if (now.getTime() > cutoff.getTime()) {
        cutoff.setDate(cutoff.getDate() + 1);
      }

      const diff = Math.max(0, cutoff.getTime() - now.getTime());
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatNum = (n: number) => n.toString().padStart(2, '0');

  if (variant === 'inline') {
    return (
      <div className={`inline-flex items-center gap-2 text-xs font-semibold text-[#09653d] ${className}`}>
        <Clock className="w-3.5 h-3.5 animate-pulse" />
        <span>
          Order within <strong className="font-mono text-[#1d1d1f]">{formatNum(timeLeft.hours)}h {formatNum(timeLeft.minutes)}m {formatNum(timeLeft.seconds)}s</strong> for dispatch in 3 to 4 working days
        </span>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`p-4 rounded-[20px] bg-gradient-to-r from-teal-500/[0.08] to-emerald-500/[0.04] border border-[#09653d]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#09653d] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#1d1d1f]">Daily Pharmacy Batch Closing Soon</p>
            <p className="text-[11px] text-slate-600 font-sans">
              Orders placed today are prepared for prompt medical courier delivery in <strong className="font-semibold text-[#1d1d1f]">3 to 4 working days</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs font-bold shrink-0 bg-white px-3 py-1.5 rounded-full border border-[#09653d]/20 shadow-2xs text-[#1d1d1f]">
          <Clock className="w-3.5 h-3.5 text-[#09653d] animate-pulse" />
          <span>{formatNum(timeLeft.hours)}</span>
          <span className="text-slate-400">:</span>
          <span>{formatNum(timeLeft.minutes)}</span>
          <span className="text-slate-400">:</span>
          <span className="text-[#09653d]">{formatNum(timeLeft.seconds)}</span>
        </div>
      </div>
    );
  }

  // Default banner variant
  return (
    <div className={`bg-[#062e1c] text-white py-2 px-4 text-xs font-sans border-b border-white/[0.08] ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2 justify-center">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-medium text-slate-200">
            Next GPhC pharmacy dispatch cut-off:
          </span>
          <span className="font-mono font-bold text-emerald-300">
            {formatNum(timeLeft.hours)}h {formatNum(timeLeft.minutes)}m {formatNum(timeLeft.seconds)}s
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-300 text-[11px] justify-center">
          <span className="flex items-center gap-1">
            <Truck className="w-3 h-3 text-emerald-400" /> Tracked courier delivery in 3 to 4 working days
          </span>
          <span className="hidden md:inline text-white/30">•</span>
          <span className="hidden md:flex items-center gap-1 text-emerald-300 font-medium">
            <ShieldCheck className="w-3 h-3" /> Automated Expiry Tracking Included
          </span>
        </div>
      </div>
    </div>
  );
}
