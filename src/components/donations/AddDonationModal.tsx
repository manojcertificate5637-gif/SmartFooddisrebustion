import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Package } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FoodCategory, FoodUnit, StorageCondition, VehicleType } from '../../types';

interface AddDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddDonationModal: React.FC<AddDonationModalProps> = ({ isOpen, onClose }) => {
  const { addFoodListing } = useApp();

  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('Prepared Meals');
  const [quantity, setQuantity] = useState<number>(40);
  const [unit, setUnit] = useState<FoodUnit>('meal packs');
  const [description, setDescription] = useState('');
  const [preparationTime, setPreparationTime] = useState(
    new Date(Date.now() - 30 * 60000).toISOString().slice(0, 16)
  );
  const [expiryHours, setExpiryHours] = useState<number>(6);
  const [pickupAddress, setPickupAddress] = useState('Central Community Kitchen, 100 Main St');
  const [donorName, setDonorName] = useState('Urban Bistro & Catering');
  const [contactPerson, setContactPerson] = useState('Chef Marcus Vance');
  const [phone, setPhone] = useState('+1 (555) 301-4490');
  const [storageCondition, setStorageCondition] = useState<StorageCondition>('Refrigerated (2-4°C)');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim() || quantity <= 0) {
      setError('Please provide a valid food name and positive quantity.');
      return;
    }

    const safeUseDeadline = new Date(Date.now() + expiryHours * 3600000).toISOString();

    addFoodListing({
      name: foodName,
      category,
      description: description || `${quantity} ${unit} of fresh ${foodName}`,
      quantity: Number(quantity),
      unit,
      mealPacksCount: unit === 'meal packs' ? Number(quantity) : undefined,
      preparationTime: new Date(preparationTime).toISOString(),
      provider: {
        name: donorName,
        contactPerson,
        phone,
        address: pickupAddress,
        zone: 'Central Zone',
      },
      safety: {
        status: 'Verified',
        verifiedSafeUseDeadline: safeUseDeadline,
        storageCondition,
        recordedTemperature: storageCondition.includes('Refrigerated') ? 3.5 : undefined,
        handlingInstructions: `Store at ${storageCondition}. Keep covered and sealed.`,
        verifierName: 'Certified Donor Representative',
        verificationNotes: 'Freshly prepared; visual seal and safe temperature verified.',
        verifiedAt: new Date().toISOString(),
      },
      pickup: {
        address: pickupAddress,
        availabilityWindow: 'Today within 2 hours',
        loadingTimeMinutes: 15,
        collectionNotes: 'Ring Receiving Door B for staff handover.',
      },
      transportReq: {
        requiredVehicleType: storageCondition.includes('Refrigerated') ? 'Refrigerated Van' : 'Cargo Van',
        temperatureControlled: storageCondition.includes('Refrigerated'),
        cargoHandling: 'Level container transport',
        readinessStatus: 'Ready Now',
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200 text-xs">
        <div className="flex justify-between items-start border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Package className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Register Surplus Food Donation
              </h2>
              <span className="text-[11px] text-slate-500">
                Instantly makes food available to hunger relief partners
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-medium text-slate-700 mb-1">Food Item Name *</label>
              <input
                type="text"
                required
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="e.g. Fresh Steamed Rice & Veggie Curry Bowls"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Food Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FoodCategory)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
              >
                <option value="Prepared Meals">Prepared Meals</option>
                <option value="Bakery & Bread">Bakery &amp; Bread</option>
                <option value="Fresh Produce">Fresh Produce</option>
                <option value="Dairy & Eggs">Dairy &amp; Eggs</option>
                <option value="Packaged & Dry Goods">Packaged &amp; Dry Goods</option>
                <option value="Cooked Catering">Cooked Catering</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Storage Condition *</label>
              <select
                value={storageCondition}
                onChange={(e) => setStorageCondition(e.target.value as StorageCondition)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
              >
                <option value="Refrigerated (2-4°C)">Refrigerated (2-4°C)</option>
                <option value="Ambient">Ambient / Dry Shelf</option>
                <option value="Frozen (≤-18°C)">Frozen (≤-18°C)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Quantity *</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Unit of Measure *</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as FoodUnit)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="meal packs">meal packs (individual)</option>
                <option value="kg">kg (weight)</option>
                <option value="crates">crates</option>
                <option value="liters">liters</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Preparation Time</label>
              <input
                type="datetime-local"
                value={preparationTime}
                onChange={(e) => setPreparationTime(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Safe-Use Window (Hours Remaining) *</label>
              <input
                type="number"
                min="1"
                max="168"
                required
                value={expiryHours}
                onChange={(e) => setExpiryHours(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Donor / Business Name *</label>
              <input
                type="text"
                required
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Contact Person &amp; Phone *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +1 (555) 301-4490"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-slate-700 mb-1">Pickup Location Address *</label>
              <input
                type="text"
                required
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-slate-700 mb-1">Description &amp; Dietary Notes</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Allergen notices, hot/cold holding history, container details..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-sm transition"
            >
              Publish Food Donation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
