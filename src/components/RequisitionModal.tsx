'use client';

import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { FileText, Download, CheckCircle, X } from 'lucide-react';

interface RequisitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSchoolName?: string;
  initialHeadteacher?: string;
  items?: Array<{ name: string; strength: string; quantity: number }>;
}

export default function RequisitionModal({
  isOpen,
  onClose,
  initialSchoolName = "St. Mary's CE Primary School",
  initialHeadteacher = 'Mrs. Eleanor Clarke',
  items = [
    { name: 'EpiPen® 300 micrograms (Adult / Child >30kg)', strength: '300mcg', quantity: 1 },
    { name: 'EpiPen® Junior 150 micrograms (Child 15-30kg)', strength: '150mcg', quantity: 1 },
  ],
}: RequisitionModalProps) {
  const [schoolName, setSchoolName] = useState(initialSchoolName);
  const [headteacher, setHeadteacher] = useState(initialHeadteacher);
  const [schoolUrn, setSchoolUrn] = useState('102941');
  const [postcode, setPostcode] = useState('W8 4PT');
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Header
    doc.setFillColor(35, 60, 48); // Deep Forest
    doc.rect(0, 0, 210, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('OFFICIAL HEADTEACHER REQUISITION FORM FOR EMERGENCY ADRENALINE AUTO-INJECTORS', 14, 13);

    // Statutory Guidance Notice
    doc.setTextColor(22, 35, 26);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('SCHOOL REQUISITION ORDER', 14, 32);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 80);
    doc.text('Issued pursuant to The Human Medicines (Amendment) Regulations 2017 (SI 2017/715).', 14, 38);
    doc.text('This order allows schools to obtain emergency adrenaline auto-injectors (AAIs) without named prescriptions.', 14, 43);

    // School Details Box
    doc.setFillColor(250, 248, 245);
    doc.setDrawColor(215, 220, 215);
    doc.roundedRect(14, 48, 182, 38, 2, 2, 'FD');

    doc.setFontSize(9);
    doc.setTextColor(35, 60, 48);
    doc.setFont('helvetica', 'bold');
    doc.text('1. SCHOOL / EDUCATIONAL INSTITUTION DETAILS', 18, 55);

    doc.setTextColor(22, 35, 26);
    doc.setFontSize(9);
    doc.text('School Name:', 18, 63);
    doc.setFont('helvetica', 'normal');
    doc.text(schoolName, 55, 63);

    doc.setFont('helvetica', 'bold');
    doc.text('DfE URN Number:', 18, 70);
    doc.setFont('helvetica', 'normal');
    doc.text(schoolUrn, 55, 70);

    doc.setFont('helvetica', 'bold');
    doc.text('School Postcode:', 18, 77);
    doc.setFont('helvetica', 'normal');
    doc.text(postcode, 55, 77);

    doc.setFont('helvetica', 'bold');
    doc.text('Headteacher / Principal:', 110, 63);
    doc.setFont('helvetica', 'normal');
    doc.text(headteacher, 155, 63);

    doc.setFont('helvetica', 'bold');
    doc.text('Date of Requisition:', 110, 70);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date().toLocaleDateString('en-GB'), 155, 70);

    // Requested Items Table
    doc.setFillColor(22, 35, 26);
    doc.rect(14, 94, 182, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5);
    doc.text('PRODUCT / STRENGTH', 18, 99.5);
    doc.text('DOSE SPECIFICATION', 110, 99.5);
    doc.text('QTY (TWIN PACKS)', 160, 99.5);

    let y = 108;
    items.forEach((item) => {
      doc.setTextColor(22, 35, 26);
      doc.setFont('helvetica', 'normal');
      doc.text(item.name, 18, y);
      doc.text(item.strength, 110, y);
      doc.text(`${item.quantity} Pack(s)`, 160, y);
      y += 8;
    });

    // Declaration Box
    y += 4;
    doc.setFillColor(250, 248, 245);
    doc.setDrawColor(215, 220, 215);
    doc.roundedRect(14, y, 182, 52, 2, 2, 'FD');

    doc.setFontSize(9);
    doc.setTextColor(35, 60, 48);
    doc.setFont('helvetica', 'bold');
    doc.text('2. HEADTEACHER DECLARATION & STATUTORY UNDERTAKING', 18, y + 8);

    doc.setTextColor(22, 35, 26);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const declaration = 
      "I hereby requisition the above adrenaline auto-injectors on behalf of the named school.\n" +
      "I confirm that:\n" +
      "• The emergency adrenaline auto-injectors are to be held as spare stock for use in an emergency on pupils at risk of anaphylaxis.\n" +
      "• The school maintains an emergency allergy protocol and allergy register in compliance with Department of Health guidance.\n" +
      "• Storage arrangements are in place to ensure pens are safely kept at room temperature (below 25°C) and accessible to trained staff.\n" +
      "• I understand that all supplies are subject to verification and clinical dispensing by a GPhC registered pharmacy.";
    
    doc.text(declaration, 18, y + 16);

    // Signatures Area
    y += 58;
    doc.setDrawColor(215, 220, 215);
    doc.rect(14, y, 182, 45);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 35, 26);
    doc.text('3. AUTHORISED SIGNATURE', 18, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.text('Signature of Headteacher / Principal: ___________________________________', 18, y + 22);
    doc.text(`Print Full Name: ${headteacher}`, 18, y + 32);
    doc.text(`Date Signed: ________________________`, 120, y + 32);

    doc.text('School Stamp (if available):', 120, y + 14);
    doc.setDrawColor(226, 232, 240);
    doc.rect(120, y + 17, 45, 18);

    // Footer
    doc.setFontSize(7.5);
    doc.setTextColor(115, 125, 120);
    doc.text('Please sign this form and upload it during checkout or email to: pharmacy@adrenaline4schools.co.uk', 14, 280);
    doc.text('Adrenaline4Schools | In Partnership with GPhC Registered Pharmacy Network', 14, 285);

    doc.save(`Headteacher-Requisition-${schoolName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
    setDownloaded(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0c2340]/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-[#0c2340] hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#e6f5f1] text-[#096556] flex items-center justify-center border border-[#c6eee3]">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#0c2340]">Official Headteacher Requisition Form</h3>
            <p className="text-xs text-slate-500 font-sans">UK Human Medicines (Amendment) Regulations 2017 compliant</p>
          </div>
        </div>

        <div className="bg-[#f0faf7] border border-[#c6eee3] rounded-2xl p-4 text-xs text-[#0c2340] mb-6 space-y-1 font-sans">
          <p className="font-bold flex items-center gap-1.5 text-[#096556]">
            <CheckCircle className="w-4 h-4 text-[#096556]" />
            UK Statutory Requirement
          </p>
          <p className="text-slate-600 leading-relaxed">
            To supply emergency adrenaline auto-injectors to a school without individual pupil prescriptions, our GPhC registered pharmacy must receive an order signed by the Headteacher or Principal.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0c2340] mb-1.5">School Name</label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#0c2340] focus:ring-1 focus:ring-[#096556] focus:border-[#096556] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c2340] mb-1.5">Headteacher / Principal Name</label>
              <input
                type="text"
                value={headteacher}
                onChange={(e) => setHeadteacher(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#0c2340] focus:ring-1 focus:ring-[#096556] focus:border-[#096556] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0c2340] mb-1.5">DfE Unique Reference Number (URN)</label>
              <input
                type="text"
                value={schoolUrn}
                onChange={(e) => setSchoolUrn(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#0c2340] focus:ring-1 focus:ring-[#096556] focus:border-[#096556] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0c2340] mb-1.5">School Postcode</label>
              <input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#0c2340] focus:ring-1 focus:ring-[#096556] focus:border-[#096556] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={handleDownloadPDF}
            className="flex-1 py-3 px-5 rounded-full bg-[#096556] hover:bg-[#075145] text-white font-semibold text-sm shadow-xs flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Generate & Download Signed PDF Form</span>
          </button>
          <button
            onClick={onClose}
            className="py-3 px-6 rounded-full border border-slate-300 hover:bg-slate-50 text-[#0c2340] font-semibold text-sm transition-colors"
          >
            Close
          </button>
        </div>

        {downloaded && (
          <div className="mt-4 p-3.5 bg-[#e6f5f1] border border-[#c6eee3] rounded-2xl text-[#096556] text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#096556] shrink-0" />
            <span>PDF downloaded! Have your Headteacher sign it and upload it at checkout or email it to our pharmacy team.</span>
          </div>
        )}
      </div>
    </div>
  );
}
