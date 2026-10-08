import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { KpiCard } from '../components/common/KpiCard';
import { AddExpenseModal } from '../components/modals/AddExpenseModal';
import { CreateInvoiceModal } from '../components/modals/CreateInvoiceModal';
import { formatCurrency, formatDate, formatDistance, cn } from '../utils/formatters';
import {
  MapPin,
  Truck,
  User,
  Package,
  Clock,
  DollarSign,
  Route,
  Receipt,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { TripStatus } from '../types';

export const TripDetail: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const { trips, vehicles, drivers, expenses, updateTripStatus } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [createInvoiceOpen, setCreateInvoiceOpen] = useState(false);

  const trip = trips.find((t) => t.id === tripId) || trips[0];
  const vehicle = vehicles.find((v) => v.id === trip.vehicleId);
  const driver = drivers.find((d) => d.id === trip.driverId);
  const tripExpenses = expenses.filter((e) => e.tripId === trip.id || e.tripNumber === trip.tripNumber);

  const totalLoggedExpense = tripExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = trip.revenue - (totalLoggedExpense > 0 ? totalLoggedExpense : trip.estimatedCost);

  const handleStatusUpdate = (newStatus: TripStatus) => {
    updateTripStatus(trip.id, newStatus);
    showToast(`Trip ${trip.tripNumber} status updated to ${newStatus}`, 'success');
  };

  const timelineSteps = [
    { label: 'Trip Planned & Route Generated', time: '08:00 AM', done: true },
    { label: 'Vehicle Staged at Mumbai Stockyard', time: '09:15 AM', done: true },
    { label: 'Cargo Loaded & Weighed (18 Tonnes)', time: '09:45 AM', done: true },
    {
      label: 'Dispatched via Expressway (Route B)',
      time: '10:15 AM',
      done: trip.status === 'On Route' || trip.status === 'Delivered',
      current: trip.status === 'On Route',
    },
    {
      label: 'Delivered at Pune Consignee Gate',
      time: trip.status === 'Delivered' ? '02:15 PM' : 'Est. 06:15 PM',
      done: trip.status === 'Delivered',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={trip.tripNumber}
        subtitle={`${trip.customerName} • ${trip.origin} ➔ ${trip.destination} (${trip.distanceKm} km)`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Trips', href: '/trips' },
          { label: trip.tripNumber },
        ]}
        actions={
          <>
            <Link
              to="/route-intelligence"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sage-50 text-sage-900 border border-sage-200 text-xs font-bold hover:bg-sage-100 transition-colors shadow-xs"
            >
              <Route className="w-4 h-4 text-sage-700" />
              <span>Route Intelligence</span>
            </Link>
            <button
              onClick={() => setAddExpenseOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Receipt className="w-3.5 h-3.5 text-slate-500" />
              <span>Log Expense</span>
            </button>
            <button
              onClick={() => setCreateInvoiceOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sage-800 hover:bg-sage-900 text-white text-xs font-bold shadow-sm transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Invoice</span>
            </button>
          </>
        }
      />

      {/* Top Banner: Status & Progression Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-100 rounded-xl text-slate-700 font-black text-sm">
            {trip.tripNumber}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-lg font-bold text-slate-900">
                {trip.origin} <span className="text-slate-400 font-normal">➔</span> {trip.destination}
              </span>
              <StatusBadge status={trip.status} size="md" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              ETA: <strong className="text-slate-800">{trip.eta}</strong> • Distance: <strong>{trip.distanceKm} km</strong>
            </p>
          </div>
        </div>

        {/* Status Transition Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {trip.status !== 'Delivered' && (
            <>
              {trip.status !== 'On Route' && (
                <button
                  onClick={() => handleStatusUpdate('On Route')}
                  className="px-3 py-1.5 rounded-lg bg-sage-50 text-sage-900 border border-sage-200 text-xs font-bold hover:bg-sage-100"
                >
                  Mark On Route
                </button>
              )}
              {trip.status !== 'Delayed' && (
                <button
                  onClick={() => handleStatusUpdate('Delayed')}
                  className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold hover:bg-amber-100"
                >
                  Report Delay
                </button>
              )}
              <button
                onClick={() => handleStatusUpdate('Delivered')}
                className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Delivered</span>
              </button>
            </>
          )}
          {trip.status === 'Delivered' && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Trip Completed & Delivered
            </span>
          )}
        </div>
      </div>

      {/* Financial Breakdown KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <KpiCard
          title="Agreed Freight Revenue"
          value={formatCurrency(trip.revenue)}
          subtext={`Customer: ${trip.customerName}`}
          icon={DollarSign}
          variant="sage"
        />
        <KpiCard
          title="Total Operating Cost"
          value={formatCurrency(totalLoggedExpense > 0 ? totalLoggedExpense : trip.estimatedCost)}
          subtext={`Logged: ${tripExpenses.length} expense items`}
          icon={Receipt}
          variant="default"
        />
        <KpiCard
          title="Net Profit Margin"
          value={formatCurrency(netProfit)}
          subtext={`Margin: ${Math.round((netProfit / trip.revenue) * 100)}%`}
          icon={CheckCircle2}
          variant="sage"
          trend={{ value: `${Math.round((netProfit / trip.revenue) * 100)}%`, positive: true }}
        />
      </div>

      {/* Vehicle-Aware Route Intelligence Highlight Box */}
      <div className="bg-sage-50/80 rounded-2xl border border-sage-200 p-5 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-sage-800 text-white mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-sage-950">Applied Route Intelligence</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sage-200 text-sage-900 uppercase">
                  Engine Decision
                </span>
              </div>
              <p className="text-xs font-bold text-slate-800 mt-1">
                {trip.selectedRouteName || 'Route B — Mumbai-Pune Expressway (Engineered Corridor)'}
              </p>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                "Not just the shortest route. The right route for your vehicle." Selected 135 km engineered expressway corridor
                instead of 120 km Old NH4 to bypass the steep 8.2% Bhor Ghat gradient. This saved an estimated 8% fuel burn and reduced clutch wear for {trip.vehicleRegistration}.
              </p>
            </div>
          </div>

          <Link
            to="/route-intelligence"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-sage-300 text-xs font-bold text-sage-900 hover:bg-sage-100 transition-colors flex-shrink-0"
          >
            <span>Compare Routes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2 Column Details: Entity Cards & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Entities (Vehicle, Driver, Cargo) - 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Vehicle Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-subtle">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Vehicle</span>
                <Link to={`/fleet/${trip.vehicleId}`} className="text-xs font-semibold text-sage-800 hover:text-sage-950">
                  Telemetry →
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                  <Truck className="w-5 h-5 text-slate-800" />
                </div>
                <div>
                  <span className="font-mono text-base font-bold text-slate-900 block">
                    {trip.vehicleRegistration}
                  </span>
                  <span className="text-xs text-slate-600 font-medium">
                    {vehicle?.model || 'Ashok Leyland 2820'} ({vehicle?.capacityTonnes || 20}T Capacity)
                  </span>
                </div>
              </div>
            </div>

            {/* Driver Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-subtle">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Driver</span>
                <span className="text-xs font-medium text-slate-500">{driver?.experienceYears || 12} yrs exp</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                  <User className="w-5 h-5 text-slate-800" />
                </div>
                <div>
                  <span className="text-base font-bold text-slate-900 block">{trip.driverName}</span>
                  <span className="text-xs text-slate-500 font-mono">{driver?.phone || '+91 98192 10293'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cargo Card */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-subtle">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Consignment & Payload Details
            </span>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{trip.cargo}</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Consignor: <strong className="text-slate-800">{trip.customerName}</strong>
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase">Payload</span>
                  <span className="font-bold text-slate-900">{trip.weightTonnes} Tonnes</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase">Capacity Fit</span>
                  <span className="font-bold text-emerald-700">90% Utilization</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trip Logged Expenses Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase">
                Trip Expense Items ({tripExpenses.length})
              </h3>
              <button
                onClick={() => setAddExpenseOpen(true)}
                className="text-xs font-semibold text-sage-800 hover:text-sage-950"
              >
                + Add Expense
              </button>
            </div>
            {tripExpenses.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No individual receipts logged yet. Base estimated cost: {formatCurrency(trip.estimatedCost)}.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {tripExpenses.map((exp) => (
                  <div key={exp.id} className="p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{exp.category}</span>
                        <span className="text-[10px] text-slate-400">{formatDate(exp.date)}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5">{exp.description}</p>
                    </div>
                    <div className="text-right font-bold text-slate-900">
                      {formatCurrency(exp.amount)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Timeline Progression (1 col) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
            Dispatch Milestones
          </h3>
          <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
            {timelineSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 relative z-10 text-xs">
                <div
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold shadow-xs',
                    step.done
                      ? 'bg-emerald-600 ring-4 ring-emerald-50'
                      : step.current
                      ? 'bg-sage-600 ring-4 ring-sage-100 animate-pulse'
                      : 'bg-slate-300 ring-4 ring-slate-50'
                  )}
                >
                  {step.done ? '✓' : idx + 1}
                </div>
                <div>
                  <p className={cn('font-semibold', step.done ? 'text-slate-900' : 'text-slate-500')}>
                    {step.label}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{step.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddExpenseModal
        isOpen={addExpenseOpen}
        onClose={() => setAddExpenseOpen(false)}
        prefillVehicleId={trip.vehicleId}
        prefillTripId={trip.id}
      />
      <CreateInvoiceModal
        isOpen={createInvoiceOpen}
        onClose={() => setCreateInvoiceOpen(false)}
        prefillCustomerId={trip.customerId}
        prefillTripId={trip.id}
      />
    </div>
  );
};
