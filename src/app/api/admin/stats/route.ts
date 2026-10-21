export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const totalOrders = ((await db.prepare('SELECT count(*) as count FROM orders').get()) as any)?.count || 0;
    const awaitingDocs = ((await db.prepare("SELECT count(*) as count FROM orders WHERE documentation_status = 'pending'").get()) as any)?.count || 0;
    const awaitingPharmacy = ((await db.prepare("SELECT count(*) as count FROM orders WHERE pharmacy_review_status = 'pending' AND payment_status = 'paid'").get()) as any)?.count || 0;
    const awaitingPayment = ((await db.prepare("SELECT count(*) as count FROM orders WHERE payment_status = 'pending'").get()) as any)?.count || 0;
    const readyForFulfilment = ((await db.prepare("SELECT count(*) as count FROM orders WHERE order_status = 'approved_for_fulfilment'").get()) as any)?.count || 0;
    const dispatched = ((await db.prepare("SELECT count(*) as count FROM orders WHERE order_status = 'dispatched'").get()) as any)?.count || 0;
    const delivered = ((await db.prepare("SELECT count(*) as count FROM orders WHERE order_status = 'delivered'").get()) as any)?.count || 0;

    const outstandingInvoices = ((await db.prepare("SELECT count(*) as count, sum(total_amount - amount_paid) as balance FROM invoices WHERE status = 'issued'").get()) as any) || { count: 0, balance: 0 };
    const overdueInvoices = ((await db.prepare("SELECT count(*) as count FROM invoices WHERE status = 'issued' AND due_date < CURRENT_DATE").get()) as any)?.count || 0;
    const totalRevenue = ((await db.prepare("SELECT sum(amount_paid) as revenue FROM invoices").get()) as any)?.revenue || 0;

    const approachingExpiry = ((await db.prepare(`
      SELECT count(*) as count FROM school_supply_records 
      WHERE expiry_date <= CURRENT_DATE + INTERVAL '3 months' AND status != 'replaced'
    `).get()) as any)?.count || 0;

    const pendingReminders = ((await db.prepare("SELECT count(*) as count FROM expiry_reminders WHERE status = 'pending'").get()) as any)?.count || 0;
    const sentReminders = ((await db.prepare("SELECT count(*) as count FROM expiry_reminders WHERE status = 'sent'").get()) as any)?.count || 0;

    const totalSchools = ((await db.prepare('SELECT count(*) as count FROM schools').get()) as any)?.count || 0;
    const totalOrganisations = ((await db.prepare('SELECT count(*) as count FROM organisations').get()) as any)?.count || 0;
    const totalCompletions = ((await db.prepare("SELECT count(*) as count FROM training_enrolments WHERE passed = 1").get()) as any)?.count || 0;

    // Recent orders
    const recentOrders = await db.prepare(`
      SELECT o.*, s.name as school_name 
      FROM orders o
      JOIN schools s ON o.school_id = s.id
      ORDER BY o.created_at DESC LIMIT 5
    `).all();

    // Expiring supplies list
    const expiringSupplies = await db.prepare(`
      SELECT 
        sup.*, 
        s.name as school_name, 
        p.name as product_name,
        p.strength,
        (CAST(sup.expiry_date AS DATE) - CURRENT_DATE) as days_remaining
      FROM school_supply_records sup
      JOIN schools s ON sup.school_id = s.id
      JOIN products p ON sup.product_id = p.id
      WHERE sup.status != 'replaced'
      ORDER BY sup.expiry_date ASC LIMIT 5
    `).all();

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders,
        awaitingDocs,
        awaitingPharmacy,
        awaitingPayment,
        readyForFulfilment,
        dispatched,
        delivered,
        outstandingInvoicesCount: outstandingInvoices.count,
        outstandingInvoicesBalance: outstandingInvoices.balance || 0,
        overdueInvoices,
        totalRevenue,
        approachingExpiry,
        pendingReminders,
        sentReminders,
        totalSchools,
        totalOrganisations,
        totalCompletions,
      },
      recentOrders,
      expiringSupplies,
    });
  } catch (error: any) {
    console.error('API GET /admin/stats error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
