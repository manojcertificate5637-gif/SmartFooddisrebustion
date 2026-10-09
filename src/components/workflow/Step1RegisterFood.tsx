import React, { useState } from 'react';
import {
  ShieldAlert,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Save,
  Send,
  X,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FoodCategory, FoodUnit, StorageCondition, VehicleType } from '../../types';
import { fetchAIFoodInsight } from '../../services/aiService';

export const Step1RegisterFood: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { addFoodListing, foodListings } = useApp();

  // Nested Sub-section state
  const [activeSection, setActiveSection] = useState<'A' | 'B' | 'C' | 'D'>('A');

  // Form Fields
  // Section A: Food Details
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('Prepared Meals');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState<number>(50);
  const [unit, setUnit] = useState<FoodUnit>('meal packs');
  const [mealPacksCount, setMealPacksCount] = useState<number>(50);
  const [preparationTime, setPreparationTime] = useState(
    new Date(Date.now() - 60 * 60000).toISOString().slice(0, 16)
  );
  const [providerName, setProviderName] = useState('Central Community Kitchen');
  const [contactPerson, setContactPerson] = useState('David Miller');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [providerAddress, setProviderAddress] = useState('100 Main St, Suite 200');
  const [providerZone, setProviderZone] = useState('Central Zone');

  // Section B: Food Safety
  const [isVerified, setIsVerified] = useState(true);
  const [safeUseDeadlineHours, setSafeUseDeadlineHours] = useState<number>(6); // hours from now
  const [storageCondition, setStorageCondition] = useState<StorageCondition>('Refrigerated (2-4°C)');
  const [recordedTemperature, setRecordedTemperature] = useState<number>(3.5);
  const [handlingInstructions, setHandlingInstructions] = useState(
    'Keep refrigerated at 2-4°C. Insulated thermal transport mandatory.'
  );
  const [verifierName, setVerifierName] = useState('Inspector Dr. Sarah Lin (FS-88)');
  const [verificationNotes, setVerificationNotes] = useState(
    'Batch visually inspected. Internal temperature probe verified. Packaging sealed.'
  );

  // Section C: Pickup Information
  const [pickupAddress, setPickupAddress] = useState('100 Main St, Bay 2 Receiving');
  const [availabilityWindow, setAvailabilityWindow] = useState('Today 11:00 - 14:00');
  const [loadingTimeMinutes, setLoadingTimeMinutes] = useState<number>(15);
  const [collectionNotes, setCollectionNotes] = useState('Call 15 min prior to dock arrival.');

  // Section D: Transport Requirements
  const [requiredVehicleType, setRequiredVehicleType] = useState<VehicleType>('Refrigerated Van');
  const [temperatureControlled, setTemperatureControlled] = useState(true);
  const [cargoHandling, setCargoHandling] = useState('Level stack containers, maximum 4 crates high.');
  const [readinessStatus, setReadinessStatus] = useState<'Ready Now' | 'Ready in 30m' | 'Staged for Pickup'>('Ready Now');

  // AI Guidance state
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRunAiInsight = async () => {
    if (!foodName) {
      setValidationErrors(['Please enter a food name before requesting safety insight.']);
      return;
    }
    setAiLoading(true);
    const deadlineStr = new Date(Date.now() + safeUseDeadlineHours * 3600000).toISOString();
    const res = await fetchAIFoodInsight({
      name: foodName,
      category,
      quantity,
      unit,
      storageCondition,
      safeUseDeadline: deadlineStr,
    });
    setAiInsight(res.insight);
    setAiLoading(false);
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];
    if (!foodName.trim()) errors.push('Food item name is required.');
    if (quantity <= 0) errors.push('Quantity must be greater than 0.');
    if (!providerName.trim()) errors.push('Food provider name is required.');
    if (!pickupAddress.trim()) errors.push('Pickup address is required.');
    if (safeUseDeadlineHours <= 0) errors.push('Safe-use deadline hours must be greater than 0.');

    if (storageCondition === 'Refrigerated (2-4°C)' && !temperatureControlled) {
      errors.push('Refrigerated storage requires temperature-controlled transport to prevent cold-chain breach.');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const safeUseDeadline = new Date(Date.now() + safeUseDeadlineHours * 3600000).toISOString();

    const newListing = addFoodListing({
      name: foodName,
      category,
      description: description || `${quantity} ${unit} of ${foodName}`,
      quantity: Number(quantity),
      unit,
      mealPacksCount: unit === 'meal packs' ? Number(quantity) : undefined,
      preparationTime: new Date(preparationTime).toISOString(),
      provider: {
        name: providerName,
        contactPerson,
        phone,
        address: providerAddress,
        zone: providerZone,
      },
      safety: {
        status: isVerified ? 'Verified' : 'Verification Required',
        verifiedSafeUseDeadline: safeUseDeadline,
        storageCondition,
        recordedTemperature: storageCondition.includes('Refrigerated') ? Number(recordedTemperature) : undefined,
        handlingInstructions,
        verifierName: isVerified ? verifierName : 'Pending Verification',
        verificationNotes: isVerified ? verificationNotes : 'Self-declared; pending certified safety signoff.',
        verifiedAt: isVerified ? new Date().toISOString() : undefined,
      },
      pickup: {
        address: pickupAddress,
        availabilityWindow,
        loadingTimeMinutes: Number(loadingTimeMinutes),
        collectionNotes,
      },
      transportReq: {
        requiredVehicleType,
        temperatureControlled,
        cargoHandling,
        readinessStatus,
      },
    });

    setSuccessMessage(`Listing ${newListing.id} successfully published to active inventory.`);
    setTimeout(() => {
      onComplete();
    }, 1200);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-6">
      {/* Step Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Step 1 of 8 · Supply Intake
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Register Surplus Food Batch
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Input surplus food specifications, safe-use consumption limits, cold-chain criteria, and dock pickup windows.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            Total Active Listings: <span className="font-bold text-slate-800">{foodListings.length}</span>
          </div>
        </div>
      </div>

      {/* Nested Section Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveSection('A')}
          className={`pb-2.5 px-3 border-b-2 whitespace-nowrap transition ${
            activeSection === 'A'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Section A: Food Details
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('B')}
          className={`pb-2.5 px-3 border-b-2 whitespace-nowrap transition ${
            activeSection === 'B'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Section B: Food Safety Information
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('C')}
          className={`pb-2.5 px-3 border-b-2 whitespace-nowrap transition ${
            activeSection === 'C'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Section C: Pickup Information
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('D')}
          className={`pb-2.5 px-3 border-b-2 whitespace-nowrap transition ${
            activeSection === 'D'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Section D: Transport Requirements
        </button>
      </div>

      {/* Validation Banner */}
      {validationErrors.length > 0 && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800 space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Registration Validation Required:</span>
          </div>
          <ul className="list-disc pl-5 space-y-0.5">
            {validationErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handlePublish} className="space-y-6">
        {/* SECTION A: FOOD DETAILS */}
        {activeSection === 'A' && (
          <div className="space-y-4">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider pb-1 border-b border-slate-100">
              Food Identification &amp; Quantity
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Food Item Name *
                </label>
                <input
                  type="text"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g. Chilled Chicken & Quinoa Bowls"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Food Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FoodCategory)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
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
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => {
                    const q = Number(e.target.value);
                    setQuantity(q);
                    if (unit === 'meal packs') setMealPacksCount(q);
                  }}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Unit of Measurement * (Never mix units)
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as FoodUnit)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option value="meal packs">meal packs (individual servings)</option>
                  <option value="kg">kg (weight)</option>
                  <option value="crates">crates</option>
                  <option value="liters">liters (dairy/liquid)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Preparation Date &amp; Time
                </label>
                <input
                  type="datetime-local"
                  value={preparationTime}
                  onChange={(e) => setPreparationTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Food Provider Organization *
                </label>
                <input
                  type="text"
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Item Description &amp; Allergen Declarations
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nutritional composition, dietary labels (Halal, Kosher, Nut-free, Vegan), packaging details..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={handleRunAiInsight}
                disabled={aiLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>{aiLoading ? 'Analyzing...' : 'AI Safety & Handling Guidance'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('B')}
                className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Continue to Safety Information &rarr;
              </button>
            </div>

            {aiInsight && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 space-y-1">
                <span className="font-semibold block">AI Operational Advisory:</span>
                <p className="leading-relaxed">{aiInsight}</p>
              </div>
            )}
          </div>
        )}

        {/* SECTION B: FOOD SAFETY INFORMATION */}
        {activeSection === 'B' && (
          <div className="space-y-4">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider pb-1 border-b border-slate-100">
              Food Safety &amp; Preservation Constraints
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Safety Inspection Status *
                </label>
                <select
                  value={isVerified ? 'Verified' : 'Verification Required'}
                  onChange={(e) => setIsVerified(e.target.value === 'Verified')}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white font-medium"
                >
                  <option value="Verified">Verified (Certified Safe for Allocation)</option>
                  <option value="Verification Required">Verification Required (Excluded from Approval until Checked)</option>
                </select>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Unverified food cannot be approved in the smart allocation workflow.
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Safe-Use Consumption Deadline (Hours Remaining) *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="168"
                    value={safeUseDeadlineHours}
                    onChange={(e) => setSafeUseDeadlineHours(Number(e.target.value))}
                    className="w-28 px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                  <span className="text-xs text-slate-600">
                    hours from now ({new Date(Date.now() + safeUseDeadlineHours * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Must allow travel time + 45 min buffer.
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Required Storage Facility Condition *
                </label>
                <select
                  value={storageCondition}
                  onChange={(e) => setStorageCondition(e.target.value as StorageCondition)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white font-medium"
                >
                  <option value="Refrigerated (2-4°C)">Refrigerated (2-4°C)</option>
                  <option value="Ambient">Ambient (Dry shelf-stable)</option>
                  <option value="Frozen (≤-18°C)">Frozen (≤-18°C)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Recorded Storage Temperature (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={recordedTemperature}
                  onChange={(e) => setRecordedTemperature(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Certified Verifier Name / Title
                </label>
                <input
                  type="text"
                  value={verifierName}
                  onChange={(e) => setVerifierName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Inspector Verification Notes
                </label>
                <input
                  type="text"
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setActiveSection('A')}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                &larr; Back to Food Details
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('C')}
                className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Continue to Pickup Info &rarr;
              </button>
            </div>
          </div>
        )}

        {/* SECTION C: PICKUP INFORMATION */}
        {activeSection === 'C' && (
          <div className="space-y-4">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider pb-1 border-b border-slate-100">
              Pickup Logistics &amp; Contact
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Pickup Physical Address *
                </label>
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Pickup Availability Window *
                </label>
                <input
                  type="text"
                  value={availabilityWindow}
                  onChange={(e) => setAvailabilityWindow(e.target.value)}
                  placeholder="e.g. Today 11:00 - 14:00"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Estimated Loading Time (Minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={loadingTimeMinutes}
                  onChange={(e) => setLoadingTimeMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Provider Contact Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Collection Bay / Dock Access Notes
              </label>
              <textarea
                rows={2}
                value={collectionNotes}
                onChange={(e) => setCollectionNotes(e.target.value)}
                placeholder="Gate codes, dock heights, ramp access, security escort instructions..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setActiveSection('B')}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                &larr; Back to Safety
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('D')}
                className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Continue to Transport Requirements &rarr;
              </button>
            </div>
          </div>
        )}

        {/* SECTION D: TRANSPORT REQUIREMENTS */}
        {activeSection === 'D' && (
          <div className="space-y-4">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider pb-1 border-b border-slate-100">
              Transport Fleet Compatibility
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Required Vehicle Resource Type *
                </label>
                <select
                  value={requiredVehicleType}
                  onChange={(e) => setRequiredVehicleType(e.target.value as VehicleType)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white font-medium"
                >
                  <option value="Refrigerated Van">Refrigerated Van (Cold-chain required)</option>
                  <option value="Cargo Van">Cargo Van (Standard ambient)</option>
                  <option value="Heavy Box Truck">Heavy Box Truck (Bulk pallets &gt; 500kg)</option>
                  <option value="Electric Light Courier">Electric Light Courier (Fast &lt; 80kg)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Temperature-Controlled Transport Mandatory? *
                </label>
                <select
                  value={temperatureControlled ? 'true' : 'false'}
                  onChange={(e) => setTemperatureControlled(e.target.value === 'true')}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white font-medium"
                >
                  <option value="true">Yes - Cold chain mandatory (Continuous &lt; 4°C)</option>
                  <option value="false">No - Standard ambient transit suitable</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Staging / Readiness Status
                </label>
                <select
                  value={readinessStatus}
                  onChange={(e) => setReadinessStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option value="Ready Now">Ready Now (Staged at dock)</option>
                  <option value="Ready in 30m">Ready in 30m</option>
                  <option value="Staged for Pickup">Staged for Pickup</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Cargo Stacking &amp; Handling Constraint
                </label>
                <input
                  type="text"
                  value={cargoHandling}
                  onChange={(e) => setCargoHandling(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActiveSection('C')}
                className="px-3 py-2 text-xs text-slate-600 hover:text-slate-900"
              >
                &larr; Back to Pickup Info
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => validateForm()}
                  className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300"
                >
                  Validate Details
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Listing &amp; Update Inventory</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
