import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Navigation, Info, ShieldCheck, MapPin, Eye, Zap, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { Vehicle } from '../../types';

// Coordinates scaled to SVG viewBox 0 0 800 500
const HUBS = [
  { id: 'mumbai', name: 'Mumbai', x: 210, y: 290, type: 'port', label: 'JNPT Port' },
  { id: 'thane', name: 'Thane', x: 235, y: 260, type: 'hub', label: 'Thane Hub' },
  { id: 'bhiwandi', name: 'Bhiwandi', x: 260, y: 235, type: 'warehouse', label: 'Warehousing Hub' },
  { id: 'pune', name: 'Pune', x: 340, y: 360, type: 'auto', label: 'Chakan MIDC' },
  { id: 'nashik', name: 'Nashik', x: 350, y: 170, type: 'hub', label: 'Industrial Hub' },
  { id: 'surat', name: 'Surat', x: 220, y: 70, type: 'port', label: 'Hazira Port' },
  { id: 'aurangabad', name: 'Aurangabad', x: 470, y: 240, type: 'hub', label: 'MIDC Hub' },
  { id: 'nagpur', name: 'Nagpur', x: 700, y: 180, type: 'hub', label: 'MIHAN Cargo' },
  { id: 'kolhapur', name: 'Kolhapur', x: 330, y: 460, type: 'hub', label: 'Trade Hub' },
];

