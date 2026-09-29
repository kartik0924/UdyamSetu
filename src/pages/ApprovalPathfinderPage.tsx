import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  FileText,
  Building2,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { ApprovalDependencyGraph } from '../components/graph/ApprovalDependencyGraph';
import { useApp } from '../context/AppContext';
import { ApprovalItem } from '../types';
import { useNavigate } from 'react-router-dom';

export const ApprovalPathfinderPage: React.FC = () => {
  const { currentProject, approvals, submitApplication } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'GRAPH' | 'LIST'>('GRAPH');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');

  const filteredApprovals = approvals.filter(
    (a) => selectedDeptFilter === 'ALL' || a.department === selectedDeptFilter
  );

  const departmentsList = Array.from(new Set(approvals.map((a) => a.department)));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              AI Approval Pathfinder
            </h1>
            <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
              Interactive 3D Dependency Graph
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Deterministic statutory sequencing & parallel path identification for {currentProject.name}
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('GRAPH')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'GRAPH'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            3D Dependency Graph
          </button>
          <button
            onClick={() => setActiveTab('LIST')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'LIST'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Statutory Dossier List ({approvals.length})
          </button>
        </div>
      </div>

      {/* Statutory Disclaimer Strip */}
      <div className="p-3 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 flex items-start gap-2.5 text-xs text-teal-900 dark:text-teal-200">
        <Info className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Statutory Applicability Notice: </span>
          Approvals marked are <span className="underline font-semibold">Potentially Applicable</span> based on project parameters (₹{currentProject.investmentCr} Cr Capex, Food Processing, {currentProject.pollutionCategory} Category). Final applicability remains subject to competent statutory authorities and formal gazetted rules.
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'GRAPH' ? (
        <div className="space-y-4">
          <ApprovalDependencyGraph />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Department Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Department:
            </span>
            <button
              onClick={() => setSelectedDeptFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedDeptFilter === 'ALL'
                  ? 'bg-slate-900 text-white dark:bg-teal-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              All Departments ({approvals.length})
            </button>
            {departmentsList.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDeptFilter(dept)}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedDeptFilter === dept
                    ? 'bg-slate-900 text-white dark:bg-teal-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Detailed Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredApprovals.map((appr) => (
              <div
                key={appr.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                      {appr.department}
                    </span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                        appr.status === 'APPROVED'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                          : appr.status === 'QUERY_RAISED'
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {appr.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                    {appr.name}
                  </h3>

                  <div className="text-[11px] text-slate-500 font-mono">
                    Statutory Act: {appr.actName}
                  </div>

                  {/* Why it may apply */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-teal-600" />
                      Why This May Apply:
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {appr.whyRequired}
                    </p>
                    <div className="text-[10px] text-teal-700 dark:text-teal-400 pt-1 font-medium">
                      Trigger: {appr.trigger}
                    </div>
                  </div>

                  {/* Prerequisites & Parallel */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-lg bg-slate-100/50 dark:bg-slate-800/30">
                      <span className="text-slate-400 text-[10px] block">Prerequisites</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {appr.prerequisites.length === 0 ? 'None (Entry)' : `${appr.prerequisites.length} prior approvals`}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-100/50 dark:bg-slate-800/30">
                      <span className="text-slate-400 text-[10px] block">Execution</span>
                      <span className="font-semibold text-teal-600 dark:text-teal-400">
                        {appr.canRunParallel ? '⚡ Parallel Path' : 'Sequential'}
                      </span>
                    </div>
                  </div>

                  {/* Next Action */}
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Next Action: </span>
                    {appr.nextAction}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-slate-400">
                    Ref: {appr.sourceRef.slice(0, 24)}...
                  </span>
                  <div className="flex items-center gap-2">
                    {appr.status === 'PRE_VALIDATION' && (
                      <button
                        onClick={() => submitApplication(appr.id)}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs transition-colors"
                      >
                        Submit Docket
                      </button>
                    )}
                    <button
                      onClick={() => navigate('/documents')}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
                    >
                      Documents
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
