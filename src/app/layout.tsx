import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'Adrenaline4Schools — Emergency Adrenaline Pens & Training for UK Schools',
  description: 'Helping UK primary, secondary and multi-academy trust schools order emergency adrenaline auto-injectors (EpiPen, Jext), manage statutory Benedict\'s Law compliance, and automate expiry reminders.',
  keywords: 'emergency adrenaline schools, EpiPen for schools, Jext auto-injectors, Benedict\'s Law, school allergy policy, headteacher requisition, school anaphylaxis training',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <body className="font-sans min-h-screen flex flex-col bg-ivory text-forest-900 antialiased selection:bg-sage-600 selection:text-white">
        <CartProvider>
          <AppShell>{children}</AppShell>
        </CartProvider>
      </body>
    </html>
  );
}
