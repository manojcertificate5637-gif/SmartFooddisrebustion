import React, { useState } from 'react';
import {
  Users,
  Clock,
  AlertCircle,
  Plus,
  Search,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Package,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FoodCategory, FoodUnit, StorageCondition } from '../../types';

export const Step3Demand: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { demandRequests, foodListings, recipients, addDemandRequest } = useApp();

  const [isAddingDemand, setIsAddingDemand] = useState(false);
  const [selectedRecipientId, setSelectedRecipientId] = useState(recipients[0]?.id || '');
  const [category, setCategory] = useState<FoodCategory>('Prepared Meals');
  const [quantity, setQuantity] = useState(50);
  const [unit, setUnit] = useState<FoodUnit>('meal packs');
  const [urgency, setUrgency] = useState<'Urgent (Within 3h)' | 'High (Today)' | 'Standard (Within 24h)'>('Urgent (Within 3h)');
  const [peopleServed, setPeopleServed] = useState(80);
  const [storageCapability, setStorageCapability] = useState<StorageCondition>('Refrigerated (2-4°C)');
  const [notes, setNotes] = useState('Midday lunch service.');

  // Group demand by Category
  const categories: FoodCategory[] = [
    'Prepared Meals',
    'Bakery & Bread',
    'Fresh Produce',
    'Dairy & Eggs',
    'Packaged & Dry Goods',
    'Cooked Catering',
  ];

  const demandSummaryByCategory = categories.map((cat) => {
    const totalDemanded = demandRequests
      .filter((d) => d.category === cat)
      .reduce((sum, d) => sum + (d.requestedQuantity - d.allocatedQuantity), 0);

    const compatibleSurplus = foodListings
      .filter((fl) => fl.category === cat && fl.safety.status === 'Verified')
      .reduce((sum, fl) => sum + fl.remainingQuantity, 0);

    const unitUsed = demandRequests.find((d) => d.category === cat)?.unit || 'units';

    return {
      category: cat,
      totalDemanded,
      compatibleSurplus,
      unmet: Math.max(0, totalDemanded - compatibleSurplus),
      unit: unitUsed,
    };
  });

  const handleAddDemand = (e: React.FormEvent) => {
    e.preventDefault();
    const targetRecipient = recipients.find((r) => r.id === selectedRecipientId);
    if (!targetRecipient) return;

    addDemandRequest({
      recipientId: targetRecipient.id,
      recipientName: targetRecipient.organizationName,
      category,
      requestedQuantity: Number(quantity),
      unit,
      deliveryDeadline: new Date(Date.now() + 4 * 3600000).toISOString(),
      urgency,
      peopleServed: Number(peopleServed),
      storageCapability,
      verificationStatus: 'Verified',
      notes,
    });

    setIsAddingDemand(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-6">
      {/* Step Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Step 3 of 8 · Demand Intake
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Assess Community Demand &amp; Category Match
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit outstanding food requests against available verified inventory by category, urgency, and storage compatibility.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddingDemand(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Demand Request</span>
          </button>
          <button
            type="button"
            onClick={onComplete}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded"
          >
            Continue to Safety Validation &rarr;
          </button>
        </div>
      </div>

      {/* Aggregate Balance Cards by Category */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Supply vs. Demand Balance By Category
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {demandSummaryByCategory.map((item) => (
            <div key={item.category} className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
              <span className="font-semibold text-slate-800 block truncate">{item.category}</span>
              <div className="text-slate-600">
                Demand: <span className="font-bold text-slate-900">{item.totalDemanded}</span>
              </div>
              <div className="text-slate-600">
                Surplus: <span className="font-bold text-emerald-700">{item.compatibleSurplus}</span>
              </div>
              <div className="pt-1 border-t border-slate-200 text-[11px]">
                {item.unmet > 0 ? (
                  <span className="text-amber-700 font-medium">Unmet: {item.unmet}</span>
                ) : (
                  <span className="text-emerald-700 font-medium">Fully Covered</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demand Requests Table */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Active Recipient Demand Queue
        </h3>
        <div className="overflow-x-auto border border-slate-200 rounded">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Request ID &amp; Recipient</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Requested Quantity</th>
                <th className="py-2.5 px-3">Remaining Demand</th>
                <th className="py-2.5 px-3">Urgency</th>
                <th className="py-2.5 px-3">Storage Needed</th>
                <th className="py-2.5 px-3">People Served</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {demandRequests.map((dmd) => {
                const remaining = dmd.requestedQuantity - dmd.allocatedQuantity;
                return (
                  <tr key={dmd.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{dmd.recipientName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{dmd.id} · {dmd.recipientId}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-800 font-medium">{dmd.category}</td>
                    <td className="py-2.5 px-3 text-slate-800">
                      {dmd.requestedQuantity} {dmd.unit}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {remaining} {dmd.unit}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`font-semibold ${
                          dmd.urgency.startsWith('Urgent')
                            ? 'text-rose-700'
                            : dmd.urgency.startsWith('High')
                            ? 'text-amber-700'
                            : 'text-slate-600'
                        }`}
                      >
                        {dmd.urgency}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{dmd.storageCapability}</td>
                    <td className="py-2.5 px-3 text-slate-600">{dmd.peopleServed} individuals</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`font-semibold ${
                          dmd.requestStatus === 'Fulfilled'
                            ? 'text-emerald-700'
                            : dmd.requestStatus === 'Partially Matched'
                            ? 'text-blue-700'
                            : 'text-slate-700'
                        }`}
                      >
                        {dmd.requestStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Demand Modal */}
      {isAddingDemand && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleAddDemand}
            className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 space-y-4 text-xs"
          >
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Record Recipient Demand</h3>
                <span className="text-slate-500">Add an authenticated hunger relief need.</span>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingDemand(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Target Recipient Agency *</label>
                <select
                  value={selectedRecipientId}
                  onChange={(e) => setSelectedRecipientId(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white font-medium"
                >
                  {recipients.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.organizationName} ({r.recipientPriority})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Food Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Urgency</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="Urgent (Within 3h)">Urgent (Within 3h)</option>
                    <option value="High (Today)">High (Today)</option>
                    <option value="Standard (Within 24h)">Standard (Within 24h)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Quantity Requested</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="meal packs">meal packs</option>
                    <option value="kg">kg</option>
                    <option value="crates">crates</option>
                    <option value="liters">liters</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">People to be Served</label>
                  <input
                    type="number"
                    min="1"
                    value={peopleServed}
                    onChange={(e) => setPeopleServed(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Storage Condition at Site</label>
                  <select
                    value={storageCapability}
                    onChange={(e) => setStorageCapability(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="Ambient">Ambient</option>
                    <option value="Refrigerated (2-4°C)">Refrigerated (2-4°C)</option>
                    <option value="Frozen (≤-18°C)">Frozen (≤-18°C)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingDemand(false)}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 font-semibold bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Save Demand Request
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
