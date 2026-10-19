'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import RequisitionModal from '@/components/RequisitionModal';
import MedicalDeviceVisual from '@/components/MedicalDeviceVisual';
import {
  ShieldCheck,
  Truck,
  BellRing,
  FileSignature,
  CheckCircle,
  ArrowRight,
  Laptop,
  Scale,
  Sparkles,
  ExternalLink,
  GraduationCap,
  UploadCloud,
  FileText,
  Clock,
  Shield,
  Lock,
  Headphones,
  Lightbulb,
} from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [heroTab, setHeroTab] = useState<'epipen' | 'jext' | 'station'>('epipen');

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
    <div className="bg-ivory text-forest-900 selection:bg-sage-600 selection:text-white font-sans">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-24 bg-gradient-to-b from-linen/40 via-ivory to-ivory border-b border-stone-200/60 overflow-hidden">
        {/* Subtle organic texture pattern */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #16231a 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            {/* Left Column Copy */}
            <div className="lg:col-span-7 space-y-7 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage-50 border border-sage-200/80 text-sage-900 text-xs font-medium tracking-wide">
                <span className="w-2 h-2 rounded-full bg-sage-600 animate-pulse"></span>
                <span>SUPPORTING SCHOOL ALLERGY SAFETY · GPhC Regulated</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-forest-950 tracking-tight leading-[1.14]">
                Emergency adrenaline pens for schools,{' '}
                <span className="italic font-normal text-sage-700">made simple.</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed">
                Helping schools meet new allergy safety requirements with a straightforward ordering process, pharmacy fulfilment, and <strong className="font-semibold text-forest-950">free automated expiry reminders</strong>.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href="/order-pens"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-forest-900 hover:bg-forest-800 text-ivory font-medium text-sm tracking-wide shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <span>Choose Your Pens</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white/90 hover:bg-white text-forest-900 font-medium text-sm border border-stone-200/90 hover:border-sage-400 transition-all shadow-xs"
                >
                  <span>How It Works</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsReqModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-full bg-linen/50 hover:bg-linen text-stone-700 font-medium text-xs border border-stone-200/70 transition-all"
                >
                  <FileSignature className="w-3.5 h-3.5 text-sage-700" />
                  <span>Requisition Form PDF</span>
                </button>
              </div>

              {/* Trust Indicators Bar */}
              <div className="pt-4 flex flex-wrap items-center gap-y-3 gap-x-3 text-xs text-forest-900">
                <span className="flex items-center gap-2 bg-white/80 px-3.5 py-1.5 rounded-full border border-stone-200/70 shadow-xs font-medium">
                  <CheckCircle className="w-4 h-4 text-sage-600 shrink-0" />
                  Pharmacy Supplied
                </span>
                <span className="flex items-center gap-2 bg-white/80 px-3.5 py-1.5 rounded-full border border-stone-200/70 shadow-xs font-medium">
                  <CheckCircle className="w-4 h-4 text-sage-600 shrink-0" />
                  Tracked Delivery
                </span>
                <span className="flex items-center gap-2 bg-white/80 px-3.5 py-1.5 rounded-full border border-stone-200/70 shadow-xs font-medium">
                  <CheckCircle className="w-4 h-4 text-sage-600 shrink-0" />
                  Expiry Reminders
                </span>
              </div>
            </div>

            {/* Right Column: Medical Device Showcase with Controlled Compact Sizing */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Showcase Canvas Card */}
                <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-[0_16px_40px_-12px_rgba(22,35,26,0.06)]">
                  {/* Selector Tabs */}
                  <div className="flex rounded-full bg-linen/70 p-1 mb-6 text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setHeroTab('epipen')}
                      className={`flex-1 py-2 rounded-full transition-all ${
                        heroTab === 'epipen' ? 'bg-forest-900 text-ivory shadow-xs font-semibold' : 'text-stone-600 hover:text-forest-900'
                      }`}
                    >
                      EpiPen®
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroTab('jext')}
                      className={`flex-1 py-2 rounded-full transition-all ${
                        heroTab === 'jext' ? 'bg-forest-900 text-ivory shadow-xs font-semibold' : 'text-stone-600 hover:text-forest-900'
                      }`}
                    >
                      Jext®
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroTab('station')}
                      className={`flex-1 py-2 rounded-full transition-all ${
                        heroTab === 'station' ? 'bg-forest-900 text-ivory shadow-xs font-semibold' : 'text-stone-600 hover:text-forest-900'
                      }`}
                    >
                      Emergency Kit
                    </button>
                  </div>

                  {/* Device Illustration Stage with Generous Breathing Room */}
                  <div className="h-64 flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-linen/30 to-white/60 rounded-2xl border border-stone-100 p-6">
                    {/* Ambient organic aura */}
                    <div className="absolute w-44 h-44 rounded-full bg-sage-100/50 blur-2xl pointer-events-none" />

                    {heroTab === 'epipen' && (
                      <div className="flex items-center justify-center gap-8 relative z-10 transition-all duration-300">
                        <div className="flex flex-col items-center">
                          <MedicalDeviceVisual type="epipen-300" size="md" />
                          <span className="text-[11px] font-semibold text-forest-950 block mt-2">Adult 300mcg</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <MedicalDeviceVisual type="epipen-150" size="md" />
                          <span className="text-[11px] font-semibold text-sage-800 block mt-2">Junior 150mcg</span>
                        </div>
                      </div>
                    )}

                    {heroTab === 'jext' && (
                      <div className="flex items-center justify-center gap-8 relative z-10 transition-all duration-300">
                        <div className="flex flex-col items-center">
                          <MedicalDeviceVisual type="jext-300" size="md" />
                          <span className="text-[11px] font-semibold text-forest-950 block mt-2">Adult 300mcg</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <MedicalDeviceVisual type="jext-150" size="md" />
                          <span className="text-[11px] font-semibold text-sage-800 block mt-2">Junior 150mcg</span>
                        </div>
                      </div>
                    )}

                    {heroTab === 'station' && (
                      <div className="flex items-center justify-center relative z-10 transition-all duration-300">
                        <MedicalDeviceVisual type="wall-station" size="md" />
                      </div>
                    )}
                  </div>

                  {/* Expiry Tracking Tag */}
                  <div className="mt-4 p-3 rounded-2xl bg-linen/60 border border-stone-200/60 flex items-center justify-between text-xs">
                    <span className="font-medium text-forest-950 flex items-center gap-2">
                      <BellRing className="w-4 h-4 text-sage-700" />
                      Automatic Expiry Tracking Engine
                    </span>
                    <span className="text-[11px] font-semibold text-stone-500">12m · 6m · 3m · 1m</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATUTORY BENEDICT'S LAW 2026 GUIDANCE */}
      <section className="py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-forest-950 rounded-3xl p-8 sm:p-12 text-stone-200 shadow-[0_20px_50px_-20px_rgba(22,35,26,0.25)] relative overflow-hidden border border-forest-900/60">
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, #FAF8F5 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              <div className="lg:col-span-7 space-y-5">
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-gold-400/20 text-gold-300 border border-gold-400/30">
                  <Scale className="w-3.5 h-3.5" />
                  BENEDICT&apos;S LAW
                </span>

                <h2 className="text-3xl sm:text-4xl font-serif font-normal text-ivory tracking-tight leading-tight">
                  New allergy safety requirements for schools
                </h2>

                <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-sans">
                  From September 2026, new statutory guidance (often referred to as Benedict&apos;s Law) expects schools in England to strengthen their allergy preparedness, including:
                </p>

                <ul className="space-y-3 pt-2 text-sm text-stone-300">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-sage-700/30 text-sage-300 flex items-center justify-center shrink-0 mt-0.5 border border-sage-500/30">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </div>
                    <span><strong className="text-ivory font-medium">Keeping spare adrenaline auto-injectors</strong> available and accessible for emergencies without named pupil prescriptions.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-sage-700/30 text-sage-300 flex items-center justify-center shrink-0 mt-0.5 border border-sage-500/30">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </div>
                    <span><strong className="text-ivory font-medium">Having a whole-school allergy policy</strong> and individual healthcare plans (IHPs).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-sage-700/30 text-sage-300 flex items-center justify-center shrink-0 mt-0.5 border border-sage-500/30">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </div>
                    <span><strong className="text-ivory font-medium">Ensuring staff receive appropriate allergy training</strong> with certified CPD modules.</span>
                  </li>
                </ul>

                <div className="pt-4 flex flex-wrap gap-4">
                  <Link
                    href="/benedicts-law"
                    className="px-6 py-3.5 rounded-full bg-gold-400 hover:bg-gold-300 text-forest-950 font-semibold text-xs uppercase tracking-wider transition-all inline-flex items-center gap-2 shadow-sm"
                  >
                    <span>Read Benedict&apos;s Law School Guide</span>
                    <ArrowRight className="w-4 h-4 font-bold" />
                  </Link>

                  <a
                    href="https://www.gov.uk/government/publications/using-emergency-adrenaline-auto-injectors-in-schools"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-stone-200 font-medium text-xs inline-flex items-center gap-1.5 transition-colors border border-white/20"
                  >
                    <span>Official Gov.uk Guidance</span>
                    <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                  </a>
                </div>
              </div>

              {/* Right Side Memorial Callout */}
              <div className="lg:col-span-5 bg-white/5 rounded-2xl p-6 sm:p-7 border border-white/10 backdrop-blur-sm space-y-4">
                <h3 className="font-serif text-lg text-ivory">Benedict&apos;s Law is about keeping pupils safer</h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  The new guidance follows the tragic death of Benedict Blythe. Helping to ensure schools are better prepared to respond to severe allergic reactions (anaphylaxis).
                </p>
                <div className="space-y-2.5 text-xs text-stone-300 pt-2 border-t border-white/10">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <p className="font-semibold text-gold-300">Human Medicines Regulations 2017</p>
                    <p className="text-[11px] text-stone-300 mt-1">Allows schools to purchase spare pens via Headteacher Requisition without individual pupil prescriptions.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <p className="font-semibold text-sage-300">30-Day BACS Payment</p>
                    <p className="text-[11px] text-stone-300 mt-1">No personal card needed. Purchase Order invoicing tailored for UK schools.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. A SIMPLE 4-STEP PROCESS (From Initial Design Reference) */}
      <section className="py-20 bg-linen/30 border-y border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-sage-800 bg-sage-50 px-3.5 py-1 rounded-full border border-sage-200">
              A Simple 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-forest-950 tracking-tight">
              Ordering your emergency pens is easy
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              We take care of the paperwork and pharmacy process, so you can focus on keeping your school safe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Choose your pens',
                desc: 'Select the brand, strength, and quantity your school needs.',
                icon: Laptop,
              },
              {
                step: '02',
                title: 'Sign your form',
                desc: 'We provide a pre-filled requisition form for your headteacher to sign.',
                icon: FileSignature,
              },
              {
                step: '03',
                title: 'Upload and approve',
                desc: 'Upload the signed form through our secure website for pharmacy approval.',
                icon: UploadCloud,
              },
              {
                step: '04',
                title: 'We deliver',
                desc: 'Your pens are dispatched next working day with tracked delivery from our GPhC registered pharmacy.',
                icon: Truck,
              },
            ].map((s) => (
              <div key={s.step} className="bg-white/90 rounded-2xl p-6 border border-stone-200/70 shadow-xs relative space-y-4 hover:border-sage-400 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-medium text-stone-400 uppercase tracking-wider">
                    Step {s.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl border border-sage-200/70 bg-sage-50 text-sage-800 flex items-center justify-center">
                    <s.icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-serif font-medium text-lg text-forest-950">{s.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY SCHOOLS CHOOSE ADRENALINE4SCHOOLS (From Initial Design Reference) */}
      <section className="py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-forest-950 tracking-tight">
              Why schools choose Adrenaline4Schools
            </h2>
            <p className="text-stone-600 text-sm">
              Purpose-built to simplify allergy safety, compliance, and pharmacy fulfilment for UK schools.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Simple process',
                desc: 'We handle the paperwork and guide you at every step.',
                icon: ShieldCheck,
              },
              {
                title: 'Pharmacy supplied',
                desc: 'Dispensed by a UK GPhC registered pharmacy partner.',
                icon: Shield,
              },
              {
                title: 'Tracked delivery',
                desc: 'Next working day delivery as standard directly to school reception.',
                icon: Truck,
              },
              {
                title: 'Expiry reminders',
                desc: 'We keep track of your pens and contact you before they need replacing.',
                icon: BellRing,
              },
            ].map((f, i) => (
              <div key={i} className="bg-white/80 rounded-2xl p-6 border border-stone-200/70 shadow-xs space-y-3 hover:border-sage-400 transition-all">
                <div className="w-10 h-10 rounded-xl bg-sage-50 text-sage-800 border border-sage-200/70 flex items-center justify-center">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-medium text-base text-forest-950">{f.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CHOOSE FROM THE LEADING ADRENALINE PENS (Brand Spotlight from Initial Design) */}
      <section className="py-16 bg-linen/20 border-t border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-forest-950 tracking-tight">
              Choose from the leading adrenaline pens
            </h2>
            <p className="text-stone-600 text-sm">
              We offer the main brands used in UK schools, with clear pricing and simple ordering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* EpiPen Spotlight Card */}
            <div className="bg-white/90 rounded-3xl p-8 border border-stone-200/80 shadow-xs flex items-center gap-8 hover:border-sage-400 transition-all">
              <div className="shrink-0 flex items-center justify-center">
                <MedicalDeviceVisual type="epipen-300" size="sm" />
              </div>
              <div className="space-y-3">
                <h3 className="font-serif font-medium text-2xl text-forest-950">EpiPen®</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Available in 150 microgram and 300 microgram strengths with iconic safety release.
                </p>
                <Link
                  href="/order-pens"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-stone-200/90 text-forest-950 hover:bg-forest-900 hover:text-ivory text-xs font-medium transition-all"
                >
                  <span>View EpiPen options</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Jext Spotlight Card */}
            <div className="bg-white/90 rounded-3xl p-8 border border-stone-200/80 shadow-xs flex items-center gap-8 hover:border-sage-400 transition-all">
              <div className="shrink-0 flex items-center justify-center">
                <MedicalDeviceVisual type="jext-150" size="sm" />
              </div>
              <div className="space-y-3">
                <h3 className="font-serif font-medium text-2xl text-forest-950">Jext®</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Available in 150 microgram and 300 microgram strengths with black needle shield.
                </p>
                <Link
                  href="/order-pens"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-stone-200/90 text-forest-950 hover:bg-forest-900 hover:text-ivory text-xs font-medium transition-all"
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
      <section className="py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-sage-800 bg-sage-50 px-3.5 py-1 rounded-full border border-sage-200">
              GPhC Dispensed Auto-Injectors
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-forest-950 tracking-tight">
              Select emergency adrenaline pens for your school
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
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
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-forest-900 hover:bg-forest-800 text-ivory font-medium text-sm tracking-wide shadow-xs hover:shadow-md transition-all"
            >
              <span>View Full Store & Multi-School Ordering</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. TRUST BAR (UK Flag, Secure, Friendly Support from Initial Design) */}
      <section className="py-12 bg-linen/30 border-y border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 bg-white/70 rounded-2xl p-4 border border-stone-200/60">
              <span className="text-3xl">🇬🇧</span>
              <div>
                <h4 className="font-serif font-medium text-sm text-forest-950">UK registered pharmacy</h4>
                <p className="text-xs text-stone-500">Supplied by a GPhC registered partner pharmacy.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/70 rounded-2xl p-4 border border-stone-200/60">
              <div className="w-10 h-10 rounded-xl bg-sage-50 text-sage-800 border border-sage-200 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-medium text-sm text-forest-950">Secure ordering</h4>
                <p className="text-xs text-stone-500">Your documents, requisitions, and data are kept secure.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/70 rounded-2xl p-4 border border-stone-200/60">
              <div className="w-10 h-10 rounded-xl bg-sage-50 text-sage-800 border border-sage-200 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-medium text-sm text-forest-950">Friendly support</h4>
                <p className="text-xs text-stone-500">Our dedicated team is here to help if you have any questions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CPD STAFF TRAINING PROMO */}
      <section className="py-16 bg-forest-950 text-stone-200 border-t border-forest-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-sage-800/40 text-sage-300 border border-sage-700/40">
                Staff Academy & Compliance
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-normal text-ivory">
                Free CPD-Accredited Allergy Training for School Staff
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
                Every school customer receives unlimited staff access to our online video modules covering anaphylaxis recognition, A-B-C protocols, pen administration, and emergency action plans with printable CPD certificates.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <Link
                href="/training"
                className="px-6 py-3.5 rounded-full bg-gold-400 hover:bg-gold-300 text-forest-950 font-semibold text-xs uppercase tracking-wider transition-all shadow-xs"
              >
                Access Staff Training Courses &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9. READY TO PROTECT YOUR SCHOOL? (CTA Banner from Initial Design) */}
      <section className="py-16 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-forest-900 text-ivory rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-forest-800 shadow-xs">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="font-serif font-normal text-2xl sm:text-3xl">Ready to protect your school?</h3>
              <p className="text-xs sm:text-sm text-stone-300">
                Choose your adrenaline pens and complete your order in just a few minutes.
              </p>
            </div>

            <Link
              href="/order-pens"
              className="px-8 py-3.5 rounded-full bg-gold-400 hover:bg-gold-300 text-forest-950 font-semibold text-xs uppercase tracking-wider transition-all shadow-xs shrink-0 flex items-center gap-2"
            >
              <span>Get started now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 10. NOT SURE WHICH PENS YOU NEED? (Bottom Prompt Banner from Initial Design) */}
      <section className="pb-16 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-linen/40 rounded-3xl p-6 sm:p-8 border border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-100/70 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-medium text-base text-forest-950">Not sure which pens you need?</h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Visit our FAQs or contact our team for guidance on selecting the right adrenaline pens for your school.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/faqs"
                className="px-5 py-2.5 rounded-full border border-stone-200 bg-white/90 hover:bg-white text-forest-950 text-xs font-medium shadow-xs transition-colors"
              >
                View FAQs
              </Link>
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-full border border-stone-200 bg-white/90 hover:bg-white text-forest-950 text-xs font-medium shadow-xs transition-colors"
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
