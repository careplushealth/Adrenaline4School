'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Scale, Shield, GraduationCap, ExternalLink, AlertTriangle, BookOpen } from 'lucide-react';

export default function BenedictsLawPage() {
  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] font-sans">
      {/* Header — Apple Dark Editorial Banner */}
      <section className="bg-[#062e1c] text-slate-200 py-16 sm:py-20 px-4 border-b border-white/[0.08] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.08] border border-white/[0.12] flex items-center justify-center mx-auto mb-5 text-emerald-300 shadow-2xs">
            <Scale className="w-7 h-7" />
          </div>
          <span className="text-emerald-300 text-[11px] font-semibold uppercase tracking-wider bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20">
            Statutory Guidance 2026
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-4 tracking-[-0.03em]">
            Benedict&apos;s Law
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-sans">
            Understanding England&apos;s statutory guidance on school allergy preparedness, and how Adrenaline4Schools helps your school comply.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Official Guidance Reference */}
        <div className="bg-[#f5f5f7] border border-black/[0.06] rounded-[24px] p-5 mb-10 flex items-start gap-4">
          <ExternalLink className="w-5 h-5 text-[#09653d] shrink-0 mt-0.5" />
          <div>
            <p className="text-[15px] font-semibold text-[#1d1d1f] tracking-tight">Official UK Government Guidance</p>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-sans">
              The statutory guidance for schools on allergy management is published by the UK Government Department for Education.
            </p>
            <a
              href="https://www.gov.uk/government/publications/using-emergency-adrenaline-auto-injectors-in-schools"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-xs font-semibold text-[#09653d] underline hover:text-[#064e2e] inline-flex items-center gap-1"
            >
              View official guidance on Gov.uk <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[#1d1d1f] tracking-tight mb-4">What is Benedict&apos;s Law?</h2>
              <div className="bg-[#f5f5f7] border border-black/[0.06] p-6 rounded-[24px] mb-6 shadow-2xs">
                <p className="text-sm text-[#1d1d1f] font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#09653d]" />
                  In memory of Benedict Blythe
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                  The campaign for Benedict&apos;s Law follows the tragic death of five-year-old Benedict Blythe at school. His family&apos;s campaign has driven statutory guidance requiring English schools to significantly strengthen their allergy preparedness, ensuring no other family experiences such a loss.
                </p>
              </div>

              <div className="prose prose-sm max-w-none text-slate-600 space-y-3 leading-relaxed font-sans">
                <p>
                  Benedict&apos;s Law establishes new expectations for schools in England regarding allergy management. From September 2026, schools are expected to have comprehensive allergy policies, trained staff, and accessible emergency medication.
                </p>
                <p>
                  The guidance builds on existing provisions under the Human Medicines (Amendment) Regulations 2017, which already allow schools to hold spare emergency adrenaline auto-injectors for use on pupils at risk of anaphylaxis, without the need for individual prescriptions.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1d1d1f] tracking-tight mb-4">Key School Requirements</h2>
              <div className="space-y-3.5">
                {[
                  {
                    title: 'Spare Emergency Adrenaline Auto-Injectors',
                    description: 'Schools must hold at least two spare adrenaline auto-injectors of appropriate strength, accessible to trained staff, and checked regularly for expiry.',
                    icon: Shield,
                  },
                  {
                    title: 'Whole-School Allergy Policy',
                    description: 'A comprehensive written allergy policy covering risk management, communication with parents, menus and catering, and emergency procedures.',
                    icon: Scale,
                  },
                  {
                    title: 'Individual Healthcare Plans (IHPs)',
                    description: 'For every pupil with a known allergy, schools must maintain an up-to-date IHP detailing their allergies, treatment and emergency contacts.',
                    icon: Shield,
                  },
                  {
                    title: 'Staff Allergy Awareness Training',
                    description: 'All teaching and support staff, including catering and lunchtime staff, must receive training on allergy recognition, anaphylaxis response and auto-injector use.',
                    icon: GraduationCap,
                  },
                  {
                    title: 'Regular Expiry Checks',
                    description: 'Spare pens must be regularly inspected for expiry date, cloudiness of solution, and broken safety seals. A log of checks should be maintained.',
                    icon: CheckCircle,
                  },
                ].map((req, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-5 bg-[#f5f5f7] rounded-[22px] border border-black/[0.06] shadow-2xs hover:border-[#09653d]/30 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-white text-[#09653d] border border-black/[0.06] flex items-center justify-center shrink-0 shadow-2xs">
                      <req.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1d1d1f] text-base tracking-tight">{req.title}</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed font-sans">{req.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#f5f5f7] border border-black/[0.06] rounded-[24px] p-6">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Disclaimer</p>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                The information on this page is provided for general awareness and does not constitute legal or professional advice. Schools should refer to the official UK Government statutory guidance and seek appropriate professional advice. Adrenaline4Schools accepts no liability for any school&apos;s compliance decisions. Content on this page is reviewed periodically and may not reflect the very latest regulatory updates.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-[#062e1c] text-white rounded-[28px] p-6 border border-white/[0.08] shadow-sm">
              <h3 className="font-bold text-xl mb-2 text-white tracking-tight">Get Compliant Today</h3>
              <p className="text-slate-300 text-xs sm:text-sm mb-5 leading-relaxed font-sans">
                Order spare emergency pupil pens with automated expiry tracking and tracked delivery in 3 to 4 working days.
              </p>
              <Link
                href="/order-pens"
                className="block w-full py-3 rounded-full bg-[#09653d] hover:bg-[#064e2e] text-white font-semibold text-xs uppercase tracking-wider text-center transition-all shadow-sm apple-btn"
              >
                Order Emergency Pens <ArrowRight className="inline w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="bg-[#f5f5f7] rounded-[24px] border border-black/[0.06] shadow-2xs p-5">
              <h3 className="font-semibold text-[#1d1d1f] mb-2 text-base tracking-tight">Spare Pen Calculator</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed font-sans">Use our interactive calculator to determine exact recommended 150mcg and 300mcg spare pen allocations for your school.</p>
              <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-[#09653d] hover:text-[#064e2e]">
                <ArrowRight className="w-4 h-4" /> Try Benedict&apos;s Law Calculator
              </Link>
            </div>

            <div className="bg-[#f5f5f7] rounded-[24px] border border-black/[0.06] shadow-2xs p-5">
              <h3 className="font-semibold text-[#1d1d1f] mb-2 text-base tracking-tight">Headteacher Requisitions</h3>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed font-sans">Schools can hold spare emergency pens for pupils via an official Headteacher Requisition — no individual named prescriptions needed.</p>
              <Link href="/how-it-works" className="text-xs font-semibold text-[#09653d] hover:text-[#064e2e]">
                See how the process works &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
