import React, { useState } from 'react';
import {
  Package,
  Users,
  ShieldCheck,
  Truck,
  Layers,
  BarChart3,
  FileDown,
  Settings,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FoodCategory, StorageCondition, DeliveryStatus } from '../../types';

export const OperationsContainer: React.FC = () => {
  const {
    activeOperationsTab,
    setActiveOperationsTab,
    foodListings,
    recipients,
    demandRequests,
    vehicles,
    deliveries,
    safetyLogs,
    currentPlan,
    scoringWeights,
    setScoringWeights,
    resetDemoData,
    exportCsv,
    updateDeliveryStatus,
    setWorkflowStep,
  } = useApp();

  const [searchFilter, setSearchFilter] = useState('');

  // Analytics Calculations (strictly separate units)
  const totalSurplusKg = foodListings
    .filter((f) => f.unit === 'kg')
    .reduce((sum, f) => sum + f.quantity, 0);
  const totalSurplusMealPacks = foodListings
    .filter((f) => f.unit === 'meal packs')
    .reduce((sum, f) => sum + f.quantity, 0);

  const totalAllocatedKg = currentPlan?.totalAllocatedKg || 0;
  const totalAllocatedMealPacks = currentPlan?.totalAllocatedMealPacks || 0;

  const totalDeliveredKg = deliveries
    .filter((d) => d.status === 'Delivered' && d.unit === 'kg')
    .reduce((sum, d) => sum + d.quantity, 0);
  const totalDeliveredMealPacks = deliveries
    .filter((d) => d.status === 'Delivered' && d.unit === 'meal packs')
    .reduce((sum, d) => sum + d.quantity, 0);

  const unallocatedKg = Math.max(0, totalSurplusKg - totalAllocatedKg);
  const unallocatedMealPacks = Math.max(0, totalSurplusMealPacks - totalAllocatedMealPacks);

  const totalDemandedKg = demandRequests
    .filter((d) => d.unit === 'kg')
    .reduce((sum, d) => sum + d.requestedQuantity, 0);
  const totalDemandedMealPacks = demandRequests
    .filter((d) => d.unit === 'meal packs')
    .reduce((sum, d) => sum + d.requestedQuantity, 0);

  const unmetDemandKg = Math.max(0, totalDemandedKg - totalAllocatedKg);
  const unmetDemandMealPacks = Math.max(0, totalDemandedMealPacks - totalAllocatedMealPacks);

  const allocationSuccessRate =
    foodListings.length > 0
      ? Math.round(
          (foodListings.filter((f) => f.allocatedQuantity > 0).length / foodListings.length) * 100
        )
      : 0;

  const deliveryCompletionRate =
    deliveries.length > 0
      ? Math.round((deliveries.filter((d) => d.status === 'Delivered').length / deliveries.length) * 100)
      : 0;

  const safetyReviewsRequired = foodListings.filter((f) => f.safety.status !== 'Verified').length;
  const deliveryDelayCount = deliveries.filter((d) => d.isDelayed).length;

  return (
    <div className="space-y-6">
      {/* Header and 8 Nested Navigation Tabs */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
              Operations Control &amp; System Reports
            </h2>
            <p className="text-xs text-slate-500">
              Direct access to live inventory databases, cold-chain safety logs, fleet resources, and compliance audits.
            </p>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Audit Version 2026.1 · Active
          </div>
        </div>

        {/* 8 Subsections as clean functional tabs */}
        <div className="flex border-b border-slate-200 gap-1 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'inventory', label: 'Food Inventory', icon: Package },
            { id: 'demand', label: 'Recipient Demand', icon: Users },
            { id: 'safety', label: 'Food Safety Center', icon: ShieldCheck },
            { id: 'transport', label: 'Transport Resources', icon: Truck },
            { id: 'deliveries', label: 'Delivery Management', icon: Layers },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'reports', label: 'Export Reports', icon: FileDown },
            { id: 'settings', label: 'Settings & Demo', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeOperationsTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveOperationsTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-3 border-b-2 whitespace-nowrap transition ${
                  isActive
                    ? 'border-amber-600 text-amber-800 bg-amber-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBSECTION A: FOOD INVENTORY */}
      {activeOperationsTab === 'inventory' && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Food Surplus Inventory Registry
              </h3>
              <p className="text-xs text-slate-500">
                {foodListings.length} tracked surplus batches across regional food providers.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setWorkflowStep(1)}
                className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-500"
              >
                + Register New Batch
              </button>
              <button
                type="button"
                onClick={() => exportCsv('listings')}
                className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded text-xs font-medium hover:bg-slate-100"
              >
                Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Listing ID &amp; Item</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Initial Qty</th>
                  <th className="py-2.5 px-3">Remaining</th>
                  <th className="py-2.5 px-3">Storage Condition</th>
                  <th className="py-2.5 px-3">Safe-Use Deadline</th>
                  <th className="py-2.5 px-3">Safety Status</th>
                  <th className="py-2.5 px-3">Listing Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {foodListings.map((fl) => (
                  <tr key={fl.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{fl.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{fl.id} · {fl.provider.name}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">{fl.category}</td>
                    <td className="py-2.5 px-3 text-slate-700">{fl.quantity} {fl.unit}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{fl.remainingQuantity} {fl.unit}</td>
                    <td className="py-2.5 px-3 text-slate-700">{fl.safety.storageCondition}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                      {new Date(fl.safety.verifiedSafeUseDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`font-semibold ${fl.safety.status === 'Verified' ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {fl.safety.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-medium text-slate-700">{fl.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBSECTION B: RECIPIENT DEMAND */}
      {activeOperationsTab === 'demand' && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Recipient Demand Queue
              </h3>
              <p className="text-xs text-slate-500">
                {demandRequests.length} active demand requests from verified shelters and food banks.
              </p>
            </div>
            <button
              type="button"
              onClick={() => exportCsv('demands')}
              className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded text-xs font-medium hover:bg-slate-100"
            >
              Export Demand CSV
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Agency Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Demand Qty</th>
                  <th className="py-2.5 px-3">Allocated Qty</th>
                  <th className="py-2.5 px-3">Urgency Tier</th>
                  <th className="py-2.5 px-3">People Served</th>
                  <th className="py-2.5 px-3">Request Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {demandRequests.map((dmd) => (
                  <tr key={dmd.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{dmd.recipientName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{dmd.id}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">{dmd.category}</td>
                    <td className="py-2.5 px-3 text-slate-700">{dmd.requestedQuantity} {dmd.unit}</td>
                    <td className="py-2.5 px-3 font-semibold text-blue-700">{dmd.allocatedQuantity} {dmd.unit}</td>
                    <td className="py-2.5 px-3 font-semibold text-rose-700">{dmd.urgency}</td>
                    <td className="py-2.5 px-3 text-slate-700">{dmd.peopleServed} individuals</td>
                    <td className="py-2.5 px-3">
                      <span className="font-medium text-slate-800">{dmd.requestStatus}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBSECTION C: FOOD SAFETY CENTER */}
      {activeOperationsTab === 'safety' && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Food Safety Compliance Log
              </h3>
              <p className="text-xs text-slate-500">
                Verified inspection stamps, internal temperature checks, and certified custody transfers.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setWorkflowStep(4)}
              className="px-3 py-1.5 bg-amber-600 text-white rounded text-xs font-semibold hover:bg-amber-500"
            >
              Open Safety Verification Gate
            </button>
          </div>

          <div className="space-y-2">
            {safetyLogs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-50 border border-slate-200 rounded flex justify-between items-start text-xs">
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px] font-mono">
                      {log.id}
                    </span>
                    <span>{log.action}: {log.foodName}</span>
                  </div>
                  <p className="text-slate-600 mt-1">{log.details}</p>
                </div>
                <div className="text-right shrink-0 text-[11px] text-slate-500">
                  <div className="font-medium text-slate-700">{log.verifier}</div>
                  <div>{new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBSECTION D: TRANSPORT RESOURCES */}
      {activeOperationsTab === 'transport' && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Fleet Logistics &amp; Transport Units
              </h3>
              <p className="text-xs text-slate-500">
                {vehicles.length} vehicle resources active in delivery network.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {vehicles.map((v) => (
              <div key={v.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">{v.name}</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {v.availability}
                  </span>
                </div>
                <div className="text-slate-600 space-y-0.5">
                  <div>Type: <strong>{v.type}</strong></div>
                  <div>Max Payload: <strong>{v.capacity} {v.capacityUnit}</strong></div>
                  <div>Cold-Chain Ready: <strong>{v.temperatureControlled ? 'Yes (Continuous 2-4°C)' : 'Ambient Cargo'}</strong></div>
                  <div>Current Depot: <strong>{v.currentLocation}</strong></div>
                  <div>Driver: <strong>{v.driverName}</strong> ({v.driverPhone})</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBSECTION E: DELIVERY MANAGEMENT */}
      {activeOperationsTab === 'deliveries' && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Active Delivery Manifests
              </h3>
              <p className="text-xs text-slate-500">
                {deliveries.length} tracked dispatches in flight or completed.
              </p>
            </div>
            <button
              type="button"
              onClick={() => exportCsv('deliveries')}
              className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded text-xs font-medium hover:bg-slate-100"
            >
              Export Deliveries CSV
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Delivery ID</th>
                  <th className="py-2.5 px-3">Food &amp; Quantity</th>
                  <th className="py-2.5 px-3">Recipient Agency</th>
                  <th className="py-2.5 px-3">Vehicle</th>
                  <th className="py-2.5 px-3">Scheduled Pickup</th>
                  <th className="py-2.5 px-3">Delivery Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deliveries.map((del) => (
                  <tr key={del.deliveryId} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{del.deliveryId}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">{del.foodName}</div>
                      <div className="text-[11px] text-slate-500">{del.quantity} {del.unit}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-800">{del.recipientName}</td>
                    <td className="py-2.5 px-3 text-slate-700">{del.vehicleName}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                      {new Date(del.scheduledPickup).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`font-semibold ${del.status === 'Delivered' ? 'text-emerald-700' : 'text-blue-700'}`}>
                        {del.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBSECTION F: ANALYTICS (Actual Application Metrics, Separated Units!) */}
      {activeOperationsTab === 'analytics' && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-5">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Operational Performance Analytics
            </h3>
            <p className="text-xs text-slate-500">
              Deterministic platform metrics computed from live inventory, allocation plans, and delivery logs. Units are strictly partitioned.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-500 uppercase tracking-wider text-[11px] block">
                Total Surplus Registered
              </span>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {totalSurplusMealPacks} <span className="text-xs font-normal text-slate-500">packs</span>
              </div>
              <div className="text-sm font-semibold text-slate-700">
                {totalSurplusKg} <span className="text-xs font-normal text-slate-500">kg bulk</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-500 uppercase tracking-wider text-[11px] block">
                Total Allocated Quantity
              </span>
              <div className="text-xl font-bold text-blue-700 mt-1">
                {totalAllocatedMealPacks} <span className="text-xs font-normal text-slate-500">packs</span>
              </div>
              <div className="text-sm font-semibold text-blue-600">
                {totalAllocatedKg} <span className="text-xs font-normal text-slate-500">kg bulk</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-500 uppercase tracking-wider text-[11px] block">
                Total Delivered Quantity
              </span>
              <div className="text-xl font-bold text-emerald-700 mt-1">
                {totalDeliveredMealPacks} <span className="text-xs font-normal text-slate-500">packs</span>
              </div>
              <div className="text-sm font-semibold text-emerald-600">
                {totalDeliveredKg} <span className="text-xs font-normal text-slate-500">kg bulk</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-500 uppercase tracking-wider text-[11px] block">
                Unallocated Surplus
              </span>
              <div className="text-xl font-bold text-slate-700 mt-1">
                {unallocatedMealPacks} <span className="text-xs font-normal text-slate-500">packs</span>
              </div>
              <div className="text-sm font-semibold text-slate-600">
                {unallocatedKg} <span className="text-xs font-normal text-slate-500">kg bulk</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-500 uppercase tracking-wider text-[11px] block">
                Allocation Success Rate
              </span>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {allocationSuccessRate}%
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Ratio of active listings matched</div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-500 uppercase tracking-wider text-[11px] block">
                Delivery Completion Rate
              </span>
              <div className="text-2xl font-bold text-emerald-700 mt-1">
                {deliveryCompletionRate}%
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Closed dispatches</div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-500 uppercase tracking-wider text-[11px] block">
                Safety Reviews Required
              </span>
              <div className="text-2xl font-bold text-amber-600 mt-1">
                {safetyReviewsRequired}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Awaiting inspector clearance</div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-500 uppercase tracking-wider text-[11px] block">
                Encountered Transit Delays
              </span>
              <div className="text-2xl font-bold text-slate-800 mt-1">
                {deliveryDelayCount}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Recalculated safety margins</div>
            </div>
          </div>
        </div>
      )}

      {/* SUBSECTION G: EXPORT REPORTS */}
      {activeOperationsTab === 'reports' && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Data Export &amp; Audit Reports
            </h3>
            <p className="text-xs text-slate-500">
              Download complete CSV logs of current system state for municipal donation tax credit and safety audits.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <button
              type="button"
              onClick={() => exportCsv('listings')}
              className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-left space-y-1 transition"
            >
              <div className="font-bold text-slate-900">Surplus Food Listings</div>
              <p className="text-slate-500 text-[11px]">Download all active and archived batch listings.</p>
              <span className="text-blue-600 font-semibold block pt-2">Download CSV &rarr;</span>
            </button>

            <button
              type="button"
              onClick={() => exportCsv('recipients')}
              className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-left space-y-1 transition"
            >
              <div className="font-bold text-slate-900">Recipient Directory</div>
              <p className="text-slate-500 text-[11px]">Download verified agencies and storage capabilities.</p>
              <span className="text-blue-600 font-semibold block pt-2">Download CSV &rarr;</span>
            </button>

            <button
              type="button"
              onClick={() => exportCsv('deliveries')}
              className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-left space-y-1 transition"
            >
              <div className="font-bold text-slate-900">Delivery Telematics Log</div>
              <p className="text-slate-500 text-[11px]">Download chain-of-custody and delivery signatures.</p>
              <span className="text-blue-600 font-semibold block pt-2">Download CSV &rarr;</span>
            </button>

            <button
              type="button"
              onClick={() => exportCsv('plan')}
              className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-left space-y-1 transition"
            >
              <div className="font-bold text-slate-900">Current Allocation Plan</div>
              <p className="text-slate-500 text-[11px]">Download proposed matches with math reasoning.</p>
              <span className="text-blue-600 font-semibold block pt-2">Download CSV &rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* SUBSECTION H: SETTINGS & DEMONSTRATION CONTROLS */}
      {activeOperationsTab === 'settings' && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              System Configuration &amp; Demonstration Management
            </h3>
            <p className="text-xs text-slate-500">
              Calibrate multi-factor algorithm weights and reset prototype demonstration state.
            </p>
          </div>

          {/* Reset Demonstration Data */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-slate-900 block text-sm">
                Demonstration Environment Reset
              </span>
              <p className="text-slate-600 max-w-xl">
                Restores the 10 fictional demonstration scenarios (including cold-chain constraint tests, unverified food blocks, travel deadline limits, and split allocations) back to their initial state.
              </p>
            </div>
            <button
              type="button"
              onClick={resetDemoData}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded shrink-0 shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Baseline</span>
            </button>
          </div>

          {/* Algorithm Weights Settings */}
          <div className="space-y-3">
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block">
              Global Deterministic Allocation Scoring Weights
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <div className="flex justify-between font-medium mb-1">
                  <span>Priority Tier Weight</span>
                  <span className="font-bold">{scoringWeights.priorityWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={scoringWeights.priorityWeight}
                  onChange={(e) =>
                    setScoringWeights({ ...scoringWeights, priorityWeight: Number(e.target.value) })
                  }
                  className="w-full"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <div className="flex justify-between font-medium mb-1">
                  <span>Safe-Use Urgency Weight</span>
                  <span className="font-bold">{scoringWeights.expiryUrgencyWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={scoringWeights.expiryUrgencyWeight}
                  onChange={(e) =>
                    setScoringWeights({ ...scoringWeights, expiryUrgencyWeight: Number(e.target.value) })
                  }
                  className="w-full"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <div className="flex justify-between font-medium mb-1">
                  <span>Proximity / Distance Weight</span>
                  <span className="font-bold">{scoringWeights.distanceWeight}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={scoringWeights.distanceWeight}
                  onChange={(e) =>
                    setScoringWeights({ ...scoringWeights, distanceWeight: Number(e.target.value) })
                  }
                  className="w-full"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <div className="flex justify-between font-medium mb-1">
                  <span>Storage Match Weight</span>
                  <span className="font-bold">{scoringWeights.storageFitWeight}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={scoringWeights.storageFitWeight}
                  onChange={(e) =>
                    setScoringWeights({ ...scoringWeights, storageFitWeight: Number(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
