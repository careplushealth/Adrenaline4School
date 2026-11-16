'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, CheckCircle, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: Array<{
    label: string;
    status: 'good' | 'action_needed' | 'urgent';
    feedback: string;
  }>;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'Does your school hold spare adrenaline auto-injectors on-site for pupils?',
    options: [
      {
        label: 'Yes, we hold emergency spare stock',
        status: 'good',
        feedback: 'Excellent. Ensure your batch expiry dates are monitored so replacement stock arrives before expiry.',
      },
      {
        label: 'No, we only rely on individual pupil pens',
        status: 'urgent',
        feedback: 'Under Benedict&apos;s Law guidance, schools are strongly expected to hold spare back-up pens on-site.',
      },
      {
        label: 'Unsure about our current stock status',
        status: 'action_needed',
        feedback: 'A quick audit of your school medical room or reception will establish if spare pens are in date.',
      },
    ],
  },
  {
    id: 2,
    question: 'Are emergency pens reachable within 3–5 minutes from dining halls and sports grounds?',
    options: [
      {
        label: 'Yes, stored centrally in key pupil zones',
        status: 'good',
        feedback: 'Great practice. Fast accessibility is crucial during acute anaphylaxis.',
      },
      {
        label: 'No, locked in an inaccessible office',
        status: 'urgent',
        feedback: 'Guidance explicitly states pens must never be locked away where staff cannot immediately access them.',
      },
      {
        label: 'Only in the main school reception',
        status: 'action_needed',
        feedback: 'Consider secondary kits for detached dining halls or distant sports pavilions.',
      },
    ],
  },
  {
    id: 3,
    question: 'Does your school receive automated alerts before adrenaline pens expire?',
    options: [
      {
        label: 'Yes, automated tracking active',
        status: 'good',
        feedback: 'Superb. Automated reminders at 12, 6, 3, and 1 month keep your school compliant.',
      },
      {
        label: 'No, we rely on manual diary checks',
        status: 'action_needed',
        feedback: 'Manual checks often get missed. We provide complimentary automated 12/6/3/1 month alerts.',
      },
      {
        label: 'Our spare pens may already be expired',
        status: 'urgent',
        feedback: 'Expired adrenaline loses potency rapidly. Order fresh batches with 30-day BACS invoicing.',
      },
    ],
  },
];

export default function HomeQuestionnaire() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  const handleSelect = (optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: optionIdx }));
  };

  const currentQ = QUESTIONS[currentIdx];
  const selectedOpt = selectedAnswers[currentIdx] !== undefined ? currentQ.options[selectedAnswers[currentIdx]] : null;

  return (
    <section className="py-16 md:py-24 bg-white border-t border-black/[0.06]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#f5f5f7] rounded-[32px] sm:rounded-[36px] p-6 sm:p-10 md:p-12 border border-black/[0.06] shadow-2xs">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#09653d]/[0.08] text-[#09653d] text-[11px] font-semibold tracking-wide uppercase border border-[#09653d]/15">
              <HelpCircle className="w-3.5 h-3.5 text-[#09653d]" />
              School Allergy Preparedness Check
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] tracking-[-0.025em]">
              Is your school fully ready for an allergic emergency?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
              Answer 3 quick questions to check your school&apos;s compliance with Benedict&apos;s Law standards.
            </p>
          </div>

          {/* Stepper Tabs */}
          <div className="flex justify-center gap-2 mb-8">
            {QUESTIONS.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentIdx(idx)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  currentIdx === idx
                    ? 'bg-[#09653d] text-white shadow-xs'
                    : selectedAnswers[idx] !== undefined
                    ? 'bg-emerald-100 text-[#09653d]'
                    : 'bg-white text-slate-600 border border-black/[0.06]'
                }`}
              >
                Question {idx + 1}
              </button>
            ))}
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-[26px] p-6 sm:p-8 border border-black/[0.06] shadow-xs max-w-2xl mx-auto space-y-6">
            <h3 className="text-base sm:text-lg font-bold text-[#1d1d1f] tracking-tight">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentIdx] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelect(optIdx)}
                    className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[#09653d] bg-emerald-50/60 text-[#09653d] font-semibold shadow-2xs'
                        : 'border-black/[0.06] bg-[#f5f5f7] hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                        isSelected ? 'border-[#09653d] bg-[#09653d] text-white' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Instant Feedback */}
            {selectedOpt && (
              <div
                className={`p-4 rounded-2xl text-xs flex items-start gap-3 border ${
                  selectedOpt.status === 'good'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : selectedOpt.status === 'urgent'
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                {selectedOpt.status === 'good' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <p className="leading-relaxed font-sans">{selectedOpt.feedback}</p>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between items-center pt-2 border-t border-black/[0.04]">
              {currentIdx > 0 ? (
                <button
                  onClick={() => setCurrentIdx(currentIdx - 1)}
                  className="text-xs font-semibold text-slate-500 hover:text-[#09653d]"
                >
                  &larr; Previous
                </button>
              ) : (
                <div />
              )}

              {currentIdx < QUESTIONS.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx(currentIdx + 1)}
                  className="px-4 py-2 rounded-full bg-[#09653d] text-white text-xs font-semibold hover:bg-[#064e2e] transition-colors"
                >
                  Next Question &rarr;
                </button>
              ) : (
                <div />
              )}
            </div>
          </div>

          {/* Lead to FAQs callout */}
          <div className="text-center mt-8 space-y-2">
            <p className="text-xs text-slate-500 font-sans">
              Have questions regarding Headteacher Requisitions, BACS 30-day payment, or pharmacy regulations?
            </p>
            <Link
              href="/faqs"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#09653d] hover:text-[#064e2e] underline font-sans transition-colors"
            >
              <span>Explore our comprehensive School FAQs guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
