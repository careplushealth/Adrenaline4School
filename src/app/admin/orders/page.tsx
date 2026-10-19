'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  Download,
  CheckCircle,
  Truck,
  FileText,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  X,
  Package,
} from 'lucide-react';
import { Order, BatchRecord } from '@/lib/types';

function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams?.get('status') || 'all';

  const [orders, setOrders] = useState<Order[]>([]);
  const [batches, setBatches] = useState<BatchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Modal actions state
  const [isUpdating, setIsUpdating] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [editCourier, setEditCourier] = useState('');
  const [editTracking, setEditTracking] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [assignBatchId, setAssignBatchId] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch(`/api/orders?status=${statusFilter !== 'all' ? statusFilter : ''}&search=${encodeURIComponent(search)}`).then((r) => r.json()),
      fetch('/api/batches').then((r) => r.json()),
    ])
      .then(([ordersData, batchesData]) => {
        if (ordersData.orders) setOrders(ordersData.orders);
        if (batchesData.batches) setBatches(batchesData.batches);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, search]);

  const handleOpenOrder = (ord: Order) => {
    setSelectedOrder(ord);
    setEditStatus(ord.order_status);
    setEditCourier(ord.courier_name || 'DPD Medical Express');
    setEditTracking(ord.tracking_number || '');
    setEditNotes(ord.internal_notes || '');
    setAssignBatchId(batches[0]?.id || '');
    setUpdateMsg('');
  };

  const handleSaveUpdate = async (pharmacyApprove: boolean = false) => {
    if (!selectedOrder) return;
    setIsUpdating(true);
    setUpdateMsg('');

    try {
      const selectedBatch = batches.find((b) => b.id === assignBatchId);
      const batchAssignments =
        editStatus === 'dispatched' && selectedBatch
          ? [
              {
                productId: selectedBatch.product_id,
                batchRecordId: selectedBatch.id,
                batchNumber: selectedBatch.batch_number,
                expiryDate: selectedBatch.expiry_date,
                quantity: selectedOrder.items?.[0]?.quantity || 1,
              },
            ]
          : undefined;

      const payload: any = {
        orderStatus: editStatus,
        courierName: editCourier,
        trackingNumber: editTracking,
        internalNotes: editNotes,
        batchAssignments,
      };

      if (pharmacyApprove) {
        payload.pharmacyReviewStatus = 'approved';
        payload.orderStatus = 'approved_for_fulfilment';
      }

      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setUpdateMsg('Order updated successfully!');
        loadData();
        // Update local selectedOrder
        setSelectedOrder((prev) => (prev ? { ...prev, order_status: payload.orderStatus as any } : null));
      } else {
        setUpdateMsg(`Error: ${data.error}`);
      }
    } catch (e: any) {
      setUpdateMsg('Failed to update order');
    } finally {
      setIsUpdating(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Order Reference', 'Date', 'School', 'Contact', 'Email', 'Total (£)', 'Payment Method', 'Payment Status', 'Order Status'];
    const rows = orders.map((o) => [
      o.order_reference,
      o.created_at,
      `"${o.school_name || o.delivery_school_name}"`,
      `"${o.contact_name}"`,
      o.contact_email,
      o.total_amount.toFixed(2),
      o.payment_method,
      o.payment_status,
      o.order_status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `orders-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-navy-950">Orders Database & Requisitions</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review Headteacher Requisitions, approve GPhC pharmacy dispensing, allocate batches, and track deliveries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-navy-800 hover:bg-slate-50 shadow-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-brand-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search order ref, school, email, PO..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'awaiting_documentation', label: 'Awaiting Docs' },
            { id: 'awaiting_pharmacy_approval', label: 'Pharmacy Review' },
            { id: 'awaiting_payment', label: 'Awaiting BACS' },
            { id: 'approved_for_fulfilment', label: 'Ready to Ship' },
            { id: 'dispatched', label: 'Dispatched' },
            { id: 'delivered', label: 'Delivered' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setStatusFilter(pill.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                statusFilter === pill.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Order Ref</th>
                <th className="py-3.5 px-4">School & Contact</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Pharmacy / Docs</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">Loading orders database…</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">No orders found matching filter.</td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-navy-950">
                      {ord.order_reference}
                      <span className="block text-[10px] text-slate-400 font-sans font-normal">
                        {ord.created_at?.split(' ')[0]}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-navy-900">{ord.school_name || ord.delivery_school_name}</p>
                      <p className="text-[11px] text-slate-500">{ord.contact_name} ({ord.contact_email})</p>
                    </td>
                    <td className="py-3.5 px-4">
                      {ord.items && ord.items.length > 0 ? (
                        ord.items.map((it: any) => (
                          <div key={it.id} className="text-[11px] text-slate-700">
                            {it.quantity}× {it.product_name}
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-400">Auto-injectors</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-black text-navy-950 block">£{ord.total_amount?.toFixed(2)}</span>
                      <span className="text-[10px] text-slate-400">inc VAT</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        ord.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-purple-50 text-purple-700'
                      }`}>
                        {ord.payment_method === 'bacs_invoice' ? 'BACS' : 'CARD'}: {ord.payment_status}
                      </span>
                      {ord.po_number && <p className="text-[10px] text-slate-400 mt-0.5 font-mono">PO: {ord.po_number}</p>}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          ord.pharmacy_review_status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          GPhC: {ord.pharmacy_review_status}
                        </span>
                        {ord.requisition_doc_name && (
                          <span className="text-[10px] text-slate-500 block truncate max-w-[120px]">
                            📄 {ord.requisition_doc_name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                        ord.order_status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                        ord.order_status === 'dispatched' ? 'bg-sky-100 text-sky-800' :
                        ord.order_status === 'approved_for_fulfilment' ? 'bg-teal-100 text-teal-800' :
                        ord.order_status === 'awaiting_payment' ? 'bg-purple-100 text-purple-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.order_status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenOrder(ord)}
                        className="px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs inline-flex items-center gap-1 shadow-sm"
                      >
                        <span>Manage</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Management Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-navy-900 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-4 mb-6">
              <span className="text-[11px] font-bold text-brand-700 uppercase tracking-wider">Order Management</span>
              <h2 className="text-2xl font-black text-navy-950">{selectedOrder.order_reference}</h2>
              <p className="text-xs text-slate-500 mt-1">Placed on {selectedOrder.created_at} · {selectedOrder.school_name || selectedOrder.delivery_school_name}</p>
            </div>

            {/* Quick Actions Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Pharmacy Approval Card */}
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-5 h-5 text-sky-700" />
                  <h4 className="font-bold text-xs text-sky-950 uppercase tracking-wider">GPhC Pharmacy Verification</h4>
                </div>
                <p className="text-xs text-sky-800 mb-3">
                  Requisition Status: <strong>{selectedOrder.documentation_status}</strong> · Pharmacy Review: <strong>{selectedOrder.pharmacy_review_status}</strong>
                </p>
                {selectedOrder.pharmacy_review_status !== 'approved' ? (
                  <button
                    onClick={() => handleSaveUpdate(true)}
                    disabled={isUpdating}
                    className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Headteacher Requisition
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-3 py-1.5 rounded-lg">
                    <CheckCircle className="w-4 h-4" /> Requisition Verified by Pharmacist
                  </span>
                )}
              </div>

              {/* BACS Invoice Card */}
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-purple-700" />
                  <h4 className="font-bold text-xs text-purple-950 uppercase tracking-wider">Invoice & Payment</h4>
                </div>
                <p className="text-xs text-purple-800 mb-3">
                  Method: <strong>{selectedOrder.payment_method.toUpperCase()}</strong> · Status: <strong>{selectedOrder.payment_status}</strong>
                </p>
                <a
                  href={`/api/invoices/${selectedOrder.id}/pdf`}
                  target="_blank"
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 text-center"
                >
                  <Download className="w-4 h-4" />
                  Download Official BACS Invoice PDF
                </a>
              </div>
            </div>

            {/* Workflow Status Controls */}
            <div className="space-y-4 mb-6">
              <h3 className="font-bold text-sm text-navy-900">Update Order Workflow</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-800 mb-1">Order Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-brand-500 bg-white"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="awaiting_documentation">Awaiting Documentation</option>
                    <option value="awaiting_pharmacy_approval">Awaiting Pharmacy Approval</option>
                    <option value="awaiting_payment">Awaiting Payment (BACS)</option>
                    <option value="approved_for_fulfilment">Approved for Fulfilment</option>
                    <option value="processing">Processing & Packing</option>
                    <option value="dispatched">Dispatched (Allocate Stock)</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-800 mb-1">Batch Allocation (for dispatch)</label>
                  <select
                    value={assignBatchId}
                    onChange={(e) => setAssignBatchId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-brand-500 bg-white"
                  >
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.batch_number} ({b.product_name} - Exp: {b.expiry_date})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-800 mb-1">Courier Service</label>
                  <input
                    value={editCourier}
                    onChange={(e) => setEditCourier(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-800 mb-1">Tracking Number</label>
                  <input
                    value={editTracking}
                    placeholder="e.g. DPD-UK-98210398"
                    onChange={(e) => setEditTracking(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-800 mb-1">Internal Notes</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {updateMsg && (
              <div className={`p-3 rounded-xl text-xs font-bold mb-4 ${updateMsg.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800'}`}>
                {updateMsg}
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => handleSaveUpdate(false)}
                disabled={isUpdating}
                className="flex-1 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all"
              >
                {isUpdating ? 'Saving Changes…' : 'Save Workflow & Batch Updates'}
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="py-3 px-6 rounded-xl border border-slate-200 text-navy-800 font-bold text-xs hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-400">Loading orders...</div>}>
      <AdminOrdersContent />
    </Suspense>
  );
}
