'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import RequisitionModal from '@/components/RequisitionModal';
import { Search, SlidersHorizontal, FileText, ShoppingBag, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

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
        setProducts(data.products || []);
        setFiltered(data.products || []);
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
    <div className="min-h-screen bg-white text-[#0c2340]">
      {/* Page Header */}
      <section className="bg-[#0c2340] text-slate-200 py-16 px-4 relative overflow-hidden border-b border-slate-800">
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
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
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-3">
            Emergency Adrenaline Pens for Schools
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed font-sans">
            All auto-injectors are dispensed by our UK registered GPhC partner pharmacy with cold-chain courier transport and automated 12/6/3/1m expiry monitoring.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-xs">
            <span className="flex items-center gap-2 bg-teal-500/20 text-teal-300 rounded-full px-4 py-2 border border-teal-500/30 font-semibold">
              <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
              Headteacher Requisition Included
            </span>
            <span className="flex items-center gap-2 bg-white/10 text-slate-200 rounded-full px-4 py-2 border border-white/15 font-semibold">
              <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
              30-Day BACS School Invoice
            </span>
            <span className="flex items-center gap-2 bg-white/10 text-slate-200 rounded-full px-4 py-2 border border-white/15 font-semibold">
              <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
              Next Working Day Tracked Delivery
            </span>
          </div>
        </div>
      </section>

      {/* Requisition Notice Banner */}
      <div className="bg-[#f0f7fb] border-b border-slate-200 py-3.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3 text-[#0c2340] font-sans">
            <AlertCircle className="w-5 h-5 text-[#007a60] shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <strong className="font-bold text-[#0c2340]">Human Medicines Regulations 2017:</strong> Emergency adrenaline auto-injectors can be held by schools without individual named pupil prescriptions via a signed Headteacher Requisition.
            </div>
          </div>
          <button
            onClick={() => setIsReqOpen(true)}
            className="shrink-0 flex items-center gap-2 px-4 py-2 bg-[#096556] hover:bg-[#075145] text-white text-xs font-bold rounded-full transition-all shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            Generate 1-Click Form
          </button>
        </div>
      </div>

      {/* Main Shop Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Strength Quick Clinical Reference */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-4 items-center shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#e6f5f1] text-[#096556] flex flex-col items-center justify-center font-bold text-sm shrink-0 leading-tight border border-[#c6eee3]">
              300
              <span className="text-[8px] font-sans font-semibold text-[#096556]">mcg</span>
            </div>
            <div>
              <h3 className="font-bold text-[#0c2340] text-sm">
                300 micrograms — Secondary Pupils & Adults (&gt;30kg)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-0.5 font-sans">
                For pupils and staff weighing over 30kg (approx. Year 7+). Supplied in regulated twin packs.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-4 items-center shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#e6f5f1] text-[#096556] flex flex-col items-center justify-center font-bold text-sm shrink-0 leading-tight border border-[#c6eee3]">
              150
              <span className="text-[8px] font-sans font-semibold text-[#096556]">mcg</span>
            </div>
            <div>
              <h3 className="font-bold text-[#0c2340] text-sm">
                150 micrograms — Primary & Junior Pupils (15–30kg)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-0.5 font-sans">
                Calibrated for younger children weighing 15–30kg (approx. Reception to Year 6). Supplied in regulated twin packs.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls Toolbar */}
        <div className="bg-white/90 rounded-2xl border border-stone-200/80 p-4 mb-8 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center shadow-xs">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search products, brands, or strengths..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-stone-200 text-xs font-sans text-forest-950 focus:outline-none focus:ring-1 focus:ring-sage-500 focus:border-sage-500 bg-linen/30"
            />
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-stone-400" />
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="py-2 px-3 rounded-full border border-stone-200 text-xs font-sans font-medium text-forest-950 focus:outline-none focus:ring-1 focus:ring-sage-500 bg-white cursor-pointer"
            >
              <option value="all">All Brands</option>
              <option value="EpiPen">EpiPen®</option>
              <option value="Jext">Jext®</option>
              <option value="Emergency Kits">Emergency Kits</option>
            </select>

            <select
              value={strengthFilter}
              onChange={(e) => setStrengthFilter(e.target.value)}
              className="py-2 px-3 rounded-full border border-stone-200 text-xs font-sans font-medium text-forest-950 focus:outline-none focus:ring-1 focus:ring-sage-500 bg-white cursor-pointer"
            >
              <option value="all">All Strengths</option>
              <option value="300">300mcg (Secondary)</option>
              <option value="150">150mcg (Primary)</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/80 rounded-2xl border border-stone-200 h-96 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white/80 rounded-2xl border border-stone-200 p-8">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-stone-300" />
            <p className="font-serif text-forest-950 text-lg">No products match your filter criteria.</p>
            <p className="text-xs text-stone-500 mt-1">Try clearing your search query or selecting &quot;All Brands&quot;.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Basket Checkout Callout */}
        <div className="mt-14 p-8 bg-[#0c2340] rounded-3xl text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-1">
            <h3 className="text-xl font-bold">Ready to submit your school order?</h3>
            <p className="text-xs text-slate-300 font-sans">
              Select 30-day BACS invoice or instant card payment at checkout with full VAT breakdown.
            </p>
          </div>

          <Link
            href="/basket"
            className="px-7 py-3.5 rounded-full bg-[#096556] hover:bg-[#075145] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-sm shrink-0 flex items-center gap-2"
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
