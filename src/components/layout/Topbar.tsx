import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Bell,
  Building,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Menu,
  ChevronDown,
  Plus,
  Truck,
  Package,
  Route,
  Receipt,
  Sparkles,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { AlertCard } from '../common/AlertCard';
import { Modal } from '../common/Modal';

interface TopbarProps {
  onMenuClick: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const { organization, currentUser, alerts, resolveAlert, resetToDefaults } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const unreadAlerts = alerts.filter((a) => !a.resolved);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    const query = searchQuery.toLowerCase();
    if (query.includes('route') || query.includes('mumbai') || query.includes('pune')) {
      navigate('/route-intelligence');
    } else if (query.includes('2847') || query.includes('ashok') || query.includes('truck')) {
      navigate('/fleet');
    } else if (query.includes('trip') || query.includes('trp')) {
      navigate('/trips');
    } else if (query.includes('load') || query.includes('steel')) {
      navigate('/loads');
    } else if (query.includes('expense') || query.includes('fuel')) {
      navigate('/expenses');
    } else if (query.includes('doc') || query.includes('insurance')) {
      navigate('/documents');
    } else {
      navigate(`/fleet?q=${encodeURIComponent(searchQuery)}`);
    }
    setSearchQuery('');
  };

  const handleResetData = () => {
    resetToDefaults();
    showToast('Demo data reset to original showcase state', 'info');
  };

  return (
    <>
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-2.5 shadow-subtle">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Hamburger & Search */}
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fleet (e.g. MH 04 AB 2847), trips, loads, routes..."
                className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white text-slate-800 placeholder:text-slate-400 transition-all shadow-subtle"
              />
              <kbd className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                ↵
              </kbd>
            </form>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Demo Tour Guide Button */}
            <button
              onClick={() => setGuideModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-xs font-bold transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Product Demo Guide</span>
              <span className="sm:hidden">Guide</span>
            </button>

            {/* Direct Route Intelligence button */}
            <Link
              to="/route-intelligence"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all"
            >
              <Route className="w-3.5 h-3.5 text-emerald-400" />
              <span>Route Intelligence</span>
            </Link>

            {/* Reset Button */}
            <button
              onClick={handleResetData}
              title="Reset mock data to pristine showcase state"
              className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset</span>
            </button>

            {/* Organization Tag */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100/80 rounded-xl border border-slate-200/70 text-xs text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="truncate max-w-[130px] font-semibold text-[11px]">{organization.name}</span>
            </div>

            {/* Notifications Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadAlerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                    {unreadAlerts.length}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                  <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">Fleet Alerts</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                        {unreadAlerts.length} pending
                      </span>
                    </div>
                    <Link
                      to="/documents"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold"
                    >
                      View All
                    </Link>
                  </div>

                  <div className="max-h-80 overflow-y-auto p-2.5 space-y-2">
                    {unreadAlerts.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                        All fleet alerts and compliance items are resolved.
                      </div>
                    ) : (
                      unreadAlerts.map((alert) => (
                        <AlertCard
                          key={alert.id}
                          alert={alert}
                          compact
                          onResolve={(id) => {
                            resolveAlert(id);
                            showToast('Alert resolved', 'success');
                          }}
                        />
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Interactive Product Demo Guide Modal */}
      <Modal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
        title="ONGO Interactive Showcase Walkthrough"
        subtitle="Quick tour of key features and product moments for road transport operations"
        maxWidth="xl"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
            <p className="font-bold text-sm">Key Product Message:</p>
            <p className="text-xs text-emerald-900 mt-0.5">
              "Not just the shortest route. The right route for your vehicle."
            </p>
          </div>

          <div className="space-y-2.5">
            <div
              onClick={() => {
                setGuideModalOpen(false);
                navigate('/route-intelligence');
              }}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 cursor-pointer transition-all flex items-start justify-between gap-3 group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 font-bold">1</div>
                <div>
                  <span className="font-bold text-slate-900 block text-sm group-hover:text-emerald-800">
                    Route Intelligence (Hero Moment)
                  </span>
                  <span className="text-slate-600 block mt-0.5">
                    Compare Route A (120 km) vs Route B (135 km). See why ONGO recommends Route B for 8% lower operating cost and gentle terrain.
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 flex-shrink-0 mt-2" />
            </div>

            <div
              onClick={() => {
                setGuideModalOpen(false);
                navigate('/fleet/veh-01');
              }}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 cursor-pointer transition-all flex items-start justify-between gap-3 group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-800 font-bold">2</div>
                <div>
                  <span className="font-bold text-slate-900 block text-sm group-hover:text-emerald-800">
                    Hero Vehicle: MH 04 AB 2847
                  </span>
                  <span className="text-slate-600 block mt-0.5">
                    Inspect specifications, live driver (Ramesh Patil), compliance documents checklist, and monthly profit margins.
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 flex-shrink-0 mt-2" />
            </div>

            <div
              onClick={() => {
                setGuideModalOpen(false);
                navigate('/loads');
              }}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 cursor-pointer transition-all flex items-start justify-between gap-3 group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-800 font-bold">3</div>
                <div>
                  <span className="font-bold text-slate-900 block text-sm group-hover:text-emerald-800">
                    AI Vehicle Matching (Load LD-1045)
                  </span>
                  <span className="text-slate-600 block mt-0.5">
                    Click "Match Vehicle" on Tata Steel's 18T load to view dynamic 96% match scoring.
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 flex-shrink-0 mt-2" />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
