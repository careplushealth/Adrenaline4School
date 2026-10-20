'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import { ShoppingBag, Check, ArrowRight, Truck, Info, Plus, Minus } from 'lucide-react';
import MedicalDeviceVisual from '@/components/MedicalDeviceVisual';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const is300 = product.strength.includes('300');
  const isKit = product.brand === 'Emergency Kits';
  const vatPrice = product.price * 1.20;

  // Determine device visual type
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
    <div className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden hover:border-[#096556]">
      {/* Top Graphic Showcase */}
      <div
        className={`relative h-64 flex items-center justify-center p-6 overflow-hidden transition-colors duration-300 ${
          isKit
            ? 'bg-gradient-to-b from-[#e8f4f8] via-[#f0f7fb] to-white'
            : is300
            ? 'bg-gradient-to-b from-[#e6f5f1]/50 via-[#f0f7fb] to-white'
            : 'bg-gradient-to-b from-[#e0f2fe]/40 via-[#f0f7fb] to-white'
        }`}
      >
        {/* Soft Radial Ambient Glow */}
        <div
          className={`absolute w-44 h-44 rounded-full blur-2xl opacity-50 pointer-events-none ${
            isKit ? 'bg-teal-200/40' : is300 ? 'bg-teal-200/30' : 'bg-sky-200/40'
          }`}
        />

        {/* Vector Medical Device */}
        <div className="relative z-10 transform group-hover:scale-105 group-hover:-translate-y-1 transition-transform duration-300 ease-out">
          <MedicalDeviceVisual type={deviceType} size="md" />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base font-bold text-[#0c2340] leading-snug group-hover:text-[#096556] transition-colors">
            {product.name}
          </h3>

          {/* Intended Target Group */}
          <div className="mt-2.5 flex items-start gap-2 bg-[#f0faf7] p-2.5 rounded-xl border border-[#c6eee3] text-xs text-slate-600 font-sans">
            <Info className="w-3.5 h-3.5 text-[#096556] shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong className="text-[#0c2340] font-semibold">For:</strong> {product.target_group}
            </span>
          </div>

          <p className="mt-2.5 text-xs text-slate-500 line-clamp-2 leading-relaxed font-sans">
            {product.description}
          </p>
        </div>

        {/* Pricing & Add To Basket */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-3.5">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-[#0c2340] tracking-tight">
                  £{product.price.toFixed(2)}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  ex VAT
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-normal block">
                £{vatPrice.toFixed(2)} inc. 20% UK VAT
              </span>
            </div>

            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#096556] bg-[#e6f5f1] px-2.5 py-1 rounded-full border border-[#c6eee3]">
              <Truck className="w-3 h-3 text-[#096556]" />
              Free Courier
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Stepper */}
            <div className="flex items-center border border-slate-200 rounded-full bg-[#f0f7fb] p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-full hover:bg-white text-slate-800 font-medium flex items-center justify-center transition-colors shadow-xs"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-7 text-center font-bold text-xs text-[#0c2340]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-full hover:bg-white text-slate-800 font-medium flex items-center justify-center transition-colors shadow-xs"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Add Button */}
            <button
              onClick={handleAdd}
              className={`flex-1 py-2.5 px-4 rounded-full font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm ${
                added
                  ? 'bg-[#096556] text-white'
                  : 'bg-[#096556] hover:bg-[#075145] text-white hover:shadow-md'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Basket</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-3 text-center">
            <Link
              href={`/order-pens/${product.slug}`}
              className="text-xs font-semibold text-slate-500 hover:text-[#096556] inline-flex items-center gap-1 transition-colors group/link"
            >
              <span>Clinical specifications & storage</span>
              <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
