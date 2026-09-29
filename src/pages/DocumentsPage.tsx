import React, { useState } from 'react';
import {
  FolderOpen,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileQuestion,
  FileX,
  FileText,
  Sparkles,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Check,
  Info,
  ShieldAlert,
  ArrowRight,
  LayoutGrid,
  List,
  FileCheck,
  Plus,
  Building2,
  Calendar,
  KeyRound,
  Download,
  Edit3,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DocumentItem } from '../types';
import { aiService, AIDocumentValidationResult } from '../services/aiService';
import { DocumentEntryModal } from '../components/documents/DocumentEntryModal';

interface StatutoryRequirementItem {
  key: string;
  name: string;
  category: string;
  department: string;
  description: string;
  defaultNumber: string;
  defaultIssuer: string;
  params: Record<string, string>;
}

const STATUTORY_REQUIREMENTS_LIST: StatutoryRequirementItem[] = [
  {
    key: 'land_deed',
    name: 'BIADA Industrial Plot Allotment & Registered Lease Deed',
    category: 'Land & Title',
    department: 'Land / Revenue (BIADA)',
    description: 'Statutory 90-year registered lease deed with demarcation coordinates for Plot C-14 to C-16, Hajipur.',
    defaultNumber: 'BIADA/HAJ/2026/L-4412',
    defaultIssuer: 'Bihar Industrial Area Development Authority (BIADA), Patna',
    params: { 'Allotted Area': '4,500 Sq. Meters', 'Lease Period': '90 Years', 'Industrial Zone': 'Phase-II BIADA Hajipur' },
  },
  {
    key: 'structural',
    name: 'Structural Stability Certificate by Chartered Structural Engineer',
    category: 'Engineering Stability',
    department: 'Factory / Labour',
    description: 'IS 875 & IS 1893 seismic stability certificate for PEB manufacturing sheds, processing floor, and machinery foundations.',
    defaultNumber: 'STR/PEB/2026/041',
    defaultIssuer: 'Er. M. K. Verma, Chartered Structural Assessor (MIE/14981)',
    params: { 'Design Standard': 'IS 875 Part 3 (Wind Speed 47 m/s)', 'Live Load': '0.75 kN/m² with seismic bracing' },
  },
  {
    key: 'etp',
    name: 'Effluent Treatment Plant (ETP 25 KLD) Engineering Schematic',
    category: 'Environmental Engineering',
    department: 'Pollution Control (BSPCB)',
    description: 'Detailed civil schematic, dual-media filtration, hydraulic balance, and zero liquid discharge greenbelt recycling.',
    defaultNumber: 'ETP-SCHEM-25KLD-REV3',
    defaultIssuer: 'CPCB Certified Environmental Engineers Consortium',
    params: { 'Hydraulic Surge': '25 KLD Peak Allowance', 'Filtration': 'Dual Media Sand + Activated Carbon + UV', 'ZLD Target': '100% Greenbelt Recycle' },
  },
  {
    key: 'apcm',
    name: 'Air Pollution Control Measures (APCM) & Boiler Stack Design',
    category: 'Environmental Engineering',
    department: 'Pollution Control (BSPCB)',
    description: 'Boiler stack height calculation, multi-cyclone dust collector, and isokinetic sampling ports for particulate emissions.',
    defaultNumber: 'APCM/STK/2026/B-15',
    defaultIssuer: 'Thermax Empaneled Clean Combustion Engineers',
    params: { 'Boiler Rating': '1.5 TPH Agro-waste Briquette', 'Chimney Height': '30.5 Meters', 'Particulate Emission': '< 50 mg/Nm³' },
  },
  {
    key: 'fire',
    name: 'Fire Fighting Ring Main Hydraulic Blueprint & Evacuation Plan',
    category: 'Safety & Architecture',
    department: 'Fire & Emergency',
    description: 'High-pressure hydrant ring layout, overhead dedicated 100 kL static water tank, and multi-point emergency exits.',
    defaultNumber: 'FIRE/HYD/2026/HAJ-09',
    defaultIssuer: 'Bihar Fire Services Approved Safety Architect',
    params: { 'Static Water Tank': '100,000 Litres Dedicated', 'Hydrant Pressure': '3.5 kg/cm² at remotest point', 'Egress Routes': '4 Two-Hour Fire Rated Doors' },
  },
  {
    key: 'power',
    name: '11kV HT Power Load Feasibility Sanction & Substation Blueprint',
    category: 'Electrical Engineering',
    department: 'Electricity (SBPDCL)',
    description: 'Dedicated 11kV feeder line tapping feasibility, 200 kVA step-down transformer layout, and lightning arrestor earthing pit layout.',
    defaultNumber: 'SBPDCL/HT/150KVA/2026/781',
    defaultIssuer: 'South Bihar Power Distribution Company Ltd., Hajipur Electric Supply Circle',
    params: { 'Sanctioned Connected Load': '150 kVA / 135 kW', 'Transformer Capacity': '200 kVA 11/0.433 kV', 'Substation Enclosure': 'Plinth Mounted with Earthing Pit' },
  },
  {
    key: 'water',
    name: 'Food Safety Blueprint & Water Potability Test Certificate',
    category: 'Food Safety & Hygiene',
    department: 'Food Safety (FSSAI)',
    description: 'NABL certified chemical and microbiological laboratory report certifying drinking water compliance to IS 10500:2012.',
    defaultNumber: 'NABL/LAB/WTR/2026/8912',
    defaultIssuer: 'SGS India NABL Analytical Laboratories',
    params: { 'Water Potability Standard': 'IS 10500:2012 Drinking Water Specs', 'Microbiological': 'Zero E. Coli & Coliform per 100ml', 'Heavy Metals': 'Below Detection Limit (BDL)' },
  },
  {
    key: 'dpr',
    name: 'Capital Machinery Quotations & Techno-Economic DPR',
    category: 'Financial Appraisal',
    department: 'MSME Support / Banks',
    description: 'Detailed project report with machinery invoices, vendor proformas, and Chartered Engineer valuation certificate for bank appraisal.',
    defaultNumber: 'INV/PROFORMA/2026/M-90',
    defaultIssuer: 'Approved MSME Food Machinery Consortium',
    params: { 'Machinery Investment': '₹3.65 Crores (Indigenous) + ₹1.80 Cr (Optical)', 'CE Valuation': 'Certified Valuation Attached' },
  },
];

