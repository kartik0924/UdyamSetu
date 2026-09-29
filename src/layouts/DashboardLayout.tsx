import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';
import { UdyamAIAssistant } from '../components/assistant/UdyamAIAssistant';
import {
  LayoutDashboard,
  Compass,
  FileCheck2,
  FolderOpen,
  MessageSquareWarning,
  Flame,
  CheckCircle,
  Menu,
  X,
  Sparkles,
  LogOut,
  Building,
  ShieldCheck,
  BarChart3,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DashboardLayout: React.FC = () => {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { queries, currentUser, logout } = useApp();
  const navigate = useNavigate();

  const isEntrepreneur = currentUser.role === 'ENTREPRENEUR';

  const getOfficialHome = () => {
    switch (currentUser.role) {
      case 'DEPARTMENT_OFFICER':
        return { to: '/department-scrutiny', label: 'Department Scrutiny & Sanctions', icon: Building };
      case 'INSPECTOR':
        return { to: '/inspector-portal', label: 'Field Inspector Portal', icon: Flame };
      case 'DISTRICT_ADMIN':
        return { to: '/district-dashboard', label: 'District Single Window', icon: ShieldCheck };
      case 'STATE_ADMIN':
      case 'SUPER_ADMIN':
        return { to: '/admin', label: 'State Governance Portal', icon: BarChart3 };
      default:
        return { to: '/department-scrutiny', label: 'Official Portal', icon: Building };
    }
  };

  const officialHome = getOfficialHome();
  const pendingQueries = queries.filter((q) => q.status === 'PENDING_RESPONSE').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navbar */}
      <Navbar onOpenAssistant={() => setAssistantOpen(true)} />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-slate-950/60 backdrop-blur-xs flex">
            <div className="w-72 bg-white dark:bg-slate-900 h-full p-4 flex flex-col justify-between shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    UDYAMSETU
                  </span>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1 text-xs">
                  {/* Entrepreneur sees Dashboard; Officers NEVER see Entrepreneur Dashboard */}
                  {isEntrepreneur ? (
                    <NavLink
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>My Industry Dashboard</span>
                    </NavLink>
                  ) : (
                    <NavLink
                      to={officialHome.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-bold"
                    >
                      <officialHome.icon className="w-4 h-4" />
                      <span>{officialHome.label}</span>
                    </NavLink>
                  )}
                  <NavLink
                    to="/pathfinder"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Approval Pathfinder (3D)</span>
                  </NavLink>
                  <NavLink
                    to="/applications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Applications</span>
                  </NavLink>
                  <NavLink
                    to="/documents"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <FolderOpen className="w-4 h-4" />
                    <span>Document Intelligence</span>
                  </NavLink>
                  <NavLink
                    to="/queries"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <MessageSquareWarning className="w-4 h-4 text-amber-500" />
                    <span>Queries & Scrutiny</span>
                  </NavLink>
                  <NavLink
                    to="/inspections"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Flame className="w-4 h-4 text-blue-500" />
                    <span>Inspections</span>
                  </NavLink>
                  <NavLink
                    to="/department-scrutiny"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-teal-600 font-bold"
                  >
                    <span>Department Scrutiny</span>
                  </NavLink>
                  <NavLink
                    to="/compliance"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Compliance Continuum</span>
                  </NavLink>
                </nav>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAssistantOpen(true);
                  }}
                  className="w-full py-2 bg-teal-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Open Udyam AI</span>
                </button>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-7 w-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                      {currentUser.avatar}
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-[10px] text-teal-700 dark:text-teal-400 truncate">
                        {currentUser.department || currentUser.role.replace('_', ' ')}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="p-1.5 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 border border-transparent hover:border-red-200 transition-colors"
                    title="Logout"
                    aria-label="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Scrollable Main Stage */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          {/* Mobile hamburger trigger */}
          <div className="md:hidden mb-4 flex items-center justify-between">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold flex items-center gap-1.5"
            >
              <Menu className="w-4 h-4" />
              <span>Navigation Menu</span>
            </button>
            {pendingQueries > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                {pendingQueries} Query Pending
              </span>
            )}
          </div>

          <Outlet />
        </main>
      </div>

      {/* Floating Udyam AI Trigger (Desktop & Mobile) */}
      <button
        onClick={() => setAssistantOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-slate-900 via-blue-950 to-teal-900 text-white font-bold text-xs shadow-2xl hover:scale-105 transition-all border border-teal-500/40"
        style={{
          boxShadow: '0 10px 25px -5px rgba(13, 148, 136, 0.4), 0 8px 10px -6px rgba(13, 148, 136, 0.2)',
        }}
        title="Open Udyam AI Statutory Assistant"
      >
        <Sparkles className="w-4 h-4 text-teal-300" />
        <span className="hidden sm:inline">Ask Udyam AI</span>
      </button>

      {/* Udyam AI Assistant Drawer */}
      <UdyamAIAssistant isOpen={assistantOpen} onClose={() => setAssistantOpen(false)} />
    </div>
  );
};
