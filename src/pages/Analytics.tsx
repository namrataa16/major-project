import React from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { KpiCard } from '../components/common/KpiCard';
import { formatCurrency, formatCurrencyLakhs, cn } from '../utils/formatters';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Fuel,
  Percent,
  Clock,
  Truck,
  RotateCcw,
  CheckCircle2,
  Building2,
  Calendar
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
  Legend,
  LineChart,
  Line
} from 'recharts';

export const Analytics: React.FC = () => {
  const { vehicles, customers } = useApp();

  // Monthly Financial Trajectory (6 Months)
  const monthlyRevenueData = [
    { month: 'May', revenue: 1420000, cost: 980000, profit: 440000, margin: 31.0 },
    { month: 'Jun', revenue: 1560000, cost: 1090000, profit: 470000, margin: 30.1 },
    { month: 'Jul', revenue: 1680000, cost: 1180000, profit: 500000, margin: 29.8 },
    { month: 'Aug', revenue: 1720000, cost: 1210000, profit: 510000, margin: 29.7 },
    { month: 'Sep', revenue: 1790000, cost: 1240000, profit: 550000, margin: 30.7 },
    { month: 'Oct (MTD)', revenue: 1840000, cost: 1270000, profit: 570000, margin: 31.0 },
  ];

  // Fuel Consumption & Efficiency by Vehicle Type
  const fuelEfficiencyData = [
    { type: 'Heavy Truck (20T)', avgMileage: 3.8, fuelCostMonth: 58000 },
    { type: 'Multi-Axle (32T)', avgMileage: 3.1, fuelCostMonth: 89000 },
    { type: 'Tipper (25T)', avgMileage: 3.4, fuelCostMonth: 72000 },
    { type: 'Container (28T)', avgMileage: 3.2, fuelCostMonth: 78000 },
    { type: 'LCV (7T-10T)', avgMileage: 6.8, fuelCostMonth: 22000 },
  ];

  // Fleet Utilization Trend (Weekly % over last 8 weeks)
  const utilizationTrend = [
    { week: 'W1 Sep', rate: 66 },
    { week: 'W2 Sep', rate: 68 },
    { week: 'W3 Sep', rate: 73 },
    { week: 'W4 Sep', rate: 70 },
    { week: 'W1 Oct', rate: 72 },
    { week: 'W2 Oct', rate: 71 },
  ];

  // Top Customer Revenue Contribution
  const customerRevenueData = customers.slice(0, 5).map((c) => ({
    name: c.name.split(' ')[0] + ' ' + (c.name.split(' ')[1] || ''),
    revenue: c.totalRevenue,
  }));

  // Top vehicle profitability leaderboard
  const vehicleLeaderboard = [...vehicles]
    .sort((a, b) => (b.profitMonth || 0) - (a.profitMonth || 0))
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive BI & Fleet Analytics"
        subtitle="Deep dive into fleet margins, empty running ratios, fuel efficiency, and vehicle unit economics"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Analytics' }]}
      />

      {/* Primary KPI Grid (8 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3.5">
        <KpiCard
          title="Monthly Revenue"
          value="₹18.4L"
          subtext="Target: ₹20.0L (92%)"
          icon={DollarSign}
          variant="sage"
          trend={{ value: '+8.4%', positive: true }}
        />
        <KpiCard
          title="Operating Cost"
          value="₹12.7L"
          subtext="Fuel: ₹6.8L • Toll: ₹1.65L"
          icon={Fuel}
          variant="default"
        />
        <KpiCard
          title="Net Operating Profit"
          value="₹5.7L"
          subtext="Net Margin: 31.0%"
          icon={TrendingUp}
          variant="sage"
          trend={{ value: '+14.2%', positive: true }}
        />
        <KpiCard
          title="Fleet Utilization"
          value="71%"
          subtext="Target Band (70-85%)"
          icon={Percent}
          variant="default"
          trend={{ value: '+3%', positive: true }}
        />

        <KpiCard
          title="Average Fuel Mileage"
          value="4.1 km/L"
          subtext="Heavy fleet standard"
          icon={Fuel}
          variant="default"
        />
        <KpiCard
          title="Average Trip Value"
          value="₹34,200"
          subtext="Avg line-haul haulage"
          icon={BarChart3}
          variant="sage"
        />
        <KpiCard
          title="Empty Running %"
          value="8.2%"
          subtext="Well below 15% benchmark"
          icon={RotateCcw}
          variant="blue"
          trend={{ value: '-2.1%', positive: true, label: 'Lower is better' }}
        />
        <KpiCard
          title="On-Time Delivery"
          value="94.6%"
          subtext="SLA Target: 92%"
          icon={CheckCircle2}
          variant="sage"
          trend={{ value: '+1.4%', positive: true }}
        />
      </div>

      {/* Charts Grid 1: Revenue vs Cost + Fleet Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue vs Cost */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Monthly Revenue & Cost Trajectory</h3>
              <p className="text-xs text-slate-500">6-Month historical performance (₹ in Lakhs)</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
              31.0% Net Margin
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData}>
                <defs>
                  <linearGradient id="anRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#256a4e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#256a4e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="anCostGrad" x1="0" y1="0" x2="0" y2="1">
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
                  contentStyle={{ borderRadius: '10px', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#256a4e"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#anRevGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="cost"
                  name="Operating Cost"
                  stroke="#64748b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#anCostGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fleet Utilization Trend */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Fleet Utilization Index (%)</h3>
              <p className="text-xs text-slate-500">Weekly active trip running vs idle capacity</p>
            </div>
            <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
              Optimal (71%)
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={utilizationTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  domain={[50, 100]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(val: number) => `${val}% Utilization`}
                  contentStyle={{ borderRadius: '10px', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  name="Utilization Rate"
                  stroke="#256a4e"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#256a4e' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Grid 2: Fuel Efficiency & Customer Contribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fuel Mileage by Vehicle Class */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Fuel Economy by Vehicle Class</h3>
          <p className="text-xs text-slate-500 mb-4">Average verified mileage (km/L)</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fuelEfficiencyData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 8]} tick={{ fontSize: 11 }} />
                <YAxis dataKey="type" type="category" width={130} tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(val: number) => `${val} km/L`}
                  contentStyle={{ borderRadius: '10px', fontSize: '12px' }}
                />
                <Bar dataKey="avgMileage" name="Mileage (km/L)" fill="#256a4e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Revenue Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Top Client Revenue Concentration</h3>
          <p className="text-xs text-slate-500 mb-4">Key shippers driving freight volume</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
                />
                <Tooltip
                  formatter={(val: number) => formatCurrency(val)}
                  contentStyle={{ borderRadius: '10px', fontSize: '12px' }}
                />
                <Bar dataKey="revenue" name="Lifetime Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Vehicle Profitability Leaderboard Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Vehicle Unit Economics Leaderboard</h3>
            <p className="text-xs text-slate-500">
              Ranking top individual asset contribution, operating margin, and utilization
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">Sorted by Monthly Profit</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Vehicle</th>
                <th className="py-3.5 px-4">Model & Type</th>
                <th className="py-3.5 px-4 text-center">Payload</th>
                <th className="py-3.5 px-4 text-center">Utilization</th>
                <th className="py-3.5 px-4 text-right">Revenue (MTD)</th>
                <th className="py-3.5 px-4 text-right">Operating Cost</th>
                <th className="py-3.5 px-4 text-right">Net Profit</th>
                <th className="py-3.5 px-4 text-right">Profit Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {vehicleLeaderboard.map((v, idx) => {
                const totalCost = (v.fuelCostMonth || 0) + (v.tollCostMonth || 0) + (v.maintenanceCostMonth || 0);
                const profit = v.profitMonth || 0;
                const margin = v.revenueMonth ? Math.round((profit / v.revenueMonth) * 100) : 0;

                return (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                          #{idx + 1}
                        </span>
                        <span className="font-mono font-bold text-slate-900">{v.registration}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{v.model}</div>
                      <div className="text-[11px] text-slate-400">{v.type}</div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                      {v.capacityTonnes}T
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {v.utilizationRate || 84}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-semibold text-slate-900">
                      {formatCurrency(v.revenueMonth || 140000)}
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-500">
                      {formatCurrency(totalCost)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-black text-emerald-700 text-sm">
                      {formatCurrency(profit)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {margin}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
