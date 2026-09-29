import React, { useState } from 'react';
import {
  Flame,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Camera,
  MapPin,
  Calendar,
  Send,
  Building2,
  FileText,
  CheckSquare,
  Square,
  Sparkles,
  Info,
  Eye,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { InspectionItem } from '../types';
import { EntrepreneurRequestDossierModal } from '../components/dossier/EntrepreneurRequestDossierModal';

export const InspectorDashboardPage: React.FC = () => {
  const {
    inspections,
    documents,
    completeInspection,
    currentUser,
    currentProject,
    canConductInspection,
  } = useApp();

  const [dossierOpen, setDossierOpen] = useState(false);

  const [selectedInspection, setSelectedInspection] = useState<InspectionItem | null>(
    inspections[0] || null
  );
  const [checklistState, setChecklistState] = useState<
    { item: string; verified: boolean; notes: string }[]
  >(inspections[0]?.checklist || []);
  const [findings, setFindings] = useState<string>(
    'Physical factory site inspected at BIADA Phase-II Hajipur. Setback boundaries verified per master blueprint. ETP civil works underway. Emergency egress and high-pressure fire ring main inspected.'
  );
  const [recommendation, setRecommendation] = useState<'RECOMMEND_CLEARANCE' | 'DEFICIENCY_NOTICE'>('RECOMMEND_CLEARANCE');
  const [remarks, setRemarks] = useState<string>(
    'Site condition complies with statutory industrial safety guidelines. Forwarded to Chief Fire Officer / Dept Officer for formal decision.'
  );
  const [photoUploaded, setPhotoUploaded] = useState<boolean>(true);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  const isInspector = currentUser.role === 'INSPECTOR' || currentUser.role === 'SUPER_ADMIN';

  const handleSelectInspection = (insp: InspectionItem) => {
    setSelectedInspection(insp);
    setChecklistState(insp.checklist);
    setSubmittedSuccess(false);
  };

  const handleToggleCheck = (index: number) => {
    if (!isInspector) return;
    const next = [...checklistState];
    next[index].verified = !next[index].verified;
    setChecklistState(next);
  };

  const handleUpdateNotes = (index: number, val: string) => {
    if (!isInspector) return;
    const next = [...checklistState];
    next[index].notes = val;
    setChecklistState(next);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInspection) return;

    completeInspection(
      selectedInspection.id,
      recommendation === 'RECOMMEND_CLEARANCE' ? 'COMPLETED' : 'SCHEDULED',
      findings,
      checklistState,
      ['geotag_site_east_boundary.jpg', 'etp_ring_main_pressure_gauge.jpg'],
      remarks
    );

    setSubmittedSuccess(true);
  };

  return (
    <div className="space-y-6">
      {/* Header with Inspector Identity */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Field Inspector Verification Portal
            </h1>
            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
              Technical Field Jurisdiction
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Officer: <strong>{currentUser.name}</strong> ({currentUser.designation})
          </p>
        </div>

        {/* Clear Separation of Powers Notice */}
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 max-w-md">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-100">
            <Info className="w-3.5 h-3.5 text-teal-600" />
            <span>Statutory Jurisdiction Boundary:</span>
          </div>
          <p className="text-[11px] mt-0.5 text-slate-500 dark:text-slate-400">
            Inspectors submit technical field verification and clearance recommendations. Final statutory sanction rests strictly with the designated Department Officer.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">ASSIGNED SITE VISITS</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {inspections.length}
          </div>
          <span className="text-[10px] text-amber-600 font-medium">Vaishali Industrial Belt</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">SCHEDULED VISITS</span>
          <div className="text-2xl font-black text-blue-600 mt-1">
            {inspections.filter((i) => i.status === 'SCHEDULED').length}
          </div>
          <span className="text-[10px] text-slate-500">Awaiting Physical Inspection</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">COMMON WINDOWS</span>
          <div className="text-2xl font-black text-teal-600 mt-1">1</div>
          <span className="text-[10px] text-slate-500">Joint Fire & Pollution Visit</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">REPORTS FILED</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {inspections.filter((i) => i.status === 'COMPLETED').length}
          </div>
          <span className="text-[10px] text-slate-500">Submitted to Dept Officers</span>
        </div>
      </div>

      {/* Industrial Unit & Entrepreneur Request Particulars */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-amber-50/20 dark:from-slate-800/60 dark:to-amber-950/20 border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded">
              UNIT UNDER FIELD VERIFICATION
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
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Inspect Unit Dossier & Documents ({documents.length} Files)</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] block">Managing Director:</span>
            <strong className="text-slate-800 dark:text-slate-200">{currentProject.promoterName}</strong>
            <div className="text-[10px] text-slate-500">{currentProject.promoterPhone || '+91 94312 88492'}</div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Site Location:</span>
            <strong className="text-slate-800 dark:text-slate-200">{currentProject.plotNumber || 'Plot C-14 to C-16'}</strong>
            <div className="text-[10px] text-slate-500 truncate">{currentProject.location}</div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Total Plot Area:</span>
            <strong className="text-slate-800 dark:text-slate-200">{currentProject.landAreaSqMeters || 4500} Sq. Meters</strong>
            <div className="text-[10px] text-slate-500">{currentProject.employees} Factory Workers</div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Utilities:</span>
            <strong className="text-slate-800 dark:text-slate-200">{currentProject.powerLoadKva} kVA · {currentProject.waterRequirementKld} KLD</strong>
            <div className="text-[10px] font-semibold text-orange-600">{currentProject.pollutionCategory} Category</div>
          </div>
        </div>
      </div>

      {/* Main Inspection Execution Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Inspection Docket Queue */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Assigned Site Inspections ({inspections.length})
          </h2>

          <div className="space-y-2">
            {inspections.map((insp) => {
              const isSelected = selectedInspection?.id === insp.id;
              return (
                <button
                  key={insp.id}
                  onClick={() => handleSelectInspection(insp)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-amber-50/60 dark:bg-amber-950/40 border-amber-500/80 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {insp.department}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase ${
                        insp.status === 'COMPLETED'
                          ? 'text-emerald-600'
                          : 'text-amber-600 animate-pulse'
                      }`}
                    >
                      {insp.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-slate-900 dark:text-white mt-2">
                    {insp.approvalName}
                  </h3>

                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>BIADA Industrial Area, Hajipur</span>
                  </div>

                  <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Scheduled: {new Date(insp.scheduledDate).toLocaleDateString()}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Technical Verification & Report Submission */}
        {selectedInspection && (
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">
                  SITE VERIFICATION DESK #{selectedInspection.id}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {selectedInspection.approvalName}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  Unit: Mithila Foods Pvt. Ltd. · Plot 42-B, BIADA Phase-II Hajipur
                </div>
              </div>

              {selectedInspection.coordinatedWindow && (
                <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-[11px] text-teal-800 dark:text-teal-200">
                  <span className="font-bold">Common Window: </span>
                  {selectedInspection.coordinatedWindow}
                </div>
              )}
            </div>

            {/* Checklist items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  1. Statutory Physical Checklist
                </span>
                <span className="text-[11px] text-slate-400">
                  {checklistState.filter((c) => c.verified).length} / {checklistState.length} Verified
                </span>
              </div>

              <div className="space-y-2">
                {checklistState.map((chk, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleCheck(idx)}
                      disabled={!isInspector}
                      className="flex items-center gap-2.5 text-left font-semibold text-slate-800 dark:text-slate-200 hover:text-teal-600"
                    >
                      {chk.verified ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      )}
                      <span>{chk.item}</span>
                    </button>

                    <input
                      type="text"
                      disabled={!isInspector}
                      value={chk.notes}
                      onChange={(e) => handleUpdateNotes(idx, e.target.value)}
                      placeholder="Inspector verification notes..."
                      className="text-[11px] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 w-full sm:w-64"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence & Photo Upload */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
                2. Geotagged Site Evidence & Photos
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-teal-600" />
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        geotag_site_east_boundary.jpg
                      </div>
                      <div className="text-[10px] text-slate-500">25.6882° N, 85.2144° E · Timestamped</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    Verified
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-teal-600" />
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        etp_ring_main_pressure_gauge.jpg
                      </div>
                      <div className="text-[10px] text-slate-500">7.2 Bar Pressure Tested</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Findings & Clearance Recommendation */}
            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  3. Field Observation Findings
                </label>
                <textarea
                  rows={3}
                  disabled={!isInspector}
                  value={findings}
                  onChange={(e) => setFindings(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    4. Technical Clearance Recommendation
                  </label>
                  <select
                    disabled={!isInspector}
                    value={recommendation}
                    onChange={(e: any) => setRecommendation(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
                  >
                    <option value="RECOMMEND_CLEARANCE">
                      RECOMMEND STATUTORY CLEARANCE (Forward to Department Officer)
                    </option>
                    <option value="DEFICIENCY_NOTICE">
                      DEFICIENCY IDENTIFIED (Issue Rectification Notice to Promoter)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Inspector Recommendation Remarks
                  </label>
                  <input
                    type="text"
                    disabled={!isInspector}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {submittedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>
                    Inspection Report successfully submitted! The designated Department Officer has been notified to proceed with statutory sanction scrutiny.
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  Signed: <strong>{currentUser.name}</strong> ({currentUser.designation})
                </span>

                <button
                  type="submit"
                  disabled={!isInspector}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Field Report to Department</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Complete Entrepreneur Request Dossier Modal for Field Inspector */}
      <EntrepreneurRequestDossierModal
        isOpen={dossierOpen}
        onClose={() => setDossierOpen(false)}
      />
    </div>
  );
};
