'use client';

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Lock, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export interface StripePaymentHandle {
  confirmPayment: (returnUrl?: string) => Promise<{ success: boolean; paymentIntentId?: string; error?: string }>;
}

interface StripePaymentSectionProps {
  clientSecret: string;
  totalAmount: number;
  schoolName: string;
}

const CheckoutInnerForm = forwardRef<StripePaymentHandle, { totalAmount: number; schoolName: string }>(
  ({ totalAmount, schoolName }, ref) => {
    const stripe = useStripe();
    const elements = useElements();
    const [elementReady, setElementReady] = useState(false);
    const [cardError, setCardError] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      async confirmPayment(returnUrl?: string) {
        if (!stripe || !elements) {
          return { success: false, error: 'Stripe payment processor is still loading. Please wait a moment.' };
        }

        try {
          const redirectUrl =
            returnUrl || (typeof window !== 'undefined' ? `${window.location.origin}/order-confirmation` : '');

          const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
              return_url: redirectUrl,
            },
            redirect: 'if_required',
          });

          if (result.error) {
            setCardError(result.error.message || 'Payment authentication failed.');
            return { success: false, error: result.error.message };
          }

          if (result.paymentIntent && (result.paymentIntent.status === 'succeeded' || result.paymentIntent.status === 'processing')) {
            setCardError(null);
            return { success: true, paymentIntentId: result.paymentIntent.id };
          }

          return { success: false, error: 'Payment status incomplete. Please check your card details.' };
        } catch (err: any) {
          const msg = err.message || 'Unexpected payment error.';
          setCardError(msg);
          return { success: false, error: msg };
        }
      },
    }));

    return (
      <div className="space-y-4">
        {/* Security Header Badge */}
        <div className="flex items-center justify-between text-xs text-[#09653d] font-semibold bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200/60 font-sans">
          <span className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5" />
            256-Bit Encrypted Live Stripe Checkout
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
            <ShieldCheck className="w-3 h-3 text-[#09653d]" />
            PCI DSS Level 1
          </span>
        </div>

        {/* Stripe Official Element */}
        <div className="bg-white rounded-2xl p-4 border border-black/[0.08] shadow-2xs min-h-[160px] relative">
          {!elementReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-2xl z-10">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 font-sans">
                <RefreshCw className="w-4 h-4 animate-spin text-[#09653d]" />
                <span>Loading secure card & mobile wallet input...</span>
              </div>
            </div>
          )}

          <PaymentElement
            id="stripe-payment-element"
            onReady={() => setElementReady(true)}
            options={{
              layout: 'tabs',
              wallets: {
                applePay: 'auto',
                googlePay: 'auto',
              },
            }}
          />
        </div>

        {cardError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5 font-sans animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{cardError}</span>
          </div>
        )}

        <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 font-sans">
          <span>Debit &amp; credit cards accepted</span>
          <span>Instant electronic VAT receipt</span>
        </div>
      </div>
    );
  }
);

CheckoutInnerForm.displayName = 'CheckoutInnerForm';

export const StripePaymentSection = forwardRef<StripePaymentHandle, StripePaymentSectionProps>(
  ({ clientSecret, totalAmount, schoolName }, ref) => {
    if (!clientSecret || !stripePromise) {
      return (
        <div className="p-6 bg-white rounded-2xl border border-black/[0.08] text-center space-y-2">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#09653d]" />
          <p className="text-xs font-semibold text-slate-700 font-sans">Initializing live Stripe session...</p>
        </div>
      );
    }

    return (
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: 'flat',
            variables: {
              colorPrimary: '#09653d',
              colorBackground: '#ffffff',
              colorText: '#1d1d1f',
              colorDanger: '#e11d48',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
              borderRadius: '14px',
              spacingUnit: '4px',
            },
            rules: {
              '.Input': {
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
                backgroundColor: '#f5f5f7',
                padding: '12px 14px',
                fontSize: '14px',
                transition: 'all 0.2s ease',
              },
              '.Input:focus': {
                backgroundColor: '#ffffff',
                borderColor: '#09653d',
                boxShadow: '0 0 0 3px rgba(9, 101, 61, 0.15)',
              },
              '.Label': {
                fontSize: '12px',
                fontWeight: '600',
                color: '#1d1d1f',
                marginBottom: '6px',
              },
              '.Tab': {
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '12px',
                backgroundColor: '#f5f5f7',
                padding: '10px 14px',
              },
              '.Tab--selected': {
                borderColor: '#09653d',
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                color: '#09653d',
              },
            },
          },
        }}
      >
        <CheckoutInnerForm ref={ref} totalAmount={totalAmount} schoolName={schoolName} />
      </Elements>
    );
  }
);

StripePaymentSection.displayName = 'StripePaymentSection';

export default StripePaymentSection;
