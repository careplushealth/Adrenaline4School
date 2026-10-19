import { jsPDF } from 'jspdf';
import { Invoice, Order } from './types';

export function generateInvoicePDF(invoice: Invoice, order?: Order): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Top header banner
  doc.setFillColor(15, 118, 110); // Brand teal
  doc.rect(0, 0, 210, 18, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('ADRENALINE4SCHOOLS — EMERGENCY PHARMACY SUPPLY & SAFETY PLATFORM', 14, 11);

  // Main Header
  doc.setTextColor(15, 23, 42); // Deep navy
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE / BACS PAYMENT REQUEST', 14, 32);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Adrenaline4Schools Ltd', 14, 38);
  doc.text('GPhC Registered Pharmacy Partner Network', 14, 43);
  doc.text('Company Reg: 14892014 | VAT No: GB 491 0284 12', 14, 48);
  doc.text('Email: finance@adrenaline4schools.co.uk | Tel: 0800 123 4567', 14, 53);

  // Invoice Details Box (Right aligned)
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(120, 26, 76, 32, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Number:', 124, 32);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.invoice_number, 160, 32);

  doc.setFont('helvetica', 'bold');
  doc.text('Issue Date:', 124, 38);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.issue_date, 160, 38);

  doc.setFont('helvetica', 'bold');
  doc.text('Due Date:', 124, 44);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.due_date, 160, 44);

  doc.setFont('helvetica', 'bold');
  doc.text('Order Ref:', 124, 50);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.order_reference || invoice.order_id, 160, 50);

  if (invoice.po_number) {
    doc.setFont('helvetica', 'bold');
    doc.text('Purchase Order:', 124, 55);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.po_number, 160, 55);
  }

  // School Bill To & Delivery Site
  doc.setFillColor(241, 245, 249);
  doc.rect(14, 64, 88, 26, 'F');
  doc.rect(108, 64, 88, 26, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 118, 110);
  doc.text('INVOICE TO (SCHOOL / MAT BILLING):', 18, 70);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(invoice.school_name || order?.billing_organisation_name || 'School Accounts', 18, 76);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(order?.billing_address_line1 || 'School Financial Services', 18, 81);
  doc.text(`${order?.billing_city || ''} ${order?.billing_postcode || ''}`, 18, 86);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 118, 110);
  doc.text('DELIVERY SITE (SCHOOL PREMISES):', 112, 70);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(order?.delivery_school_name || invoice.school_name || 'School Medical Room', 112, 76);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(order?.delivery_address_line1 || 'Main School Site', 112, 81);
  doc.text(`${order?.delivery_city || ''} ${order?.delivery_postcode || ''}`, 112, 86);

  // Line Items Table Header
  let y = 100;
  doc.setFillColor(15, 23, 42);
  doc.rect(14, y, 182, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('ITEM DESCRIPTION', 18, y + 5.5);
  doc.text('PACK SIZE', 100, y + 5.5);
  doc.text('QTY', 130, y + 5.5);
  doc.text('UNIT PRICE', 145, y + 5.5);
  doc.text('TOTAL (EX VAT)', 170, y + 5.5);

  // Table rows
  y += 8;
  const items = order?.items || [
    {
      product_name: 'Emergency Adrenaline Auto-Injectors (Supplied under Headteacher Requisition)',
      pack_size: 'Twin Pack (2 Pens)',
      quantity: 1,
      unit_price: invoice.subtotal,
      total_price: invoice.subtotal,
    },
  ];

  doc.setTextColor(15, 23, 42);
  items.forEach((item, index) => {
    const isEven = index % 2 === 0;
    if (isEven) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, 182, 9, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(item.product_name, 18, y + 6);
    doc.text(item.pack_size || 'Twin Pack', 100, y + 6);
    doc.text(item.quantity.toString(), 132, y + 6);
    doc.text(`£${item.unit_price.toFixed(2)}`, 147, y + 6);
    doc.text(`£${item.total_price.toFixed(2)}`, 172, y + 6);
    y += 9;
  });

  // Totals box
  y += 4;
  doc.setDrawColor(203, 213, 225);
  doc.line(120, y, 196, y);
  y += 6;

  doc.setFontSize(9);
  doc.text('Subtotal (Ex VAT):', 125, y);
  doc.text(`£${invoice.subtotal.toFixed(2)}`, 175, y);
  y += 6;

  doc.text('UK VAT (20%):', 125, y);
  doc.text(`£${invoice.vat_total.toFixed(2)}`, 175, y);
  y += 6;

  doc.text('Tracked Medical Courier:', 125, y);
  doc.text('FREE (£0.00)', 172, y);
  y += 6;

  doc.setFillColor(240, 253, 250);
  doc.setDrawColor(13, 148, 136);
  doc.roundedRect(120, y - 2, 76, 12, 1, 1, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 118, 110);
  doc.text('TOTAL AMOUNT DUE:', 123, y + 6);
  doc.text(`£${invoice.total_amount.toFixed(2)}`, 168, y + 6);

  // BACS Bank Transfer Instructions Box (Highlighted)
  const bacsY = y + 20;
  doc.setFillColor(240, 249, 255);
  doc.setDrawColor(2, 132, 199);
  doc.roundedRect(14, bacsY, 182, 42, 2, 2, 'FD');

  doc.setTextColor(2, 132, 199);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('BACS BANK TRANSFER REMITTANCE INSTRUCTIONS', 18, bacsY + 7);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Please transfer payment within 30 days of invoice date using the details below:', 18, bacsY + 14);

  doc.setFont('helvetica', 'bold');
  doc.text('Bank Name:', 18, bacsY + 22);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.bacs_bank_name || 'Barclays Bank UK PLC', 50, bacsY + 22);

  doc.setFont('helvetica', 'bold');
  doc.text('Account Name:', 18, bacsY + 28);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.bacs_account_name || 'Adrenaline4Schools Limited', 50, bacsY + 28);

  doc.setFont('helvetica', 'bold');
  doc.text('Sort Code:', 18, bacsY + 34);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.bacs_sort_code || '20-00-00', 50, bacsY + 34);

  doc.setFont('helvetica', 'bold');
  doc.text('Account Number:', 105, bacsY + 22);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.bacs_account_number || '83920184', 140, bacsY + 22);

  doc.setFont('helvetica', 'bold');
  doc.text('BACS Reference (MANDATORY):', 105, bacsY + 28);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 83, 9); // Amber bold
  doc.text(invoice.bacs_reference || invoice.invoice_number, 158, bacsY + 28);

  // Status Badge
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('Please email your BACS remittance advice note to: finance@adrenaline4schools.co.uk', 18, bacsY + 39);

  // Footer notes
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Terms: Payment due strictly within 30 days of invoice date. All emergency auto-injectors supplied subject to valid Headteacher Requisition.', 14, 280);
  doc.text('Adrenaline4Schools Ltd is registered in England & Wales. Dispensing Pharmacy GPhC Reg # 1092812.', 14, 284);

  return doc;
}

