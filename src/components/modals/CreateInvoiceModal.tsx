import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillCustomerId?: string;
  prefillTripId?: string;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  isOpen,
  onClose,
  prefillCustomerId,
  prefillTripId,
}) => {
  const { customers, trips, createInvoice } = useApp();
  const { showToast } = useToast();

  const [customerId, setCustomerId] = useState(prefillCustomerId || 'cust-01');
  const [tripId, setTripId] = useState(prefillTripId || '');
  const [amount, setAmount] = useState(28000);
  const [taxRate, setTaxRate] = useState(12); // 12% GST on Road Transport
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });

  const selectedCustomer = customers.find((c) => c.id === customerId) || customers[0];
  const selectedTrip = trips.find((t) => t.id === tripId);

  const taxAmount = Math.round(amount * (taxRate / 100));
  const totalAmount = amount + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const inv = createInvoice({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      tripId: selectedTrip?.id,
      tripNumber: selectedTrip?.tripNumber,
      amount: Number(amount),
      taxAmount,
      totalAmount,
      invoiceDate,
      dueDate,
      status: 'Pending',
    });

    showToast(`Invoice ${inv.invoiceNumber} generated for ${selectedCustomer.name}!`, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate GST Freight Invoice"
      subtitle="Create a compliant tax invoice for transport services"
      maxWidth="lg"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-invoice-form"
            className="px-4 py-2 text-xs font-semibold text-white bg-sage-800 rounded-lg hover:bg-sage-900 shadow-sm transition-all"
          >
            Create Invoice ({formatCurrency(totalAmount)})
          </button>
        </>
      }
    >
      <form id="create-invoice-form" onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Customer / Consignor *</label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 font-medium"
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — GSTIN: {c.gstin}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Link Trip (Optional)</label>
          <select
            value={tripId}
            onChange={(e) => {
              setTripId(e.target.value);
              const t = trips.find((trp) => trp.id === e.target.value);
              if (t) setAmount(t.revenue);
            }}
            className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 font-medium"
          >
            <option value="">-- No Direct Trip Link --</option>
            {trips.map((t) => (
              <option key={t.id} value={t.id}>
                {t.tripNumber}: {t.origin} ➔ {t.destination} ({formatCurrency(t.revenue)})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Base Freight Amount (₹) *</label>
            <input
              type="number"
              required
              min="1"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">GST Rate</label>
            <select
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 font-medium"
            >
              <option value="12">12% (Road Transport Forward Charge)</option>
              <option value="5">5% (Road Transport with RCM)</option>
              <option value="18">18% (Handling & Value Added)</option>
              <option value="0">0% (Exempt)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Invoice Date</label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600"
            />
          </div>
        </div>

        {/* Financial calculation breakdown card */}
        <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs space-y-1.5">
          <div className="flex justify-between text-slate-600">
            <span>Freight Charge:</span>
            <span>{formatCurrency(amount)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>GST ({taxRate}%):</span>
            <span>{formatCurrency(taxAmount)}</span>
          </div>
          <div className="flex justify-between font-bold text-slate-900 pt-1.5 border-t border-slate-200 text-sm">
            <span>Total Payable:</span>
            <span className="text-emerald-700">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </form>
    </Modal>
  );
};
