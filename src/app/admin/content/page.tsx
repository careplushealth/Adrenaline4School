'use client';

import React, { useState, useEffect } from 'react';
import { FileEdit, Save, CheckCircle, RefreshCw, HelpCircle, AlertCircle } from 'lucide-react';

export default function AdminContentPage() {
  const [faqsJson, setFaqsJson] = useState('');
  const [loading, setLoading] = useState(true);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    fetch('/api/content?key=faq-general')
      .then((r) => r.json())
      .then((data) => {
        if (data.item?.content_json) {
          try {
            const parsed = JSON.parse(data.item.content_json);
            setFaqsJson(JSON.stringify(parsed, null, 2));
          } catch {
            setFaqsJson(data.item.content_json);
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSaveFaqs = async () => {
    setSaveMsg('');
    try {
      JSON.parse(faqsJson); // Validate JSON
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'faq-general',
          title: 'Frequently Asked Questions',
          section: 'faqs',
          contentJson: faqsJson,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveMsg('FAQs updated and published live to website!');
      } else {
        setSaveMsg(`Error: ${data.error}`);
      }
    } catch {
      setSaveMsg('Error: Invalid JSON format. Please verify quotation marks and commas.');
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black text-navy-950">Content Management (CMS)</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Update public website FAQs, statutory legal notices, and compliance disclaimers without writing code.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-brand-600" />
            <h2 className="text-base font-bold text-navy-900">Manage Frequently Asked Questions (FAQ)</h2>
          </div>
          <button
            onClick={handleSaveFaqs}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Publish Live</span>
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Edit the structured Q&amp;A array below. Changes are reflected immediately on the public /faqs page.
        </p>

        <textarea
          rows={16}
          value={faqsJson}
          onChange={(e) => setFaqsJson(e.target.value)}
          className="w-full font-mono text-xs p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 bg-slate-50 leading-relaxed"
        />

        {saveMsg && (
          <div className={`p-3 rounded-xl text-xs font-bold ${saveMsg.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800'}`}>
            {saveMsg}
          </div>
        )}
      </div>
    </div>
  );
}
