import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  Lock,
  Mail,
  ArrowRight,
  Shield,
  Briefcase,
  Flame,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEMO_USERS } from '../data/demoData';

export const LoginPage: React.FC = () => {
  const { authenticateUser } = useApp();
  const navigate = useNavigate();

  const [selectedRoleKey, setSelectedRoleKey] = useState<string>('entrepreneur');
  const [email, setEmail] = useState<string>(DEMO_USERS.entrepreneur.email);
  const [password, setPassword] = useState<string>('Demo@123');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [forgotModalOpen, setForgotModalOpen] = useState<boolean>(false);
  const [signupModalOpen, setSignupModalOpen] = useState<boolean>(false);

  const rolesList = [
    { key: 'entrepreneur', label: 'Entrepreneur / Industry', user: DEMO_USERS.entrepreneur, icon: Briefcase },
    { key: 'department', label: 'Industries Department', user: DEMO_USERS.department, icon: Building2 },
    { key: 'department_pollution', label: 'Pollution Control (BSPCB)', user: DEMO_USERS.department_pollution, icon: Building2 },
    { key: 'department_fire', label: 'Fire & Emergency', user: DEMO_USERS.department_fire, icon: Flame },
    { key: 'inspector', label: 'Safety Field Inspector', user: DEMO_USERS.inspector, icon: Flame },
    { key: 'district', label: 'District Magistrate (DM)', user: DEMO_USERS.district, icon: Shield },
    { key: 'state', label: 'State Admin (Secretary)', user: DEMO_USERS.state, icon: Layers },
    { key: 'admin', label: 'Super Admin', user: DEMO_USERS.admin, icon: Shield },
  ];

  const handleRoleSelect = (key: string) => {
    setSelectedRoleKey(key);
    setErrorMsg(null);
    const u = DEMO_USERS[key];
    if (u) {
      setEmail(u.email);
      setPassword('Demo@123');
    }
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    setTimeout(() => {
      const res = authenticateUser(selectedRoleKey, password);
      setLoading(false);

      if (!res.success) {
        setErrorMsg(res.error || 'Authentication Denied: Invalid credentials.');
        return;
      }

      // Navigate to dedicated personal role dashboard
      if (selectedRoleKey === 'entrepreneur') {
        navigate('/dashboard');
      } else if (
        selectedRoleKey === 'department' ||
        selectedRoleKey === 'department_pollution' ||
        selectedRoleKey === 'department_fire'
      ) {
        navigate('/department-scrutiny');
      } else if (selectedRoleKey === 'inspector') {
        navigate('/inspector-portal');
      } else if (selectedRoleKey === 'district') {
        navigate('/district-dashboard');
      } else if (selectedRoleKey === 'state' || selectedRoleKey === 'admin') {
        navigate('/admin');
      } else {
        navigate('/department-scrutiny');
      }
    }, 350);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-teal-500 selection:text-white">
      {/* Background radial accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 space-y-3">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-900 to-teal-800 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <svg className="w-7 h-7 text-teal-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 21h18M5 21V7l7-4 7 4v14M9 10h6M9 14h6M9 18h6" />
              <circle cx="12" cy="11" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <div className="text-left">
            <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
              UDYAMSETU
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Regulation-to-Action Orchestration
            </div>
          </div>
        </Link>

        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Secure Government & Enterprise Access
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Smart India Hackathon 2026 Prototype Authentication Portal
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl relative z-10 px-4">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
          {/* Role Selector Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                1. अपना रोल चुनें (Select Official Role)
              </label>
              <span className="text-[10px] font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                Dedicated Role Session
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
              साइन इन के बाद आप केवल इसी चुने हुए रोल में कार्य करेंगे। रोल बदलने के लिए ऊपर दिए गए लॉगआउट आइकन पर क्लिक करें।
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {rolesList.map((r) => {
                const Icon = r.icon;
                const isSelected = selectedRoleKey === r.key;
                return (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => handleRoleSelect(r.key)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/70 dark:bg-teal-950/40 text-teal-950 dark:text-teal-200 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">{r.label}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{r.user.name.split(',')[0]}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Demo Autofill Notice */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Selected Profile: </span>
              <span className="text-teal-600 dark:text-teal-400 font-bold">{DEMO_USERS[selectedRoleKey]?.name}</span>
              <div className="text-[11px] text-slate-400">{DEMO_USERS[selectedRoleKey]?.designation}</div>
            </div>
            <button
              type="button"
              onClick={() => handleLogin()}
              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1"
            >
              <span>Instant Enter</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official Email / Udyam ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg(null);
                  }}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>

              {errorMsg && (
                <div className="mt-2 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Sign In as {DEMO_USERS[selectedRoleKey]?.role.replace('_', ' ')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Social / Google option */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <button
              type="button"
              onClick={() => handleLogin()}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google (Demo Authorized SSO)</span>
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setSignupModalOpen(true)}
                className="text-teal-600 dark:text-teal-400 font-semibold hover:underline"
              >
                Create Entrepreneur Account
              </button>
              <Link to="/about" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                Help & Statutory FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Password Recovery (Demo)</h3>
            <p className="text-xs text-slate-500">
              For evaluation of this prototype, all accounts use default password <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">Demo@123</code>.
            </p>
            <button
              onClick={() => setForgotModalOpen(false)}
              className="w-full py-2 bg-slate-900 dark:bg-teal-600 text-white rounded-xl text-xs font-bold"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Create Account Modal */}
      {signupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">New Enterprise Onboarding</h3>
            <p className="text-xs text-slate-500">
              New industrial promoters are automatically provisioned with a Verified Business Profile and redirected to the Project Creation Wizard.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setSignupModalOpen(false)}
                className="flex-1 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSignupModalOpen(false);
                  navigate('/new-project');
                }}
                className="flex-1 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
              >
                Open Project Wizard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
