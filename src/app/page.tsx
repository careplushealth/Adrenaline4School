'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import RequisitionModal from '@/components/RequisitionModal';
import MedicalDeviceVisual from '@/components/MedicalDeviceVisual';
import FourStepProcess from '@/components/FourStepProcess';
import HeroSceneIllustration from '@/components/HeroSceneIllustration';
import PupilsIllustration from '@/components/PupilsIllustration';
import {
  ShieldCheck,
  Truck,
  BellRing,
  FileSignature,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Shield,
  Lock,
  Headphones,
  Lightbulb,
  Building2,
  Calendar,
} from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error('Failed to load products', err));
  }, []);

  return (
    <div className="bg-white text-[#0c2340] selection:bg-[#096556] selection:text-white font-sans">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-16 md:pb-20 bg-gradient-to-b from-[#f0faf7] via-white to-white border-b border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column Copy */}
            <div className="lg:col-span-7 space-y-6 animate-fade-in-up">
              <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-[#096556] uppercase">
                SUPPORTING SCHOOL ALLERGY SAFETY
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-[#0c2340] tracking-tight leading-[1.12]">
                Emergency adrenaline<br />
                pens for schools,<br />
                made simple.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Helping schools meet new allergy safety requirements with a straightforward ordering process, pharmacy fulfilment and <strong className="font-semibold text-[#0c2340]">free expiry reminders</strong>.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/order-pens"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#096556] hover:bg-[#075145] text-white font-semibold text-sm tracking-wide shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <span>Choose your pens</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white hover:bg-slate-50 text-[#0c2340] font-semibold text-sm border border-slate-300 hover:border-slate-400 transition-all shadow-xs"
                >
                  <span>How it works</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsReqModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-full bg-[#f0faf7] hover:bg-[#e0f5ef] text-[#096556] font-semibold text-xs border border-[#c6eee3] transition-all"
                >
                  <FileSignature className="w-3.5 h-3.5 text-[#096556]" />
                  <span>Requisition Form PDF</span>
                </button>
              </div>

              {/* Trust Indicators Bar */}
              <div className="pt-4 flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-slate-700">
                <span className="flex items-center gap-2 font-semibold">
                  <CheckCircle className="w-4 h-4 text-[#096556] shrink-0" />
                  Pharmacy supplied
                </span>
                <span className="flex items-center gap-2 font-semibold">
                  <CheckCircle className="w-4 h-4 text-[#096556] shrink-0" />
                  Tracked delivery
                </span>
                <span className="flex items-center gap-2 font-semibold">
                  <CheckCircle className="w-4 h-4 text-[#096556] shrink-0" />
                  Expiry reminders
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

      {/* 2. STATUTORY BENEDICT'S LAW 2026 GUIDANCE */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#f4faf8] rounded-3xl p-8 sm:p-12 border border-[#d8eee6] shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column Guidance */}
              <div className="lg:col-span-7 space-y-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#096556]">
                  BENEDICT&apos;S LAW
                </p>

                <h2 className="text-3xl sm:text-4xl font-bold text-[#0c2340] tracking-tight leading-tight">
                  New allergy safety requirements for schools
                </h2>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
                  From September 2026, new statutory guidance (often referred to as Benedict&apos;s Law) expects schools in England to strengthen their allergy preparedness, including:
                </p>

                <ul className="space-y-3 pt-2 text-sm text-slate-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#096556] shrink-0 mt-0.5" />
                    <span>Keeping spare adrenaline auto-injectors available and accessible for emergencies</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#096556] shrink-0 mt-0.5" />
                    <span>Having an allergy policy</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#096556] shrink-0 mt-0.5" />
                    <span>Ensuring staff receive appropriate allergy training</span>
                  </li>
                </ul>

                <div className="pt-3">
                  <a
                    href="https://www.gov.uk/government/publications/using-emergency-adrenaline-auto-injectors-in-schools"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#096556] hover:text-[#075145] hover:underline"
                  >
                    <span>Read the official government guidance</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Right Column Memorial & Pupils Callout */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="font-bold text-xl text-[#0c2340] tracking-tight">
                  Benedict&apos;s Law is about keeping pupils safer.
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  The new guidance follows the tragic death of Benedict Blythe, helping to ensure schools are better prepared to respond to severe allergic reactions (anaphylaxis).
                </p>

                {/* Pupils Illustration */}
                <PupilsIllustration />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. A SIMPLE 4-STEP PROCESS (Enlarged & Non-Clipped Animations) */}
      <FourStepProcess />

      {/* 4. WHY SCHOOLS CHOOSE ADRENALINE4SCHOOLS */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#f4faf8] rounded-3xl p-8 sm:p-12 border border-[#d8eee6]">
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0c2340] tracking-tight">
                Why schools choose Adrenaline<span className="text-[#096556]">4</span>Schools
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {/* Item 1: Simple process */}
              <div className="flex flex-col items-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#e6f5f1] text-[#096556] border border-[#c6eee3] flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-base text-[#0c2340]">Simple process</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-[210px]">
                  We handle the paperwork and guide you at every step.
                </p>
              </div>

              {/* Item 2: Pharmacy supplied */}
              <div className="flex flex-col items-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#e6f5f1] text-[#096556] border border-[#c6eee3] flex items-center justify-center shadow-xs">
                  <Building2 className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-base text-[#0c2340]">Pharmacy supplied</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-[210px]">
                  Dispensed by a UK GPhC registered pharmacy.
                </p>
              </div>

              {/* Item 3: Tracked delivery */}
              <div className="flex flex-col items-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#e6f5f1] text-[#096556] border border-[#c6eee3] flex items-center justify-center shadow-xs">
                  <Truck className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-base text-[#0c2340]">Tracked delivery</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-[210px]">
                  Next working day delivery as standard.
                </p>
              </div>

              {/* Item 4: Expiry reminders */}
              <div className="flex flex-col items-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#e6f5f1] text-[#096556] border border-[#c6eee3] flex items-center justify-center shadow-xs">
                  <Calendar className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-base text-[#0c2340]">Expiry reminders</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-[210px]">
                  We keep track of your pens and contact you before they need replacing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CHOOSE FROM THE LEADING ADRENALINE PENS */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0c2340] tracking-tight">
              Choose from the leading adrenaline pens
            </h2>
            <p className="text-slate-600 text-sm">
              We offer the main brands used in UK schools, with clear pricing and simple ordering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* EpiPen Spotlight Card */}
            <div className="bg-[#fbfbf6] rounded-3xl p-8 border border-slate-200/90 shadow-xs flex items-center gap-6 sm:gap-8 hover:border-[#096556] hover:shadow-md transition-all">
              <div className="shrink-0 flex items-center justify-center">
                <MedicalDeviceVisual type="epipen-300" size="sm" />
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-2xl text-[#0c2340]">EpiPen®</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Available in 150 microgram and 300 microgram strengths.
                </p>
                <Link
                  href="/order-pens"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-slate-300 bg-white text-[#0c2340] hover:bg-[#096556] hover:text-white hover:border-[#096556] text-xs font-semibold transition-all shadow-2xs"
                >
                  <span>View EpiPen options</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Jext Spotlight Card */}
            <div className="bg-[#f0f6fa] rounded-3xl p-8 border border-slate-200/90 shadow-xs flex items-center gap-6 sm:gap-8 hover:border-[#096556] hover:shadow-md transition-all">
              <div className="shrink-0 flex items-center justify-center">
                <MedicalDeviceVisual type="jext-150" size="sm" />
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-2xl text-[#0c2340]">Jext®</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Available in 150 microgram and 300 microgram strengths.
                </p>
                <Link
                  href="/order-pens"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-slate-300 bg-white text-[#0c2340] hover:bg-[#096556] hover:text-white hover:border-[#096556] text-xs font-semibold transition-all shadow-2xs"
                >
                  <span>View Jext options</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. COMPLETE PRODUCT CATALOGUE */}
      <section className="py-16 md:py-20 bg-[#fbfdfd] border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#096556] bg-[#e6f5f1] px-3.5 py-1 rounded-full border border-[#c6eee3]">
              GPhC Dispensed Auto-Injectors
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0c2340] tracking-tight">
              Select emergency adrenaline pens for your school
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Available in 300mcg (secondary schools / pupils over 30kg) and 150mcg (primary schools / pupils 15-30kg). Supplied in twin packs with next working day courier delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/order-pens"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#096556] hover:bg-[#075145] text-white font-bold text-sm tracking-wide shadow-sm hover:shadow-md transition-all"
            >
              <span>View Full Store & Multi-School Ordering</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. TRUST BAR */}
      <section className="py-12 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 bg-[#f4faf8] rounded-2xl p-4 border border-[#d8eee6]">
              <span className="text-3xl">🇬🇧</span>
              <div>
                <h4 className="font-bold text-sm text-[#0c2340]">UK registered pharmacy</h4>
                <p className="text-xs text-slate-500">Supplied by a GPhC registered pharmacy.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-[#f4faf8] rounded-2xl p-4 border border-[#d8eee6]">
              <div className="w-10 h-10 rounded-xl bg-[#e6f5f1] text-[#096556] border border-[#c6eee3] flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#0c2340]">Secure ordering</h4>
                <p className="text-xs text-slate-500">Your documents and data are kept secure.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-[#f4faf8] rounded-2xl p-4 border border-[#d8eee6]">
              <div className="w-10 h-10 rounded-xl bg-[#e6f5f1] text-[#096556] border border-[#c6eee3] flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#0c2340]">Friendly support</h4>
                <p className="text-xs text-slate-500">Our team is here to help if you have any questions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. READY TO PROTECT YOUR SCHOOL? */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#e6f5f1] text-[#0c2340] rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-[#c6eee3] shadow-xs">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="font-bold text-2xl sm:text-3xl tracking-tight">Ready to protect your school?</h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Choose your adrenaline pens and complete your order in just a few minutes.
              </p>
            </div>

            <Link
              href="/order-pens"
              className="px-8 py-3.5 rounded-full bg-[#096556] hover:bg-[#075145] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-sm shrink-0 flex items-center gap-2"
            >
              <span>Get started now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. NOT SURE WHICH PENS YOU NEED? */}
      <section className="pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#f4f7f9] rounded-3xl p-6 sm:p-8 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#e6f5f1] border border-[#c6eee3] text-[#096556] flex items-center justify-center shrink-0">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base text-[#0c2340]">Not sure which pens you need?</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Visit our FAQs or contact our team for guidance on selecting the right adrenaline pens for your school.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/faqs"
                className="px-5 py-2.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-[#0c2340] text-xs font-semibold shadow-xs transition-colors"
              >
                View FAQs
              </Link>
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-[#0c2340] text-xs font-semibold shadow-xs transition-colors"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Requisition Modal */}
      <RequisitionModal isOpen={isReqModalOpen} onClose={() => setIsReqModalOpen(false)} />
    </div>
  );
}
