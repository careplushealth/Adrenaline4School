'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import MedicalDeviceVisual from '@/components/MedicalDeviceVisual';

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
      <div className="min-h-screen bg-[#f8fbfb] flex items-center justify-center px-4 font-sans text-[#0c2340]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-6 border border-stone-200">
            <ShoppingBag className="w-8 h-8 text-stone-400" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#0c2340] mb-3">Your basket is empty</h2>
          <p className="text-stone-500 mb-8 text-sm">Browse our range of EpiPen® and Jext® auto-injectors for your school.</p>
          <Link
            href="/order-pens"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#096556] hover:bg-[#075246] text-white font-bold text-sm shadow-md shadow-[#096556]/20 transition-all"
          >
            Browse Emergency Pens
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fbfb] text-[#0c2340] py-10 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-[#0c2340] mb-2">Your School Basket</h1>
        <p className="text-stone-500 text-sm mb-8">{itemCount} item{itemCount !== 1 ? 's' : ''} · Free temperature-controlled courier delivery</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-4">
            {requiresRequisition && (
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#096556] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[#0c2340]">Headteacher Requisition Required</p>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Your basket contains emergency adrenaline auto-injectors. A signed Headteacher Requisition Form must be uploaded at checkout per UK Human Medicines Regulations 2017.
                  </p>
                </div>
              </div>
            )}

            {items.map((item) => (
              <div key={item.product.id} className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs hover:border-[#096556]/40 transition-all">
                <div className="flex items-start gap-5">
                  {/* Device Visual */}
                  <div className="w-16 h-20 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center shrink-0 p-1 overflow-hidden">
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
                    <h3 className="font-serif font-bold text-[#0c2340] text-base">{item.product.name}</h3>
                    <p className="text-xs text-stone-500 mt-1">{item.product.pack_size} · {item.product.target_group}</p>

                    <div className="flex flex-wrap items-center gap-4 mt-4">
                      {/* Qty controls */}
                      <div className="flex items-center border border-stone-200 rounded-full bg-stone-50 p-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white text-stone-700 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-bold text-xs text-[#0c2340]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white text-stone-700 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-base font-serif font-bold text-[#0c2340]">£{(item.product.price * item.quantity).toFixed(2)}</span>
                      <span className="text-[11px] text-stone-400 font-sans">+VAT</span>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="ml-auto text-stone-400 hover:text-red-600 transition-colors p-1.5 rounded-full hover:bg-red-50"
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
            <Link href="/order-pens" className="inline-flex items-center gap-2 text-xs font-semibold text-[#096556] hover:text-[#0c2340] mt-2 transition-colors">
              ← Continue shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs sticky top-24">
              <h2 className="font-serif font-bold text-[#0c2340] text-lg mb-5">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-600">Subtotal (ex VAT)</span>
                  <span className="font-bold text-[#0c2340]">£{subtotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" />{promoCode} discount</span>
                    <span>-£{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-stone-600">UK VAT (20%)</span>
                  <span className="font-bold text-[#0c2340]">£{vatTotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-stone-600">Tracked Medical Courier</span>
                  <span className="font-bold text-[#096556]">FREE</span>
                </div>

                <div className="border-t border-stone-100 pt-3 flex justify-between">
                  <span className="font-bold text-[#0c2340] text-base">Total</span>
                  <span className="font-serif font-bold text-[#0c2340] text-2xl">£{total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-stone-400">Includes £{vatTotal.toFixed(2)} UK VAT</p>
              </div>

              {/* Promo Code */}
              {!promoCode ? (
                <div className="mt-5 pt-4 border-t border-stone-100">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2">School / MAT Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. MAT10"
                      value={promoInput}
                      onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(''); }}
                      className="flex-1 px-3 py-2 rounded-full border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#096556] bg-stone-50/50 uppercase"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="px-4 py-2 rounded-full bg-[#096556] text-white font-bold text-xs hover:bg-[#075246] transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="mt-1.5 text-xs text-red-600">{promoError}</p>}
                </div>
              ) : (
                <div className="mt-4 flex items-center justify-between bg-emerald-50 rounded-xl px-4 py-3 border border-emerald-200">
                  <span className="text-xs font-semibold text-emerald-900 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#096556]" />
                    {promoCode} applied
                  </span>
                  <button onClick={removePromoCode} className="text-xs text-red-600 hover:text-red-800 font-semibold">Remove</button>
                </div>
              )}

              {/* CTA */}
              <Link
                href="/checkout"
                className="mt-6 w-full py-3.5 rounded-full bg-[#096556] hover:bg-[#075246] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-[#096556]/20"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Trust indicators */}
              <div className="mt-5 pt-4 border-t border-stone-100 space-y-2">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <Shield className="w-3.5 h-3.5 text-[#096556] shrink-0" />
                  Secure checkout · 30-day BACS invoice available
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <CheckCircle className="w-3.5 h-3.5 text-[#096556] shrink-0" />
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
