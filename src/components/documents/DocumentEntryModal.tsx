import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Calendar,
  Building2,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  KeyRound,
  FileCheck,
  HardDrive,
  Info,
  Check,
} from 'lucide-react';
import { DocumentItem } from '../../types';

interface DocumentEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentToEdit?: DocumentItem | null;
  onSave: (docData: {
    id?: string;
    approvalId?: string;
    approvalName?: string;
    name: string;
    category: string;
    fileType: string;
    size: string;
    documentNumber: string;
    issuingAuthority: string;
    issueDate: string;
    validUntil: string;
    extractedParameters?: Record<string, string>;
  }) => void;
}

const STANDARD_DOCUMENT_TEMPLATES: Record<string, {
  category: string;
  defaultNumber: string;
  defaultIssuer: string;
  defaultParams: Record<string, string>;
}> = {
  'Structural Stability Certificate by Chartered Structural Engineer': {
    category: 'Engineering Stability',
    defaultNumber: 'STR/PEB/2026/041',
    defaultIssuer: 'Er. M. K. Verma, Chartered Structural Assessor (MIE/14981)',
    defaultParams: {
      'Design Standard': 'IS 875 Part 3 (Wind Speed 47 m/s, Zone IV)',
      'Structural Steel Grade': 'E250 / E350 Structural Plate & Tubing',
      'PEB Roof Live Load': '0.75 kN/m² with seismic bracing',
    },
  },
  'Food Safety Blueprint & Water Potability Test Certificate': {
    category: 'Food Safety & Hygiene',
    defaultNumber: 'NABL/LAB/WTR/2026/8912',
    defaultIssuer: 'SGS India NABL Analytical Laboratories',
    defaultParams: {
      'Water Potability Standard': 'IS 10500:2012 Drinking Water Specs',
      'Microbiological Safety': 'Zero E. Coli & Coliform detected per 100ml',
      'Heavy Metals Analysis': 'Lead, Arsenic, Cadmium well within BDL (Below Detection Limit)',
    },
  },
  'Groundwater Extraction Hydrological Assessment Report': {
    category: 'Water Resources',
    defaultNumber: 'CGWA/HAJ/GEO/2026/102',
    defaultIssuer: 'NABET Empaneled Hydrogeological Assessor',
    defaultParams: {
      'Daily Extraction Permitted': '25 KLD through metered digital flow sensor',
      'Recharge Structures': '4 Artificial Rainwater Recharge Pits',
      'Aquifer Classification': 'Safe Semi-Confined Alluvial Aquifer',
    },
  },
  'Air Pollution Control Measures (APCM) & Boiler Stack Design': {
    category: 'Environmental Engineering',
    defaultNumber: 'APCM/STK/2026/B-15',
    defaultIssuer: 'Thermax Empaneled Clean Combustion Engineers',
    defaultParams: {
      'Boiler Rating': '1.5 TPH Agro-waste Briquette Fired',
      'Chimney Height': '30.5 Meters with isokinetic sampling port',
      'Particulate Emission Target': '< 50 mg/Nm³ with Multi-cyclone separator',
    },
  },
  'Effluent Treatment Plant (ETP 25 KLD) Engineering Schematic': {
    category: 'Environmental Engineering',
    defaultNumber: 'ETP-SCHEM-25KLD-REV3',
    defaultIssuer: 'CPCB Certified Environmental Engineers Consortium',
    defaultParams: {
      'Hydraulic Surge Capacity': '25 KLD peak allowance with 48h retention',
      'Filtration Methodology': 'Dual Media Sand + Activated Carbon + UV Disinfection',
      'Effluent Recycle': '100% Zero Liquid Discharge (ZLD) to greenbelt',
    },
  },
  'Capital Machinery Quotations & Vendor Proforma': {
    category: 'Financial Appraisal',
    defaultNumber: 'INV/PROFORMA/2026/M-90',
    defaultIssuer: 'Approved MSME Food Machinery Consortium',
    defaultParams: {
      'Indigenous Machinery': '₹3.65 Crores (Roasters, Grading Screens, Packaging)',
      'Imported Optical Sorter': '₹1.80 Crores (Laser Optical HS Code 84371000)',
      'Valuation Stamp': 'Chartered Engineer Certified Assessment Attached',
    },
  },
};

