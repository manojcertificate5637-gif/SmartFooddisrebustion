import React, { useState } from 'react';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  AlertTriangle,
  Thermometer,
  ShieldCheck,
  ChevronRight,
  RotateCcw,
  Search,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DeliveryStatus } from '../../types';

export const LogisticsPage: React.FC = () => {
  const {
    vehicles,
    deliveries,
    updateDeliveryStatus,
    confirmDelivery,
    addDeliveryDelay,
  } = useApp();

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || '');
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string>(deliveries[0]?.deliveryId || '');

  // Delay Modal
  const [delayModalOpen, setDelayModalOpen] = useState(false);
  const [delayNote, setDelayNote] = useState('Traffic slowdown on highway interchange (+15m)');

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];
  const selectedDelivery = deliveries.find((d) => d.deliveryId === selectedDeliveryId) || deliveries[0];

  // Calculate vehicle payload utilization
  const assignedDeliveries = deliveries.filter((d) => d.vehicleId === selectedVehicle?.id && d.status !== 'Delivered');
  const activePayload = assignedDeliveries.reduce((sum, d) => sum + d.quantity, 0);
  const utilizationPct = selectedVehicle
    ? Math.min(100, Math.round((activePayload / selectedVehicle.capacity) * 100))
    : 0;

  // Simulated route sequence
  const simulatedRouteStops = [
    {
      step: 1,
      title: 'Dispatch Hub Departure',
      location: selectedVehicle?.currentLocation || 'Central Depot',
      eta: '10:00 AM',
      status: 'Completed',
    },
    ...assignedDeliveries.map((del, idx) => ({
      step: idx + 2,
      title: `Drop-Off: ${del.recipientName}`,
      location: del.destinationLocation,
      eta: `10:${((idx + 1) * 35).toString().padStart(2, '0')} AM`,
      status: del.status,
    })),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Smart Logistics &amp; Delivery Telematics
          </h2>
          <p className="text-xs text-slate-500">
            Real-time multi-vehicle payload utilization, simulated route sequencing, and cold-chain compliance tracking.
          </p>
        </div>

        <div className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          Simulated Fleet Telemetry Active
        </div>
      </div>

      {/* Fleet Vehicles Status Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Active Delivery Fleet Units
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {vehicles.map((v) => {
            const isSelected = v.id === selectedVehicle?.id;
            const assignedCount = deliveries.filter((d) => d.vehicleId === v.id && d.status !== 'Delivered').length;

            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVehicleId(v.id)}
                className={`p-4 rounded-xl border text-left transition space-y-2 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">{v.name}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      v.availability === 'Available'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {v.availability}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 space-y-0.5">
                  <div>Type: <strong>{v.type}</strong></div>
                  <div>Capacity: <strong>{v.capacity} {v.capacityUnit}</strong></div>
                  <div className="flex items-center gap-1 text-emerald-700 font-medium">
                    <Thermometer className="w-3.5 h-3.5" />
                    <span>{v.temperatureControlled ? 'Cold Chain (3.0°C)' : 'Ambient Cargo'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Active Drops:</span>
                  <span className="font-bold text-emerald-800">{assignedCount} orders</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Vehicle Payload & Route Manifest */}
      {selectedVehicle && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <span className="font-mono text-xs text-slate-400">{selectedVehicle.id}</span>
              <h3 className="text-base font-bold text-slate-900">
                {selectedVehicle.name} · Route &amp; Capacity Manifest
              </h3>
              <span className="text-xs text-slate-500">
                Driver: {selectedVehicle.driverName} ({selectedVehicle.driverPhone})
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right text-xs">
                <span className="text-slate-500 block">Payload Utilization</span>
                <span className="font-extrabold text-slate-900">
                  {activePayload} / {selectedVehicle.capacity} {selectedVehicle.capacityUnit} ({utilizationPct}%)
                </span>
              </div>
              <div className="w-28 bg-slate-200 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full ${utilizationPct > 85 ? 'bg-amber-500' : 'bg-emerald-600'}`}
                  style={{ width: `${utilizationPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Simulated Route Sequence */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Simulated Route Stop Sequence
            </h4>

            <div className="space-y-2">
              {simulatedRouteStops.map((stop, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-xs shrink-0">
                      {stop.step}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{stop.title}</div>
                      <div className="text-slate-500 text-[11px]">{stop.location}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-semibold text-slate-800">{stop.eta}</div>
                    <span className="text-[10px] text-emerald-700 font-semibold uppercase">{stop.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Live Deliveries Board & State Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            All Live Delivery Orders ({deliveries.length})
          </h3>
          <span className="text-xs text-slate-500">
            Click an order to advance lifecycle or verify receipt
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Order ID</th>
                <th className="py-2.5 px-3">Food &amp; Quantity</th>
                <th className="py-2.5 px-3">Destination Agency</th>
                <th className="py-2.5 px-3">Assigned Vehicle</th>
                <th className="py-2.5 px-3">Safe-Use Deadline</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deliveries.map((del) => (
                <tr key={del.deliveryId} className="hover:bg-slate-50/60 transition">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{del.deliveryId}</td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-900">{del.foodName}</div>
                    <div className="text-[11px] text-slate-500">{del.quantity} {del.unit}</div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-800">{del.recipientName}</td>
                  <td className="py-2.5 px-3 text-slate-700 font-medium">{del.vehicleName}</td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                    {new Date(del.safeUseDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`font-semibold text-[11px] px-2 py-0.5 rounded-full ${
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
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {del.status !== 'Delivered' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDeliveryId(del.deliveryId);
                              setDelayModalOpen(true);
                            }}
                            className="px-2 py-1 text-[11px] text-amber-800 bg-amber-50 hover:bg-amber-100 rounded border border-amber-200"
                          >
                            Delay
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const nextStatus: DeliveryStatus =
                                del.status === 'Pickup Scheduled' ? 'In Transit' : 'Delivered';
                              if (nextStatus === 'Delivered') {
                                confirmDelivery(del.deliveryId, 'Received by on-site staff', 'Sister Mary');
                              } else {
                                updateDeliveryStatus(del.deliveryId, nextStatus, 'Departed loading bay', 'Driver');
                              }
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded shadow-xs"
                          >
                            {del.status === 'Pickup Scheduled' ? 'Dispatch' : 'Confirm Receipt'}
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Delivered</span>
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delay Modal */}
      {delayModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">Report In-Transit Delay</h3>
            <p className="text-slate-600">
              Reporting a delay will log the telematics alert and reassess the food safe-use deadline window.
            </p>

            <textarea
              rows={2}
              value={delayNote}
              onChange={(e) => setDelayNote(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />

            <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDelayModalOpen(false)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (selectedDelivery) {
                    addDeliveryDelay(selectedDelivery.deliveryId, delayNote);
                  }
                  setDelayModalOpen(false);
                }}
                className="px-4 py-1.5 font-semibold bg-amber-600 text-white rounded-lg hover:bg-amber-500"
              >
                Submit Delay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
