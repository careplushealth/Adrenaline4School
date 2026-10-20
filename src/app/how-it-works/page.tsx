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
    <div className="min-h-screen bg-white text-[#0c2340] font-sans">
      {/* Header */}
      <section className="bg-[#0c2340] text-slate-200 py-16 px-4 border-b border-slate-800 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-teal-300 text-xs font-bold uppercase tracking-widest bg-teal-500/20 px-3.5 py-1 rounded-full border border-teal-500/30">
            UK Pharmacy Requisition Guide
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-4 tracking-tight">
            How ordering emergency pens works
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            From Headteacher Requisition to temperature-controlled next-day courier delivery, we manage the entire clinical process for your school.
          </p>
        </div>
      </section>

      {/* Animated 4-Step Visual Process Overview */}
      <FourStepProcess />

      {/* Main 4 Steps in Detail */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        {/* Step 1 */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:border-[#007a60] transition-all flex flex-col md:flex-row gap-8 items-center">
          <div className="w-14 h-14 rounded-2xl bg-[#e8f4f8] text-[#007a60] border border-teal-200 flex items-center justify-center shrink-0">
            <Laptop className="w-7 h-7" />
          </div>
          <div className="space-y-2 flex-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 01</span>
            <h2 className="text-2xl font-bold text-[#0c2340]">Select your pens and doses</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Choose the appropriate brands (EpiPen® or Jext®) and doses for your pupils. In the UK, <strong className="font-bold text-[#0c2340]">150 micrograms</strong> is typically recommended for primary pupils weighing 15–30kg, and <strong className="font-bold text-[#0c2340]">300 micrograms</strong> for secondary pupils and adults over 30kg.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:border-[#007a60] transition-all flex flex-col md:flex-row gap-8 items-center">
          <div className="w-14 h-14 rounded-2xl bg-[#e8f4f8] text-[#007a60] border border-teal-200 flex items-center justify-center shrink-0">
            <FileSignature className="w-7 h-7" />
          </div>
          <div className="space-y-3 flex-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 02</span>
            <h2 className="text-2xl font-bold text-[#0c2340]">Complete your Headteacher Requisition</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Under the Human Medicines (Amendment) Regulations 2017, schools can hold spare auto-injectors without named prescriptions, provided an order is signed by the Headteacher or Principal. Our platform generates this official pre-filled form in 1 click.
            </p>
            <button
              onClick={() => setIsReqModalOpen(true)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#096556] hover:text-[#075145] underline"
            >
              <FileText className="w-3.5 h-3.5" /> Generate and preview your school requisition now &rarr;
            </button>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:border-[#096556] transition-all flex flex-col md:flex-row gap-8 items-center">
          <div className="w-14 h-14 rounded-2xl bg-[#e6f5f1] text-[#096556] border border-[#c6eee3] flex items-center justify-center shrink-0">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div className="space-y-2 flex-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 03</span>
            <h2 className="text-2xl font-bold text-[#0c2340]">GPhC Registered Pharmacy verification</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Upload your signed requisition during checkout or email it to our clinical team. Our Superintendent Pharmacist verifies the details against the DfE register and approves dispensing.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:border-[#096556] transition-all flex flex-col md:flex-row gap-8 items-center">
          <div className="w-14 h-14 rounded-2xl bg-[#e6f5f1] text-[#096556] border border-[#c6eee3] flex items-center justify-center shrink-0">
            <Truck className="w-7 h-7" />
          </div>
          <div className="space-y-2 flex-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 04</span>
            <h2 className="text-2xl font-bold text-[#0c2340]">Tracked delivery & automated expiry tracking</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Your emergency pens are dispatched next working day in temperature-controlled packaging. We log the exact batch numbers and expiry dates in your portal and automatically notify you at 12, 6, 3, and 1 month prior to expiration.
            </p>
          </div>
        </div>

        {/* Payment Comparison: BACS vs Card */}
        <div className="bg-[#f4faf8] rounded-3xl p-8 border border-[#d8eee6] shadow-sm">
          <h2 className="text-2xl font-bold text-[#0c2340] text-center mb-2">School Payment Options Explained</h2>
          <p className="text-xs sm:text-sm text-slate-600 text-center max-w-xl mx-auto mb-8">
            We support standard educational purchasing workflows for schools, academies, and local authorities.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#e6f5f1] text-[#096556] border border-[#c6eee3] flex items-center justify-center mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#0c2340] mb-2">30-Day BACS School Invoice (Recommended)</h3>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2 text-slate-800"><CheckCircle className="w-3.5 h-3.5 text-[#096556]" /> Enter school Purchase Order (PO) number</li>
                <li className="flex items-center gap-2 text-slate-800"><CheckCircle className="w-3.5 h-3.5 text-[#096556]" /> Compliant PDF invoice generated immediately</li>
                <li className="flex items-center gap-2 text-slate-800"><CheckCircle className="w-3.5 h-3.5 text-[#096556]" /> Pay by bank transfer within 30 days of issue</li>
                <li className="flex items-center gap-2 text-slate-800"><CheckCircle className="w-3.5 h-3.5 text-[#096556]" /> Used by 85%+ of UK primary and secondary schools</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#e6f5f1] text-[#096556] border border-[#c6eee3] flex items-center justify-center mb-3">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#0c2340] mb-2">Debit / Credit Card Payment</h3>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2 text-slate-800"><CheckCircle className="w-3.5 h-3.5 text-[#096556]" /> Instant online authorization</li>
                <li className="flex items-center gap-2 text-slate-800"><CheckCircle className="w-3.5 h-3.5 text-[#096556]" /> Visa, Mastercard, and purchasing cards accepted</li>
                <li className="flex items-center gap-2 text-slate-800"><CheckCircle className="w-3.5 h-3.5 text-[#096556]" /> Instant VAT receipt sent via email</li>
                <li className="flex items-center gap-2 text-slate-800"><CheckCircle className="w-3.5 h-3.5 text-[#096556]" /> Immediate progression to pharmacy review queue</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link
            href="/order-pens"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#096556] hover:bg-[#075145] text-white font-bold text-sm tracking-wide shadow-sm hover:shadow-md transition-all"
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
