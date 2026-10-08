import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { PageHeader } from '../components/common/PageHeader';
import { KpiCard } from '../components/common/KpiCard';
import { FilterBar } from '../components/common/FilterBar';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { formatDate, cn } from '../utils/formatters';
import {
  FileCheck,
  AlertTriangle,
  ShieldCheck,
  Plus,
  Upload,
  Clock,
  CheckCircle2,
  Calendar,
  Truck
} from 'lucide-react';
import { DocumentType, DocumentStatus } from '../types';

export const Documents: React.FC = () => {
  const { documents, vehicles, addDocument } = useApp();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [addDocOpen, setAddDocOpen] = useState(false);

  // New Document form state
  const [newVehicleId, setNewVehicleId] = useState('veh-01');
  const [newType, setNewType] = useState<DocumentType>('Insurance');
  const [newDocNum, setNewDocNum] = useState('POL-ICICI-9920194');
  const [newIssueDate, setNewIssueDate] = useState('2026-10-08');
  const [newExpiryDate, setNewExpiryDate] = useState('2027-10-07');

  // Aggregates
  const totalDocs = documents.length;
  const validCount = documents.filter((d) => d.status === 'Valid').length;
  const expiringCount = documents.filter((d) => d.status === 'Expiring Soon').length;
  const expiredCount = documents.filter((d) => d.status === 'Expired').length;

  const filteredDocs = useMemo(() => {
    return documents.filter((d) => {
      const matchesSearch =
        searchQuery === '' ||
        d.vehicleRegistration.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
      const matchesType = typeFilter === 'all' || d.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [documents, searchQuery, statusFilter, typeFilter]);

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    const v = vehicles.find((veh) => veh.id === newVehicleId) || vehicles[0];

    addDocument({
      vehicleId: v.id,
      vehicleRegistration: v.registration,
      type: newType,
      documentNumber: newDocNum.trim().toUpperCase(),
      issueDate: newIssueDate,
      expiryDate: newExpiryDate,
    });

    showToast(`${newType} document registered for ${v.registration}!`, 'success');
    setAddDocOpen(false);
  };

  const filterGroups = [
    {
      id: 'status',
      label: 'Status',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { label: 'Valid', value: 'Valid' },
        { label: 'Expiring Soon', value: 'Expiring Soon' },
        { label: 'Expired', value: 'Expired' },
      ],
    },
    {
      id: 'type',
      label: 'Doc Type',
      value: typeFilter,
      onChange: setTypeFilter,
      options: [
        { label: 'RC (Registration)', value: 'RC' },
        { label: 'Insurance', value: 'Insurance' },
        { label: 'PUC (Emission)', value: 'PUC' },
        { label: 'Fitness Certificate', value: 'Fitness' },
        { label: 'National Permit', value: 'Permit' },
        { label: 'MV Tax', value: 'Tax' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fleet Compliance & Documents"
        subtitle="Manage RTO compliance, commercial permits, PUC, fitness, and insurance renewal alerts"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Documents' }]}
        actions={
          <button
            onClick={() => setAddDocOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sage-800 hover:bg-sage-900 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        }
      />

      {/* KPI Cards (4 cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <KpiCard
          title="Total Documents"
          value={totalDocs}
          subtext="Active compliance vault"
          icon={FileCheck}
          variant="default"
        />
        <KpiCard
          title="Fully Valid"
          value={validCount}
          subtext="Cleared for interstate transit"
          icon={ShieldCheck}
          variant="sage"
        />
        <KpiCard
          title="Expiring Soon (< 30d)"
          value={expiringCount}
          subtext="Action required soon"
          icon={AlertTriangle}
          variant="amber"
          onClick={() => setStatusFilter('Expiring Soon')}
        />
        <KpiCard
          title="Expired Documents"
          value={expiredCount}
          subtext="Grounding notice issued"
          icon={AlertTriangle}
          variant="rose"
          onClick={() => setStatusFilter('Expired')}
        />
      </div>

      {/* Urgent Renewal Alert Banner */}
      {expiringCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 border border-amber-200 text-amber-800">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm block">
                Compliance Alert: MH 04 AB 2847 Insurance expires in 6 days
              </span>
              <span className="text-amber-800">
                ICICI Lombard policy POL-ICICI-8849201 is due on 14 Oct 2026. Also 1 Fitness certificate due in 12 days.
              </span>
            </div>
          </div>
          <button
            onClick={() => setAddDocOpen(true)}
            className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl shadow-xs transition-colors flex-shrink-0"
          >
            Renew Now
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by vehicle registration (MH 04 AB 2847), document number, doc type..."
        filterGroups={filterGroups}
        totalResults={filteredDocs.length}
        onReset={() => {
          setSearchQuery('');
          setStatusFilter('all');
          setTypeFilter('all');
        }}
      />

      {/* Documents Table */}
      {filteredDocs.length === 0 ? (
        <EmptyState
          title="No compliance documents found"
          description="Try modifying your filters or upload a new certificate."
          actionLabel="Upload Document"
          onAction={() => setAddDocOpen(true)}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Vehicle</th>
                  <th className="py-3.5 px-4">Document Type</th>
                  <th className="py-3.5 px-4">Document / Policy No.</th>
                  <th className="py-3.5 px-4">Issue Date</th>
                  <th className="py-3.5 px-4">Expiry Date</th>
                  <th className="py-3.5 px-4">Days Remaining</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {doc.vehicleRegistration}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                        {doc.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                      {doc.documentNumber}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-medium">{formatDate(doc.issueDate)}</td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">{formatDate(doc.expiryDate)}</td>

                    <td className="py-3.5 px-4">
                      {doc.daysRemaining < 0 ? (
                        <span className="font-bold text-rose-700">
                          Expired {Math.abs(doc.daysRemaining)} days ago
                        </span>
                      ) : doc.daysRemaining <= 30 ? (
                        <span className="font-bold text-amber-800">
                          {doc.daysRemaining} days remaining
                        </span>
                      ) : (
                        <span className="text-slate-600 font-medium">
                          {doc.daysRemaining} days remaining
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={doc.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setNewVehicleId(doc.vehicleId);
                          setNewType(doc.type);
                          setNewDocNum(doc.documentNumber);
                          setAddDocOpen(true);
                        }}
                        className="px-3 py-1 text-xs font-semibold text-sage-800 hover:text-sage-950 bg-sage-50 hover:bg-sage-100 rounded-lg border border-sage-200 transition-colors"
                      >
                        Renew
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload/Renew Document Modal */}
      <Modal
        isOpen={addDocOpen}
        onClose={() => setAddDocOpen(false)}
        title="Upload / Renew Compliance Document"
        subtitle="Register verified RTO permit, insurance policy, or fitness certificate"
        maxWidth="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setAddDocOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-doc-form"
              className="px-4 py-2 text-xs font-semibold text-white bg-sage-800 rounded-lg hover:bg-sage-900 shadow-sm"
            >
              Save Certificate
            </button>
          </>
        }
      >
        <form id="add-doc-form" onSubmit={handleSaveDoc} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Vehicle *</label>
            <select
              value={newVehicleId}
              onChange={(e) => setNewVehicleId(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-medium"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.registration} ({v.model})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Document Category *</label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as DocumentType)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
            >
              <option value="Insurance">Commercial Vehicle Insurance</option>
              <option value="RC">RC (Registration Certificate)</option>
              <option value="Fitness">RTO Fitness Certificate</option>
              <option value="PUC">PUC (Pollution Under Control)</option>
              <option value="Permit">National Permit (All India Goods)</option>
              <option value="Tax">Motor Vehicle Road Tax</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Document / Certificate No. *</label>
            <input
              type="text"
              required
              value={newDocNum}
              onChange={(e) => setNewDocNum(e.target.value)}
              placeholder="e.g. POL-ICICI-8849201"
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Issue Date *</label>
              <input
                type="date"
                required
                value={newIssueDate}
                onChange={(e) => setNewIssueDate(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Expiry Date *</label>
              <input
                type="date"
                required
                value={newExpiryDate}
                onChange={(e) => setNewExpiryDate(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
