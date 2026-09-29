import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  FileCheck2,
  FolderOpen,
  MessageSquareWarning,
  Flame,
  CheckCircle,
  Gift,
  BarChart3,
  History,
  Info,
  Building,
  Sparkles,
  ShieldCheck,
  Shield,
  ChevronRight,
  PlusCircle,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarItem {
  to: string;
  label: string;
  icon: any;
  badge: string | null;
  alert?: boolean;
  highlight?: boolean;
}

interface SidebarGroup {
  group: string;
  items: SidebarItem[];
}

export const Sidebar: React.FC = () => {
  const { currentProject, currentUser, queries, inspections, approvals, logout } = useApp();
  const navigate = useNavigate();

  const pendingQueries = queries.filter((q) => q.status === 'PENDING_RESPONSE').length;
  const activeInspections = inspections.filter((i) => i.status === 'SCHEDULED').length;
  const inProgressApprovals = approvals.filter(
    (a) => a.status === 'UNDER_SCRUTINY' || a.status === 'INSPECTION_SCHEDULED' || a.status === 'QUERY_RAISED'
  ).length;

  const isEntrepreneur = currentUser.role === 'ENTREPRENEUR';

  const getPersonalDashboard = () => {
    switch (currentUser.role) {
      case 'ENTREPRENEUR':
        return { to: '/dashboard', label: 'My Industry Dashboard', roleBadge: 'Entrepreneur' };
      case 'DEPARTMENT_OFFICER':
        return { to: '/department-scrutiny', label: 'My Scrutiny Portal', roleBadge: currentUser.department || 'Department' };
      case 'INSPECTOR':
        return { to: '/inspector-portal', label: 'My Field Verification Portal', roleBadge: 'Safety Inspector' };
      case 'DISTRICT_ADMIN':
        return { to: '/district-dashboard', label: 'District Single Window', roleBadge: 'District Magistrate' };
      case 'STATE_ADMIN':
      case 'SUPER_ADMIN':
        return { to: '/admin', label: 'State Governance Portal', roleBadge: 'State Apex' };
      default:
        return { to: '/department-scrutiny', label: 'Official Portal', roleBadge: 'Officer' };
    }
  };

  const personal = getPersonalDashboard();

  // Role-specific navigation groups: Government Officers NEVER see Entrepreneur Dashboard
  const navItems: SidebarGroup[] = isEntrepreneur
    ? [
        {
          group: 'MY INDUSTRY WORKSPACE',
          items: [
            { to: '/dashboard', label: 'My Industry Dashboard', icon: LayoutDashboard, badge: null, highlight: true },
            { to: '/pathfinder', label: 'Approval Pathfinder', icon: Compass, badge: '3D Graph' },
            { to: '/applications', label: 'My Applications', icon: FileCheck2, badge: inProgressApprovals > 0 ? `${inProgressApprovals}` : null },
            { to: '/documents', label: 'Document Intelligence', icon: FolderOpen, badge: null },
            { to: '/queries', label: 'Department Queries', icon: MessageSquareWarning, badge: pendingQueries > 0 ? `${pendingQueries} Action` : null, alert: pendingQueries > 0 },
            { to: '/inspections', label: 'Inspections Schedule', icon: Flame, badge: activeInspections > 0 ? `${activeInspections}` : null },
          ],
        },
        {
          group: 'POST-APPROVAL & SUPPORT',
          items: [
            { to: '/compliance', label: 'Compliance Continuum', icon: CheckCircle, badge: '5 Active' },
            { to: '/government-support', label: 'Government Support & Schemes', icon: Gift, badge: 'Schemes' },
          ],
        },
        {
          group: 'GOVERNANCE & AUDIT',
          items: [
            { to: '/audit-logs', label: 'Statutory Audit Trail', icon: History, badge: null },
            { to: '/about', label: 'Architecture & Rules', icon: Info, badge: null },
          ],
        },
      ]
    : [
        {
          group: 'OFFICIAL DESK / अधिकारिक कार्यपीठ',
          items: [
            { to: personal.to, label: personal.label, icon: ShieldCheck, badge: personal.roleBadge, highlight: true },
          ],
        },
        {
          group: 'STATUTORY SCRUTINY & PROCESSING',
          items: [
            { to: '/applications', label: 'Applications Under Review', icon: FileCheck2, badge: inProgressApprovals > 0 ? `${inProgressApprovals}` : null },
            { to: '/documents', label: 'Document Intelligence Verification', icon: FolderOpen, badge: null },
            { to: '/queries', label: 'Clarifications & Scrutiny Queries', icon: MessageSquareWarning, badge: pendingQueries > 0 ? `${pendingQueries} Action` : null, alert: pendingQueries > 0 },
            { to: '/inspections', label: 'Inspection Roster & Verification', icon: Flame, badge: activeInspections > 0 ? `${activeInspections}` : null },
            { to: '/pathfinder', label: 'Approval Dependency Graph', icon: Compass, badge: '3D Rules' },
          ],
        },
        {
          group: 'OVERSIGHT & STATUTORY AUDIT',
          items: [
            { to: '/compliance', label: 'Compliance Monitoring', icon: CheckCircle, badge: '5 Units' },
            { to: '/government-support', label: 'Incentives & Schemes Administration', icon: Gift, badge: 'Schemes' },
            { to: '/audit-logs', label: 'Statutory Audit Trail', icon: History, badge: null },
            { to: '/about', label: 'Statutory Rules & Architecture', icon: Info, badge: null },
          ],
        },
      ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors flex flex-col justify-between hidden md:flex">
      <div className="p-4 space-y-6 overflow-y-auto">
        {/* Project Mini Card with 3D Depth */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-800 dark:to-slate-800/40 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-16 w-16 bg-teal-500/10 rounded-full blur-xl group-hover:bg-teal-500/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              {isEntrepreneur ? 'Current Enterprise' : 'Active Scrutiny Dossier'}
            </span>
            <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400">
              {currentProject.status}
            </span>
          </div>
          <div className="font-bold text-xs text-slate-900 dark:text-white mt-1 truncate">
            {currentProject.name}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            ₹{currentProject.investmentCr} Cr · {currentProject.district}
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Readiness</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{currentProject.submissionReadiness}%</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1 mt-1 overflow-hidden">
            <div
              className="bg-teal-500 h-1 rounded-full transition-all duration-500"
              style={{ width: `${currentProject.submissionReadiness}%` }}
            />
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="space-y-6">
          {navItems.map((group) => (
            <div key={group.group} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {group.group}
              </div>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white dark:bg-teal-500/20 dark:text-teal-300 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                        item.alert
                          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 animate-pulse'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom User Bar & Logout */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2.5">
        {isEntrepreneur ? (
          <NavLink
            to="/new-project"
            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg border border-dashed border-teal-500/60 hover:border-teal-500 text-xs font-semibold text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Project Wizard</span>
          </NavLink>
        ) : (
          <div className="px-2.5 py-1.5 rounded-lg bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/70 dark:border-teal-800/60 text-[11px] text-teal-800 dark:text-teal-300 flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
            <span className="truncate">Statutory Official Desk</span>
          </div>
        )}

        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-7 w-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
              {currentUser.avatar}
            </div>
            <div className="min-w-0">
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
              logout();
              navigate('/login');
            }}
            className="p-1.5 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 border border-transparent hover:border-red-200 dark:hover:border-red-900/50 transition-colors"
            title="Logout"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
