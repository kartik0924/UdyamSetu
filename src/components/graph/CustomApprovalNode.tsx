import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  CircleDot,
  FileCheck,
  Building2,
  Flame,
  Shield,
  Zap,
  Sparkles,
} from 'lucide-react';
import { ApprovalItem } from '../../types';

interface CustomNodeData {
  approval?: ApprovalItem;
  isProjectCenter?: boolean;
  projectInfo?: {
    name: string;
    investment: string;
    employees: number;
    sector: string;
  };
}

export const CustomApprovalNode = memo(({ data, selected }: { data: CustomNodeData; selected?: boolean }) => {
  // If this is the central 3D Project Node
  if (data.isProjectCenter && data.projectInfo) {
    return (
      <div
        className={`relative px-5 py-4 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-teal-950 text-white shadow-2xl border-2 transition-all duration-300 transform-gpu ${
          selected ? 'ring-4 ring-teal-400 scale-105 border-teal-400' : 'border-teal-500/40 hover:scale-102 hover:border-teal-400'
        }`}
        style={{
          boxShadow: '0 20px 35px -10px rgba(13, 148, 136, 0.3), 0 0 20px rgba(20, 184, 166, 0.2)',
          minWidth: '220px',
        }}
      >
        <Handle type="source" position={Position.Right} id="right" className="!bg-teal-400 !w-3 !h-3" />
        <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-teal-400 !w-3 !h-3" />
        <Handle type="source" position={Position.Top} id="top" className="!bg-teal-400 !w-3 !h-3" />
        <Handle type="source" position={Position.Left} id="left" className="!bg-teal-400 !w-3 !h-3" />

        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300">
            <Building2 className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-teal-300">
            PROJECT ANCHOR
          </span>
        </div>

        <div className="font-extrabold text-sm tracking-tight text-white line-clamp-1">
          {data.projectInfo.name}
        </div>
        <div className="text-[11px] text-teal-200/80 mt-0.5 truncate">
          {data.projectInfo.sector}
        </div>

        <div className="mt-3 pt-2 border-t border-teal-500/30 grid grid-cols-2 gap-2 text-[10px]">
          <div>
            <div className="text-slate-400">CAPEX</div>
            <div className="font-bold text-white text-xs">{data.projectInfo.investment}</div>
          </div>
          <div>
            <div className="text-slate-400">EMPLOYMENT</div>
            <div className="font-bold text-teal-300 text-xs">{data.projectInfo.employees} Workers</div>
          </div>
        </div>
      </div>
    );
  }

  const appr = data.approval;
  if (!appr) return null;

  // Status visual mapping
  const isApproved = appr.status === 'APPROVED';
  const isInProgress = ['UNDER_SCRUTINY', 'INSPECTION_SCHEDULED', 'QUERY_RAISED', 'QUERY_RESPONDED', 'SUBMITTED', 'DECISION_PENDING'].includes(appr.status);
  const hasQuery = appr.status === 'QUERY_RAISED';

  const statusBorder = isApproved
    ? 'border-emerald-500/70 shadow-emerald-500/10'
    : hasQuery
    ? 'border-amber-500 shadow-amber-500/20 animate-pulse'
    : isInProgress
    ? 'border-blue-500/70 shadow-blue-500/10'
    : 'border-slate-300 dark:border-slate-700';

  const statusBg = isApproved
    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
    : hasQuery
    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
    : isInProgress
    ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';

  const deptIcons: Record<string, any> = {
    'MSME Support': Building2,
    'Land / Revenue': Building2,
    'Pollution Control': CircleDot,
    'Industries': Building2,
    'Fire & Emergency': Flame,
    'Factory / Labour': Shield,
    'Electricity': Zap,
    'Food Safety': CheckCircle2,
  };
  const DeptIcon = deptIcons[appr.department] || Building2;

  return (
    <div
      className={`relative px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border-2 shadow-lg transition-all duration-200 transform-gpu cursor-pointer ${statusBorder} ${
        selected ? 'ring-4 ring-teal-500/30 scale-105' : 'hover:scale-102 hover:shadow-xl'
      }`}
      style={{ minWidth: '220px', maxWidth: '250px' }}
    >
      <Handle type="target" position={Position.Left} id="target-left" className="!bg-slate-400 !w-2.5 !h-2.5" />
      <Handle type="target" position={Position.Top} id="target-top" className="!bg-slate-400 !w-2.5 !h-2.5" />
      <Handle type="source" position={Position.Right} id="source-right" className="!bg-teal-500 !w-2.5 !h-2.5" />
      <Handle type="source" position={Position.Bottom} id="source-bottom" className="!bg-teal-500 !w-2.5 !h-2.5" />

      {/* Header: Department + Status */}
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate">
          <DeptIcon className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
          <span className="truncate">{appr.department}</span>
        </div>
        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider flex-shrink-0 ${statusBg}`}>
          {isApproved ? 'Approved' : hasQuery ? 'Query Raised' : isInProgress ? 'In Progress' : 'Pending'}
        </span>
      </div>

      {/* Approval Name */}
      <div className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 leading-tight">
        {appr.name}
      </div>

      {/* Parallel Execution Badge */}
      {appr.canRunParallel && (
        <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-teal-700 dark:text-teal-300">
          <Sparkles className="w-3 h-3 text-teal-500" />
          <span>Parallel Path Eligible</span>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
        <span>SLA: {appr.estimatedDays} Days</span>
        <span className="font-medium text-teal-600 dark:text-teal-400">Details →</span>
      </div>
    </div>
  );
});
