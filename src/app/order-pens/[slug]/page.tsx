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
    <div className="min-h-screen bg-ivory text-forest-900 py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-8">
          <Link href="/" className="hover:text-forest-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/order-pens" className="hover:text-forest-900 transition-colors">
            Emergency Auto-Injectors
          </Link>
          <span>/</span>
          <span className="text-forest-950 font-semibold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Canvas: Precision Vector Medical Device */}
          <div className="lg:col-span-5 bg-white/90 rounded-3xl border border-stone-200/80 shadow-[0_12px_36px_-12px_rgba(22,35,26,0.06)] p-10 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Subtle Clinical Watermark Pattern */}
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, #16231a 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Dose Badge */}
            <div className="relative z-10 mb-6 flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-medium tracking-wide bg-linen text-forest-950 border border-stone-200">
                {product.brand}
              </span>
              {!isKit && (
                <span
                  className={`px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase ${
                    is300
                      ? 'bg-forest-900/10 text-forest-950 border border-forest-900/20'
                      : 'bg-sage-100 text-sage-950 border border-sage-200'
                  }`}
                >
                  {product.strength}
                </span>
              )}
            </div>

            {/* Device Vector */}
            <div className="relative z-10 py-4 max-w-[240px] w-full flex items-center justify-center">
              <MedicalDeviceVisual type={deviceType} size="lg" />
            </div>

            <div className="relative z-10 mt-6 text-center space-y-1">
              <span className="text-xs font-serif font-medium text-forest-950 block">{product.pack_size}</span>
              <span className="text-[11px] text-stone-400 font-medium">UK GPhC Pharmacy Dispatched</span>
            </div>
          </div>

          {/* Right: Clinical Details & Purchase Module */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider text-sage-900 bg-sage-50 border border-sage-200">
                  {product.brand} Medical Supply
                </span>
                <span className="text-xs text-sage-700 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> GPhC Approved
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-normal text-forest-950 tracking-tight leading-tight">
                {product.name}
              </h1>
              <p className="text-stone-600 mt-3 text-sm leading-relaxed">{product.description}</p>
            </div>

            {/* Target Patient Guidance */}
            <div className="bg-linen/50 border border-stone-200/70 rounded-2xl p-4 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-sage-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-xs text-forest-950 uppercase tracking-wider block mb-0.5">
                  Clinical Intended User
                </span>
                <p className="text-xs text-stone-600 leading-relaxed">{product.target_group}</p>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="bg-white/90 rounded-2xl border border-stone-200/80 p-6 shadow-xs space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-serif font-normal text-forest-950 tracking-tight">
                      £{product.price.toFixed(2)}
                    </span>
                    <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">
                      ex UK VAT
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    £{vatPrice.toFixed(2)} inc. 20% VAT · {product.pack_size}
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium text-sage-800 bg-sage-50 border border-sage-200">
                    Tracked Courier Included
                  </span>
                </div>
              </div>

              {/* Payment Methods Pill */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100">
                <span className="text-[11px] font-medium text-forest-900 bg-linen/70 px-3 py-1 rounded-full border border-stone-200">
                  30-Day BACS School Invoice Available
                </span>
                <span className="text-[11px] font-medium text-forest-900 bg-linen/70 px-3 py-1 rounded-full border border-stone-200">
                  Debit / Purchasing Card Accepted
                </span>
              </div>
            </div>

            {/* Quantity Stepper & Add to Basket */}
            <div className="space-y-4 pt-2">
              <label className="text-xs font-medium text-forest-950 uppercase tracking-wider block">
                Select Quantity ({product.pack_size.includes('Twin') ? 'Twin Packs' : 'Units'})
              </label>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="flex items-center justify-between border border-stone-200 rounded-full bg-linen/40 p-1 max-w-[140px]">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-full hover:bg-white text-forest-900 font-medium flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-serif text-lg text-forest-950">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-full hover:bg-white text-forest-900 font-medium flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  className={`flex-1 py-3.5 px-6 rounded-full font-medium text-sm tracking-wide flex items-center justify-center gap-2.5 transition-all shadow-xs ${
                    added
                      ? 'bg-sage-700 text-white'
                      : 'bg-forest-900 hover:bg-forest-800 text-ivory hover:shadow-sm'
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
                className="w-full py-3 rounded-full border border-stone-200/90 hover:border-sage-400 text-forest-900 font-medium text-xs flex items-center justify-center gap-2 transition-colors bg-white/80"
              >
                View Basket & Proceed to School Checkout &rarr;
              </Link>
            </div>

            {/* Requisition Requirement Guidance */}
            {product.requires_headteacher_requisition ? (
              <div className="bg-sage-50/60 border border-sage-200/80 rounded-2xl p-5 space-y-2">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-sage-800 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-serif font-medium uppercase tracking-wider text-forest-950">
                      Headteacher Requisition Required for School Supply
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Per the <em>Human Medicines (Amendment) Regulations 2017</em>, schools must provide a signed Headteacher Requisition before prescription-only adrenaline auto-injectors can be dispatched.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsReqOpen(true)}
                      className="mt-2 text-xs font-semibold text-sage-800 hover:text-forest-950 hover:underline flex items-center gap-1"
                    >
                      <span>Generate official school requisition form (1-click PDF)</span>
                      &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Storage & Service Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white/80 border border-stone-200/70 rounded-2xl p-4 text-center">
                <Truck className="w-5 h-5 mx-auto text-sage-700 mb-1.5" />
                <p className="text-xs font-serif text-forest-950">Tracked Courier</p>
                <p className="text-[11px] text-stone-500">Next working day</p>
              </div>
              <div className="bg-white/80 border border-stone-200/70 rounded-2xl p-4 text-center">
                <BellRing className="w-5 h-5 mx-auto text-sage-700 mb-1.5" />
                <p className="text-xs font-serif text-forest-950">Expiry Tracking</p>
                <p className="text-[11px] text-stone-500">12, 6, 3, 1m reminders</p>
              </div>
              <div className="bg-white/80 border border-stone-200/70 rounded-2xl p-4 text-center">
                <ShieldCheck className="w-5 h-5 mx-auto text-sage-700 mb-1.5" />
                <p className="text-xs font-serif text-forest-950">GPhC Dispensed</p>
                <p className="text-[11px] text-stone-500">Verified UK pharmacy</p>
              </div>
            </div>

            {/* Storage Guidelines */}
            <div className="bg-linen/40 rounded-2xl border border-stone-200/70 p-4 text-xs text-stone-600">
              <p className="font-semibold text-forest-900 uppercase tracking-wider text-[11px] mb-1">
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
