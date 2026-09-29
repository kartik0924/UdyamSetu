import React, { useState } from 'react';
import {
  Shield,
  Building2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Send,
  Users,
  TrendingUp,
  FileText,
  Sparkles,
  Info,
  MapPin,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EntrepreneurRequestDossierModal } from '../components/dossier/EntrepreneurRequestDossierModal';

export const DistrictAdminDashboardPage: React.FC = () => {
  const { currentProject, documents, approvals, slas, queries, inspections, currentUser } = useApp();

  const [dossierOpen, setDossierOpen] = useState(false);
  const [dliccModalOpen, setDliccModalOpen] = useState(false);
  const [directiveDept, setDirectiveDept] = useState('Pollution Control');
  const [directiveNote, setDirectiveNote] = useState(
    'Expedite Consent to Establish (CTE) scrutiny within 7 days. Industrial unit has completed all technical civil works.'
  );
  const [directiveSuccess, setDirectiveSuccess] = useState(false);

  const pendingApprovals = approvals.filter((a) => a.status !== 'APPROVED');
  const approvedCount = approvals.filter((a) => a.status === 'APPROVED').length;
  const delayedApprovals = approvals.filter((a) => a.status === 'QUERY_RAISED');

  const handleIssueDirective = (e: React.FormEvent) => {
    e.preventDefault();
    setDirectiveSuccess(true);
    setTimeout(() => {
      setDliccModalOpen(false);
      setDirectiveSuccess(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              District Single Window Oversight & Facilitation
            </h1>
            <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
              Vaishali District Jurisdiction
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            District Magistrate: <strong>{currentUser.name}</strong> ({currentUser.designation})
          </p>
        </div>

        {/* DLICC Meeting Convene Trigger */}
        <button
          onClick={() => setDliccModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Issue DLICC Expedite Directive</span>
        </button>
      </div>

      {/* Oversight Role Legal Note */}
      <div className="p-3.5 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 flex items-start gap-3 text-xs text-purple-900 dark:text-purple-200">
        <Info className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">District Administration Mandate: </span>
          The District Magistrate & DLICC monitor single-window clearance timelines, convene coordination meetings, and eliminate inter-departmental logjams. Line departments retain statutory decision power under their respective Acts.
        </div>
      </div>

      {/* District KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">DISTRICT CAPEX IN-FLIGHT</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            ₹{currentProject.investmentCr} Cr
          </div>
          <span className="text-[10px] text-teal-600 font-medium">Hajipur BIADA Belt</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">PROJECTED EMPLOYMENT</span>
          <div className="text-2xl font-black text-blue-600 mt-1">
            {currentProject.employees} Jobs
          </div>
          <span className="text-[10px] text-slate-500">Local Skilled Workforce</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">CLEARED APPROVALS</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {approvedCount} / {approvals.length}
          </div>
          <span className="text-[10px] text-slate-500">Sanctioned Dockets</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">ATTENTION DOCKETS</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {delayedApprovals.length}
          </div>
          <span className="text-[10px] text-slate-500">Clarification in-progress</span>
        </div>
      </div>

      {/* Industrial Unit & Entrepreneur Dossier Particulars */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-purple-50/20 dark:from-slate-800/60 dark:to-purple-950/20 border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded">
              DISTRICT SINGLE WINDOW INTAKE
            </span>
            <span className="font-bold text-xs text-slate-900 dark:text-white">
              {currentProject.name}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              (UDYAM-BR-14-004921)
            </span>
          </div>

          <button
            type="button"
            onClick={() => setDossierOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Review Full Entrepreneur Request & Documents ({documents.length} Files)</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] block">Managing Director:</span>
            <strong className="text-slate-800 dark:text-slate-200">{currentProject.promoterName}</strong>
            <div className="text-[10px] text-slate-500 font-mono">{currentProject.promoterDin}</div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Site Location:</span>
            <strong className="text-slate-800 dark:text-slate-200">{currentProject.plotNumber || 'Plot C-14 to C-16'}</strong>
            <div className="text-[10px] text-slate-500 truncate">{currentProject.location}</div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Employment & Outlay:</span>
            <strong className="text-slate-800 dark:text-slate-200">₹{currentProject.investmentCr} Cr · {currentProject.employees} Workers</strong>
            <div className="text-[10px] text-slate-500">Sector: {currentProject.sector}</div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Clearance Health:</span>
            <strong className="text-slate-800 dark:text-slate-200">{currentProject.submissionReadiness}% Pre-Validated</strong>
            <div className="text-[10px] font-semibold text-emerald-600">DLICC Monitoring Active</div>
          </div>
        </div>
      </div>

      {/* Line Department Performance & Clearance Status */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Vaishali District Inter-Departmental Clearance Status
            </h2>
            <p className="text-xs text-slate-500">
              Active dockets for {currentProject.name} (BIADA Industrial Area Phase-II)
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            District SLA Target: 30 Working Days
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Line Department</th>
                <th className="py-3 px-4">Approval Docket</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4">Statutory Timeline</th>
                <th className="py-3 px-4 text-right">District Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {approvals.map((appr) => {
                const sla = slas.find((s) => s.approvalId === appr.id);
                return (
                  <tr key={appr.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-purple-600" />
                      <span>{appr.department}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {appr.name}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          appr.status === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : appr.status === 'QUERY_RAISED'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                        }`}
                      >
                        {appr.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      {sla ? `${sla.elapsedDays} / ${sla.standardDays} Days` : `${appr.estimatedDays} Days`}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {appr.status !== 'APPROVED' ? (
                        <button
                          onClick={() => {
                            setDirectiveDept(appr.department);
                            setDliccModalOpen(true);
                          }}
                          className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline"
                        >
                          Expedite Review →
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-bold">Clearance Signed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expedite Directive Modal */}
      {dliccModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Issue District Level Expedite Directive
                </h3>
              </div>
              <button
                onClick={() => setDliccModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleIssueDirective} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Recipient Line Department
                </label>
                <select
                  value={directiveDept}
                  onChange={(e) => setDirectiveDept(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
                >
                  <option value="Pollution Control">Bihar State Pollution Control Board</option>
                  <option value="Fire & Emergency">Fire & Emergency Services</option>
                  <option value="Industries">Industries Department (BIADA)</option>
                  <option value="Factory / Labour">Factory & Labour Directorate</option>
                  <option value="Electricity">NBPDCL Power Supply</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Directive Memorandum / DLICC Instructions
                </label>
                <textarea
                  rows={4}
                  value={directiveNote}
                  onChange={(e) => setDirectiveNote(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs"
                />
              </div>

              {directiveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Official DLICC Directive issued to {directiveDept} Regional Office.</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDliccModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Issue Statutory Directive</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete Entrepreneur Request Dossier Modal for District Magistrate */}
      <EntrepreneurRequestDossierModal
        isOpen={dossierOpen}
        onClose={() => setDossierOpen(false)}
      />
    </div>
  );
};
