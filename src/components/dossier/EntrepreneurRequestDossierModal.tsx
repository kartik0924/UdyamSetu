import React, { useState } from 'react';
import {
  Building2,
  User,
  MapPin,
  Zap,
  Droplets,
  Flame,
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileQuestion,
  ExternalLink,
  Download,
  Eye,
  X,
  Sparkles,
  Phone,
  Mail,
  Award,
  Layers,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DocumentItem, ApprovalItem } from '../../types';

interface EntrepreneurRequestDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  focusedApprovalId?: string;
}

export const EntrepreneurRequestDossierModal: React.FC<EntrepreneurRequestDossierModalProps> = ({
  isOpen,
  onClose,
  focusedApprovalId,
}) => {
  const { currentProject, documents, approvals, queries, inspections, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'documents' | 'approvals' | 'scrutiny'>('profile');
  const [inspectingDoc, setInspectingDoc] = useState<DocumentItem | null>(null);

  if (!isOpen) return null;

  const focusedApproval = approvals.find((a) => a.id === focusedApprovalId);
  const validDocsCount = documents.filter((d) => d.status === 'VALID').length;
  const pendingDocsCount = documents.filter((d) => d.status !== 'VALID').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-5xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-gradient-to-r from-slate-50 via-teal-50/20 to-blue-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80">
          <div className="flex items-start gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-900 to-teal-800 text-white flex items-center justify-center shadow-md flex-shrink-0">
              <Building2 className="w-6 h-6 text-teal-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  ENTREPRENEUR REQUEST DOSSIER
                </span>
                <span className="text-[10px] font-semibold text-slate-500 font-mono">
                  UDYAM-BR-14-004921
                </span>
                <span className="text-[10px] font-semibold text-slate-500 font-mono">
                  GSTIN: {currentProject.gstin || '10AABCM4921C1ZV'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
                {currentProject.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Promoters: <strong>{currentProject.promoterName}</strong> ({currentProject.promoterDin}) · {currentProject.sector}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Project & Promoter Details</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'documents'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Uploaded Compliance Documents ({documents.length})</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 rounded font-semibold">
              {validDocsCount} Valid
            </span>
          </button>

          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'approvals'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Statutory Dockets ({approvals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('scrutiny')}
            className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'scrutiny'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Queries & Inspections ({queries.length + inspections.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: PROFILE & PARAMETERS */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Highlight Banner */}
              <div className="p-4 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-teal-600 text-white">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-teal-950 dark:text-teal-200">
                      Single Window Filing Status: Verified Statutory Intake
                    </h3>
                    <p className="text-[11px] text-teal-800 dark:text-teal-300">
                      Application submitted under Bihar Industrial Investment Promotion Act 2016. Overall readiness: <strong>{currentProject.submissionReadiness}%</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-800 font-bold text-slate-800 dark:text-slate-200">
                    Category: <span className="text-orange-600">{currentProject.pollutionCategory}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-800 font-bold text-slate-800 dark:text-slate-200">
                    Enterprise: {currentProject.enterpriseType} MSME
                  </div>
                </div>
              </div>

              {/* Grid 1: Enterprise & Promoter Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    1. Promoter & Enterprise Identity
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-500">Managing Promoter:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{currentProject.promoterName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-500">Promoter DIN / PAN:</span>
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {currentProject.promoterDin} · {currentProject.panNumber || 'AABCM4921C'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-500">Contact Email:</span>
                      <span className="font-medium text-teal-600 dark:text-teal-400 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {currentProject.promoterEmail || 'dr.rjha@mithilafoods.com'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-500">Contact Phone:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {currentProject.promoterPhone || '+91 94312 88492'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Corporate Incorporation:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">CIN U15310BR2024PTC068112</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    2. Industrial Site & Real Estate Particulars
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-500">Industrial Area / Location:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{currentProject.location}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-500">Plot Allotment Ref:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{currentProject.plotNumber || 'Plot C-14 to C-16, Phase-II'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-500">Total Plot Area:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{currentProject.landAreaSqMeters || 4500} Sq. Meters (1.11 Acres)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-500">Land Title Status:</span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {currentProject.landStatus}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">District / Jurisdiction:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{currentProject.district}, {currentProject.state}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid 2: Engineering & Utility Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase">
                    <Award className="w-3.5 h-3.5 text-teal-600" />
                    <span>CAPITAL OUTLAY</span>
                  </div>
                  <div className="text-xl font-black text-slate-900 dark:text-white">
                    ₹{currentProject.investmentCr} Cr
                  </div>
                  <div className="text-[10px] text-slate-500">Plant & Machinery</div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>EMPLOYMENT</span>
                  </div>
                  <div className="text-xl font-black text-slate-900 dark:text-white">
                    {currentProject.employees} Workers
                  </div>
                  <div className="text-[10px] text-slate-500">Direct Industrial Jobs</div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>CONNECTED POWER</span>
                  </div>
                  <div className="text-xl font-black text-slate-900 dark:text-white">
                    {currentProject.powerLoadKva} kVA
                  </div>
                  <div className="text-[10px] text-slate-500">11 kV High Tension (HT)</div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase">
                    <Droplets className="w-3.5 h-3.5 text-blue-500" />
                    <span>WATER INTAKE</span>
                  </div>
                  <div className="text-xl font-black text-slate-900 dark:text-white">
                    {currentProject.waterRequirementKld} KLD
                  </div>
                  <div className="text-[10px] text-slate-500">ETP Zero Liquid Discharge</div>
                </div>
              </div>

              {/* Products & Raw Materials */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  3. Production Flow & Manufacturing Basket
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Finished Industrial Products:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentProject.products.map((prod, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 font-medium text-[11px]"
                        >
                          {prod}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Sourced Agro Raw Materials:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentProject.rawMaterials.map((rm, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-[11px]"
                        >
                          {rm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UPLOADED COMPLIANCE DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  Official artifacts submitted by the industrial promoter for scrutiny:
                </span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Showing all {documents.length} statutory files
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {documents.map((doc) => {
                  const isValid = doc.status === 'VALID';
                  const isAttention = doc.status === 'NEEDS_ATTENTION';

                  return (
                    <div
                      key={doc.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between space-y-3 group hover:border-teal-500 transition-colors"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                              <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase">
                                {doc.category}
                              </span>
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                                {doc.name}
                              </h4>
                            </div>
                          </div>

                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              isValid
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : isAttention
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                            }`}
                          >
                            {doc.status.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Metadata tags */}
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
                          {doc.documentNumber && (
                            <div>
                              Doc No: <strong className="font-mono text-slate-700 dark:text-slate-300">{doc.documentNumber}</strong>
                            </div>
                          )}
                          {doc.issuingAuthority && (
                            <div className="truncate">
                              Issuer: {doc.issuingAuthority}
                            </div>
                          )}
                          {doc.validUntil && (
                            <div>Validity: {doc.validUntil}</div>
                          )}
                        </div>

                        {/* Extracted Parameters Chip */}
                        {doc.extractedParameters && (
                          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-[10px] space-y-1">
                            <span className="text-slate-400 font-bold uppercase">AI Extracted Parameters:</span>
                            {Object.entries(doc.extractedParameters).map(([k, v]) => (
                              <div key={k} className="flex justify-between text-slate-600 dark:text-slate-300">
                                <span>{k}:</span>
                                <strong className="text-slate-800 dark:text-slate-100">{v}</strong>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">
                          {doc.size || '3.2 MB'} · {doc.fileType}
                        </span>

                        <button
                          type="button"
                          onClick={() => setInspectingDoc(doc)}
                          className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 dark:bg-slate-700 dark:hover:bg-teal-950/60 text-slate-700 dark:text-slate-200 hover:text-teal-700 dark:hover:text-teal-300 font-semibold text-xs transition-colors flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect Document Details</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: STATUTORY APPROVALS */}
          {activeTab === 'approvals' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500">
                Single window status across all line departments:
              </div>

              <div className="space-y-3">
                {approvals.map((appr) => {
                  const isApproved = appr.status === 'APPROVED';
                  const isUnderScrutiny = appr.status === 'UNDER_SCRUTINY';

                  return (
                    <div
                      key={appr.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-teal-600 uppercase font-mono">
                            {appr.applicationId || 'APP-2026-X'}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                            {appr.department}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {appr.name}
                        </h4>
                        <div className="text-[11px] text-slate-500">
                          Rule: {appr.actName}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right text-xs">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">
                            {appr.estimatedDays} Days SLA
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Fee: ₹{appr.fee.toLocaleString('en-IN')}
                          </div>
                        </div>

                        <span
                          className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase ${
                            isApproved
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : isUnderScrutiny
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {appr.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: QUERIES & INSPECTIONS */}
          {activeTab === 'scrutiny' && (
            <div className="space-y-6">
              {/* Queries Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Statutory Scrutiny Queries ({queries.length})
                </h4>
                {queries.map((q) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {q.subject}
                      </span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                          q.status === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {q.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                      {q.description}
                    </p>
                    {q.responseText && (
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
                        <strong>Entrepreneur Response: </strong>
                        {q.responseText}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Inspections Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Site Inspections Assigned ({inspections.length})
                </h4>
                {inspections.map((insp) => (
                  <div
                    key={insp.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {insp.approvalName} — {insp.department}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Inspector: <strong>{insp.inspectorName}</strong>
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Scheduled Date: {new Date(insp.scheduledDate).toLocaleDateString()} · Coordinated Window: {insp.coordinatedWindow}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 text-xs">
          <div className="text-slate-500">
            Viewing dossier as official authority: <strong>{currentUser.name}</strong> ({currentUser.designation})
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white font-bold transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>

      {/* Sub-modal: Inspect Single Document */}
      {inspectingDoc && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Document Audit & Verification
                </h3>
              </div>
              <button
                onClick={() => setInspectingDoc(null)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Document Title:</span>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {inspectingDoc.name}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 text-[10px]">Reference Number:</span>
                  <div className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {inspectingDoc.documentNumber || 'REF-NOT-PROVIDED'}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Issuing Authority:</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {inspectingDoc.issuingAuthority || 'Certified Consultant'}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Issue Date:</span>
                  <div className="text-slate-700 dark:text-slate-300">
                    {inspectingDoc.issueDate || '2026-08-15'}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">OCR Confidence:</span>
                  <div className="text-emerald-600 font-bold">
                    {Math.round((inspectingDoc.confidence || 0.95) * 100)}% Match
                  </div>
                </div>
              </div>

              {/* Validation findings */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Statutory Audit Findings:
                </span>
                <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                  {inspectingDoc.validationFindings.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-teal-600 mt-0.5">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {inspectingDoc.missingElements && inspectingDoc.missingElements.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-[11px] text-amber-900 dark:text-amber-200">
                  <strong>Pending Requirements:</strong>
                  <ul className="mt-1 list-disc list-inside">
                    {inspectingDoc.missingElements.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setInspectingDoc(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white font-semibold text-xs"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
