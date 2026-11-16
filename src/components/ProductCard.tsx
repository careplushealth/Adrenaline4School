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
    <div className="group relative bg-white rounded-[26px] border border-black/[0.07] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(12,35,64,0.08)] transition-all duration-300 flex flex-col overflow-hidden hover:border-[#09653d]/35">
      {/* Top Graphic Showcase — Apple Store Product Stage */}
      <div
        className={`relative h-64 flex items-center justify-center p-6 overflow-hidden transition-colors duration-300 ${
          isKit
            ? 'bg-gradient-to-b from-[#f5f7f9] to-[#ffffff]'
            : is300
            ? 'bg-gradient-to-b from-[#f2f8f6] to-[#ffffff]'
            : 'bg-gradient-to-b from-[#f0f6fa] to-[#ffffff]'
        }`}
      >
        {/* Soft Radial Ambient Glow */}
        <div
          className={`absolute w-48 h-48 rounded-full blur-2xl opacity-40 pointer-events-none ${
            isKit ? 'bg-teal-200/40' : is300 ? 'bg-emerald-200/35' : 'bg-sky-200/40'
          }`}
        />

        {/* Vector Medical Device */}
        <div className="relative z-10 transform group-hover:scale-[1.04] group-hover:-translate-y-1 transition-transform duration-300 ease-out">
          <MedicalDeviceVisual type={deviceType} size="md" />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight leading-snug group-hover:text-[#09653d] transition-colors">
            {product.name}
          </h3>

          {/* Intended Target Group */}
          <div className="mt-2.5 flex items-start gap-2 bg-[#f5f5f7] p-2.5 rounded-xl border border-black/[0.04] text-[12px] text-slate-600 font-sans">
            <Info className="w-3.5 h-3.5 text-[#09653d] shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong className="text-[#1d1d1f] font-semibold">For:</strong> {product.target_group}
            </span>
          </div>

          <p className="mt-2.5 text-[12px] text-slate-500 line-clamp-2 leading-relaxed font-sans">
            {product.description}
          </p>
        </div>

        {/* Pricing & Add To Basket */}
        <div className="pt-4 border-t border-black/[0.06]">
          <div className="flex items-baseline justify-between mb-3.5">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="line-through text-slate-400 text-xs font-normal">
                  £100.00
                </span>
                <span className="text-[10px] font-bold text-[#09653d] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Save £39.31
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-[#1d1d1f] tracking-tight">
                  £{product.price.toFixed(2)}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  ex VAT
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-normal block">
                £{vatPrice.toFixed(2)} inc. 20% UK VAT
              </span>
            </div>

            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#09653d] bg-[#09653d]/[0.08] px-2.5 py-1 rounded-full border border-[#09653d]/15">
              <Truck className="w-3 h-3 text-[#09653d]" />
              Delivered in 3–4 days
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Stepper — Apple pill */}
            <div className="flex items-center border border-black/[0.08] rounded-full bg-[#f5f5f7] p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-full hover:bg-white text-slate-800 font-medium flex items-center justify-center transition-all shadow-2xs apple-btn"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-7 text-center font-semibold text-xs text-[#1d1d1f]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-full hover:bg-white text-slate-800 font-medium flex items-center justify-center transition-all shadow-2xs apple-btn"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Add Button */}
            <button
              onClick={handleAdd}
              className={`flex-1 py-2.5 px-4 rounded-full font-semibold text-xs tracking-tight flex items-center justify-center gap-2 transition-all apple-btn shadow-xs ${
                added
                  ? 'bg-[#09653d] text-white'
                  : 'bg-[#09653d] hover:bg-[#064e2e] text-white hover:shadow'
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
              className="text-[12px] font-medium text-slate-500 hover:text-[#09653d] inline-flex items-center gap-1 transition-colors group/link"
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
