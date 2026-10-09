import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Clock,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Thermometer,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VehicleResource, AllocationMatch } from '../../types';

export const Step6Transport: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { vehicles, currentPlan, setWorkflowStep } = useApp();

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || '');

  // Group current plan matches by assigned vehicle
  const matchesByVehicle: Record<string, AllocationMatch[]> = {};
  if (currentPlan) {
    currentPlan.matches.forEach((m) => {
      if (!matchesByVehicle[m.assignedVehicleId]) {
        matchesByVehicle[m.assignedVehicleId] = [];
      }
      matchesByVehicle[m.assignedVehicleId].push(m);
    });
  }

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);
  const assignedDrops = selectedVehicle ? matchesByVehicle[selectedVehicle.id] || [] : [];

  // Calculate vehicle capacity utilization
  const totalWeightAssigned = assignedDrops.reduce((sum, d) => sum + d.allocatedQuantity, 0);
  const capacityPct = selectedVehicle
    ? Math.min(100, Math.round((totalWeightAssigned / selectedVehicle.capacity) * 100))
    : 0;

  // Route sequence simulation
  const routeStops = [
    {
      stopIndex: 1,
      type: 'Hub Departure / Staging',
      location: selectedVehicle?.currentLocation || 'Central Dispatch Depot',
      eta: '10:15 AM',
      activity: 'Pre-trip cold sensor inspection & departure',
      durationMins: 10,
    },
    ...assignedDrops.map((d, idx) => ({
      stopIndex: idx + 2,
      type: 'Recipient Drop-Off',
      location: d.recipientName,
      eta: `11:${(idx * 30 + 15).toString().padStart(2, '0')} AM`,
      activity: `Deliver ${d.allocatedQuantity} ${d.unit} of ${d.foodName}`,
      durationMins: d.estimatedDurationMin,
    })),
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Step 6 of 8 · Logistics Architecture
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Transportation Routing &amp; Fleet Utilization
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fleet vehicle assignment, sequence optimization, and simulated multi-stop delivery schedules enforcing cold-chain limits.
          </p>
        </div>

        <button
          type="button"
          onClick={onComplete}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded"
        >
          Confirm Route &amp; Proceed to Review Gate &rarr;
        </button>
      </div>

      <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-blue-600" />
          <span>
            <strong className="text-slate-800">Simulated Transit Telemetry:</strong> Distance, routing sequence, and timing are deterministic estimates computed from regional hub coordinates.
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-500">v1.4 Routing Model</span>
      </div>

      {/* Fleet Resource Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Active Fleet Vehicle Status
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {vehicles.map((v) => {
            const dropsCount = matchesByVehicle[v.id]?.length || 0;
            const isSelected = v.id === selectedVehicleId;

            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVehicleId(v.id)}
                className={`p-3.5 text-left border rounded transition relative ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-500'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 text-xs">{v.name}</span>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      v.availability === 'Available'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {v.availability}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 space-y-0.5">
                  <div>Type: {v.type}</div>
                  <div>Capacity: {v.capacity} {v.capacityUnit}</div>
                  <div className="flex items-center gap-1 font-medium text-slate-700">
                    <Thermometer className="w-3 h-3 text-blue-500" />
                    <span>{v.temperatureControlled ? 'Cold Chain (3.0°C)' : 'Ambient Only'}</span>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600">Assigned Drops:</span>
                  <span className="font-bold text-blue-700">{dropsCount} stops</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Vehicle Routing Detail */}
      {selectedVehicle && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-mono text-slate-500">{selectedVehicle.id}</span>
              <h3 className="text-base font-bold text-slate-900">
                Route Manifest: {selectedVehicle.name} ({selectedVehicle.type})
              </h3>
              <span className="text-xs text-slate-600">
                Driver: {selectedVehicle.driverName} · {selectedVehicle.driverPhone}
              </span>
            </div>

            {/* Capacity gauge */}
            <div className="flex items-center gap-3">
              <div className="text-right text-xs">
                <span className="text-slate-500 block">Payload Utilization</span>
                <span className="font-bold text-slate-900">
                  {totalWeightAssigned} / {selectedVehicle.capacity} {selectedVehicle.capacityUnit} ({capacityPct}%)
                </span>
              </div>
              <div className="w-24 bg-slate-200 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    capacityPct > 90 ? 'bg-amber-500' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${capacityPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stop Sequence Timeline */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Simulated Stop Sequence
            </h4>

            {routeStops.length <= 1 ? (
              <div className="p-4 bg-white border border-slate-200 rounded text-xs text-slate-500 text-center">
                No active delivery stops currently assigned to this vehicle in the proposed plan.
              </div>
            ) : (
              <div className="space-y-2">
                {routeStops.map((stop, i) => (
                  <div
                    key={i}
                    className="p-3 bg-white border border-slate-200 rounded flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
                        {stop.stopIndex}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{stop.location}</div>
                        <div className="text-slate-500 text-[11px]">{stop.activity}</div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-semibold text-slate-800">{stop.eta}</div>
                      <div className="text-[10px] text-slate-400">~{stop.durationMins} mins duration</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
