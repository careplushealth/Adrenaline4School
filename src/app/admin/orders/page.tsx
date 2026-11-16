'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
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
  Send,
  Mail,
  Building2,
  Phone,
  User,
  Calendar,
  CreditCard,
  Edit3,
  RefreshCw,
  FileDown,
  Check,
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

  // Selected Order Modal
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Invoice Modal
  const [invoiceOrder, setInvoiceOrder] = useState<any | null>(null);
  const [invoiceEmail, setInvoiceEmail] = useState('');
  const [invoicePoNumber, setInvoicePoNumber] = useState('');
  const [invoiceDueDate, setInvoiceDueDate] = useState('');
  const [invoiceSortCode, setInvoiceSortCode] = useState('20-45-45');
  const [invoiceAccountNumber, setInvoiceAccountNumber] = useState('83920184');
  const [invoiceRef, setInvoiceRef] = useState('');
  const [invoiceNotes, setInvoiceNotes] = useState('');
  const [isSendingInvoice, setIsSendingInvoice] = useState(false);
  const [invoiceResultMsg, setInvoiceResultMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  const handleOpenOrder = (ord: any) => {
    setSelectedOrder(ord);
    setEditStatus(ord.order_status);
    setEditCourier(ord.courier_name || 'DPD Medical Express');
    setEditTracking(ord.tracking_number || '');
    setEditNotes(ord.internal_notes || '');
    setAssignBatchId(batches[0]?.id || '');
    setUpdateMsg('');
  };

  const handleOpenInvoiceModal = (ord: any) => {
    setInvoiceOrder(ord);
    setInvoiceEmail(ord.contact_email || ord.headteacher_email || '');
    setInvoicePoNumber(ord.po_number || '');
    
    // Default due date to 30 days ahead
    const due = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setInvoiceDueDate(ord.invoice_due_date || due);
    
    setInvoiceSortCode('20-45-45');
    setInvoiceAccountNumber('83920184');
    setInvoiceRef(ord.invoice_number || ord.order_reference || `INV-${ord.id}`);
    setInvoiceNotes(
      'Payment terms: strictly 30 days from invoice date. Please quote payment reference on all BACS bank remittances.'
    );
    setInvoiceResultMsg(null);
  };

  const handleSendInvoiceEmail = async () => {
    if (!invoiceOrder) return;
    if (!invoiceEmail) {
      setInvoiceResultMsg({ type: 'error', text: 'Please enter a valid recipient email address.' });
      return;
    }

    setIsSendingInvoice(true);
    setInvoiceResultMsg(null);

    try {
      const res = await fetch('/api/invoices/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: invoiceOrder.id,
          recipientEmail: invoiceEmail,
          poNumber: invoicePoNumber,
          dueDate: invoiceDueDate,
          bacsSortCode: invoiceSortCode,
          bacsAccountNumber: invoiceAccountNumber,
          bacsReference: invoiceRef,
          notes: invoiceNotes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setInvoiceResultMsg({
          type: 'success',
          text: `Invoice ${data.invoiceNumber || ''} sent to ${invoiceEmail} via Adrenaline4schools@gmail.com!`,
        });
        loadData();
      } else {
        setInvoiceResultMsg({
          type: 'error',
          text: data.error || 'Failed to dispatch invoice via Gmail.',
        });
      }
    } catch {
      setInvoiceResultMsg({
        type: 'error',
        text: 'Connection error while communicating with Gmail dispatch service.',
      });
    } finally {
      setIsSendingInvoice(false);
    }
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
        setSelectedOrder((prev: any) =>
          prev
            ? {
                ...prev,
                order_status: payload.orderStatus,
                pharmacy_review_status: pharmacyApprove ? 'approved' : prev.pharmacy_review_status,
              }
            : null
        );
      } else {
        setUpdateMsg(`Error: ${data.error}`);
      }
    } catch {
      setUpdateMsg('Failed to update order');
    } finally {
      setIsUpdating(false);
    }
  };

  const exportCSV = () => {
    const headers = [
      'Order Reference',
      'Date',
      'School',
      'Contact',
      'Email',
      'Total (£)',
      'Payment Method',
      'Payment Status',
      'Order Status',
    ];
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

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
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
            Review Headteacher Requisitions, approve GPhC pharmacy dispensing, allocate batches, and issue invoices via Gmail.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-navy-800 hover:bg-slate-50 shadow-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-[#09653d]" />
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
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#09653d]"
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
                  ? 'bg-[#09653d] text-white shadow-sm'
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
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Loading orders database…
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No orders found matching filter.
                  </td>
                </tr>
              ) : (
                orders.map((ord: any) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-navy-950">
                      {ord.order_reference}
                      <span className="block text-[10px] text-slate-400 font-sans font-normal">
                        {ord.created_at?.split(' ')[0]}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-navy-900">{ord.school_name || ord.delivery_school_name}</p>
                      <p className="text-[11px] text-slate-500">
                        {ord.contact_name} ({ord.contact_email})
                      </p>
                      {ord.school_urn && (
                        <span className="text-[10px] text-slate-400 font-mono">URN: {ord.school_urn}</span>
                      )}
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
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          ord.payment_status === 'paid'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-purple-50 text-purple-700'
                        }`}
                      >
                        {ord.payment_method === 'bacs_invoice' ? 'BACS' : 'CARD'}: {ord.payment_status}
                      </span>
                      {ord.po_number && (
                        <p className="text-[10px] text-slate-400 mt-0.5 font-mono">PO: {ord.po_number}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            ord.pharmacy_review_status === 'approved'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          GPhC: {ord.pharmacy_review_status}
                        </span>
                        <a
                          href={`/api/orders/${ord.id}/requisition/pdf`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-[#09653d] hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Requisition PDF</span>
                        </a>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                          ord.order_status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.order_status === 'dispatched'
                            ? 'bg-sky-100 text-sky-800'
                            : ord.order_status === 'approved_for_fulfilment'
                            ? 'bg-teal-100 text-teal-800'
                            : ord.order_status === 'awaiting_payment'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.order_status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenInvoiceModal(ord)}
                          className="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs inline-flex items-center gap-1 border border-purple-200 shadow-2xs transition-colors"
                          title="Generate, edit, or dispatch invoice"
                        >
                          <FileText className="w-3.5 h-3.5 text-purple-600" />
                          <span>Invoice</span>
                        </button>
                        <button
                          onClick={() => handleOpenOrder(ord)}
                          className="px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs inline-flex items-center gap-1 shadow-sm transition-colors"
                        >
                          <span>Manage</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL ORDER DETAIL & MANAGEMENT MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[92vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-slate-100 pb-4">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold text-[#09653d] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
                  Order Management & Inspection
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {selectedOrder.id}
                </span>
              </div>
              <h2 className="text-2xl font-black text-navy-950 flex items-center gap-3">
                <span>{selectedOrder.order_reference}</span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-bold capitalize ${
                    selectedOrder.order_status === 'delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedOrder.order_status === 'dispatched'
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selectedOrder.order_status.replace(/_/g, ' ')}
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Placed on {selectedOrder.created_at} &bull; {selectedOrder.school_name || selectedOrder.delivery_school_name}
              </p>
            </div>

            {/* TWO-COLUMN DETAILS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* School & Contact Information */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-200/60 pb-2">
                  <Building2 className="w-4 h-4 text-[#09653d]" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-navy-950">
                    School & Signatory Details
                  </h3>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">School Name & URN</span>
                    <span className="font-bold text-navy-900 text-sm">
                      {selectedOrder.school_name || selectedOrder.delivery_school_name}
                    </span>
                    {selectedOrder.school_urn && (
                      <span className="text-slate-500 block text-[11px] font-mono">
                        URN: {selectedOrder.school_urn}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Delivery Address</span>
                    <span className="text-navy-900 font-medium">
                      {selectedOrder.delivery_address_line1}
                      {selectedOrder.delivery_address_line2 ? `, ${selectedOrder.delivery_address_line2}` : ''}
                      {selectedOrder.delivery_town_city ? `, ${selectedOrder.delivery_town_city}` : ''}
                      {selectedOrder.delivery_postcode ? ` - ${selectedOrder.delivery_postcode}` : ''}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px] uppercase">Contact Person</span>
                      <span className="font-bold text-navy-900">{selectedOrder.contact_name}</span>
                      <span className="block text-[11px] text-slate-500">{selectedOrder.contact_role || 'Staff Contact'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px] uppercase">Headteacher</span>
                      <span className="font-bold text-navy-900">
                        {selectedOrder.headteacher_name || selectedOrder.contact_name}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px] uppercase">Email</span>
                      <span className="text-navy-900 font-medium">{selectedOrder.contact_email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px] uppercase">Phone</span>
                      <span className="text-navy-900 font-medium">{selectedOrder.contact_phone || selectedOrder.school_phone || '0161 973 3552'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items & Financial Summary */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 border-b border-slate-200/60 pb-2 mb-3">
                    <Package className="w-4 h-4 text-[#09653d]" />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-navy-950">
                      Items & Order Value
                    </h3>
                  </div>

                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((it: any) => (
                        <div key={it.id} className="flex justify-between items-center text-xs py-1 border-b border-slate-200/40">
                          <div>
                            <span className="font-bold text-navy-900">{it.product_name}</span>
                            <span className="block text-[10px] text-slate-500">
                              Qty: {it.quantity} &bull; {it.strength || ''}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-navy-900">
                            £{(it.total_price || it.unit_price * it.quantity)?.toFixed(2)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500">Auto-injector medical supply</p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Payment Method:</span>
                    <span className="font-bold capitalize">{selectedOrder.payment_method === 'bacs_invoice' ? '30-Day BACS Invoice' : 'Card Payment'}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Payment Status:</span>
                    <span className="font-bold capitalize text-emerald-700">{selectedOrder.payment_status}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-navy-950 pt-1 border-t border-slate-200/60">
                    <span>Grand Total (inc VAT):</span>
                    <span className="text-[#09653d]">£{selectedOrder.total_amount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PROMINENT REQUISITION & INVOICE ACTIONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Official Requisition PDF Card */}
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <FileText className="w-5 h-5 text-[#09653d]" />
                    <h4 className="font-bold text-xs text-emerald-950 uppercase tracking-wider">
                      Official Headteacher Requisition Form
                    </h4>
                  </div>
                  <p className="text-xs text-emerald-900 mb-3">
                    Compliant under Schedule 17 of Human Medicines Regulations 2017. Pre-filled with school & pen details.
                  </p>
                </div>
                <a
                  href={`/api/orders/${selectedOrder.id}/requisition/pdf`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-[#09653d] hover:bg-[#064e2e] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 text-center"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Download Requisition Form PDF</span>
                </a>
              </div>

              {/* Invoice & Gmail Dispatch Card */}
              <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Mail className="w-5 h-5 text-purple-700" />
                    <h4 className="font-bold text-xs text-purple-950 uppercase tracking-wider">
                      Invoice Generator & Gmail Dispatch
                    </h4>
                  </div>
                  <p className="text-xs text-purple-900 mb-3">
                    Generate, preview, adjust PO/payment terms, and send the official invoice directly via Gmail.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenInvoiceModal(selectedOrder)}
                  className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 text-center"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Open Invoice & Dispatch Modal</span>
                </button>
              </div>
            </div>

            {/* Workflow Status Controls */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                <h3 className="font-bold text-xs uppercase tracking-wider text-navy-950 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-navy-700" />
                  <span>Fulfillment & Dispatch Workflow</span>
                </h3>
                {selectedOrder.pharmacy_review_status !== 'approved' ? (
                  <button
                    onClick={() => handleSaveUpdate(true)}
                    disabled={isUpdating}
                    className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approve Pharmacy Dispensing</span>
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-md">
                    <CheckCircle className="w-3.5 h-3.5" /> Verified by Pharmacist
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-800 mb-1">Order Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-[#09653d] bg-white"
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
                  <label className="block text-xs font-bold text-navy-800 mb-1">Batch Allocation</label>
                  <select
                    value={assignBatchId}
                    onChange={(e) => setAssignBatchId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-[#09653d] bg-white"
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
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#09653d] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-800 mb-1">Tracking Number</label>
                  <input
                    value={editTracking}
                    placeholder="e.g. DPD-UK-98210398"
                    onChange={(e) => setEditTracking(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#09653d] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-800 mb-1">Internal Notes</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#09653d] bg-white"
                />
              </div>

              {updateMsg && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold ${
                    updateMsg.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800'
                  }`}
                >
                  {updateMsg}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleSaveUpdate(false)}
                  disabled={isUpdating}
                  className="flex-1 py-3 rounded-xl bg-[#09653d] hover:bg-[#064e2e] text-white font-bold text-xs shadow-md transition-all"
                >
                  {isUpdating ? 'Saving Changes…' : 'Save Workflow & Tracking Updates'}
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="py-3 px-6 rounded-xl border border-slate-200 text-navy-800 font-bold text-xs hover:bg-slate-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED INVOICE GENERATOR, EDITOR & GMAIL DISPATCH MODAL */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[92vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setInvoiceOrder(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 uppercase tracking-wider">
                  Official Educational Invoice
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  Ref: {invoiceOrder.order_reference}
                </span>
              </div>
              <h2 className="text-2xl font-black text-navy-950">
                Invoice & BACS Dispatch Gateway
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Client: <strong>{invoiceOrder.school_name || invoiceOrder.delivery_school_name}</strong> &bull; Total: <strong>£{invoiceOrder.total_amount?.toFixed(2)}</strong>
              </p>
            </div>

            {/* LIVE PREVIEW BANNER */}
            <div className="bg-gradient-to-r from-purple-50 via-slate-50 to-purple-50 p-4 rounded-2xl border border-purple-200/80">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Invoice Number</span>
                  <span className="font-mono font-bold text-purple-900 text-sm">
                    {invoiceRef || invoiceOrder.invoice_number || `INV-${invoiceOrder.id}`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Payment Due</span>
                  <span className="font-bold text-navy-900">{invoiceDueDate || '30 Days Net'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Subtotal (ex VAT)</span>
                  <span className="font-mono font-semibold text-slate-700">£{(invoiceOrder.total_amount / 1.2).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">VAT (20%)</span>
                  <span className="font-mono font-semibold text-slate-700">£{(invoiceOrder.total_amount - invoiceOrder.total_amount / 1.2).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Total Due</span>
                  <span className="font-mono font-black text-base text-[#09653d]">£{invoiceOrder.total_amount?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* EDITABLE FIELDS */}
            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-navy-950 flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-purple-700" />
                <span>Customise Invoice Details & Recipient</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-800 mb-1">
                    Recipient Email Address (Client Finance / School) *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={invoiceEmail}
                      onChange={(e) => setInvoiceEmail(e.target.value)}
                      placeholder="e.g. finance@school.sch.uk"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-purple-600 bg-white font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-800 mb-1">
                    School Purchase Order (PO) Number
                  </label>
                  <input
                    type="text"
                    value={invoicePoNumber}
                    onChange={(e) => setInvoicePoNumber(e.target.value)}
                    placeholder="e.g. PO-89210-SCH"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-purple-600 bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-800 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={invoiceDueDate}
                    onChange={(e) => setInvoiceDueDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-purple-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-800 mb-1">BACS Sort Code</label>
                  <input
                    type="text"
                    value={invoiceSortCode}
                    onChange={(e) => setInvoiceSortCode(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-purple-600 bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-800 mb-1">BACS Account Number</label>
                  <input
                    type="text"
                    value={invoiceAccountNumber}
                    onChange={(e) => setInvoiceAccountNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-purple-600 bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-800 mb-1">
                  BACS Payment Reference (Quoted on remittance)
                </label>
                <input
                  type="text"
                  value={invoiceRef}
                  onChange={(e) => setInvoiceRef(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-purple-600 bg-white font-mono font-bold text-purple-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-800 mb-1">
                  Custom Notes to School Finance Department
                </label>
                <textarea
                  rows={2}
                  value={invoiceNotes}
                  onChange={(e) => setInvoiceNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-purple-600 bg-white"
                />
              </div>
            </div>

            {/* STATUS / RESULT MESSAGE */}
            {invoiceResultMsg && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                  invoiceResultMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {invoiceResultMsg.type === 'success' ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{invoiceResultMsg.text}</span>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-100">
              <a
                href={`/api/invoices/${invoiceOrder.id}/pdf`}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-5 rounded-xl border border-slate-200 text-navy-800 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>Preview / Download PDF</span>
              </a>

              <button
                type="button"
                onClick={handleSendInvoiceEmail}
                disabled={isSendingInvoice}
                className="flex-1 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isSendingInvoice ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Dispatching via Gmail API…</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Invoice to Client via Gmail</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setInvoiceOrder(null)}
                className="py-3 px-5 rounded-xl border border-slate-200 text-slate-500 font-bold text-xs hover:bg-slate-50"
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
