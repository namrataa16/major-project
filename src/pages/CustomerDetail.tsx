import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { KpiCard } from '../components/common/KpiCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { CreateInvoiceModal } from '../components/modals/CreateInvoiceModal';
import { CreateTripModal } from '../components/modals/CreateTripModal';
import { formatCurrency, formatCurrencyLakhs, formatDate, cn } from '../utils/formatters';
import {
  Building2,
  FileText,
  DollarSign,
  MapPin,
  Plus,
  Phone,
  Mail,
  Receipt,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export const CustomerDetail: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const { customers, trips, invoices } = useApp();
  const navigate = useNavigate();

  const [createInvoiceOpen, setCreateInvoiceOpen] = useState(false);
  const [createTripOpen, setCreateTripOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'invoices' | 'trips'>('invoices');

  const customer = customers.find((c) => c.id === customerId) || customers[0];
  const customerTrips = trips.filter((t) => t.customerId === customer.id || t.customerName === customer.name);
  const customerInvoices = invoices.filter((i) => i.customerId === customer.id || i.customerName === customer.name);

  const avgTripValue = customer.totalTrips > 0 ? Math.round(customer.totalRevenue / customer.totalTrips) : 28000;

  return (
    <div className="space-y-6">
      <PageHeader
        title={customer.name}
        subtitle={`GSTIN: ${customer.gstin} • ${customer.city} • Credit Period: ${customer.creditPeriodDays} Days`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Customers', href: '/customers' },
          { label: customer.name },
        ]}
        actions={
          <>
            <button
              onClick={() => setCreateTripOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-slate-500" />
              <span>Book Trip</span>
            </button>
            <button
              onClick={() => setCreateInvoiceOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sage-800 hover:bg-sage-900 text-white text-xs font-bold shadow-sm transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Create Invoice</span>
            </button>
          </>
        }
      />

      {/* Customer Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-slate-900 text-white flex-shrink-0">
              <Building2 className="w-8 h-8 text-sage-400" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-slate-900">{customer.name}</h2>
                <StatusBadge status={customer.status} size="sm" />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{customer.address}</p>
              <div className="flex items-center gap-4 text-xs text-slate-600 mt-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {customer.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {customer.email}
                </span>
                <span className="font-semibold text-slate-800">
                  Lead: {customer.contactPerson}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Financial KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Dispatches</span>
            <span className="text-2xl font-black text-slate-900">{customer.totalTrips} Trips</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Freight Billed</span>
            <span className="text-2xl font-black text-slate-900">{formatCurrencyLakhs(customer.totalRevenue)}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Average Trip Value</span>
            <span className="text-2xl font-black text-emerald-800">{formatCurrency(avgTripValue)}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Outstanding Receivables</span>
            <span className={cn('text-2xl font-black', customer.outstandingAmount > 0 ? 'text-amber-700' : 'text-emerald-700')}>
              {formatCurrency(customer.outstandingAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('invoices')}
          className={cn(
            'px-4 py-2.5 text-xs font-bold border-b-2 transition-all',
            activeTab === 'invoices'
              ? 'border-sage-700 text-sage-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          )}
        >
          GST Invoices ({customerInvoices.length})
        </button>
        <button
          onClick={() => setActiveTab('trips')}
          className={cn(
            'px-4 py-2.5 text-xs font-bold border-b-2 transition-all',
            activeTab === 'trips'
              ? 'border-sage-700 text-sage-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          )}
        >
          Dispatch History ({customerTrips.length})
        </button>
      </div>

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Invoice ID</th>
                  <th className="py-3.5 px-4">Associated Trip</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4 text-right">Tax (GST)</th>
                  <th className="py-3.5 px-4 text-right">Total Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {customerInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      {inv.tripNumber ? (
                        <span className="font-mono text-slate-700">{inv.tripNumber}</span>
                      ) : (
                        <span className="text-slate-400 italic">Consolidated</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{formatDate(inv.invoiceDate)}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{formatDate(inv.dueDate)}</td>
                    <td className="py-3.5 px-4 text-right text-slate-500">{formatCurrency(inv.taxAmount)}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 text-sm">
                      {formatCurrency(inv.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={inv.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Trips Tab */}
      {activeTab === 'trips' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Trip ID</th>
                  <th className="py-3.5 px-4">Cargo</th>
                  <th className="py-3.5 px-4">Vehicle</th>
                  <th className="py-3.5 px-4">Route</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Revenue</th>
                  <th className="py-3.5 px-4 text-right">Net Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {customerTrips.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => navigate(`/trips/${t.id}`)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{t.tripNumber}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{t.cargo}</td>
                    <td className="py-3.5 px-4 font-mono">{t.vehicleRegistration}</td>
                    <td className="py-3.5 px-4 font-medium">{t.origin} ➔ {t.destination}</td>
                    <td className="py-3.5 px-4"><StatusBadge status={t.status} size="sm" /></td>
                    <td className="py-3.5 px-4 text-right font-semibold">{formatCurrency(t.revenue)}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-700">{formatCurrency(t.profit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateInvoiceModal
        isOpen={createInvoiceOpen}
        onClose={() => setCreateInvoiceOpen(false)}
        prefillCustomerId={customer.id}
      />
      <CreateTripModal isOpen={createTripOpen} onClose={() => setCreateTripOpen(false)} />
    </div>
  );
};
