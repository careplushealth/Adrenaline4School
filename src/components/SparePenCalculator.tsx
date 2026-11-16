'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import {
  Calculator,
  ShieldCheck,
  Building,
  Users,
  MapPin,
  CheckCircle,
  ArrowRight,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function SparePenCalculator() {
  const router = useRouter();
  const { addToCart, clearCart } = useCart();

  // Inputs
  const [phase, setPhase] = useState<'primary' | 'secondary' | 'allthrough'>('primary');
  const [rollSize, setRollSize] = useState<'small' | 'medium' | 'large' | 'campus'>('medium');
  const [zones, setZones] = useState<number>(2);
  const [allergicCount, setAllergicCount] = useState<number>(4);
  const [isAdded, setIsAdded] = useState(false);

  // Calculate under Benedict's Law guidelines:
  // Benedict's law stipulates emergency spare pens must be held in PAIRS (twin packs),
  // accessible within 3-5 minutes from any classroom, dining hall, or sports facility,
  // calibrated by weight (150mcg for primary 15-30kg, 300mcg for secondary >30kg).
  const calculatePens = () => {
    // Base pairs needed based on campus zones / buildings
    const locations = Math.max(1, zones);

    let juniorPens = 0; // 150mcg
    let seniorPens = 0; // 300mcg

    if (phase === 'primary') {
      // Primary schools primarily need 150mcg pens (always in pairs of 2)
      juniorPens = locations * 2;
      // High allergy count or large roll adds an extra reserve pair
      if (allergicCount > 6 || rollSize === 'large' || rollSize === 'campus') {
        juniorPens += 2;
      }
      // For Year 6 pupils who may exceed 30kg, a pair of 300mcg is recommended
      seniorPens = 2;
    } else if (phase === 'secondary') {
      // Secondary schools primarily need 300mcg pens (always in pairs of 2)
      seniorPens = locations * 2;
      if (allergicCount > 8 || rollSize === 'large' || rollSize === 'campus') {
        seniorPens += 2;
      }
      juniorPens = 0;
    } else {
      // All-through schools (Nursery to Sixth Form) need both junior and senior in pairs
      juniorPens = Math.ceil(locations / 2) * 2;
      seniorPens = Math.ceil(locations / 2) * 2;
      if (juniorPens < 2) juniorPens = 2;
      if (seniorPens < 2) seniorPens = 2;
      if (allergicCount > 8) {
        juniorPens += 2;
        seniorPens += 2;
      }
    }

    const totalPens = juniorPens + seniorPens;
    const pricePerPen = 60.69;
    const totalPrice = totalPens * pricePerPen;

    return {
      juniorPens,
      seniorPens,
      totalPens,
      locations,
      totalPrice,
    };
  };

  const results = calculatePens();

  const handleOrderRecommendation = () => {
    setIsAdded(true);

    // Epipen or Jext objects
    if (results.juniorPens > 0) {
      addToCart(
        {
          id: 'prod-epipen-150',
          slug: 'epipen-150mcg',
          brand: 'EpiPen',
          name: 'EpiPen® Junior 150 micrograms (Pupils 15-30kg)',
          strength: '150 micrograms',
          target_group: 'Primary school pupils (15kg - 30kg)',
          pack_size: 'Emergency Auto-Injector (1 x Pen)',
          price: 60.69,
          vat_rate: 0.2,
          is_available: 1,
          requires_headteacher_requisition: 1,
          requires_pharmacy_approval: 1,
          description: 'Emergency adrenaline auto-injector calibrated for primary pupils.',
          clinical_notes: '150mcg dose.',
          storage_instructions: 'Store below 25°C.',
          image_url: '/images/epipen-150.png',
          display_order: 2,
        },
        results.juniorPens
      );
    }

    if (results.seniorPens > 0) {
      addToCart(
        {
          id: 'prod-epipen-300',
          slug: 'epipen-300mcg',
          brand: 'EpiPen',
          name: 'EpiPen® 300 micrograms (Pupils >30kg)',
          strength: '300 micrograms',
          target_group: 'Pupils over 30kg (approx. Year 7+)',
          pack_size: 'Emergency Auto-Injector (1 x Pen)',
          price: 60.69,
          vat_rate: 0.2,
          is_available: 1,
          requires_headteacher_requisition: 1,
          requires_pharmacy_approval: 1,
          description: 'Emergency adrenaline auto-injector for pupils over 30kg.',
          clinical_notes: '300mcg dose.',
          storage_instructions: 'Store below 25°C.',
          image_url: '/images/epipen-300.png',
          display_order: 1,
        },
        results.seniorPens
      );
    }

    setTimeout(() => {
      router.push('/basket');
    }, 400);
  };

  return (
    <div className="bg-[#f5f5f7] rounded-[32px] sm:rounded-[36px] p-6 sm:p-10 md:p-12 border border-black/[0.06] shadow-sm">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#09653d]/[0.08] border border-[#09653d]/15 text-[#09653d] text-xs font-semibold tracking-wide uppercase">
            <Calculator className="w-3.5 h-3.5 text-[#09653d]" />
            Benedict&apos;s Law Spare Pen Calculator
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#1d1d1f] tracking-[-0.03em]">
            How Many Spare Auto-Injectors Does Your School Need?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans">
            Under official UK Department for Education guidance and Benedict&apos;s Law standards, spare pens must be kept in pairs and located within 3 to 5 minutes of all pupil areas.
          </p>
        </div>

        {/* Calculator Grid: Inputs on Left, Recommendations on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Form */}
          <div className="lg:col-span-7 bg-white rounded-[26px] p-6 sm:p-8 border border-black/[0.06] shadow-2xs space-y-6">
            {/* Step 1: School Phase */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#09653d]" /> 1. School Phase & Pupil Age Group
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPhase('primary')}
                  className={`py-3 px-2 rounded-2xl text-xs font-semibold transition-all text-center border ${
                    phase === 'primary'
                      ? 'bg-[#09653d] text-white border-[#09653d] shadow-xs'
                      : 'bg-[#f5f5f7] text-[#1d1d1f] border-black/[0.06] hover:bg-slate-100'
                  }`}
                >
                  <span className="block font-bold">Primary</span>
                  <span className="text-[10px] opacity-80 font-normal">Ages 3–11</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPhase('secondary')}
                  className={`py-3 px-2 rounded-2xl text-xs font-semibold transition-all text-center border ${
                    phase === 'secondary'
                      ? 'bg-[#09653d] text-white border-[#09653d] shadow-xs'
                      : 'bg-[#f5f5f7] text-[#1d1d1f] border-black/[0.06] hover:bg-slate-100'
                  }`}
                >
                  <span className="block font-bold">Secondary</span>
                  <span className="text-[10px] opacity-80 font-normal">Ages 11–18</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPhase('allthrough')}
                  className={`py-3 px-2 rounded-2xl text-xs font-semibold transition-all text-center border ${
                    phase === 'allthrough'
                      ? 'bg-[#09653d] text-white border-[#09653d] shadow-xs'
                      : 'bg-[#f5f5f7] text-[#1d1d1f] border-black/[0.06] hover:bg-slate-100'
                  }`}
                >
                  <span className="block font-bold">All-Through</span>
                  <span className="text-[10px] opacity-80 font-normal">Ages 3–18</span>
                </button>
              </div>
            </div>

            {/* Step 2: Pupil Roll Size */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#09653d]" /> 2. Total Number of Pupils on Roll
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'small', label: '< 250 pupils' },
                  { key: 'medium', label: '250–600 pupils' },
                  { key: 'large', label: '600–1,200 pupils' },
                  { key: 'campus', label: '1,200+ pupils' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setRollSize(item.key as any)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-medium transition-all text-center border ${
                      rollSize === item.key
                        ? 'bg-[#09653d] text-white border-[#09653d] shadow-xs'
                        : 'bg-[#f5f5f7] text-slate-700 border-black/[0.04] hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Emergency Kit Locations / Campus Zones */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold uppercase tracking-wider text-slate-500 font-sans flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#09653d]" /> 3. Dedicated Emergency Locations
                </label>
                <span className="font-bold text-[#09653d] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {zones} Location{zones > 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-sans">
                e.g., Medical Room, Canteen/Dining Hall, Sports Pavilion, Detached Buildings (must be within 3–5 mins walk).
              </p>
              <input
                type="range"
                min="1"
                max="5"
                value={zones}
                onChange={(e) => setZones(parseInt(e.target.value))}
                className="w-full accent-[#09653d] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>1 Central Kit</span>
                <span>2 Locations</span>
                <span>3 Locations</span>
                <span>4 Locations</span>
                <span>5+ Locations</span>
              </div>
            </div>

            {/* Step 4: Known Allergic Pupils */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold uppercase tracking-wider text-slate-500 font-sans flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#09653d]" /> 4. Pupils with Diagnosed Severe Allergies
                </label>
                <span className="font-bold text-[#1d1d1f] bg-[#f5f5f7] px-2.5 py-0.5 rounded-full border border-black/[0.06]">
                  {allergicCount} {allergicCount === 1 ? 'pupil' : 'pupils'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={allergicCount}
                onChange={(e) => setAllergicCount(parseInt(e.target.value))}
                className="w-full accent-[#09653d] cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 font-sans">
                Note: Spare emergency pens operate as back-up stock when a pupil&apos;s own prescribed pens misfire, are inaccessible, or for undiagnosed first-time reactions.
              </p>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-5 bg-[#073620] text-white rounded-[26px] p-6 sm:p-8 shadow-md border border-white/[0.08] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.1]">
              <div>
                <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">
                  Compliance Recommendation
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">Benedict&apos;s Law Allocation</h3>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>

            {/* Breakdown Cards */}
            <div className="space-y-3">
              {results.juniorPens > 0 && (
                <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-white">150mcg Junior Pens (15–30kg)</p>
                    <p className="text-[11px] text-slate-300 font-sans">Primary / Junior pupil formulation</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-emerald-300 font-mono">{results.juniorPens}</span>
                    <span className="text-xs text-slate-400 block">pens</span>
                  </div>
                </div>
              )}

              {results.seniorPens > 0 && (
                <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-white">300mcg Senior Pens (&gt;30kg)</p>
                    <p className="text-[11px] text-slate-300 font-sans">Secondary / Older pupil formulation</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-emerald-300 font-mono">{results.seniorPens}</span>
                    <span className="text-xs text-slate-400 block">pens</span>
                  </div>
                </div>
              )}
            </div>

            {/* Total and Key Compliance Signals */}
            <div className="pt-2 border-t border-white/[0.1] space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-slate-300 font-sans">Total Recommended Pens</span>
                <span className="text-2xl font-bold text-white font-mono">{results.totalPens} Pens</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-slate-300 font-sans">Estimated Cost</span>
                <div className="text-right">
                  <span className="line-through text-slate-400 text-xs mr-2 font-normal">£{(100 * results.totalPens).toFixed(2)}</span>
                  <span className="text-xl font-bold text-emerald-300 font-mono">£{results.totalPrice.toFixed(2)}</span>
                  <span className="text-xs font-normal text-slate-400 ml-1">ex VAT</span>
                  <p className="text-[11px] text-emerald-400 font-medium">School savings: £{((100 - 60.69) * results.totalPens).toFixed(2)}</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Subsidised price of £60.69/pen (reduced from £100.00). Includes automated expiry tracking alerts at 12, 6, 3, and 1 month. 30-day BACS invoicing available.
              </p>
            </div>

            {/* Direct Add to Basket / Order CTA */}
            <button
              onClick={handleOrderRecommendation}
              className="w-full py-3.5 px-5 rounded-full bg-[#09653d] hover:bg-[#064e2e] text-white font-medium text-sm sm:text-[15px] tracking-normal flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-[0.98] apple-btn"
            >
              <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{isAdded ? 'Added! Going to Basket…' : 'Add recommended pens to basket'}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            <div className="text-center">
              <Link
                href="/order-pens"
                className="text-[11px] text-slate-300 hover:text-white underline font-sans"
              >
                Or browse all pens and custom quantities &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
