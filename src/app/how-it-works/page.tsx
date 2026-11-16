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
import FourStepProcess from '@/components/FourStepProcess';

export default function HowItWorksPage() {
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] font-sans">
      {/* Header — Apple Dark Editorial Banner */}
      <section className="bg-[#062e1c] text-slate-200 py-16 sm:py-20 px-4 border-b border-white/[0.08] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-emerald-300 text-[11px] font-semibold uppercase tracking-wider bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20">
            UK Pharmacy Requisition Guide
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-4 tracking-[-0.03em]">
            How ordering emergency pens works
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-sans">
            From Headteacher Requisition to temperature-controlled courier delivery (delivered in 3 to 4 working days), we manage the entire clinical process for your school.
          </p>
        </div>
      </section>

      {/* Animated 4-Step Visual Process Overview */}
      <FourStepProcess />

      {/* Main 4 Steps in Detail — Apple Step Cards */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-6">
        {/* Step 1 */}
        <div className="bg-[#f5f5f7] rounded-[28px] p-8 border border-black/[0.06] shadow-2xs hover:border-[#09653d]/30 transition-all flex flex-col md:flex-row gap-8 items-center">
          <div className="w-14 h-14 rounded-2xl bg-white text-[#09653d] border border-black/[0.06] flex items-center justify-center shrink-0 shadow-2xs">
            <Laptop className="w-7 h-7" />
          </div>
          <div className="space-y-3 flex-1">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Step 01</span>
              <h2 className="text-2xl font-bold text-[#1d1d1f] tracking-tight mt-0.5">Select your pens and doses</h2>
            </div>
            <p className="text-xs sm:text-[14px] text-slate-600 leading-relaxed font-sans">
              Choose the appropriate brands (EpiPen® or Jext®) and doses for your pupils at £60.69 per pen. In the UK, <strong className="font-semibold text-[#1d1d1f]">150 micrograms</strong> is typically recommended for primary pupils weighing 15–30kg, and <strong className="font-semibold text-[#1d1d1f]">300 micrograms</strong> for secondary pupils over 30kg.
            </p>
            <div className="pt-1">
              <Link
                href="/order-pens"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#09653d] hover:bg-[#064e2e] text-white text-xs font-semibold tracking-tight transition-all shadow-xs apple-btn"
              >
                Select your pen <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-[#f5f5f7] rounded-[28px] p-8 border border-black/[0.06] shadow-2xs hover:border-[#09653d]/30 transition-all flex flex-col md:flex-row gap-8 items-center">
          <div className="w-14 h-14 rounded-2xl bg-white text-[#09653d] border border-black/[0.06] flex items-center justify-center shrink-0 shadow-2xs">
            <FileSignature className="w-7 h-7" />
          </div>
          <div className="space-y-3 flex-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Step 02</span>
            <h2 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">Complete your Headteacher Requisition</h2>
            <p className="text-xs sm:text-[14px] text-slate-600 leading-relaxed font-sans">
              Schools can hold spare emergency auto-injectors without named pupil prescriptions, provided an order is signed by the Headteacher or Principal. Our platform assists your school with a simple, standardized requisition order.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-[#f5f5f7] rounded-[28px] p-8 border border-black/[0.06] shadow-2xs hover:border-[#09653d]/30 transition-all flex flex-col md:flex-row gap-8 items-center">
          <div className="w-14 h-14 rounded-2xl bg-white text-[#09653d] border border-black/[0.06] flex items-center justify-center shrink-0 shadow-2xs">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div className="space-y-2 flex-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Step 03</span>
            <h2 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">GPhC Registered Pharmacy verification</h2>
            <p className="text-xs sm:text-[14px] text-slate-600 leading-relaxed font-sans">
              Upload your signed requisition during checkout or email it to our clinical team. Our Superintendent Pharmacist verifies the details against the DfE register and approves dispensing.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-[#f5f5f7] rounded-[28px] p-8 border border-black/[0.06] shadow-2xs hover:border-[#09653d]/30 transition-all flex flex-col md:flex-row gap-8 items-center">
          <div className="w-14 h-14 rounded-2xl bg-white text-[#09653d] border border-black/[0.06] flex items-center justify-center shrink-0 shadow-2xs">
            <Truck className="w-7 h-7" />
          </div>
          <div className="space-y-2 flex-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Step 04</span>
            <h2 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">Tracked delivery & automated expiry tracking</h2>
            <p className="text-xs sm:text-[14px] text-slate-600 leading-relaxed font-sans">
              Your emergency pens are delivered in 3 to 4 working days in temperature-controlled packaging. We log the exact batch numbers and expiry dates in your portal and automatically notify you at 12, 6, 3, and 1 month prior to expiration.
            </p>
          </div>
        </div>

        {/* Payment Comparison: BACS vs Card — Apple Comparison Grid */}
        <div className="bg-[#f5f5f7] rounded-[32px] sm:rounded-[36px] p-8 sm:p-12 border border-black/[0.06] shadow-2xs mt-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] text-center mb-2 tracking-tight">School Payment Options Explained</h2>
          <p className="text-xs sm:text-sm text-slate-600 text-center max-w-xl mx-auto mb-8 font-sans">
            We support standard educational purchasing workflows for schools, academies, and local authorities.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[24px] p-7 border border-black/[0.06] shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] text-[#09653d] border border-black/[0.06] flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#1d1d1f] mb-2 tracking-tight">30-Day BACS School Invoice (Recommended)</h3>
              <ul className="space-y-2.5 text-xs text-slate-600 font-sans">
                <li className="flex items-center gap-2 text-slate-800"><CheckCircle className="w-3.5 h-3.5 text-[#09653d]" /> Enter school Purchase Order (PO) number</li>
                <li className="flex items-center gap-2 text-slate-800"><CheckCircle className="w-3.5 h-3.5 text-[#09653d]" /> Compliant PDF invoice generated immediately</li>
                <li className="flex items-center gap-2 text-slate-800"><CheckCircle className="w-3.5 h-3.5 text-[#09653d]" /> Pay by bank transfer within 30 days of issue</li>
                <li className="flex items-center gap-2 text-slate-800"><CheckCircle className="w-3.5 h-3.5 text-[#09653d]" /> Used by 85%+ of UK primary and secondary schools</li>
              </ul>
            </div>

            <div className="bg-white rounded-[24px] p-7 border border-black/[0.06] shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] text-[#09653d] border border-black/[0.06] flex items-center justify-center mb-4">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#1d1d1f] mb-2 tracking-tight">Debit / Credit Card Payment</h3>
              <ul className="space-y-2.5 text-xs text-slate-600 font-sans">
                <li className="flex items-center gap-2 text-slate-800"><CheckCircle className="w-3.5 h-3.5 text-[#09653d]" /> Instant online authorization</li>
                <li className="flex items-center gap-2 text-slate-800"><CheckCircle className="w-3.5 h-3.5 text-[#09653d]" /> Visa, Mastercard, and purchasing cards accepted</li>
                <li className="flex items-center gap-2 text-slate-800"><CheckCircle className="w-3.5 h-3.5 text-[#09653d]" /> Instant VAT receipt sent via email</li>
                <li className="flex items-center gap-2 text-slate-800"><CheckCircle className="w-3.5 h-3.5 text-[#09653d]" /> Immediate progression to pharmacy review queue</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link
            href="/order-pens"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#09653d] hover:bg-[#064e2e] text-white font-semibold text-sm tracking-tight shadow-sm hover:shadow-md transition-all apple-btn"
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