export const DocumentsPage: React.FC = () => {
  const { currentProject, documents, uploadDocument, resolveDocumentIssue } = useApp();

  const [activeTab, setActiveTab] = useState<'filing' | 'vault'>('filing');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [entryModalOpen, setEntryModalOpen] = useState(false);
  const [selectedDocToEdit, setSelectedDocToEdit] = useState<DocumentItem | null>(null);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<DocumentItem | null>(null);
  const [preValidating, setPreValidating] = useState(false);
  const [activeAIReport, setActiveAIReport] = useState<AIDocumentValidationResult | null>(null);

  // In-page quick submission form state
  const [quickTitle, setQuickTitle] = useState('');
  const [quickCategory, setQuickCategory] = useState('Technical Specifications');
  const [quickDocNumber, setQuickDocNumber] = useState('');
  const [quickIssuer, setQuickIssuer] = useState('');
  const [quickFileName, setQuickFileName] = useState('compliance_certificate.pdf');
  const [quickFileSize, setQuickFileSize] = useState('3.2 MB');
  const [quickSuccessMsg, setQuickSuccessMsg] = useState<string | null>(null);

  const filteredDocs = documents.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.documentNumber && d.documentNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.issuingAuthority && d.issuingAuthority.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterStatus === 'ALL' || d.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const validCount = documents.filter((d) => d.status === 'VALID').length;
  const attentionCount = documents.filter((d) => d.status === 'NEEDS_ATTENTION').length;
  const missingCount = documents.filter((d) => d.status === 'MISSING').length;

  const handleRunFullPreValidation = async () => {
    setPreValidating(true);
    try {
      const sampleDoc = documents.find((d) => d.status === 'NEEDS_ATTENTION') || documents[0];
      const res = await aiService.validateDocument(sampleDoc.name, sampleDoc.category, {
        projectName: currentProject.name,
        investmentCr: currentProject.investmentCr,
      });
      setActiveAIReport(res);
    } catch (e) {
      console.error(e);
    } finally {
      setPreValidating(false);
    }
  };

  const handleQuickFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    uploadDocument({
      name: quickTitle.trim(),
      category: quickCategory,
      documentNumber: quickDocNumber.trim() || `DOC/2026/${Math.floor(1000 + Math.random() * 9000)}`,
      issuingAuthority: quickIssuer.trim() || 'Competent Registered Authority',
      issueDate: new Date().toISOString().split('T')[0],
      validUntil: '2027-12-31',
      fileType: quickFileName.endsWith('.dwg') ? 'CAD' : 'PDF',
      size: quickFileSize,
      extractedParameters: {
        'Filing Timestamp': new Date().toLocaleString(),
        'Verification Status': 'Digitally Stamped & Verified',
      },
    });

    setQuickSuccessMsg(`दस्तावेज़ "${quickTitle}" सफलतापूर्वक भर दिया गया और सिस्टम में अपलोड हो गया!`);
    setQuickTitle('');
    setQuickDocNumber('');
    setQuickIssuer('');
    setTimeout(() => setQuickSuccessMsg(null), 4000);
  };

  const handleOpenAutofillFromRequirement = (req: typeof STATUTORY_REQUIREMENTS_LIST[0]) => {
    setSelectedDocToEdit({
      id: '',
      projectId: currentProject.id,
      name: req.name,
      category: req.category,
      documentNumber: req.defaultNumber,
      issuingAuthority: req.defaultIssuer,
      issueDate: '2026-09-01',
      validUntil: '2027-08-31',
      fileType: 'PDF',
      size: '3.6 MB',
      status: 'VALID',
      uploadedAt: new Date().toISOString(),
      validationFindings: ['Digital verification stamp verified', 'IS Standards conformity confirmed'],
      extractedParameters: req.params,
      confidence: 96,
    });
    setEntryModalOpen(true);
  };

  const handleDirectSubmitRequirement = (req: typeof STATUTORY_REQUIREMENTS_LIST[0]) => {
    uploadDocument({
      name: req.name,
      category: req.category,
      documentNumber: req.defaultNumber,
      issuingAuthority: req.defaultIssuer,
      issueDate: '2026-09-01',
      validUntil: '2027-08-31',
      fileType: 'PDF',
      size: '3.9 MB',
      extractedParameters: req.params,
    });
    setQuickSuccessMsg(`प्रमाणित दस्तावेज़ "${req.name}" सफलतापूर्वक दर्ज व अपलोड कर दिया गया!`);
    setTimeout(() => setQuickSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              दस्तावेज़ फाइलिंग एवं अपलोड केंद्र (Document Filing & Vault)
            </h1>
            <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
              Single Window Compliance Vault
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            यूनिट: <strong>{currentProject.name}</strong> ({currentProject.promoterName}) · प्लॉट: {currentProject.plotNumber || 'Plot C-14 to C-16, BIADA Hajipur'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRunFullPreValidation}
            disabled={preValidating}
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
          >
            {preValidating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Validating Artifacts...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run AI Pre-Validation</span>
              </>
            )}
          </button>
          <button
            onClick={() => {
              setSelectedDocToEdit(null);
              setEntryModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ नया दस्तावेज़ भरें और अपलोड करें</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {quickSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5 font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{quickSuccessMsg}</span>
          </div>
          <button
            onClick={() => setQuickSuccessMsg(null)}
            className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
          >
            ✕ बंद करें
          </button>
        </div>
      )}

      {/* Main Section Mode Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('filing')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'filing'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>दस्तावेज़ भरने एवं अपलोड करने का केंद्र (Document Filing Desk)</span>
        </button>

        <button
          onClick={() => setActiveTab('vault')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'vault'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span>अपलोड किए गए दस्तावेज़ एवं ऑडिट ({documents.length} Files)</span>
        </button>
      </div>

      {/* TAB 1: FILING & UPLOAD CENTER */}
      {activeTab === 'filing' && (
        <div className="space-y-6">
          {/* Quick Filing Form Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-teal-600" />
                  <span>दस्तावेज़ विवरण भरें और फ़ाइल जोड़ें (Fill Document Particulars & Attach File)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  यहाँ से आप किसी भी विभाग के लिए अनिवार्य दस्तावेज़ की संख्या, जारीकर्ता प्राधिकारी, वैधता व फाइल अपलोड कर सकते हैं।
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedDocToEdit(null);
                  setEntryModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl border border-teal-500 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>विस्तृत फॉर्म में भरें (Open Advanced Modal Form)</span>
              </button>
            </div>

            <form onSubmit={handleQuickFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    दस्तावेज़ का नाम / शीर्षक (Document Title) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. ETP 25 KLD Civil Blueprint, Fire Hydrant Plan, Land Possession Deed"
                    value={quickTitle}
                    onChange={(e) => setQuickTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    विभाग / श्रेणी (Statutory Category) *
                  </label>
                  <select
                    value={quickCategory}
                    onChange={(e) => setQuickCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                  >
                    <option>Technical Specifications</option>
                    <option>Land & Title</option>
                    <option>Environmental Engineering</option>
                    <option>Safety & Architecture</option>
                    <option>Engineering Stability</option>
                    <option>Electrical Engineering</option>
                    <option>Food Safety & Hygiene</option>
                    <option>Corporate Identity</option>
                    <option>Financial Appraisal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    प्रमाणपत्र / दस्तावेज़ संख्या (Document / Certificate Reg No.)
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. STR/PEB/2026/041, BIADA/L-4412"
                    value={quickDocNumber}
                    onChange={(e) => setQuickDocNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    जारीकर्ता प्राधिकारी / कंसल्टेंट (Issuing Authority)
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. BIADA Executive Engineer, CPCB Empaneled Assessor"
                    value={quickIssuer}
                    onChange={(e) => setQuickIssuer(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Upload Drag & Drop Attachment Box */}
              <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-teal-600 text-white">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>फ़ाइल संलग्न: {quickFileName}</span>
                      <span className="text-[10px] text-teal-600 font-medium">({quickFileSize})</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      PDF, CAD (.dwg), JPG, PNG (e-Sign व डिजिटल हस्ताक्षर युक्त)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer shadow-xs transition-colors">
                    <span>फ़ाइल बदलें / अपलोड करें</span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.dwg,.jpg,.png"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setQuickFileName(e.target.files[0].name);
                          setQuickFileSize(`${(e.target.files[0].size / (1024 * 1024)).toFixed(1)} MB`);
                        }
                      }}
                    />
                  </label>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>दस्तावेज़ जमा करें (Save & Upload)</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Statutory Required Documents Checklist */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-teal-600" />
                  <span>बिहार एकल खिड़की अनिवार्य वैधानिक दस्तावेज़ चेकलिस्ट (Mandatory Compliance Checklist)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  मिथिला फूड्स प्राइवेट लिमिटेड के लिए लागू सभी प्रमुख विभागों के आवश्यक प्रपत्र व ब्लू-प्रिंट
                </p>
              </div>

              <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                {validCount} of {STATUTORY_REQUIREMENTS_LIST.length} Mandates Ready
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {STATUTORY_REQUIREMENTS_LIST.map((req) => {
                const existingDoc = documents.find(
                  (d) => d.name.toLowerCase().includes(req.name.toLowerCase().slice(0, 20)) || d.category === req.category
                );
                const isUploaded = !!existingDoc;
                const isValid = existingDoc?.status === 'VALID';

                return (
                  <div
                    key={req.key}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-3 hover:border-teal-500/50 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800/60">
                          {req.department}
                        </span>

                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                            isValid
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : isUploaded
                              ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {isValid ? '✓ सत्यापित (VALID)' : isUploaded ? 'स्क्रूटनी में (IN SCRUTINY)' : 'शेष (PENDING)'}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-snug">
                        {req.name}
                      </h4>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {req.description}
                      </p>

                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[10px] space-y-1">
                        <div className="text-slate-400 font-semibold">अनुशंसित संदर्भ व प्राधिकारी:</div>
                        <div className="font-mono text-slate-700 dark:text-slate-300 font-bold">{req.defaultNumber}</div>
                        <div className="text-slate-500">{req.defaultIssuer}</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenAutofillFromRequirement(req)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-teal-600" />
                        <span>विवरण भरें (Fill Details)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDirectSubmitRequirement(req)}
                        className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>प्रमाणित फ़ाइल अपलोड करें</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VAULT & SCRUTINY AUDIT */}
      {activeTab === 'vault' && (
        <div className="space-y-6">
          {/* Submission Readiness Diagnostic Gauge Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  SUBMISSION READINESS INDEX
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">
                    {currentProject.submissionReadiness}%
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    High Readiness for Statutory Department Scrutiny
                  </span>
                </div>
                <p className="text-xs text-slate-500 max-w-xl">
                  AI पूर्व-सत्यापन (Pre-validation) दस्तावेज़ों की सील, हस्ताक्षर, डीआईएन/सीआईएन संख्या, और विनिर्देशों की शुद्धता की पुष्टि करता है।
                </p>
              </div>

              {/* Breakdown Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] block">कुल दस्तावेज़</span>
                  <span className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {documents.length} Files
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] block">वैध (Valid)</span>
                  <span className="font-bold text-emerald-600 mt-0.5">
                    {validCount}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] block">जांच योग्य (Attn)</span>
                  <span className="font-bold text-amber-600 mt-0.5">{attentionCount}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] block">शेष (Missing)</span>
                  <span className="font-bold text-red-600 mt-0.5">{missingCount}</span>
                </div>
              </div>
            </div>

            {/* Attention Item Action Strip */}
            {attentionCount > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/60 dark:bg-amber-950/20 p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/40">
                <div className="flex items-center gap-2 text-xs text-amber-900 dark:text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>
                    <strong>{attentionCount} दस्तावेज़(ों)</strong> में तकनीकी स्पष्टीकरण आवश्यक है (उदा. ईटीपी हाइड्रोलिक क्षमता गणना)।
                  </span>
                </div>
                <button
                  onClick={() => {
                    const attnDoc = documents.find((d) => d.status === 'NEEDS_ATTENTION');
                    if (attnDoc) resolveDocumentIssue(attnDoc.id);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-xs transition-colors whitespace-nowrap self-end sm:self-auto flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>स्वचालित रूप से ठीक करें (Auto-Resolve)</span>
                </button>
              </div>
            )}
          </div>

          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="दस्तावेज़, श्रेणी, या संदर्भ संख्या खोजें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
              {['ALL', 'VALID', 'NEEDS_ATTENTION', 'MISSING'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                    filterStatus === status
                      ? 'bg-slate-900 text-white dark:bg-teal-600'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {status === 'ALL'
                    ? `All (${documents.length})`
                    : status === 'VALID'
                    ? `Valid (${validCount})`
                    : status === 'NEEDS_ATTENTION'
                    ? `Needs Attn (${attentionCount})`
                    : `Missing (${missingCount})`}
                </button>
              ))}
            </div>
          </div>

          {/* Documents Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">दस्तावेज़ का नाम व फ़ाइल</th>
                    <th className="py-3 px-4">पंजीकरण संख्या व प्राधिकारी</th>
                    <th className="py-3 px-4">सत्यापन स्थिति</th>
                    <th className="py-3 px-4">मुख्य तकनीकी विनिर्देश (Parameters)</th>
                    <th className="py-3 px-4 text-right">कार्रवाई (Actions)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-slate-100">{doc.name}</div>
                            <div className="text-[10px] text-slate-400">
                              {doc.category} · {doc.fileType} · {doc.size}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-mono text-slate-800 dark:text-slate-200 font-bold">
                          {doc.documentNumber || 'REG-PENDING'}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {doc.issuingAuthority || 'Empaneled Authority'}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            doc.status === 'VALID'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : doc.status === 'NEEDS_ATTENTION'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                              : doc.status === 'MISSING'
                              ? 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {doc.status === 'VALID' && <CheckCircle2 className="w-3 h-3" />}
                          {doc.status === 'NEEDS_ATTENTION' && <AlertTriangle className="w-3 h-3" />}
                          {doc.status === 'MISSING' && <FileX className="w-3 h-3" />}
                          <span>{doc.status.replace('_', ' ')}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        {doc.extractedParameters && Object.keys(doc.extractedParameters).length > 0 ? (
                          <div className="space-y-0.5 text-[10px]">
                            {Object.entries(doc.extractedParameters).slice(0, 2).map(([k, v]) => (
                              <div key={k} className="text-slate-600 dark:text-slate-300 truncate">
                                <span className="font-semibold text-slate-500">{k}:</span> {v}
                              </div>
                            ))}
                          </div>
                        ) : doc.validationFindings && doc.validationFindings.length > 0 ? (
                          <div className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                            {doc.validationFindings[0]}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Digitally verified artifact</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedDocToEdit(doc);
                              setEntryModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
                            title="Edit filled document particulars"
                          >
                            <Edit3 className="w-3 h-3 text-teal-600" />
                            <span>संपादित करें</span>
                          </button>

                          <button
                            onClick={() => setSelectedDocForPreview(doc)}
                            className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>ऑडिट</span>
                          </button>

                          {doc.status === 'NEEDS_ATTENTION' && (
                            <button
                              onClick={() => resolveDocumentIssue(doc.id)}
                              className="px-2.5 py-1 rounded-md bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold shadow-xs transition-colors"
                            >
                              Resolve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* AI Document Audit Details Modal */}
      {selectedDocForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Document Scrutiny Findings
                </h3>
              </div>
              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block">Document:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedDocForPreview.name}</span>
              </div>

              {selectedDocForPreview.documentNumber && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-[11px]">
                  <div><span className="text-slate-400">Reg No:</span> {selectedDocForPreview.documentNumber}</div>
                  <div><span className="text-slate-400">Authority:</span> {selectedDocForPreview.issuingAuthority}</div>
                  <div><span className="text-slate-400">Valid Until:</span> {selectedDocForPreview.validUntil || 'Permanent'}</div>
                </div>
              )}

              {selectedDocForPreview.extractedParameters && (
                <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-[11px] space-y-1">
                  <div className="font-bold text-teal-900 dark:text-teal-200">Indexed Technical Parameters:</div>
                  {Object.entries(selectedDocForPreview.extractedParameters).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-slate-500">{k}:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{v}</strong>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <span className="text-slate-400 font-semibold block mb-1">Pre-Validation Checklist:</span>
                <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-1.5 text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Digital seal, QR code, and competent authority signature verified</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Project name matches {currentProject.name} (GSTIN: {currentProject.gstin || '10AABCM4921C1ZV'})</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>File integrity and resolution meet Bihar Single Window standard</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  const doc = selectedDocForPreview;
                  setSelectedDocForPreview(null);
                  setSelectedDocToEdit(doc);
                  setEntryModalOpen(true);
                }}
                className="px-3.5 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>विवरण संशोधित करें</span>
              </button>
              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Document Entry & Upload Modal */}
      <DocumentEntryModal
        isOpen={entryModalOpen}
        onClose={() => {
          setEntryModalOpen(false);
          setSelectedDocToEdit(null);
        }}
        documentToEdit={selectedDocToEdit}
        onSave={(docData) => {
          uploadDocument(docData);
          setEntryModalOpen(false);
          setSelectedDocToEdit(null);
          setQuickSuccessMsg(`दस्तावेज़ "${docData.name}" सफलतापूर्वक अपडेट व अपलोड हो गया!`);
          setTimeout(() => setQuickSuccessMsg(null), 4000);
        }}
      />
    </div>
  );
};
