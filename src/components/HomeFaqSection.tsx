'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, ArrowRight, ShieldCheck, Truck, BellRing } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const HOME_FAQS: FaqItem[] = [
  {
    question: 'Can schools legally hold spare adrenaline auto-injectors without a prescription?',
    answer:
      'Yes. Schools in the United Kingdom are legally permitted to purchase and hold spare emergency adrenaline auto-injectors (AAIs) for use on pupils at risk of anaphylaxis. Supply requires an official order signed by the Headteacher or Principal, which can be uploaded at checkout or generated via our 1-click requisition tool.',
  },
  {
    question: 'What strength of auto-injector does our school need for pupils?',
    answer:
      'Dosage is calibrated by pupil weight. Primary school pupils weighing 15–30kg (approx. Reception to Year 6) require 150 micrograms (e.g. EpiPen® Junior or Jext® 150). Secondary school pupils weighing over 30kg (approx. Year 7 upwards) require 300 micrograms (e.g. EpiPen® 300 or Jext® 300). Both strengths are priced at £60.69 ex VAT per pen.',
  },
  {
    question: 'How quickly are emergency adrenaline pens delivered to our school?',
    answer:
      'All orders are verified by our UK GPhC registered superintendent pharmacist and delivered in 3 to 4 working days via tracked, temperature-controlled medical courier directly to your school address.',
  },
  {
    question: 'How does the 30-day BACS school invoice payment work?',
    answer:
      'At checkout, schools can select "30-Day BACS School Invoice" without needing a corporate credit card. Enter your School Purchase Order (PO) number if required by your finance office. We dispatch your pens immediately upon pharmacy verification and issue an official 30-day VAT invoice with bank remittance details.',
  },
  {
    question: 'How does your automated expiry reminder service work?',
    answer:
      'Every adrenaline pen supplied is registered in our clinical tracking database with its unique batch number and manufacturer expiry date. We automatically send proactive reminder alerts to your school business manager and designated allergy leads at 12, 6, 3, and 1 month before expiry, with a 1-click reorder link so your school is never left with lapsed stock.',
  },
  {
    question: 'How many spare pens should our school hold under Benedict’s Law?',
    answer:
      'Department for Education statutory guidance and Benedict’s Law standards advise holding spare adrenaline auto-injectors in pairs (minimum 2 pens of appropriate dose per location), accessible within 3 to 5 minutes from any classroom, dining hall, or sports ground. You can use our interactive Benedict’s Law Spare Pen Calculator on this page to determine your school’s exact recommended allocation.',
  },
];

export default function HomeFaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-16 md:py-24 bg-white border-t border-black/[0.06]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#09653d]/[0.08] text-[#09653d] text-[11px] font-semibold tracking-wide uppercase border border-[#09653d]/15">
            <HelpCircle className="w-3.5 h-3.5 text-[#09653d]" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] tracking-[-0.03em]">
            Everything you need to know about school emergency pens
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
            Common questions regarding Headteacher Requisitions, 30-day BACS invoicing, Benedict&apos;s Law, and pharmacy delivery.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {HOME_FAQS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-[24px] border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-[#f5f5f7] border-[#09653d]/30 shadow-xs'
                    : 'bg-[#fafafc] border-black/[0.06] hover:bg-[#f5f5f7] hover:border-black/[0.1]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-sans transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-[15px] sm:text-base font-bold text-[#1d1d1f] tracking-tight">
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? 'rotate-180 bg-[#09653d] text-white border-[#09653d]'
                        : 'bg-white text-slate-600 border-black/[0.08]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-[14px] text-slate-600 leading-relaxed font-sans border-t border-black/[0.04]">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Link to Full FAQs page */}
        <div className="text-center mt-12 space-y-3">
          <p className="text-xs text-slate-500 font-sans">
            Need further guidance on pharmacy dispensing, multi-academy trust accounts, or emergency protocols?
          </p>
          <Link
            href="/faqs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] font-semibold text-xs sm:text-sm border border-black/[0.08] transition-all shadow-2xs apple-btn"
          >
            <span>View All FAQs & Compliance Guides</span>
            <ArrowRight className="w-4 h-4 text-[#09653d]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
