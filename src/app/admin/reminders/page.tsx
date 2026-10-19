'use client';

import React, { useState, useEffect } from 'react';
import {
  BellRing,
  Send,
  Play,
  CheckCircle,
  Clock,
  AlertTriangle,
  Mail,
  RefreshCw,
  ExternalLink,
  Calendar,
  Eye,
  X,
} from 'lucide-react';

export default function AdminRemindersPage() {
  const [supplies, setSupplies] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [emailLogs, setEmailLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'scheduler' | 'logs'>('scheduler');
  const [sweepResult, setSweepResult] = useState<any>(null);
  const [isSweeping, setIsSweeping] = useState(false);
  const [previewEmail, setPreviewEmail] = useState<any>(null);

  const loadData = () => {
    setLoading(true);
    fetch('/api/reminders')
      .then((r) => r.json())
      .then((data) => {
        if (data.supplies) setSupplies(data.supplies);
        if (data.reminders) setReminders(data.reminders);
        if (data.emailLogs) setEmailLogs(data.emailLogs);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerSweep = async () => {
    setIsSweeping(true);
    setSweepResult(null);
    try {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'trigger_sweep' }),
      });
      const data = await res.json();
      setSweepResult(data);
      loadData();
    } catch {
      alert('Failed to run scheduler sweep');
    } finally {
      setIsSweeping(false);
    }
  };

  const sendManualNow = async (supplyId: string) => {
    if (!confirm('Dispatch an immediate expiry reminder email to the school headteacher?')) return;
    const res = await fetch('/api/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'send_manual', supplyId }),
    });
    const data = await res.json();
    alert(data.message);
    loadData();
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-navy-950">Automated Expiry Reminders & Cron</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Background cron engine, configurable 12m/6m/3m/1m intervals, pre-filled secure reorder links, and delivery logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={triggerSweep}
            disabled={isSweeping}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Play className={`w-4 h-4 ${isSweeping ? 'animate-spin' : ''}`} />
            <span>{isSweeping ? 'Sweeping Expiries…' : 'Run Scheduler Sweep Now'}</span>
          </button>
        </div>
      </div>

      {/* Sweep Result Banner */}
      {sweepResult && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-xs font-bold text-emerald-900">{sweepResult.message}</p>
          </div>
          <button onClick={() => setSweepResult(null)} className="text-xs text-slate-400 hover:text-slate-600">Dismiss</button>
        </div>
      )}

      {/* Interval Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Interval 1</span>
          <p className="text-lg font-black text-navy-900 mt-1">12 Months Prior</p>
          <span className="text-xs font-semibold text-emerald-700">Annual stock check</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Interval 2</span>
          <p className="text-lg font-black text-navy-900 mt-1">6 Months Prior</p>
          <span className="text-xs font-semibold text-sky-700">Termly budget planning</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Interval 3</span>
          <p className="text-lg font-black text-navy-900 mt-1">3 Months Prior</p>
          <span className="text-xs font-semibold text-amber-700">Reorder recommendation</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Interval 4</span>
          <p className="text-lg font-black text-navy-900 mt-1">1 Month Prior</p>
          <span className="text-xs font-semibold text-red-600">Urgent replacement alert</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('scheduler')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'scheduler'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-navy-900'
          }`}
        >
          Active Reminders Queue ({reminders.length})
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'logs'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-navy-900'
          }`}
        >
          Email Delivery Audit Logs ({emailLogs.length})
        </button>
      </div>

      {/* TAB 1: Scheduled Reminders */}
      {activeTab === 'scheduler' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">School</th>
                  <th className="py-3.5 px-4">Product & Batch</th>
                  <th className="py-3.5 px-4">Expiry Date</th>
                  <th className="py-3.5 px-4">Trigger Interval</th>
                  <th className="py-3.5 px-4">Scheduled Date</th>
                  <th className="py-3.5 px-4">Recipient</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reminders.map((r: any) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-navy-950">{r.school_name}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-navy-900">{r.product_name}</span>
                      <span className="block font-mono text-[10px] text-slate-400">Lot: {r.batch_number}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-red-600">{r.expiry_date}</td>
                    <td className="py-3.5 px-4 font-bold text-amber-700">{r.interval_months} Months Prior</td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{r.scheduled_date}</td>
                    <td className="py-3.5 px-4 text-slate-600">{r.recipient_email}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.status === 'sent' ? 'bg-emerald-50 text-emerald-700' :
                        r.status === 'failed' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {r.reorder_token && (
                        <a
                          href={`/reorder/${r.reorder_token}`}
                          target="_blank"
                          className="text-xs font-bold text-brand-600 hover:underline"
                        >
                          Prefill Reorder &nearr;
                        </a>
                      )}
                      <button
                        onClick={() => sendManualNow(r.supply_record_id)}
                        className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px]"
                      >
                        Send Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Email Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Recipient</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Template</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {emailLogs.map((log: any) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 text-slate-500">{log.sent_at}</td>
                  <td className="py-3.5 px-4 font-bold text-navy-900">{log.recipient_email}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">{log.subject}</td>
                  <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500">{log.template_type}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      DELIVERED
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setPreviewEmail(log)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy-800 font-bold text-[11px]"
                    >
                      <Eye className="w-3.5 h-3.5 inline mr-1" /> View HTML
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Email Preview Modal */}
      {previewEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
            <button
              onClick={() => setPreviewEmail(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-navy-900"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-navy-950 text-base">{previewEmail.subject}</h3>
              <p className="text-xs text-slate-500">To: {previewEmail.recipient_email} · Sent at: {previewEmail.sent_at}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 border border-slate-100 rounded-xl bg-slate-50/50">
              <div dangerouslySetInnerHTML={{ __html: previewEmail.body_html }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
