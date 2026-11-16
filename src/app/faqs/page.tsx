'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, ChevronUp, HelpCircle, ArrowRight } from 'lucide-react';

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<Array<{ q: string; a: string }>>([]);
  const [search, setSearch] = useState('');
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  useEffect(() => {
    fetch('/api/content?key=faq-general')
      .then((r) => r.json())
      .then((data) => {
        if (data.item?.content_json) {
          setFaqs(JSON.parse(data.item.content_json));
        }
      })
      .catch(() => {
        // Fallback FAQs if api content is delayed
        setFaqs([
          {
            q: 'Can schools legally hold spare adrenaline auto-injectors without a prescription?',
            a: 'Yes. Schools in the UK are legally permitted to purchase and hold spare emergency adrenaline auto-injectors (AAIs) for use on pupils at risk of anaphylaxis. An order must be signed by the Headteacher or Principal.',
          },
          {
            q: 'What strength of auto-injector does our school need?',
            a: 'Pupils weighing 15–30kg (typically primary school pupils from Reception to Year 6) require 150 micrograms (e.g. EpiPen Jr or Jext 150). Pupils weighing over 30kg (typically secondary school pupils from Year 7 upwards) require 300 micrograms (e.g. EpiPen 300 or Jext 300).',
          },
          {
            q: 'How much do emergency adrenaline pens cost?',
            a: 'All pens (both EpiPen® and Jext® in 150mcg and 300mcg strengths) are priced at £60.69 ex VAT per pen. Schools can pay via standard 30-day BACS credit invoice or payment card.',
          },
          {
            q: 'How quickly are emergency pens delivered to our school?',
            a: 'All emergency pens are delivered in 3 to 4 working days via tracked, temperature-controlled medical courier directly to your school premises upon pharmacy verification.',
          },
          {
            q: 'How does the 30-day BACS school invoice payment work?',
            a: 'At checkout, select BACS Invoice. Enter your school Purchase Order (PO) number if required by your finance department. We generate an official PDF invoice with full VAT breakdown and bank remittance details. Your school has 30 days to settle the invoice via electronic bank transfer.',
          },
          {
            q: 'How does the automated expiry tracking work?',
            a: 'When our GPhC registered pharmacy dispatches your pens, we record the exact batch numbers and manufacturer expiry dates in your School Portal. Our system automatically sends alert emails to the school business manager at 12 months, 6 months, 3 months, and 1 month before expiry, with a 1-click reorder link.',
          },
        ]);
      });
  }, []);

  const filtered = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

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
            <HelpCircle className="w-7 h-7" />
          </div>
          <span className="text-emerald-300 text-[11px] font-semibold uppercase tracking-wider bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20">
            School Support Knowledgebase
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-3 tracking-[-0.03em]">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-sans">
            Find answers to common questions about ordering, Headteacher requisitions, 30-day BACS invoices, and statutory allergy safety compliance.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        {/* Search Bar — Apple Pill Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search FAQs by topic, brand, dosage, or regulations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-full border border-black/[0.08] bg-[#f5f5f7] shadow-2xs text-xs font-sans text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#09653d]/20 focus:border-[#09653d] transition-all"
          />
        </div>

        {/* FAQ Accordion — Apple Squircle Items */}
        <div className="space-y-3">
          {filtered.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#f5f5f7] rounded-[22px] border border-black/[0.06] shadow-2xs overflow-hidden transition-all duration-200 hover:border-[#09653d]/30"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-start justify-between gap-4 p-5 text-left hover:bg-black/[0.02] transition-colors"
              >
                <span className="font-semibold text-[15px] text-[#1d1d1f] leading-relaxed tracking-tight">{faq.q}</span>
                {openIdx === idx ? (
                  <ChevronUp className="w-4 h-4 text-[#09653d] shrink-0 mt-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                )}
              </button>
              {openIdx === idx && (
                <div className="px-5 pb-5 border-t border-black/[0.05]">
                  <p className="text-xs sm:text-[14px] text-slate-600 leading-relaxed pt-3 font-sans">{faq.a}</p>
                </div>
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400 bg-[#f5f5f7] rounded-[22px] border border-black/[0.06]">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
              <p className="text-xs font-medium">No FAQs match your search query.</p>
            </div>
          )}
        </div>

        {/* Still have questions — Apple Callout */}
        <div className="mt-12 bg-[#f5f5f7] border border-black/[0.06] rounded-[28px] p-8 text-center shadow-2xs space-y-3">
          <h3 className="font-bold text-[#1d1d1f] text-lg tracking-tight">Still have questions?</h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed font-sans">
            Our UK school allergy support team is available on weekdays to guide you through pen requirements, statutory guidelines, or MAT purchasing.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#09653d] hover:bg-[#064e2e] text-white font-semibold text-xs tracking-tight shadow-sm transition-all apple-btn"
            >
              <span>Contact Support Team</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
