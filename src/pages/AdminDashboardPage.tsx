import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  Shield,
  Layers,
  BarChart3,
  Clock,
  AlertTriangle,
  Building2,
  RefreshCw,
  History,
  CheckCircle2,
  TrendingUp,
  Eye,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SYNTHETIC_DEPARTMENT_STATS } from '../data/demoData';
import { EntrepreneurRequestDossierModal } from '../components/dossier/EntrepreneurRequestDossierModal';

export const AdminDashboardPage: React.FC = () => {
  const { approvals, slas, auditLogs, resetToDemoData, currentProject, documents } = useApp();

  const [slaFilter, setSlaFilter] = useState('ALL');
  const [dossierOpen, setDossierOpen] = useState(false);

  // Prepare chart data
  const deptChartData = SYNTHETIC_DEPARTMENT_STATS.map((d) => ({
    name: d.department.slice(0, 10),
    fullName: d.department,
    cases: d.totalCases,
    avgDays: d.avgDays,
    compliance: d.slaCompliance,
  }));

  const stageData = [
    { name: 'Under Scrutiny', count: 4, color: '#3b82f6' },
    { name: 'Query Raised', count: 2, color: '#f59e0b' },
    { name: 'Inspection Scheduled', count: 2, color: '#06b6d4' },
    { name: 'Approved', count: 2, color: '#10b981' },
    { name: 'Pre-Validation', count: 2, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              State & National Executive Oversight
            </h1>
            <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
              BRAP 2024 Analytics
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Departmental workload distribution, statutory bottleneck monitoring, and cross-state synthetic SLAs
          </p>
        </div>

        <button
          onClick={resetToDemoData}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Benchmark Demo Data</span>
        </button>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">TOTAL STATE PROJECTS</span>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">1,482</div>
          <span className="text-[10px] text-teal-600 font-semibold">+18% YoY Investment</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">ACTIVE STATUTORY CASES</span>
          <div className="text-3xl font-black text-blue-600 mt-1">919</div>
          <span className="text-[10px] text-slate-500">Across 13 statutory bodies</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">SLA RISK FLAGS</span>
          <div className="text-3xl font-black text-amber-600 mt-1">14</div>
          <span className="text-[10px] text-amber-700 font-semibold">Approaching 80% duration</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">SLA COMPLIANCE INDEX</span>
          <div className="text-3xl font-black text-emerald-600 mt-1">89.4%</div>
          <span className="text-[10px] text-slate-500">Synthetic state benchmark</span>
        </div>
      </div>

      {/* Current Single-Window Enterprise Docket */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-50 via-teal-50/20 to-blue-50/20 dark:from-slate-900 dark:via-teal-950/20 dark:to-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/60 px-2 py-0.5 rounded">
              CURRENT SINGLE-WINDOW ENTERPRISE DOCKET
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
            onClick={() => setDossierOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>उद्यमी का सारा डेटा एवं दस्तावेज़ देखें ({documents.length} Files) →</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] block">Managing Director:</span>
            <strong className="text-slate-800 dark:text-slate-200">{currentProject.promoterName}</strong>
            <div className="text-[10px] text-slate-500 font-mono">DIN: {currentProject.promoterDin || '08942180'}</div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Industrial Plot Location:</span>
            <strong className="text-slate-800 dark:text-slate-200">{currentProject.plotNumber || 'Plot C-14 to C-16'}</strong>
            <div className="text-[10px] text-slate-500 truncate">{currentProject.location}</div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Capital Outlay & Employment:</span>
            <strong className="text-slate-800 dark:text-slate-200">₹{currentProject.investmentCr} Cr · {currentProject.employees} Workers</strong>
            <div className="text-[10px] text-slate-500">{currentProject.sector}</div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Clearance Health & Stream:</span>
            <strong className="text-slate-800 dark:text-slate-200">{currentProject.submissionReadiness}% Pre-Validated</strong>
            <div className="text-[10px] font-semibold text-emerald-600">{currentProject.pollutionCategory} Category Unit</div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Department Workload Cases */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Statutory Applications by Department
              </h3>
              <p className="text-[11px] text-slate-500">Active caseload across key regulatory directorates</p>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
              Synthetic
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" fontSize={11} stroke="#94a3b8" />
                <YAxis fontSize={11} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="cases" fill="#0d9488" radius={[6, 6, 0, 0]} name="Active Cases" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Average Synthetic Processing Days */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Average Processing Timeline (Days)
              </h3>
              <p className="text-[11px] text-slate-500">Historical synthetic turnaround per department</p>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
              Turnaround
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" fontSize={11} stroke="#94a3b8" />
                <YAxis fontSize={11} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="avgDays" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Avg Days" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SLA Risk Table & Bottleneck Analysis */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Approval Bottleneck & SLA Escalation Matrix
            </h3>
            <p className="text-xs text-slate-500">Applications approaching statutory timeline thresholds</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Statutory Approval</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Standard SLA</th>
                <th className="py-3 px-4">Elapsed Duration</th>
                <th className="py-3 px-4">Statutory Status</th>
                <th className="py-3 px-4">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {slas.map((s) => (
                <tr key={s.approvalId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {s.approvalName}
                  </td>
                  <td className="py-3 px-4">{s.department}</td>
                  <td className="py-3 px-4">{s.standardDays} Days</td>
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {s.elapsedDays} Days
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        s.slaStatus === 'APPROACHING'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                      }`}
                    >
                      {s.slaStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px]">{s.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complete Entrepreneur Request Dossier Modal */}
      <EntrepreneurRequestDossierModal
        isOpen={dossierOpen}
        onClose={() => setDossierOpen(false)}
      />
    </div>
  );
};

