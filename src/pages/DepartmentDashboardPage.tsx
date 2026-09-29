import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Flame,
  Shield,
  FileText,
  Search,
  Check,
  XCircle,
  Calendar,
  Send,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DepartmentType, ApprovalItem } from '../types';
import confetti from 'canvas-confetti';
import { Lock, Info, Eye } from 'lucide-react';
import { EntrepreneurRequestDossierModal } from '../components/dossier/EntrepreneurRequestDossierModal';

export const DepartmentDashboardPage: React.FC = () => {
  const {
    currentProject,
    documents,
    approvals,
    queries,
    inspections,
    grantStatutoryApproval,
    rejectStatutoryApproval,
    scheduleInspection,
    currentUser,
    canApproveApproval,
    canScheduleInspection,
  } = useApp();

  const [activeDept, setActiveDept] = useState<DepartmentType>(
    (currentUser.department as DepartmentType) || 'Industries'
  );
  const [selectedAppr, setSelectedAppr] = useState<ApprovalItem | null>(null);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [approvalRemarks, setApprovalRemarks] = useState('All statutory parameters verified under Bihar Industrial Investment Promotion Act.');
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [inspectorName, setInspectorName] = useState('Er. Rajesh Kumar');
  const [inspectionDate, setInspectionDate] = useState('2026-10-06T10:00');
  const [jurisdictionWarning, setJurisdictionWarning] = useState<string | null>(null);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [focusedDossierApprId, setFocusedDossierApprId] = useState<string | undefined>(undefined);

  // Sync active department tab with currently authenticated department officer
  React.useEffect(() => {
    if (currentUser.department) {
      setActiveDept(currentUser.department as DepartmentType);
    }
  }, [currentUser]);

  const departmentsList: DepartmentType[] = [
    'Industries',
    'Pollution Control',
    'Fire & Emergency',
    'Factory / Labour',
    'Electricity',
    'Food Safety',
    'Land / Revenue',
    'MSME Support',
  ];

  // Approvals belonging to active department
  const deptApprovals = approvals.filter((a) => a.department === activeDept);
  const deptQueries = queries.filter((q) => q.department === activeDept);
  const deptInspections = inspections.filter((i) => i.department === activeDept);

  const handleGrantApproval = () => {
    if (!selectedAppr) return;
    grantStatutoryApproval(selectedAppr.id, approvalRemarks);
    setApprovalModalOpen(false);
    setSelectedAppr(null);

    // Trigger celebration confetti for official statutory grant
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleScheduleInspectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppr) return;
    scheduleInspection({
      approvalId: selectedAppr.id,
      approvalName: selectedAppr.name,
      department: selectedAppr.department,
      inspectorName,
      inspectorId: 'usr_insp_field',
      scheduledDate: new Date(inspectionDate).toISOString(),
      checklist: [
        { item: 'Verify physical boundaries and setbacks', verified: false, notes: 'Per approved site master layout' },
        { item: 'Inspect plant machinery and noise attenuation', verified: false, notes: 'CPCB industrial noise standard' },
        { item: 'Emergency safety signage and water supply pressure test', verified: false, notes: 'Hydrostatic ring main check' },
      ],
      coordinatedWindow: 'Oct 04 - Oct 08, 2026',
    });
    setScheduleModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Department Scrutiny & Statutory Adjudication
            </h1>
            <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
              Authorized Officer Portal
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Acting Officer: <strong>{currentUser.name}</strong> ({currentUser.designation})
          </p>
        </div>
      </div>

      {/* Reusable Department Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-slate-400 font-semibold text-[11px] flex items-center gap-1 flex-shrink-0">
          <Building2 className="w-3.5 h-3.5" /> Department:
        </span>
        {departmentsList.map((dept) => {
          const count = approvals.filter((a) => a.department === dept).length;
          return (
            <button
              key={dept}
              onClick={() => setActiveDept(dept)}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeDept === dept
                  ? 'bg-slate-900 text-white dark:bg-teal-600 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <span>{dept}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/60 dark:bg-slate-800">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Inter-Department Transparency Banner */}
      {currentUser.role === 'DEPARTMENT_OFFICER' && currentUser.department && activeDept !== currentUser.department && (
        <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Inter-Department Transparency View: </span>
            You are currently authenticated as an officer of <strong>{currentUser.department}</strong>. You have cross-department oversight for coordination, but statutory decisions (approvals, rejection, inspections) for <strong>{activeDept}</strong> are legally restricted to designated {activeDept} officers.
          </div>
        </div>
      )}

      {/* Jurisdiction Warning Modal */}
      {jurisdictionWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950">
                <Lock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Statutory Jurisdiction Enforced
                </h3>
                <span className="text-[11px] text-slate-500">Separation of Administrative Powers</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {jurisdictionWarning}
            </p>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-500 space-y-1">
              <div>• Current Credential: <strong>{currentUser.name}</strong> ({currentUser.department || currentUser.role})</div>
              <div>• Statutory Rule: No officer may grant approvals outside their designated legislative department.</div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setJurisdictionWarning(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs transition-colors"
              >
                Acknowledge Restriction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Department KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">ASSIGNED CASES</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {deptApprovals.length}
          </div>
          <span className="text-[10px] text-teal-600 font-medium">Under Active Scrutiny</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">PENDING QUERIES</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {deptQueries.length}
          </div>
          <span className="text-[10px] text-slate-500">Clarifications in flight</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">SITE INSPECTIONS</span>
          <div className="text-2xl font-black text-blue-600 mt-1">
            {deptInspections.length}
          </div>
          <span className="text-[10px] text-slate-500">Field visits assigned</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">SLA COMPLIANCE</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">94%</div>
          <span className="text-[10px] text-slate-500">On-track for BRAP 2024</span>
        </div>
      </div>

      {/* Assigned Applications for this department */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          Active Dockets for {activeDept} ({deptApprovals.length})
        </h2>

        {deptApprovals.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            No active dockets assigned to this department for current industrial units.
          </div>
        ) : (
          deptApprovals.map((appr) => {
            const isApproved = appr.status === 'APPROVED';
            return (
              <div
                key={appr.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                      Docket #{appr.applicationId || 'APP-2026-X'}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {appr.name}
                    </h3>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      Statutory Rule: {appr.actName}
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase self-start sm:self-center ${
                      isApproved
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                        : appr.status === 'QUERY_RAISED'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                        : 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                    }`}
                  >
                    {appr.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Entrepreneur Incoming Request Dossier Summary */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-teal-50/20 dark:from-slate-800/60 dark:to-teal-950/20 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/60 px-2 py-0.5 rounded">
                        ENTREPRENEUR REQUEST DATA
                      </span>
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {currentProject.name}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setFocusedDossierApprId(appr.id);
                        setDossierOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Full Project Dossier & Documents ({documents.length})</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Managing Promoter:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{currentProject.promoterName}</strong>
                      <div className="text-[10px] text-slate-500 font-mono">{currentProject.promoterDin}</div>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] block">Capital & Workers:</span>
                      <strong className="text-slate-800 dark:text-slate-200">₹{currentProject.investmentCr} Cr Capex</strong>
                      <div className="text-[10px] text-slate-500">{currentProject.employees} Industrial Workers</div>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] block">Land & Location:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{currentProject.plotNumber || 'Plot C-14 to C-16'}</strong>
                      <div className="text-[10px] text-slate-500 truncate">{currentProject.location}</div>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] block">Utilities & Pollution:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{currentProject.powerLoadKva} kVA · {currentProject.waterRequirementKld} KLD</strong>
                      <div className="text-[10px] font-semibold text-orange-600">{currentProject.pollutionCategory} Category Unit</div>
                    </div>
                  </div>

                  {/* Submitted Documents snippet for this docket */}
                  <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-slate-400 font-medium">Submitted Documents:</span>
                      {documents
                        .filter((d) => !d.approvalId || d.approvalId === appr.id)
                        .slice(0, 3)
                        .map((d) => (
                          <span
                            key={d.id}
                            className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                              d.status === 'VALID'
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200'
                                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200'
                            }`}
                          >
                            ✓ {d.name.length > 25 ? d.name.substring(0, 25) + '...' : d.name}
                          </span>
                        ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setFocusedDossierApprId(appr.id);
                        setDossierOpen(true);
                      }}
                      className="text-teal-600 dark:text-teal-400 hover:underline font-semibold"
                    >
                      Audit all attached documents →
                    </button>
                  </div>
                </div>

                {/* Statutory Reason */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block mb-0.5">Statutory Trigger & Purpose:</span>
                  <div className="text-slate-700 dark:text-slate-300">{appr.trigger}</div>
                </div>

                {/* Officer Statutory Action Bar */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Next Action: </span>
                    {appr.nextAction}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {canScheduleInspection(appr).allowed ? (
                      <button
                        onClick={() => {
                          setSelectedAppr(appr);
                          setScheduleModalOpen(true);
                        }}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        <span>Schedule Inspection</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic px-2">
                        Inspection scheduling restricted
                      </span>
                    )}

                    {!isApproved && (
                      canApproveApproval(appr).allowed ? (
                        <button
                          onClick={() => {
                            setSelectedAppr(appr);
                            setApprovalModalOpen(true);
                          }}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Grant Statutory Approval</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setJurisdictionWarning(canApproveApproval(appr).reason || 'Statutory authority restricted')}
                          className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          title="Click to view statutory jurisdiction restriction"
                        >
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Restricted to {appr.department} Officer</span>
                        </button>
                      )
                    )}

                    {isApproved && (
                      <span className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Certificate Sanctioned</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Grant Approval Confirmation Modal */}
      {approvalModalOpen && selectedAppr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Execute Statutory Approval Sanction</span>
              </h3>
              <button onClick={() => setApprovalModalOpen(false)} className="text-xs text-slate-400">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200">
                You are executing a <strong>statutory approval action</strong> on behalf of{' '}
                <strong>{selectedAppr.department}</strong> for <strong>{selectedAppr.name}</strong>.
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Official Sanction Endorsement Remarks:
                </label>
                <textarea
                  rows={3}
                  required
                  value={approvalRemarks}
                  onChange={(e) => setApprovalRemarks(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="text-[11px] text-slate-500 italic">
                * Note: In this SIH prototype demonstration, this executes the official approval state change, updates the statutory audit trail, triggers the celebration event, and activates the post-approval compliance obligations automatically.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setApprovalModalOpen(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleGrantApproval}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md"
              >
                Confirm Statutory Grant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Inspection Modal */}
      {scheduleModalOpen && selectedAppr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Dispatch Statutory Site Inspector
              </h3>
              <button onClick={() => setScheduleModalOpen(false)} className="text-xs text-slate-400">
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleInspectionSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Designated Inspector Name
                </label>
                <input
                  type="text"
                  required
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Site Visit Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={inspectionDate}
                  onChange={(e) => setInspectionDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/30 text-teal-800 dark:text-teal-300 text-[11px]">
                Coordinated window: Automatically synced with Fire & SPCB common inspection framework.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold"
                >
                  Confirm Inspection Dispatch
                </button>
              </div>
            </form>
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
