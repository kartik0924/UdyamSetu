import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Layers,
  FileText,
  Flame,
  Zap,
  Droplet,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { aiService } from '../services/aiService';

export const ProjectWizardPage: React.FC = () => {
  const { createProject } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);

  // Form State
  const [name, setName] = useState('Champaran Agro Processing Ltd.');
  const [promoterName, setPromoterName] = useState('Shri Arvind Pandey');
  const [promoterDin, setPromoterDin] = useState('DIN-09124481');
  const [enterpriseType, setEnterpriseType] = useState<'Small' | 'Medium'>('Small');
  const [sector, setSector] = useState('Agro & Food Processing (Grain & Pulse Milling)');
  const [projectType, setProjectType] = useState('New Manufacturing Unit');
  const [state, setState] = useState('Bihar');
  const [district, setDistrict] = useState('West Champaran (Bettiah)');
  const [location, setLocation] = useState('Plot No. 12-14, Kumarbagh Industrial Area');
  const [investmentCr, setInvestmentCr] = useState(6.5);
  const [employees, setEmployees] = useState(85);
  const [landStatus, setLandStatus] = useState('BIADA Industrial Shed Leased');

  // Step 2 Industrial Profile
  const [products, setProducts] = useState('Fortified Rice, Maize Grits, Bio-compost');
  const [rawMaterials, setRawMaterials] = useState('Paddy grain, Yellow corn, Husk');
  const [waterRequirementKld, setWaterRequirementKld] = useState(18);
  const [powerLoadKva, setPowerLoadKva] = useState(120);
  const [pollutionCategory, setPollutionCategory] = useState<'Orange' | 'Green' | 'Red'>('Orange');
  const [hazardousMaterials, setHazardousMaterials] = useState(false);

  // Step 3 Infrastructure
  const [wasteGeneration, setWasteGeneration] = useState('Organic agro-waste husk (used as bio-fuel)');
  const [buildingStatus, setBuildingStatus] = useState('Pre-Engineered PEB Industrial Shed');

  const handleNext = () => setStep((s) => Math.min(5, s + 1));
  const handlePrev = () => setStep((s) => Math.max(1, s - 1));

  const handleFinalSubmit = async () => {
    setAnalyzing(true);
    const newProj = createProject({
      name,
      promoterName,
      promoterDin,
      enterpriseType,
      sector,
      projectType,
      state,
      district,
      location,
      investmentCr,
      employees,
      landStatus,
      powerLoadKva,
      waterRequirementKld,
      pollutionCategory,
      hazardousMaterials,
      products: products.split(',').map((s) => s.trim()),
      rawMaterials: rawMaterials.split(',').map((s) => s.trim()),
    });

    try {
      await aiService.analyzeProject(newProj);
    } catch (e) {
      console.warn(e);
    } finally {
      setAnalyzing(false);
      navigate('/pathfinder');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Industrial Onboarding Engine</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          New Industrial Project Wizard
        </h1>
        <p className="text-xs text-slate-500">
          Enter your industrial profile to orchestrate tailored statutory approvals and parallel timelines
        </p>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-5 gap-2 text-center text-xs">
        {[
          { num: 1, label: 'Enterprise Info' },
          { num: 2, label: 'Industrial Profile' },
          { num: 3, label: 'Infrastructure' },
          { num: 4, label: 'Review Dossier' },
          { num: 5, label: 'AI Discovery' },
        ].map((s) => (
          <div
            key={s.num}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              step === s.num
                ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200 font-bold'
                : step > s.num
                ? 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                : 'border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
            }`}
          >
            <div className="text-[10px] font-mono">Step {s.num}</div>
            <div className="truncate font-semibold">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Step 1: Project Information */}
      {step === 1 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            1. Enterprise & Promoter Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Enterprise Commercial Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Lead Promoter & DIN
              </label>
              <input
                type="text"
                required
                value={promoterName}
                onChange={(e) => setPromoterName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Industry Sector
              </label>
              <input
                type="text"
                required
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Proposed State & District
              </label>
              <input
                type="text"
                required
                value={`${district}, ${state}`}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Total Projected Capital Investment (₹ Crore)
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={investmentCr}
                onChange={(e) => setInvestmentCr(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Total Direct Employment
              </label>
              <input
                type="number"
                required
                value={employees}
                onChange={(e) => setEmployees(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Industrial Profile */}
      {step === 2 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            2. Industrial & Environmental Parameters
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Finished Products
              </label>
              <input
                type="text"
                value={products}
                onChange={(e) => setProducts(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Primary Raw Materials
              </label>
              <input
                type="text"
                value={rawMaterials}
                onChange={(e) => setRawMaterials(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pollution Index Category
              </label>
              <select
                value={pollutionCategory}
                onChange={(e) => setPollutionCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="White">White (Practically non-polluting)</option>
                <option value="Green">Green (Low pollution)</option>
                <option value="Orange">Orange (Moderate pollution - Agro/Boiler)</option>
                <option value="Red">Red (High pollution)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Connected Power Load (kVA)
              </label>
              <input
                type="number"
                value={powerLoadKva}
                onChange={(e) => setPowerLoadKva(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Water Requirement (KLD)
              </label>
              <input
                type="number"
                value={waterRequirementKld}
                onChange={(e) => setWaterRequirementKld(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Infrastructure */}
      {step === 3 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            3. Site & Infrastructure Readiness
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Land Status & Demarcation
              </label>
              <input
                type="text"
                value={landStatus}
                onChange={(e) => setLandStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Building Structural Status
              </label>
              <input
                type="text"
                value={buildingStatus}
                onChange={(e) => setBuildingStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Solid & Agro Waste Generation
              </label>
              <input
                type="text"
                value={wasteGeneration}
                onChange={(e) => setWasteGeneration(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Review Dossier */}
      {step === 4 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            4. Review Industrial Parameter Summary
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-slate-400 text-[10px] block">ENTERPRISE</span>
              <span className="font-bold text-slate-900 dark:text-white">{name}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">PROMOTER</span>
              <span className="font-bold text-slate-900 dark:text-white">{promoterName}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">CAPEX</span>
              <span className="font-bold text-teal-600">₹{investmentCr} Crore</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">WORKFORCE</span>
              <span className="font-bold text-slate-900 dark:text-white">{employees} Persons</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">POLLUTION CAT</span>
              <span className="font-bold text-amber-600">{pollutionCategory} Category</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">POWER / WATER</span>
              <span className="font-bold text-slate-900 dark:text-white">{powerLoadKva} kVA / {waterRequirementKld} KLD</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Analyze Project with AI */}
      {step === 5 && (
        <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-teal-950 text-white text-center space-y-4 shadow-xl border border-teal-500/20">
          <div className="h-14 w-14 rounded-2xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center mx-auto">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Ready for AI Statutory Discovery & Orchestration
          </h2>
          <p className="text-xs text-teal-100/80 max-w-md mx-auto leading-relaxed">
            Our statutory rules engine and Gemini intelligence will analyze {name} to map potentially applicable approvals, prerequisites, and parallel opportunities.
          </p>

          <button
            onClick={handleFinalSubmit}
            disabled={analyzing}
            className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center gap-2 mx-auto"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Orchestrating Approval Graph...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Project with AI & Generate Graph</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        {step > 1 && step < 5 ? (
          <button
            onClick={handlePrev}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous Step
          </button>
        ) : <div />}

        {step < 5 && (
          <button
            onClick={handleNext}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <span>Continue to Step {step + 1}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
