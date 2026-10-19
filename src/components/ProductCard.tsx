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
    <div className="group relative bg-white/90 rounded-2xl border border-stone-200/80 shadow-[0_4px_20px_-6px_rgba(22,35,26,0.04)] hover:shadow-[0_16px_36px_-10px_rgba(22,35,26,0.08)] transition-all duration-300 flex flex-col overflow-hidden hover:border-sage-400">
      {/* Top Graphic Showcase */}
      <div
        className={`relative h-64 flex items-center justify-center p-6 overflow-hidden transition-colors duration-300 ${
          isKit
            ? 'bg-gradient-to-b from-sage-50/70 via-linen/40 to-white/80'
            : is300
            ? 'bg-gradient-to-b from-linen/60 via-ivory to-white/80'
            : 'bg-gradient-to-b from-sage-50/40 via-linen/30 to-white/80'
        }`}
      >
        {/* Soft Radial Ambient Glow */}
        <div
          className={`absolute w-44 h-44 rounded-full blur-2xl opacity-50 pointer-events-none ${
            isKit ? 'bg-sage-200/40' : is300 ? 'bg-gold-200/40' : 'bg-sage-100/50'
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
          <h3 className="text-base font-serif font-medium text-forest-950 leading-snug group-hover:text-sage-800 transition-colors">
            {product.name}
          </h3>

          {/* Intended Target Group */}
          <div className="mt-2.5 flex items-start gap-2 bg-linen/50 p-2.5 rounded-xl border border-stone-200/50 text-xs text-stone-600 font-sans">
            <Info className="w-3.5 h-3.5 text-sage-700 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong className="text-forest-900 font-medium">For:</strong> {product.target_group}
            </span>
          </div>

          <p className="mt-2.5 text-xs text-stone-500 line-clamp-2 leading-relaxed font-sans">
            {product.description}
          </p>
        </div>

        {/* Pricing & Add To Basket */}
        <div className="pt-4 border-t border-stone-100">
          <div className="flex items-baseline justify-between mb-3.5">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-serif font-normal text-forest-950 tracking-tight">
                  £{product.price.toFixed(2)}
                </span>
                <span className="text-[11px] font-medium uppercase tracking-wider text-stone-500">
                  ex VAT
                </span>
              </div>
              <span className="text-[11px] text-stone-400 font-normal block">
                £{vatPrice.toFixed(2)} inc. 20% UK VAT
              </span>
            </div>

            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-sage-800 bg-sage-50 px-2.5 py-1 rounded-full border border-sage-200/70">
              <Truck className="w-3 h-3 text-sage-700" />
              Free Courier
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Stepper */}
            <div className="flex items-center border border-stone-200 rounded-full bg-linen/40 p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-full hover:bg-white text-forest-800 font-medium flex items-center justify-center transition-colors shadow-xs"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-7 text-center font-semibold text-xs text-forest-950">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-full hover:bg-white text-forest-800 font-medium flex items-center justify-center transition-colors shadow-xs"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Add Button */}
            <button
              onClick={handleAdd}
              className={`flex-1 py-2.5 px-4 rounded-full font-medium text-xs tracking-wide flex items-center justify-center gap-2 transition-all shadow-xs ${
                added
                  ? 'bg-sage-700 text-white'
                  : 'bg-forest-900 hover:bg-forest-800 text-ivory hover:shadow-sm'
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
              className="text-xs font-medium text-stone-500 hover:text-sage-800 inline-flex items-center gap-1 transition-colors group/link"
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
