'use client';

import React, { useState } from 'react';
import { Settings, ShieldCheck, Landmark, BellRing, Save, CheckCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    pharmacyName: 'St. Jude Community Pharmacy Ltd (GPhC Network)',
    gphcNumber: '1092812',
    superintendent: 'Marcus Vance MRPharmS (GPhC #2081921)',
    bacsBank: 'Barclays Bank UK PLC',
    bacsAccountName: 'Adrenaline4Schools Limited',
    bacsSortCode: '20-00-00',
    bacsAccountNumber: '83920184',
    remindersEnabled: true,
    rem12m: true,
    rem6m: true,
    rem3m: true,
    rem1m: true,
    senderEmail: 'orders@adrenaline4schools.co.uk',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black text-navy-950">Pharmacy & Operational Configuration</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Regulated UK pharmacy dispensing registration, protected BACS bank transfer credentials, and reminder policies.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Pharmacy Details */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
            <h2 className="font-bold text-sm text-navy-900">GPhC Dispensing Pharmacy Credentials</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-navy-800 mb-1">Pharmacy Dispensing Partner</label>
              <input
                value={settings.pharmacyName}
                onChange={(e) => setSettings({ ...settings, pharmacyName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-navy-800 mb-1">GPhC Registered Premises #</label>
              <input
                value={settings.gphcNumber}
                onChange={(e) => setSettings({ ...settings, gphcNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy-800 mb-1">Superintendent Pharmacist</label>
              <input
                value={settings.superintendent}
                onChange={(e) => setSettings({ ...settings, superintendent: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* BACS Protected Bank Details */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Landmark className="w-5 h-5 text-purple-600" />
            <h2 className="font-bold text-sm text-navy-900">BACS Corporate Bank Details (Invoices Only)</h2>
          </div>
          <p className="text-xs text-slate-500">
            These bank credentials appear exclusively on generated PDF invoices and secure payment screens for schools.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-navy-800 mb-1">Bank Name</label>
              <input
                value={settings.bacsBank}
                onChange={(e) => setSettings({ ...settings, bacsBank: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-navy-800 mb-1">Account Beneficiary Name</label>
              <input
                value={settings.bacsAccountName}
                onChange={(e) => setSettings({ ...settings, bacsAccountName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-navy-800 mb-1">Sort Code</label>
              <input
                value={settings.bacsSortCode}
                onChange={(e) => setSettings({ ...settings, bacsSortCode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-navy-800 mb-1">Account Number</label>
              <input
                value={settings.bacsAccountNumber}
                onChange={(e) => setSettings({ ...settings, bacsAccountNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Expiry Reminder Intervals */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <BellRing className="w-5 h-5 text-amber-600" />
            <h2 className="font-bold text-sm text-navy-900">Automated Expiry Schedule Intervals</h2>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.rem12m}
                onChange={(e) => setSettings({ ...settings, rem12m: e.target.checked })}
                className="rounded text-brand-600"
              />
              <span className="text-xs font-semibold text-navy-900">12 Months Prior — Annual stock review reminder</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.rem6m}
                onChange={(e) => setSettings({ ...settings, rem6m: e.target.checked })}
                className="rounded text-brand-600"
              />
              <span className="text-xs font-semibold text-navy-900">6 Months Prior — Termly budget planning notice</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.rem3m}
                onChange={(e) => setSettings({ ...settings, rem3m: e.target.checked })}
                className="rounded text-brand-600"
              />
              <span className="text-xs font-semibold text-navy-900">3 Months Prior — Replacement order recommended</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.rem1m}
                onChange={(e) => setSettings({ ...settings, rem1m: e.target.checked })}
                className="rounded text-brand-600"
              />
              <span className="text-xs font-semibold text-red-600">1 Month Prior — Urgent expiring medication notification</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="py-3 px-8 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Configuration
          </button>
          {saved && (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> Settings saved successfully!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
