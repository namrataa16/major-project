import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { KpiCard } from '../components/common/KpiCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { AlertCard } from '../components/common/AlertCard';
import { FleetMap } from '../components/map/FleetMap';
import { CreateTripModal } from '../components/modals/CreateTripModal';
import { AddExpenseModal } from '../components/modals/AddExpenseModal';
import { formatCurrency, formatCurrencyLakhs, formatDistance } from '../utils/formatters';
import {
  Truck,
  MapPin,
  CheckCircle2,
  Wrench,
  DollarSign,
  TrendingUp,
  Percent,
  Plus,
  Route,
  Receipt,
  ArrowRight,
  Sparkles,
  Layers,
  Fuel,
  ShieldAlert
} from 'lucide-react';
import {
  AreaChart,
  Area,
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

export const Dashboard: React.FC = () => {
  const { organization, currentUser, vehicles, trips, expenses, alerts, resolveAlert } = useApp();
  const navigate = useNavigate();

  const [createTripOpen, setCreateTripOpen] = useState(false);
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);

  // Derived KPIs
  const totalVehicles = vehicles.length; // 24
  const activeTripsCount = trips.filter((t) => t.status === 'On Route' || t.status === 'Loading' || t.status === 'Delayed').length; // ~17
  const availableVehiclesCount = vehicles.filter((v) => v.status === 'Available').length; // 4
  const maintenanceVehiclesCount = vehicles.filter((v) => v.status === 'Maintenance').length; // 3

  // Financial KPIs
  const totalRevenue = 1840000; // ₹18.4L
  const totalCost = 1270000;    // ₹12.7L
  const totalProfit = 570000;   // ₹5.7L
  const fleetUtilization = 71;  // 71%

  // Financial Trend Data (6 Months)
  const financialTrendData = [
    { month: 'May', revenue: 1420000, cost: 980000, profit: 440000 },
    { month: 'Jun', revenue: 1560000, cost: 1090000, profit: 470000 },
    { month: 'Jul', revenue: 1680000, cost: 1180000, profit: 500000 },
    { month: 'Aug', revenue: 1720000, cost: 1210000, profit: 510000 },
    { month: 'Sep', revenue: 1790000, cost: 1240000, profit: 550000 },
    { month: 'Oct (Est)', revenue: 1840000, cost: 1270000, profit: 570000 },
  ];

  // Cost Breakdown Data
  const costBreakdownData = [
    { name: 'Fuel (Diesel)', value: 680000, color: '#256a4e' },
    { name: 'Toll (FASTag)', value: 165000, color: '#3b82f6' },
    { name: 'Maintenance', value: 185000, color: '#f59e0b' },
    { name: 'Driver Advances', value: 140000, color: '#8b5cf6' },
    { name: 'Other/Overhead', value: 100000, color: '#64748b' },
  ];

  // Fleet status distribution
  const statusDistribution = [
    { name: 'On Trip', count: vehicles.filter(v => v.status === 'On Trip').length, color: '#256a4e' },
    { name: 'Available', count: availableVehiclesCount, color: '#3b82f6' },
    { name: 'Maintenance', count: maintenanceVehiclesCount, color: '#f59e0b' },
    { name: 'Inactive', count: vehicles.filter(v => v.status === 'Inactive').length, color: '#94a3b8' },
  ];

  const recentTrips = trips.slice(0, 6);
  const activeAlerts = alerts.filter(a => !a.resolved);

  return (
    <div className="space-y-6">
      {/* Welcome Page Header */}
      <PageHeader
        title={`Good morning, ${currentUser?.name.split(' ')[0] || 'Rajesh'}`}
        subtitle="Here's what's happening across your fleet today in Maharashtra & Gujarat corridors."
        tag="Live Command Center"
        actions={
          <>
            <Link
              to="/route-intelligence"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sage-50 text-sage-900 border border-sage-200 text-xs font-bold hover:bg-sage-100 transition-colors shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-sage-700" />
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
              <span>Create Trip</span>
            </button>
          </>
        }
      />

      {/* Primary KPI Grid (8 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3.5">
        <KpiCard
          title="Total Vehicles"
          value={totalVehicles}
          subtext="20 Heavy • 4 Multi-Axle"
          icon={Truck}
          variant="default"
          onClick={() => navigate('/fleet')}
        />
        <KpiCard
          title="Active Trips"
          value={activeTripsCount}
          subtext="14 on schedule, 1 delayed"
          icon={MapPin}
          variant="sage"
          trend={{ value: '+12%', positive: true }}
          onClick={() => navigate('/trips')}
        />
        <KpiCard
          title="Available"
          value={availableVehiclesCount}
          subtext="Ready for dispatch"
          icon={CheckCircle2}
          variant="blue"
          onClick={() => navigate('/fleet?status=Available')}
        />
        <KpiCard
          title="Maintenance"
          value={maintenanceVehiclesCount}
          subtext="2 scheduled, 1 overhaul"
          icon={Wrench}
          variant="amber"
          onClick={() => navigate('/fleet?status=Maintenance')}
        />

        <KpiCard
          title="Revenue This Month"
          value={formatCurrencyLakhs(totalRevenue)}
          subtext="Target: ₹20.0L (92%)"
          icon={DollarSign}
          variant="sage"
          trend={{ value: '+8.4%', positive: true }}
          onClick={() => navigate('/analytics')}
        />
        <KpiCard
          title="Operating Cost"
          value={formatCurrencyLakhs(totalCost)}
          subtext="Fuel: ₹6.8L • Toll: ₹1.65L"
          icon={Fuel}
          variant="default"
          onClick={() => navigate('/expenses')}
        />
        <KpiCard
          title="Estimated Profit"
          value={formatCurrencyLakhs(totalProfit)}
          subtext="Net Margin: 31.0%"
          icon={TrendingUp}
          variant="sage"
          trend={{ value: '+14.2%', positive: true }}
          onClick={() => navigate('/analytics')}
        />
        <KpiCard
          title="Fleet Utilization"
          value={`${fleetUtilization}%`}
          subtext="Optimal band (70-85%)"
          icon={Percent}
          variant="default"
          onClick={() => navigate('/analytics')}
        />
      </div>

      {/* Featured Banner: Vehicle-Aware Route Intelligence Demo Prompt */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sage-950 via-slate-900 to-sage-900 text-white border border-sage-800/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-sage-500/20 text-sage-300 border border-sage-500/30 flex-shrink-0 mt-1">
            <Route className="w-5 h-5 text-sage-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Vehicle-Aware Route Intelligence</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sage-500 text-slate-950">
                Core Differentiator
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              "Not just the shortest route. The right route for your vehicle." See how ONGO recommends
              Route B (135 km) over Route A (120 km) for heavy vehicles like <strong>MH 04 AB 2847</strong> to save 8% operating cost.
            </p>
          </div>
        </div>

        <Link
          to="/route-intelligence"
          className="inline-flex items-center gap-2 px-4 py-2 bg-sage-500 hover:bg-sage-400 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all flex-shrink-0"
        >
          <span>Explore Route Engine</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Center Section: Live Map & Fleet Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Fleet Map (2 cols) */}
        <div className="lg:col-span-2 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sage-700" />
              <span>Simulated Western Corridor Fleet Telemetry</span>
            </h2>
            <Link to="/fleet" className="text-xs font-semibold text-sage-800 hover:text-sage-950">
              View All 24 Vehicles →
            </Link>
          </div>
          <FleetMap height="h-[360px]" />
        </div>

        {/* Fleet Status Summary & Active Alerts (1 col) */}
        <div className="space-y-4">
          {/* Status Breakdown Box */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-subtle">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Fleet Status Summary
            </h3>
            <div className="space-y-2.5">
              {statusDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{item.count}</span>
                    <span className="text-[10px] text-slate-400">
                      ({Math.round((item.count / totalVehicles) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick mini progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-100 mt-4 overflow-hidden flex">
              <div className="bg-sage-600 h-full" style={{ width: `${(17 / 24) * 100}%` }} />
              <div className="bg-blue-500 h-full" style={{ width: `${(4 / 24) * 100}%` }} />
              <div className="bg-amber-500 h-full" style={{ width: `${(3 / 24) * 100}%` }} />
            </div>
          </div>

          {/* Urgent Compliance & Operations Alerts */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-subtle">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Urgent Alerts ({activeAlerts.length})
                </h3>
              </div>
              <Link to="/documents" className="text-[11px] font-semibold text-sage-800 hover:text-sage-950">
                Compliance Center
              </Link>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto">
              {activeAlerts.slice(0, 3).map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  compact
                  onResolve={(id) => resolveAlert(id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Profit Trajectory Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Financial Performance Trajectory</h3>
              <p className="text-xs text-slate-500">Monthly revenue vs operating cost (₹ in Lakhs)</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
              31.0% Net Margin
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialTrendData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#256a4e" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#256a4e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64748b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  formatter={(val: number) => formatCurrency(val)}
                  contentStyle={{ borderRadius: '10px', fontSize: '12px', border: '1px solid #e2e8f0' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#256a4e"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="cost"
                  name="Operating Cost"
                  stroke="#64748b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#costGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operating Cost Breakdown Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Operating Cost Distribution</h3>
              <p className="text-xs text-slate-500">Major fleet expenditure centers this month</p>
            </div>
            <Link to="/expenses" className="text-xs font-semibold text-sage-800 hover:text-sage-950">
              Manage Expenses →
            </Link>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {costBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => formatCurrency(val)}
                  contentStyle={{ borderRadius: '10px', fontSize: '12px', border: '1px solid #e2e8f0' }}
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

      {/* Recent Trips Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Active Trips</h3>
            <p className="text-xs text-slate-500">Live corridor dispatch tracking & profitability</p>
          </div>
          <Link
            to="/trips"
            className="inline-flex items-center gap-1 text-xs font-semibold text-sage-800 hover:text-sage-950"
          >
            <span>View All Trips</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Trip ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Cargo</th>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Driver</th>
                <th className="py-3 px-4">Route</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Revenue</th>
                <th className="py-3 px-4 text-right">Net Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentTrips.map((trip) => (
                <tr
                  key={trip.id}
                  onClick={() => navigate(`/trips/${trip.id}`)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{trip.tripNumber}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{trip.customerName}</td>
                  <td className="py-3 px-4 text-slate-600 truncate max-w-[140px]">{trip.cargo}</td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-900">{trip.vehicleRegistration}</td>
                  <td className="py-3 px-4 text-slate-600">{trip.driverName}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800">{trip.origin}</span>
                    <span className="text-slate-400 mx-1">➔</span>
                    <span className="font-semibold text-slate-800">{trip.destination}</span>
                    <span className="text-[10px] text-slate-400 ml-1">({trip.distanceKm} km)</span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={trip.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-900">
                    {formatCurrency(trip.revenue)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-700">
                    {formatCurrency(trip.profit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <CreateTripModal isOpen={createTripOpen} onClose={() => setCreateTripOpen(false)} />
      <AddExpenseModal isOpen={addExpenseOpen} onClose={() => setAddExpenseOpen(false)} />
    </div>
  );
};
