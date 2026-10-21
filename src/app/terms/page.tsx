import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileText, Scale, Building2, Truck, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'Terms of Supply & School Credit Agreement | Adrenaline4Schools',
  description: 'Official terms and conditions for UK schools ordering emergency adrenaline auto-injectors and 30-day BACS credit agreements.',
};

export default function TermsPage() {
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

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center mx-auto">
            <Scale className="w-6 h-6" />
          </div>
          <span className="text-teal-300 text-xs font-bold uppercase tracking-widest bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
            Legal & Regulatory Standard
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Terms of Supply & BACS School Agreement
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Governing the statutory supply of emergency adrenaline auto-injectors (AAIs) to UK educational institutions under the Human Medicines (Amendment) Regulations 2017.
          </p>
          <p className="text-xs text-slate-400">Last updated: October 2026 · Adrenaline4Schools Ltd</p>
        </div>
      </section>

      {/* Main Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10 leading-relaxed text-slate-700 text-sm">
        {/* Key Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#f0faf7] border border-[#c6eee3] text-xs space-y-1">
            <p className="font-bold text-[#096556] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> GPhC Regulated
            </p>
            <p className="text-slate-600">All medicines dispensed strictly by licensed UK pharmacy superintendent partners.</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#f0faf7] border border-[#c6eee3] text-xs space-y-1">
            <p className="font-bold text-[#096556] flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> 30-Day BACS Invoicing
            </p>
            <p className="text-slate-600">Standard 30-day payment terms for all UK state schools, academies, MATs, and PRUs.</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#f0faf7] border border-[#c6eee3] text-xs space-y-1">
            <p className="font-bold text-[#096556] flex items-center gap-1.5">
              <Truck className="w-4 h-4" /> Tracked Cold-Chain
            </p>
            <p className="text-slate-600">Controlled transport conforming to MHRA Good Distribution Practice (GDP).</p>
          </div>
        </div>

        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0c2340] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#096556] text-white text-xs flex items-center justify-center font-bold">1</span>
            Statutory Basis of Supply
          </h2>
          <p>
            Adrenaline auto-injectors (including EpiPen®, Jext®, and Emerade®) are Prescription-Only Medicines (POM). Under <strong>The Human Medicines (Amendment) Regulations 2017 (SI 2017/715)</strong>, schools in the United Kingdom are permitted to purchase and hold emergency adrenaline auto-injectors without a named patient prescription for use on pupils who are at risk of anaphylaxis.
          </p>
          <p>
            Supply is conditional upon receipt of a signed <strong>Headteacher Requisition Form</strong> on official school letterhead, stating the school name, DfE URN number, purpose for which the medicine is required, and quantities requested.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0c2340] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#096556] text-white text-xs flex items-center justify-center font-bold">2</span>
            GPhC Pharmacy Verification & Fulfilment
          </h2>
          <p>
            All orders placed on Adrenaline4Schools are fulfilled by our registered UK community dispensing pharmacy partners regulated by the <strong>General Pharmaceutical Council (GPhC)</strong>.
          </p>
          <p>
            Our superintendent pharmacist reviews each school order, verifies the educational institution&apos;s registration via the Department for Education (DfE) GIAS database, validates the Headteacher Requisition, and oversees batch allocation and clinical checking prior to courier collection.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0c2340] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#096556] text-white text-xs flex items-center justify-center font-bold">3</span>
            Payment Terms & 30-Day School BACS Credit
          </h2>
          <p>
            We provide UK schools with automatic <strong>30-Day BACS Credit Terms</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li>A formal VAT PDF invoice is issued automatically upon order confirmation, detailing our bank details and remittance reference.</li>
            <li>Schools agree to remit payment in full within 30 days of the invoice date via BACS, Faster Payments, or CHAPS quoting the invoice reference.</li>
            <li>Alternatively, schools may pay at checkout via debit or credit card (Visa, MasterCard, American Express) through our secure gateway.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0c2340] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#096556] text-white text-xs flex items-center justify-center font-bold">4</span>
            Delivery, Temperature Control & Inspection
          </h2>
          <p>
            Orders are dispatched by medical courier next working day upon pharmacy verification. Adrenaline is temperature-sensitive and must be maintained between 15°C and 25°C.
          </p>
          <p>
            School staff must inspect parcels upon arrival, verify that safety seals and sight-glasses show clear, discolouration-free adrenaline solution, and immediately place the auto-injectors in an accessible, safe location according to the school&apos;s allergy policy (not locked in an inaccessible office).
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0c2340] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#096556] text-white text-xs flex items-center justify-center font-bold">5</span>
            Automated Expiry Tracking & Clinical Responsibility
          </h2>
          <p>
            Adrenaline4Schools records the manufacturer batch number and printed expiration date of all supplied stock, and provides complimentary automated notifications at 12, 6, 3, and 1 month before recorded expiry.
          </p>
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              <strong>School Duty of Care:</strong> Our automated expiry reminders are an administrative aid. The legal duty to maintain valid, in-date emergency adrenaline auto-injectors remains with the school governing body and headteacher. Routine monthly visual checks of pens should always be conducted.
            </span>
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0c2340] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#096556] text-white text-xs flex items-center justify-center font-bold">6</span>
            Returns & Medical Safety Regulations
          </h2>
          <p>
            In accordance with UK pharmaceutical regulations and safety standards for Prescription-Only Medicines, once medical stock has left the registered pharmacy premises, it cannot be returned for resale or refund, unless delivered damaged or subject to an MHRA manufacturer recall.
          </p>
        </section>

        {/* Contact info box */}
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <p className="font-bold text-[#0c2340]">Regulatory & Compliance Enquiries</p>
          <p>For questions concerning school orders, requisitions, or BACS invoicing, contact our pharmacy operations desk at <a href="mailto:support@adrenaline4schools.co.uk" className="text-[#096556] underline font-semibold">support@adrenaline4schools.co.uk</a> or call 0800 123 4567.</p>
        </div>
      </div>
    </div>
  );
}
