import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  Sparkles,
  GitBranch,
  FileCheck2,
  Building2,
  Flame,
  CheckCircle,
  Shield,
  Layers,
  Zap,
  BarChart3,
  Award,
  ChevronRight,
  ExternalLink,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const { switchRole } = useApp();
  const navigate = useNavigate();

  const handleStartDemo = () => {
    navigate('/login');
  };

  const journeySteps = [
    { num: '01', title: 'Project Intent', desc: 'Enterprise profile, capex & site parameters', icon: Building2 },
    { num: '02', title: 'AI Discovery', desc: 'Potentially applicable approvals mapped', icon: Sparkles },
    { num: '03', title: 'Dependency Graph', desc: 'Prerequisite vs parallel statutory pipelines', icon: GitBranch },
    { num: '04', title: 'Document Intelligence', desc: 'Pre-validation & scan quality check', icon: FileCheck2 },
    { num: '05', title: 'Parallel Scrutiny', desc: 'Concurrent department review', icon: Layers },
    { num: '06', title: 'Coordinated Inspection', desc: 'Joint site visits across authorities', icon: Flame },
    { num: '07', title: 'Authorised Decision', desc: 'Statutory grant by competent officer', icon: Shield },
    { num: '08', title: 'Compliance Continuum', desc: 'Lifelong renewals & returns', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-teal-900 text-white text-[11px] py-2 px-4 border-b border-teal-500/20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-teal-500/30 text-teal-200 border border-teal-400/40 font-bold px-2 py-0.5 rounded text-[10px] tracking-wide uppercase">
              Smart India Hackathon 2026 Prototype
            </span>
            <span className="hidden sm:inline text-slate-300">
              Problem Statement: “Efficiency in streamlining industrial approvals & compliance processes”
            </span>
          </div>
          <div className="flex items-center gap-3 text-teal-200 font-medium">
            <Link to="/about" className="hover:underline flex items-center gap-1">
              Statutory Governance Model <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-teal-800 text-white shadow-md">
              <svg className="w-6 h-6 text-teal-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 21h18M5 21V7l7-4 7 4v14M9 10h6M9 14h6M9 18h6" />
                <circle cx="12" cy="11" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div>
              <div className="font-extrabold tracking-tight text-lg text-slate-900 dark:text-white">
                UDYAMSETU
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5">
                Regulation-to-Action Orchestration
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/about"
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              How It Works
            </Link>
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Sign In
            </Link>
            <button
              onClick={() => handleStartDemo()}
              className="text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5"
            >
              <span>Explore Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Not another application portal — an intelligent orchestration layer</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            From Regulatory Complexity <br />
            <span className="bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              to Predictable Industrial Execution.
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            An intelligent orchestration platform that connects project requirements, approvals, documents, departments,
            inspections, compliance and government support into one coordinated industrial journey.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => handleStartDemo()}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-sm shadow-xl shadow-slate-900/10 hover:shadow-2xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>Start Industrial Journey</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/pathfinder"
              className="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-sm hover:border-teal-500 shadow-sm transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Explore Approval Pathfinder</span>
            </Link>
          </div>

          {/* Demo Project Pill */}
          <div className="pt-4 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Featured Demo Unit:</span>
            <span>Mithila Foods Pvt. Ltd. (₹8 Cr Food Processing Unit, BIADA Hajipur, Bihar)</span>
          </div>
        </div>

        {/* 3D Approval Journey Visualization Strip */}
        <div className="max-w-7xl mx-auto mt-14">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
                  The End-to-End Orchestrated Journey
                </h3>
                <p className="text-[11px] text-slate-500">
                  Continuous data continuum from statutory filing to commercial compliance
                </p>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 px-2.5 py-1 rounded-md">
                8 Integrated Stages
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {journeySteps.map((step) => (
                <div
                  key={step.num}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-teal-500/50 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 font-mono">
                        {step.num}
                      </span>
                      <step.icon className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                    </div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {step.title}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-2 line-clamp-2 leading-tight">
                    {step.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Value Pillars */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Architecture for Statutory Acceleration
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Engineered to overcome bureaucratic serial bottlenecks with transparent rules and AI intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-all space-y-3 relative overflow-hidden group">
            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center font-bold">
              <GitBranch className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              PROJECT-TO-APPROVAL GRAPH
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Understand what statutory approvals may apply and why based on sector, water discharge, power load, and zoning parameters.
            </p>
            <div className="pt-2 text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <Link to="/pathfinder">Explore Dependency Graph →</Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-all space-y-3 relative overflow-hidden group">
            <div className="h-10 w-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              PARALLEL-PATH ORCHESTRATION
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Identify approval activities that can progress independently. Run Pollution CTE and Fire NOC simultaneously to reduce time-to-production by weeks.
            </p>
            <div className="pt-2 text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <Link to="/applications">View Parallel Workflows →</Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-all space-y-3 relative overflow-hidden group">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center font-bold">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              APPROVAL-TO-COMPLIANCE CONTINUUM
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Continue the journey after approval. Seamlessly transition from statutory NOCs to automated renewal calendars, environmental returns, and subsidy disbursements.
            </p>
            <div className="pt-2 text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <Link to="/compliance">Check Compliance Tracker →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statutory Governance & Authority Notice */}
      <section className="py-8 px-4 border-t border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400">
          <Info className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-bold text-slate-800 dark:text-slate-200">Statutory Notice: </span>
            UDYAMSETU provides intelligent decision support and workflow orchestration. Deterministic statutory rules govern applicability;
            all legal, scrutiny, inspection, and sanction powers reside exclusively with authorized departmental officers under gazetted acts.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            UDYAMSETU — Smart India Hackathon 2026 Prototype
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/about" className="hover:underline">Transparency & Architecture</Link>
            <span>·</span>
            <Link to="/login" className="hover:underline">Multi-Role Portal</Link>
            <span>·</span>
            <Link to="/login" className="hover:underline font-semibold text-teal-600">Enter Platform</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
