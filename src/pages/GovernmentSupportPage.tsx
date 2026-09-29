import React, { useState } from 'react';
import {
  Gift,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  FileText,
  Building2,
  Coins,
  ArrowRight,
  Info,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GovernmentScheme } from '../types';

export const GovernmentSupportPage: React.FC = () => {
  const { schemes, currentProject, applyForScheme } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [selectedScheme, setSelectedScheme] = useState<GovernmentScheme | null>(null);

  const categories = ['ALL', 'Food Processing', 'Capital Subsidy', 'Employment'];

  const filteredSchemes = schemes.filter(
    (s) => categoryFilter === 'ALL' || s.category === categoryFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Government Support & Incentive Discovery
            </h1>
            <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
              AI Incentive Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Potentially relevant capital subsidies, state industrial incentives, and sector grants mapped to {currentProject.name}
          </p>
        </div>
      </div>

      {/* Statutory Disclaimer Notice */}
      <div className="p-3.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 flex items-start gap-2.5 text-xs text-teal-950 dark:text-teal-200">
        <Info className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Potentially Relevant Scheme Notice: </span>
          Incentive matching is AI-assisted decision support based on plant capex (₹{currentProject.investmentCr} Cr), sector ({currentProject.sector}), and local employment ({currentProject.employees} personnel). Verify official eligibility before formal statutory application with respective state nodal agencies.
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
              categoryFilter === cat
                ? 'bg-slate-900 text-white dark:bg-teal-600 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {cat === 'ALL' ? 'All Incentive Schemes' : cat}
          </button>
        ))}
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  {scheme.category}
                </span>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-md">
                  {scheme.maxBenefit}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                  {scheme.schemeName}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  {scheme.ministry} · {scheme.department}
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {scheme.benefitDescription}
              </p>

              {/* Why Relevant */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-teal-600" /> Why This Is Potentially Relevant:
                </div>
                <p className="text-slate-700 dark:text-slate-300">
                  {scheme.whyRelevant}
                </p>
              </div>

              {/* Eligibility Criteria */}
              <div className="text-xs space-y-1">
                <span className="font-semibold text-slate-500 text-[11px]">Key Eligibility Criteria:</span>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                  {scheme.eligibilityCriteria.map((crit, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>{crit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <a
                href={scheme.officialPortalUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 flex items-center gap-1"
              >
                <span>Official Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              {scheme.isApplied ? (
                <span className="text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-3 py-1 rounded-lg flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Application Docket Active
                </span>
              ) : (
                <button
                  onClick={() => applyForScheme(scheme.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Apply with Verified Profile</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
