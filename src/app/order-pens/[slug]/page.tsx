'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import {
  CheckCircle,
  ShieldCheck,
  Truck,
  BellRing,
  FileText,
  Minus,
  Plus,
  ShoppingBag,
  Check,
} from 'lucide-react';
import RequisitionModal from '@/components/RequisitionModal';
import MedicalDeviceVisual from '@/components/MedicalDeviceVisual';
import FlipUrgencyTimer from '@/components/FlipUrgencyTimer';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isReqOpen, setIsReqOpen] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!slug) return;
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => {
        const found = data.products?.find((p: Product) => p.slug === slug);
        setProduct(found || null);
        const related =
          data.products
            ?.filter((p: Product) => p.slug !== slug && p.brand === found?.brand)
            .slice(0, 2) || [];
        setRelatedProducts(related);
      });
  }, [slug]);

  const handleAdd = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center font-sans">
          <div className="w-10 h-10 border-2 border-sage-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-500 font-medium text-sm">Loading clinical specifications…</p>
        </div>
      </div>
    );
  }

  const vatPrice = product.price * 1.20;
  const is300 = product.strength.includes('300');
  const isKit = product.brand === 'Emergency Kits';

  const deviceType = isKit
    ? 'wall-station'
    : product.brand === 'EpiPen'
    ? is300
      ? 'epipen-300'
      : 'epipen-150'
    : is300
    ? 'jext-300'
    : 'jext-150';

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] py-10 sm:py-14 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation — Apple Clean Path */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-8 sm:mb-12">
          <Link href="/" className="hover:text-[#1d1d1f] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/order-pens" className="hover:text-[#1d1d1f] transition-colors">
            Emergency Auto-Injectors
          </Link>
          <span>/</span>
          <span className="text-[#1d1d1f] font-semibold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Canvas: Precision Vector Medical Device — Apple Stage */}
          <div className="lg:col-span-5 bg-[#f5f5f7] rounded-[32px] border border-black/[0.06] p-10 sm:p-14 flex flex-col items-center justify-center relative overflow-hidden shadow-2xs">
            {/* Soft Ambient Radial Backdrop */}
            <div
              className="absolute w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none bg-emerald-200/40"
            />

            {/* Dose Badge */}
            <div className="relative z-10 mb-6 flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-semibold tracking-tight bg-white text-[#1d1d1f] border border-black/[0.08] shadow-2xs">
                {product.brand}
              </span>
              {!isKit && (
                <span className="px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#09653d]/[0.08] text-[#09653d] border border-[#09653d]/15">
                  {product.strength}
                </span>
              )}
            </div>

            {/* Device Vector */}
            <div className="relative z-10 py-6 max-w-[260px] w-full flex items-center justify-center">
              <MedicalDeviceVisual type={deviceType} size="lg" />
            </div>

            <div className="relative z-10 mt-6 text-center space-y-1">
              <span className="text-xs font-semibold text-[#1d1d1f] block">{product.pack_size}</span>
              <span className="text-[11px] text-slate-500 font-medium">UK GPhC Pharmacy Dispatched</span>
            </div>
          </div>

          {/* Right: Clinical Details & Purchase Module */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="px-3 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider text-[#09653d] bg-[#09653d]/[0.08] border border-[#09653d]/15">
                  {product.brand} Medical Supply
                </span>
                <span className="text-xs text-[#09653d] font-medium flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> GPhC Approved
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] tracking-[-0.03em] leading-tight">
                {product.name}
              </h1>
              <p className="text-slate-600 mt-3 text-[14px] leading-relaxed font-sans">{product.description}</p>
            </div>

            {/* Target Patient Guidance */}
            <div className="bg-[#f5f5f7] border border-black/[0.06] rounded-[22px] p-4 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#09653d] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-xs text-[#1d1d1f] uppercase tracking-wider block mb-0.5">
                  Clinical Intended User
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">{product.target_group}</p>
              </div>
            </div>

            {/* Flip-Clock Urgency Timer Banner */}
            <FlipUrgencyTimer
              title="Limited School Offer Ends In:"
            />

            {/* Pricing Box — Apple Product Module */}
            <div className="bg-white rounded-[26px] border border-black/[0.08] p-6 shadow-2xs space-y-3.5">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="line-through text-slate-400 text-sm font-normal">
                      £100.00
                    </span>
                    <span className="text-[11px] font-bold text-[#09653d] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Save £39.31 per pen
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-[#1d1d1f] tracking-tight">
                      £{product.price.toFixed(2)}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      ex UK VAT
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 font-sans">
                    £{vatPrice.toFixed(2)} inc. 20% VAT · {product.pack_size}
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium text-[#09653d] bg-[#09653d]/[0.08] border border-[#09653d]/15">
                    Tracked Courier Included
                  </span>
                </div>
              </div>

              {/* Payment Methods Pill */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-black/[0.06]">
                <span className="text-[11px] font-medium text-[#1d1d1f] bg-[#f5f5f7] px-3 py-1 rounded-full border border-black/[0.04]">
                  30-Day BACS School Invoice Available
                </span>
                <span className="text-[11px] font-medium text-[#1d1d1f] bg-[#f5f5f7] px-3 py-1 rounded-full border border-black/[0.04]">
                  Debit / Purchasing Card Accepted
                </span>
              </div>
            </div>

            {/* Expiry Tracking Disclaimer */}
            <div className="bg-emerald-500/[0.08] border border-[#09653d]/20 rounded-[22px] p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#09653d] text-white flex items-center justify-center shrink-0">
                <BellRing className="w-4 h-4" />
              </div>
              <div className="text-xs text-slate-700 space-y-0.5">
                <p className="font-bold text-[#1d1d1f]">We&apos;ll remind you when your pens expire</p>
                <p className="font-sans leading-relaxed text-slate-600">
                  Complimentary automated tracking alerts sent at 12, 6, 3, and 1 month before expiry so your school stays fully compliant.
                </p>
              </div>
            </div>

            {/* Quantity Stepper & Add to Basket */}
            <div className="space-y-4 pt-1">
              <label className="text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider block">
                Select Quantity (Pens)
              </label>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="flex items-center justify-between border border-black/[0.08] rounded-full bg-[#f5f5f7] p-1 max-w-[140px]">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-full hover:bg-white text-slate-800 font-medium flex items-center justify-center transition-all shadow-2xs apple-btn"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-lg text-[#1d1d1f]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-full hover:bg-white text-slate-800 font-medium flex items-center justify-center transition-all shadow-2xs apple-btn"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  className={`flex-1 py-3.5 px-6 rounded-full font-semibold text-sm tracking-tight flex items-center justify-center gap-2.5 transition-all shadow-sm apple-btn ${
                    added
                      ? 'bg-[#09653d] text-white'
                      : 'bg-[#09653d] hover:bg-[#064e2e] text-white hover:shadow-md'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Basket</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Basket — £{(product.price * quantity).toFixed(2)} ex VAT</span>
                    </>
                  )}
                </button>
              </div>

              <Link
                href="/basket"
                className="w-full py-3 rounded-full border border-black/[0.08] hover:border-[#09653d] text-[#1d1d1f] font-semibold text-xs flex items-center justify-center gap-2 transition-all bg-white shadow-2xs apple-btn"
              >
                View Basket & Proceed to School Checkout &rarr;
              </Link>
            </div>

            {/* Requisition Requirement Guidance (Human Medicines line removed) */}
            {product.requires_headteacher_requisition ? (
              <div className="bg-[#f5f5f7] border border-black/[0.06] rounded-[24px] p-5 space-y-2">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-[#09653d] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1d1d1f]">
                      Headteacher Requisition Required for School Supply
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      Schools must provide a signed order from the Headteacher or Principal before emergency adrenaline auto-injectors can be dispatched.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsReqOpen(true)}
                      className="mt-2 text-xs font-semibold text-[#09653d] hover:text-[#064e2e] hover:underline flex items-center gap-1"
                    >
                      <span>Generate official school requisition form (1-click PDF)</span>
                      &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Storage & Service Indicators — Apple Squircle Triplet */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-[#f5f5f7] border border-black/[0.06] rounded-2xl p-4 text-center">
                <Truck className="w-5 h-5 mx-auto text-[#09653d] mb-1.5" />
                <p className="text-xs font-semibold text-[#1d1d1f]">Tracked Courier</p>
                <p className="text-[11px] text-slate-500">Delivered in 3 to 4 working days</p>
              </div>
              <div className="bg-[#f5f5f7] border border-black/[0.06] rounded-2xl p-4 text-center">
                <BellRing className="w-5 h-5 mx-auto text-[#09653d] mb-1.5" />
                <p className="text-xs font-semibold text-[#1d1d1f]">Expiry Tracking</p>
                <p className="text-[11px] text-slate-500">12, 6, 3, 1m reminders</p>
              </div>
              <div className="bg-[#f5f5f7] border border-black/[0.06] rounded-2xl p-4 text-center">
                <ShieldCheck className="w-5 h-5 mx-auto text-[#09653d] mb-1.5" />
                <p className="text-xs font-semibold text-[#1d1d1f]">GPhC Dispensed</p>
                <p className="text-[11px] text-slate-500">Verified UK pharmacy</p>
              </div>
            </div>

            {/* Storage Guidelines */}
            <div className="bg-[#f5f5f7] rounded-2xl border border-black/[0.06] p-4 text-xs text-slate-600 font-sans">
              <p className="font-semibold text-[#1d1d1f] uppercase tracking-wider text-[11px] mb-1">
                Clinical Storage Instructions
              </p>
              <p>{product.storage_instructions}</p>
            </div>
          </div>
        </div>
      </div>

      <RequisitionModal isOpen={isReqOpen} onClose={() => setIsReqOpen(false)} />
    </div>
  );
}
