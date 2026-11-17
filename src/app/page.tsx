'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import RequisitionModal from '@/components/RequisitionModal';
import MedicalDeviceVisual from '@/components/MedicalDeviceVisual';
import FourStepProcess from '@/components/FourStepProcess';
import HeroSceneIllustration from '@/components/HeroSceneIllustration';
import PupilsIllustration from '@/components/PupilsIllustration';
import SparePenCalculator from '@/components/SparePenCalculator';
import HomeFaqSection from '@/components/HomeFaqSection';
import FlipUrgencyTimer from '@/components/FlipUrgencyTimer';
import {
  ShieldCheck,
  Truck,
  BellRing,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Shield,
  Lock,
  Headphones,
  Lightbulb,
  Building2,
  Calendar,
  Sparkles,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);

  return (
    <div className="bg-white text-[#1d1d1f] selection:bg-[#09653d] selection:text-white font-sans">
      {/* 1. HERO SECTION — Apple Keynote Elegance (No Requisition Button in Banner) */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-[#f5f5f7]/80 via-white to-white border-b border-black/[0.04] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column Copy */}
            <div className="lg:col-span-7 space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#09653d]/[0.08] border border-[#09653d]/15 text-[#09653d] text-[11px] font-semibold tracking-wider uppercase">
                <span>SUPPORTING SCHOOL ALLERGY SAFETY</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-bold text-[#1d1d1f] tracking-[-0.035em] leading-[1.08]">
                Emergency adrenaline<br />
                pens for schools,<br />
                made simple.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed tracking-[-0.01em]">
                Helping schools meet new allergy safety requirements with a straightforward ordering process, pharmacy fulfilment and <strong className="font-semibold text-[#1d1d1f]">free automated expiry reminders</strong>.
              </p>

              {/* Action Buttons (Requisition button removed from main banner) */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/order-pens"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#09653d] hover:bg-[#064e2e] text-white font-semibold text-[14px] tracking-tight shadow-sm hover:shadow-md transition-all apple-btn"
                >
                  <span>Choose your pens</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] font-semibold text-[14px] tracking-tight border border-black/[0.08] transition-all apple-btn"
                >
                  <span>How it works</span>
                </Link>
              </div>

              {/* Trust Indicators Bar — Apple Pill Chips */}
              <div className="pt-3 flex flex-wrap items-center gap-2.5 text-[12px] text-slate-700">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f5f5f7] border border-black/[0.04] font-medium text-slate-800">
                  <CheckCircle className="w-3.5 h-3.5 text-[#09653d] shrink-0" />
                  GPhC Pharmacy supplied
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f5f5f7] border border-black/[0.04] font-medium text-slate-800">
                  <Truck className="w-3.5 h-3.5 text-[#09653d] shrink-0" />
                  Delivered in 3 to 4 working days
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f5f5f7] border border-black/[0.04] font-medium text-slate-800">
                  <BellRing className="w-3.5 h-3.5 text-[#09653d] shrink-0" />
                  Free expiry reminders
                </span>
              </div>
            </div>

            {/* Right Column: Pristine School & Auto-Injector Scene Illustration */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <HeroSceneIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATUTORY BENEDICT'S LAW 2026 GUIDANCE — Apple Editorial Paper */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#f5f5f7] rounded-[32px] sm:rounded-[36px] p-8 sm:p-12 md:p-14 border border-black/[0.06] shadow-2xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column Guidance */}
              <div className="lg:col-span-7 space-y-5">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#09653d]/[0.08] border border-[#09653d]/15 text-[#09653d] text-[11px] font-semibold tracking-wider uppercase">
                  BENEDICT&apos;S LAW
                </span>

                <h2 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] tracking-[-0.025em] leading-tight">
                  New allergy safety requirements for schools
                </h2>

                <p className="text-[15px] sm:text-[16px] text-slate-600 leading-relaxed font-sans">
                  From September 2026, new statutory guidance (often referred to as Benedict&apos;s Law) expects schools in England to strengthen their pupil allergy preparedness, including:
                </p>

                <ul className="space-y-3 pt-2 text-[14px] text-slate-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#09653d] shrink-0 mt-0.5" />
                    <span>Keeping spare adrenaline auto-injectors available and accessible for pupils in emergencies</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#09653d] shrink-0 mt-0.5" />
                    <span>Maintaining a comprehensive school allergy register and pupil healthcare plans</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#09653d] shrink-0 mt-0.5" />
                    <span>Ensuring school staff receive appropriate allergy and adrenaline pen training</span>
                  </li>
                </ul>

                <div className="pt-3">
                  <Link
                    href="/benedicts-law"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#09653d] hover:text-[#064e2e] underline font-sans"
                  >
                    <span>Read our full summary of Benedict&apos;s Law</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right Column Supporting Graphic Illustration */}
              <div className="lg:col-span-5 flex justify-center">
                <PupilsIllustration />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BENEDICT'S LAW SPARE PEN CALCULATOR (Interactive Tool) */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SparePenCalculator />
        </div>
      </section>

      {/* 4. WHY CHOOSE ADRENALINE4SCHOOLS — Apple 4-Pillar Grid */}
      <section className="py-16 md:py-24 bg-white border-t border-black/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#f5f5f7] rounded-[32px] sm:rounded-[36px] p-8 sm:p-12 md:p-14 border border-black/[0.06] shadow-2xs">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#09653d]/[0.08] border border-[#09653d]/15 text-[#09653d] text-[11px] font-semibold tracking-wider uppercase">
                WHY SCHOOLS TRUST US
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] tracking-[-0.025em]">
                Everything your school needs, handled
              </h2>
              <p className="text-slate-600 text-sm">
                A simple, reliable service designed specifically for UK schools, academies, and multi-academy trusts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {/* Item 1: Simple ordering */}
              <div className="flex flex-col items-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-white text-[#09653d] border border-black/[0.06] flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-[16px] text-[#1d1d1f] tracking-tight">Simple ordering</h3>
                <p className="text-[13px] text-slate-600 leading-relaxed max-w-[210px]">
                  We handle the paperwork and guide you at every step.
                </p>
              </div>

              {/* Item 2: Pharmacy supplied */}
              <div className="flex flex-col items-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-white text-[#09653d] border border-black/[0.06] flex items-center justify-center shadow-xs">
                  <Building2 className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-[16px] text-[#1d1d1f] tracking-tight">Pharmacy supplied</h3>
                <p className="text-[13px] text-slate-600 leading-relaxed max-w-[210px]">
                  Dispensed by a UK GPhC registered pharmacy.
                </p>
              </div>

              {/* Item 3: Tracked delivery */}
              <div className="flex flex-col items-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-white text-[#09653d] border border-black/[0.06] flex items-center justify-center shadow-xs">
                  <Truck className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-[16px] text-[#1d1d1f] tracking-tight">Tracked delivery</h3>
                <p className="text-[13px] text-slate-600 leading-relaxed max-w-[210px]">
                  Delivered in 3 to 4 working days as standard.
                </p>
              </div>

              {/* Item 4: Expiry reminders */}
              <div className="flex flex-col items-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-white text-[#09653d] border border-black/[0.06] flex items-center justify-center shadow-xs">
                  <Calendar className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-[16px] text-[#1d1d1f] tracking-tight">Expiry reminders</h3>
                <p className="text-[13px] text-slate-600 leading-relaxed max-w-[210px]">
                  We keep track of your pens and contact you before they need replacing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CHOOSE FROM THE LEADING ADRENALINE PENS — Apple Compare Spotlights */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Flip Clock Urgency Timer Banner */}
          <FlipUrgencyTimer
            title="Special School Allocation Offer Ends In:"
          />

          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] tracking-[-0.025em]">
              Choose from the leading adrenaline pens
            </h2>
            <p className="text-slate-600 text-sm">
              We offer the main brands used in UK schools, with subsidised £99.99 pricing per pen (reduced from £120.00) and simple 30-day BACS invoicing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* EpiPen Spotlight Card */}
            <div className="bg-[#fafafc] rounded-[30px] p-8 border border-black/[0.07] shadow-2xs flex items-center gap-6 sm:gap-8 hover:border-[#09653d]/40 hover:shadow-md transition-all duration-300">
              <div className="shrink-0 flex items-center justify-center">
                <MedicalDeviceVisual type="epipen-300" size="sm" />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-2xl text-[#1d1d1f] tracking-tight">EpiPen®</h3>
                  <p className="text-[13px] text-slate-600 leading-relaxed mt-1">
                    Available in 150mcg (primary pupils 15–30kg) and 300mcg (pupils over 30kg) strengths.
                  </p>
                </div>
                <div className="pt-1">
                  <Link
                    href="/order-pens"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#09653d] hover:bg-[#064e2e] text-white text-xs font-semibold tracking-tight transition-all shadow-xs hover:shadow-md apple-btn"
                  >
                    <span>Order Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Jext Spotlight Card */}
            <div className="bg-[#fafafc] rounded-[30px] p-8 border border-black/[0.07] shadow-2xs flex items-center gap-6 sm:gap-8 hover:border-[#09653d]/40 hover:shadow-md transition-all duration-300">
              <div className="shrink-0 flex items-center justify-center">
                <MedicalDeviceVisual type="jext-150" size="sm" />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-2xl text-[#1d1d1f] tracking-tight">Jext®</h3>
                  <p className="text-[13px] text-slate-600 leading-relaxed mt-1">
                    Available in 150mcg (primary pupils 15–30kg) and 300mcg (pupils over 30kg) strengths.
                  </p>
                </div>
                <div className="pt-1">
                  <Link
                    href="/order-pens"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#09653d] hover:bg-[#064e2e] text-white text-xs font-semibold tracking-tight transition-all shadow-xs hover:shadow-md apple-btn"
                  >
                    <span>Order Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOUR STEP PROCESS WALKTHROUGH */}
      <section className="py-16 bg-[#fafafc] border-t border-black/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FourStepProcess />
        </div>
      </section>

      {/* 7. HOMEPAGE FAQ SECTION */}
      <HomeFaqSection />

      {/* 8. TRUST BAR — Apple Squircle Feature Triplets */}
      <section className="py-12 bg-white border-t border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 bg-[#f5f5f7] rounded-2xl p-4 sm:p-5 border border-black/[0.06]">
              <span className="text-3xl">🇬🇧</span>
              <div>
                <h4 className="font-semibold text-sm text-[#1d1d1f] tracking-tight">UK registered pharmacy</h4>
                <p className="text-xs text-slate-500 mt-0.5">Dispensed strictly by licensed GPhC pharmacies.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-[#f5f5f7] rounded-2xl p-4 sm:p-5 border border-black/[0.06]">
              <div className="w-10 h-10 rounded-xl bg-white text-[#09653d] border border-black/[0.06] flex items-center justify-center shrink-0 shadow-2xs">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-[#1d1d1f] tracking-tight">30-day BACS invoicing</h4>
                <p className="text-xs text-slate-500 mt-0.5">Instant credit terms for UK schools and academies.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-[#f5f5f7] rounded-2xl p-4 sm:p-5 border border-black/[0.06]">
              <div className="w-10 h-10 rounded-xl bg-white text-[#09653d] border border-black/[0.06] flex items-center justify-center shrink-0 shadow-2xs">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-[#1d1d1f] tracking-tight">Prompt 3–4 day delivery</h4>
                <p className="text-xs text-slate-500 mt-0.5">Tracked medical courier transport direct to school.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. READY TO PROTECT YOUR SCHOOL? — Apple Keynote Callout */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#e8f5f1] via-[#f0f9f6] to-[#e8f5f1] text-[#1d1d1f] rounded-[30px] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-[#09653d]/15 shadow-2xs">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="font-bold text-2xl sm:text-3xl tracking-tight">Ready to equip your school?</h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Choose your adrenaline pens and complete your school order in just a few minutes.
              </p>
            </div>

            <Link
              href="/order-pens"
              className="px-8 py-3.5 rounded-full bg-[#09653d] hover:bg-[#064e2e] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow shrink-0 flex items-center gap-2 apple-btn"
            >
              <span>Order Emergency Pens</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Requisition Modal (kept for manual trigger when requested) */}
      <RequisitionModal isOpen={isReqModalOpen} onClose={() => setIsReqModalOpen(false)} />
    </div>
  );
}
