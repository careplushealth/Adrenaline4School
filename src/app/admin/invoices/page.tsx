'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  CheckCircle,
  Download,
  Send,
  AlertCircle,
  DollarSign,
  Clock,
  Building2,
  X,
  CreditCard,
} from 'lucide-react';
import { Invoice } from '@/lib/types';

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Record payment modal
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const loadInvoices = () => {
    setLoading(true);
    fetch(`/api/invoices?status=${statusFilter !== 'all' ? statusFilter : ''}&search=${encodeURIComponent(search)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.invoices) setInvoices(data.invoices);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadInvoices();
  }, [statusFilter, search]);

  const openPaymentModal = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setPaymentAmount((inv.total_amount - (inv.amount_paid || 0)).toFixed(2));
    setPaymentRef(`BACS-${Date.now().toString().slice(-6)}`);
    setPaymentNotes('Verified bank transfer credit in Barclays corporate account.');
    setMsg('');
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/invoices', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: selectedInvoice.id,
          action: 'record_payment',
          amount: parseFloat(paymentAmount),
          paymentMethod: 'bacs_transfer',
          reference: paymentRef,
          notes: paymentNotes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMsg('Payment recorded and verified successfully!');
        loadInvoices();
        setTimeout(() => setSelectedInvoice(null), 1200);
      } else {
        setMsg(`Error: ${data.error}`);
      }
    } catch {
      setMsg('Failed to record payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendReminder = async (invoiceId: string) => {
    const res = await fetch('/api/invoices', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        invoiceId,
        action: 'send_reminder',
      }),
    });
    const data = await res.json();
    if (data.success) {
      alert('Payment reminder email dispatched to school accounts.');
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-navy-950">Invoices & BACS Payment Verification</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage 30-day educational credit invoices, generate compliant PDFs, and record verified bank transfers.
          </p>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice #, school, PO, ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {[
            { id: 'all', label: 'All Invoices' },
            { id: 'issued', label: 'Awaiting BACS Payment' },
            { id: 'paid', label: 'Paid & Reconciled' },
            { id: 'overdue', label: 'Overdue' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setStatusFilter(pill.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                statusFilter === pill.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">School & Trust</th>
                <th className="py-3.5 px-4">Order Ref</th>
                <th className="py-3.5 px-4">Issue Date</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Paid</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">Loading invoices…</td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">No invoices found matching criteria.</td>
                </tr>
              ) : (
                invoices.map((inv) => {
                  const isPaid = inv.status === 'paid';
                  const isOverdue = inv.status === 'issued' && new Date(inv.due_date) < new Date();
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-navy-950">
                        {inv.invoice_number}
                        {inv.po_number && <span className="block text-[10px] text-slate-400 font-sans font-normal">PO: {inv.po_number}</span>}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-navy-900">{inv.school_name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">BACS Ref: {inv.bacs_reference}</p>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-700">
                        {inv.order_reference}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{inv.issue_date}</td>
                      <td className="py-3.5 px-4">
                        <span className={`font-semibold ${isOverdue ? 'text-red-600 font-bold' : 'text-slate-700'}`}>
                          {inv.due_date}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-black text-navy-950">£{inv.total_amount?.toFixed(2)}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-700">£{(inv.amount_paid || 0).toFixed(2)}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          isPaid ? 'bg-emerald-50 text-emerald-700' :
                          isOverdue ? 'bg-red-50 text-red-700' : 'bg-purple-50 text-purple-700'
                        }`}>
                          {isPaid ? 'PAID' : isOverdue ? 'OVERDUE' : 'ISSUED (30D)'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <a
                          href={`/api/invoices/${inv.id}/pdf`}
                          target="_blank"
                          title="Download PDF"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy-800 inline-block transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>

                        {!isPaid && (
                          <>
                            <button
                              onClick={() => handleSendReminder(inv.id)}
                              title="Send Reminder Email"
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 inline-block transition-colors"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openPaymentModal(inv)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1 shadow-sm"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Verify Transfer</span>
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Verification Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-navy-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy-950">Record Verified Bank Transfer</h3>
                <p className="text-xs text-slate-500">Invoice: {selectedInvoice.invoice_number}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 mb-4 text-xs space-y-1">
              <p><strong>School:</strong> {selectedInvoice.school_name}</p>
              <p><strong>Total Due:</strong> £{selectedInvoice.total_amount.toFixed(2)}</p>
              <p><strong>BACS Reference:</strong> {selectedInvoice.bacs_reference}</p>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy-800 mb-1">Amount Received (£)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-800 mb-1">Bank Transaction Reference</label>
                <input
                  required
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-800 mb-1">Verification Notes</label>
                <input
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {msg && (
                <div className={`p-3 rounded-xl text-xs font-bold ${msg.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800'}`}>
                  {msg}
                </div>
              )}

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                >
                  {isSubmitting ? 'Verifying…' : 'Confirm Bank Payment & Mark Paid'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="py-3 px-5 rounded-xl border border-slate-200 text-navy-800 font-bold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
