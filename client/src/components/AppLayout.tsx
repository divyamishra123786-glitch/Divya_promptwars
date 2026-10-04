import { useState, useEffect } from 'react';
import { NavLink, useLocation, Outlet } from 'react-router-dom';
import { api } from '../services/api';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/app', label: 'Overview', icon: '◎' },
  { path: '/app/new', label: 'New Analysis', icon: '✦' },
  { path: '/app/decisions', label: 'My Decisions', icon: '◈' },
  { path: '/app/perspectives', label: 'Perspective Lab', icon: '◑' },
  { path: '/app/simulator', label: 'What-If Simulator', icon: '⟳' },
  { path: '/app/challenge', label: 'Challenge Your Thinking', icon: '◇' },
  { path: '/app/journal', label: 'Decision Journal', icon: '◻' },
];

const BOTTOM_NAV: NavItem[] = [
  { path: '/app/settings', label: 'Settings', icon: '⚙' },
  { path: '/app/about', label: 'About / How It Works', icon: '?' },
];

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mode, setMode] = useState<'live' | 'demo'>('demo');
  const location = useLocation();

  useEffect(() => {
    api.health().then((h) => setMode(h.mode as 'live' | 'demo')).catch(() => setMode('demo'));
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
    <div className="flex h-screen overflow-hidden bg-bg">
      {/* Sidebar */}
      <aside
        className="flex flex-col transition-all duration-300 border-r border-white/06 bg-secondary shrink-0"
        style={{ width: collapsed ? '60px' : '240px' }}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 py-4 border-b border-white/06">
          <div className="eclipse-sm shrink-0" aria-hidden="true" />
          {!collapsed && (
            <span className="font-heading text-sm font-bold text-ivory tracking-wide whitespace-nowrap">
              BLINDSPOT AI
            </span>
          )}
        </div>

        {/* Mode badge */}
        {!collapsed && (
          <div className="px-3 py-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide ${
                mode === 'live'
                  ? 'bg-sage/15 text-sage border border-sage/25'
                  : 'bg-warning/15 text-warning border border-warning/25'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${mode === 'live' ? 'bg-sage' : 'bg-warning animate-pulse'}`} />
              {mode === 'live' ? 'Live AI' : 'Demo'}
            </span>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-2" role="navigation">
          <ul className="space-y-0.5 px-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/app'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-accent/15 text-accent border border-accent/20'
                        : 'text-muted hover:bg-white/04 hover:text-ivory'
                    }`
                  }
                  title={collapsed ? item.label : undefined}
                  aria-label={item.label}
                >
                  <span className="text-base shrink-0 w-5 text-center" aria-hidden="true">
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className="whitespace-nowrap font-medium">{item.label}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom nav */}
        <div className="border-t border-white/06 py-2 px-2">
          <ul className="space-y-0.5">
            {BOTTOM_NAV.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-accent/15 text-accent'
                        : 'text-muted hover:bg-white/04 hover:text-ivory'
                    }`
                  }
                  title={collapsed ? item.label : undefined}
                  aria-label={item.label}
                >
                  <span className="text-base shrink-0 w-5 text-center" aria-hidden="true">
                    {item.icon}
                  </span>
                  {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-2 py-2.5 rounded-lg text-xs text-muted hover:text-ivory hover:bg-white/04 transition-colors mt-1"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span aria-hidden="true">{collapsed ? '→' : '←'}</span>
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto" id="main-content">
        <Outlet />
      </main>
    </div>
  );
}
