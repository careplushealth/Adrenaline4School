'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    // Admin routes have their own dedicated sidebar and zero public footer/navbar
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
