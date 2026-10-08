import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { FilterBar } from '../components/common/FilterBar';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';
import { AddVehicleModal } from '../components/modals/AddVehicleModal';
import { formatNumber, formatWeight, cn } from '../utils/formatters';
import { Truck, Plus, Eye, Fuel, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { VehicleType, VehicleStatus } from '../types';

export const Fleet: React.FC = () => {
  const { vehicles } = useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesSearch =
        searchQuery === '' ||
        v.registration.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.currentLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.currentDriverName && v.currentDriverName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
      const matchesType = typeFilter === 'all' || v.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [vehicles, searchQuery, statusFilter, typeFilter]);

  const filterGroups = [
    {
      id: 'status',
      label: 'Status',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { label: 'Available', value: 'Available' },
        { label: 'On Trip', value: 'On Trip' },
        { label: 'Maintenance', value: 'Maintenance' },
        { label: 'Inactive', value: 'Inactive' },
      ],
    },
    {
      id: 'type',
      label: 'Type',
      value: typeFilter,
      onChange: setTypeFilter,
      options: [
        { label: 'Heavy Truck', value: 'Heavy Truck' },
        { label: 'Container Truck', value: 'Container Truck' },
        { label: 'Multi-Axle', value: 'Multi-Axle' },
        { label: 'Tipper', value: 'Tipper' },
        { label: 'Light Commercial Vehicle', value: 'Light Commercial Vehicle' },
      ],
    },
  ];

  const handleReset = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTypeFilter('all');
    setSearchParams({});
  };

  // Quick stats
  const availableCount = vehicles.filter((v) => v.status === 'Available').length;
  const onTripCount = vehicles.filter((v) => v.status === 'On Trip').length;
  const maintCount = vehicles.filter((v) => v.status === 'Maintenance').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fleet Management"
        subtitle={`Centralized oversight of all ${vehicles.length} commercial vehicles across Western hubs`}
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Fleet' }]}
        actions={
          <button
            onClick={() => setAddVehicleOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sage-800 hover:bg-sage-900 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>
        }
      />

      {/* Quick Summary Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setStatusFilter('all')}
          className={cn(
            'p-3 rounded-xl border bg-white cursor-pointer transition-all',
            statusFilter === 'all' ? 'border-sage-600 ring-1 ring-sage-600/30' : 'border-slate-200'
          )}
        >
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">Total Fleet</span>
          <span className="text-xl font-bold text-slate-900">{vehicles.length} Units</span>
        </div>
        <div
          onClick={() => setStatusFilter('On Trip')}
          className={cn(
            'p-3 rounded-xl border bg-white cursor-pointer transition-all',
            statusFilter === 'On Trip' ? 'border-sage-600 ring-1 ring-sage-600/30' : 'border-slate-200'
          )}
        >
          <span className="text-[11px] font-semibold text-emerald-700 uppercase block">On Route / Trip</span>
          <span className="text-xl font-bold text-emerald-800">{onTripCount} Active</span>
        </div>
        <div
          onClick={() => setStatusFilter('Available')}
          className={cn(
            'p-3 rounded-xl border bg-white cursor-pointer transition-all',
            statusFilter === 'Available' ? 'border-sage-600 ring-1 ring-sage-600/30' : 'border-slate-200'
          )}
        >
          <span className="text-[11px] font-semibold text-blue-700 uppercase block">Available for Load</span>
          <span className="text-xl font-bold text-blue-800">{availableCount} Ready</span>
        </div>
        <div
          onClick={() => setStatusFilter('Maintenance')}
          className={cn(
            'p-3 rounded-xl border bg-white cursor-pointer transition-all',
            statusFilter === 'Maintenance' ? 'border-sage-600 ring-1 ring-sage-600/30' : 'border-slate-200'
          )}
        >
          <span className="text-[11px] font-semibold text-amber-700 uppercase block">Workshop & Maint</span>
          <span className="text-xl font-bold text-amber-800">{maintCount} Units</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by registration (e.g. MH 04 AB 2847), model, driver, location..."
        filterGroups={filterGroups}
        totalResults={filteredVehicles.length}
        onReset={handleReset}
      />

      {/* Fleet Table */}
      {filteredVehicles.length === 0 ? (
        <EmptyState
          title="No vehicles match your filters"
          description="Try changing the registration search query or resetting active status/type filters."
          actionLabel="Reset All Filters"
          onAction={handleReset}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Vehicle</th>
                  <th className="py-3.5 px-4">Registration</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Capacity</th>
                  <th className="py-3.5 px-4">Driver</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Mileage</th>
                  <th className="py-3.5 px-4">Documents</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredVehicles.map((vehicle) => {
                  const hasExpiringDoc = vehicle.documents.some((d) => d.status === 'Expiring Soon');
                  const hasExpiredDoc = vehicle.documents.some((d) => d.status === 'Expired');

                  return (
                    <tr
                      key={vehicle.id}
                      onClick={() => navigate(`/fleet/${vehicle.id}`)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{vehicle.model}</div>
                        <div className="text-[11px] text-slate-400">
                          {vehicle.axles} Axles • {vehicle.fuelType}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {vehicle.registration}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">{vehicle.type}</td>

                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {formatWeight(vehicle.capacityTonnes)}
                      </td>

                      <td className="py-3.5 px-4">
                        {vehicle.currentDriverName ? (
                          <span className="text-slate-800 font-medium">{vehicle.currentDriverName}</span>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={vehicle.status} size="sm" />
                      </td>

                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {vehicle.currentLocation}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">{vehicle.mileageKmPerL}</span>
                        <span className="text-[10px] text-slate-400 ml-0.5">km/L</span>
                      </td>

                      <td className="py-3.5 px-4">
                        {hasExpiredDoc ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            <AlertTriangle className="w-3 h-3" />
                            Expired
                          </span>
                        ) : hasExpiringDoc ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            <AlertTriangle className="w-3 h-3" />
                            Expiring
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <ShieldCheck className="w-3 h-3" />
                            Valid
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-sage-800 group-hover:text-sage-950">
                          <span>Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Vehicle Modal */}
      <AddVehicleModal isOpen={addVehicleOpen} onClose={() => setAddVehicleOpen(false)} />
    </div>
  );
};
