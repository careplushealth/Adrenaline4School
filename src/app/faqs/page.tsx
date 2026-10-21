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
            a: 'Yes. Under the UK Human Medicines (Amendment) Regulations 2017, schools are permitted to purchase and hold spare emergency adrenaline auto-injectors (AAIs) for use on pupils at risk of anaphylaxis. An order must be signed by the Headteacher or Principal via our 1-click Requisition Form.',
          },
          {
            q: 'What strength of auto-injector does our school need?',
            a: 'Children weighing 15–30kg (typically primary school pupils from Reception to Year 6) require 150 micrograms (e.g. EpiPen Jr or Jext 150). Pupils and staff weighing over 30kg (typically secondary school pupils from Year 7 upwards and adults) require 300 micrograms (e.g. EpiPen 300 or Jext 300).',
          },
          {
            q: 'How does the 30-day BACS school invoice payment work?',
            a: 'At checkout, select BACS Invoice. Enter your school Purchase Order (PO) number if required by your finance department. We generate an official PDF invoice with full VAT breakdown and bank remittance details. Your school has 30 days to settle the invoice via electronic bank transfer.',
          },
          {
            q: 'How does the automated expiry tracking work?',
            a: 'When our GPhC registered pharmacy dispatches your pens, we record the exact batch numbers and manufacturer expiry dates in your School Portal. Our system automatically sends alert emails to the school business manager at 12 months, 6 months, 3 months, and 1 month before expiry, with a 1-click reorder link.',
          },
          {
            q: 'Is CPD accredited staff training included?',
            a: 'Yes. All school customers receive complimentary, unlimited access to our online video modules covering anaphylaxis recognition, emergency action plans, and auto-injector administration, with verifiable CPD certificates for staff.',
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
          <div className="w-14 h-14 rounded-2xl bg-[#096556]/20 border border-[#096556]/40 flex items-center justify-center mx-auto mb-5 text-emerald-300">
            <HelpCircle className="w-7 h-7" />
          </div>
          <span className="text-emerald-300 text-xs font-semibold uppercase tracking-widest bg-emerald-400/10 px-3.5 py-1 rounded-full border border-emerald-400/20">
            School Support Knowledgebase
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-normal text-ivory mt-4 mb-3 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-stone-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions about ordering, Headteacher requisitions, 30-day BACS invoices, and statutory allergy safety compliance.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search FAQs by topic, brand, dosage, or regulations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-full border border-stone-200/90 bg-white/90 shadow-xs text-xs font-sans text-forest-950 focus:outline-none focus:ring-1 focus:ring-sage-500 focus:border-sage-500"
          />
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {filtered.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white/90 rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden transition-all hover:border-sage-400"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-start justify-between gap-4 p-5 text-left hover:bg-linen/20 transition-colors"
              >
                <span className="font-serif font-medium text-sm text-forest-950 leading-relaxed">{faq.q}</span>
                {openIdx === idx ? (
                  <ChevronUp className="w-4 h-4 text-sage-700 shrink-0 mt-0.5" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                )}
              </button>
              {openIdx === idx && (
                <div className="px-5 pb-5 border-t border-stone-100">
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pt-3 font-sans">{faq.a}</p>
                </div>
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-stone-400 bg-white/60 rounded-2xl border border-stone-200">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40 text-stone-400" />
              <p className="text-xs font-medium">No FAQs match your search query.</p>
            </div>
          )}
        </div>

        {/* Still have questions */}
        <div className="mt-12 bg-linen/40 border border-stone-200/80 rounded-3xl p-8 text-center shadow-xs space-y-3">
          <h3 className="font-serif font-medium text-forest-950 text-lg">Still have questions?</h3>
          <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
            Our UK school allergy support team is available on weekdays to guide you through pen requirements, statutory guidelines, or MAT purchasing.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-forest-900 hover:bg-forest-800 text-ivory font-medium text-xs tracking-wide shadow-xs transition-all"
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
