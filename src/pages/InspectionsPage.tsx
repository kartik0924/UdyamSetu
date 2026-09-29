import React, { useState } from 'react';
import {
  Flame,
  Clock,
  CheckCircle2,
  Calendar,
  UserCheck,
  Shield,
  Upload,
  Layers,
  Sparkles,
  Info,
  CheckSquare,
  Square,
  Camera,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { InspectionItem } from '../types';

export const InspectionsPage: React.FC = () => {
  const { inspections, completeInspection, scheduleInspection, approvals } = useApp();

  const [selectedInspection, setSelectedInspection] = useState<InspectionItem | null>(null);
  const [checklistState, setChecklistState] = useState<{ item: string; verified: boolean; notes: string }[]>([]);
  const [findingsText, setFindingsText] = useState('');
  const [inspectorRemarks, setInspectorRemarks] = useState('');
  const [recommendation, setRecommendation] = useState<InspectionItem['status']>('RECOMMENDED_APPROVAL');
  const [evidenceList, setEvidenceList] = useState<string[]>([]);
  const [newEvidenceName, setNewEvidenceName] = useState('');

  const openInspectionModal = (insp: InspectionItem) => {
    setSelectedInspection(insp);
    setChecklistState(insp.checklist.map((c) => ({ ...c })));
    setFindingsText(insp.findings || '');
    setInspectorRemarks(insp.remarks || '');
    setEvidenceList([...insp.evidenceUploaded]);
    setRecommendation(insp.status === 'RECOMMENDED_APPROVAL' ? 'RECOMMENDED_APPROVAL' : 'RECOMMENDED_APPROVAL');
  };

  const toggleChecklistItem = (index: number) => {
    setChecklistState((prev) =>
      prev.map((c, i) => (i === index ? { ...c, verified: !c.verified } : c))
    );
  };

  const handleAddEvidence = () => {
    if (newEvidenceName.trim()) {
      setEvidenceList((prev) => [...prev, newEvidenceName.trim()]);
      setNewEvidenceName('');
    }
  };

  const handleCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInspection) return;
    completeInspection(
      selectedInspection.id,
      recommendation,
      findingsText,
      checklistState,
      evidenceList,
      inspectorRemarks
    );
    setSelectedInspection(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Inspection Management & Site Verification
            </h1>
            <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
              Field Governance
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Statutory on-site physical inspections, safety audit checklists, and coordinated site planning
          </p>
        </div>
      </div>

      {/* Common Inspection Planner Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-slate-900 to-teal-950 text-white relative overflow-hidden shadow-lg border border-teal-500/30">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-400/30 px-2.5 py-0.5 rounded-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-400" /> Common Inspection Planner
            </span>
            <span className="text-[11px] text-teal-200">Synchronized Site Visits</span>
          </div>

          <h3 className="text-lg font-bold tracking-tight text-white">
            Potential Coordinated Inspection Window: Oct 04 – Oct 08, 2026
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Both <strong className="text-white">Fire & Emergency Services</strong> and <strong className="text-white">State Pollution Control Board</strong> have on-site verification pending for Mithila Foods. Syncing inspection dates eliminates repeat plant shutdowns and accelerates statutory NOC issuance.
          </p>

          <div className="pt-1 flex items-center gap-2 text-[11px] text-teal-200/90 italic">
            <Info className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Statutory Note: Potential coordination opportunity based on administrative guidelines.</span>
          </div>
        </div>
      </div>

      {/* Inspections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {inspections.map((insp) => {
          const isCompleted = ['COMPLETED', 'RECOMMENDED_APPROVAL', 'RECOMMENDED_REVISION'].includes(insp.status);
          return (
            <div
              key={insp.id}
              className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 ${
                isCompleted ? 'border-emerald-300 dark:border-emerald-800' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                    {insp.department}
                  </span>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                        : 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                    }`}
                  >
                    {insp.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                  {insp.approvalName}
                </h3>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-slate-400" />
                    <span>
                      Designated Inspector: <strong className="text-slate-900 dark:text-white">{insp.inspectorName}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>
                      Scheduled Date: {new Date(insp.scheduledDate).toLocaleDateString()} at{' '}
                      {new Date(insp.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Checklist Summary */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                  <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                    <span>Audit Checklist Items:</span>
                    <span className="font-mono text-[11px] text-teal-600">
                      {insp.checklist.filter((c) => c.verified).length} / {insp.checklist.length} Passed
                    </span>
                  </div>
                  <ul className="space-y-1 text-slate-500">
                    {insp.checklist.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 truncate">
                        <span className={`w-1.5 h-1.5 rounded-full ${item.verified ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <span className="truncate">{item.item}</span>
                      </li>
                    ))}
                    {insp.checklist.length > 3 && (
                      <li className="text-[10px] text-slate-400">+{insp.checklist.length - 3} more verification criteria</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">ID: {insp.id}</span>
                <button
                  onClick={() => openInspectionModal(insp)}
                  className={`px-4 py-1.5 rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 ${
                    isCompleted
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      : 'bg-teal-600 hover:bg-teal-500 text-white'
                  }`}
                >
                  <span>{isCompleted ? 'View Inspection Report' : 'Execute Checklist & Findings'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Execute Inspection Checklist Modal */}
      {selectedInspection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-teal-600 dark:text-teal-400">
                  SITE AUDIT PROTOCOL
                </span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white truncate">
                  {selectedInspection.approvalName}
                </h3>
                <div className="text-xs text-slate-500">
                  Inspector: {selectedInspection.inspectorName} ({selectedInspection.department})
                </div>
              </div>
              <button onClick={() => setSelectedInspection(null)} className="text-xs text-slate-400">
                ✕
              </button>
            </div>

            <form onSubmit={handleCompleteSubmit} className="space-y-4 text-xs">
              {/* Checklist verification items */}
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Physical Site Inspection Checklist:
                </label>
                <div className="space-y-2">
                  {checklistState.map((chk, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleChecklistItem(idx)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        chk.verified
                          ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
                      }`}
                    >
                      <div className="mt-0.5">
                        {chk.verified ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{chk.item}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{chk.notes}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Site Findings Description */}
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  On-Site Inspection Findings & Observations
                </label>
                <textarea
                  rows={3}
                  required
                  value={findingsText}
                  onChange={(e) => setFindingsText(e.target.value)}
                  placeholder="Record structural dimensions, pressure gauge readings, water tank capacity checks..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Photo Evidence Upload Simulation */}
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Geotagged Photo Evidence
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. fire_hydrant_pressure_test.jpg"
                    value={newEvidenceName}
                    onChange={(e) => setNewEvidenceName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddEvidence}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center gap-1"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Attach Photo</span>
                  </button>
                </div>
                {evidenceList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {evidenceList.map((ev, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 text-[11px] font-mono border border-blue-200 dark:border-blue-800"
                      >
                        📷 {ev}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Statutory Recommendation */}
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Statutory Recommendation to Competent Authority
                </label>
                <select
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="RECOMMENDED_APPROVAL">
                    RECOMMENDED FOR APPROVAL (All physical safety standards verified)
                  </option>
                  <option value="RECOMMENDED_REVISION">
                    DEFECTS OBSERVED (Revision required before sanction)
                  </option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedInspection(null)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-sm"
                >
                  Submit Official Inspection Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
