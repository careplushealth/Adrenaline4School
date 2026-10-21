import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20' as any,
      appInfo: {
        name: 'Adrenaline4Schools Portal',
        version: '1.0.0',
      },
    })
  : null;
