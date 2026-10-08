import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { FilterBar } from '../components/common/FilterBar';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';
import { VehicleMatchDrawer } from '../components/modals/VehicleMatchDrawer';
import { CreateTripModal } from '../components/modals/CreateTripModal';
import { Modal } from '../components/common/Modal';
import { formatCurrency, formatWeight, cn } from '../utils/formatters';
import { Package, Sparkles, Plus, Truck, ArrowRight, Check } from 'lucide-react';
import { Load, LoadStatus } from '../types';

export const Loads: React.FC = () => {
  const { loads, customers, addLoad } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLoadForMatch, setSelectedLoadForMatch] = useState<Load | null>(null);
  const [createTripOpen, setCreateTripOpen] = useState(false);
  const [prefillLoadId, setPrefillLoadId] = useState<string | undefined>(undefined);
  const [addLoadOpen, setAddLoadOpen] = useState(false);

  // New Load form state
  const [newCustId, setNewCustId] = useState(customers[0]?.id || 'cust-01');
  const [newCargo, setNewCargo] = useState('Reinforced Structural Steel TMT Bars');
  const [newWeight, setNewWeight] = useState(20);
  const [newOrigin, setNewOrigin] = useState('Mumbai');
  const [newDest, setNewDest] = useState('Pune');
  const [newReq, setNewReq] = useState('20T Heavy Truck');
  const [newRev, setNewRev] = useState(32000);

  const filteredLoads = useMemo(() => {
    return loads.filter((l) => {
      const matchesSearch =
        searchQuery === '' ||
        l.loadNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.cargo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.destination.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || l.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [loads, searchQuery, statusFilter]);

  const handleCreateLoad = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === newCustId) || customers[0];

    addLoad({
      customerId: cust.id,
      customerName: cust.name,
      cargo: newCargo,
      weightTonnes: Number(newWeight),
      origin: newOrigin,
      destination: newDest,
      pickupDate: 'Tomorrow, 09:00 AM',
      deliveryDeadline: 'Tomorrow, 06:00 PM',
      vehicleRequirement: newReq,
      status: 'Ready',
      estimatedRevenue: Number(newRev),
    });

    setAddLoadOpen(false);
  };

  const handleDispatchLoad = (load: Load, vehicleId: string) => {
    setPrefillLoadId(load.id);
    setCreateTripOpen(true);
  };

  const filterGroups = [
    {
      id: 'status',
      label: 'Status',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { label: 'Ready', value: 'Ready' },
        { label: 'Assigned', value: 'Assigned' },
        { label: 'In Transit', value: 'In Transit' },
        { label: 'Draft', value: 'Draft' },
        { label: 'Delivered', value: 'Delivered' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Load Board & Vehicle Matching"
        subtitle="Manage consignment requests and match with optimal fleet vehicles based on payload, hub location, and availability"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Loads' }]}
        actions={
          <button
            onClick={() => setAddLoadOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sage-800 hover:bg-sage-900 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Load</span>
          </button>
        }
      />

      {/* Hero Feature Banner for LD-1045 Match */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sage-900 to-slate-900 text-white border border-sage-800/80 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-sage-500/20 text-sage-300 border border-sage-500/30 flex-shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 text-sage-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                Featured Load: LD-1045 (Tata Steel — 18 Tonnes)
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                Ready for Dispatch
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Mumbai ➔ Pune • Optimal Vehicle Match: <strong>MH 04 AB 2847</strong> (Ashok Leyland 2820 / 20T Payload, 96% Match Fit).
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const l = loads.find((ld) => ld.loadNumber === 'LD-1045') || loads[0];
            setSelectedLoadForMatch(l);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-sage-500 hover:bg-sage-400 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all flex-shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Inspect Vehicle Matches</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by load number (LD-1045), customer, cargo, origin, destination..."
        filterGroups={filterGroups}
        totalResults={filteredLoads.length}
        onReset={() => {
          setSearchQuery('');
          setStatusFilter('all');
        }}
      />

      {/* Loads Table */}
      {filteredLoads.length === 0 ? (
        <EmptyState
          title="No loads found"
          description="Try adjusting your search criteria or create a new consignment load."
          actionLabel="Create Load"
          onAction={() => setAddLoadOpen(true)}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Load ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Cargo & Weight</th>
                  <th className="py-3.5 px-4">Origin ➔ Destination</th>
                  <th className="py-3.5 px-4">Pickup Date</th>
                  <th className="py-3.5 px-4">Requirement</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Assigned Vehicle</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredLoads.map((load) => (
                  <tr
                    key={load.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {load.loadNumber}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {load.customerName}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{load.cargo}</div>
                      <div className="text-[11px] font-bold text-sage-900">
                        {formatWeight(load.weightTonnes)}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900">{load.origin}</span>
                      <span className="text-slate-400 mx-1">➔</span>
                      <span className="font-semibold text-slate-900">{load.destination}</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {load.pickupDate}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200">
                        {load.vehicleRequirement}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={load.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4">
                      {load.assignedVehicleReg ? (
                        <span className="font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {load.assignedVehicleReg}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedLoadForMatch(load)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sage-50 hover:bg-sage-100 text-sage-900 font-bold border border-sage-200 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-sage-700" />
                        <span>Match Vehicle</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vehicle Match Drawer */}
      <VehicleMatchDrawer
        isOpen={!!selectedLoadForMatch}
        onClose={() => setSelectedLoadForMatch(null)}
        load={selectedLoadForMatch}
        onSelectVehicleForTrip={handleDispatchLoad}
      />

      {/* Create Trip Modal */}
      <CreateTripModal
        isOpen={createTripOpen}
        onClose={() => {
          setCreateTripOpen(false);
          setPrefillLoadId(undefined);
        }}
        prefillLoadId={prefillLoadId}
      />

      {/* Add Load Modal */}
      <Modal
        isOpen={addLoadOpen}
        onClose={() => setAddLoadOpen(false)}
        title="Create New Consignment Load"
        subtitle="Register incoming shipper requirement for vehicle allocation"
        maxWidth="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setAddLoadOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-load-form"
              className="px-4 py-2 text-xs font-semibold text-white bg-sage-800 rounded-lg hover:bg-sage-900 shadow-sm"
            >
              Create Load
            </button>
          </>
        }
      >
        <form id="add-load-form" onSubmit={handleCreateLoad} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Customer *</label>
            <select
              value={newCustId}
              onChange={(e) => setNewCustId(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Cargo Description *</label>
            <input
              type="text"
              required
              value={newCargo}
              onChange={(e) => setNewCargo(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Weight (Tonnes) *</label>
              <input
                type="number"
                min="1"
                max="50"
                value={newWeight}
                onChange={(e) => setNewWeight(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Revenue (₹)</label>
              <input
                type="number"
                value={newRev}
                onChange={(e) => setNewRev(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Origin *</label>
              <select
                value={newOrigin}
                onChange={(e) => setNewOrigin(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="Mumbai">Mumbai</option>
                <option value="Bhiwandi">Bhiwandi</option>
                <option value="Thane">Thane</option>
                <option value="Pune">Pune</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Destination *</label>
              <select
                value={newDest}
                onChange={(e) => setNewDest(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="Pune">Pune</option>
                <option value="Surat">Surat</option>
                <option value="Nashik">Nashik</option>
                <option value="Kolhapur">Kolhapur</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Vehicle Requirement</label>
            <input
              type="text"
              value={newReq}
              onChange={(e) => setNewReq(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
