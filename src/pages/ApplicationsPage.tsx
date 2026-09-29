import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  Flame,
  Building2,
  ChevronRight,
  Search,
  Filter,
  Layers,
  ArrowRight,
  X,
  ExternalLink,
  Eye,
  Phone,
  Mail,
  FolderOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ApprovalItem } from '../types';
import { EntrepreneurRequestDossierModal } from '../components/dossier/EntrepreneurRequestDossierModal';

export const ApplicationsPage: React.FC = () => {
  const { approvals, submitApplication, slas, currentProject, documents, currentUser } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [selectedApprTimeline, setSelectedApprTimeline] = useState<ApprovalItem | null>(null);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [focusedDossierApprId, setFocusedDossierApprId] = useState<string | undefined>(undefined);

  const filtered = approvals.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.department.toLowerCase().includes(search.toLowerCase());
    const matchesStage = stageFilter === 'ALL' || a.status === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Application Dockets & Statutory Lifecycle
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            End-to-end departmental progress tracking, SLA monitoring, and formal stage scrutiny
          </p>
        </div>
      </div>

      {/* Incoming Entrepreneur Application Request & Single Window Dossier */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-50 via-teal-50/20 to-blue-50/20 dark:from-slate-900 dark:via-teal-950/20 dark:to-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/60 px-2 py-0.5 rounded">
              आवेदक उद्यमी का पूरा डाटा (ENTREPRENEUR APPLICATION DOSSIER)
            </span>
            <span className="font-bold text-xs text-slate-900 dark:text-white">
              {currentProject.name}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              ({currentProject.udyamNumber || 'UDYAM-BR-14-004921'})
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setFocusedDossierApprId(undefined);
              setDossierOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>उद्यमी का सारा डेटा एवं दस्तावेज़ देखें ({documents.length} Files) →</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] block">प्रमोटर व संपर्क:</span>
            <strong className="text-slate-800 dark:text-slate-200">{currentProject.promoterName}</strong>
            <div className="text-[10px] text-slate-500 font-mono">{currentProject.promoterPhone || '+91 94312 88492'}</div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">इकाई का स्थान (Plot):</span>
            <strong className="text-slate-800 dark:text-slate-200">{currentProject.plotNumber || 'Plot C-14 to C-16'}</strong>
            <div className="text-[10px] text-slate-500 truncate">{currentProject.location}</div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">पूंजी व रोज़गार (Outlay & Jobs):</span>
            <strong className="text-slate-800 dark:text-slate-200">₹{currentProject.investmentCr} Cr · {currentProject.employees} कर्मी</strong>
            <div className="text-[10px] text-slate-500">{currentProject.sector}</div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">उपयोगिताएं व प्रदूषण श्रेणी:</span>
            <strong className="text-slate-800 dark:text-slate-200">{currentProject.powerLoadKva} kVA · {currentProject.waterRequirementKld} KLD</strong>
            <div className="text-[10px] font-semibold text-orange-600">{currentProject.pollutionCategory} Category Unit</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search applications by name or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
          {['ALL', 'UNDER_SCRUTINY', 'QUERY_RAISED', 'INSPECTION_SCHEDULED', 'APPROVED', 'PRE_VALIDATION'].map((st) => (
            <button
              key={st}
              onClick={() => setStageFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                stageFilter === st
                  ? 'bg-slate-900 text-white dark:bg-teal-600'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {st === 'ALL' ? 'All Applications' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Application ID & Approval</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Current Stage</th>
                <th className="py-3 px-4">SLA Elapsed</th>
                <th className="py-3 px-4">Next Statutory Action</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((appr) => {
                const slaMatch = slas.find((s) => s.approvalId === appr.id);
                return (
                  <tr key={appr.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100">{appr.name}</div>
                        <div className="font-mono text-[10px] text-teal-600 dark:text-teal-400">
                          {appr.applicationId || 'PRE-SUBMISSION'}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {appr.department}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          appr.status === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                            : appr.status === 'QUERY_RAISED'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 animate-pulse'
                            : ['UNDER_SCRUTINY', 'INSPECTION_SCHEDULED'].includes(appr.status)
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {appr.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {slaMatch ? (
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                            {slaMatch.elapsedDays} / {slaMatch.standardDays} Days
                          </div>
                          <div className="w-20 bg-slate-100 dark:bg-slate-800 rounded-full h-1 mt-1 overflow-hidden">
                            <div
                              className={`h-1 rounded-full ${
                                slaMatch.slaStatus === 'APPROACHING' ? 'bg-amber-500' : 'bg-teal-500'
                              }`}
                              style={{ width: `${Math.min(100, (slaMatch.elapsedDays / slaMatch.standardDays) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[10px]">SLA: {appr.estimatedDays} Days</span>
                      )}
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="text-[11px] text-slate-600 dark:text-slate-300 truncate" title={appr.nextAction}>
                        {appr.nextAction}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setFocusedDossierApprId(appr.id);
                            setDossierOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-md bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/80 border border-teal-200 dark:border-teal-800 text-[11px] font-bold text-teal-700 dark:text-teal-300 transition-colors flex items-center gap-1"
                          title="View Full Entrepreneur Application Request Data & Attached Documents"
                        >
                          <Eye className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                          <span>Dossier & Docs</span>
                        </button>

                        <button
                          onClick={() => setSelectedApprTimeline(appr)}
                          className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                        >
                          Timeline
                        </button>

                        {appr.status === 'PRE_VALIDATION' && (
                          <button
                            onClick={() => submitApplication(appr.id)}
                            className="px-2.5 py-1 rounded-md bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold shadow-xs transition-colors flex items-center gap-1"
                          >
                            <Play className="w-3 h-3" />
                            <span>Submit</span>
                          </button>
                        )}

                        {appr.status === 'QUERY_RAISED' && (
                          <button
                            onClick={() => navigate('/queries')}
                            className="px-2.5 py-1 rounded-md bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold shadow-xs transition-colors"
                          >
                            Respond
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Milestone Timeline Modal */}
      {selectedApprTimeline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-teal-600 dark:text-teal-400">
                  STATUTORY AUDIT MILESTONE TIMELINE
                </span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {selectedApprTimeline.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApprTimeline(null)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            {/* Visual Milestones */}
            <div className="space-y-4">
              <div className="relative pl-6 pb-4 border-l-2 border-teal-500">
                <span className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-teal-500" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Stage 1: Intent & Pre-Validation
                </div>
                <div className="text-[11px] text-slate-500">
                  Project profile parameters mapped and required compliance artifacts validated.
                </div>
              </div>

              <div className="relative pl-6 pb-4 border-l-2 border-teal-500">
                <span className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-teal-500" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Stage 2: Formal Filing & Docket Generation
                </div>
                <div className="text-[11px] text-slate-500">
                  Docket {selectedApprTimeline.applicationId || 'APP-2026-X'} submitted to {selectedApprTimeline.department}.
                </div>
              </div>

              <div
                className={`relative pl-6 pb-4 border-l-2 ${
                  ['QUERY_RAISED', 'QUERY_RESPONDED', 'INSPECTION_SCHEDULED', 'APPROVED'].includes(selectedApprTimeline.status)
                    ? 'border-teal-500'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <span
                  className={`absolute -left-1.5 top-0 h-3 w-3 rounded-full ${
                    ['QUERY_RAISED', 'QUERY_RESPONDED', 'INSPECTION_SCHEDULED', 'APPROVED'].includes(selectedApprTimeline.status)
                      ? 'bg-teal-500'
                      : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                />
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Stage 3: Departmental Scrutiny & Clarifications
                </div>
                <div className="text-[11px] text-slate-500">
                  Scrutiny officer assesses technical blueprints, environmental criteria, and queries if needed.
                </div>
              </div>

              <div
                className={`relative pl-6 pb-4 border-l-2 ${
                  ['INSPECTION_SCHEDULED', 'APPROVED'].includes(selectedApprTimeline.status)
                    ? 'border-teal-500'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <span
                  className={`absolute -left-1.5 top-0 h-3 w-3 rounded-full ${
                    ['INSPECTION_SCHEDULED', 'APPROVED'].includes(selectedApprTimeline.status)
                      ? 'bg-teal-500'
                      : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                />
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Stage 4: Coordinated Site Inspection
                </div>
                <div className="text-[11px] text-slate-500">
                  On-site verification of equipment, water static reservoir, and fire escape circuits.
                </div>
              </div>

              <div className="relative pl-6">
                <span
                  className={`absolute -left-1.5 top-0 h-3 w-3 rounded-full ${
                    selectedApprTimeline.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                />
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Stage 5: Statutory Sanction & Digital Certificate
                </div>
                <div className="text-[11px] text-slate-500">
                  Authorized decision granted by Competent Authority under statutory act.
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedApprTimeline(null)}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                Close Timeline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Entrepreneur Request Dossier Modal */}
      <EntrepreneurRequestDossierModal
        isOpen={dossierOpen}
        onClose={() => setDossierOpen(false)}
        focusedApprovalId={focusedDossierApprId}
      />
    </div>
  );
};

