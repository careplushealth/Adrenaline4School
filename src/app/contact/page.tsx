'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MessageSquare, CheckCircle, AlertCircle, Headphones } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    schoolName: '',
    category: 'General Enquiry',
    orderReference: '',
    message: '',
    consent: false,
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const setField = (field: string, value: string | boolean) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) { setErrorMsg('Please accept the privacy notice to continue.'); return; }
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) setStatus('success');
      else { setStatus('error'); setErrorMsg(data.error || 'Failed to send message.'); }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center px-4 font-sans text-forest-900">
        <div className="text-center max-w-md bg-white/90 p-8 rounded-3xl border border-stone-200 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-5 border border-sage-200">
            <CheckCircle className="w-8 h-8 text-sage-700" />
          </div>
          <h2 className="text-2xl font-serif font-normal text-forest-950 mb-2">Message Sent</h2>
          <p className="text-stone-600 text-sm leading-relaxed mb-6">
            Thank you, {form.name}. Our dedicated UK school allergy support team will review your message and respond within 1 business day.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-forest-900 text-ivory text-xs font-medium hover:bg-forest-800 transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] font-sans">
      {/* Header — Apple Support Dark Editorial Banner */}
      <section className="bg-[#062e1c] text-slate-200 py-16 sm:py-20 px-4 border-b border-white/[0.08] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.08] border border-white/[0.12] flex items-center justify-center mx-auto mb-5 text-emerald-300 shadow-2xs">
            <Headphones className="w-7 h-7" />
          </div>
          <span className="text-emerald-300 text-[11px] font-semibold uppercase tracking-wider bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20">
            UK School Support Team
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-3 tracking-[-0.03em]">
            Contact Our School Support Team
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-sans">
            We&apos;re here to assist School Business Managers, Headteachers, and school office staff with pen selection, requisitions, 30-day BACS invoicing, and allergy compliance.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards — Apple Squircles */}
          <div className="space-y-4">
            <div className="bg-[#f5f5f7] rounded-[24px] border border-black/[0.06] shadow-2xs p-6">
              <div className="w-10 h-10 rounded-xl bg-white text-[#09653d] border border-black/[0.06] flex items-center justify-center mb-3 shadow-2xs">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-[#1d1d1f] text-sm mb-1 tracking-tight">Call Us Directly</h3>
              <a href="tel:01619733552" className="text-[#1d1d1f] font-bold text-lg hover:text-[#09653d] transition-colors tracking-tight">
                0161 973 3552
              </a>
              <p className="text-xs text-slate-500 mt-1 font-sans">Mon–Fri, 8:30am–5:00pm</p>
            </div>

            <div className="bg-[#f5f5f7] rounded-[24px] border border-black/[0.06] shadow-2xs p-6">
              <div className="w-10 h-10 rounded-xl bg-white text-[#09653d] border border-black/[0.06] flex items-center justify-center mb-3 shadow-2xs">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-[#1d1d1f] text-sm mb-1 tracking-tight">Email Support</h3>
              <a href="mailto:support@adrenaline4schools.co.uk" className="text-xs font-semibold text-[#09653d] hover:text-[#064e2e] transition-colors">
                support@adrenaline4schools.co.uk
              </a>
              <p className="text-xs text-slate-500 mt-1 font-sans">Reply within 1 business day</p>
            </div>

            <div className="bg-[#f5f5f7] rounded-[24px] border border-black/[0.06] shadow-2xs p-6">
              <div className="w-10 h-10 rounded-xl bg-white text-[#09653d] border border-black/[0.06] flex items-center justify-center mb-3 shadow-2xs">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-[#1d1d1f] text-sm mb-1 tracking-tight">Pharmacy Enquiries</h3>
              <a href="mailto:pharmacy@adrenaline4schools.co.uk" className="text-xs font-semibold text-[#09653d] hover:text-[#064e2e] transition-colors">
                pharmacy@adrenaline4schools.co.uk
              </a>
              <p className="text-xs text-slate-500 mt-1 font-sans">For requisition & dispensing checks</p>
            </div>
          </div>

          {/* Contact Form — Apple Card */}
          <div className="lg:col-span-2">
            <div className="bg-[#f5f5f7] rounded-[32px] border border-black/[0.06] shadow-2xs p-7 sm:p-9">
              <h2 className="font-bold text-xl sm:text-2xl text-[#1d1d1f] mb-2 tracking-tight">Send an Enquiry</h2>
              <p className="text-xs sm:text-sm text-slate-600 mb-6 font-sans">Complete the form below and our team will get back to you promptly.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5 font-sans">Your Name <span className="text-red-500">*</span></label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setField('name', e.target.value)}
                      placeholder="Rachel Stevens"
                      className="w-full px-4 py-2.5 rounded-xl border border-black/[0.08] bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#09653d]/20 focus:border-[#09653d] transition-all font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5 font-sans">Work Email <span className="text-red-500">*</span></label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setField('email', e.target.value)}
                      placeholder="you@school.co.uk"
                      className="w-full px-4 py-2.5 rounded-xl border border-black/[0.08] bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#09653d]/20 focus:border-[#09653d] transition-all font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5 font-sans">School Name</label>
                    <input
                      value={form.schoolName}
                      onChange={(e) => setField('schoolName', e.target.value)}
                      placeholder="St. Mary's CE Primary"
                      className="w-full px-4 py-2.5 rounded-xl border border-black/[0.08] bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#09653d]/20 focus:border-[#09653d] transition-all font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5 font-sans">Enquiry Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setField('category', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-black/[0.08] bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#09653d]/20 focus:border-[#09653d] transition-all cursor-pointer font-sans"
                    >
                      <option>General Enquiry</option>
                      <option>Order Query</option>
                      <option>BACS Invoice / Payment</option>
                      <option>Headteacher Requisition</option>
                      <option>Expiry Reminder</option>
                      <option>Pharmacy / Dispensing</option>
                      <option>Training</option>
                      <option>Technical Issue</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5 font-sans">Order Reference (if applicable)</label>
                  <input
                    value={form.orderReference}
                    onChange={(e) => setField('orderReference', e.target.value)}
                    placeholder="e.g. A4S-2026-00101"
                    className="w-full px-4 py-2.5 rounded-xl border border-black/[0.08] bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#09653d]/20 focus:border-[#09653d] transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5 font-sans">Message <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => setField('message', e.target.value)}
                    rows={4}
                    placeholder="How can we assist your school?"
                    className="w-full px-4 py-2.5 rounded-xl border border-black/[0.08] bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#09653d]/20 focus:border-[#09653d] transition-all resize-none font-sans"
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => setField('consent', e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#09653d] focus:ring-[#09653d]"
                  />
                  <span className="text-xs text-slate-600 leading-relaxed font-sans">
                    I consent to Adrenaline4Schools storing my details to handle this enquiry in accordance with their Privacy Policy.
                  </span>
                </label>

                {errorMsg && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700 font-sans">{errorMsg}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full py-3.5 rounded-full bg-[#09653d] hover:bg-[#064e2e] disabled:opacity-50 text-white font-semibold text-xs tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all apple-btn"
                >
                  {status === 'sending' ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending…</>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
