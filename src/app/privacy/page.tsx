import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileText, Database, UserCheck } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy & School Data Protection | Adrenaline4Schools',
  description: 'How Adrenaline4Schools protects and processes school staff, headteacher, and educational institution data in compliance with UK GDPR and DfE standards.',
};

export default function PrivacyPage() {
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
            <Lock className="w-6 h-6" />
          </div>
          <span className="text-teal-300 text-xs font-bold uppercase tracking-widest bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
            UK GDPR Compliant
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Privacy Policy & Data Protection
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Our commitment to safeguarding educational institution records, headteacher requisitions, and school staff data.
          </p>
          <p className="text-xs text-slate-400">Last updated: October 2026 · Adrenaline4Schools Ltd</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10 leading-relaxed text-slate-700 text-sm">
        {/* Core Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#f0faf7] border border-[#c6eee3] text-xs space-y-1">
            <p className="font-bold text-[#096556] flex items-center gap-1.5">
              <Database className="w-4 h-4" /> Secure Neon Cloud
            </p>
            <p className="text-slate-600">Enterprise PostgreSQL with TLS 1.3 encryption at rest and in transit.</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#f0faf7] border border-[#c6eee3] text-xs space-y-1">
            <p className="font-bold text-[#096556] flex items-center gap-1.5">
              <UserCheck className="w-4 h-4" /> Strictly B2B / Schools
            </p>
            <p className="text-slate-600">We do not store pupil medical names; only institutional emergency stock records.</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#f0faf7] border border-[#c6eee3] text-xs space-y-1">
            <p className="font-bold text-[#096556] flex items-center gap-1.5">
              <Eye className="w-4 h-4" /> No Third-Party Selling
            </p>
            <p className="text-slate-600">Data is used solely for clinical fulfilment, invoicing, and expiry notifications.</p>
          </div>
        </div>

        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0c2340]">1. Who We Are</h2>
          <p>
            Adrenaline4Schools Ltd is the Data Controller responsible for this platform. We operate in partnership with UK General Pharmaceutical Council (GPhC) registered dispensing pharmacies to supply emergency adrenaline auto-injectors to nurseries, primary schools, secondary schools, academies, multi-academy trusts (MATs), and independent educational establishments.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0c2340]">2. Information We Collect</h2>
          <p>When you register, place an order, or use our school portal, we collect:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li><strong>Educational Institution Details:</strong> School name, DfE URN number, school address, town/city, and postcode.</li>
            <li><strong>School Staff & Headteacher Contacts:</strong> Name, work email address, school telephone number, and job title (e.g. School Business Manager, Designated Allergy Lead, Headteacher).</li>
            <li><strong>Requisition & Regulatory Documentation:</strong> Signed Headteacher Requisition forms, purchase order numbers, and BACS billing details.</li>
            <li><strong>CPD Training Records:</strong> Names and test scores of school staff completing our accredited online anaphylaxis awareness modules.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0c2340]">3. How We Use Your Data & Legal Basis</h2>
          <p>We process school data under the following lawful bases:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li><strong>Legal Obligation:</strong> Under the Human Medicines Regulations 2017 and GPhC requirements, pharmacies must record the supply of Prescription-Only Medicines and retain prescription/requisition registers.</li>
            <li><strong>Performance of a Contract:</strong> To process orders, generate BACS invoices, verify payment, and dispatch auto-injectors via courier.</li>
            <li><strong>Legitimate Interests:</strong> To dispatch automated stock expiration notices (at 12, 6, 3, and 1 month intervals) ensuring school auto-injectors remain compliant with Benedict&apos;s Law standards.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0c2340]">4. Data Security & Storage</h2>
          <p>
            All data is stored in modern, encrypted database infrastructure (PostgreSQL on Neon Serverless) utilizing encrypted connection pooling, TLS 1.3 SSL transport, and secure hashing (PBKDF2 with unique cryptographic salt) for all school portal passwords.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0c2340]">5. Your Rights Under UK GDPR</h2>
          <p>
            School staff and administrators have the right to request access to their personal data, request corrections, or object to promotional communications at any time by contacting our Data Protection Officer at <a href="mailto:privacy@adrenaline4schools.co.uk" className="text-[#096556] underline font-semibold">privacy@adrenaline4schools.co.uk</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
