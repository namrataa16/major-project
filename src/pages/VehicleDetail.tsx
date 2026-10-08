import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { KpiCard } from '../components/common/KpiCard';
import { AddExpenseModal } from '../components/modals/AddExpenseModal';
import { CreateTripModal } from '../components/modals/CreateTripModal';
import {
  formatCurrency,
  formatCurrencyLakhs,
  formatDate,
  formatWeight,
  formatDistance,
  cn
} from '../utils/formatters';
import {
  Truck,
  User,
  MapPin,
  Calendar,
  Fuel,
  Wrench,
  DollarSign,
  FileCheck,
  ShieldCheck,
  AlertTriangle,
  History,
  TrendingUp,
  Plus,
  Route,
  Receipt,
  ArrowRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export const VehicleDetail: React.FC = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const { vehicles, trips, expenses, documents } = useApp();
  const navigate = useNavigate();

  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [createTripOpen, setCreateTripOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'trips' | 'documents' | 'maintenance'>('overview');

  const vehicle = vehicles.find((v) => v.id === vehicleId) || vehicles[0];

  // Associated records
  const vehicleTrips = trips.filter((t) => t.vehicleId === vehicle.id || t.vehicleRegistration === vehicle.registration);
  const vehicleExpenses = expenses.filter((e) => e.vehicleId === vehicle.id || e.vehicleRegistration === vehicle.registration);
  const vehicleDocs = documents.filter((d) => d.vehicleId === vehicle.id || d.vehicleRegistration === vehicle.registration);

  // Financial chart data
  const monthlyPerf = [
    { month: 'Jun', revenue: 125000, cost: 74000, profit: 51000 },
    { month: 'Jul', revenue: 138000, cost: 81000, profit: 57000 },
    { month: 'Aug', revenue: 132000, cost: 79000, profit: 53000 },
    { month: 'Sep', revenue: 145000, cost: 84000, profit: 61000 },
    { month: 'Oct (MTD)', revenue: vehicle.revenueMonth || 142000, cost: (vehicle.fuelCostMonth + vehicle.tollCostMonth + vehicle.maintenanceCostMonth) || 79000, profit: vehicle.profitMonth || 63000 },
  ];

  const costDistribution = [
    { name: 'Fuel', value: vehicle.fuelCostMonth || 58000, color: '#256a4e' },
    { name: 'Toll', value: vehicle.tollCostMonth || 12500, color: '#3b82f6' },
    { name: 'Maintenance', value: vehicle.maintenanceCostMonth || 8500, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={vehicle.model}
        subtitle={`Registration: ${vehicle.registration} • ${vehicle.type} (${vehicle.capacityTonnes} Tonnes)`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Fleet', href: '/fleet' },
          { label: vehicle.registration },
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
              onClick={() => setCreateTripOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sage-800 hover:bg-sage-900 text-white text-xs font-bold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Dispatch Trip</span>
            </button>
          </>
        }
      />

      {/* Top Spec & Telemetry Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex-shrink-0">
              <Truck className="w-8 h-8 text-sage-400" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xl sm:text-2xl font-black text-slate-900">
                  {vehicle.registration}
                </span>
                <StatusBadge status={vehicle.status} size="md" />
              </div>
              <p className="text-sm font-semibold text-slate-700 mt-0.5">
                {vehicle.model} • {vehicle.yearOfMfg} Model
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Hub: <strong className="text-slate-800">{vehicle.currentLocation}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Driver: <strong className="text-slate-800">{vehicle.currentDriverName || 'Unassigned'}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Fuel className="w-3.5 h-3.5 text-slate-400" />
                  Mileage: <strong className="text-slate-800">{vehicle.mileageKmPerL} km/L</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick metric pills */}
          <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Payload</span>
              <span className="text-base font-bold text-slate-900">{vehicle.capacityTonnes} Tonnes</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Odometer</span>
              <span className="text-base font-bold text-slate-900">{formatDistance(vehicle.odometerKm || 148520)}</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">Utilization</span>
              <span className="text-base font-bold text-emerald-900">{vehicle.utilizationRate || 84}%</span>
            </div>
          </div>
        </div>

        {/* Technical Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 pt-5 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Body Type</span>
            <span className="font-semibold text-slate-800">{vehicle.type}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Axle Setup</span>
            <span className="font-semibold text-slate-800">{vehicle.axles} Axles</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Fuel System</span>
            <span className="font-semibold text-slate-800">{vehicle.fuelType}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Chassis No.</span>
            <span className="font-mono text-slate-800 font-medium truncate block">{vehicle.chassisNumber}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Engine No.</span>
            <span className="font-mono text-slate-800 font-medium truncate block">{vehicle.engineNumber}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Mfg Year</span>
            <span className="font-semibold text-slate-800">{vehicle.yearOfMfg}</span>
          </div>
        </div>
      </div>

      {/* Financial Overview KPIs (4 cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <KpiCard
          title="Revenue (Month)"
          value={formatCurrency(vehicle.revenueMonth || 142000)}
          subtext="5 line-haul trips completed"
          icon={DollarSign}
          variant="sage"
          trend={{ value: '+12%', positive: true }}
        />
        <KpiCard
          title="Fuel Cost"
          value={formatCurrency(vehicle.fuelCostMonth || 58000)}
          subtext="Diesel burn: 1,526 Litres"
          icon={Fuel}
          variant="default"
        />
        <KpiCard
          title="Toll & Maint."
          value={formatCurrency((vehicle.tollCostMonth || 12500) + (vehicle.maintenanceCostMonth || 8500))}
          subtext="FASTag: ₹12.5k • Maint: ₹8.5k"
          icon={Wrench}
          variant="default"
        />
        <KpiCard
          title="Net Profit (Month)"
          value={formatCurrency(vehicle.profitMonth || 63000)}
          subtext="Net margin: 44.3%"
          icon={TrendingUp}
          variant="sage"
          trend={{ value: '+18%', positive: true }}
        />
      </div>

      {/* Tab Controls */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        {[
          { id: 'overview', label: 'Financial Performance' },
          { id: 'trips', label: `Trip History (${vehicleTrips.length})` },
          { id: 'documents', label: `Compliance & Docs (${vehicleDocs.length})` },
          { id: 'maintenance', label: 'Maintenance Log' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'px-4 py-2.5 text-xs font-bold border-b-2 transition-all',
              activeTab === tab.id
                ? 'border-sage-700 text-sage-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview / Financial Charts */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Monthly Revenue vs Operating Cost</h3>
            <p className="text-xs text-slate-500 mb-4">Historical profitability performance</p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyPerf}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(val: number) => formatCurrency(val)}
                    contentStyle={{ borderRadius: '10px', fontSize: '12px' }}
                  />
                  <Bar dataKey="revenue" name="Revenue" fill="#256a4e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cost" name="Operating Cost" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Operating Cost Breakdown (MTD)</h3>
            <p className="text-xs text-slate-500 mb-4">Cost components for {vehicle.registration}</p>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {costDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => formatCurrency(val)}
                    contentStyle={{ borderRadius: '10px', fontSize: '12px' }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => <span className="text-xs text-slate-700">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Trips */}
      {activeTab === 'trips' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase">
              Recent Dispatches for {vehicle.registration}
            </h3>
            <button
              onClick={() => setCreateTripOpen(true)}
              className="text-xs font-semibold text-sage-800 hover:text-sage-950"
            >
              + Create Trip
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Trip ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Cargo</th>
                  <th className="py-3 px-4">Route</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Revenue</th>
                  <th className="py-3 px-4 text-right">Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {vehicleTrips.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => navigate(`/trips/${t.id}`)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{t.tripNumber}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{t.customerName}</td>
                    <td className="py-3 px-4 text-slate-600">{t.cargo}</td>
                    <td className="py-3 px-4 font-medium text-slate-900">{t.origin} ➔ {t.destination} ({t.distanceKm} km)</td>
                    <td className="py-3 px-4"><StatusBadge status={t.status} size="sm" /></td>
                    <td className="py-3 px-4 text-right font-semibold">{formatCurrency(t.revenue)}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-700">{formatCurrency(t.profit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Documents & Compliance */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase">
              RTO Compliance Documents Checklist
            </h3>
            <Link to="/documents" className="text-xs font-semibold text-sage-800 hover:text-sage-950">
              Fleet Compliance Center →
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {vehicleDocs.map((doc) => (
              <div key={doc.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold">
                    {doc.type}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{doc.type} Certificate</h4>
                    <p className="text-slate-500 font-mono text-[11px]">{doc.documentNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Expiry Date</span>
                    <span className="font-medium text-slate-800">{formatDate(doc.expiryDate)}</span>
                  </div>
                  <div className="text-right w-28">
                    <StatusBadge status={doc.status} size="sm" />
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {doc.daysRemaining > 0 ? `${doc.daysRemaining} days left` : 'Expired'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Maintenance */}
      {activeTab === 'maintenance' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle p-5">
          <h3 className="text-xs font-bold text-slate-900 uppercase mb-4">
            Workshop Service & Maintenance History
          </h3>
          <div className="space-y-4">
            {(vehicle.maintenanceHistory || []).map((m) => (
              <div key={m.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{m.type}</span>
                    <span className="text-slate-400 font-medium">• {formatDate(m.date)}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px]">
                      {m.odometer} km
                    </span>
                  </div>
                  <p className="text-slate-600">{m.description}</p>
                  <p className="text-[11px] text-slate-400 font-medium">Vendor: {m.vendor}</p>
                </div>
                <div className="text-right font-bold text-slate-900 text-sm flex-shrink-0">
                  {formatCurrency(m.cost)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <AddExpenseModal
        isOpen={addExpenseOpen}
        onClose={() => setAddExpenseOpen(false)}
        prefillVehicleId={vehicle.id}
      />
      <CreateTripModal isOpen={createTripOpen} onClose={() => setCreateTripOpen(false)} />
    </div>
  );
};
