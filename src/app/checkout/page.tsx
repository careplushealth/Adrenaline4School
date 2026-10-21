'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import {
  CheckCircle,
  CreditCard,
  FileText,
  AlertCircle,
  Upload,
  Building2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Download,
  Lock,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import MedicalDeviceVisual from '@/components/MedicalDeviceVisual';
import SchoolSearchInput, { UKSchoolRecord } from '@/components/SchoolSearchInput';
import RequisitionModal from '@/components/RequisitionModal';

type Step = 'school' | 'delivery' | 'payment' | 'confirm';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, vatTotal, total, requiresRequisition, clearCart } = useCart();
  const [step, setStep] = useState<Step>('school');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [isManualSchool, setIsManualSchool] = useState(false);

  // Stripe state
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [isLiveStripe, setIsLiveStripe] = useState<boolean>(false);
  const [isInitializingStripe, setIsInitializingStripe] = useState<boolean>(false);

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
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardZip: '',
    requisitionDocName: '',
    acceptTerms: false,
    acceptPharmacyTerms: false,
  });

  const setField = (field: string, value: string | boolean) => setForm((prev) => ({ ...prev, [field]: value }));

  // Initialize Stripe PaymentIntent when payment step is activated
  useEffect(() => {
    if (step === 'payment' && form.paymentMethod === 'card' && !stripeClientSecret && total > 0) {
      initStripePaymentIntent();
    }
  }, [step, form.paymentMethod, total]);

  const initStripePaymentIntent = async () => {
    try {
      setIsInitializingStripe(true);
      const res = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          schoolName: form.schoolName || 'UK School',
          contactEmail: form.contactEmail || '',
        }),
      });
      const data = await res.json();
      if (data.success && data.clientSecret) {
        setStripeClientSecret(data.clientSecret);
        setIsLiveStripe(Boolean(data.isLiveStripe));
      }
    } catch (err) {
      console.error('Failed to initialise Stripe PaymentIntent', err);
    } finally {
      setIsInitializingStripe(false);
    }
  };

  // Card formatting helpers
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setField('cardNumber', formatted);
  };

  const handleExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setField('cardExpiry', `${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setField('cardExpiry', raw);
    }
  };

  const handleCvcChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    setField('cardCvc', raw);
  };

  const handleSubmit = async () => {
    if (!form.acceptTerms || !form.acceptPharmacyTerms) {
      setError('Please accept both the terms & conditions and pharmacy requirements to proceed.');
      return;
    }
    if (!form.schoolName || !form.contactEmail || !form.deliveryAddress1) {
      setError('Please complete all required school and delivery fields.');
      return;
    }

    if (form.paymentMethod === 'card') {
      const cleanCard = form.cardNumber.replace(/\s+/g, '');
      if (cleanCard.length < 15) {
        setError('Please enter a valid 16-digit debit or credit card number.');
        return;
      }
      if (form.cardExpiry.length < 5) {
        setError('Please enter a valid card expiry date (MM/YY).');
        return;
      }
      if (form.cardCvc.length < 3) {
        setError('Please enter a valid 3-digit card security CVC code.');
        return;
      }
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
        cardPaymentDetails:
          form.paymentMethod === 'card'
            ? {
                last4: form.cardNumber.replace(/\s+/g, '').slice(-4),
                cardHolder: form.cardName || form.contactName,
                stripePaymentSecret: stripeClientSecret,
              }
            : undefined,
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

      // Clear basket and redirect to confirmation
      clearCart();
      router.push(
        `/order-confirmation?ref=${data.orderReference || 'A4S-ORD'}&method=${form.paymentMethod}&total=${total.toFixed(2)}`
      );
    } catch {
      setError('A network error occurred while communicating with the server. Please try again.');
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
      <div className="min-h-screen bg-[#f8fbfb] flex items-center justify-center font-sans text-[#0c2340]">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-[#0c2340] mb-3">Your basket is empty</h2>
          <Link href="/order-pens" className="text-[#096556] font-semibold hover:underline">
            Browse emergency adrenaline auto-injectors &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fbfb] text-[#0c2340] py-10 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {steps.map((s, i) => (
            <React.Fragment key={s.id}>
              <div
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  s.id === step
                    ? 'bg-[#096556] text-white shadow-xs'
                    : i < currentStepIndex
                    ? 'bg-emerald-100 text-emerald-900'
                    : 'bg-stone-200/80 text-stone-500'
                }`}
              >
                {i < currentStepIndex ? (
                  <CheckCircle className="w-3.5 h-3.5 text-[#096556]" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-white/20 inline-flex items-center justify-center text-[10px] font-bold">
                    {i + 1}
                  </span>
                )}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 ${i < currentStepIndex ? 'bg-emerald-400' : 'bg-stone-200'}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Panel */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 sm:p-8">
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Please check your details</p>
                  <p className="text-rose-700 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* Step 1: School */}
            {step === 'school' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#0c2340]">School Information</h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Select your official school from the UK Department for Education register (24,000+ open schools).
                  </p>
                </div>

                {!isManualSchool ? (
                  <div>
                    <SchoolSearchInput
                      label="Find School in UK DfE GIAS Database"
                      placeholder="Type school name or postcode (e.g. St Mary's, SW1A 1AA)..."
                      selectedSchoolName={form.schoolName}
                      onSelectSchool={(school: UKSchoolRecord) => {
                        setForm((prev) => ({
                          ...prev,
                          schoolName: school.name,
                          urn: school.urn,
                          headteacherName: school.headteacher || prev.headteacherName,
                          deliveryAddress1: school.address_line1 || prev.deliveryAddress1,
                          deliveryCity: school.town_city || prev.deliveryCity,
                          deliveryPostcode: school.postcode || prev.deliveryPostcode,
                          contactPhone: school.phone || prev.contactPhone,
                        }));
                      }}
                    />
                    <div className="mt-2 flex items-center justify-between text-xs text-stone-500">
                      <span>Official DfE GIAS Open School Directory</span>
                      <button
                        type="button"
                        onClick={() => setIsManualSchool(true)}
                        className="text-[#096556] hover:underline font-semibold"
                      >
                        Enter manually instead &rarr;
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                      School / Establishment Name *
                    </label>
                    <input
                      required
                      value={form.schoolName}
                      onChange={(e) => setField('schoolName', e.target.value)}
                      placeholder="e.g. Oakridge Academy"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#096556] bg-stone-50/50"
                    />
                    <button
                      type="button"
                      onClick={() => setIsManualSchool(false)}
                      className="mt-2 text-xs text-[#096556] hover:underline font-semibold"
                    >
                      &larr; Search official UK School register
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                      DfE Unique Reference Number (URN)
                    </label>
                    <input
                      value={form.urn}
                      onChange={(e) => setField('urn', e.target.value)}
                      placeholder="6-digit URN (e.g. 102934)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#096556] bg-stone-50/50 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                      Headteacher / Principal Name *
                    </label>
                    <input
                      value={form.headteacherName}
                      onChange={(e) => setField('headteacherName', e.target.value)}
                      placeholder="e.g. Mrs Sarah Jenkins"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#096556] bg-stone-50/50"
                    />
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-5 space-y-4">
                  <h3 className="font-serif font-bold text-sm text-[#0c2340]">Your Contact Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        required
                        value={form.contactName}
                        onChange={(e) => setField('contactName', e.target.value)}
                        placeholder="e.g. John Davies"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#096556] bg-stone-50/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                        Role / Job Title
                      </label>
                      <input
                        value={form.jobTitle}
                        onChange={(e) => setField('jobTitle', e.target.value)}
                        placeholder="e.g. School Business Manager / Nurse"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#096556] bg-stone-50/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                        Official School Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.contactEmail}
                        onChange={(e) => setField('contactEmail', e.target.value)}
                        placeholder="e.g. sbm@school.sch.uk"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#096556] bg-stone-50/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                        School Phone Number
                      </label>
                      <input
                        value={form.contactPhone}
                        onChange={(e) => setField('contactPhone', e.target.value)}
                        placeholder="e.g. 020 7946 0123"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#096556] bg-stone-50/50"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!form.schoolName || !form.contactName || !form.contactEmail) {
                      setError('Please enter school name, contact name, and school email.');
                      return;
                    }
                    setError('');
                    setStep('delivery');
                  }}
                  className="w-full py-3.5 rounded-full bg-[#096556] hover:bg-[#075246] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-[#096556]/20 transition-all"
                >
                  Continue to Delivery &rarr;
                </button>
              </div>
            )}

            {/* Step 2: Delivery & Billing */}
            {step === 'delivery' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#0c2340]">Delivery & Billing Details</h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Emergency adrenaline supplies must be delivered to the official school reception address.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                      Address Line 1 *
                    </label>
                    <input
                      required
                      value={form.deliveryAddress1}
                      onChange={(e) => setField('deliveryAddress1', e.target.value)}
                      placeholder="e.g. School Lane"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#096556] bg-stone-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      value={form.deliveryAddress2}
                      onChange={(e) => setField('deliveryAddress2', e.target.value)}
                      placeholder="e.g. Main Office / Medical Room"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#096556] bg-stone-50/50"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                        Town / City *
                      </label>
                      <input
                        required
                        value={form.deliveryCity}
                        onChange={(e) => setField('deliveryCity', e.target.value)}
                        placeholder="e.g. London"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#096556] bg-stone-50/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                        Postcode *
                      </label>
                      <input
                        required
                        value={form.deliveryPostcode}
                        onChange={(e) => setField('deliveryPostcode', e.target.value)}
                        placeholder="e.g. SW1A 1AA"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#096556] bg-stone-50/50 font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="sameBilling"
                      checked={form.sameAsBilling}
                      onChange={(e) => setField('sameAsBilling', e.target.checked)}
                      className="w-4 h-4 rounded border-stone-300 text-[#096556] focus:ring-[#096556]"
                    />
                    <label htmlFor="sameBilling" className="text-xs font-bold text-[#0c2340] cursor-pointer">
                      Billing address is identical to delivery school address
                    </label>
                  </div>

                  {!form.sameAsBilling && (
                    <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
                      <h4 className="font-serif font-bold text-xs text-[#0c2340]">Multi-Academy Trust or Central Finance Address</h4>
                      <input
                        value={form.billingOrgName}
                        onChange={(e) => setField('billingOrgName', e.target.value)}
                        placeholder="Trust / LA / Finance Department Name"
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#096556] bg-white"
                      />
                      <input
                        value={form.billingAddress1}
                        onChange={(e) => setField('billingAddress1', e.target.value)}
                        placeholder="Billing Address Line 1"
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#096556] bg-white"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          value={form.billingCity}
                          onChange={(e) => setField('billingCity', e.target.value)}
                          placeholder="City"
                          className="px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#096556] bg-white"
                        />
                        <input
                          value={form.billingPostcode}
                          onChange={(e) => setField('billingPostcode', e.target.value)}
                          placeholder="Postcode"
                          className="px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#096556] bg-white uppercase font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep('school')}
                    className="py-3 px-6 rounded-full border border-stone-200 text-[#0c2340] font-semibold text-xs flex items-center gap-2 hover:bg-stone-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!form.deliveryAddress1 || !form.deliveryPostcode) {
                        setError('Please provide the full delivery address and postcode.');
                        return;
                      }
                      setError('');
                      setStep('payment');
                    }}
                    className="flex-1 py-3.5 rounded-full bg-[#096556] hover:bg-[#075246] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-[#096556]/20 transition-all"
                  >
                    Continue to Payment &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 'payment' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#0c2340]">Select Payment Method</h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Choose between 30-Day official educational invoice or instant online payment via Stripe.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* BACS Option */}
                  <button
                    type="button"
                    onClick={() => setField('paymentMethod', 'bacs_invoice')}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      form.paymentMethod === 'bacs_invoice'
                        ? 'border-[#096556] bg-emerald-50/60 ring-2 ring-[#096556]/20 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          form.paymentMethod === 'bacs_invoice' ? 'border-[#096556]' : 'border-stone-300'
                        }`}
                      >
                        {form.paymentMethod === 'bacs_invoice' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#096556]" />
                        )}
                      </div>
                      <FileText className="w-5 h-5 text-[#096556]" />
                      <div>
                        <span className="font-serif font-bold text-sm text-[#0c2340]">30-Day BACS Invoice</span>
                        <span className="ml-2 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#096556] text-white">
                          School Choice
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Instant order dispatch. An official PDF invoice is generated with 30-day payment terms for your school finance department.
                    </p>
                    {form.paymentMethod === 'bacs_invoice' && (
                      <div className="mt-4 pt-3 border-t border-emerald-200/60">
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                          School Purchase Order (PO) Number (Optional)
                        </label>
                        <input
                          value={form.poNumber}
                          onChange={(e) => setField('poNumber', e.target.value)}
                          placeholder="e.g. PO-2026-4821"
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#096556] bg-white font-mono"
                        />
                      </div>
                    )}
                  </button>

                  {/* Stripe Card Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setField('paymentMethod', 'card');
                      if (!stripeClientSecret) initStripePaymentIntent();
                    }}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      form.paymentMethod === 'card'
                        ? 'border-[#096556] bg-emerald-50/60 ring-2 ring-[#096556]/20 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          form.paymentMethod === 'card' ? 'border-[#096556]' : 'border-stone-300'
                        }`}
                      >
                        {form.paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-[#096556]" />}
                      </div>
                      <CreditCard className="w-5 h-5 text-[#096556]" />
                      <div>
                        <span className="font-serif font-bold text-sm text-[#0c2340]">Card / Apple Pay</span>
                        <span className="ml-2 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
                          Stripe
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Instant online payment via school procurement debit/credit card or mobile wallet. PCI DSS Level 1 certified.
                    </p>

                    {form.paymentMethod === 'card' && (
                      <div className="mt-4 pt-3 border-t border-emerald-200/60 space-y-3">
                        <div className="flex items-center justify-between text-[11px] text-[#096556] font-semibold bg-emerald-100/60 p-2 rounded-xl">
                          <span className="flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Stripe Security
                          </span>
                          <span className="text-stone-500 font-mono text-[10px]">
                            {isLiveStripe ? 'Live Stripe Active' : 'Stripe Ready'}
                          </span>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">
                            Cardholder Name
                          </label>
                          <input
                            value={form.cardName}
                            onChange={(e) => setField('cardName', e.target.value)}
                            placeholder="e.g. Mrs E Clarke"
                            className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-[#096556] bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">
                            Card Number
                          </label>
                          <input
                            value={form.cardNumber}
                            onChange={(e) => handleCardNumberChange(e.target.value)}
                            placeholder="4242 4242 4242 4242"
                            className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-[#096556] bg-white font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">
                              Expiry Date
                            </label>
                            <input
                              value={form.cardExpiry}
                              onChange={(e) => handleExpiryChange(e.target.value)}
                              placeholder="MM/YY"
                              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-[#096556] bg-white font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">
                              Security CVC
                            </label>
                            <input
                              value={form.cardCvc}
                              onChange={(e) => handleCvcChange(e.target.value)}
                              placeholder="123"
                              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-[#096556] bg-white font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </button>
                </div>

                {/* Statutory Requisition Form Generator & Upload */}
                {requiresRequisition && (
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-200/80">
                      <div>
                        <h4 className="font-serif font-bold text-sm text-[#0c2340]">Official Headteacher Requisition</h4>
                        <p className="text-xs text-stone-600 mt-0.5">
                          Required under Human Medicines Regulations 2017 for UK school emergency supply.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsReqModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#096556] border border-emerald-300 hover:bg-emerald-50 font-bold text-xs shadow-2xs transition-colors shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Generate & Download PDF Form
                      </button>
                    </div>

                    <div className="flex items-start gap-3">
                      <Upload className="w-5 h-5 text-[#096556] shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-bold text-xs text-[#0c2340]">Upload Signed Requisition Form (Optional Now)</h5>
                        <p className="text-xs text-stone-600 mt-0.5 mb-2.5 leading-relaxed">
                          You can upload the signed form now, or reply to your order confirmation email before pharmacy courier dispatch.
                        </p>
                        <label className="block">
                          <span className="sr-only">Upload requisition</span>
                          <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={(e) => setField('requisitionDocName', e.target.files?.[0]?.name || '')}
                            className="text-xs text-stone-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#096556] file:text-white hover:file:bg-[#075246] cursor-pointer"
                          />
                        </label>
                        {form.requisitionDocName && (
                          <p className="mt-2 text-xs text-emerald-800 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-[#096556]" /> Attached: {form.requisitionDocName}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep('delivery')}
                    className="py-3 px-6 rounded-full border border-stone-200 text-[#0c2340] font-semibold text-xs flex items-center gap-2 hover:bg-stone-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (form.paymentMethod === 'card') {
                        const cleanCard = form.cardNumber.replace(/\s+/g, '');
                        if (cleanCard.length < 15) {
                          setError('Please enter a 16-digit card number.');
                          return;
                        }
                        if (form.cardExpiry.length < 5) {
                          setError('Please enter an expiry date (MM/YY).');
                          return;
                        }
                      }
                      setError('');
                      setStep('confirm');
                    }}
                    className="flex-1 py-3.5 rounded-full bg-[#096556] hover:bg-[#075246] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-[#096556]/20 transition-all"
                  >
                    Review Order &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Confirm */}
            {step === 'confirm' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#0c2340]">Review & Confirm Order</h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Please verify your school details and accept statutory pharmacy supply declarations.
                  </p>
                </div>

                <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-500">School:</span>
                    <span className="font-bold text-[#0c2340]">{form.schoolName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Official Contact:</span>
                    <span className="font-bold text-[#0c2340]">
                      {form.contactName} ({form.contactEmail})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Delivery Address:</span>
                    <span className="font-bold text-[#0c2340]">
                      {form.deliveryAddress1}, {form.deliveryCity} {form.deliveryPostcode}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Payment Selection:</span>
                    <span className="font-bold text-[#096556]">
                      {form.paymentMethod === 'bacs_invoice'
                        ? '30-Day BACS School Invoice'
                        : `Stripe Card Payment (Ending in ${form.cardNumber.replace(/\s+/g, '').slice(-4) || 'Card'})`}
                    </span>
                  </div>
                  {form.poNumber && (
                    <div className="flex justify-between">
                      <span className="text-stone-500">Purchase Order:</span>
                      <span className="font-bold text-[#0c2340]">{form.poNumber}</span>
                    </div>
                  )}
                  {form.requisitionDocName && (
                    <div className="flex justify-between">
                      <span className="text-stone-500">Signed Requisition:</span>
                      <span className="font-semibold text-emerald-800 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-[#096556]" />
                        {form.requisitionDocName}
                      </span>
                    </div>
                  )}
                </div>

                {/* Statutory Checkboxes */}
                <div className="space-y-3 font-sans">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.acceptTerms}
                      onChange={(e) => setField('acceptTerms', e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-stone-300 text-[#096556] focus:ring-[#096556]"
                    />
                    <span className="text-xs text-stone-600 leading-relaxed">
                      I confirm that I am authorized to order emergency medical supplies on behalf of{' '}
                      <strong>{form.schoolName || 'the school'}</strong> and agree to the{' '}
                      <Link href="/terms" target="_blank" className="text-[#096556] underline font-semibold">
                        Terms of Supply
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" target="_blank" className="text-[#096556] underline font-semibold">
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.acceptPharmacyTerms}
                      onChange={(e) => setField('acceptPharmacyTerms', e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-stone-300 text-[#096556] focus:ring-[#096556]"
                    />
                    <span className="text-xs text-stone-600 leading-relaxed">
                      I confirm these emergency adrenaline auto-injectors are held for emergency use in school compliance
                      under Regulation 214 of the Human Medicines Regulations 2017, and a Headteacher Requisition will be
                      retained on file.
                    </span>
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep('payment')}
                    className="py-3 px-6 rounded-full border border-stone-200 text-[#0c2340] font-semibold text-xs flex items-center gap-2 hover:bg-stone-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-4 rounded-full bg-[#096556] hover:bg-[#075246] disabled:opacity-50 text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#096556]/25 transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Processing Order...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        <span>
                          {form.paymentMethod === 'card'
                            ? `Pay £${total.toFixed(2)} & Finalise Order`
                            : `Submit School Order (£${total.toFixed(2)})`}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-5 sticky top-24">
              <h3 className="font-serif font-bold text-[#0c2340] mb-4">Your School Order</h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 text-sm">
                    <div className="w-10 h-14 rounded-lg shrink-0 flex items-center justify-center p-0.5 bg-stone-50 border border-stone-200 overflow-hidden">
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
                      <p className="font-semibold text-[#0c2340] text-xs truncate">
                        {item.product.brand} {item.product.strength.includes('300') ? '300mcg' : '150mcg'}
                      </p>
                      <p className="text-stone-400 text-xs">×{item.quantity}</p>
                    </div>
                    <span className="font-serif font-bold text-xs text-[#0c2340]">
                      £{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-100 pt-3 space-y-2 text-sm font-sans">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal (ex VAT)</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>VAT (20%)</span>
                  <span>£{vatTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Tracked Medical Courier</span>
                  <span className="text-[#096556] font-bold">FREE</span>
                </div>
                <div className="flex justify-between font-serif font-bold text-[#0c2340] text-lg pt-2 border-t border-stone-100">
                  <span>Total</span>
                  <span>£{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Pharmacy reassurance */}
              <div className="mt-5 pt-4 border-t border-stone-100 space-y-2 text-[11px] text-stone-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#096556] shrink-0" />
                  <span>GPhC Registered UK Pharmacy Dispensed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#096556] shrink-0" />
                  <span>Maximum Expiry Guaranteed & Tracked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Requisition Modal */}
      <RequisitionModal
        isOpen={isReqModalOpen}
        onClose={() => setIsReqModalOpen(false)}
        initialSchoolName={form.schoolName || "St. Mary's CE Primary School"}
        initialHeadteacher={form.headteacherName || "Mrs. Eleanor Clarke"}
        items={items.map((i) => ({
          name: i.product.name,
          strength: i.product.strength,
          quantity: i.quantity,
        }))}
      />
    </div>
  );
}
