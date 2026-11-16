'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, ShieldCheck } from 'lucide-react';

interface FlipUrgencyTimerProps {
  title?: string;
  subtitle?: string;
  showSeconds?: boolean;
  className?: string;
  compact?: boolean;
}

export default function FlipUrgencyTimer({
  title = 'Special School Allocation Offer Ends In:',
  subtitle = '',
  showSeconds = true,
  className = '',
  compact = false,
}: FlipUrgencyTimerProps) {
  // Timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 25,
    seconds: 53,
  });

  useEffect(() => {
    // Dynamic countdown target (e.g. ends in 2 days from fixed reference, or rolling deadline)
    const getTargetDate = () => {
      const now = new Date();
      // Set to 2 days, 14 hours from midnight or end of week
      const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 23, 59, 59);
      return target.getTime();
    };

    const targetTime = getTargetDate();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = Math.max(0, targetTime - now);

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const format = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-amber-500/10 border border-amber-500/25 rounded-[26px] p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
          {/* Left Title & Savings Offer Badge */}
          <div className="space-y-1.5 max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 text-xs font-bold tracking-wide uppercase">
              <Zap className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
              Limited-Time Subsidised Pricing
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-[#1d1d1f] tracking-tight">
              {title}
            </h3>
            {subtitle ? (
              <p className="text-xs sm:text-sm text-slate-700 font-sans font-medium">
                {subtitle}
              </p>
            ) : null}
          </div>

          {/* Right Flip-Clock Display (as shown in user image) */}
          <div className="flex flex-col items-center">
            {/* Top Framing Rule */}
            <div className="w-full h-[2px] bg-[#09653d] mb-2.5" />

            <div className="flex items-center gap-2 sm:gap-3 py-1">
              {/* Days Tile */}
              <div className="flex flex-col items-center">
                <div className="relative w-14 sm:w-16 h-14 sm:h-16 bg-[#161617] rounded-xl sm:rounded-2xl shadow-lg border border-black/40 flex items-center justify-center overflow-hidden">
                  {/* Subtle Flip-Card Center Seam Line */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-black/80 z-20 shadow-[0_1px_0_rgba(255,255,255,0.08)]" />
                  {/* Card Gloss Sheen */}
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-white/[0.04] pointer-events-none" />
                  <span className="relative z-10 text-white font-mono font-bold text-2xl sm:text-3xl tracking-tight">
                    {format(timeLeft.days)}
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 uppercase tracking-wider mt-1.5 font-sans">
                  Day{timeLeft.days === 1 ? '' : 's'}
                </span>
              </div>

              {/* Colon Separator */}
              <span className="text-xl sm:text-2xl font-bold text-[#09653d] pb-5 font-mono">:</span>

              {/* Hours Tile */}
              <div className="flex flex-col items-center">
                <div className="relative w-14 sm:w-16 h-14 sm:h-16 bg-[#161617] rounded-xl sm:rounded-2xl shadow-lg border border-black/40 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-black/80 z-20 shadow-[0_1px_0_rgba(255,255,255,0.08)]" />
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-white/[0.04] pointer-events-none" />
                  <span className="relative z-10 text-white font-mono font-bold text-2xl sm:text-3xl tracking-tight">
                    {format(timeLeft.hours)}
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 uppercase tracking-wider mt-1.5 font-sans">
                  Hours
                </span>
              </div>

              {/* Colon Separator */}
              <span className="text-xl sm:text-2xl font-bold text-[#09653d] pb-5 font-mono">:</span>

              {/* Minutes Tile */}
              <div className="flex flex-col items-center">
                <div className="relative w-14 sm:w-16 h-14 sm:h-16 bg-[#161617] rounded-xl sm:rounded-2xl shadow-lg border border-black/40 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-black/80 z-20 shadow-[0_1px_0_rgba(255,255,255,0.08)]" />
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-white/[0.04] pointer-events-none" />
                  <span className="relative z-10 text-white font-mono font-bold text-2xl sm:text-3xl tracking-tight">
                    {format(timeLeft.minutes)}
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 uppercase tracking-wider mt-1.5 font-sans">
                  Min
                </span>
              </div>

              {/* Seconds Tile */}
              {showSeconds && (
                <>
                  <span className="text-xl sm:text-2xl font-bold text-[#09653d] pb-5 font-mono">:</span>
                  <div className="flex flex-col items-center">
                    <div className="relative w-14 sm:w-16 h-14 sm:h-16 bg-[#161617] rounded-xl sm:rounded-2xl shadow-lg border border-black/40 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-black/80 z-20 shadow-[0_1px_0_rgba(255,255,255,0.08)]" />
                      <div className="absolute inset-x-0 top-0 h-1/2 bg-white/[0.04] pointer-events-none" />
                      <span className="relative z-10 text-amber-400 font-mono font-bold text-2xl sm:text-3xl tracking-tight">
                        {format(timeLeft.seconds)}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 uppercase tracking-wider mt-1.5 font-sans">
                      Sec
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Bottom Framing Rule */}
            <div className="w-full h-[2px] bg-[#09653d] mt-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
