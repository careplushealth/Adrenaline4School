'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import RequisitionModal from '@/components/RequisitionModal';
import FlipUrgencyTimer from '@/components/FlipUrgencyTimer';
import {
  Search,
  SlidersHorizontal,
  FileText,
  ShoppingBag,
  CheckCircle,
  BellRing,
  ArrowRight,
  ShieldCheck,
  Truck,
  Zap,
} from 'lucide-react';

export default function OrderPensPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [strengthFilter, setStrengthFilter] = useState('all');
  const [isReqOpen, setIsReqOpen] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        // Filter out wall-station or emergency kit items
        const penProducts = (data.products || []).filter(
          (p: Product) =>
            p.is_available === 1 &&
            !p.slug.includes('wall') &&
            !p.name.toLowerCase().includes('wall station') &&
            !p.name.toLowerCase().includes('grab bag')
        );
        setProducts(penProducts);
        setFiltered(penProducts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = products;
    if (brandFilter !== 'all') result = result.filter((p) => p.brand === brandFilter);
    if (strengthFilter !== 'all') result = result.filter((p) => p.strength.includes(strengthFilter));
    if (search) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [search, brandFilter, strengthFilter, products]);

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f]">
      {/* Page Header — Apple Dark Editorial Banner */}
      <section className="bg-[#062e1c] text-slate-200 py-16 sm:py-20 px-4 relative overflow-hidden border-b border-white/[0.08]">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-3 font-sans">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white font-medium">Emergency Auto-Injectors</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-[-0.03em] mb-3">
            Emergency Adrenaline Pens for Schools
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed font-sans">
            Official pupil auto-injectors dispensed by our UK registered GPhC partner pharmacy with cold-chain courier transport and automated 12/6/3/1m expiry monitoring.
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5 text-xs">
            <span className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-300 rounded-full px-4 py-1.5 border border-emerald-500/20 font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              £99.99 per pen
            </span>
            <span className="inline-flex items-center gap-2 bg-white/[0.06] text-slate-200 rounded-full px-4 py-1.5 border border-white/[0.1] font-medium">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              Delivered in 3 to 4 working days
            </span>
            <span className="inline-flex items-center gap-2 bg-white/[0.06] text-slate-200 rounded-full px-4 py-1.5 border border-white/[0.1] font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              30-Day BACS School Invoice
            </span>
            <span className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-300 rounded-full px-4 py-1.5 border border-emerald-500/20 font-medium">
              <BellRing className="w-3.5 h-3.5 text-emerald-400" />
              Free Expiry Reminders
            </span>
          </div>
        </div>
      </section>

      {/* CRO Urgency & Expiry Disclaimer Notice Bar */}
      <div className="bg-[#f5f5f7] border-b border-black/[0.06] py-3.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Expiry Tracking Disclaimer */}
          <div className="flex items-center gap-3 text-[#1d1d1f] font-sans">
            <div className="w-8 h-8 rounded-xl bg-[#09653d] text-white flex items-center justify-center shrink-0">
              <BellRing className="w-4 h-4" />
            </div>
            <div className="text-xs sm:text-[13px] text-slate-700">
              <strong className="font-semibold text-[#1d1d1f]">We&apos;ll remind you when your pens expire:</strong> Automated notifications sent at 12, 6, 3, and 1 month before expiry so your school is always compliant.
            </div>
          </div>

          {/* Action Button */}
          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => setIsReqOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#09653d] hover:bg-[#064e2e] text-white text-xs font-semibold rounded-full transition-all shadow-xs apple-btn"
            >
              <FileText className="w-3.5 h-3.5" />
              Requisition PDF
            </button>
          </div>
        </div>
      </div>

      {/* Main Shop Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Flip-Clock Urgency Timer Banner */}
        <FlipUrgencyTimer
          title="Subsidised School Pen Pricing Offer Ends In:"
        />

        {/* Strength Quick Clinical Reference — Strictly for Pupils */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#f5f5f7] border border-black/[0.06] rounded-[22px] p-5 flex gap-4 items-center">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#09653d] flex flex-col items-center justify-center font-bold text-sm shrink-0 leading-tight border border-black/[0.06] shadow-2xs">
              300
              <span className="text-[8px] font-sans font-semibold text-[#09653d]">mcg</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-[#1d1d1f] text-[15px] tracking-tight">
                  300 micrograms — Secondary Pupils (&gt;30kg)
                </h3>
                <div className="flex items-center gap-1.5">
                  <span className="line-through text-slate-400 text-xs font-normal">£120.00</span>
                  <span className="text-[12px] font-bold text-[#09653d] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Now £99.99
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mt-0.5 font-sans">
                Calibrated for pupils weighing over 30kg (approx. Year 7 and secondary schools).
              </p>
            </div>
          </div>

          <div className="bg-[#f5f5f7] border border-black/[0.06] rounded-[22px] p-5 flex gap-4 items-center">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#09653d] flex flex-col items-center justify-center font-bold text-sm shrink-0 leading-tight border border-black/[0.06] shadow-2xs">
              150
              <span className="text-[8px] font-sans font-semibold text-[#09653d]">mcg</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-[#1d1d1f] text-[15px] tracking-tight">
                  150 micrograms — Primary & Junior Pupils (15–30kg)
                </h3>
                <div className="flex items-center gap-1.5">
                  <span className="line-through text-slate-400 text-xs font-normal">£120.00</span>
                  <span className="text-[12px] font-bold text-[#09653d] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Now £99.99
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mt-0.5 font-sans">
                Calibrated for younger pupils weighing 15–30kg (approx. Reception to Year 6).
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls Toolbar */}
        <div className="bg-[#f5f5f7] rounded-[22px] border border-black/[0.06] p-4 mb-8 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search adrenaline auto-injectors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-black/[0.08] text-xs font-sans text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#09653d]/20 focus:border-[#09653d] bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="py-2.5 px-3.5 rounded-full border border-black/[0.08] text-xs font-sans font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#09653d]/20 bg-white cursor-pointer transition-all"
            >
              <option value="all">All Brands</option>
              <option value="EpiPen">EpiPen®</option>
              <option value="Jext">Jext®</option>
            </select>

            <select
              value={strengthFilter}
              onChange={(e) => setStrengthFilter(e.target.value)}
              className="py-2.5 px-3.5 rounded-full border border-black/[0.08] text-xs font-sans font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#09653d]/20 bg-white cursor-pointer transition-all"
            >
              <option value="all">All Strengths</option>
              <option value="300">300mcg (Pupils &gt;30kg)</option>
              <option value="150">150mcg (Pupils 15–30kg)</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-[#f5f5f7] rounded-[26px] border border-black/[0.06] h-96 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-[#f5f5f7] rounded-[26px] border border-black/[0.06] p-8">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="font-semibold text-[#1d1d1f] text-lg tracking-tight">No auto-injectors match your filter criteria.</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing your search query or selecting &quot;All Brands&quot;.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Basket Checkout Callout — Apple Dark Banner */}
        <div className="mt-14 p-8 bg-[#062e1c] rounded-[30px] text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 border border-white/[0.08]">
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight">Ready to submit your school order?</h3>
            <p className="text-xs text-slate-300 font-sans">
              All pens are £99.99 ex VAT. Select 30-day BACS school invoice or instant card payment at checkout. Delivered in 3 to 4 working days.
            </p>
          </div>

          <Link
            href="/basket"
            className="px-7 py-3.5 rounded-full bg-[#09653d] hover:bg-[#064e2e] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-sm shrink-0 flex items-center gap-2 apple-btn"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span>Go to Basket & Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <RequisitionModal isOpen={isReqOpen} onClose={() => setIsReqOpen(false)} />
    </div>
  );
}