export function generateCertificatePDF(
  recipientName: string,
  schoolName: string,
  courseTitle: string,
  certificateNumber: string,
  scorePercentage: number,
  issuedDate: string
): jsPDF {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // Background ornamental border
  doc.setFillColor(250, 252, 255);
  doc.rect(0, 0, 297, 210, 'F');

  doc.setDrawColor(15, 118, 110);
  doc.setLineWidth(2);
  doc.rect(10, 10, 277, 190);

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.rect(13, 13, 271, 184);

  // Top Title
  doc.setTextColor(15, 118, 110);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('ADRENALINE4SCHOOLS ALLERGY SAFETY ACADEMY', 148.5, 30, { align: 'center' });

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFICATE OF ACHIEVEMENT', 148.5, 45, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('THIS IS PROUDLY PRESENTED TO', 148.5, 60, { align: 'center' });

  // Recipient
  doc.setTextColor(15, 118, 110);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text(recipientName, 148.5, 78, { align: 'center' });

  // School
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(`of ${schoolName}`, 148.5, 90, { align: 'center' });

  // Course completion text
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(11);
  doc.text('for demonstrating professional competence and successfully passing the examination in:', 148.5, 105, { align: 'center' });

  // Course Title
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(courseTitle, 148.5, 120, { align: 'center' });

  // Score & CPD
  doc.setFillColor(240, 253, 250);
  doc.setDrawColor(13, 148, 136);
  doc.roundedRect(68.5, 132, 160, 16, 2, 2, 'FD');
  doc.setTextColor(15, 118, 110);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Examination Score: ${scorePercentage}%  |  CPD Certified: 1 Hour  |  Status: PASSED`, 148.5, 142, { align: 'center' });

  // Footer signatures and seal
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Certificate No: ${certificateNumber}`, 30, 175);
  doc.text(`Date Issued: ${issuedDate}`, 30, 181);

  doc.text('Superintendent Pharmacist', 210, 175);
  doc.text('Adrenaline4Schools Clinical Governance', 210, 181);

  doc.setDrawColor(15, 23, 42);
  doc.line(205, 170, 265, 170);

  return doc;
}
