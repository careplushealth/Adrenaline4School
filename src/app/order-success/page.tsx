'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function OrderSuccessRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    router.replace(`/order-confirmation${query ? `?${query}` : ''}`);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#f8fbfb] flex items-center justify-center font-sans">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#096556] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Redirecting to order confirmation...</p>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8fbfb]" />}>
      <OrderSuccessRedirect />
    </Suspense>
  );
}
