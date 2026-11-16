'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, FileText, Truck, BellRing, ArrowRight } from 'lucide-react';

function OrderConfirmationContent() {
  const params = useSearchParams();
  const ref = params?.get('ref') || 'A4S-2026-00104';
  const method = params?.get('method') || 'bacs_invoice';
  const total = params?.get('total') || '0.00';
  const isBACS = method === 'bacs_invoice';

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] py-16 sm:py-20 px-4 font-sans">
      <div className="max-w-2xl mx-auto">
        {/* Success Header — Apple Style */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#09653d]/[0.08] flex items-center justify-center mx-auto mb-5 border border-[#09653d]/15 shadow-2xs">
            <CheckCircle className="w-8 h-8 text-[#09653d]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] mb-2 tracking-tight">
            {isBACS ? 'Order Submitted — Invoice Requested' : 'Order Confirmed & Payment Received'}
          </h1>
          <p className="text-slate-500 text-base font-sans">Thank you for your school order.</p>
        </div>

        {/* Order Card — Apple Card */}
        <div className="bg-[#f5f5f7] rounded-[32px] border border-black/[0.06] shadow-2xs p-8 mb-6">
          <div className="text-center pb-6 border-b border-black/[0.06]">
            <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Your Order Reference</p>
            <p className="text-3xl font-bold text-[#1d1d1f] tracking-tight">{ref}</p>
            <p className="text-slate-500 text-sm mt-2 font-sans">Total: <strong className="text-[#1d1d1f] font-bold">£{total}</strong> {isBACS ? '(invoice to follow)' : '(card payment authorised)'}</p>
          </div>

          <div className="py-6 space-y-5">
            {isBACS ? (
              <>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#09653d] text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-xs">1</div>
                  <div>
                    <h3 className="font-semibold text-sm text-[#1d1d1f] tracking-tight">BACS Invoice Being Prepared</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed font-sans">Our finance team will issue your school&apos;s formal PDF invoice within 1 business day, with bank transfer details.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#09653d] text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-xs">2</div>
                  <div>
                    <h3 className="font-semibold text-sm text-[#1d1d1f] tracking-tight">Pay Within 30 Days</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed font-sans">Transfer the total to the bank account shown on your invoice, quoting your invoice reference number.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#09653d] text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-xs">3</div>
                  <div>
                    <h3 className="font-semibold text-sm text-[#1d1d1f] tracking-tight">Pharmacy Review & Dispatch</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed font-sans">Once your Headteacher Requisition is verified by our GPhC pharmacist and payment is confirmed, your order will be delivered in 3 to 4 working days.</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#09653d] text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-xs">✓</div>
                  <div>
                    <h3 className="font-semibold text-sm text-[#1d1d1f] tracking-tight">Card Payment Authorised</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed font-sans">Your payment of £{total} has been authorised and your order is awaiting GPhC pharmacy verification.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#09653d] text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-xs">2</div>
                  <div>
                    <h3 className="font-semibold text-sm text-[#1d1d1f] tracking-tight">Requisition Review</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed font-sans">Our registered pharmacist will review your Headteacher Requisition within 1 working day.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#09653d] text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-xs">3</div>
                  <div>
                    <h3 className="font-semibold text-sm text-[#1d1d1f] tracking-tight">Medical Courier Delivery</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed font-sans">Your pens will be delivered in 3 to 4 working days with tracked temperature-controlled courier transport.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Service Cards — Apple Squircle Triplet */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-[#f5f5f7] rounded-2xl border border-black/[0.06] p-4 text-center shadow-2xs">
            <Truck className="w-5 h-5 mx-auto text-[#09653d] mb-2" />
            <p className="text-xs font-semibold text-[#1d1d1f]">Delivered in 3 to 4 working days</p>
          </div>
          <div className="bg-[#f5f5f7] rounded-2xl border border-black/[0.06] p-4 text-center shadow-2xs">
            <BellRing className="w-5 h-5 mx-auto text-[#09653d] mb-2" />
            <p className="text-xs font-semibold text-[#1d1d1f]">Expiry reminders set up</p>
          </div>
          <div className="bg-[#f5f5f7] rounded-2xl border border-black/[0.06] p-4 text-center shadow-2xs">
            <FileText className="w-5 h-5 mx-auto text-[#09653d] mb-2" />
            <p className="text-xs font-semibold text-[#1d1d1f]">Confirmation email sent</p>
          </div>
        </div>

        {/* What Happens Next CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/portal"
            className="flex-1 py-3.5 rounded-full bg-[#09653d] hover:bg-[#064e2e] text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all apple-btn"
          >
            Track in School Portal
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/order-pens"
            className="flex-1 py-3.5 rounded-full border border-black/[0.08] hover:bg-[#f5f5f7] text-[#1d1d1f] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors bg-white shadow-2xs apple-btn"
          >
            Order Additional Pens
          </Link>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6 font-sans">
          Questions? Contact us at <a href="mailto:support@adrenaline4schools.co.uk" className="text-[#09653d] underline font-medium">support@adrenaline4schools.co.uk</a> or <a href="tel:01619733552" className="text-[#09653d] underline font-medium">0161 973 3552</a>
        </p>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-sage-600 border-t-transparent rounded-full" /></div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
