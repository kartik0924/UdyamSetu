import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Compass,
  FileCheck2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Flame,
  FileWarning,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FolderOpen,
  FileText,
  Upload,
  Plus,
  Edit3,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DocumentItem } from '../types';
import { aiService, AIAnalysisResult } from '../services/aiService';
import { DocumentEntryModal } from '../components/documents/DocumentEntryModal';

export const EntrepreneurDashboard: React.FC = () => {
  const {
    currentProject,
    currentUser,
    approvals,
    documents,
    queries,
    inspections,
    compliance,
    slas,
    uploadDocument,
  } = useApp();
  const navigate = useNavigate();

  // Government officers must never see the Entrepreneur Dashboard
  React.useEffect(() => {
    if (currentUser.role !== 'ENTREPRENEUR') {
      const getOfficerPortal = () => {
        switch (currentUser.role) {
          case 'DEPARTMENT_OFFICER':
            return '/department-scrutiny';
          case 'INSPECTOR':
            return '/inspector-portal';
          case 'DISTRICT_ADMIN':
            return '/district-dashboard';
          case 'STATE_ADMIN':
          case 'SUPER_ADMIN':
            return '/admin';
          default:
            return '/department-scrutiny';
        }
      };
      navigate(getOfficerPortal(), { replace: true });
    }
  }, [currentUser.role, navigate]);

  if (currentUser.role !== 'ENTREPRENEUR') {
    return null;
  }

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [entryModalOpen, setEntryModalOpen] = useState(false);
  const [selectedDocToEdit, setSelectedDocToEdit] = useState<DocumentItem | null>(null);

  // Computed metrics
  const totalApprovals = approvals.length;
  const approvedCount = approvals.filter((a) => a.status === 'APPROVED').length;
  const inProgressCount = approvals.filter(
    (a) => ['UNDER_SCRUTINY', 'INSPECTION_SCHEDULED', 'QUERY_RAISED', 'QUERY_RESPONDED', 'SUBMITTED', 'DECISION_PENDING'].includes(a.status)
  ).length;
  const pendingCount = approvals.filter((a) => ['NOT_STARTED', 'PRE_VALIDATION'].includes(a.status)).length;

  const totalDocs = documents.length;
  const validatedDocs = documents.filter((d) => d.status === 'VALID').length;
  const attentionDocs = documents.filter((d) => d.status === 'NEEDS_ATTENTION').length;
  const missingDocs = documents.filter((d) => d.status === 'MISSING').length;

  const pendingQuery = queries.find((q) => q.status === 'PENDING_RESPONSE');
  const upcomingInspection = inspections.find((i) => i.status === 'SCHEDULED');
  const nextCompliance = compliance.find((c) => c.status === 'DUE_SOON' || c.status === 'UPCOMING');

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await aiService.analyzeProject(currentProject);
      setAnalysisResult(res);
      setShowAnalysisModal(true);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Headline */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-teal-950 text-white p-6 sm:p-8 relative overflow-hidden shadow-xl border border-teal-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Regulation-to-Action Orchestration Active</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Your industrial journey, intelligently orchestrated.
          </h1>

          <p className="text-xs sm:text-sm text-teal-100/80 leading-relaxed font-normal">
            From project intent to approvals, compliance and government support — UdyamSetu connects the journey.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleRunAnalysis}
              disabled={analyzing}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing Project with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze Project with AI</span>
                </>
              )}
            </button>

            <Link
              to="/pathfinder"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-2"
            >
              <Compass className="w-3.5 h-3.5 text-teal-300" />
              <span>Explore Dependency Graph</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Critical Action Banner if query is pending */}
      {pendingQuery && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-950 dark:text-amber-200">
                Action Required: Statutory Scrutiny Query Raised by {pendingQuery.department}
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300/90 mt-0.5 line-clamp-1">
                {pendingQuery.subject} — Due by {new Date(pendingQuery.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Link
            to="/queries"
            className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs whitespace-nowrap shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>Respond & Upload Documents</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* 4 Elevated Overview 3D Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Project Status */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold uppercase tracking-wider text-[10px]">PROJECT STATUS</span>
            <span className="text-teal-600 dark:text-teal-400 font-semibold">{currentProject.status}</span>
          </div>
          <div className="font-extrabold text-base text-slate-900 dark:text-white truncate">
            {currentProject.name}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            ₹{currentProject.investmentCr} Cr Capex · {currentProject.employees} Workers
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">Submission Readiness</span>
            <span className="font-bold text-teal-600 dark:text-teal-400">{currentProject.submissionReadiness}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className="bg-teal-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${currentProject.submissionReadiness}%` }}
            />
          </div>
        </div>

        {/* Card 2: Approvals Status */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold uppercase tracking-wider text-[10px]">APPROVALS</span>
            <Link to="/pathfinder" className="text-teal-600 dark:text-teal-400 hover:underline font-semibold text-[11px]">
              View Graph →
            </Link>
          </div>
          <div className="font-extrabold text-2xl text-slate-900 dark:text-white">
            {totalApprovals}{' '}
            <span className="text-xs font-normal text-slate-500">Potentially Applicable</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <div className="font-bold text-blue-600 dark:text-blue-400">{inProgressCount}</div>
              <div className="text-[10px] text-slate-500">In Progress</div>
            </div>
            <div>
              <div className="font-bold text-emerald-600 dark:text-emerald-400">{approvedCount}</div>
              <div className="text-[10px] text-slate-500">Completed</div>
            </div>
            <div>
              <div className="font-bold text-slate-600 dark:text-slate-400">{pendingCount}</div>
              <div className="text-[10px] text-slate-500">Pending</div>
            </div>
          </div>
        </div>

        {/* Card 3: Documents Status */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold uppercase tracking-wider text-[10px]">DOCUMENTS</span>
            <Link to="/documents" className="text-teal-600 dark:text-teal-400 hover:underline font-semibold text-[11px]">
              Manage →
            </Link>
          </div>
          <div className="font-extrabold text-2xl text-slate-900 dark:text-white">
            {totalDocs}{' '}
            <span className="text-xs font-normal text-slate-500">Uploaded</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1 text-center text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <div className="font-bold text-emerald-600">{validatedDocs}</div>
              <div className="text-[10px] text-slate-500">Validated</div>
            </div>
            <div>
              <div className="font-bold text-amber-600">{attentionDocs}</div>
              <div className="text-[10px] text-slate-500">Needs Attn</div>
            </div>
            <div>
              <div className="font-bold text-red-600">{missingDocs}</div>
              <div className="text-[10px] text-slate-500">Missing</div>
            </div>
          </div>
        </div>

        {/* Card 4: Estimated Processing Insight */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold uppercase tracking-wider text-[10px]">ESTIMATED PROCESS STATUS</span>
            <span className="text-[10px] text-teal-600 font-semibold">AI Prediction</span>
          </div>
          <div className="font-extrabold text-xl text-slate-900 dark:text-white">
            12 – 18 <span className="text-xs font-normal text-slate-500">Working Days</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 leading-tight">
            Prototype prediction based on synthetic historical benchmarks (Bihar Food Processing cluster).
          </p>
          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Next Renewal</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {nextCompliance ? nextCompliance.obligationName.slice(0, 16) + '...' : 'FSSAI Return'}
            </span>
          </div>
        </div>
      </div>

      {/* Statutory Document Filing & Upload Center Card (दस्तावेज़ भरने एवं अपलोड करने का केंद्र) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
              <FolderOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  दस्तावेज़ भरने एवं अपलोड करने का केंद्र (Statutory Document Filing & Upload Center)
                </h2>
                <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                  {validatedDocs} / {totalDocs} Files Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                भूमि पट्टा, ईटीपी (ETP) डिज़ाइन, स्ट्रक्चरल प्रमाण-पत्र, अग्निशमन लेआउट, व 11kV बिजली कनेक्शन प्रपत्र भरने व अपलोड करने की सुविधा।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setSelectedDocToEdit(null);
                setEntryModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ नया दस्तावेज़ भरें और डालें</span>
            </button>

            <Link
              to="/documents"
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
            >
              <span>पूर्ण चेकलिस्ट देखें</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Quick Document Status Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {documents.slice(0, 4).map((doc) => (
            <div
              key={doc.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between gap-2"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="font-semibold text-slate-400 uppercase">{doc.category}</span>
                  <span
                    className={`font-bold px-1.5 py-0.5 rounded text-[9px] ${
                      doc.status === 'VALID'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                    }`}
                  >
                    {doc.status === 'VALID' ? 'सत्यापित' : 'जांच योग्य'}
                  </span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                  {doc.name}
                </div>
                <div className="text-[10px] font-mono text-slate-500 truncate mt-0.5">
                  {doc.documentNumber || doc.issuingAuthority || 'Empaneled Consultant'}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">{doc.size} · {doc.fileType}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDocToEdit(doc);
                    setEntryModalOpen(true);
                  }}
                  className="text-teal-600 dark:text-teal-400 hover:underline font-bold text-[11px] flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>विवरण भरें / बदलें</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Active Approvals Table & Side Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Approvals Pipeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
                  Potentially Applicable Approvals ({approvals.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Statutory approvals mapped to Mithila Foods Pvt. Ltd.'s physical and sector profile
                </p>
              </div>
              <Link
                to="/pathfinder"
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                <span>3D Pathfinder</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {approvals.map((appr) => (
                <div key={appr.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {appr.name}
                      </span>
                      {appr.canRunParallel && (
                        <span className="text-[9px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 px-1.5 py-0.5 rounded">
                          Parallel
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {appr.department} · {appr.actName}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Trigger: {appr.trigger}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span
                      className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase ${
                        appr.status === 'APPROVED'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                          : appr.status === 'QUERY_RAISED'
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 animate-pulse'
                          : ['UNDER_SCRUTINY', 'INSPECTION_SCHEDULED'].includes(appr.status)
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {appr.status.replace('_', ' ')}
                    </span>
                    <Link
                      to="/pathfinder"
                      className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Actions, SLA Tracking, Inspections */}
        <div className="space-y-6">
          {/* Scheduled Inspection Card */}
          {upcomingInspection && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  NEXT SITE INSPECTION
                </span>
                <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded">
                  Confirmed
                </span>
              </div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">
                {upcomingInspection.approvalName}
              </div>
              <div className="text-xs text-slate-500">
                Inspector: <span className="font-medium text-slate-800 dark:text-slate-200">{upcomingInspection.inspectorName}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{new Date(upcomingInspection.scheduledDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </div>
              {upcomingInspection.coordinatedWindow && (
                <div className="p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 text-[11px] text-teal-800 dark:text-teal-300">
                  <span className="font-semibold">Coordinated Inspection Window: </span>
                  {upcomingInspection.coordinatedWindow}
                </div>
              )}
              <Link
                to="/inspections"
                className="block text-center w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
              >
                View Checklist & Site Prep
              </Link>
            </div>
          )}

          {/* SLA Tracking Snapshot */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                STATUTORY SLA TRACKING
              </span>
              <span className="text-[10px] text-slate-500 font-mono">BRAP Standard</span>
            </div>
            <div className="space-y-2.5">
              {slas.map((sla) => (
                <div key={sla.approvalId} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[170px]">
                      {sla.approvalName}
                    </span>
                    <span
                      className={`text-[10px] font-bold ${
                        sla.slaStatus === 'APPROACHING' ? 'text-amber-600' : 'text-emerald-600'
                      }`}
                    >
                      {sla.elapsedDays} / {sla.standardDays} Days
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1 overflow-hidden">
                    <div
                      className={`h-1 rounded-full ${
                        sla.slaStatus === 'APPROACHING' ? 'bg-amber-500' : 'bg-teal-500'
                      }`}
                      style={{ width: `${Math.min(100, (sla.elapsedDays / sla.standardDays) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Project Analysis Modal */}
      {showAnalysisModal && analysisResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>AI Project Discovery & Strategic Analysis</span>
              </div>
              <button
                onClick={() => setShowAnalysisModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {analysisResult.summary}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                Critical Path Approvals Sequence:
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                {analysisResult.criticalPath.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="font-mono text-teal-600 text-[11px]">{idx + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1.5">
              <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                Strategic Recommendations:
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
                {analysisResult.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAnalysisModal(false);
                  navigate('/pathfinder');
                }}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
              >
                Open Approval Pathfinder →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Document Filing & Upload Modal */}
      <DocumentEntryModal
        isOpen={entryModalOpen}
        onClose={() => {
          setEntryModalOpen(false);
          setSelectedDocToEdit(null);
        }}
        documentToEdit={selectedDocToEdit}
        onSave={(docData) => {
          uploadDocument(docData);
          setEntryModalOpen(false);
          setSelectedDocToEdit(null);
        }}
      />
    </div>
  );
};
