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
    <div className="min-h-screen bg-ivory text-forest-900 py-16 px-4 font-sans">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-5 border border-sage-200 shadow-xs">
            <CheckCircle className="w-8 h-8 text-sage-700" />
          </div>
          <h1 className="text-3xl font-serif font-normal text-forest-950 mb-2">
            {isBACS ? 'Order Submitted — Invoice Requested' : 'Order Confirmed & Payment Received'}
          </h1>
          <p className="text-stone-500 text-base">Thank you for your school order.</p>
        </div>

        {/* Order Card */}
        <div className="bg-white/90 rounded-3xl border border-stone-200/80 shadow-xs p-8 mb-6">
          <div className="text-center pb-6 border-b border-stone-100">
            <p className="text-xs text-stone-500 uppercase tracking-wider font-medium mb-1">Your Order Reference</p>
            <p className="text-3xl font-serif font-normal text-forest-950 tracking-wide">{ref}</p>
            <p className="text-stone-500 text-sm mt-2">Total: <strong className="text-forest-950 font-semibold">£{total}</strong> {isBACS ? '(invoice to follow)' : '(card payment authorised)'}</p>
          </div>

          <div className="py-6 space-y-5">
            {isBACS ? (
              <>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-sage-100 text-sage-900 flex items-center justify-center shrink-0 font-serif text-sm border border-sage-200/70">1</div>
                  <div>
                    <h3 className="font-serif font-medium text-sm text-forest-950">BACS Invoice Being Prepared</h3>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">Our finance team will issue your school&apos;s formal PDF invoice within 1 business day, with bank transfer details.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-sage-100 text-sage-900 flex items-center justify-center shrink-0 font-serif text-sm border border-sage-200/70">2</div>
                  <div>
                    <h3 className="font-serif font-medium text-sm text-forest-950">Pay Within 30 Days</h3>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">Transfer the total to the bank account shown on your invoice, quoting your invoice reference number.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-sage-100 text-sage-900 flex items-center justify-center shrink-0 font-serif text-sm border border-sage-200/70">3</div>
                  <div>
                    <h3 className="font-serif font-medium text-sm text-forest-950">Pharmacy Review & Dispatch</h3>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">Once your Headteacher Requisition is verified by our GPhC pharmacist and payment is confirmed, we&apos;ll dispatch next working day.</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-sage-100 text-sage-700 flex items-center justify-center shrink-0 font-medium text-sm border border-sage-200/70">✓</div>
                  <div>
                    <h3 className="font-serif font-medium text-sm text-forest-950">Card Payment Authorised</h3>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">Your payment of £{total} has been authorised and your order is awaiting GPhC pharmacy verification.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-sage-100 text-sage-900 flex items-center justify-center shrink-0 font-serif text-sm border border-sage-200/70">2</div>
                  <div>
                    <h3 className="font-serif font-medium text-sm text-forest-950">Requisition Review</h3>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">Our registered pharmacist will review your Headteacher Requisition within 1 working day.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-sage-100 text-sage-900 flex items-center justify-center shrink-0 font-serif text-sm border border-sage-200/70">3</div>
                  <div>
                    <h3 className="font-serif font-medium text-sm text-forest-950">Next Working Day Dispatch</h3>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">Your pens will be dispatched with tracked temperature-controlled courier. You&apos;ll receive a dispatch email with tracking.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/80 rounded-2xl border border-stone-200/70 p-4 text-center shadow-xs">
            <Truck className="w-5 h-5 mx-auto text-sage-700 mb-2" />
            <p className="text-xs font-serif text-forest-950">Next-day tracked delivery</p>
          </div>
          <div className="bg-white/80 rounded-2xl border border-stone-200/70 p-4 text-center shadow-xs">
            <BellRing className="w-5 h-5 mx-auto text-sage-700 mb-2" />
            <p className="text-xs font-serif text-forest-950">Expiry reminders set up</p>
          </div>
          <div className="bg-white/80 rounded-2xl border border-stone-200/70 p-4 text-center shadow-xs">
            <FileText className="w-5 h-5 mx-auto text-sage-700 mb-2" />
            <p className="text-xs font-serif text-forest-950">Confirmation email sent</p>
          </div>
        </div>

        {/* What Happens Next CTA */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/portal"
            className="flex-1 py-3.5 rounded-full bg-forest-900 hover:bg-forest-800 text-ivory font-medium text-xs tracking-wide flex items-center justify-center gap-2 shadow-xs transition-all"
          >
            Track in School Portal
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/training"
            className="flex-1 py-3.5 rounded-full border border-stone-200/90 hover:bg-linen/50 text-forest-900 font-medium text-xs flex items-center justify-center gap-2 transition-colors bg-white/80"
          >
            Staff Training Courses
          </Link>
        </div>

        <p className="text-center text-xs text-stone-400 mt-6">
          Questions? Contact us at <a href="mailto:support@adrenaline4schools.co.uk" className="text-sage-800 underline">support@adrenaline4schools.co.uk</a> or 0800 123 4567
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
