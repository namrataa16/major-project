import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  MapPin,
  Package,
  Route,
  Receipt,
  FileCheck,
  Building2,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  Zap,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/formatters';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { organization, currentUser, documents, alerts, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const expiringDocsCount = documents.filter(
    (d) => d.status === 'Expiring Soon' || d.status === 'Expired'
  ).length;

  const navSections = [
    {
      title: 'OPERATIONS',
      items: [
        {
          name: 'Command Center',
          path: '/dashboard',
          icon: LayoutDashboard,
          badge: null,
        },
        {
          name: 'Fleet Vehicles',
          path: '/fleet',
          icon: Truck,
          badge: '24 units',
          badgeColor: 'bg-slate-800 text-slate-300',
        },
        {
          name: 'Trips & Dispatches',
          path: '/trips',
          icon: MapPin,
          badge: '17 active',
          badgeColor: 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60',
        },
        {
          name: 'Load Board',
          path: '/loads',
          icon: Package,
          badge: 'Match AI',
          badgeColor: 'bg-sky-950/80 text-sky-400 border border-sky-800/60',
        },
      ],
    },
    {
      title: 'AI ENGINE',
      items: [
        {
          name: 'Route Intelligence',
          path: '/route-intelligence',
          icon: Route,
          badge: 'Vehicle-Aware',
          badgeColor: 'bg-emerald-500 text-slate-950 font-bold',
          highlight: true,
          desc: 'Vehicle-aware routing engine',
        },
      ],
    },
    {
      title: 'FINANCE & COMPLIANCE',
      items: [
        {
          name: 'Expenses & Tolls',
          path: '/expenses',
          icon: Receipt,
          badge: null,
        },
        {
          name: 'Documents & RTO',
          path: '/documents',
          icon: FileCheck,
          badge: expiringDocsCount > 0 ? `${expiringDocsCount} alert` : null,
          badgeColor: 'bg-amber-950/80 text-amber-400 border border-amber-800/60',
        },
        {
          name: 'Enterprise Customers',
          path: '/customers',
          icon: Building2,
          badge: null,
        },
        {
          name: 'Analytics & BI',
          path: '/analytics',
          icon: BarChart3,
          badge: null,
        },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navContent = (
    <div className="flex flex-col h-full bg-[#0b1329] text-slate-300 border-r border-slate-800/80 selection:bg-emerald-500 selection:text-white">
      {/* Brand & Organization header */}
      <div className="p-4 border-b border-slate-800/80 bg-[#080e1f]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-slate-950 font-black flex items-center justify-center text-lg shadow-md shadow-emerald-950/50">
              O
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-base tracking-tight">ONGO</span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Fleet OS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate max-w-[160px]">
                {organization.name}
              </p>
            </div>
          </div>
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              {section.title}
            </div>
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150',
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60',
                    item.highlight && !location.pathname.includes(item.path) && 'border border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
                  )
                }
              >
                <div className="flex items-center gap-2.5">
                  <item.icon
                    className={cn(
                      'w-4 h-4 transition-colors flex-shrink-0',
                      item.highlight ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                    )}
                  />
                  <span className="truncate">{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      'text-[9px] px-2 py-0.5 rounded-full font-bold flex-shrink-0',
                      item.badgeColor
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {/* Route Intelligence Pitch Banner in Sidebar */}
      <div className="p-3 mx-3 mb-2 rounded-xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-800/40">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-emerald-300 block">
              Vehicle-Aware Routing
            </span>
            <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">
              Not just shortest. The right route for your vehicle.
            </span>
          </div>
        </div>
      </div>

      {/* User profile & Settings footer */}
      <div className="p-3 border-t border-slate-800/80 bg-[#080e1f]">
        <div className="flex items-center justify-between">
          <NavLink
            to="/settings"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5 min-w-0 p-1.5 rounded-lg hover:bg-slate-800/50 transition-colors flex-1"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-slate-950 flex items-center justify-center font-bold text-xs flex-shrink-0">
              {currentUser?.name.charAt(0) || 'R'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {currentUser?.name || 'Rajesh Sharma'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {currentUser?.role || 'Fleet Operations Manager'}
              </p>
            </div>
          </NavLink>

          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 z-30">
        {navContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#0b1329] z-10">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
