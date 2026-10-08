import React from 'react';
import { Drawer } from '../common/Drawer';
import { StatusBadge } from '../common/StatusBadge';
import { Load } from '../../types';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { matchVehiclesForLoad } from '../../utils/vehicleMatcher';
import { Truck, Check, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/formatters';

interface VehicleMatchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  load: Load | null;
  onSelectVehicleForTrip?: (load: Load, vehicleId: string) => void;
}

export const VehicleMatchDrawer: React.FC<VehicleMatchDrawerProps> = ({
  isOpen,
  onClose,
  load,
  onSelectVehicleForTrip,
}) => {
  const { vehicles, assignVehicleToLoad } = useApp();
  const { showToast } = useToast();

  if (!load) return null;

  const matchResults = matchVehiclesForLoad(load, vehicles);

  const handleAssign = (vehicleId: string, reg: string) => {
    assignVehicleToLoad(load.id, vehicleId);
    showToast(`Vehicle ${reg} assigned to load ${load.loadNumber}`, 'success');
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`AI Vehicle Match — ${load.loadNumber}`}
      subtitle={`Finding the optimal vehicle for ${load.cargo} (${load.weightTonnes}T) from ${load.origin} to ${load.destination}`}
      width="lg"
    >
      <div className="space-y-4">
        {/* Load Details Summary Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="font-bold text-slate-900">{load.customerName}</span>
            <StatusBadge status={load.status} size="sm" />
          </div>
          <p className="text-slate-700 font-medium">{load.cargo}</p>
          <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-200 text-[11px]">
            <div>
              <span className="text-slate-400 block">Payload</span>
              <strong className="text-slate-900">{load.weightTonnes} Tonnes</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Route</span>
              <strong className="text-slate-900">{load.origin} ➔ {load.destination}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Requirement</span>
              <strong className="text-slate-900">{load.vehicleRequirement}</strong>
            </div>
          </div>
        </div>

        {/* AI Scoring Breakdown Note */}
        <div className="flex items-start gap-2 p-3 bg-sage-50 rounded-xl border border-sage-200 text-xs text-sage-900">
          <Sparkles className="w-4 h-4 text-sage-700 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Vehicle Match Matrix</span>
            <span className="text-slate-600 text-[11px]">
              Ranked dynamically by Capacity Fit (35%), Live Availability (30%), Hub Proximity (20%), and Body Type Compatibility (15%).
            </span>
          </div>
        </div>

        {/* Vehicle Match List */}
        <div className="space-y-3">
          {matchResults.map(({ vehicle, matchScore, notes, isAvailable }, idx) => {
            const isAssignedToThis = load.assignedVehicleId === vehicle.id;
            const isTopMatch = idx === 0;

            return (
              <div
                key={vehicle.id}
                className={cn(
                  'p-4 rounded-xl border transition-all relative',
                  isTopMatch
                    ? 'border-sage-300 bg-sage-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300',
                  isAssignedToThis && 'ring-2 ring-emerald-600 bg-emerald-50/30'
                )}
              >
                {/* Top Match Ribbon */}
                {isTopMatch && (
                  <div className="absolute -top-2.5 right-4 bg-sage-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-2.5 h-2.5" />
                    Optimal Match
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-slate-900">
                        {vehicle.registration}
                      </span>
                      <StatusBadge status={vehicle.status} size="sm" />
                    </div>
                    <p className="text-xs text-slate-600">
                      {vehicle.model} • <strong className="text-slate-900">{vehicle.capacityTonnes}T Capacity</strong> • {vehicle.type}
                    </p>
                  </div>

                  {/* Match Score Badge */}
                  <div className="text-right flex-shrink-0">
                    <div
                      className={cn(
                        'text-lg font-black tracking-tight',
                        matchScore >= 90
                          ? 'text-emerald-700'
                          : matchScore >= 75
                          ? 'text-sage-700'
                          : 'text-amber-700'
                      )}
                    >
                      {matchScore}%
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Match Fit
                    </span>
                  </div>
                </div>

                {/* Match Factors / Notes */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {notes.map((note, nIdx) => (
                    <span
                      key={nIdx}
                      className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {note}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-500">
                    Driver: <strong className="text-slate-800">{vehicle.currentDriverName || 'Unassigned'}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {isAssignedToThis ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg">
                        <Check className="w-3.5 h-3.5" />
                        Currently Assigned
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAssign(vehicle.id, vehicle.registration)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        Assign Vehicle
                      </button>
                    )}

                    {onSelectVehicleForTrip && (
                      <button
                        onClick={() => {
                          onSelectVehicleForTrip(load, vehicle.id);
                          onClose();
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-sage-800 hover:bg-sage-900 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <span>Dispatch</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Drawer>
  );
};
