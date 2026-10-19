export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { sendEmail } from '@/lib/email-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, schoolName, category, orderReference, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: 'Please provide name, email, and message' }, { status: 400 });
    }

    const id = `contact-${Date.now()}`;
    db.prepare(`
      INSERT INTO contact_submissions (id, name, email, school_name, category, order_reference, message)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, email, schoolName || null, category || 'General Enquiry', orderReference || null, message);

    // Send confirmation email
    sendEmail({
      to: email,
      subject: `Thank you for contacting Adrenaline4Schools [Ref: ${id}]`,
      templateType: 'contact_acknowledgement',
      relatedEntityType: 'contact',
      relatedEntityId: id,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; padding: 20px;">
          <h3 style="color: #0f766e;">We have received your enquiry</h3>
          <p>Dear ${name},</p>
          <p>Thank you for getting in touch regarding <strong>${schoolName || 'your school'}</strong>. Our UK school allergy support team has received your message and will respond within 1 business day.</p>
          <p>Category: <strong>${category}</strong></p>
          ${orderReference ? `<p>Order Reference: <strong>${orderReference}</strong></p>` : ''}
          <div style="background: #f8fafc; padding: 12px; border-left: 3px solid #0f766e; margin: 15px 0;">
            ${message}
          </div>
          <p>Adrenaline4Schools Support Team</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: 'Message received successfully', submissionId: id });
  } catch (error: any) {
    console.error('API /contact error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const submissions = db.prepare('SELECT * FROM contact_submissions ORDER BY created_at DESC').all();
    return NextResponse.json({ success: true, submissions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