export const DocumentEntryModal: React.FC<DocumentEntryModalProps> = ({
  isOpen,
  onClose,
  documentToEdit,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Technical Specifications');
  const [documentNumber, setDocumentNumber] = useState('');
  const [issuingAuthority, setIssuingAuthority] = useState('');
  const [issueDate, setIssueDate] = useState('2026-09-01');
  const [validUntil, setValidUntil] = useState('2027-08-31');
  const [fileName, setFileName] = useState('statutory_compliance_scan.pdf');
  const [fileSize, setFileSize] = useState('3.8 MB');
  const [param1Key, setParam1Key] = useState('Statutory Standard');
  const [param1Val, setParam1Val] = useState('NBC 2016 / State Industrial Rules');
  const [param2Key, setParam2Key] = useState('Approved Capacity / Rating');
  const [param2Val, setParam2Val] = useState('Verified');
  const [certifiedDeclaration, setCertifiedDeclaration] = useState(true);
  const [fileAttached, setFileAttached] = useState(true);

  useEffect(() => {
    if (documentToEdit) {
      setName(documentToEdit.name);
      setCategory(documentToEdit.category);
      setDocumentNumber(documentToEdit.documentNumber || `REG/${Date.now().toString().slice(-6)}`);
      setIssuingAuthority(documentToEdit.issuingAuthority || 'Govt. Empaneled Competent Consultant');
      setIssueDate(documentToEdit.issueDate || '2026-09-01');
      setValidUntil(documentToEdit.validUntil || '2027-08-31');
      setFileName(documentToEdit.fileUrl || `${documentToEdit.name.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30)}_signed.pdf`);
      setFileSize(documentToEdit.size || '3.5 MB');

      if (documentToEdit.extractedParameters) {
        const entries = Object.entries(documentToEdit.extractedParameters);
        if (entries.length > 0) {
          setParam1Key(entries[0][0]);
          setParam1Val(entries[0][1]);
        }
        if (entries.length > 1) {
          setParam2Key(entries[1][0]);
          setParam2Val(entries[1][1]);
        }
      } else if (STANDARD_DOCUMENT_TEMPLATES[documentToEdit.name]) {
        const tmpl = STANDARD_DOCUMENT_TEMPLATES[documentToEdit.name];
        const entries = Object.entries(tmpl.defaultParams);
        if (entries.length > 0) {
          setParam1Key(entries[0][0]);
          setParam1Val(entries[0][1]);
        }
        if (entries.length > 1) {
          setParam2Key(entries[1][0]);
          setParam2Val(entries[1][1]);
        }
      }
    } else {
      setName('');
      setCategory('Technical Specifications');
      setDocumentNumber(`REG/${Date.now().toString().slice(-6)}`);
      setIssuingAuthority('Govt. Empaneled Competent Consultant');
      setIssueDate('2026-09-01');
      setValidUntil('2027-08-31');
      setFileName('new_compliance_artifact.pdf');
      setFileSize('2.9 MB');
    }
  }, [documentToEdit, isOpen]);

  if (!isOpen) return null;

  const handleApplyTemplate = (selectedDocName: string) => {
    setName(selectedDocName);
    const tmpl = STANDARD_DOCUMENT_TEMPLATES[selectedDocName];
    if (tmpl) {
      setCategory(tmpl.category);
      setDocumentNumber(tmpl.defaultNumber);
      setIssuingAuthority(tmpl.defaultIssuer);
      setFileName(`${selectedDocName.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30)}_signed.pdf`);
      setFileSize('4.2 MB');
      const entries = Object.entries(tmpl.defaultParams);
      if (entries.length > 0) {
        setParam1Key(entries[0][0]);
        setParam1Val(entries[0][1]);
      }
      if (entries.length > 1) {
        setParam2Key(entries[1][0]);
        setParam2Val(entries[1][1]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const extractedParameters: Record<string, string> = {};
    if (param1Key.trim() && param1Val.trim()) extractedParameters[param1Key.trim()] = param1Val.trim();
    if (param2Key.trim() && param2Val.trim()) extractedParameters[param2Key.trim()] = param2Val.trim();

    onSave({
      id: documentToEdit?.id,
      approvalId: documentToEdit?.approvalId,
      approvalName: documentToEdit?.approvalName,
      name,
      category,
      fileType: fileName.endsWith('.dwg') ? 'CAD' : 'PDF',
      size: fileSize,
      documentNumber,
      issuingAuthority,
      issueDate,
      validUntil,
      extractedParameters,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-50 via-teal-50/20 to-blue-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-600 text-white">
              <FileCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                {documentToEdit ? 'Fill Document Particulars & Attach File' : 'Upload New Statutory Artifact'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Single Window Industrial Compliance Vault · Verification for Official Scrutiny
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Quick Template Picker for Demo */}
          <div className="p-3 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[11px] text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Statutory Industrial Document Templates (Quick Autofill):</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(STANDARD_DOCUMENT_TEMPLATES).map((tmplName) => (
                <button
                  key={tmplName}
                  type="button"
                  onClick={() => handleApplyTemplate(tmplName)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                    name === tmplName
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-500'
                  }`}
                >
                  {tmplName.length > 32 ? tmplName.substring(0, 32) + '...' : tmplName}
                </button>
              ))}
            </div>
          </div>

          {/* Document Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Document Title / Compliance Artifact *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Structural Stability Certificate"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Statutory Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option>Technical Specifications</option>
                <option>Corporate Identity</option>
                <option>Land & Title</option>
                <option>Environmental Engineering</option>
                <option>Safety & Architecture</option>
                <option>Engineering Stability</option>
                <option>Electrical Engineering</option>
                <option>Water Resources</option>
                <option>Food Safety & Hygiene</option>
                <option>Financial Appraisal</option>
              </select>
            </div>
          </div>

          {/* Reference Number & Issuing Authority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Document / Certificate Reference No. *
              </label>
              <input
                type="text"
                required
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder="e.g. STR/PEB/2026/041 or ROC-BR-4921"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Issuing Authority / Certified Consultant *
              </label>
              <input
                type="text"
                required
                value={issuingAuthority}
                onChange={(e) => setIssuingAuthority(e.target.value)}
                placeholder="e.g. Chartered Structural Assessor / BIADA"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Issue Date & Validity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Date of Issuance / Stamp *
              </label>
              <input
                type="date"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Validity / Expiry Date
              </label>
              <input
                type="text"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                placeholder="e.g. 2027-08-31 or Permanent"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* File Upload Section */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700 dark:text-slate-300">
              Attached Digital Document File (PDF / CAD / Image) *
            </label>
            <div className="p-4 rounded-2xl border-2 border-dashed border-teal-500/50 bg-teal-50/20 dark:bg-teal-950/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-teal-600 text-white">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{fileName}</span>
                    <span className="text-[10px] text-teal-600 font-normal">({fileSize})</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    PDF Document with Embedded Digital Signature (e-Sign) & QR Seal
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer shadow-xs transition-colors">
                  <span>Browse File</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.dwg,.jpg,.png"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFileName(e.target.files[0].name);
                        setFileSize(`${(e.target.files[0].size / (1024 * 1024)).toFixed(1)} MB`);
                        setFileAttached(true);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Key Extracted Technical Parameters */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Key Extracted Technical Parameters for Single Window Audit:
              </span>
              <span className="text-[10px] text-teal-600 font-semibold">AI Indexed</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="Metric / Key 1"
                  value={param1Key}
                  onChange={(e) => setParam1Key(e.target.value)}
                  className="w-1/2 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px]"
                />
                <input
                  type="text"
                  placeholder="Value 1"
                  value={param1Val}
                  onChange={(e) => setParam1Val(e.target.value)}
                  className="w-1/2 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-semibold"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="Metric / Key 2"
                  value={param2Key}
                  onChange={(e) => setParam2Key(e.target.value)}
                  className="w-1/2 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px]"
                />
                <input
                  type="text"
                  placeholder="Value 2"
                  value={param2Val}
                  onChange={(e) => setParam2Val(e.target.value)}
                  className="w-1/2 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Self Declaration Checkbox */}
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="certCheck"
              required
              checked={certifiedDeclaration}
              onChange={(e) => setCertifiedDeclaration(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <label htmlFor="certCheck" className="text-[11px] text-slate-500 leading-tight">
              I certify as authorized signatory that this statutory compliance document is authentic, duly sealed by the accredited authority/consultant, and correctly reflects the industrial specifications of Mithila Foods Pvt. Ltd.
            </label>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-md flex items-center gap-1.5 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Validate & Save to Single Window Vault</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
