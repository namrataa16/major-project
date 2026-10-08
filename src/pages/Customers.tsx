import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { FilterBar } from '../components/common/FilterBar';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { formatCurrency, formatCurrencyLakhs, cn } from '../utils/formatters';
import { Building2, Plus, ArrowRight, Phone, Mail, FileText, AlertCircle } from 'lucide-react';
import { Customer } from '../types';

export const Customers: React.FC = () => {
  const { customers, addCustomer } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);

  // New Customer Form
  const [name, setName] = useState('');
  const [gstin, setGstin] = useState('27AAAC');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [creditPeriodDays, setCreditPeriodDays] = useState(30);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      return (
        searchQuery === '' ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.gstin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [customers, searchQuery]);

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCustomer({
      name: name.trim(),
      gstin: gstin.trim().toUpperCase(),
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      city: city.trim(),
      status: 'Active',
      creditPeriodDays: Number(creditPeriodDays),
    });

    setAddCustomerOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enterprise Customers & Billing"
        subtitle="Manage client shipping accounts, contracted freight tariffs, credit periods, and outstanding invoices"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Customers' }]}
        actions={
          <button
            onClick={() => setAddCustomerOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sage-800 hover:bg-sage-900 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search customer name, GSTIN (27AAACT2727Q1ZW), contact person, city..."
        totalResults={filteredCustomers.length}
        onReset={() => setSearchQuery('')}
      />

      {/* Customers Table */}
      {filteredCustomers.length === 0 ? (
        <EmptyState
          title="No customers found"
          description="Try modifying your search query or onboard a new enterprise shipper."
          actionLabel="Add Customer"
          onAction={() => setAddCustomerOpen(true)}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Customer Name</th>
                  <th className="py-3.5 px-4">GSTIN</th>
                  <th className="py-3.5 px-4">Key Contact</th>
                  <th className="py-3.5 px-4">City</th>
                  <th className="py-3.5 px-4">Credit Period</th>
                  <th className="py-3.5 px-4 text-center">Total Trips</th>
                  <th className="py-3.5 px-4 text-right">Lifetime Revenue</th>
                  <th className="py-3.5 px-4 text-right">Outstanding</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCustomers.map((cust) => (
                  <tr
                    key={cust.id}
                    onClick={() => navigate(`/customers/${cust.id}`)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{cust.name}</div>
                      <div className="text-[11px] text-slate-400">{cust.email}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                      {cust.gstin}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{cust.contactPerson}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{cust.phone}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">{cust.city}</td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                        {cust.creditPeriodDays} Days
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                      {cust.totalTrips}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      {formatCurrency(cust.totalRevenue)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {cust.outstandingAmount > 0 ? (
                        <span className="font-bold text-amber-700">
                          {formatCurrency(cust.outstandingAmount)}
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">Cleared (₹0)</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={cust.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-sage-800 group-hover:text-sage-950">
                        <span>Invoices</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      <Modal
        isOpen={addCustomerOpen}
        onClose={() => setAddCustomerOpen(false)}
        title="Add Enterprise Shipper Customer"
        subtitle="Onboard a corporate logistics consignor"
        maxWidth="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setAddCustomerOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-cust-form"
              className="px-4 py-2 text-xs font-semibold text-white bg-sage-800 rounded-lg hover:bg-sage-900 shadow-sm"
            >
              Save Customer
            </button>
          </>
        }
      >
        <form id="add-cust-form" onSubmit={handleSaveCustomer} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Company Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tata Steel Limited"
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">GSTIN Number *</label>
              <input
                type="text"
                required
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                placeholder="27AAACT2727Q1ZW"
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono uppercase"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Credit Period (Days)</label>
              <input
                type="number"
                min="0"
                max="90"
                value={creditPeriodDays}
                onChange={(e) => setCreditPeriodDays(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Person *</label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g. Arun Verma"
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98200 11928"
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="logistics@company.com"
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Mumbai"
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Billing Address</label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Registered corporate address for GST invoices..."
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
