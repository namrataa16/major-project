import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { MUMBAI_PUNE_ROUTES } from '../../data/routeOptions';
import { calculateRouteScore } from '../../utils/routeScorer';
import { formatCurrency } from '../../utils/formatters';
import { Sparkles, Route, CheckCircle2, ArrowRight } from 'lucide-react';

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillLoadId?: string;
}

export const CreateTripModal: React.FC<CreateTripModalProps> = ({
  isOpen,
  onClose,
  prefillLoadId,
}) => {
  const { customers, vehicles, drivers, loads, createTrip } = useApp();
  const { showToast } = useToast();

  const [customerId, setCustomerId] = useState('cust-01');
  const [loadId, setLoadId] = useState(prefillLoadId || '');
  const [cargo, setCargo] = useState('Industrial Steel Goods');
  const [weightTonnes, setWeightTonnes] = useState(18);
  const [vehicleId, setVehicleId] = useState('veh-01');
  const [driverId, setDriverId] = useState('drv-01');
  const [origin, setOrigin] = useState('Mumbai');
  const [destination, setDestination] = useState('Pune');
  const [revenue, setRevenue] = useState(28000);
  const [pickupTime, setPickupTime] = useState('Today, 11:00 AM');
  const [deliveryDeadline, setDeliveryDeadline] = useState('Today, 06:00 PM');

  // Handle prefill load
  useEffect(() => {
    if (prefillLoadId) {
      const selectedLoad = loads.find((l) => l.id === prefillLoadId);
      if (selectedLoad) {
        setLoadId(selectedLoad.id);
        setCustomerId(selectedLoad.customerId);
        setCargo(selectedLoad.cargo);
        setWeightTonnes(selectedLoad.weightTonnes);
        setOrigin(selectedLoad.origin);
        setDestination(selectedLoad.destination);
        setRevenue(selectedLoad.estimatedRevenue);
        if (selectedLoad.assignedVehicleId) {
          setVehicleId(selectedLoad.assignedVehicleId);
        }
      }
    }
  }, [prefillLoadId, loads]);

  const selectedVehicle = vehicles.find((v) => v.id === vehicleId) || vehicles[0];
  const selectedDriver = drivers.find((d) => d.id === driverId) || drivers[0];
  const selectedCustomer = customers.find((c) => c.id === customerId) || customers[0];

  // Route Intelligence calculation preview
  const recommendedRoute = MUMBAI_PUNE_ROUTES.find((r) => r.isRecommended) || MUMBAI_PUNE_ROUTES[1];
  const routeScoreData = calculateRouteScore(recommendedRoute, selectedVehicle, weightTonnes);
  const estimatedTotalCost = Math.round(routeScoreData.totalOperatingCost + 3500); // Including driver advance & loading
  const estimatedProfit = Math.max(0, revenue - estimatedTotalCost);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTrip = createTrip({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      loadId: loadId || undefined,
      cargo,
      weightTonnes: Number(weightTonnes),
      vehicleId: selectedVehicle.id,
      vehicleRegistration: selectedVehicle.registration,
      driverId: selectedDriver.id,
      driverName: selectedDriver.name,
      origin,
      destination,
      distanceKm: recommendedRoute.distanceKm,
      estimatedHours: recommendedRoute.durationHours,
      eta: `${recommendedRoute.estimatedDuration} (${deliveryDeadline})`,
      startDate: new Date().toISOString(),
      status: 'On Route',
      revenue: Number(revenue),
      estimatedCost: estimatedTotalCost,
      actualCost: estimatedTotalCost,
      profit: estimatedProfit,
      selectedRouteId: recommendedRoute.id,
      selectedRouteName: recommendedRoute.name,
      notes: `Vehicle-Aware route intelligence applied. Corridor: ${recommendedRoute.name}`,
    });

    showToast(`Trip ${newTrip.tripNumber} dispatched successfully via ${recommendedRoute.name}!`, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create & Dispatch Trip"
      subtitle="Configure route intelligence, vehicle payload, and driver assignment"
      maxWidth="2xl"
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
            form="create-trip-form"
            className="px-5 py-2 text-xs font-semibold text-white bg-sage-800 rounded-lg hover:bg-sage-900 shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>Dispatch Trip</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </>
      }
    >
      <form id="create-trip-form" onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Customer & Load Select */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Customer *</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 font-medium"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Credit: {c.creditPeriodDays}d)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Attach Load (Optional)</label>
            <select
              value={loadId}
              onChange={(e) => {
                setLoadId(e.target.value);
                const l = loads.find((ld) => ld.id === e.target.value);
                if (l) {
                  setCargo(l.cargo);
                  setWeightTonnes(l.weightTonnes);
                  setOrigin(l.origin);
                  setDestination(l.destination);
                  setRevenue(l.estimatedRevenue);
                }
              }}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 font-medium"
            >
              <option value="">-- No Direct Load Attached --</option>
              {loads
                .filter((l) => l.status !== 'In Transit' && l.status !== 'Delivered')
                .map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.loadNumber} - {l.cargo} ({l.weightTonnes}T) - {l.origin} ➔ {l.destination}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Cargo & Weight */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Cargo Description *</label>
            <input
              type="text"
              required
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              placeholder="e.g. Industrial Steel Coils & Sheets"
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Cargo Weight (Tonnes) *</label>
            <input
              type="number"
              min="1"
              max="50"
              step="0.5"
              value={weightTonnes}
              onChange={(e) => setWeightTonnes(Number(e.target.value))}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 font-semibold"
            />
          </div>
        </div>

        {/* Origin & Destination */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Origin City *</label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 font-medium"
            >
              <option value="Mumbai">Mumbai (JNPT / Vashi)</option>
              <option value="Bhiwandi">Bhiwandi Logistics Hub</option>
              <option value="Thane">Thane</option>
              <option value="Pune">Pune</option>
              <option value="Surat">Surat</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Destination City *</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 font-medium"
            >
              <option value="Pune">Pune (Chakan / Talegaon)</option>
              <option value="Surat">Surat</option>
              <option value="Nashik">Nashik</option>
              <option value="Kolhapur">Kolhapur</option>
              <option value="Ahmedabad">Ahmedabad</option>
            </select>
          </div>
        </div>

        {/* Vehicle & Driver */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Fleet Vehicle *</label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 font-mono font-medium"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.registration} — {v.model} ({v.capacityTonnes}T • {v.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Assign Driver *</label>
            <select
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 font-medium"
            >
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.experienceYears}y exp • {d.status})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Schedule & Revenue */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Pickup Time</label>
            <input
              type="text"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Delivery Deadline</label>
            <input
              type="text"
              value={deliveryDeadline}
              onChange={(e) => setDeliveryDeadline(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Agreed Revenue (₹)</label>
            <input
              type="number"
              value={revenue}
              onChange={(e) => setRevenue(Number(e.target.value))}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 font-semibold text-slate-900"
            />
          </div>
        </div>

        {/* Vehicle-Aware Route Recommendation Preview Card */}
        <div className="mt-4 p-4 rounded-xl bg-sage-50 border border-sage-200">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sage-800" />
              <span className="font-bold text-sage-950">Vehicle-Aware Route Recommendation</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sage-200 text-sage-900">
              Score: {routeScoreData.score}/100 RECOMMENDED
            </span>
          </div>

          <p className="text-xs font-semibold text-sage-900">{recommendedRoute.name}</p>
          <p className="text-[11px] text-sage-800 mt-0.5">
            {recommendedRoute.recommendedTagline ||
              '11% longer distance, but estimated 8% lower operating cost and lower terrain difficulty.'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-sage-200/80 text-[11px]">
            <div>
              <span className="text-sage-700 block text-[10px]">Distance</span>
              <strong className="text-sage-950">{recommendedRoute.distanceKm} km</strong>
            </div>
            <div>
              <span className="text-sage-700 block text-[10px]">Estimated ETA</span>
              <strong className="text-sage-950">{recommendedRoute.estimatedDuration}</strong>
            </div>
            <div>
              <span className="text-sage-700 block text-[10px]">Est. Fuel & Toll</span>
              <strong className="text-sage-950">
                {formatCurrency(recommendedRoute.estimatedFuelCost + recommendedRoute.tollCost)}
              </strong>
            </div>
            <div>
              <span className="text-sage-700 block text-[10px]">Estimated Margin</span>
              <strong className="text-emerald-700 font-bold">{formatCurrency(estimatedProfit)}</strong>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};
