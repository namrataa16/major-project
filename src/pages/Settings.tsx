import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { PageHeader } from '../components/common/PageHeader';
import { DEFAULT_ROUTE_WEIGHTS } from '../utils/routeScorer';
import {
  Building,
  User,
  Sliders,
  Bell,
  Shield,
  RotateCcw,
  Save,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import { RouteScoringWeights } from '../types';

export const Settings: React.FC = () => {
  const { organization, currentUser, routeWeights, updateRouteWeights, resetToDefaults } = useApp();
  const { showToast } = useToast();

  const [weights, setWeights] = useState<RouteScoringWeights>(routeWeights);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [complianceNoticeDays, setComplianceNoticeDays] = useState(30);

  const handleSaveWeights = (e: React.FormEvent) => {
    e.preventDefault();
    updateRouteWeights(weights);
    showToast('Default Route Intelligence weighting configuration updated!', 'success');
  };

  const handleResetDemo = () => {
    resetToDefaults();
    setWeights(DEFAULT_ROUTE_WEIGHTS);
    showToast('Demo state and configuration reset to pristine defaults.', 'info');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="System Settings & Organization Profile"
        subtitle="Manage fleet configuration, enterprise identity, notification rules, and Route Intelligence defaults"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Settings' }]}
      />

      {/* Organization Information Box */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Organization Profile</h3>
            <p className="text-xs text-slate-500">Commercial enterprise registration details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Company / Fleet Name</label>
            <input
              type="text"
              readOnly
              value={organization.name}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">GSTIN Number</label>
            <input
              type="text"
              readOnly
              value={organization.gstin}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-medium text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">PAN Number</label>
            <input
              type="text"
              readOnly
              value={organization.pan}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Active Fleet Size</label>
            <input
              type="text"
              readOnly
              value={`${organization.fleetSize} Commercial Vehicles`}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-emerald-800"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Registered Logistics Hub</label>
            <input
              type="text"
              readOnly
              value={organization.address}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
            />
          </div>
        </div>
      </div>

      {/* User Profile Box */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">User Profile</h3>
            <p className="text-xs text-slate-500">Active session & role credentials</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              readOnly
              value={currentUser?.name || 'Rajesh Sharma'}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Designation / Role</label>
            <input
              type="text"
              readOnly
              value={currentUser?.role || 'Fleet Operations Manager'}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Work Email</label>
            <input
              type="text"
              readOnly
              value={currentUser?.email || 'rajesh@rajeshtransport.in'}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Route Intelligence Default Weights Box */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sage-100 text-sage-800">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Route Intelligence Default Scoring Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Configure default weightings for vehicle-aware corridor evaluation
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-sage-800 bg-sage-50 px-2.5 py-1 rounded-lg border border-sage-200">
            Dynamic Algorithm
          </span>
        </div>

        <form onSubmit={handleSaveWeights} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between mb-1 font-semibold text-slate-700">
                <span>Fuel Cost Weight:</span>
                <span className="font-bold text-slate-900">{Math.round(weights.fuelCost * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.50"
                step="0.05"
                value={weights.fuelCost}
                onChange={(e) => setWeights({ ...weights, fuelCost: parseFloat(e.target.value) })}
                className="w-full accent-sage-700"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1 font-semibold text-slate-700">
                <span>Travel Time Weight:</span>
                <span className="font-bold text-slate-900">{Math.round(weights.travelTime * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.50"
                step="0.05"
                value={weights.travelTime}
                onChange={(e) => setWeights({ ...weights, travelTime: parseFloat(e.target.value) })}
                className="w-full accent-sage-700"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1 font-semibold text-slate-700">
                <span>Terrain Difficulty & Gradient:</span>
                <span className="font-bold text-slate-900">{Math.round(weights.terrainDifficulty * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.50"
                step="0.05"
                value={weights.terrainDifficulty}
                onChange={(e) => setWeights({ ...weights, terrainDifficulty: parseFloat(e.target.value) })}
                className="w-full accent-sage-700"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1 font-semibold text-slate-700">
                <span>Road Quality & Pavement:</span>
                <span className="font-bold text-slate-900">{Math.round(weights.roadQuality * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.50"
                step="0.05"
                value={weights.roadQuality}
                onChange={(e) => setWeights({ ...weights, roadQuality: parseFloat(e.target.value) })}
                className="w-full accent-sage-700"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1 font-semibold text-slate-700">
                <span>Vehicle Payload Fit & Specs:</span>
                <span className="font-bold text-slate-900">{Math.round(weights.vehicleSuitability * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.50"
                step="0.05"
                value={weights.vehicleSuitability}
                onChange={(e) => setWeights({ ...weights, vehicleSuitability: parseFloat(e.target.value) })}
                className="w-full accent-sage-700"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1 font-semibold text-slate-700">
                <span>Toll Expense Weight:</span>
                <span className="font-bold text-slate-900">{Math.round(weights.tollCost * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.30"
                step="0.05"
                value={weights.tollCost}
                onChange={(e) => setWeights({ ...weights, tollCost: parseFloat(e.target.value) })}
                className="w-full accent-sage-700"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-sage-800 hover:bg-sage-900 text-white rounded-xl font-bold shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Default Weights</span>
            </button>
          </div>
        </form>
      </div>

      {/* Demo Reset Danger Zone */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Reset Demo State</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Clear locally persisted alterations and restore original pitch showcase data
          </p>
        </div>
        <button
          onClick={handleResetDemo}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors shadow-xs"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Mock Data</span>
        </button>
      </div>
    </div>
  );
};
