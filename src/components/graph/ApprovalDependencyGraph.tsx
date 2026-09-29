import React, { useState, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  Node,
  Edge,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CustomApprovalNode } from './CustomApprovalNode';
import { useApp } from '../../context/AppContext';
import { ApprovalItem } from '../../types';
import {
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  FileText,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  X,
  Play,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const nodeTypes = {
  customApproval: CustomApprovalNode,
};

export const ApprovalDependencyGraph: React.FC = () => {
  const { currentProject, approvals, dependencies, submitApplication } = useApp();
  const navigate = useNavigate();

  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'PARALLEL' | 'IN_PROGRESS'>('ALL');
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(null);
  const [showWhyModal, setShowWhyModal] = useState<boolean>(false);

  // Build nodes from approvals + central project node
  const nodes: Node[] = useMemo(() => {
    const list: Node[] = [];

    // Central Project Node
    list.push({
      id: 'node_project_root',
      type: 'customApproval',
      position: { x: 380, y: 220 },
      data: {
        isProjectCenter: true,
        projectInfo: {
          name: currentProject.name,
          investment: `₹${currentProject.investmentCr} Cr`,
          employees: currentProject.employees,
          sector: currentProject.sector,
        },
      },
    });

    // Positions mapping for neat radial / parallel pipeline layout
    const positions: Record<string, { x: number; y: number }> = {
      appr_01: { x: 40, y: 150 }, // Udyam
      appr_02: { x: 40, y: 320 }, // Land Allotment
      appr_03: { x: 740, y: 40 }, // Pollution CTE
      appr_05: { x: 740, y: 180 }, // Fire Safety NOC
      appr_04: { x: 740, y: 320 }, // Industries Approval
      appr_07: { x: 740, y: 460 }, // Power Sanction
      appr_06: { x: 1100, y: 120 }, // Factory Plan
      appr_08: { x: 1100, y: 300 }, // FSSAI
    };

    approvals.forEach((appr) => {
      const pos = positions[appr.id] || { x: 600, y: 300 };
      list.push({
        id: appr.id,
        type: 'customApproval',
        position: pos,
        data: {
          approval: appr,
        },
      });
    });

    return list;
  }, [currentProject, approvals]);

  // Build edges
  const edges: Edge[] = useMemo(() => {
    const list: Edge[] = [];

    // Connect project root to foundational prerequisites
    list.push({
      id: 'edge_root_udyam',
      source: 'node_project_root',
      sourceHandle: 'left',
      target: 'appr_01',
      targetHandle: 'source-right',
      animated: true,
      style: { stroke: '#0d9488', strokeWidth: 2 },
    });
    list.push({
      id: 'edge_root_land',
      source: 'node_project_root',
      sourceHandle: 'left',
      target: 'appr_02',
      targetHandle: 'source-right',
      animated: true,
      style: { stroke: '#0d9488', strokeWidth: 2 },
    });

    // Approval dependencies
    dependencies.forEach((dep) => {
      const isParallel = dep.type === 'parallel';
      const isPrereq = dep.type === 'prerequisite';

      list.push({
        id: dep.id,
        source: dep.sourceId,
        sourceHandle: 'source-right',
        target: dep.targetId,
        targetHandle: 'target-left',
        animated: isParallel || isPrereq,
        label: isParallel ? '⚡ Parallel' : dep.label,
        labelStyle: { fontSize: '10px', fill: isParallel ? '#0d9488' : '#64748b', fontWeight: 600 },
        labelBgStyle: { fill: '#ffffff', fillOpacity: 0.85, rx: 4 },
        style: {
          stroke: isParallel ? '#14b8a6' : isPrereq ? '#3b82f6' : '#f59e0b',
          strokeWidth: isParallel ? 2.5 : 2,
          strokeDasharray: isParallel ? '5 5' : undefined,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isParallel ? '#14b8a6' : isPrereq ? '#3b82f6' : '#f59e0b',
        },
      });
    });

    return list;
  }, [dependencies]);

  // Node click handler
  const onNodeClick = (_: any, node: Node) => {
    if (node.id === 'node_project_root') return;
    const found = approvals.find((a) => a.id === node.id);
    if (found) {
      setSelectedApproval(found);
    }
  };

  return (
    <div className="relative w-full h-[620px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900/5 dark:bg-slate-950/60 overflow-hidden shadow-inner flex flex-col">
      {/* Top Overlay Legend & Filter Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 p-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-md">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'ALL'
                ? 'bg-slate-900 text-white dark:bg-teal-500 dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            All 8 Approvals
          </button>
          <button
            onClick={() => setFilter('PARALLEL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filter === 'PARALLEL'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-teal-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Parallel Paths (Saves 21 Days)
          </button>
        </div>

        {/* Legend */}
        <div className="pointer-events-auto hidden sm:flex items-center gap-4 px-4 py-2 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-md text-[11px] font-medium text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-blue-500 rounded" />
            <span>Prerequisite</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-teal-500" />
            <span className="text-teal-600 dark:text-teal-400 font-semibold">Parallel Action</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-amber-500 rounded" />
            <span>Dependent Stage</span>
          </div>
        </div>
      </div>

      {/* Main Flow Canvas */}
      <div className="flex-1 w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.5}
          maxZoom={1.5}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1.2} color="#94a3b8" />
          <Controls className="!bg-white dark:!bg-slate-800 !border-slate-200 dark:!border-slate-700 !shadow-lg" />
          <MiniMap
            nodeStrokeColor="#0d9488"
            nodeColor="#cbd5e1"
            className="!bg-white/80 dark:!bg-slate-900/80 !border-slate-200 dark:!border-slate-700 rounded-xl overflow-hidden"
          />
        </ReactFlow>
      </div>

      {/* Statutory Disclaimer Strip */}
      <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 text-[11px] text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
          <span>
            AI-orchestrated dependency sequence. Statutory decisions remain with authorized departmental officers.
          </span>
        </div>
        <span className="hidden md:inline font-mono text-[10px] text-slate-400">
          Act Ref: BRAP-2024 / NSWS-Schema-v2
        </span>
      </div>

      {/* 3D Depth Detail Modal when a node is clicked */}
      {selectedApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            style={{
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(15, 23, 42, 0.05)',
            }}
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-teal-900 text-white relative">
              <button
                onClick={() => setSelectedApproval(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-[11px] font-bold uppercase tracking-wider text-teal-300 mb-1">
                {selectedApproval.department} · {selectedApproval.category}
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">{selectedApproval.name}</h2>
              <p className="text-xs text-slate-300 mt-1">{selectedApproval.actName}</p>

              {/* Status pill in header */}
              <div className="mt-3 flex items-center gap-3 text-xs">
                <span className="px-2.5 py-0.5 rounded-md font-semibold bg-white/20 text-white backdrop-blur-md">
                  Status: {selectedApproval.status.replace('_', ' ')}
                </span>
                <span className="text-teal-200">SLA: {selectedApproval.estimatedDays} Working Days</span>
                {selectedApproval.fee > 0 ? (
                  <span className="text-slate-300">Govt Fee: ₹{selectedApproval.fee.toLocaleString()}</span>
                ) : (
                  <span className="text-emerald-300 font-medium">Zero Fee (MSME Exemption)</span>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
              {/* Why It May Apply */}
              <div className="p-4 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/60">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="font-bold text-xs text-teal-950 dark:text-teal-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    Why This Approval May Apply
                  </div>
                  <span className="text-[10px] font-medium text-teal-600 dark:text-teal-400">
                    Potentially Applicable
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedApproval.whyRequired}
                </p>
                <div className="mt-2.5 pt-2 border-t border-teal-200/60 dark:border-teal-800/60 text-[11px] text-teal-800 dark:text-teal-300">
                  <span className="font-semibold">Project Trigger: </span>
                  {selectedApproval.trigger}
                </div>
              </div>

              {/* Dependencies & Parallel Action */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Prerequisites
                  </div>
                  {selectedApproval.prerequisites.length === 0 ? (
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> None. Foundational entry point.
                    </div>
                  ) : (
                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                      {selectedApproval.prerequisites.map((pId) => {
                        const prereqAppr = approvals.find((a) => a.id === pId);
                        return (
                          <li key={pId} className="flex items-center gap-2">
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span>{prereqAppr ? prereqAppr.name : pId}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Execution Mode
                  </div>
                  {selectedApproval.canRunParallel ? (
                    <div>
                      <div className="text-xs text-teal-700 dark:text-teal-300 font-semibold flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-teal-500" /> Parallel Path Eligible
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                        Can progress simultaneously with Fire & Power workflows without blocking civil works.
                      </p>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      Sequential statutory dependency. Requires preceding NOCs to be fully sanctioned.
                    </div>
                  )}
                </div>
              </div>

              {/* Statutory Citation / Rule Reference */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/80 flex items-start gap-3">
                <FileText className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    Statutory Source & Legal Reference:
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 font-mono text-[11px] mt-0.5">
                    {selectedApproval.sourceRef}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Sanctioning Authority: {selectedApproval.statutoryAuthority}
                  </div>
                </div>
              </div>

              {/* Current Next Action */}
              <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 text-xs">
                <span className="font-bold text-amber-800 dark:text-amber-200">Next Statutory Action: </span>
                <span className="text-slate-700 dark:text-slate-300">{selectedApproval.nextAction}</span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  setSelectedApproval(null);
                  navigate('/documents');
                }}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Inspect Attached Documents
              </button>

              <div className="flex items-center gap-2">
                {selectedApproval.status === 'PRE_VALIDATION' && (
                  <button
                    onClick={() => {
                      submitApplication(selectedApproval.id);
                      setSelectedApproval(null);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    <Play className="w-3.5 h-3.5" /> Submit Application to Department
                  </button>
                )}
                {selectedApproval.status === 'QUERY_RAISED' && (
                  <button
                    onClick={() => {
                      setSelectedApproval(null);
                      navigate('/queries');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    <AlertCircle className="w-3.5 h-3.5" /> View Raised Query & Respond
                  </button>
                )}
                <button
                  onClick={() => setSelectedApproval(null)}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white dark:bg-slate-700 hover:bg-slate-800 text-xs font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
