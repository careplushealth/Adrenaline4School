'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import {
  BellRing,
  School,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Plus,
  Minus,
} from 'lucide-react';
import MedicalDeviceVisual from '@/components/MedicalDeviceVisual';

export default function SecureReorderPage() {
  const params = useParams();
  const token = params?.token as string;
  const router = useRouter();
  const { addToCart, clearCart } = useCart();

  const [supply, setSupply] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    fetch(`/api/reorder/${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setSupply(data.supply);
        } else {
          setError(data.error || 'Invalid or expired reorder link');
        }
      })
      .catch(() => setError('Failed to validate reorder link'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleConfirmReorder = () => {
    if (!supply) return;

    // Construct product object for cart
    const prod = {
      id: supply.product_id,
      slug: supply.product_id,
      brand: supply.product_name.includes('EpiPen') ? 'EpiPen' : 'Jext',
      name: supply.product_name,
      strength: supply.strength,
      target_group: 'Registered school pupils',
      pack_size: supply.pack_size || 'Emergency Auto-Injector (1 x Pen)',
      price: supply.price || 99.99,
      vat_rate: 0.20,
      is_available: 1,
      requires_headteacher_requisition: 1,
      requires_pharmacy_approval: 1,
      description: 'Emergency Adrenaline Auto-Injectors (Automated Replacement Supply)',
      clinical_notes: '',
      storage_instructions: 'Store below 25°C.',
      image_url: '',
      display_order: 1,
    };

    clearCart();
    addToCart(prod as any, quantity);
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#09653d] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-neutral-500 font-medium text-sm tracking-tight">Validating secure school reorder link…</p>
        </div>
      </div>
    );
  }

  if (error || !supply) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-[28px] p-8 border border-black/[0.06] shadow-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-[#1d1d1f] tracking-tight mb-2">Reorder Link Expired or Invalid</h2>
          <p className="text-sm text-neutral-500 mb-6 leading-relaxed">{error || 'This link may have already been used or has expired.'}</p>
          <Link
            href="/order-pens"
            className="inline-flex w-full items-center justify-center py-3.5 rounded-full bg-[#09653d] hover:bg-[#064e2e] text-white font-medium text-sm tracking-tight transition-all active:scale-[0.98] apple-btn"
          >
            Browse All Pens
          </Link>
        </div>
      </div>
    );
  }

  const vatTotal = (supply.price * quantity) * 0.20;
  const grandTotal = (supply.price * quantity) + vatTotal;

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Reorder Header */}
        <div className="bg-[#062e1c] text-white rounded-[28px] p-6 sm:p-8 flex items-center justify-between gap-4 shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/10">
              <BellRing className="w-6 h-6 text-teal-300" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-300 bg-teal-400/10 px-2.5 py-0.5 rounded-full border border-teal-400/20">
                Verified Expiry Reorder Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">Replace Expiring Stock</h1>
            </div>
          </div>
        </div>

        {/* Reorder Card */}
        <div className="bg-white rounded-[28px] border border-black/[0.06] shadow-sm p-6 sm:p-8 space-y-6">
          {/* School Details Pre-filled */}
          <div className="bg-[#f5f5f7] rounded-[20px] p-5 border border-black/[0.04] space-y-2 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
              <span className="font-semibold text-[#1d1d1f] uppercase tracking-wider flex items-center gap-1.5">
                <School className="w-4 h-4 text-[#09653d]" />
                Registered Educational Institution
              </span>
              <span className="font-mono text-neutral-500">URN: {supply.school_urn}</span>
            </div>
            <p className="font-bold text-base text-[#1d1d1f]">{supply.school_name}</p>
            <p className="text-neutral-600">{supply.address_line1}, {supply.town_city} {supply.postcode}</p>
            <p className="text-neutral-600">Headteacher: <strong className="text-[#1d1d1f]">{supply.headteacher_name}</strong> ({supply.headteacher_email})</p>
          </div>

          {/* Expiring Supply Alert */}
          <div className="p-4 rounded-[20px] bg-amber-500/[0.08] border border-amber-500/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-neutral-700 space-y-1">
              <p className="font-bold text-amber-950">Recorded Stock Details Facing Expiration</p>
              <p>Current Batch: <span className="font-mono font-semibold text-neutral-900">{supply.batch_number}</span> · Recorded Expiry Date: <strong className="text-rose-600">{supply.expiry_date}</strong></p>
            </div>
          </div>

          {/* Replacement Product Preview */}
          <div className="border border-black/[0.06] rounded-[24px] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#f5f5f7]/50">
            <div className="flex items-center gap-5">
              <div className="w-16 h-28 rounded-2xl bg-white border border-black/[0.06] p-1 flex items-center justify-center shrink-0 shadow-xs">
                <MedicalDeviceVisual
                  type={
                    supply.product_name.includes('EpiPen')
                      ? supply.product_name.includes('300') ? 'epipen-300' : 'epipen-150'
                      : supply.product_name.includes('300') ? 'jext-300' : 'jext-150'
                  }
                  size="sm"
                />
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#09653d] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                  GPhC Dispensed Replacement
                </span>
                <h3 className="text-base font-bold text-[#1d1d1f] mt-1">{supply.product_name}</h3>
                <p className="text-xs text-neutral-500 mt-0.5">{supply.pack_size} · Fresh pharmacy batch</p>
                <p className="text-sm font-semibold text-[#1d1d1f] mt-1.5">£{supply.price.toFixed(2)} <span className="text-xs font-normal text-neutral-400">ex VAT per pack</span></p>
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-black/[0.08] rounded-full bg-white p-1 shadow-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center font-medium text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors active:scale-95"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-semibold text-sm text-[#1d1d1f]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center font-medium text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="border-t border-black/[0.06] pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal ({quantity} pack{quantity > 1 ? 's' : ''})</span>
              <span className="font-medium text-[#1d1d1f]">£{(supply.price * quantity).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>UK VAT (20%)</span>
              <span className="font-medium text-[#1d1d1f]">£{vatTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Tracked Medical Courier (Delivered in 3–4 working days)</span>
              <span className="font-semibold text-[#09653d]">FREE</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#1d1d1f] pt-2 border-t border-black/[0.06]">
              <span>Total Due</span>
              <span>£{grandTotal.toFixed(2)}</span>
            </div>
            <p className="text-[11px] text-neutral-400">Payment options: 30-day BACS school invoice or instant card payment at checkout.</p>
          </div>

          {/* Action Button */}
          <button
            onClick={handleConfirmReorder}
            className="w-full py-4 rounded-full bg-[#09653d] hover:bg-[#064e2e] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
          >
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>Confirm Reorder & Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
