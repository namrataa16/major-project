import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { KpiCard } from '../components/common/KpiCard';
import { FilterBar } from '../components/common/FilterBar';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';
import { AddExpenseModal } from '../components/modals/AddExpenseModal';
import { formatCurrency, formatCurrencyLakhs, formatDate, cn } from '../utils/formatters';
import {
  Receipt,
  Plus,
  Fuel,
  CreditCard,
  Wrench,
  UserCheck,
  TrendingDown,
  DollarSign,
  PieChart as PieIcon,
  CheckCircle2
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
import { ExpenseCategory } from '../types';

export const Expenses: React.FC = () => {
  const { expenses, vehicles } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);

  // Financial aggregates
  const totalExpenses = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
  const fuelExpenses = useMemo(() => expenses.filter(e => e.category === 'Fuel').reduce((sum, e) => sum + e.amount, 0), [expenses]);
  const tollExpenses = useMemo(() => expenses.filter(e => e.category === 'Toll').reduce((sum, e) => sum + e.amount, 0), [expenses]);
  const maintExpenses = useMemo(() => expenses.filter(e => e.category === 'Maintenance').reduce((sum, e) => sum + e.amount, 0), [expenses]);
  const driverAdvances = useMemo(() => expenses.filter(e => e.category === 'Driver Advance').reduce((sum, e) => sum + e.amount, 0), [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const matchesSearch =
        searchQuery === '' ||
        e.vehicleRegistration.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.tripNumber && e.tripNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.loggedBy.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;
      const matchesVehicle = vehicleFilter === 'all' || e.vehicleId === vehicleFilter;

      return matchesSearch && matchesCategory && matchesVehicle;
    });
  }, [expenses, searchQuery, categoryFilter, vehicleFilter]);

  const filterGroups = [
    {
      id: 'category',
      label: 'Category',
      value: categoryFilter,
      onChange: setCategoryFilter,
      options: [
        { label: 'Fuel', value: 'Fuel' },
        { label: 'Toll', value: 'Toll' },
        { label: 'Driver Advance', value: 'Driver Advance' },
        { label: 'Maintenance', value: 'Maintenance' },
        { label: 'Parking', value: 'Parking' },
        { label: 'Loading/Unloading', value: 'Loading/Unloading' },
        { label: 'Miscellaneous', value: 'Miscellaneous' },
      ],
    },
    {
      id: 'vehicle',
      label: 'Vehicle',
      value: vehicleFilter,
      onChange: setVehicleFilter,
      options: vehicles.map((v) => ({ label: v.registration, value: v.id })),
    },
  ];

  // Category Pie Chart data
  const pieData = [
    { name: 'Fuel', value: fuelExpenses || 68000, color: '#256a4e' },
    { name: 'Toll', value: tollExpenses || 16500, color: '#3b82f6' },
    { name: 'Maintenance', value: maintExpenses || 18500, color: '#f59e0b' },
    { name: 'Driver Advances', value: driverAdvances || 14000, color: '#8b5cf6' },
    { name: 'Loading & Misc', value: 9200, color: '#64748b' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expense Management"
        subtitle="Track fuel receipts, FASTag tolls, maintenance invoices, and driver allowances"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Expenses' }]}
        actions={
          <button
            onClick={() => setAddExpenseOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sage-800 hover:bg-sage-900 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        }
      />

      {/* KPI Cards (5 cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <KpiCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          subtext={`${expenses.length} logged items`}
          icon={Receipt}
          variant="default"
        />
        <KpiCard
          title="Fuel (Diesel)"
          value={formatCurrency(fuelExpenses)}
          subtext="54% of fleet spend"
          icon={Fuel}
          variant="sage"
        />
        <KpiCard
          title="Toll (FASTag)"
          value={formatCurrency(tollExpenses)}
          subtext="Auto-synced plazas"
          icon={CreditCard}
          variant="blue"
        />
        <KpiCard
          title="Maintenance"
          value={formatCurrency(maintExpenses)}
          subtext="Workshops & tyres"
          icon={Wrench}
          variant="amber"
        />
        <KpiCard
          title="Driver Advances"
          value={formatCurrency(driverAdvances)}
          subtext="Trip batta & meals"
          icon={UserCheck}
          variant="default"
        />
      </div>

      {/* Featured Trip Profitability Card & Category Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sample Trip Profitability Analysis Card (from prompt specification) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Corridor Unit Economics
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                TRP-2041 Mumbai ➔ Pune
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Trip Profitability Breakdown</h3>
            <p className="text-xs text-slate-500 mt-0.5">Ashok Leyland 2820 (18T Payload)</p>

            <div className="space-y-2.5 mt-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-bold text-slate-900">
                <span>Agreed Revenue:</span>
                <span className="text-emerald-800">₹30,000</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sage-600" /> Fuel (Diesel 76L):
                </span>
                <span>₹7,200</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> FASTag Toll:
                </span>
                <span>₹1,100</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" /> Driver Advance:
                </span>
                <span>₹2,500</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400" /> Loading / Strapping:
                </span>
                <span>₹2,300</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 font-semibold text-slate-700">
                <span>Total Operating Cost:</span>
                <span className="text-rose-700 font-bold">₹13,100</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
            <div>
              <span className="text-[10px] font-bold uppercase text-emerald-800 block">Net Realized Profit</span>
              <span className="text-xl font-black text-emerald-900">₹16,900</span>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-lg shadow-2xs border border-emerald-200">
              56.3% Margin
            </span>
          </div>
        </div>

        {/* Category Distribution Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Fleet Expenditure Allocation</h3>
              <p className="text-xs text-slate-500">Breakdown across all active operational expense heads</p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
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

      {/* Filter and Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by vehicle reg, description, trip number, logged by..."
        filterGroups={filterGroups}
        totalResults={filteredExpenses.length}
        onReset={() => {
          setSearchQuery('');
          setCategoryFilter('all');
          setVehicleFilter('all');
        }}
      />

      {/* Expenses Table */}
      {filteredExpenses.length === 0 ? (
        <EmptyState
          title="No expenses found"
          description="Try modifying your search or add a new expense."
          actionLabel="Log Expense"
          onAction={() => setAddExpenseOpen(true)}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Trip</th>
                  <th className="py-3.5 px-4">Vehicle</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Logged By</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-900">{formatDate(exp.date)}</td>
                    <td className="py-3.5 px-4">
                      {exp.tripNumber ? (
                        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {exp.tripNumber}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">General Fleet</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {exp.vehicleRegistration}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">{exp.category}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">{exp.description}</td>
                    <td className="py-3.5 px-4 text-slate-500">{exp.loggedBy}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {exp.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 text-sm">
                      {formatCurrency(exp.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      <AddExpenseModal isOpen={addExpenseOpen} onClose={() => setAddExpenseOpen(false)} />
    </div>
  );
};
