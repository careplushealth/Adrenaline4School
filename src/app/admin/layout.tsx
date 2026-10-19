import type { Metadata } from 'next';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminAuthGate from '@/components/admin/AdminAuthGate';

export const metadata: Metadata = {
  title: 'Pharmacy & Operations Admin Portal — Adrenaline4Schools',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGate>
      <div className="flex min-h-screen bg-navy-950">
        <AdminSidebar />
        <main className="flex-1 ml-0 lg:ml-64 min-h-screen bg-slate-100 overflow-x-hidden">
          {children}
        </main>
      </div>
    </AdminAuthGate>
  );
}
