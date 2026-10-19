export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { generateCertificatePDF } from '@/lib/pdf-service';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const certId = params.id;
    const cert = db.prepare(`
      SELECT * FROM certificates 
      WHERE id = ? OR certificate_number = ?
    `).get(certId, certId) as any;

    if (!cert) {
      return NextResponse.json({ success: false, error: 'Certificate not found' }, { status: 404 });
    }

    const doc = generateCertificatePDF(
      cert.recipient_name,
      cert.school_name,
      cert.course_title,
      cert.certificate_number,
      cert.score_percentage,
      cert.issued_date
    );

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${cert.certificate_number}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Certificate PDF API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
