import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileText, Database, UserCheck } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy & School Data Protection | Adrenaline4Schools',
  description: 'How Adrenaline4Schools protects and processes school staff, headteacher, and educational institution data in compliance with UK GDPR and DfE standards.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] font-sans">
      {/* Header */}
      <section className="bg-[#f5f5f7] py-20 px-4 sm:px-6 lg:px-8 border-b border-black/[0.06] relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-[#09653d] border border-[#09653d]/20 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <span className="inline-block text-[#09653d] text-xs font-semibold uppercase tracking-widest bg-emerald-500/10 px-3.5 py-1 rounded-full border border-[#09653d]/20">
            UK GDPR Compliant
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#1d1d1f] tracking-[-0.03em]">
            Privacy Policy & Data Protection
          </h1>
          <p className="text-neutral-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Our commitment to safeguarding educational institution records, headteacher requisitions, and school staff data.
          </p>
          <p className="text-xs text-neutral-400">Last updated: October 2026 · Adrenaline4Schools Ltd</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 leading-relaxed text-neutral-700 text-sm">
        {/* Core Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-5 rounded-[22px] bg-[#f5f5f7] border border-black/[0.06] text-xs space-y-1.5 transition-all hover:shadow-xs">
            <p className="font-semibold text-[#09653d] flex items-center gap-1.5 text-sm">
              <Database className="w-4 h-4" /> Secure Neon Cloud
            </p>
            <p className="text-neutral-500 leading-normal">Enterprise PostgreSQL with TLS 1.3 encryption at rest and in transit.</p>
          </div>
          <div className="p-5 rounded-[22px] bg-[#f5f5f7] border border-black/[0.06] text-xs space-y-1.5 transition-all hover:shadow-xs">
            <p className="font-semibold text-[#09653d] flex items-center gap-1.5 text-sm">
              <UserCheck className="w-4 h-4" /> Strictly B2B / Schools
            </p>
            <p className="text-neutral-500 leading-normal">We do not store pupil medical names; only institutional emergency stock records.</p>
          </div>
          <div className="p-5 rounded-[22px] bg-[#f5f5f7] border border-black/[0.06] text-xs space-y-1.5 transition-all hover:shadow-xs">
            <p className="font-semibold text-[#09653d] flex items-center gap-1.5 text-sm">
              <Eye className="w-4 h-4" /> No Third-Party Selling
            </p>
            <p className="text-neutral-500 leading-normal">Data is used solely for clinical fulfilment, invoicing, and expiry notifications.</p>
          </div>
        </div>

        {/* Section 1 */}
        <section className="space-y-3 border-t border-black/[0.06] pt-8">
          <h2 className="text-xl font-bold text-[#1d1d1f] tracking-tight">1. Who We Are</h2>
          <p className="text-neutral-600 leading-relaxed">
            Adrenaline4Schools Ltd is the Data Controller responsible for this platform. We operate in partnership with UK General Pharmaceutical Council (GPhC) registered dispensing pharmacies to supply emergency adrenaline auto-injectors to nurseries, primary schools, secondary schools, academies, multi-academy trusts (MATs), and independent educational establishments.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 border-t border-black/[0.06] pt-8">
          <h2 className="text-xl font-bold text-[#1d1d1f] tracking-tight">2. Information We Collect</h2>
          <p className="text-neutral-600">When you register, place an order, or use our school portal, we collect:</p>
          <ul className="list-disc pl-5 space-y-2 text-neutral-600">
            <li><strong className="text-[#1d1d1f]">Educational Institution Details:</strong> School name, DfE URN number, school address, town/city, and postcode.</li>
            <li><strong className="text-[#1d1d1f]">School Staff & Headteacher Contacts:</strong> Name, work email address, school telephone number, and job title (e.g. School Business Manager, Designated Allergy Lead, Headteacher).</li>
            <li><strong className="text-[#1d1d1f]">Requisition & Regulatory Documentation:</strong> Signed Headteacher Requisition forms, purchase order numbers, and BACS billing details.</li>
            <li><strong className="text-[#1d1d1f]">CPD Training Records:</strong> Names and test scores of school staff completing our accredited online anaphylaxis awareness modules.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 border-t border-black/[0.06] pt-8">
          <h2 className="text-xl font-bold text-[#1d1d1f] tracking-tight">3. How We Use Your Data & Legal Basis</h2>
          <p className="text-neutral-600">We process school data under the following lawful bases:</p>
          <ul className="list-disc pl-5 space-y-2 text-neutral-600">
            <li><strong className="text-[#1d1d1f]">Legal Obligation:</strong> Under the Human Medicines Regulations 2017 and GPhC requirements, pharmacies must record the supply of Prescription-Only Medicines and retain prescription/requisition registers.</li>
            <li><strong className="text-[#1d1d1f]">Performance of a Contract:</strong> To process orders, generate BACS invoices, verify payment, and dispatch auto-injectors via courier.</li>
            <li><strong className="text-[#1d1d1f]">Legitimate Interests:</strong> To dispatch automated stock expiration notices (at 12, 6, 3, and 1 month intervals) ensuring school auto-injectors remain compliant with Benedict&apos;s Law standards.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 border-t border-black/[0.06] pt-8">
          <h2 className="text-xl font-bold text-[#1d1d1f] tracking-tight">4. Data Security & Storage</h2>
          <p className="text-neutral-600 leading-relaxed">
            All data is stored in modern, encrypted database infrastructure (PostgreSQL on Neon Serverless) utilizing encrypted connection pooling, TLS 1.3 SSL transport, and secure hashing (PBKDF2 with unique cryptographic salt) for all school portal passwords.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 border-t border-black/[0.06] pt-8 pb-4">
          <h2 className="text-xl font-bold text-[#1d1d1f] tracking-tight">5. Your Rights Under UK GDPR</h2>
          <p className="text-neutral-600 leading-relaxed">
            School staff and administrators have the right to request access to their personal data, request corrections, or object to promotional communications at any time by contacting our Data Protection Officer at <a href="mailto:privacy@adrenaline4schools.co.uk" className="text-[#09653d] underline font-semibold hover:opacity-80">privacy@adrenaline4schools.co.uk</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
