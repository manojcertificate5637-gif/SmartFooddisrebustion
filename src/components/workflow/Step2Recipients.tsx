import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  Plus,
  Eye,
  Edit2,
  Search,
  Filter,
  UserCheck,
  Ban,
  Clock,
  Layers,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Recipient, RecipientType, RecipientPriority, StorageCondition, FoodCategory, FoodUnit } from '../../types';

export const Step2Recipients: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { recipients, addRecipient, updateRecipient, verifyRecipient, demandRequests } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');

  // Selected recipient detail modal / drawer
  const [activeRecipient, setActiveRecipient] = useState<Recipient | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New Recipient Form State
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgType, setNewOrgType] = useState<RecipientType>('Emergency Shelter');
  const [newPriority, setNewPriority] = useState<RecipientPriority>('P1 - Critical/High-Risk');
  const [newAddress, setNewAddress] = useState('');
  const [newZone, setNewZone] = useState('Central Zone');
  const [newDistanceKm, setNewDistanceKm] = useState(5.0);
  const [newCategories, setNewCategories] = useState<FoodCategory[]>(['Prepared Meals', 'Bakery & Bread']);
  const [newReqQty, setNewReqQty] = useState(60);
  const [newUnit, setNewUnit] = useState<FoodUnit>('meal packs');
  const [newPeopleServed, setNewPeopleServed] = useState(100);
  const [newDeliveryWindow, setNewDeliveryWindow] = useState('11:00 - 13:30');
  const [newStorageCap, setNewStorageCap] = useState(150);
  const [newStorageConditions, setNewStorageConditions] = useState<StorageCondition[]>(['Ambient', 'Refrigerated (2-4°C)']);
  const [newTempControl, setNewTempControl] = useState(true);
  const [newAccess, setNewAccess] = useState<'Loading Dock' | 'Street Parking' | 'Ground Floor Ramp' | 'Elevator Only'>('Ground Floor Ramp');
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');

  const filteredRecipients = recipients.filter((r) => {
    const matchesSearch =
      r.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || r.organizationType === selectedType;
    const matchesPriority = selectedPriority === 'All' || r.recipientPriority === selectedPriority;
    return matchesSearch && matchesType && matchesPriority;
  });

  const handleCreateRecipient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName || !newAddress) return;

    addRecipient({
      organizationName: newOrgName,
      organizationType: newOrgType,
      location: {
        address: newAddress,
        zone: newZone,
        distanceKmFromHub: Number(newDistanceKm),
      },
      verificationStatus: 'Verified',
      requiredCategories: newCategories,
      requestedQuantity: Number(newReqQty),
      unit: newUnit,
      peopleServed: Number(newPeopleServed),
      requiredDeliveryWindow: newDeliveryWindow,
      storageCapacity: Number(newStorageCap),
      currentStorageOccupancy: 0,
      storageConditions: newStorageConditions,
      temperatureControlAvailable: newTempControl,
      transportationAccess: newAccess,
      recipientPriority: newPriority,
      contact: {
        name: newContactName,
        phone: newContactPhone,
        email: newContactEmail,
      },
    });

    setIsAddingNew(false);
  };

  const toggleCategory = (cat: FoodCategory) => {
    if (newCategories.includes(cat)) {
      setNewCategories(newCategories.filter((c) => c !== cat));
    } else {
      setNewCategories([...newCategories, cat]);
    }
  };

  const toggleStorage = (cond: StorageCondition) => {
    if (newStorageConditions.includes(cond)) {
      setNewStorageConditions(newStorageConditions.filter((c) => c !== cond));
    } else {
      setNewStorageConditions([...newStorageConditions, cond]);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Step 2 of 8 · Demand Infrastructure
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Recipient Agency Directory &amp; Capabilities
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit receiving partners, verified cold-chain storage facilities, priority tier criteria, and dock access constraints.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Recipient Agency</span>
          </button>
          <button
            type="button"
            onClick={onComplete}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded"
          >
            Confirm &amp; Proceed to Step 3 &rarr;
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
            placeholder="Search organization, ID, location..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700"
          >
            <option value="All">All Organization Types</option>
            <option value="Emergency Shelter">Emergency Shelter</option>
            <option value="Food Bank">Food Bank</option>
            <option value="Community Kitchen">Community Kitchen</option>
            <option value="Youth / School Pantry">Youth / School Pantry</option>
            <option value="Elder Care Center">Elder Care Center</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700"
          >
            <option value="All">All Priority Tiers</option>
            <option value="P1 - Critical/High-Risk">P1 - Critical/High-Risk</option>
            <option value="P2 - Standard Community">P2 - Standard Community</option>
            <option value="P3 - Flexible">P3 - Flexible</option>
          </select>
        </div>
      </div>

      {/* Recipient Table */}
      <div className="overflow-x-auto border border-slate-200 rounded">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Agency Name &amp; ID</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Priority Tier</th>
              <th className="py-2.5 px-3">Storage Capability</th>
              <th className="py-2.5 px-3">Capacity</th>
              <th className="py-2.5 px-3">Delivery Window</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRecipients.map((rec) => {
              const hasColdChain = rec.storageConditions.includes('Refrigerated (2-4°C)');
              return (
                <tr key={rec.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-900">{rec.organizationName}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <span>{rec.id}</span>
                      <span>·</span>
                      <span>{rec.location.address}</span>
                      <span>·</span>
                      <span>{rec.location.distanceKmFromHub} km</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700">
                    {rec.organizationType}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`font-semibold ${
                        rec.recipientPriority.startsWith('P1')
                          ? 'text-rose-700'
                          : rec.recipientPriority.startsWith('P2')
                          ? 'text-blue-700'
                          : 'text-slate-600'
                      }`}
                    >
                      {rec.recipientPriority}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="space-y-0.5">
                      <div className="text-slate-800 font-medium">
                        {rec.storageConditions.join(', ')}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {hasColdChain ? 'Refrigeration Active' : 'No Cold Storage'}
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700">
                    <div className="font-medium">
                      {rec.currentStorageOccupancy} / {rec.storageCapacity} units
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Serves {rec.peopleServed} people
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 font-mono text-[11px]">
                    {rec.requiredDeliveryWindow}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`font-semibold ${
                        rec.verificationStatus === 'Verified' ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {rec.verificationStatus}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setActiveRecipient(rec)}
                        className="px-2 py-1 text-slate-700 hover:bg-slate-100 rounded text-[11px] font-medium border border-slate-200"
                        title="View details & allocation history"
                      >
                        Inspect
                      </button>
                      {rec.verificationStatus !== 'Verified' && (
                        <button
                          type="button"
                          onClick={() => verifyRecipient(rec.id)}
                          className="px-2 py-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded text-[11px] font-semibold border border-emerald-200"
                        >
                          Verify
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Recipient Detail Drawer / Modal */}
      {activeRecipient && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-mono text-slate-500">{activeRecipient.id}</span>
                <h3 className="text-base font-bold text-slate-900">
                  {activeRecipient.organizationName}
                </h3>
                <span className="text-xs text-slate-600">{activeRecipient.organizationType}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveRecipient(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                <span className="text-slate-500 block">Priority Tier</span>
                <span className="font-bold text-slate-800">{activeRecipient.recipientPriority}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                <span className="text-slate-500 block">Verification Status</span>
                <span className="font-bold text-emerald-700">{activeRecipient.verificationStatus}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                <span className="text-slate-500 block">Receiving Window</span>
                <span className="font-bold text-slate-800">{activeRecipient.requiredDeliveryWindow}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                <span className="text-slate-500 block">Dock Access</span>
                <span className="font-bold text-slate-800">{activeRecipient.transportationAccess}</span>
              </div>
            </div>

            <div className="text-xs space-y-2">
              <div>
                <span className="font-semibold text-slate-700">Storage Conditions &amp; Limits:</span>
                <p className="text-slate-600 mt-0.5">
                  Available: {activeRecipient.storageConditions.join(', ')}. Capacity: {activeRecipient.currentStorageOccupancy} / {activeRecipient.storageCapacity} units occupied.
                </p>
              </div>

              <div>
                <span className="font-semibold text-slate-700">Eligible Food Categories:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {activeRecipient.requiredCategories.map((c) => (
                    <span key={c} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700">Contact Person:</span>
                <p className="text-slate-600 mt-0.5">
                  {activeRecipient.contact.name} · {activeRecipient.contact.phone} · {activeRecipient.contact.email}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  updateRecipient(activeRecipient.id, {
                    isActive: !activeRecipient.isActive,
                  });
                  setActiveRecipient(null);
                }}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 border border-slate-200 rounded"
              >
                {activeRecipient.isActive ? 'Deactivate Agency' : 'Reactivate Agency'}
              </button>
              <button
                type="button"
                onClick={() => setActiveRecipient(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Recipient Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleCreateRecipient}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto text-xs"
          >
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Register New Recipient Agency
                </h3>
                <span className="text-slate-500">Record storage constraints and receiving profile.</span>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Organization Name *</label>
                <input
                  type="text"
                  required
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="e.g. Hope Horizon Family Shelter"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Organization Type</label>
                <select
                  value={newOrgType}
                  onChange={(e) => setNewOrgType(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option value="Emergency Shelter">Emergency Shelter</option>
                  <option value="Food Bank">Food Bank</option>
                  <option value="Community Kitchen">Community Kitchen</option>
                  <option value="Youth / School Pantry">Youth / School Pantry</option>
                  <option value="Elder Care Center">Elder Care Center</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Recipient Priority Tier</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option value="P1 - Critical/High-Risk">P1 - Critical/High-Risk (Emergency Shelter)</option>
                  <option value="P2 - Standard Community">P2 - Standard Community</option>
                  <option value="P3 - Flexible">P3 - Flexible</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Physical Address *</label>
                <input
                  type="text"
                  required
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Street and building"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Max Storage Capacity</label>
                <input
                  type="number"
                  min="10"
                  value={newStorageCap}
                  onChange={(e) => setNewStorageCap(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Delivery Time Window</label>
                <input
                  type="text"
                  value={newDeliveryWindow}
                  onChange={(e) => setNewDeliveryWindow(e.target.value)}
                  placeholder="e.g. 11:30 - 14:00"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Certified Storage Capabilities</label>
              <div className="flex gap-4">
                {(['Ambient', 'Refrigerated (2-4°C)', 'Frozen (≤-18°C)'] as StorageCondition[]).map((cond) => (
                  <label key={cond} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newStorageConditions.includes(cond)}
                      onChange={() => toggleStorage(cond)}
                    />
                    <span>{cond}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1.5 font-medium text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 font-semibold bg-emerald-600 text-white rounded hover:bg-emerald-500"
              >
                Save &amp; Verify Recipient
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
