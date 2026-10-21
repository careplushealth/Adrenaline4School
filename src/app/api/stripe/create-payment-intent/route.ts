export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, schoolName, contactEmail, orderReference } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid order amount.' }, { status: 400 });
    }

    const amountInPence = Math.round(Number(amount) * 100);

    // If Stripe Secret Key is configured in environment
    if (stripe) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInPence,
        currency: 'gbp',
        automatic_payment_methods: { enabled: true },
        receipt_email: contactEmail || undefined,
        description: `Adrenaline4Schools Supply: ${schoolName || 'UK School'} (${orderReference || 'New Order'})`,
        metadata: {
          schoolName: schoolName || 'UK School',
          contactEmail: contactEmail || '',
          orderReference: orderReference || '',
        },
      });

      return NextResponse.json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        isLiveStripe: true,
      });
    }

    // Graceful fallback for local development / testing without live keys
    return NextResponse.json({
      success: true,
      clientSecret: `mock_pi_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
      paymentIntentId: `pi_mock_${Date.now()}`,
      isLiveStripe: false,
      message: 'Stripe test mode active (STRIPE_SECRET_KEY not set in .env.local). Orders can still be placed seamlessly.',
    });
  } catch (error: any) {
    console.error('Stripe Payment Intent Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to initialize Stripe payment.' },
      { status: 500 }
    );
  }
}
