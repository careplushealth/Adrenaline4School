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
      pack_size: supply.pack_size || 'Twin Pack (2 Pens)',
      price: supply.price || 98.50,
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
      <div className="min-h-screen bg-ivory flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-sage-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-500 font-medium text-sm">Validating secure school reorder link…</p>
        </div>
      </div>
    );
  }

  if (error || !supply) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white/90 rounded-3xl p-8 border border-stone-200 shadow-sm text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-200">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-serif font-normal text-forest-950 mb-2">Reorder Link Expired or Invalid</h2>
          <p className="text-xs text-stone-600 mb-6 leading-relaxed">{error || 'This link may have already been used or has expired.'}</p>
          <Link
            href="/order-pens"
            className="block w-full py-3 rounded-full bg-forest-900 hover:bg-forest-800 text-ivory font-medium text-xs tracking-wide transition-colors"
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
    <div className="min-h-screen bg-[#f8fbfb] text-[#0c2340] py-16 px-4 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Reorder Header */}
        <div className="bg-[#0c2340] text-stone-200 rounded-t-3xl p-6 sm:p-8 flex items-center justify-between gap-4 border border-[#0c2340]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <BellRing className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-300 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/20">
                Verified Expiry Reorder Portal
              </span>
              <h1 className="text-2xl font-serif font-bold text-white mt-1">Replace Expiring Stock</h1>
            </div>
          </div>
        </div>

        {/* Reorder Card */}
        <div className="bg-white/90 rounded-b-3xl border border-stone-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          {/* School Details Pre-filled */}
          <div className="bg-linen/40 rounded-2xl p-5 border border-stone-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200/60">
              <span className="font-semibold text-forest-950 uppercase tracking-wider flex items-center gap-1.5">
                <School className="w-4 h-4 text-sage-700" />
                Registered Educational Institution
              </span>
              <span className="font-mono text-stone-500">URN: {supply.school_urn}</span>
            </div>
            <p className="font-serif font-medium text-base text-forest-950">{supply.school_name}</p>
            <p className="text-stone-600">{supply.address_line1}, {supply.town_city} {supply.postcode}</p>
            <p className="text-stone-600">Headteacher: <strong className="text-forest-950">{supply.headteacher_name}</strong> ({supply.headteacher_email})</p>
          </div>

          {/* Expiring Supply Alert */}
          <div className="p-4 rounded-2xl bg-sage-50/70 border border-sage-200/80 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-sage-700 shrink-0 mt-0.5" />
            <div className="text-xs text-stone-700 space-y-1">
              <p className="font-medium text-forest-950">Recorded Stock Details Facing Expiration</p>
              <p>Current Batch: <span className="font-mono font-semibold text-forest-950">{supply.batch_number}</span> · Recorded Expiry Date: <strong className="text-red-700">{supply.expiry_date}</strong></p>
            </div>
          </div>

          {/* Replacement Product Preview */}
          <div className="border border-stone-200/80 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 bg-linen/20">
            <div className="flex items-center gap-5">
              <div className="w-16 h-28 rounded-2xl bg-white border border-stone-200/80 p-1 flex items-center justify-center shrink-0 shadow-xs">
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
                <span className="text-[10px] font-semibold uppercase tracking-wider text-sage-900 bg-sage-50 px-2.5 py-0.5 rounded-full border border-sage-200">
                  GPhC Dispensed Replacement
                </span>
                <h3 className="text-base font-serif font-medium text-forest-950 mt-1">{supply.product_name}</h3>
                <p className="text-xs text-stone-500 mt-0.5">{supply.pack_size} · Fresh pharmacy batch</p>
                <p className="text-sm font-serif text-forest-950 mt-1.5">£{supply.price.toFixed(2)} <span className="text-xs font-sans text-stone-400">ex VAT per pack</span></p>
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-stone-200 rounded-full bg-white p-1 shadow-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center font-medium text-forest-900 hover:bg-linen/40 rounded-full transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-serif text-sm text-forest-950">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center font-medium text-forest-900 hover:bg-linen/40 rounded-full transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="border-t border-stone-100 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal ({quantity} pack{quantity > 1 ? 's' : ''})</span>
              <span className="font-medium text-forest-950">£{(supply.price * quantity).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>UK VAT (20%)</span>
              <span className="font-medium text-forest-950">£{vatTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Tracked Medical Courier</span>
              <span className="font-medium text-sage-700">FREE</span>
            </div>
            <div className="flex justify-between text-base font-serif text-forest-950 pt-2 border-t border-stone-100">
              <span>Total Due</span>
              <span>£{grandTotal.toFixed(2)}</span>
            </div>
            <p className="text-[11px] text-stone-400">Payment options: 30-day BACS school invoice or instant card payment at checkout.</p>
          </div>

          {/* Action Button */}
          <button
            onClick={handleConfirmReorder}
            className="w-full py-3.5 rounded-full bg-[#096556] hover:bg-[#075246] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-[#096556]/20"
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
