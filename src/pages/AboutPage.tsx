import React from 'react';
import {
  Shield,
  Layers,
  Sparkles,
  UserCheck,
  CheckCircle2,
  XCircle,
  BookOpen,
  ArrowDown,
  Info,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
          Statutory Governance & AI Ethics
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Transparency & System Architecture
        </h1>
        <p className="text-xs text-slate-500 max-w-xl mx-auto">
          How UDYAMSETU bridges deterministic regulatory compliance rules with intelligent AI decision support while preserving constitutional authority.
        </p>
      </div>

      {/* Core Principle Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-teal-950 text-white text-center space-y-3 shadow-xl border border-teal-500/20">
        <span className="text-[10px] font-bold tracking-widest uppercase text-teal-300">
          CORE PRODUCT PHILOSOPHY
        </span>
        <div className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
          “Rules govern applicability.<br />
          AI assists understanding.<br />
          Authorised officials make statutory decisions.”
        </div>
      </div>

      {/* Tri-Layer Governance Architecture Diagram */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          Tri-Layer Statutory Architecture
        </h2>

        <div className="space-y-4">
          {/* Layer 1: Rules Engine */}
          <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs text-blue-950 dark:text-blue-200">
                <div className="h-6 w-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-mono text-xs">
                  1
                </div>
                <span>RULES ENGINE (Deterministic Statutory Core)</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded">
                Authoritative Code
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Codifies statutory acts, state industrial policies, gazetted pollution classifications, and National Building Code triggers. Deterministically computes which approvals are legally triggered and identifies mathematical parallel paths.
            </p>
          </div>

          <div className="flex justify-center text-slate-400">
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </div>

          {/* Layer 2: AI Engine */}
          <div className="p-5 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs text-teal-950 dark:text-teal-200">
                <div className="h-6 w-6 rounded-lg bg-teal-600 text-white flex items-center justify-center font-mono text-xs">
                  2
                </div>
                <span>AI ENGINE (Gemini Intelligence Layer)</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-teal-600 bg-teal-100 dark:bg-teal-900 px-2 py-0.5 rounded">
                Cognitive Support
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Analyzes unstructured DPRs, architecture schematics, and vendor proformas. Detects missing mandatory signatures, inconsistencies between water balance equations and ETP designs, predicts synthetic timelines, and powers conversational guidance.
            </p>
          </div>

          <div className="flex justify-center text-slate-400">
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </div>

          {/* Layer 3: Human Officer Authority */}
          <div className="p-5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs text-purple-950 dark:text-purple-200">
                <div className="h-6 w-6 rounded-lg bg-purple-600 text-white flex items-center justify-center font-mono text-xs">
                  3
                </div>
                <span>HUMAN GOVERNANCE (Competent Department Officers)</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-purple-600 bg-purple-100 dark:bg-purple-900 px-2 py-0.5 rounded">
                Legal Authority
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Only authorized government scrutiny officers, designated field inspectors, and competent departmental authorities possess the legal power to raise formal statutory queries, conduct physical site verification, and grant official licenses.
            </p>
          </div>
        </div>
      </div>

      {/* What AI Does vs Does NOT Do */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* What AI Does */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-xs text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
            <span>WHAT UDYAMSETU DOES:</span>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-teal-600 font-bold">✓</span>
              <span>Discovers potentially applicable approvals based on project inputs</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 font-bold">✓</span>
              <span>Visualizes prerequisite vs parallel dependencies in an interactive 3D graph</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 font-bold">✓</span>
              <span>Pre-validates documents for missing sections, scan clarity, and registry matches</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 font-bold">✓</span>
              <span>Identifies coordinated inspection windows to reduce site visits</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 font-bold">✓</span>
              <span>Tracks post-approval compliance obligations and matched subsidy schemes</span>
            </li>
          </ul>
        </div>

        {/* What AI Does NOT Do */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-xs text-red-600">
            <XCircle className="w-4 h-4" />
            <span>WHAT UDYAMSETU DOES NOT DO:</span>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span>Does not make binding statutory decisions or issue legal certificates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span>Does not replace physical on-site verification by authorized safety officers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span>Does not guarantee approval or override statutory legislation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span>Does not bypass state pollution control or fire safety standards</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
