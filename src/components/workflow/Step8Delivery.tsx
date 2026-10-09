import React, { useState } from 'react';
import {
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  ChevronRight,
  ShieldAlert,
  Thermometer,
  UserCheck,
  Search,
  Filter,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DeliveryRecord, DeliveryStatus } from '../../types';

export const Step8Delivery: React.FC = () => {
  const {
    deliveries,
    updateDeliveryStatus,
    confirmDelivery,
    addDeliveryDelay,
    setWorkflowStep,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeDeliveryId, setActiveDeliveryId] = useState<string | null>(deliveries[0]?.deliveryId || null);

  // Status update modal state
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<DeliveryStatus>('In Transit');
  const [statusNote, setStatusNote] = useState('');
  const [operatorName, setOperatorName] = useState('Driver Carlos Rivera');

  // Confirmation modal state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmNote, setConfirmNote] = useState(
    'Shipment received in good condition. Sealed packaging verified.'
  );
  const [receiverName, setReceiverName] = useState('Sister Mary Higgins (Receiving Lead)');

  // Delay reporting modal state
  const [delayModalOpen, setDelayModalOpen] = useState(false);
  const [delayReason, setDelayReason] = useState('Freeway exit maintenance (+25 mins)');

  const activeDelivery = deliveries.find((d) => d.deliveryId === activeDeliveryId) || deliveries[0];

  const filteredDeliveries = deliveries.filter((d) => {
    const matchesSearch =
      d.deliveryId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.vehicleName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || d.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCommitStatus = () => {
    if (!activeDelivery) return;
    updateDeliveryStatus(activeDelivery.deliveryId, newStatus, statusNote || `Status updated to ${newStatus}`, operatorName);
    setStatusModalOpen(false);
  };

  const handleCommitConfirmation = () => {
    if (!activeDelivery) return;
    confirmDelivery(activeDelivery.deliveryId, confirmNote, receiverName);
    setConfirmModalOpen(false);
  };

  const handleCommitDelay = () => {
    if (!activeDelivery) return;
    addDeliveryDelay(activeDelivery.deliveryId, delayReason);
    setDelayModalOpen(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Step 8 of 8 · Execution &amp; Telematics
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Live Delivery Tracking &amp; Chain-of-Custody
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status progression, cold-chain temperature telemetry, delay deadline recalculation, and explicit recipient handover signatures.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setWorkflowStep(1)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded border border-slate-300"
          >
            &larr; Return to Step 1 (Intake)
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search delivery ID, food, recipient, vehicle..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700 font-medium"
          >
            <option value="All">All Delivery Statuses</option>
            <option value="Pickup Scheduled">Pickup Scheduled</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Delayed">Delayed</option>
          </select>
        </div>
      </div>

      {/* Two-Column Tracking View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: List of deliveries */}
        <div className="lg:col-span-5 space-y-2.5">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            Delivery Manifests ({filteredDeliveries.length})
          </span>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredDeliveries.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded">
                No matching delivery manifests found.
              </div>
            ) : (
              filteredDeliveries.map((del) => {
                const isSelected = activeDelivery?.deliveryId === del.deliveryId;
                return (
                  <button
                    key={del.deliveryId}
                    type="button"
                    onClick={() => setActiveDeliveryId(del.deliveryId)}
                    className={`w-full text-left p-3.5 rounded border transition space-y-1.5 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-500 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-slate-900">{del.deliveryId}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          del.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : del.status === 'In Transit'
                            ? 'bg-blue-100 text-blue-800'
                            : del.status === 'Delayed'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {del.status}
                      </span>
                    </div>

                    <div className="font-semibold text-slate-800 text-xs truncate">
                      {del.foodName}
                    </div>

                    <div className="text-[11px] text-slate-500 flex justify-between">
                      <span>To: {del.recipientName}</span>
                      <span className="font-bold text-slate-700">
                        {del.quantity} {del.unit}
                      </span>
                    </div>

                    {del.isDelayed && del.delayReason && (
                      <div className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {del.delayReason}
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right column: Selected Delivery Detail & Chronological Timeline */}
        {activeDelivery ? (
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-mono text-slate-500">Manifest #{activeDelivery.deliveryId} · Plan {activeDelivery.planId}</span>
                <h3 className="text-base font-bold text-slate-900">
                  {activeDelivery.foodName} ({activeDelivery.quantity} {activeDelivery.unit})
                </h3>
                <span className="text-xs text-slate-600">
                  Carrier: {activeDelivery.vehicleName}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {activeDelivery.status !== 'Delivered' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setDelayModalOpen(true)}
                      className="px-2.5 py-1 text-xs font-medium text-amber-800 bg-amber-100 hover:bg-amber-200 rounded border border-amber-300"
                    >
                      Report Delay
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusModalOpen(true)}
                      className="px-2.5 py-1 text-xs font-medium text-blue-800 bg-blue-100 hover:bg-blue-200 rounded border border-blue-300"
                    >
                      Update Status
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmModalOpen(true)}
                      className="px-3 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded shadow-xs"
                    >
                      Confirm Delivery
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 bg-white border border-slate-200 rounded">
                <span className="text-slate-500 text-[11px] block">Origin Location</span>
                <span className="font-semibold text-slate-800 truncate block">{activeDelivery.sourceLocation}</span>
              </div>
              <div className="p-2.5 bg-white border border-slate-200 rounded">
                <span className="text-slate-500 text-[11px] block">Destination Agency</span>
                <span className="font-semibold text-slate-800 truncate block">{activeDelivery.destinationLocation}</span>
              </div>
              <div className="p-2.5 bg-white border border-slate-200 rounded">
                <span className="text-slate-500 text-[11px] block">Safe-Use Deadline</span>
                <span className="font-mono font-semibold text-slate-800">
                  {new Date(activeDelivery.safeUseDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Confirmation Note Display */}
            {activeDelivery.status === 'Delivered' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Certified Delivery Receipt Sign-Off</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Signed by: <strong>{activeDelivery.confirmedBy || 'Receiving Staff'}</strong>. Note: {activeDelivery.confirmationNote || 'Handover successfully verified.'}
                </p>
              </div>
            )}

            {/* Chronological Event Timeline */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Chain-of-Custody Timeline
              </span>

              <div className="space-y-3 pl-3 border-l-2 border-slate-200 ml-2">
                {activeDelivery.timeline.map((event, idx) => (
                  <div key={idx} className="relative text-xs space-y-0.5">
                    <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-slate-900 border-2 border-white" />
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span className="font-semibold text-slate-800">{event.status}</span>
                      <span>
                        {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed">{event.note}</p>
                    <div className="text-[10px] text-slate-400">Recorded by: {event.operator}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 p-6 text-center text-xs text-slate-500">
            Select a delivery manifest to view status details.
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {statusModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">Advance Delivery Telematics</h3>

            <div className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">New Lifecycle Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as DeliveryStatus)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium bg-white"
                >
                  <option value="Picked Up">Picked Up (Departed Provider)</option>
                  <option value="In Transit">In Transit (En Route)</option>
                  <option value="Delayed">Delayed (Traffic / Hazard)</option>
                  <option value="Safety Review Required">Safety Review Required</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Status Transition Log</label>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Departing Loading Dock B after thermal check"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Operator / Driver</label>
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setStatusModalOpen(false)}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCommitStatus}
                className="px-4 py-1.5 font-semibold bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Record Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">Confirm Food Delivery Handover</h3>
            <p className="text-slate-600">
              A delivery cannot be closed automatically merely because a plan was approved. Explicit confirmation is required.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Recipient Receiver Name &amp; Role *</label>
                <input
                  type="text"
                  required
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Acceptance Notes / Quality Check</label>
                <textarea
                  rows={2}
                  value={confirmNote}
                  onChange={(e) => setConfirmNote(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCommitConfirmation}
                className="px-4 py-1.5 font-semibold bg-emerald-600 text-white rounded hover:bg-emerald-500"
              >
                Commit Certified Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delay Modal */}
      {delayModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">Report In-Transit Delay</h3>
            <p className="text-slate-600">
              Will trigger automatic recalculation of the safe-use deadline buffer and emit alerts if safety limits are encroached.
            </p>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Delay Description &amp; Estimate</label>
              <input
                type="text"
                value={delayReason}
                onChange={(e) => setDelayReason(e.target.value)}
                placeholder="e.g. Tunnel closure, +20 mins delay"
                className="w-full px-3 py-1.5 border border-slate-300 rounded"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setDelayModalOpen(false)}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCommitDelay}
                className="px-4 py-1.5 font-semibold bg-amber-600 text-white rounded hover:bg-amber-500"
              >
                Submit Delay Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
