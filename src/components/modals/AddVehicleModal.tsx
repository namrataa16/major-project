import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { VehicleType } from '../../types';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ isOpen, onClose }) => {
  const { addVehicle, drivers } = useApp();
  const { showToast } = useToast();

  const [registration, setRegistration] = useState('MH 04 CD ');
  const [model, setModel] = useState('Ashok Leyland 2820');
  const [type, setType] = useState<VehicleType>('Heavy Truck');
  const [capacityTonnes, setCapacityTonnes] = useState(20);
  const [fuelType, setFuelType] = useState<'Diesel' | 'CNG' | 'Electric' | 'LNG'>('Diesel');
  const [mileageKmPerL, setMileageKmPerL] = useState(3.8);
  const [axles, setAxles] = useState(3);
  const [currentLocation, setCurrentLocation] = useState('Mumbai (Vashi)');
  const [driverId, setDriverId] = useState('');
  const [yearOfMfg, setYearOfMfg] = useState(2023);
  const [odometerKm, setOdometerKm] = useState(35000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registration.trim() || !model.trim()) {
      showToast('Please fill in required vehicle details', 'error');
      return;
    }

    const selectedDriver = drivers.find((d) => d.id === driverId);

    addVehicle({
      registration: registration.trim().toUpperCase(),
      model: model.trim(),
      type,
      capacityTonnes: Number(capacityTonnes),
      fuelType,
      mileageKmPerL: Number(mileageKmPerL),
      axles: Number(axles),
      status: 'Available',
      currentLocation,
      currentDriverId: selectedDriver?.id,
      currentDriverName: selectedDriver?.name,
      chassisNumber: `MB1${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      engineNumber: `ENG${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      yearOfMfg: Number(yearOfMfg),
      odometerKm: Number(odometerKm),
    });

    showToast(`Vehicle ${registration.toUpperCase()} added to fleet successfully!`, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Fleet Vehicle"
      subtitle="Register a commercial truck, container, or multi-axle trailer to the active fleet"
      maxWidth="xl"
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
            form="add-vehicle-form"
            className="px-4 py-2 text-xs font-semibold text-white bg-sage-800 rounded-lg hover:bg-sage-900 shadow-sm transition-all"
          >
            Register Vehicle
          </button>
        </>
      }
    >
      <form id="add-vehicle-form" onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Vehicle Registration Number *
            </label>
            <input
              type="text"
              required
              value={registration}
              onChange={(e) => setRegistration(e.target.value)}
              placeholder="e.g. MH 04 AB 2847"
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 uppercase font-mono font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Vehicle Model / Make *</label>
            <input
              type="text"
              required
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. Ashok Leyland 2820 / Tata Prima 2830"
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600 font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Vehicle Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as VehicleType)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600"
            >
              <option value="Heavy Truck">Heavy Truck</option>
              <option value="Container Truck">Container Truck</option>
              <option value="Multi-Axle">Multi-Axle</option>
              <option value="Tipper">Tipper</option>
              <option value="Light Commercial Vehicle">Light Commercial Vehicle</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Payload Capacity (Tonnes)</label>
            <input
              type="number"
              min="1"
              max="55"
              step="0.5"
              value={capacityTonnes}
              onChange={(e) => setCapacityTonnes(Number(e.target.value))}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Fuel Type</label>
            <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value as any)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600"
            >
              <option value="Diesel">Diesel</option>
              <option value="CNG">CNG</option>
              <option value="Electric">Electric</option>
              <option value="LNG">LNG</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Est. Mileage (km/L)</label>
            <input
              type="number"
              min="1"
              max="15"
              step="0.1"
              value={mileageKmPerL}
              onChange={(e) => setMileageKmPerL(Number(e.target.value))}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Axle Count</label>
            <input
              type="number"
              min="2"
              max="7"
              value={axles}
              onChange={(e) => setAxles(Number(e.target.value))}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Manufacturing Year</label>
            <input
              type="number"
              min="2012"
              max="2026"
              value={yearOfMfg}
              onChange={(e) => setYearOfMfg(Number(e.target.value))}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Initial Location / Hub</label>
            <select
              value={currentLocation}
              onChange={(e) => setCurrentLocation(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600"
            >
              <option value="Mumbai (Vashi)">Mumbai (Vashi Goods Terminal)</option>
              <option value="Bhiwandi">Bhiwandi Logistics Park</option>
              <option value="Pune (Chakan)">Pune (Chakan MIDC)</option>
              <option value="Thane">Thane Yard</option>
              <option value="Surat">Surat Hazira Port Hub</option>
              <option value="Nashik">Nashik Hub</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Assign Primary Driver</label>
            <select
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500/20 focus:border-sage-600"
            >
              <option value="">No Driver Assigned (Unassigned)</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.experienceYears} yrs exp • {d.status})
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>
    </Modal>
  );
};
