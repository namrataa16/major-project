import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { FilterBar } from '../components/common/FilterBar';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';
import { CreateTripModal } from '../components/modals/CreateTripModal';
import { formatCurrency, formatDistance, cn } from '../utils/formatters';
import { MapPin, Plus, ArrowRight, Route, Clock, DollarSign } from 'lucide-react';
import { TripStatus } from '../types';

export const Trips: React.FC = () => {
  const { trips, customers } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [customerFilter, setCustomerFilter] = useState<string>('all');
  const [createTripOpen, setCreateTripOpen] = useState(false);

  const filteredTrips = useMemo(() => {
    return trips.filter((t) => {
      const matchesSearch =
        searchQuery === '' ||
        t.tripNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.vehicleRegistration.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.cargo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.destination.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchesCustomer = customerFilter === 'all' || t.customerId === customerFilter;

      return matchesSearch && matchesStatus && matchesCustomer;
    });
  }, [trips, searchQuery, statusFilter, customerFilter]);

  const filterGroups = [
    {
      id: 'status',
      label: 'Status',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { label: 'Planned', value: 'Planned' },
        { label: 'Loading', value: 'Loading' },
        { label: 'On Route', value: 'On Route' },
        { label: 'Delivered', value: 'Delivered' },
        { label: 'Delayed', value: 'Delayed' },
      ],
    },
    {
      id: 'customer',
      label: 'Customer',
      value: customerFilter,
      onChange: setCustomerFilter,
      options: customers.map((c) => ({ label: c.name, value: c.id })),
    },
  ];

  const handleReset = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCustomerFilter('all');
  };

  // Quick summary counts
  const onRouteCount = trips.filter((t) => t.status === 'On Route').length;
  const loadingCount = trips.filter((t) => t.status === 'Loading').length;
  const delayedCount = trips.filter((t) => t.status === 'Delayed').length;
  const deliveredCount = trips.filter((t) => t.status === 'Delivered').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trip Management"
        subtitle="Track active freight dispatches, driver assignments, and trip margins"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Trips' }]}
        actions={
          <button
            onClick={() => setCreateTripOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sage-800 hover:bg-sage-900 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Trip</span>
          </button>
        }
      />

      {/* Quick Summary Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setStatusFilter('On Route')}
          className={cn(
            'p-3 rounded-xl border bg-white cursor-pointer transition-all',
            statusFilter === 'On Route' ? 'border-sage-600 ring-1 ring-sage-600/30' : 'border-slate-200'
          )}
        >
          <span className="text-[11px] font-semibold text-emerald-700 uppercase block">On Route / In Transit</span>
          <span className="text-xl font-bold text-emerald-800">{onRouteCount} Linehauls</span>
        </div>
        <div
          onClick={() => setStatusFilter('Loading')}
          className={cn(
            'p-3 rounded-xl border bg-white cursor-pointer transition-all',
            statusFilter === 'Loading' ? 'border-sage-600 ring-1 ring-sage-600/30' : 'border-slate-200'
          )}
        >
          <span className="text-[11px] font-semibold text-sky-700 uppercase block">Loading & Staging</span>
          <span className="text-xl font-bold text-sky-800">{loadingCount} Trucks</span>
        </div>
        <div
          onClick={() => setStatusFilter('Delayed')}
          className={cn(
            'p-3 rounded-xl border bg-white cursor-pointer transition-all',
            statusFilter === 'Delayed' ? 'border-sage-600 ring-1 ring-sage-600/30' : 'border-slate-200'
          )}
        >
          <span className="text-[11px] font-semibold text-rose-700 uppercase block">Delayed Bottlenecks</span>
          <span className="text-xl font-bold text-rose-800">{delayedCount} Dispatches</span>
        </div>
        <div
          onClick={() => setStatusFilter('Delivered')}
          className={cn(
            'p-3 rounded-xl border bg-white cursor-pointer transition-all',
            statusFilter === 'Delivered' ? 'border-sage-600 ring-1 ring-sage-600/30' : 'border-slate-200'
          )}
        >
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">Completed Today</span>
          <span className="text-xl font-bold text-slate-800">{deliveredCount} Trips</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search trip ID (TRP-2041), customer, vehicle registration, origin..."
        filterGroups={filterGroups}
        totalResults={filteredTrips.length}
        onReset={handleReset}
      />

      {/* Trips Table */}
      {filteredTrips.length === 0 ? (
        <EmptyState
          title="No trips found"
          description="Try adjusting your search criteria or create a new trip dispatch."
          actionLabel="Create Trip"
          onAction={() => setCreateTripOpen(true)}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Trip ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Cargo</th>
                  <th className="py-3.5 px-4">Vehicle</th>
                  <th className="py-3.5 px-4">Driver</th>
                  <th className="py-3.5 px-4">Route & Distance</th>
                  <th className="py-3.5 px-4">ETA</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Revenue</th>
                  <th className="py-3.5 px-4 text-right">Est. Cost</th>
                  <th className="py-3.5 px-4 text-right">Net Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTrips.map((trip) => (
                  <tr
                    key={trip.id}
                    onClick={() => navigate(`/trips/${trip.id}`)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {trip.tripNumber}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {trip.customerName}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 truncate max-w-[130px]">{trip.cargo}</div>
                      <div className="text-[10px] text-slate-400">{trip.weightTonnes} Tonnes</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                      {trip.vehicleRegistration}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {trip.driverName}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">
                        {trip.origin} <span className="text-slate-400">➔</span> {trip.destination}
                      </div>
                      <div className="text-[11px] text-slate-400">{trip.distanceKm} km</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {trip.eta}
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={trip.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right font-semibold text-slate-900">
                      {formatCurrency(trip.revenue)}
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-500 font-medium">
                      {formatCurrency(trip.estimatedCost)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-emerald-700">
                      {formatCurrency(trip.profit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateTripModal isOpen={createTripOpen} onClose={() => setCreateTripOpen(false)} />
    </div>
  );
};