export const FleetMap: React.FC<{ height?: string; className?: string }> = ({
  height = 'h-96',
  className,
}) => {
  const { vehicles } = useApp();
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [filter, setFilter] = useState<'All' | 'On Trip' | 'Available' | 'Maintenance'>('All');

  const filteredVehicles = vehicles.filter((v) => filter === 'All' || v.status === filter);

  // Map vehicles to coordinates near their city
  const getVehicleCoords = (vehicle: Vehicle, index: number): { x: number; y: number } => {
    const loc = vehicle.currentLocation.toLowerCase();
    let base = { x: 260, y: 235 }; // default Bhiwandi

    if (loc.includes('pune') || loc.includes('chakan') || loc.includes('talegaon')) {
      base = { x: 340, y: 360 };
    } else if (loc.includes('mumbai') || loc.includes('vashi') || loc.includes('kurla') || loc.includes('jnpt')) {
      base = { x: 210, y: 290 };
    } else if (loc.includes('thane')) {
      base = { x: 235, y: 260 };
    } else if (loc.includes('bhiwandi')) {
      base = { x: 260, y: 235 };
    } else if (loc.includes('surat')) {
      base = { x: 220, y: 70 };
    } else if (loc.includes('nashik')) {
      base = { x: 350, y: 170 };
    } else if (loc.includes('nagpur')) {
      base = { x: 700, y: 180 };
    } else if (loc.includes('aurangabad')) {
      base = { x: 470, y: 240 };
    } else if (loc.includes('kolhapur')) {
      base = { x: 330, y: 460 };
    }

    const angle = (index * 65) % 360;
    const radius = 18 + (index % 4) * 9;
    const rad = (angle * Math.PI) / 180;
    return {
      x: Math.round(base.x + Math.cos(rad) * radius),
      y: Math.round(base.y + Math.sin(rad) * radius),
    };
  };

  return (
    <div className={`relative bg-[#0a1124] rounded-2xl overflow-hidden border border-slate-800 shadow-xl flex flex-col ${height} ${className || ''}`}>
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="bg-[#0e172e]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs text-slate-300 pointer-events-auto flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold text-white text-[11px]">Live Fleet Map</span>
          <span className="text-slate-500">•</span>
          <span className="text-[11px] text-slate-400">Maharashtra & Gujarat Hubs</span>
        </div>

        {/* Filter Pills */}
        <div className="bg-[#0e172e]/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 pointer-events-auto flex items-center gap-1 shadow-lg">
          {(['All', 'On Trip', 'Available', 'Maintenance'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-2.5 py-1 text-[11px] rounded-lg font-bold transition-all ${
                filter === st
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="flex-1 w-full h-full relative cursor-crosshair">
        <svg
          viewBox="0 0 800 500"
          className="w-full h-full object-cover select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <pattern id="fleetGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#16223d" strokeWidth="0.75" />
            </pattern>

            <linearGradient id="corridorGlowLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.4" />
            </linearGradient>

            <filter id="markerGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background grid */}
          <rect width="100%" height="100%" fill="#070d1e" />
          <rect width="100%" height="100%" fill="url(#fleetGrid)" />

          {/* Western India Region Graphic */}
          <path
            d="M 170 40 Q 210 190 180 340 Q 160 430 300 480 L 760 480 L 760 40 Z"
            fill="#0d1830"
            opacity="0.8"
          />

          {/* High-traffic Corridors */}
          {/* Mumbai - Pune Expressway */}
          <path
            d="M 210 290 Q 275 325 340 360"
            fill="none"
            stroke="#10b981"
            strokeWidth="3.5"
            strokeDasharray="6,4"
            className="animate-pulse"
          />
          {/* Mumbai - Surat NH48 */}
          <path
            d="M 210 290 Q 215 180 220 70"
            fill="none"
            stroke="#263a5e"
            strokeWidth="3"
          />
          {/* Thane - Nashik NH160 */}
          <path
            d="M 235 260 Q 290 215 350 170"
            fill="none"
            stroke="#263a5e"
            strokeWidth="2.5"
          />
          {/* Pune - Kolhapur NH48 */}
          <path
            d="M 340 360 L 330 460"
            fill="none"
            stroke="#263a5e"
            strokeWidth="2.5"
          />
          {/* Pune - Aurangabad */}
          <path
            d="M 340 360 Q 405 300 470 240"
            fill="none"
            stroke="#263a5e"
            strokeWidth="2"
          />
          {/* Samruddhi Expressway corridor */}
          <path
            d="M 350 170 Q 525 175 700 180"
            fill="none"
            stroke="#263a5e"
            strokeWidth="2"
            strokeDasharray="4,4"
          />

          {/* Hub Cities */}
          {HUBS.map((hub) => (
            <g key={hub.id} transform={`translate(${hub.x}, ${hub.y})`} className="cursor-pointer">
              <circle r="14" fill="#152445" opacity="0.6" />
              <circle r="5" fill="#38bdf8" />
              <circle r="2" fill="#ffffff" />
              <text
                x="10"
                y="4"
                fill="#cbd5e1"
                fontSize="11"
                fontFamily="Inter, sans-serif"
                fontWeight="700"
                className="select-none"
              >
                {hub.name}
              </text>
            </g>
          ))}

          {/* Vehicle Markers */}
          {filteredVehicles.map((vehicle, idx) => {
            const coords = getVehicleCoords(vehicle, idx);
            const isSelected = selectedVehicle?.id === vehicle.id;
            const isOnTrip = vehicle.status === 'On Trip';
            const isMaint = vehicle.status === 'Maintenance';

            const markerColor = isOnTrip ? '#10b981' : isMaint ? '#f59e0b' : '#38bdf8';

            return (
              <g
                key={vehicle.id}
                transform={`translate(${coords.x}, ${coords.y})`}
                onClick={() => setSelectedVehicle(vehicle)}
                className="cursor-pointer group"
              >
                {/* Pulse ring for active vehicles */}
                {isOnTrip && (
                  <circle
                    r="12"
                    fill={markerColor}
                    opacity="0.35"
                    className="animate-ping"
                  />
                )}
                
                {/* Outer marker */}
                <circle
                  r={isSelected ? '10' : '7'}
                  fill="#0a1124"
                  stroke={markerColor}
                  strokeWidth={isSelected ? '3' : '2'}
                  filter="url(#markerGlow)"
                />

                {/* Center dot */}
                <circle r="3" fill="#ffffff" />

                {/* Registration label */}
                <g className={isSelected ? 'block' : 'hidden group-hover:block'}>
                  <rect
                    x="-45"
                    y="-28"
                    width="90"
                    height="18"
                    rx="4"
                    fill="#070d1e"
                    stroke={markerColor}
                    strokeWidth="1.5"
                  />
                  <text
                    x="0"
                    y="-16"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {vehicle.registration}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Selected Vehicle Quick Peek Card */}
        {selectedVehicle && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-80 bg-[#0c1630]/95 backdrop-blur-md rounded-2xl p-4 border border-slate-700 shadow-2xl z-20 text-white animate-fadeIn">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-white tracking-wide">
                    {selectedVehicle.registration}
                  </span>
                  <StatusBadge status={selectedVehicle.status} size="sm" />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{selectedVehicle.model}</p>
              </div>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="text-slate-400 hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Location</span>
                <span className="text-slate-200 font-semibold truncate block">{selectedVehicle.currentLocation}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Driver</span>
                <span className="text-slate-200 font-semibold truncate block">{selectedVehicle.currentDriverName || 'Unassigned'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Capacity</span>
                <span className="text-slate-200 font-semibold">{selectedVehicle.capacityTonnes} Tonnes</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Mileage</span>
                <span className="text-slate-200 font-semibold">{selectedVehicle.mileageKmPerL} km/L</span>
              </div>
            </div>

            <div className="mt-3 pt-2">
              <button
                onClick={() => navigate(`/fleet/${selectedVehicle.id}`)}
                className="w-full flex items-center justify-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-xl text-xs font-black shadow-md transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Open Vehicle Profile & Telemetry</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Disclaimer */}
      <div className="bg-[#070d1e] px-4 py-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Simulated Western Freight Telemetry • Live Corridors</span>
        </div>
        <div className="flex items-center gap-3 font-semibold">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> On Trip ({vehicles.filter(v => v.status === 'On Trip').length})
          </span>
          <span className="flex items-center gap-1 text-sky-400">
            <span className="w-2 h-2 rounded-full bg-sky-400" /> Ready ({vehicles.filter(v => v.status === 'Available').length})
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Workshop ({vehicles.filter(v => v.status === 'Maintenance').length})
          </span>
        </div>
      </div>
    </div>
  );
};
