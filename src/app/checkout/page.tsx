'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { CheckCircle, CreditCard, FileText, AlertCircle, Upload, Building2, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MedicalDeviceVisual from '@/components/MedicalDeviceVisual';

type Step = 'school' | 'delivery' | 'payment' | 'confirm';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, vatTotal, total, requiresRequisition, clearCart } = useCart();
  const [step, setStep] = useState<Step>('school');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [form, setForm] = useState({
    schoolName: '',
    urn: '',
    headteacherName: '',
    headteacherEmail: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    jobTitle: '',
    deliveryAddress1: '',
    deliveryAddress2: '',
    deliveryCity: '',
    deliveryPostcode: '',
    deliveryInstructions: '',
    sameAsBilling: true,
    billingOrgName: '',
    billingAddress1: '',
    billingAddress2: '',
    billingCity: '',
    billingPostcode: '',
    poNumber: '',
    paymentMethod: 'bacs_invoice' as 'bacs_invoice' | 'card',
    cardNumber: '4242 4242 4242 4242',
    cardExpiry: '12/28',
    cardCvc: '100',
    requisitionDocName: '',
    acceptTerms: false,
    acceptPharmacyTerms: false,
  });

  const setField = (field: string, value: string | boolean) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!form.acceptTerms || !form.acceptPharmacyTerms) {
      setError('Please accept the terms and pharmacy conditions to continue.');
      return;
    }
    if (!form.schoolName || !form.contactEmail || !form.deliveryAddress1) {
      setError('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        schoolName: form.schoolName,
        urn: form.urn,
        headteacherName: form.headteacherName,
        headteacherEmail: form.headteacherEmail,
        contactName: form.contactName,
        contactEmail: form.contactEmail,
        contactPhone: form.contactPhone,
        deliveryAddress1: form.deliveryAddress1,
        deliveryAddress2: form.deliveryAddress2,
        deliveryCity: form.deliveryCity,
        deliveryPostcode: form.deliveryPostcode,
        deliveryInstructions: form.deliveryInstructions,
        billingOrgName: form.billingOrgName || form.schoolName,
        billingAddress1: form.sameAsBilling ? form.deliveryAddress1 : form.billingAddress1,
        billingAddress2: form.sameAsBilling ? form.deliveryAddress2 : form.billingAddress2,
        billingCity: form.sameAsBilling ? form.deliveryCity : form.billingCity,
        billingPostcode: form.sameAsBilling ? form.deliveryPostcode : form.billingPostcode,
        poNumber: form.poNumber,
        paymentMethod: form.paymentMethod,
        requisitionDocName: form.requisitionDocName || null,
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'An error occurred while placing your order.');
        return;
      }

      clearCart();
      router.push(`/order-confirmation?ref=${data.orderReference}&method=${data.paymentMethod}&total=${data.totalAmount.toFixed(2)}`);
    } catch {
      setError('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps: { id: Step; label: string }[] = [
    { id: 'school', label: 'School Details' },
    { id: 'delivery', label: 'Delivery & Billing' },
    { id: 'payment', label: 'Payment' },
    { id: 'confirm', label: 'Confirm' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center font-sans text-forest-900">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-normal text-forest-950 mb-3">Your basket is empty</h2>
          <Link href="/order-pens" className="text-sage-800 font-medium hover:underline">Browse emergency pens →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory text-forest-900 py-10 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {steps.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                s.id === step
                  ? 'bg-forest-900 text-ivory'
                  : i < currentStepIndex
                  ? 'bg-sage-100 text-sage-900'
                  : 'bg-stone-200/80 text-stone-500'
              }`}>
                {i < currentStepIndex ? <CheckCircle className="w-3.5 h-3.5 text-sage-600" /> : <span className="w-4 h-4 rounded-full bg-white/20 inline-flex items-center justify-center text-[10px] font-semibold">{i + 1}</span>}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < currentStepIndex ? 'bg-sage-300' : 'bg-stone-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Panel */}
          <div className="lg:col-span-8 bg-white/90 rounded-3xl border border-stone-200/80 shadow-xs p-6 sm:p-8">
            {/* Step 1: School Details */}
            {step === 'school' && (
              <div className="space-y-5">
                <h2 className="text-xl font-serif font-normal text-forest-950 mb-1">School Details</h2>
                <p className="text-sm text-stone-500 mb-5">Tell us about your school so we can set up your account.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-forest-950 mb-1.5">School Name <span className="text-red-500">*</span></label>
                    <input value={form.schoolName} onChange={(e) => setField('schoolName', e.target.value)} placeholder="e.g. St. Mary's CE Primary School" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-sage-500 bg-linen/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-forest-950 mb-1.5">DfE URN Number</label>
                    <input value={form.urn} onChange={(e) => setField('urn', e.target.value)} placeholder="e.g. 109234" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-sage-500 bg-linen/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-forest-950 mb-1.5">Headteacher / Principal Name <span className="text-red-500">*</span></label>
                    <input value={form.headteacherName} onChange={(e) => setField('headteacherName', e.target.value)} placeholder="e.g. Mrs. Eleanor Clarke" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-sage-500 bg-linen/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-forest-950 mb-1.5">Headteacher Email</label>
                    <input type="email" value={form.headteacherEmail} onChange={(e) => setField('headteacherEmail', e.target.value)} placeholder="head@school.co.uk" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-sage-500 bg-linen/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-forest-950 mb-1.5">Your Name (Order Contact) <span className="text-red-500">*</span></label>
                    <input value={form.contactName} onChange={(e) => setField('contactName', e.target.value)} placeholder="e.g. Rachel Stevens" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-sage-500 bg-linen/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-forest-950 mb-1.5">Your Job Title</label>
                    <input value={form.jobTitle} onChange={(e) => setField('jobTitle', e.target.value)} placeholder="School Business Manager" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-sage-500 bg-linen/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-forest-950 mb-1.5">Work Email <span className="text-red-500">*</span></label>
                    <input type="email" value={form.contactEmail} onChange={(e) => setField('contactEmail', e.target.value)} placeholder="you@school.co.uk" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-sage-500 bg-linen/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-forest-950 mb-1.5">School Phone <span className="text-red-500">*</span></label>
                    <input type="tel" value={form.contactPhone} onChange={(e) => setField('contactPhone', e.target.value)} placeholder="01234 567890" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-sage-500 bg-linen/20" />
                  </div>
                </div>

                <button
                  onClick={() => setStep('delivery')}
                  className="w-full py-3.5 rounded-full bg-forest-900 hover:bg-forest-800 text-ivory font-medium text-sm flex items-center justify-center gap-2 shadow-xs transition-all mt-4"
                >
                  Continue to Delivery <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2: Delivery */}
            {step === 'delivery' && (
              <div className="space-y-4">
                <h2 className="text-xl font-serif font-normal text-forest-950 mb-1">Delivery Address</h2>
                <p className="text-sm text-stone-500 mb-5">Where should we send the pens? Delivery is next working day, free of charge.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-forest-950 mb-1.5">Street Address <span className="text-red-500">*</span></label>
                    <input value={form.deliveryAddress1} onChange={(e) => setField('deliveryAddress1', e.target.value)} placeholder="14 Church Lane" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-sage-500 bg-linen/20" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-forest-950 mb-1.5">Address Line 2</label>
                    <input value={form.deliveryAddress2} onChange={(e) => setField('deliveryAddress2', e.target.value)} placeholder="Kensington" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-sage-500 bg-linen/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-forest-950 mb-1.5">Town / City <span className="text-red-500">*</span></label>
                    <input value={form.deliveryCity} onChange={(e) => setField('deliveryCity', e.target.value)} placeholder="London" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-sage-500 bg-linen/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-forest-950 mb-1.5">Postcode <span className="text-red-500">*</span></label>
                    <input value={form.deliveryPostcode} onChange={(e) => setField('deliveryPostcode', e.target.value.toUpperCase())} placeholder="W8 4PT" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-sage-500 bg-linen/20" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-forest-950 mb-1.5">Delivery Instructions</label>
                    <input value={form.deliveryInstructions} onChange={(e) => setField('deliveryInstructions', e.target.value)} placeholder="e.g. Deliver to Main Reception, 8:30–3:30pm weekdays only" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-sage-500 bg-linen/20" />
                  </div>
                </div>

                <div className="mt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.sameAsBilling} onChange={(e) => setField('sameAsBilling', e.target.checked)} className="w-4 h-4 rounded text-sage-700" />
                    <span className="text-sm font-medium text-forest-900">Billing address is the same as delivery address</span>
                  </label>
                </div>

                {!form.sameAsBilling && (
                  <div className="mt-4 p-4 bg-linen/40 rounded-2xl border border-stone-200/80 space-y-4">
                    <h3 className="font-serif text-sm text-forest-950 flex items-center gap-2"><Building2 className="w-4 h-4" /> Billing Organisation / MAT</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-forest-950 mb-1.5">Organisation Name</label>
                        <input value={form.billingOrgName} onChange={(e) => setField('billingOrgName', e.target.value)} placeholder="e.g. Aethelstan Multi-Academy Trust" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-sage-500 bg-white" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-forest-950 mb-1.5">Billing Address</label>
                        <input value={form.billingAddress1} onChange={(e) => setField('billingAddress1', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-sage-500 bg-white" />
                      </div>
                      <div>
                        <input value={form.billingCity} onChange={(e) => setField('billingCity', e.target.value)} placeholder="City" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-sage-500 bg-white" />
                      </div>
                      <div>
                        <input value={form.billingPostcode} onChange={(e) => setField('billingPostcode', e.target.value.toUpperCase())} placeholder="Postcode" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-sage-500 bg-white" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-2">
                  <button onClick={() => setStep('school')} className="py-3 px-6 rounded-full border border-stone-200 text-forest-900 font-medium text-sm flex items-center gap-2 hover:bg-linen/50 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button onClick={() => setStep('payment')} className="flex-1 py-3.5 rounded-full bg-forest-900 hover:bg-forest-800 text-ivory font-medium text-sm flex items-center justify-center gap-2 shadow-xs transition-all">
                    Continue to Payment <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 'payment' && (
              <div className="space-y-6">
                <h2 className="text-xl font-serif font-normal text-forest-950">Payment Method</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* BACS Option */}
                  <button
                    onClick={() => setField('paymentMethod', 'bacs_invoice')}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      form.paymentMethod === 'bacs_invoice'
                        ? 'border-sage-600 bg-sage-50/50'
                        : 'border-stone-200/80 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        form.paymentMethod === 'bacs_invoice' ? 'border-sage-700' : 'border-stone-300'
                      }`}>
                        {form.paymentMethod === 'bacs_invoice' && <div className="w-2.5 h-2.5 rounded-full bg-sage-700" />}
                      </div>
                      <FileText className="w-5 h-5 text-sage-800" />
                      <span className="font-serif font-medium text-sm text-forest-950">BACS Invoice (30 Days)</span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">Receive a formal PDF invoice with bank transfer details. Pay within 30 days. Most popular for schools.</p>
                    {form.paymentMethod === 'bacs_invoice' && (
                      <div className="mt-4">
                        <label className="block text-xs font-medium text-forest-950 mb-1.5">Purchase Order (PO) Number</label>
                        <input value={form.poNumber} onChange={(e) => setField('poNumber', e.target.value)} placeholder="e.g. PO-2026-4821" className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-sage-500 bg-white" />
                      </div>
                    )}
                  </button>

                  {/* Card Option */}
                  <button
                    onClick={() => setField('paymentMethod', 'card')}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      form.paymentMethod === 'card'
                        ? 'border-sage-600 bg-sage-50/50'
                        : 'border-stone-200/80 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        form.paymentMethod === 'card' ? 'border-sage-700' : 'border-stone-300'
                      }`}>
                        {form.paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-sage-700" />}
                      </div>
                      <CreditCard className="w-5 h-5 text-sage-800" />
                      <span className="font-serif font-medium text-sm text-forest-950">Card Payment</span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">Pay securely now via debit or credit card. Powered by Stripe test mode during development.</p>
                    {form.paymentMethod === 'card' && (
                      <div className="mt-4 space-y-3">
                        <div className="bg-linen/60 border border-stone-200 rounded-lg p-2 text-[11px] text-stone-700 font-medium">
                          🔧 Test Mode: Use card 4242 4242 4242 4242
                        </div>
                        <input value={form.cardNumber} onChange={(e) => setField('cardNumber', e.target.value)} placeholder="Card Number" className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-sage-500 bg-white" />
                        <div className="grid grid-cols-2 gap-2">
                          <input value={form.cardExpiry} onChange={(e) => setField('cardExpiry', e.target.value)} placeholder="MM/YY" className="px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-sage-500 bg-white" />
                          <input value={form.cardCvc} onChange={(e) => setField('cardCvc', e.target.value)} placeholder="CVC" className="px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-sage-500 bg-white" />
                        </div>
                      </div>
                    )}
                  </button>
                </div>

                {/* Requisition Upload */}
                {requiresRequisition && (
                  <div className="bg-sage-50/70 border border-sage-200/80 rounded-2xl p-5">
                    <div className="flex items-start gap-3">
                      <Upload className="w-5 h-5 text-sage-800 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-serif font-medium text-sm text-forest-950">Upload Headteacher Requisition</h4>
                        <p className="text-xs text-stone-600 mt-1 mb-3 leading-relaxed">Required for GPhC pharmacy verification before dispatch.</p>
                        <label className="block">
                          <span className="sr-only">Upload requisition</span>
                          <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={(e) => setField('requisitionDocName', e.target.files?.[0]?.name || '')}
                            className="text-xs text-stone-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-forest-900 file:text-ivory hover:file:bg-forest-800 cursor-pointer"
                          />
                        </label>
                        {form.requisitionDocName && (
                          <p className="mt-2 text-xs text-sage-800 font-medium flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />{form.requisitionDocName}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button onClick={() => setStep('delivery')} className="py-3 px-6 rounded-full border border-stone-200 text-forest-900 font-medium text-sm flex items-center gap-2 hover:bg-linen/50 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button onClick={() => setStep('confirm')} className="flex-1 py-3.5 rounded-full bg-forest-900 hover:bg-forest-800 text-ivory font-medium text-sm flex items-center justify-center gap-2 shadow-xs transition-all">
                    Review Order <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Confirm */}
            {step === 'confirm' && (
              <div className="space-y-6">
                <h2 className="text-xl font-serif font-normal text-forest-950">Review & Confirm Your Order</h2>

                <div className="bg-linen/40 rounded-2xl border border-stone-200/80 p-5 space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-stone-500 font-sans">School:</span><span className="font-medium text-forest-950">{form.schoolName}</span></div>
                  <div className="flex justify-between"><span className="text-stone-500 font-sans">Contact:</span><span className="font-medium text-forest-950">{form.contactName} ({form.contactEmail})</span></div>
                  <div className="flex justify-between"><span className="text-stone-500 font-sans">Delivery:</span><span className="font-medium text-forest-950">{form.deliveryAddress1}, {form.deliveryCity} {form.deliveryPostcode}</span></div>
                  <div className="flex justify-between"><span className="text-stone-500 font-sans">Payment:</span><span className="font-medium text-forest-950">{form.paymentMethod === 'bacs_invoice' ? '30-Day BACS Invoice' : 'Card Payment (Test Mode)'}</span></div>
                  {form.poNumber && <div className="flex justify-between"><span className="text-stone-500 font-sans">PO Number:</span><span className="font-medium text-forest-950">{form.poNumber}</span></div>}
                  {form.requisitionDocName && <div className="flex justify-between"><span className="text-stone-500 font-sans">Requisition:</span><span className="font-medium text-sage-800 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />{form.requisitionDocName}</span></div>}
                </div>

                {/* Terms */}
                <div className="space-y-3 font-sans">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.acceptTerms} onChange={(e) => setField('acceptTerms', e.target.checked)} className="mt-0.5 w-4 h-4 rounded text-sage-700" />
                    <span className="text-xs text-stone-600 leading-relaxed">I agree to the <Link href="#" className="text-forest-950 font-medium underline">Terms and Conditions</Link> and <Link href="#" className="text-forest-950 font-medium underline">Privacy Policy</Link> of Adrenaline4Schools. I confirm this order is on behalf of a registered UK educational institution.</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.acceptPharmacyTerms} onChange={(e) => setField('acceptPharmacyTerms', e.target.checked)} className="mt-0.5 w-4 h-4 rounded text-sage-700" />
                    <span className="text-xs text-stone-600 leading-relaxed">I acknowledge that all emergency adrenaline auto-injectors are subject to GPhC pharmacy verification and Headteacher Requisition review before dispatch. Orders will not be fulfilled without valid documentation.</span>
                  </label>
                </div>

                {error && (
                  <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <button onClick={() => setStep('payment')} className="py-3 px-6 rounded-full border border-stone-200 text-forest-900 font-medium text-sm flex items-center gap-2 hover:bg-linen/50 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 rounded-full bg-gold-400 hover:bg-gold-300 disabled:opacity-50 text-forest-950 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    {isSubmitting ? (
                      <><div className="w-4 h-4 border-2 border-forest-950 border-t-transparent rounded-full animate-spin" />Processing…</>
                    ) : (
                      <><ShieldCheck className="w-4 h-4" />{form.paymentMethod === 'bacs_invoice' ? `Place Order & Request Invoice (£${total.toFixed(2)})` : `Place Order & Pay (£${total.toFixed(2)})`}</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white/90 rounded-3xl border border-stone-200/80 shadow-xs p-5 sticky top-24">
              <h3 className="font-serif font-medium text-forest-950 mb-4">Your Order</h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 text-sm">
                    <div className="w-10 h-14 rounded-lg shrink-0 flex items-center justify-center p-0.5 bg-linen/50 border border-stone-200 overflow-hidden">
                      <MedicalDeviceVisual
                        type={
                          item.product.brand === 'Emergency Kits'
                            ? 'wall-station'
                            : item.product.brand === 'EpiPen'
                            ? item.product.strength.includes('300')
                              ? 'epipen-300'
                              : 'epipen-150'
                            : item.product.strength.includes('300')
                            ? 'jext-300'
                            : 'jext-150'
                        }
                        size="sm"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-forest-950 text-xs truncate">{item.product.brand} {item.product.strength.includes('300') ? '300mcg' : '150mcg'}</p>
                      <p className="text-stone-400 text-xs">×{item.quantity}</p>
                    </div>
                    <span className="font-serif text-xs text-forest-950">£{(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-stone-100 pt-3 space-y-2 text-sm font-sans">
                <div className="flex justify-between text-stone-600"><span>Subtotal (ex VAT)</span><span>£{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-stone-600"><span>VAT (20%)</span><span>£{vatTotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-stone-600"><span>Delivery</span><span className="text-sage-700 font-medium">FREE</span></div>
                <div className="flex justify-between font-serif text-forest-950 text-lg pt-1 border-t border-stone-100">
                  <span>Total</span><span>£{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
