import React from 'react';
import { RouteOption } from '../../types';
import { CheckCircle2, AlertTriangle, Mountain, Zap, ShieldCheck } from 'lucide-react';
import { cn } from '../../utils/formatters';

interface RouteIntelligenceMapProps {
  routes: RouteOption[];
  selectedRouteId: string;
  onSelectRoute: (id: string) => void;
  originName?: string;
  destinationName?: string;
}

export const RouteIntelligenceMap: React.FC<RouteIntelligenceMapProps> = ({
  routes,
  selectedRouteId,
  onSelectRoute,
  originName = 'Mumbai',
  destinationName = 'Pune',
}) => {
  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-card flex flex-col">
      {/* Visual Canvas Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-sage-500 animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wide uppercase">
            Corridor Intelligence Topology
          </span>
          <span className="text-xs text-slate-500">•</span>
          <span className="text-xs text-slate-300 font-medium">
            {originName} ➔ {destinationName} (3 Evaluated Routes)
          </span>
        </div>

        {/* Route switcher tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {routes.map((route) => {
            const isSelected = route.id === selectedRouteId;
            return (
              <button
                key={route.id}
                onClick={() => onSelectRoute(route.id)}
                className={cn(
                  'px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5',
                  isSelected
                    ? route.isRecommended
                      ? 'bg-sage-600 text-white shadow-sm'
                      : 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                )}
              >
                <span>{route.routeCode}</span>
                {route.isRecommended && (
                  <span className="text-[9px] bg-sage-800 text-sage-200 px-1.5 py-0.2 rounded font-bold">
                    RECOMMENDED
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main SVG Vector Corridor */}
      <div className="relative w-full h-80 sm:h-96 bg-slate-950 flex-1">
        <svg
          viewBox="0 0 800 380"
          className="w-full h-full object-cover select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Pattern Grid */}
            <pattern id="routeGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.6" />
            </pattern>

            {/* Gradients */}
            <linearGradient id="recRouteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#468b71" />
              <stop offset="50%" stopColor="#256a4e" />
              <stop offset="100%" stopColor="#194634" />
            </linearGradient>

            <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background */}
          <rect width="100%" height="100%" fill="#0a0f1d" />
          <rect width="100%" height="100%" fill="url(#routeGrid)" />

          {/* Topographic elevation hill shading representation */}
          <path
            d="M 280 40 Q 420 10 520 120 Q 560 220 500 340 L 320 340 Z"
            fill="#131e33"
            opacity="0.8"
          />
          <text x="390" y="80" fill="#334155" fontSize="11" fontWeight="bold" letterSpacing="2">
            WESTERN GHATS (SAHYADRI ESCARPMENT)
          </text>

          {/* ROUTE A: Old NH4 / Bhor Ghat (120 km - Steep ghat curves) */}
          <g className="cursor-pointer" onClick={() => onSelectRoute('route-a-old-nh4')}>
            <path
              d="M 90 190 C 180 180, 260 210, 340 140 C 400 80, 480 100, 560 170 C 620 220, 680 200, 710 190"
              fill="none"
              stroke={selectedRouteId === 'route-a-old-nh4' ? '#f59e0b' : '#64748b'}
              strokeWidth={selectedRouteId === 'route-a-old-nh4' ? '6' : '3'}
              strokeDasharray="6,4"
              opacity={selectedRouteId === 'route-a-old-nh4' ? 1 : 0.4}
            />
            {/* Ghat bottleneck warning point */}
            <circle cx="400" cy="95" r="7" fill="#ef4444" opacity="0.9" />
            <text x="415" y="100" fill="#fca5a5" fontSize="10" fontWeight="bold">
              Bhor Ghat 8.2% Gradient
            </text>
          </g>

          {/* ROUTE B: Mumbai-Pune Expressway (135 km - Engineered wide gradient corridor - RECOMMENDED) */}
          <g className="cursor-pointer" onClick={() => onSelectRoute('route-b-expressway')}>
            {/* Glow backing */}
            <path
              d="M 90 190 C 200 240, 320 260, 440 230 C 540 205, 630 190, 710 190"
              fill="none"
              stroke="#256a4e"
              strokeWidth="10"
              opacity="0.3"
              filter="url(#routeGlow)"
            />
            <path
              d="M 90 190 C 200 240, 320 260, 440 230 C 540 205, 630 190, 710 190"
              fill="none"
              stroke={selectedRouteId === 'route-b-expressway' ? '#468b71' : '#225744'}
              strokeWidth={selectedRouteId === 'route-b-expressway' ? '6' : '3.5'}
              opacity={selectedRouteId === 'route-b-expressway' ? 1 : 0.6}
            />
            {/* Expressway tag */}
            <rect x="360" y="245" width="165" height="22" rx="6" fill="#14362b" stroke="#34705a" />
            <text x="442" y="260" textAnchor="middle" fill="#a7f3d0" fontSize="10" fontWeight="bold">
              ★ Expressway Corridor (3.8% Grad)
            </text>
          </g>

          {/* ROUTE C: Karjat / Kamshet Bypass (128 km) */}
          <g className="cursor-pointer" onClick={() => onSelectRoute('route-c-karjat-bypass')}>
            <path
              d="M 90 190 C 160 270, 280 320, 420 310 C 550 300, 640 250, 710 190"
              fill="none"
              stroke={selectedRouteId === 'route-c-karjat-bypass' ? '#38bdf8' : '#475569'}
              strokeWidth={selectedRouteId === 'route-c-karjat-bypass' ? '6' : '2.5'}
              strokeDasharray="4,4"
              opacity={selectedRouteId === 'route-c-karjat-bypass' ? 1 : 0.35}
            />
            <text x="420" y="330" textAnchor="middle" fill="#94a3b8" fontSize="10">
              Route C (Rural Single-Lane Bypass)
            </text>
          </g>

          {/* Origin: Mumbai Node */}
          <g transform="translate(90, 190)">
            <circle r="18" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <circle r="7" fill="#38bdf8" />
            <text x="0" y="-25" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
              {originName} (Sion / Kalamboli)
            </text>
            <text x="0" y="32" textAnchor="middle" fill="#94a3b8" fontSize="10">
              Freight Loading Point
            </text>
          </g>

          {/* Destination: Pune Node */}
          <g transform="translate(710, 190)">
            <circle r="18" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <circle r="7" fill="#10b981" />
            <text x="0" y="-25" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
              {destinationName} (Talegaon / Hinjewadi)
            </text>
            <text x="0" y="32" textAnchor="middle" fill="#94a3b8" fontSize="10">
              Delivery Hub
            </text>
          </g>

          {/* Toll Plaza Icons */}
          <g transform="translate(300, 248)">
            <circle r="5" fill="#f59e0b" />
            <text x="8" y="4" fill="#fbbf24" fontSize="9">
              Khalapur Toll
            </text>
          </g>

          <g transform="translate(560, 204)">
            <circle r="5" fill="#f59e0b" />
            <text x="8" y="4" fill="#fbbf24" fontSize="9">
              Talegaon Toll
            </text>
          </g>
        </svg>

        {/* Selected Route Floating Overlay */}
        <div className="absolute top-4 right-4 bg-slate-950/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-xs text-white max-w-xs pointer-events-none hidden sm:block">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="font-bold text-slate-200">{selectedRoute.name}</span>
            <span
              className={cn(
                'text-[10px] font-bold px-2 py-0.5 rounded',
                selectedRoute.isRecommended
                  ? 'bg-sage-600 text-white'
                  : 'bg-slate-800 text-slate-400'
              )}
            >
              Score {selectedRoute.suitabilityScore}/100
            </span>
          </div>
          <div className="space-y-1 text-slate-400 text-[11px]">
            <div className="flex justify-between">
              <span>Distance:</span>
              <strong className="text-white">{selectedRoute.distanceKm} km</strong>
            </div>
            <div className="flex justify-between">
              <span>Estimated Duration:</span>
              <strong className="text-white">{selectedRoute.estimatedDuration}</strong>
            </div>
            <div className="flex justify-between">
              <span>Ghat Gradient:</span>
              <strong className={selectedRoute.gradientPercentage > 5 ? 'text-amber-400' : 'text-emerald-400'}>
                {selectedRoute.gradientPercentage}% ({selectedRoute.terrainDifficulty} difficulty)
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Elevation & Gradient Cross-Section Comparison Strip */}
      <div className="bg-slate-950 p-4 border-t border-slate-800 text-xs text-slate-300">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
              <Mountain className="w-4 h-4 text-sage-400" />
            </div>
            <div>
              <span className="font-bold text-white block">Terrain & Grade Profile Insight</span>
              <span className="text-[11px] text-slate-400">
                Route B uses grade-separated tunnels and engineered viaducts to keep slope &lt; 4%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-amber-500 rounded" />
              <span className="text-slate-400">Route A (120 km): 8.2% max gradient</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-sage-500 rounded" />
              <span className="text-emerald-400 font-semibold">Route B (135 km): 3.8% low gradient</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
