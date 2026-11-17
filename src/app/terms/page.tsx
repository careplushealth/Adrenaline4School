import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileText, Scale, Building2, Truck, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'Terms of Supply & School Credit Agreement | Adrenaline4Schools',
  description: 'Official terms and conditions for UK schools ordering emergency adrenaline auto-injectors and 30-day BACS credit agreements.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] font-sans">
      {/* Header */}
      <section className="bg-[#f5f5f7] py-20 px-4 sm:px-6 lg:px-8 border-b border-black/[0.06] relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-[#09653d] border border-[#09653d]/20 flex items-center justify-center mx-auto">
            <Scale className="w-7 h-7" />
          </div>
          <span className="inline-block text-[#09653d] text-xs font-semibold uppercase tracking-widest bg-emerald-500/10 px-3.5 py-1 rounded-full border border-[#09653d]/20">
            Legal & Regulatory Standard
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#1d1d1f] tracking-[-0.03em]">
            Terms of Supply & BACS School Agreement
          </h1>
          <p className="text-neutral-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Governing the statutory supply of emergency adrenaline auto-injectors (AAIs) to UK educational institutions under the Human Medicines (Amendment) Regulations 2017.
          </p>
          <p className="text-xs text-neutral-400">Last updated: October 2026 · Adrenaline4Schools Ltd</p>
        </div>
      </section>

      {/* Main Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 leading-relaxed text-neutral-700 text-sm">
        {/* Key Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-5 rounded-[22px] bg-[#f5f5f7] border border-black/[0.06] text-xs space-y-1.5 transition-all hover:shadow-xs">
            <p className="font-semibold text-[#09653d] flex items-center gap-1.5 text-sm">
              <ShieldCheck className="w-4 h-4" /> GPhC Regulated
            </p>
            <p className="text-neutral-500 leading-normal">All medicines dispensed strictly by licensed UK pharmacy superintendent partners.</p>
          </div>
          <div className="p-5 rounded-[22px] bg-[#f5f5f7] border border-black/[0.06] text-xs space-y-1.5 transition-all hover:shadow-xs">
            <p className="font-semibold text-[#09653d] flex items-center gap-1.5 text-sm">
              <FileText className="w-4 h-4" /> 30-Day BACS Invoicing
            </p>
            <p className="text-neutral-500 leading-normal">Standard 30-day payment terms for all UK state schools, academies, MATs, and PRUs.</p>
          </div>
          <div className="p-5 rounded-[22px] bg-[#f5f5f7] border border-black/[0.06] text-xs space-y-1.5 transition-all hover:shadow-xs">
            <p className="font-semibold text-[#09653d] flex items-center gap-1.5 text-sm">
              <Truck className="w-4 h-4" /> Tracked Cold-Chain
            </p>
            <p className="text-neutral-500 leading-normal">Controlled transport conforming to MHRA Good Distribution Practice (GDP).</p>
          </div>
        </div>

        {/* Section 1 */}
        <section className="space-y-3 border-t border-black/[0.06] pt-8">
          <h2 className="text-xl font-bold text-[#1d1d1f] flex items-center gap-2.5 tracking-tight">
            <span className="w-6 h-6 rounded-full bg-[#09653d] text-white text-xs flex items-center justify-center font-bold">1</span>
            Statutory Basis of Supply
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            Adrenaline auto-injectors (including EpiPen®, Jext®, and Emerade®) are Prescription-Only Medicines (POM). Under <strong className="text-[#1d1d1f]">The Human Medicines (Amendment) Regulations 2017 (SI 2017/715)</strong>, schools in the United Kingdom are permitted to purchase and hold emergency adrenaline auto-injectors without a named patient prescription for use on pupils who are at risk of anaphylaxis.
          </p>
          <p className="text-neutral-600 leading-relaxed">
            Supply is conditional upon receipt of a signed <strong className="text-[#1d1d1f]">Headteacher Requisition Form</strong> on official school letterhead, stating the school name, DfE URN number, purpose for which the medicine is required, and quantities requested.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 border-t border-black/[0.06] pt-8">
          <h2 className="text-xl font-bold text-[#1d1d1f] flex items-center gap-2.5 tracking-tight">
            <span className="w-6 h-6 rounded-full bg-[#09653d] text-white text-xs flex items-center justify-center font-bold">2</span>
            GPhC Pharmacy Verification & Fulfilment
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            All orders placed on Adrenaline4Schools are fulfilled by our registered UK community dispensing pharmacy partners regulated by the <strong className="text-[#1d1d1f]">General Pharmaceutical Council (GPhC)</strong>.
          </p>
          <p className="text-neutral-600 leading-relaxed">
            Our superintendent pharmacist reviews each school order, verifies the educational institution&apos;s registration via the Department for Education (DfE) GIAS database, validates the Headteacher Requisition, and oversees batch allocation and clinical checking prior to courier collection.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 border-t border-black/[0.06] pt-8">
          <h2 className="text-xl font-bold text-[#1d1d1f] flex items-center gap-2.5 tracking-tight">
            <span className="w-6 h-6 rounded-full bg-[#09653d] text-white text-xs flex items-center justify-center font-bold">3</span>
            Payment Terms & 30-Day School BACS Credit
          </h2>
          <p className="text-neutral-600">
            We provide UK schools with automatic <strong className="text-[#1d1d1f]">30-Day BACS Credit Terms</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-neutral-600">
            <li>A formal VAT PDF invoice is issued automatically upon order confirmation, detailing our bank details and remittance reference.</li>
            <li>Schools agree to remit payment in full within 30 days of the invoice date via BACS, Faster Payments, or CHAPS quoting the invoice reference.</li>
            <li>Alternatively, schools may pay at checkout via debit or credit card (Visa, MasterCard, American Express) through our secure gateway.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 border-t border-black/[0.06] pt-8">
          <h2 className="text-xl font-bold text-[#1d1d1f] flex items-center gap-2.5 tracking-tight">
            <span className="w-6 h-6 rounded-full bg-[#09653d] text-white text-xs flex items-center justify-center font-bold">4</span>
            Delivery, Temperature Control & Inspection
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            Orders are dispatched by medical courier and delivered in 3 to 4 working days upon pharmacy verification. Adrenaline is temperature-sensitive and must be maintained between 15°C and 25°C.
          </p>
          <p className="text-neutral-600 leading-relaxed">
            School staff must inspect parcels upon arrival, verify that safety seals and sight-glasses show clear, discolouration-free adrenaline solution, and immediately place the auto-injectors in an accessible, safe location according to the school&apos;s allergy policy (not locked in an inaccessible office).
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 border-t border-black/[0.06] pt-8">
          <h2 className="text-xl font-bold text-[#1d1d1f] flex items-center gap-2.5 tracking-tight">
            <span className="w-6 h-6 rounded-full bg-[#09653d] text-white text-xs flex items-center justify-center font-bold">5</span>
            Automated Expiry Tracking & Clinical Responsibility
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            Adrenaline4Schools records the manufacturer batch number and printed expiration date of all supplied stock, and provides complimentary automated notifications at 12, 6, 3, and 1 month before recorded expiry.
          </p>
          <div className="p-5 rounded-[22px] bg-amber-500/[0.08] border border-amber-500/20 text-neutral-800 text-xs flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong className="text-amber-950 font-semibold">School Duty of Care:</strong> Our automated expiry reminders are an administrative aid. The legal duty to maintain valid, in-date emergency adrenaline auto-injectors remains with the school governing body and headteacher. Routine monthly visual checks of pens should always be conducted.
            </span>
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 border-t border-black/[0.06] pt-8">
          <h2 className="text-xl font-bold text-[#1d1d1f] flex items-center gap-2.5 tracking-tight">
            <span className="w-6 h-6 rounded-full bg-[#09653d] text-white text-xs flex items-center justify-center font-bold">6</span>
            Returns & Medical Safety Regulations
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            In accordance with UK pharmaceutical regulations and safety standards for Prescription-Only Medicines, once medical stock has left the registered pharmacy premises, it cannot be returned for resale or refund, unless delivered damaged or subject to an MHRA manufacturer recall.
          </p>
        </section>

        {/* Contact info box */}
        <div className="p-6 sm:p-8 rounded-[24px] bg-[#f5f5f7] border border-black/[0.06] text-xs space-y-2">
          <p className="font-bold text-[#1d1d1f] text-sm">Regulatory & Compliance Enquiries</p>
          <p className="text-neutral-600 leading-relaxed">For questions concerning school orders, requisitions, or BACS invoicing, contact our pharmacy operations desk at <a href="mailto:adrenaline4schools@gmail.com" className="text-[#09653d] underline font-semibold hover:opacity-80">adrenaline4schools@gmail.com</a> or call <a href="tel:01619733552" className="text-[#09653d] underline font-semibold hover:opacity-80">0161 973 3552</a>.</p>
        </div>
      </div>
    </div>
  );
}
