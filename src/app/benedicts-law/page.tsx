'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Scale, Shield, GraduationCap, ExternalLink, AlertTriangle, BookOpen } from 'lucide-react';

export default function BenedictsLawPage() {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="min-h-screen bg-white text-[#0c2340] font-sans">
      {/* Header */}
      <section className="bg-[#0c2340] text-slate-200 py-16 px-4 border-b border-slate-800 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-5 text-amber-400">
            <Scale className="w-7 h-7" />
          </div>
          <span className="text-teal-300 text-xs font-bold uppercase tracking-widest bg-teal-500/20 px-3.5 py-1 rounded-full border border-teal-500/30">
            Statutory Guidance 2026
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-4 tracking-tight">
            Benedict&apos;s Law
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Understanding England&apos;s statutory guidance on school allergy preparedness, and how Adrenaline4Schools helps your school comply.
          </p>
        </div>
      </section>

      {/* Navigation */}
      <div className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-20 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 flex gap-1.5 overflow-x-auto py-2.5">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'requirements', label: 'Requirements' },
            { id: 'pens', label: 'Spare Pens' },
            { id: 'training', label: 'Staff Training' },
            { id: 'howwehelp', label: 'How We Help' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                activeSection === tab.id
                  ? 'bg-[#096556] text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-[#0c2340] hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Official Guidance Reference */}
        <div className="bg-linen/60 border border-stone-200/80 rounded-2xl p-5 mb-10 flex items-start gap-4">
          <ExternalLink className="w-5 h-5 text-sage-800 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-serif font-medium text-forest-950">Official UK Government Guidance</p>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              The statutory guidance for schools on allergy management is published by the UK Government Department for Education.
            </p>
            <a
              href="https://www.gov.uk/government/publications/using-emergency-adrenaline-auto-injectors-in-schools"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-xs font-medium text-sage-800 underline hover:text-forest-950 inline-flex items-center gap-1"
            >
              View official guidance on Gov.uk <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-serif font-normal text-forest-950 mb-4">What is Benedict&apos;s Law?</h2>
              <div className="bg-white/80 border border-stone-200/80 p-5 rounded-2xl mb-6 shadow-xs">
                <p className="text-sm text-forest-950 font-serif font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-gold-600" />
                  In memory of Benedict Blythe
                </p>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  The campaign for Benedict&apos;s Law follows the tragic death of five-year-old Benedict Blythe at school. His family&apos;s campaign has driven statutory guidance requiring English schools to significantly strengthen their allergy preparedness, ensuring no other family experiences such a loss.
                </p>
              </div>

              <div className="prose prose-sm max-w-none text-stone-600 space-y-3 leading-relaxed">
                <p>
                  Benedict&apos;s Law establishes new expectations for schools in England regarding allergy management. From September 2026, schools are expected to have comprehensive allergy policies, trained staff, and accessible emergency medication.
                </p>
                <p>
                  The guidance builds on existing provisions under the Human Medicines (Amendment) Regulations 2017, which already allow schools to hold spare emergency adrenaline auto-injectors for use on pupils at risk of anaphylaxis, without the need for individual prescriptions.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-normal text-forest-950 mb-4">Key School Requirements</h2>
              <div className="space-y-4">
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
                  <div key={idx} className="flex items-start gap-4 p-5 bg-white/90 rounded-2xl border border-stone-200/80 shadow-xs hover:border-sage-400 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-sage-50 text-sage-800 border border-sage-200/70 flex items-center justify-center shrink-0">
                      <req.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif font-medium text-forest-950 text-base">{req.title}</h3>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">{req.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-linen/40 border border-stone-200/70 rounded-2xl p-6">
              <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider mb-2">Disclaimer</p>
              <p className="text-xs text-stone-600 leading-relaxed">
                The information on this page is provided for general awareness and does not constitute legal or professional advice. Schools should refer to the official UK Government statutory guidance and seek appropriate professional advice. Adrenaline4Schools accepts no liability for any school&apos;s compliance decisions. Content on this page is reviewed periodically and may not reflect the very latest regulatory updates.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-[#0c2340] text-white rounded-3xl p-6 border border-slate-800 shadow-sm">
              <h3 className="font-bold text-xl mb-2 text-white">Get Compliant Today</h3>
              <p className="text-slate-300 text-xs sm:text-sm mb-5 leading-relaxed">
                Order spare emergency pens, set up automated expiry tracking, and access free staff training.
              </p>
              <Link
                href="/order-pens"
                className="block w-full py-3 rounded-full bg-[#096556] hover:bg-[#075145] text-white font-bold text-xs uppercase tracking-wider text-center transition-all shadow-sm"
              >
                Order Emergency Pens <ArrowRight className="inline w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
              <h3 className="font-bold text-[#0c2340] mb-2 text-base">Free Staff Training</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">Our online modules cover anaphylaxis awareness, auto-injector use, and school allergy policy compliance.</p>
              <Link href="/training" className="flex items-center gap-2 text-xs font-semibold text-[#096556] hover:text-[#075145]">
                <BookOpen className="w-4 h-4" /> Explore Training Courses
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
              <h3 className="font-bold text-[#0c2340] mb-2 text-base">Human Medicines Regulations</h3>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">The 2017 regulations allow schools to hold spare pens via a Headteacher Requisition — no individual prescriptions needed.</p>
              <Link href="/how-it-works" className="text-xs font-semibold text-[#096556] hover:text-[#075145]">
                See how the requisition works →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
