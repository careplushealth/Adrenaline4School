'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Laptop,
  FileSignature,
  UploadCloud,
  Truck,
  CheckCircle,
  FileText,
  CreditCard,
  ArrowRight,
} from 'lucide-react';
import RequisitionModal from '@/components/RequisitionModal';

export default function HowItWorksPage() {
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ivory text-forest-900 font-sans">
      {/* Header */}
      <section className="bg-forest-950 text-stone-200 py-16 px-4 border-b border-forest-900/60 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #FAF8F5 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-gold-300 text-xs font-semibold uppercase tracking-widest bg-gold-400/10 px-3.5 py-1 rounded-full border border-gold-400/20">
            UK Pharmacy Requisition Guide
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-normal text-ivory mt-4 mb-4 tracking-tight">
            How ordering emergency pens works
          </h1>
          <p className="text-stone-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            From Headteacher Requisition to temperature-controlled next-day courier delivery, we manage the entire clinical process for your school.
          </p>
        </div>
      </section>

      {/* Main 4 Steps in Detail */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        {/* Step 1 */}
        <div className="bg-white/90 rounded-3xl p-8 border border-stone-200/80 shadow-xs hover:border-sage-400 transition-all flex flex-col md:flex-row gap-8 items-center">
          <div className="w-14 h-14 rounded-2xl bg-sage-50 text-sage-800 border border-sage-200/70 flex items-center justify-center shrink-0">
            <Laptop className="w-7 h-7" />
          </div>
          <div className="space-y-2 flex-1">
            <span className="text-xs font-mono font-medium text-stone-400 uppercase tracking-wider">Step 01</span>
            <h2 className="text-2xl font-serif font-normal text-forest-950">Select your pens and doses</h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Choose the appropriate brands (EpiPen® or Jext®) and doses for your pupils. In the UK, <strong className="font-semibold text-forest-950">150 micrograms</strong> is typically recommended for primary pupils weighing 15–30kg, and <strong className="font-semibold text-forest-950">300 micrograms</strong> for secondary pupils and adults over 30kg.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white/90 rounded-3xl p-8 border border-stone-200/80 shadow-xs hover:border-sage-400 transition-all flex flex-col md:flex-row gap-8 items-center">
          <div className="w-14 h-14 rounded-2xl bg-sage-50 text-sage-800 border border-sage-200/70 flex items-center justify-center shrink-0">
            <FileSignature className="w-7 h-7" />
          </div>
          <div className="space-y-3 flex-1">
            <span className="text-xs font-mono font-medium text-stone-400 uppercase tracking-wider">Step 02</span>
            <h2 className="text-2xl font-serif font-normal text-forest-950">Complete your Headteacher Requisition</h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Under the Human Medicines (Amendment) Regulations 2017, schools can hold spare auto-injectors without named prescriptions, provided an order is signed by the Headteacher or Principal. Our platform generates this official pre-filled form in 1 click.
            </p>
            <button
              onClick={() => setIsReqModalOpen(true)}
              className="inline-flex items-center gap-2 text-xs font-medium text-sage-800 hover:text-forest-950 underline"
            >
              <FileText className="w-3.5 h-3.5" /> Generate and preview your school requisition now &rarr;
            </button>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white/90 rounded-3xl p-8 border border-stone-200/80 shadow-xs hover:border-sage-400 transition-all flex flex-col md:flex-row gap-8 items-center">
          <div className="w-14 h-14 rounded-2xl bg-sage-50 text-sage-800 border border-sage-200/70 flex items-center justify-center shrink-0">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div className="space-y-2 flex-1">
            <span className="text-xs font-mono font-medium text-stone-400 uppercase tracking-wider">Step 03</span>
            <h2 className="text-2xl font-serif font-normal text-forest-950">GPhC Registered Pharmacy verification</h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Upload your signed requisition during checkout or email it to our clinical team. Our Superintendent Pharmacist verifies the details against the DfE register and approves dispensing.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-white/90 rounded-3xl p-8 border border-stone-200/80 shadow-xs hover:border-sage-400 transition-all flex flex-col md:flex-row gap-8 items-center">
          <div className="w-14 h-14 rounded-2xl bg-sage-50 text-sage-800 border border-sage-200/70 flex items-center justify-center shrink-0">
            <Truck className="w-7 h-7" />
          </div>
          <div className="space-y-2 flex-1">
            <span className="text-xs font-mono font-medium text-stone-400 uppercase tracking-wider">Step 04</span>
            <h2 className="text-2xl font-serif font-normal text-forest-950">Tracked delivery & automated expiry tracking</h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Your emergency pens are dispatched next working day in temperature-controlled packaging. We log the exact batch numbers and expiry dates in your portal and automatically notify you at 12, 6, 3, and 1 month prior to expiration.
            </p>
          </div>
        </div>

        {/* Payment Comparison: BACS vs Card */}
        <div className="bg-linen/40 rounded-3xl p-8 border border-stone-200/80 shadow-xs">
          <h2 className="text-2xl font-serif font-normal text-forest-950 text-center mb-2">School Payment Options Explained</h2>
          <p className="text-xs sm:text-sm text-stone-500 text-center max-w-xl mx-auto mb-8">
            We support standard educational purchasing workflows for schools, academies, and local authorities.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/90 rounded-2xl p-6 border border-stone-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-sage-50 text-sage-800 border border-sage-200 flex items-center justify-center mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-medium text-base text-forest-950 mb-2">30-Day BACS School Invoice (Recommended)</h3>
              <ul className="space-y-2 text-xs text-stone-600">
                <li className="flex items-center gap-2 text-forest-950"><CheckCircle className="w-3.5 h-3.5 text-sage-600" /> Enter school Purchase Order (PO) number</li>
                <li className="flex items-center gap-2 text-forest-950"><CheckCircle className="w-3.5 h-3.5 text-sage-600" /> Compliant PDF invoice generated immediately</li>
                <li className="flex items-center gap-2 text-forest-950"><CheckCircle className="w-3.5 h-3.5 text-sage-600" /> Pay by bank transfer within 30 days of issue</li>
                <li className="flex items-center gap-2 text-forest-950"><CheckCircle className="w-3.5 h-3.5 text-sage-600" /> Used by 85%+ of UK primary and secondary schools</li>
              </ul>
            </div>

            <div className="bg-white/90 rounded-2xl p-6 border border-stone-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-sage-50 text-sage-800 border border-sage-200 flex items-center justify-center mb-3">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-medium text-base text-forest-950 mb-2">Debit / Credit Card Payment</h3>
              <ul className="space-y-2 text-xs text-stone-600">
                <li className="flex items-center gap-2 text-forest-950"><CheckCircle className="w-3.5 h-3.5 text-sage-600" /> Instant online authorization</li>
                <li className="flex items-center gap-2 text-forest-950"><CheckCircle className="w-3.5 h-3.5 text-sage-600" /> Visa, Mastercard, and purchasing cards accepted</li>
                <li className="flex items-center gap-2 text-forest-950"><CheckCircle className="w-3.5 h-3.5 text-sage-600" /> Instant VAT receipt sent via email</li>
                <li className="flex items-center gap-2 text-forest-950"><CheckCircle className="w-3.5 h-3.5 text-sage-600" /> Immediate progression to pharmacy review queue</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link
            href="/order-pens"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-forest-900 hover:bg-forest-800 text-ivory font-medium text-sm tracking-wide shadow-xs transition-all"
          >
            <span>Choose Your School Pens</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <RequisitionModal isOpen={isReqModalOpen} onClose={() => setIsReqModalOpen(false)} />
    </div>
  );
}
