import React, { useState } from 'react';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  FileText,
  Upload,
  ShieldCheck,
  Check,
  Building2,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ComplianceObligation } from '../types';

export const CompliancePage: React.FC = () => {
  const { compliance, currentProject } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedComp, setSelectedComp] = useState<ComplianceObligation | null>(null);
  const [returnDocName, setReturnDocName] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const filtered = compliance.filter(
    (c) => filterStatus === 'ALL' || c.status === filterStatus
  );

  const upcomingCount = compliance.filter((c) => c.status === 'UPCOMING').length;
  const dueSoonCount = compliance.filter((c) => c.status === 'DUE_SOON').length;
  const overdueCount = compliance.filter((c) => c.status === 'OVERDUE').length;

  const handleFulfillObligation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComp) return;
    setUploadSuccess(true);
    setTimeout(() => {
      selectedComp.status = 'COMPLETED';
      selectedComp.lastFulfilled = new Date().toISOString();
      setUploadSuccess(false);
      setSelectedComp(null);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Compliance Continuum & Statutory Renewals
            </h1>
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Post-Approval Lifecycle
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Continuous statutory obligations, periodic environmental returns, and license renewal calendar for {currentProject.name}
          </p>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">UPCOMING CALENDAR</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {upcomingCount}
          </div>
          <span className="text-[10px] text-slate-500">Scheduled in next 180 days</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40 shadow-xs bg-amber-50/20">
          <span className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-400">DUE SOON</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {dueSoonCount}
          </div>
          <span className="text-[10px] text-amber-800 dark:text-amber-300">Action recommended within 15 days</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/40 shadow-xs bg-red-50/20">
          <span className="text-[10px] font-bold uppercase text-red-700 dark:text-red-400">OVERDUE STATUTORY LOGS</span>
          <div className="text-2xl font-black text-red-600 mt-1">
            {overdueCount}
          </div>
          <span className="text-[10px] text-red-800 dark:text-red-300">Requires immediate submission</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1 no-scrollbar">
        {['ALL', 'DUE_SOON', 'OVERDUE', 'UPCOMING', 'COMPLETED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
              filterStatus === status
                ? 'bg-slate-900 text-white dark:bg-teal-600 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {status === 'ALL' ? `All Obligations (${compliance.length})` : status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Obligations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((comp) => {
          const isOverdue = comp.status === 'OVERDUE';
          const isDueSoon = comp.status === 'DUE_SOON';
          const isCompleted = comp.status === 'COMPLETED';

          return (
            <div
              key={comp.id}
              className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 ${
                isOverdue
                  ? 'border-red-300 dark:border-red-900/50'
                  : isDueSoon
                  ? 'border-amber-300 dark:border-amber-900/50'
                  : isCompleted
                  ? 'border-emerald-300 dark:border-emerald-900/50'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                    {comp.authority}
                  </span>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      isOverdue
                        ? 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300'
                        : isDueSoon
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 animate-pulse'
                        : isCompleted
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {comp.status.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                    {comp.obligationName}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Governed under: <strong>{comp.approvalName}</strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Statutory Frequency:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{comp.frequency}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Due Date:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {new Date(comp.nextDueDate).toLocaleDateString([], { dateStyle: 'medium' })}
                    </span>
                  </div>
                  <div className="pt-1 text-[11px] text-teal-800 dark:text-teal-300">
                    Mandate: {comp.complianceDocumentRequired}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">{comp.id}</span>
                {!isCompleted ? (
                  <button
                    onClick={() => {
                      setSelectedComp(comp);
                      setReturnDocName('');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload & File Return</span>
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Fulfilled for Period
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Fulfill Return Modal */}
      {selectedComp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                File Periodic Return: {selectedComp.obligationName}
              </h3>
              <button onClick={() => setSelectedComp(null)} className="text-xs text-slate-400">
                ✕
              </button>
            </div>

            <form onSubmit={handleFulfillObligation} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Required Return Artifact
                </label>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  {selectedComp.complianceDocumentRequired}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Upload Signed Document / Certificate PDF
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual_Environmental_Audit_Statement_2026.pdf"
                  value={returnDocName}
                  onChange={(e) => setReturnDocName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedComp(null)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadSuccess}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold"
                >
                  {uploadSuccess ? 'Filing Statutory Return...' : 'File Return to Authority'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
