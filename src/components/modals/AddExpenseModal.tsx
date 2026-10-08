import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { ExpenseCategory } from '../../types';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillVehicleId?: string;
  prefillTripId?: string;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  prefillVehicleId,
  prefillTripId,
}) => {
  const { vehicles, trips, addExpense, currentUser } = useApp();
  const { showToast } = useToast();

  const [vehicleId, setVehicleId] = useState(prefillVehicleId || 'veh-01');
  const [tripId, setTripId] = useState(prefillTripId || '');
  const [category, setCategory] = useState<ExpenseCategory>('Fuel');
  const [amount, setAmount] = useState(4500);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('Diesel refill 48 Litres @ HPCL Highway Station');

  const selectedVehicle = vehicles.find((v) => v.id === vehicleId) || vehicles[0];
  const selectedTrip = trips.find((t) => t.id === tripId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      showToast('Please enter a valid expense amount', 'error');
      return;
    }

    addExpense({
      vehicleId: selectedVehicle.id,
      vehicleRegistration: selectedVehicle.registration,
      tripId: selectedTrip?.id,
      tripNumber: selectedTrip?.tripNumber,
      category,
      amount: Number(amount),
      date,
      description: description.trim(),
      status: 'Approved',
      loggedBy: currentUser?.name || 'Rajesh Sharma',
    });

    showToast(`Expense of ₹${amount} logged under ${category} for ${selectedVehicle.registration}`, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Fleet & Trip Expense"
      subtitle="Record operational costs including fuel, tolls, maintenance, and driver allowances"
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
            form="add-expense-form"
            className="px-4 py-2 text-xs font-semibold text-white bg-sage-800 rounded-lg hover:bg-sage-900 shadow-sm transition-all"
          >
            Save Expense
          </button>
        </>
      }
    >
      <form id="add-expense-form" onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Vehicle *</label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 font-mono font-medium"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.registration} ({v.model})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Associated Trip (Optional)</label>
            <select
              value={tripId}
              onChange={(e) => setTripId(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 font-medium"
            >
              <option value="">-- General Fleet Expense --</option>
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.tripNumber}: {t.origin} ➔ {t.destination} ({t.vehicleRegistration})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Expense Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 font-semibold"
            >
              <option value="Fuel">Fuel (Diesel / CNG)</option>
              <option value="Toll">Toll (FASTag / Plaza)</option>
              <option value="Driver Advance">Driver Advance & Batta</option>
              <option value="Maintenance">Maintenance & Workshop</option>
              <option value="Parking">Parking & Hub Staging</option>
              <option value="Loading/Unloading">Loading / Unloading / Crane</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Amount (₹) *</label>
            <input
              type="number"
              required
              min="1"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="e.g. 5000"
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 font-bold text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Expense Date *</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Description / Bill Memo *</label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Fuel receipt #9821 from Khalapur Express Hub"
            className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600"
          />
        </div>
      </form>
    </Modal>
  );
};
