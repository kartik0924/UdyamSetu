import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Bell,
  Sparkles,
  Sun,
  Moon,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Shield,
  ArrowRight,
  RefreshCw,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  onOpenAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAssistant }) => {
  const {
    currentUser,
    activeRoleKey,
    currentProject,
    allProjects,
    setCurrentProject,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    isDemoMode,
    resetToDemoData,
    logout,
  } = useApp();

  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 via-blue-950 to-teal-800 text-white shadow-md shadow-slate-900/10 transition-transform group-hover:scale-105">
              <svg className="w-6 h-6 text-teal-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 21h18M5 21V7l7-4 7 4v14M9 10h6M9 14h6M9 18h6" />
                <circle cx="12" cy="11" r="1.5" fill="currentColor" />
              </svg>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-lg text-slate-900 dark:text-white font-sans">
                  UDYAMSETU
                </span>
                <span className="hidden sm:inline-flex text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  SIH 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block">
                Regulation-to-Action Orchestration
              </p>
            </div>
          </Link>

          {/* Project Selector (Desktop) */}
          <div className="relative hidden xl:block ml-4">
            <button
              onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <div className="text-left">
                <div className="font-semibold truncate max-w-[180px]">{currentProject.name}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                  {currentProject.sector} · {currentProject.state}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {projectDropdownOpen && (
              <div
                className="absolute left-0 mt-2 w-72 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setProjectDropdownOpen(false)}
              >
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Active Projects
                </div>
                {allProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setCurrentProject(p)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 ${
                      p.id === currentProject.id ? 'bg-teal-50/50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 font-semibold' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-[10px] text-slate-500">₹{p.investmentCr} Cr · {p.district}</div>
                    </div>
                    {p.id === currentProject.id && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
                  </button>
                ))}
                <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1 px-3">
                  <Link
                    to="/new-project"
                    className="flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 font-medium hover:underline py-1.5"
                  >
                    + Create New Industrial Project
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-3">
          {/* Demo Mode Badge */}
          {isDemoMode && (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-[11px] font-medium text-teal-700 dark:text-teal-300">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
              Demo Mode Active
            </div>
          )}

          {/* Active Official User Badge (Fixed per Sign In) */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-xs shadow-2xs">
            <div className="h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shadow-2xs flex-shrink-0">
              {currentUser.avatar}
            </div>
            <div className="text-left hidden sm:block">
              <span className="block font-bold text-xs text-slate-900 dark:text-white leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] font-semibold text-teal-700 dark:text-teal-400 block leading-tight">
                {currentUser.department || currentUser.role.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Dedicated Logout Button (Icon / Logo Only) */}
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="p-2 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 transition-all shadow-2xs flex items-center justify-center hover:scale-105 active:scale-95"
            title="Logout"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* Udyam AI Assistant Trigger */}
          <button
            onClick={onOpenAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white text-xs font-semibold shadow-sm shadow-teal-500/20 transition-all hover:scale-102"
            title="Open Udyam AI Contextual Guidance"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-200" />
            <span className="hidden sm:inline">Udyam AI</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setNotifDropdownOpen(false)}
              >
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    Notifications ({notifications.length})
                  </div>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAllNotificationsRead();
                      }}
                      className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">No notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          navigate(n.linkTo);
                        }}
                        className={`p-3 text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors ${
                          !n.read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5">
                            {n.type === 'QUERY' && <AlertCircle className="w-3.5 h-3.5 text-amber-500" />}
                            {n.type === 'INSPECTION' && <Clock className="w-3.5 h-3.5 text-blue-500" />}
                            {n.type === 'APPROVAL' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                            {n.type === 'DOCUMENT' && <FileText className="w-3.5 h-3.5 text-purple-500" />}
                            {n.type === 'SCHEME' && <Sparkles className="w-3.5 h-3.5 text-teal-500" />}
                            {n.type === 'COMPLIANCE' && <Shield className="w-3.5 h-3.5 text-rose-500" />}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                              <span>{n.title}</span>
                              <span className="text-[10px] text-slate-400 font-normal">
                                {new Date(n.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5 line-clamp-2">
                              {n.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
