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
    { name: 'EpiPen® 300 micrograms (Pupils >30kg)', strength: '300mcg', quantity: 2 },
    { name: 'EpiPen® Junior 150 micrograms (Pupils 15-30kg)', strength: '150mcg', quantity: 2 },
  ],
}: RequisitionModalProps) {
  const [schoolName, setSchoolName] = useState(initialSchoolName);
  const [headteacher, setHeadteacher] = useState(initialHeadteacher);
  const [schoolAddress, setSchoolAddress] = useState('St. Mary\'s Road, Kensington');
  const [schoolCity, setSchoolCity] = useState('London');
  const [schoolPostcode, setSchoolPostcode] = useState('W8 4PT');
  const [schoolPhone, setSchoolPhone] = useState('0161 973 3552');
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Header Banner
    doc.setFillColor(12, 35, 64); // Deep Navy
    doc.rect(0, 0, 210, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('OFFICIAL HEADTEACHER REQUISITION FORM FOR EMERGENCY ADRENALINE AUTO-INJECTORS', 14, 13);

    // Title
    doc.setTextColor(12, 35, 64);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('SCHOOL REQUISITION ORDER', 14, 32);

    // School Details Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, 40, 182, 48, 2, 2, 'FD');

    doc.setFontSize(9);
    doc.setTextColor(9, 101, 86); // Pine Teal
    doc.setFont('helvetica', 'bold');
    doc.text('1. SCHOOL / EDUCATIONAL INSTITUTION DETAILS', 18, 47);

    doc.setTextColor(22, 35, 26);
    doc.setFontSize(8.5);

    doc.text('School Name:', 18, 55);
    doc.setFont('helvetica', 'normal');
    doc.text(schoolName, 55, 55);

    doc.setFont('helvetica', 'bold');
    doc.text('School Address:', 18, 62);
    doc.setFont('helvetica', 'normal');
    doc.text(`${schoolAddress}, ${schoolCity}`, 55, 62);

    doc.setFont('helvetica', 'bold');
    doc.text('Postcode:', 18, 69);
    doc.setFont('helvetica', 'normal');
    doc.text(schoolPostcode, 55, 69);

    doc.setFont('helvetica', 'bold');
    doc.text('Telephone Number:', 18, 76);
    doc.setFont('helvetica', 'normal');
    doc.text(schoolPhone, 55, 76);

    doc.setFont('helvetica', 'bold');
    doc.text('Headteacher / Principal:', 115, 55);
    doc.setFont('helvetica', 'normal');
    doc.text(headteacher, 155, 55);

    doc.setFont('helvetica', 'bold');
    doc.text('Date of Requisition:', 115, 62);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date().toLocaleDateString('en-GB'), 155, 62);

    // Requested Items Table Header
    doc.setFillColor(12, 35, 64);
    doc.rect(14, 96, 182, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('PRODUCT / DOSE SPECIFICATION', 18, 101.5);
    doc.text('STRENGTH', 120, 101.5);
    doc.text('QUANTITY', 165, 101.5);

    let y = 110;
    items.forEach((item) => {
      doc.setTextColor(22, 35, 26);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text(item.name, 18, y);
      doc.text(item.strength, 120, y);
      doc.text(`${item.quantity} Pen(s)`, 165, y);
      y += 8;
    });



    // Signatures Area — NO SCHOOL STAMP
    y += 12;
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, y, 182, 38);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(12, 35, 64);
    doc.text('2. AUTHORISED HEADTEACHER SIGNATURE', 18, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(22, 35, 26);
    doc.text('Signature of Headteacher / Principal: __________________________________________________', 18, y + 20);
    doc.text(`Print Full Name: ${headteacher}`, 18, y + 29);
    doc.text(`Date Signed: ________________________`, 125, y + 29);

    // Footer
    doc.setFontSize(7.5);
    doc.setTextColor(115, 125, 120);
    doc.text('Please sign this requisition and upload during checkout or email to: pharmacy@adrenaline4schools.co.uk', 14, 275);
    doc.text('Adrenaline4Schools | Clinical Supply in Partnership with UK GPhC Registered Dispensing Pharmacies', 14, 280);

    doc.save(`Headteacher-Requisition-${schoolName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
    setDownloaded(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-[28px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-black/[0.08] relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-[#09653d] hover:bg-black/[0.04] transition-colors apple-btn"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#09653d]/[0.08] text-[#09653d] flex items-center justify-center border border-[#09653d]/15 shadow-2xs">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1d1d1f] tracking-tight">Official Headteacher Requisition Form</h3>
            <p className="text-xs text-slate-500 font-sans">For statutory school supply of emergency pupil adrenaline pens</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5 font-sans">School Name</label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="e.g. St Mary's CE Primary School"
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] bg-[#f5f5f7] text-sm text-[#1d1d1f] focus:ring-2 focus:ring-[#09653d]/20 focus:border-[#09653d] focus:bg-white focus:outline-none transition-all font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5 font-sans">Headteacher / Principal Name</label>
              <input
                type="text"
                value={headteacher}
                onChange={(e) => setHeadteacher(e.target.value)}
                placeholder="e.g. Mrs. Eleanor Clarke"
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] bg-[#f5f5f7] text-sm text-[#1d1d1f] focus:ring-2 focus:ring-[#09653d]/20 focus:border-[#09653d] focus:bg-white focus:outline-none transition-all font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5 font-sans">School Address</label>
            <input
              type="text"
              value={schoolAddress}
              onChange={(e) => setSchoolAddress(e.target.value)}
              placeholder="e.g. St Mary's Road, High Street"
              className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] bg-[#f5f5f7] text-sm text-[#1d1d1f] focus:ring-2 focus:ring-[#09653d]/20 focus:border-[#09653d] focus:bg-white focus:outline-none transition-all font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5 font-sans">Town / City</label>
              <input
                type="text"
                value={schoolCity}
                onChange={(e) => setSchoolCity(e.target.value)}
                placeholder="e.g. London"
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] bg-[#f5f5f7] text-sm text-[#1d1d1f] focus:ring-2 focus:ring-[#09653d]/20 focus:border-[#09653d] focus:bg-white focus:outline-none transition-all font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5 font-sans">Postcode</label>
              <input
                type="text"
                value={schoolPostcode}
                onChange={(e) => setSchoolPostcode(e.target.value)}
                placeholder="e.g. W8 4PT"
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] bg-[#f5f5f7] text-sm text-[#1d1d1f] focus:ring-2 focus:ring-[#09653d]/20 focus:border-[#09653d] focus:bg-white focus:outline-none transition-all font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5 font-sans">School Phone Number</label>
              <input
                type="tel"
                value={schoolPhone}
                onChange={(e) => setSchoolPhone(e.target.value)}
                placeholder="e.g. 0161 973 3552"
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] bg-[#f5f5f7] text-sm text-[#1d1d1f] focus:ring-2 focus:ring-[#09653d]/20 focus:border-[#09653d] focus:bg-white focus:outline-none transition-all font-sans"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-black/[0.06]">
          <button
            onClick={handleDownloadPDF}
            className="flex-1 py-3.5 px-5 rounded-full bg-[#09653d] hover:bg-[#064e2e] text-white font-semibold text-sm shadow-xs flex items-center justify-center gap-2 transition-all apple-btn"
          >
            <Download className="w-4 h-4" />
            <span>Generate & Download Requisition PDF</span>
          </button>
          <button
            onClick={onClose}
            className="py-3.5 px-6 rounded-full border border-black/[0.08] hover:bg-[#f5f5f7] text-[#1d1d1f] font-semibold text-sm transition-colors apple-btn"
          >
            Close
          </button>
        </div>

        {downloaded && (
          <div className="mt-4 p-3.5 bg-[#09653d]/[0.08] border border-[#09653d]/15 rounded-2xl text-[#09653d] text-xs flex items-center gap-2 font-sans">
            <CheckCircle className="w-4 h-4 text-[#09653d] shrink-0" />
            <span>PDF downloaded successfully! Have your Headteacher sign it and upload it at checkout.</span>
          </div>
        )}
      </div>
    </div>
  );
}
