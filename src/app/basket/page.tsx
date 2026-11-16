'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, AlertCircle, CheckCircle, Shield, BellRing, Truck } from 'lucide-react';
import MedicalDeviceVisual from '@/components/MedicalDeviceVisual';
import UrgencyTimer from '@/components/UrgencyTimer';

export default function BasketPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    vatTotal,
    total,
    itemCount,
    requiresRequisition,
    promoCode,
    discountAmount,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const [promoInput, setPromoInput] = React.useState('');
  const [promoError, setPromoError] = React.useState('');

  const handleApplyPromo = () => {
    const success = applyPromoCode(promoInput);
    if (!success) setPromoError('Invalid promo code. Try MAT10 for 10% Multi-Academy Trust discount.');
    else setPromoError('');
  };

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 font-sans text-[#1d1d1f]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-[#f5f5f7] flex items-center justify-center mx-auto mb-6 border border-black/[0.06]">
            <ShoppingBag className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] mb-3 tracking-tight">Your basket is empty</h2>
          <p className="text-slate-500 mb-8 text-sm font-sans">Browse our range of EpiPen® and Jext® auto-injectors for your school.</p>
          <Link
            href="/order-pens"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#09653d] hover:bg-[#064e2e] text-white font-semibold text-sm shadow-sm hover:shadow transition-all apple-btn"
          >
            Browse Emergency Pens
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] py-10 sm:py-14 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] mb-2 tracking-[-0.03em]">Your School Basket</h1>
        <p className="text-slate-500 text-sm mb-8 font-sans">{itemCount} item{itemCount !== 1 ? 's' : ''} · Free temperature-controlled courier delivery</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-4">
            {/* CRO Urgency & Expiry Disclaimer Banner */}
            <UrgencyTimer variant="card" />

            <div className="bg-emerald-500/[0.08] border border-[#09653d]/20 rounded-[22px] p-4 flex items-start gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-[#09653d] text-white flex items-center justify-center shrink-0">
                <BellRing className="w-4 h-4" />
              </div>
              <div className="text-xs text-slate-700 space-y-0.5">
                <p className="font-bold text-[#1d1d1f]">We&apos;ll remind you when your pens expire</p>
                <p className="font-sans leading-relaxed text-slate-600">
                  Complimentary automated tracking alerts sent at 12, 6, 3, and 1 month before expiry so your school stays fully compliant with Benedict&apos;s Law.
                </p>
              </div>
            </div>

            {requiresRequisition && (
              <div className="bg-[#f5f5f7] border border-black/[0.06] rounded-[22px] p-4 flex items-start gap-3 shadow-2xs">
                <AlertCircle className="w-5 h-5 text-[#09653d] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-[#1d1d1f] tracking-tight">Headteacher Requisition Required</p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed font-sans">
                    An order signed by the Headteacher or Principal can be uploaded during checkout or emailed to our pharmacy desk after ordering.
                  </p>
                </div>
              </div>
            )}

            {items.map((item) => (
              <div key={item.product.id} className="bg-[#f5f5f7] rounded-[24px] border border-black/[0.06] p-6 shadow-2xs hover:border-[#09653d]/30 transition-all">
                <div className="flex items-start gap-5">
                  {/* Device Visual */}
                  <div className="w-16 h-20 rounded-2xl bg-white border border-black/[0.06] flex items-center justify-center shrink-0 p-1 overflow-hidden shadow-2xs">
                    <MedicalDeviceVisual
                      type={
                        item.product.brand === 'Emergency Kits'
                          ? 'wall-station'
                          : item.product.brand === 'EpiPen'
                          ? item.product.strength.includes('300')
                            ? 'epipen-300'
                            : 'epipen-150'
                          : item.product.strength.includes('300')
                          ? 'jext-300'
                          : 'jext-150'
                      }
                      size="sm"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#1d1d1f] text-base tracking-tight">{item.product.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 font-sans">{item.product.pack_size} · {item.product.target_group}</p>

                    <div className="flex flex-wrap items-center gap-4 mt-4">
                      {/* Qty controls */}
                      <div className="flex items-center border border-black/[0.08] rounded-full bg-white p-0.5 shadow-2xs">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#f5f5f7] text-slate-700 transition-colors apple-btn"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-semibold text-xs text-[#1d1d1f]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#f5f5f7] text-slate-700 transition-colors apple-btn"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-base font-bold text-[#1d1d1f] tracking-tight">£{(item.product.price * item.quantity).toFixed(2)}</span>
                      <span className="text-[11px] text-slate-400 font-sans">+VAT</span>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="ml-auto text-slate-400 hover:text-red-600 transition-colors p-1.5 rounded-full hover:bg-red-50 apple-btn"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <Link href="/order-pens" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#09653d] hover:text-[#064e2e] mt-2 transition-colors">
              ← Continue shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#f5f5f7] rounded-[28px] border border-black/[0.06] p-7 shadow-2xs sticky top-24 space-y-5">
              <h2 className="font-bold text-[#1d1d1f] text-lg tracking-tight">Order Summary</h2>

              <div className="space-y-3 text-sm font-sans">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal (ex VAT)</span>
                  <span className="font-semibold text-[#1d1d1f]">£{subtotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#09653d] font-semibold">
                    <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" />{promoCode} discount</span>
                    <span>-£{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-slate-600">UK VAT (20%)</span>
                  <span className="font-semibold text-[#1d1d1f]">£{vatTotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600">Tracked Courier (delivered in 3–4 working days)</span>
                  <span className="font-semibold text-[#09653d]">FREE</span>
                </div>

                <div className="border-t border-black/[0.06] pt-3 flex justify-between">
                  <span className="font-bold text-[#1d1d1f] text-base">Total</span>
                  <span className="font-bold text-[#1d1d1f] text-2xl tracking-tight">£{total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-slate-400">Includes £{vatTotal.toFixed(2)} UK VAT</p>
              </div>

              {/* Promo Code */}
              {!promoCode ? (
                <div className="pt-4 border-t border-black/[0.06]">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 block mb-2">School / MAT Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. MAT10"
                      value={promoInput}
                      onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(''); }}
                      className="flex-1 px-3.5 py-2 rounded-full border border-black/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-[#09653d]/20 bg-white uppercase font-sans text-slate-900"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="px-4 py-2 rounded-full bg-[#09653d] text-white font-semibold text-xs hover:bg-[#064e2e] transition-all apple-btn"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="mt-1.5 text-xs text-red-600">{promoError}</p>}
                </div>
              ) : (
                <div className="mt-4 flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-black/[0.06]">
                  <span className="text-xs font-semibold text-[#09653d] flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#09653d]" />
                    {promoCode} applied
                  </span>
                  <button onClick={removePromoCode} className="text-xs text-red-600 hover:text-red-800 font-semibold">Remove</button>
                </div>
              )}

              {/* CTA */}
              <Link
                href="/checkout"
                className="w-full py-4 rounded-full bg-[#09653d] hover:bg-[#064e2e] text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow apple-btn"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Trust indicators */}
              <div className="pt-4 border-t border-black/[0.06] space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-sans">
                  <Shield className="w-3.5 h-3.5 text-[#09653d] shrink-0" />
                  Secure checkout · 30-day BACS invoice available
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-sans">
                  <CheckCircle className="w-3.5 h-3.5 text-[#09653d] shrink-0" />
                  GPhC registered pharmacy dispensing
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
