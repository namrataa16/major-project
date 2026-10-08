import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { PageHeader } from '../components/common/PageHeader';
import { RouteIntelligenceMap } from '../components/map/RouteIntelligenceMap';
import { CreateTripModal } from '../components/modals/CreateTripModal';
import { Modal } from '../components/common/Modal';
import { MUMBAI_PUNE_ROUTES, OTHER_CORRIDOR_ROUTES } from '../data/routeOptions';
import { calculateRouteScore, compareRoutes, DEFAULT_ROUTE_WEIGHTS } from '../utils/routeScorer';
import { formatCurrency, formatDistance, formatWeight, cn } from '../utils/formatters';
import {
  Route,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Mountain,
  Fuel,
  Clock,
  DollarSign,
  Sliders,
  ArrowRight,
  TrendingDown,
  Truck,
  Check,
  Zap,
  Info,
  Layers,
  ChevronRight
} from 'lucide-react';
import { RouteOption, RouteScoringWeights } from '../types';

export const RouteIntelligence: React.FC = () => {
  const { vehicles, routeWeights, updateRouteWeights } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Control state
  const [origin, setOrigin] = useState('Mumbai');
  const [destination, setDestination] = useState('Pune');
  const [selectedVehicleId, setSelectedVehicleId] = useState('veh-01'); // MH 04 AB 2847 default
  const [cargoName, setCargoName] = useState('Industrial Goods & Steel Coils');
  const [cargoWeight, setCargoWeight] = useState(18); // 18 Tonnes default
  const [deadline, setDeadline] = useState('Today, 6:00 PM');
  const [optimizationMode, setOptimizationMode] = useState<
    'Vehicle Suitability' | 'Lowest Operating Cost' | 'Fastest ETA' | 'Balanced'
  >('Vehicle Suitability');

  // Selected Route for active map inspection
  const [activeRouteId, setActiveRouteId] = useState<string>('route-b-expressway');
  const [weightsModalOpen, setWeightsModalOpen] = useState(false);
  const [createTripOpen, setCreateTripOpen] = useState(false);

  // Local weights for tuning
  const [customWeights, setCustomWeights] = useState<RouteScoringWeights>(routeWeights);

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  // Get base corridor routes
  const baseRoutes: RouteOption[] = useMemo(() => {
    const key = `${origin.toLowerCase()}-${destination.toLowerCase()}`;
    if (OTHER_CORRIDOR_ROUTES[key]) {
      return OTHER_CORRIDOR_ROUTES[key];
    }
    return MUMBAI_PUNE_ROUTES;
  }, [origin, destination]);

  // Adjust optimization weights temporarily based on mode
  const effectiveWeights: RouteScoringWeights = useMemo(() => {
    if (optimizationMode === 'Lowest Operating Cost') {
      return { ...customWeights, fuelCost: 0.45, tollCost: 0.25, travelTime: 0.1, terrainDifficulty: 0.1, roadQuality: 0.05, vehicleSuitability: 0.05 };
    }
    if (optimizationMode === 'Fastest ETA') {
      return { ...customWeights, travelTime: 0.5, roadQuality: 0.2, fuelCost: 0.1, tollCost: 0.05, terrainDifficulty: 0.05, vehicleSuitability: 0.1 };
    }
    if (optimizationMode === 'Vehicle Suitability') {
      return customWeights; // default vehicle-aware weights
    }
    // Balanced
    return DEFAULT_ROUTE_WEIGHTS;
  }, [optimizationMode, customWeights]);

  // Dynamically calculate scores for all routes
  const calculatedRoutes = useMemo(() => {
    return baseRoutes.map((route) => {
      const calculation = calculateRouteScore(route, selectedVehicle, cargoWeight, effectiveWeights);
      return {
        ...route,
        dynamicScore: calculation.score,
        dynamicTotalCost: calculation.totalOperatingCost,
        breakdown: calculation.breakdown,
      };
    });
  }, [baseRoutes, selectedVehicle, cargoWeight, effectiveWeights]);

  // Identify recommended route (Highest dynamic score)
  const sortedRoutes = [...calculatedRoutes].sort((a, b) => b.dynamicScore - a.dynamicScore);
  const recommendedRoute = sortedRoutes[0] || calculatedRoutes[1];
  const shortestRoute = [...calculatedRoutes].sort((a, b) => a.distanceKm - b.distanceKm)[0];

  const comparison = compareRoutes(recommendedRoute, shortestRoute);

  const handleSaveWeights = (e: React.FormEvent) => {
    e.preventDefault();
    updateRouteWeights(customWeights);
    setWeightsModalOpen(false);
    showToast('Custom scoring matrix weights saved & recomputed across all corridors', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Flagship Header */}
      <PageHeader
        title="Route Intelligence"
        subtitle="Not just the shortest route. The right route for your vehicle."
        tag="Vehicle-Aware Routing Engine"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Route Intelligence' }]}
        actions={
          <>
            <button
              onClick={() => setWeightsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span>Tune Matrix Weights</span>
            </button>
            <button
              onClick={() => setCreateTripOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sage-800 hover:bg-sage-900 text-white text-xs font-bold shadow-sm transition-all"
            >
              <span>Dispatch on Route B</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        }
      />

      {/* Control / Input Configuration Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Route className="w-4 h-4 text-sage-800" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Corridor & Fleet Parameters
            </h3>
          </div>
          <span className="text-[11px] font-medium text-slate-400">
            Demo route intelligence — simulated data
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5 text-xs">
          {/* Origin */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Origin City</label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 font-semibold"
            >
              <option value="Mumbai">Mumbai (JNPT / Vashi)</option>
              <option value="Thane">Thane</option>
              <option value="Bhiwandi">Bhiwandi</option>
            </select>
          </div>

          {/* Destination */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Destination City</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 font-semibold"
            >
              <option value="Pune">Pune (Chakan / Hinjewadi)</option>
              <option value="Surat">Surat (Hazira)</option>
              <option value="Nashik">Nashik</option>
            </select>
          </div>

          {/* Vehicle Selector */}
          <div className="lg:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Selected Vehicle</label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 font-mono font-medium"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.model} — {v.registration} ({v.capacityTonnes}T • {v.type})
                </option>
              ))}
            </select>
          </div>

          {/* Cargo Payload */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Cargo Payload ({formatWeight(cargoWeight)})
            </label>
            <input
              type="number"
              min="1"
              max={selectedVehicle.capacityTonnes}
              step="1"
              value={cargoWeight}
              onChange={(e) => setCargoWeight(Number(e.target.value))}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 font-bold"
            />
          </div>

          {/* Optimization Goal */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Optimization Mode</label>
            <select
              value={optimizationMode}
              onChange={(e) => setOptimizationMode(e.target.value as any)}
              className="w-full p-2 bg-sage-50 border border-sage-300 text-sage-900 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 font-bold"
            >
              <option value="Vehicle Suitability">Vehicle Suitability ★</option>
              <option value="Lowest Operating Cost">Lowest Operating Cost</option>
              <option value="Fastest ETA">Fastest ETA</option>
              <option value="Balanced">Balanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Featured Recommendation Spotlight Box (The core hero moment) */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-sage-900 via-slate-900 to-slate-950 text-white border border-sage-700/60 shadow-xl relative overflow-hidden">
        {/* Background glow circle */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-sage-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-sage-500 text-slate-950 uppercase tracking-wide shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                {recommendedRoute.dynamicScore}/100 RECOMMENDED
              </span>
              <span className="text-xs font-semibold text-slate-300">
                {recommendedRoute.name}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              "11% longer distance, but estimated 8% lower operating cost and lower terrain difficulty."
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              Why ONGO doesn't recommend the shortest path: <strong>Route A (120 km)</strong> passes through the historic Bhor Ghat with an 8.2% gradient and 24 km of winding switchbacks. For a <strong>{selectedVehicle.model}</strong> carrying an <strong>{cargoWeight}T payload</strong>, the severe gradient causes excessive lower-gear revving, burning ₹250 more diesel and doubling clutch thermal strain. <strong>Route B (135 km)</strong> uses the engineered expressway viaduct with smooth 3.8% gradient.
            </p>

            {/* Checklist of 5 reasons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
              <div className="flex items-center gap-2 text-sage-200">
                <Check className="w-4 h-4 text-sage-400 flex-shrink-0" />
                <span>Lower estimated fuel cost (₹2,700 vs ₹2,950)</span>
              </div>
              <div className="flex items-center gap-2 text-sage-200">
                <Check className="w-4 h-4 text-sage-400 flex-shrink-0" />
                <span>Better road quality (Grade A 6-lane Concrete)</span>
              </div>
              <div className="flex items-center gap-2 text-sage-200">
                <Check className="w-4 h-4 text-sage-400 flex-shrink-0" />
                <span>Lower terrain difficulty (3.8% engineered gradient)</span>
              </div>
              <div className="flex items-center gap-2 text-sage-200">
                <Check className="w-4 h-4 text-sage-400 flex-shrink-0" />
                <span>Better suited for {selectedVehicle.model} ({selectedVehicle.capacityTonnes}T)</span>
              </div>
              <div className="flex items-center gap-2 text-sage-200 sm:col-span-2">
                <Check className="w-4 h-4 text-sage-400 flex-shrink-0" />
                <span>Faster estimated arrival (3h 35m vs 3h 50m)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-3 w-full lg:w-56 flex-shrink-0">
            <button
              onClick={() => setCreateTripOpen(true)}
              className="py-3 px-4 bg-sage-500 hover:bg-sage-400 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all text-center flex items-center justify-center gap-2"
            >
              <span>Dispatch on Route B</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveRouteId(recommendedRoute.id)}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors text-center"
            >
              Highlight on Map
            </button>
          </div>
        </div>
      </div>

      {/* 3 Route Alternative Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {calculatedRoutes.map((route) => {
          const isSelected = activeRouteId === route.id;
          const isRec = route.isRecommended;

          return (
            <div
              key={route.id}
              onClick={() => setActiveRouteId(route.id)}
              className={cn(
                'rounded-2xl border p-5 transition-all cursor-pointer flex flex-col justify-between relative',
                isRec
                  ? 'bg-sage-50/70 border-sage-300 ring-2 ring-sage-600/40 shadow-card'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-subtle',
                isSelected && !isRec && 'ring-2 ring-slate-400'
              )}
            >
              {/* Badge */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{route.routeCode}</span>
                    {isRec ? (
                      <span className="bg-sage-800 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                        ★ RECOMMENDED
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded">
                        {route.distanceKm < 125 ? 'Shortest Distance' : 'Alternative'}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-semibold text-slate-700 mt-1">{route.name}</h4>
                </div>

                <div className="text-right flex-shrink-0">
                  <div
                    className={cn(
                      'text-xl font-black',
                      isRec ? 'text-sage-900' : 'text-slate-700'
                    )}
                  >
                    {route.dynamicScore}/100
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Score</span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2.5 py-3 border-y border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Distance</span>
                  <span className="font-bold text-slate-900">{formatDistance(route.distanceKm)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Estimated ETA</span>
                  <span className="font-bold text-slate-900">{route.estimatedDuration}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Estimated Fuel</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(route.estimatedFuelCost)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">FASTag Toll</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(route.tollCost)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Road Quality</span>
                  <span className={cn('font-semibold', route.roadQuality === 'High' ? 'text-emerald-700' : 'text-slate-700')}>
                    {route.roadQuality} Quality
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Terrain Difficulty</span>
                  <span className={cn('font-semibold', route.terrainDifficulty === 'High' ? 'text-rose-700' : route.terrainDifficulty === 'Low' ? 'text-emerald-700' : 'text-amber-700')}>
                    {route.terrainDifficulty} ({route.gradientPercentage}%)
                  </span>
                </div>
              </div>

              {/* Corridor Path Description */}
              <p className="text-[11px] text-slate-500 mt-3 italic line-clamp-2">
                {route.routePathDescription}
              </p>

              {/* Warnings / Highlights */}
              <div className="mt-3 pt-2 space-y-1 text-xs">
                {route.warnings && route.warnings.length > 0 && (
                  <div className="p-2 rounded-lg bg-rose-50 border border-rose-100 text-[11px] text-rose-800 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <span>{route.warnings[0]}</span>
                  </div>
                )}
                {isRec && (
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 text-[11px] text-emerald-900 flex items-start gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <span>Engineered gradient saves fuel on high-payload line-hauls</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive High-Fidelity SVG Route Map */}
      <RouteIntelligenceMap
        routes={calculatedRoutes}
        selectedRouteId={activeRouteId}
        onSelectRoute={setActiveRouteId}
        originName={origin}
        destinationName={destination}
      />

      {/* Matrix Weights Configuration Modal */}
      <Modal
        isOpen={weightsModalOpen}
        onClose={() => setWeightsModalOpen(false)}
        title="Dynamic Route Scoring Matrix Weights"
        subtitle="Adjust the weighting parameters used to calculate vehicle-aware suitability scores"
        maxWidth="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                setCustomWeights(DEFAULT_ROUTE_WEIGHTS);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Reset Defaults
            </button>
            <button
              type="submit"
              form="weights-form"
              className="px-4 py-2 text-xs font-semibold text-white bg-sage-800 rounded-lg hover:bg-sage-900 shadow-sm"
            >
              Apply Scoring Weights
            </button>
          </>
        }
      >
        <form id="weights-form" onSubmit={handleSaveWeights} className="space-y-4 text-xs">
          <p className="text-slate-500 text-[11px]">
            The total weights must equal 100%. Adjusting these sliders changes the score calculation in real time.
          </p>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-slate-800">Fuel Cost Burden (25%)</span>
                <span className="font-bold text-slate-900">{Math.round(customWeights.fuelCost * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.50"
                step="0.05"
                value={customWeights.fuelCost}
                onChange={(e) => setCustomWeights({ ...customWeights, fuelCost: parseFloat(e.target.value) })}
                className="w-full accent-sage-700"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-slate-800">Travel Time & Speed (20%)</span>
                <span className="font-bold text-slate-900">{Math.round(customWeights.travelTime * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.50"
                step="0.05"
                value={customWeights.travelTime}
                onChange={(e) => setCustomWeights({ ...customWeights, travelTime: parseFloat(e.target.value) })}
                className="w-full accent-sage-700"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-slate-800">Terrain & Elevation Gradient (15%)</span>
                <span className="font-bold text-slate-900">{Math.round(customWeights.terrainDifficulty * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.50"
                step="0.05"
                value={customWeights.terrainDifficulty}
                onChange={(e) => setCustomWeights({ ...customWeights, terrainDifficulty: parseFloat(e.target.value) })}
                className="w-full accent-sage-700"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-slate-800">Road Quality & Pavement (15%)</span>
                <span className="font-bold text-slate-900">{Math.round(customWeights.roadQuality * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.50"
                step="0.05"
                value={customWeights.roadQuality}
                onChange={(e) => setCustomWeights({ ...customWeights, roadQuality: parseFloat(e.target.value) })}
                className="w-full accent-sage-700"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-slate-800">Vehicle Specification Fit (15%)</span>
                <span className="font-bold text-slate-900">{Math.round(customWeights.vehicleSuitability * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.50"
                step="0.05"
                value={customWeights.vehicleSuitability}
                onChange={(e) => setCustomWeights({ ...customWeights, vehicleSuitability: parseFloat(e.target.value) })}
                className="w-full accent-sage-700"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-slate-800">FASTag Toll Cost (10%)</span>
                <span className="font-bold text-slate-900">{Math.round(customWeights.tollCost * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.30"
                step="0.05"
                value={customWeights.tollCost}
                onChange={(e) => setCustomWeights({ ...customWeights, tollCost: parseFloat(e.target.value) })}
                className="w-full accent-sage-700"
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Create Trip Modal */}
      <CreateTripModal isOpen={createTripOpen} onClose={() => setCreateTripOpen(false)} />
    </div>
  );
};
