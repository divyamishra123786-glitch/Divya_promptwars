import { useState, useEffect } from 'react';
import { NavLink, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  FolderKanban,
  Users,
  GitBranch,
  ShieldAlert,
  BookOpen,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../services/api';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/app', label: 'Overview', icon: LayoutDashboard },
  { path: '/app/new-analysis', label: 'New Analysis', icon: PlusCircle },
  { path: '/app/decisions', label: 'My Decisions', icon: FolderKanban },
  { path: '/app/perspective-lab', label: 'Perspective Lab', icon: Users },
  { path: '/app/what-if', label: 'What-If Simulator', icon: GitBranch },
  { path: '/app/challenge', label: 'Challenge Thinking', icon: ShieldAlert },
  { path: '/app/journal', label: 'Decision Journal', icon: BookOpen },
];

const BOTTOM_NAV: NavItem[] = [
  { path: '/app/settings', label: 'Settings', icon: Settings },
  { path: '/app/about', label: 'About / How It Works', icon: HelpCircle },
];

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mode, setMode] = useState<'live' | 'demo'>('demo');
  const location = useLocation();

  useEffect(() => {
    api
      .health()
      .then((h) => setMode(h.mode as 'live' | 'demo'))
      .catch(() => setMode('demo'));
  }, []);

  // Collapse on mobile by default
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setCollapsed(mq.matches);
    const handler = (e: MediaQueryListEvent) => setCollapsed(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Close sidebar on nav on mobile
  useEffect(() => {
    if (window.innerWidth < 768) setCollapsed(true);
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-bg text-ivory">
      {/* Sidebar */}
      <aside
        className="flex flex-col transition-all duration-300 border-r border-white/06 bg-secondary shrink-0 z-30"
        style={{ width: collapsed ? '68px' : '240px' }}
        aria-label="Main navigation"
      >
        {/* Logo Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/06 min-h-[64px]">
          <div className="w-6 h-6 rounded-full bg-accent/20 border border-accent flex items-center justify-center shrink-0">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          </div>
          {!collapsed && (
            <span className="font-heading text-sm font-bold text-ivory tracking-wider whitespace-nowrap">
              BLINDSPOT AI
            </span>
          )}
        </div>

        {/* Execution Mode Badge */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-white/04">
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide uppercase ${
                  mode === 'live'
                    ? 'bg-sage/15 text-sage border border-sage/30'
                    : 'bg-warning/15 text-warning border border-warning/30'
                }`}
              >
                {mode === 'live' ? <Zap className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                {mode === 'live' ? 'Live Gemini AI' : 'Demo Mode'}
              </span>
            </div>
          </div>
        )}

        {/* Primary Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1" role="navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/app'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-accent/15 text-accent border border-accent/25 shadow-sm'
                      : 'text-muted hover:bg-white/04 hover:text-ivory'
                  }`
                }
                title={collapsed ? item.label : undefined}
                aria-label={item.label}
              >
                <Icon className="w-4 h-4 shrink-0 text-current" />
                {!collapsed && <span className="whitespace-nowrap truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Secondary Navigation & Collapse Button */}
        <div className="border-t border-white/06 py-3 px-2 space-y-1">
          {BOTTOM_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-accent/15 text-accent border border-accent/25'
                      : 'text-muted hover:bg-white/04 hover:text-ivory'
                  }`
                }
                title={collapsed ? item.label : undefined}
                aria-label={item.label}
              >
                <Icon className="w-4 h-4 shrink-0 text-current" />
                {!collapsed && <span className="whitespace-nowrap truncate">{item.label}</span>}
              </NavLink>
            );
          })}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs text-muted hover:text-ivory hover:bg-white/04 transition-colors mt-2"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!collapsed && <span>Collapse Sidebar</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto" id="main-content">
          <Outlet />
        </main>

        {/* App Footer */}
        <footer className="py-2.5 px-6 border-t border-white/06 text-center text-xs text-muted bg-secondary/50 shrink-0">
          Built with React, TypeScript, Express and Google Gemini ·{' '}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-ivory transition-colors"
          >
            GitHub Repository
          </a>
        </footer>
      </div>
    </div>
  );
}
