import React, { useState } from 'react';
import {
  Package,
  Plus,
  Edit2,
  Eye,
  CheckCircle2,
  Clock,
  Thermometer,
  ShieldCheck,
  Ban,
  Save,
  Send,
  X,
  AlertCircle,
  FileText,
  Sparkles,
} from 'lucide-react';
import { useFoodBridge } from '../../context/FoodBridgeContext';
import {
  FoodCategory,
  FoodListingItem,
  FoodUnit,
  StorageCondition,
  ListingStatus,
} from '../../types/foodbridge';

interface HotelFoodManagementProps {
  initialSubSection?: 'add' | 'available' | 'update' | 'availability';
}

export const HotelFoodManagement: React.FC<HotelFoodManagementProps> = ({ initialSubSection = 'available' }) => {
  const {
    currentUser,
    listings,
    addFoodListing,
    updateFoodListing,
    markListingUnavailable,
    publishListing,
    setHotelSection,
    setSelectedListingId,
  } = useFoodBridge();

  const [activeTab, setActiveTab] = useState<'add' | 'available' | 'update' | 'availability'>(initialSubSection);
  const [editingItem, setEditingItem] = useState<FoodListingItem | null>(null);

  // Form Fields
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('Prepared Meals');
  const [isVegetarian, setIsVegetarian] = useState(true);
  const [availableQuantity, setAvailableQuantity] = useState<number>(50);
  const [numberOfPackets, setNumberOfPackets] = useState<number>(50);
  const [unit, setUnit] = useState<FoodUnit>('packets');
  const [preparationTime, setPreparationTime] = useState(
    new Date(Date.now() - 60 * 60000).toISOString().slice(0, 16)
  );
  const [safeUseDeadline, setSafeUseDeadline] = useState(
    new Date(Date.now() + 6 * 3600000).toISOString().slice(0, 16)
  );
  const [pickupDeadline, setPickupDeadline] = useState(
    new Date(Date.now() + 4 * 3600000).toISOString().slice(0, 16)
  );
  const [storageConditions, setStorageConditions] = useState<StorageCondition>('Hot Hold (≥60°C)');
  const [pickupInstructions, setPickupInstructions] = useState(
    'Collect from Receiving Bay 2. Bring clean insulated carrier bags.'
  );
  const [imageUrl, setImageUrl] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Hotel listings only
  const hotelListings = listings.filter((l) => l.hotelId === currentUser?.uid);

  const resetForm = () => {
    setFoodName('');
    setCategory('Prepared Meals');
    setIsVegetarian(true);
    setAvailableQuantity(50);
    setNumberOfPackets(50);
    setPickupInstructions('Collect from Receiving Bay 2. Bring clean insulated carrier bags.');
    setImageUrl('');
    setFormError(null);
  };

  const handleSaveOrPublish = async (status: 'Draft' | 'Published') => {
    setFormError(null);
    setFormSuccess(null);

    if (!foodName.trim() || numberOfPackets <= 0) {
      setFormError('Please enter a valid food name and packet quantity.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingItem) {
        // Update existing listing
        await updateFoodListing(editingItem.id, {
          foodName: foodName.trim(),
          category,
          isVegetarian,
          availableQuantity: Number(availableQuantity),
          numberOfPackets: Number(numberOfPackets),
          unit,
          preparationTime: new Date(preparationTime).toISOString(),
          safeUseDeadline: new Date(safeUseDeadline).toISOString(),
          pickupDeadline: new Date(pickupDeadline).toISOString(),
          storageConditions,
          pickupInstructions: pickupInstructions.trim(),
          imageUrl: imageUrl.trim() || undefined,
          status,
        });
        setFormSuccess(`Food listing ${editingItem.id} updated successfully!`);
        setEditingItem(null);
      } else {
        // Create new listing
        const newId = await addFoodListing({
          hotelId: currentUser?.uid || 'hotel-grand-palace',
          hotelName: currentUser?.organizationName || 'Grand Palace Hotel',
          hotelPhone: currentUser?.phone,
          foodName: foodName.trim(),
          category,
          isVegetarian,
          availableQuantity: Number(availableQuantity),
          numberOfPackets: Number(numberOfPackets),
          unit,
          preparationTime: new Date(preparationTime).toISOString(),
          safeUseDeadline: new Date(safeUseDeadline).toISOString(),
          pickupDeadline: new Date(pickupDeadline).toISOString(),
          storageConditions,
          pickupInstructions: pickupInstructions.trim(),
          imageUrl: imageUrl.trim() || undefined,
          status,
          address: currentUser?.fullAddress || 'Registered Address',
          city: currentUser?.districtCity || 'Mumbai',
          state: currentUser?.state || 'Maharashtra',
          postalCode: currentUser?.postalCode || '400020',
          lat: currentUser?.lat || 18.9322,
          lng: currentUser?.lng || 72.8264,
        });
        setFormSuccess(`Listing published as ${newId} and broadcast to nearby trusts!`);
        resetForm();
      }
      setActiveTab('available');
    } catch (err: any) {
      setFormError(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (item: FoodListingItem) => {
    setEditingItem(item);
    setFoodName(item.foodName);
    setCategory(item.category);
    setIsVegetarian(item.isVegetarian);
    setAvailableQuantity(item.availableQuantity);
    setNumberOfPackets(item.numberOfPackets);
    setUnit(item.unit);
    setPreparationTime(new Date(item.preparationTime).toISOString().slice(0, 16));
    setSafeUseDeadline(new Date(item.safeUseDeadline).toISOString().slice(0, 16));
    setPickupDeadline(new Date(item.pickupDeadline).toISOString().slice(0, 16));
    setStorageConditions(item.storageConditions);
    setPickupInstructions(item.pickupInstructions);
    setImageUrl(item.imageUrl || '');
    setActiveTab('add');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header and Submenu Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Food Management Module
              </span>
              <span className="text-xs text-slate-400">· Certified Donor Facility</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Surplus Food Publishing &amp; Inventory
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Publish excess banquet food with strict safe-use deadlines, track reserved packets, and manage availability.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              resetForm();
              setActiveTab('add');
            }}
            className="h-10 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Add Surplus Food</span>
          </button>
        </div>

        {/* Submenu Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setActiveTab('available')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'available'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Available Food Listings ({hotelListings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('add')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'add'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {editingItem ? 'Edit Listing' : '+ Add Surplus Food'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('update')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'update'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Update Food Quantity
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('availability')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'availability'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Food Availability Status
          </button>
        </div>
      </div>

      {formSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{formSuccess}</span>
          </div>
          <button
            type="button"
            onClick={() => setFormSuccess(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* VIEW 1: ADD / EDIT SURPLUS FOOD FORM */}
      {activeTab === 'add' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {editingItem ? `Editing: ${editingItem.foodName} (${editingItem.id})` : 'Register New Surplus Food Batch'}
              </h2>
              <span className="text-xs text-slate-500">
                Specify food category, verified preparation time, and storage constraints.
              </span>
            </div>
            {editingItem && (
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  resetForm();
                }}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel Editing</span>
              </button>
            )}
          </div>

          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* 1. Food Name */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Food Name *</label>
              <input
                type="text"
                required
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="e.g. Steamed Rice & Paneer Butter Masala Packs"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-xs"
              />
            </div>

            {/* 2. Food Category */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Food Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FoodCategory)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white font-medium text-xs"
              >
                <option value="Prepared Meals">Prepared Meals</option>
                <option value="Bakery & Bread">Bakery &amp; Bread</option>
                <option value="Fresh Produce">Fresh Produce</option>
                <option value="Dairy & Eggs">Dairy &amp; Eggs</option>
                <option value="Packaged & Dry Goods">Packaged &amp; Dry Goods</option>
                <option value="Cooked Catering">Cooked Catering</option>
              </select>
            </div>

            {/* 3. Vegetarian / Non-Vegetarian */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Dietary Classification *</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsVegetarian(true)}
                  className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    isVegetarian
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500'
                      : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                  <span>Vegetarian</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsVegetarian(false)}
                  className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    !isVegetarian
                      ? 'border-rose-600 bg-rose-50 text-rose-800 ring-1 ring-rose-500'
                      : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
                  <span>Non-Veg</span>
                </button>
              </div>
            </div>

            {/* 4. Quantity & Number of Packets */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Total Packets / Portions *</label>
              <input
                type="number"
                min="1"
                required
                value={numberOfPackets}
                onChange={(e) => {
                  setNumberOfPackets(Number(e.target.value));
                  setAvailableQuantity(Number(e.target.value));
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-xs font-bold"
              />
            </div>

            {/* Unit */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Measurement Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as FoodUnit)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-xs"
              >
                <option value="packets">packets / portions</option>
                <option value="kg">kg (bulk catering)</option>
                <option value="trays">catering trays</option>
                <option value="liters">liters</option>
              </select>
            </div>

            {/* 5. Storage Conditions */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Storage Condition *</label>
              <select
                value={storageConditions}
                onChange={(e) => setStorageConditions(e.target.value as StorageCondition)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-xs font-medium"
              >
                <option value="Hot Hold (≥60°C)">Hot Hold (≥60°C)</option>
                <option value="Refrigerated (2-4°C)">Refrigerated (2-4°C)</option>
                <option value="Frozen (≤-18°C)">Frozen (≤-18°C)</option>
                <option value="Ambient">Ambient / Dry Shelf</option>
              </select>
            </div>

            {/* 6. Preparation Time */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Preparation Time *</label>
              <input
                type="datetime-local"
                value={preparationTime}
                onChange={(e) => setPreparationTime(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            {/* 7. Verified Safe-Use Deadline */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Verified Safe-Use Deadline *</label>
              <input
                type="datetime-local"
                value={safeUseDeadline}
                onChange={(e) => setSafeUseDeadline(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-amber-900 bg-amber-50/50"
              />
            </div>

            {/* 8. Pickup Deadline */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pickup Deadline *</label>
              <input
                type="datetime-local"
                value={pickupDeadline}
                onChange={(e) => setPickupDeadline(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              />
            </div>

            {/* 9. Pickup Instructions */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Pickup Instructions *</label>
              <textarea
                rows={2}
                value={pickupInstructions}
                onChange={(e) => setPickupInstructions(e.target.value)}
                placeholder="Gate number, receiving dock, carrier requirements"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs resize-none"
              />
            </div>

            {/* 10. Optional Image URL */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Food Image URL (Optional)</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Action Buttons: Save Draft, Publish Food */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSaveOrPublish('Draft')}
              className="h-10 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Save className="w-4 h-4 text-slate-500" />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSaveOrPublish('Published')}
              className="h-10 px-5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{editingItem ? 'Update Listing' : 'Publish Food Listing'}</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2: AVAILABLE FOOD LISTINGS CARDS */}
      {(activeTab === 'available' || activeTab === 'update' || activeTab === 'availability') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
              {activeTab === 'update' ? 'Quick Quantity Adjustments' : 'Active Food Listings'}
            </h2>
            <span className="text-xs text-slate-500">
              Showing {hotelListings.length} registered batches
            </span>
          </div>

          {hotelListings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <Package className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">No food listings registered yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Click "+ Add Surplus Food" to publish your first excess meal batch for nearby community trusts.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hotelListings.map((item) => {
                const safeHoursLeft = (
                  (new Date(item.safeUseDeadline).getTime() - Date.now()) /
                  (1000 * 3600)
                ).toFixed(1);

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      {/* Top Bar: Category & Status */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                          {item.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.status === 'Published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'Partially Reserved'
                              ? 'bg-blue-100 text-blue-800'
                              : item.status === 'Fully Reserved'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      {/* Food Name & Tags */}
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                          {item.foodName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-semibold border border-emerald-200/70">
                            {item.category}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                              item.isVegetarian
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {item.isVegetarian ? 'Vegetarian' : 'Non-Veg'}
                          </span>
                        </div>
                      </div>

                      {/* Metric Grid */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                        <div className="bg-slate-50 p-2 rounded-lg">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Remaining</span>
                          <span className="font-extrabold text-slate-900 text-xs">
                            {item.remainingPackets} / {item.numberOfPackets} {item.unit}
                          </span>
                        </div>

                        <div className="bg-slate-50 p-2 rounded-lg">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Requests</span>
                          <span className="font-extrabold text-emerald-800 text-xs">
                            {item.requestCount} trusts
                          </span>
                        </div>
                      </div>

                      {/* Safe Use & Storage */}
                      <div className="text-[11px] text-slate-500 space-y-1 pt-1">
                        <div className="flex items-center gap-1 text-slate-700">
                          <Thermometer className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Storage: <strong>{item.storageConditions}</strong></span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-700 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Safe-use: {safeHoursLeft}h remaining</span>
                        </div>
                      </div>
                    </div>

                    {/* Functional Buttons (Save Draft, Publish Food, Update Listing, Mark Unavailable, View Requests) */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="flex-1 h-8 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
                        title="Update Listing"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Update</span>
                      </button>

                      {item.status !== 'Unavailable' ? (
                        <button
                          type="button"
                          onClick={() => markListingUnavailable(item.id)}
                          className="h-8 px-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-medium text-[11px] rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
                          title="Mark Unavailable"
                        >
                          <Ban className="w-3 h-3" />
                          <span>Halt</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => publishListing(item.id)}
                          className="h-8 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium text-[11px] rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
                          title="Publish Food"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Publish</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedListingId(item.id);
                          setHotelSection('requests-pending');
                        }}
                        className="h-8 px-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-[11px] rounded-lg transition flex items-center justify-center gap-1 cursor-pointer shrink-0"
                        title="View Requests for this Listing"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Requests</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
