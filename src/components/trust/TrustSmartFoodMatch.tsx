import React, { useState } from 'react';
import {
  Sparkles,
  Filter,
  Search,
  Building2,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  Eye,
  X,
  Package,
  Layers,
} from 'lucide-react';
import { useFoodBridge } from '../../context/FoodBridgeContext';
import { FoodCategory, FoodListingItem } from '../../types/foodbridge';

// Haversine Distance helper
function calculateHaversineDistanceKm(
  lat1?: number,
  lon1?: number,
  lat2?: number,
  lon2?: number
): number | null {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return null;
  }
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const TrustSmartFoodMatch: React.FC = () => {
  const {
    currentUser,
    listings,
    users,
    createDonationRequest,
    setTrustSection,
    requirements,
  } = useFoodBridge();

  // Filters State
  const [locationQuery, setLocationQuery] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [minAvailableQuantity, setMinAvailableQuantity] = useState<number>(0);
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(25);
  const [foodSafetyFilter, setFoodSafetyFilter] = useState<'All' | 'Verified Only'>('Verified Only');
  const [vegetarianOnly, setVegetarianOnly] = useState(false);

  // Selected Listing for Request Modal
  const [requestModalListing, setRequestModalListing] = useState<FoodListingItem | null>(null);
  const [detailModalListing, setDetailModalListing] = useState<FoodListingItem | null>(null);

  // Request Form Fields
  const [requestedPackets, setRequestedPackets] = useState<number>(20);
  const [pickupDateTime, setPickupDateTime] = useState<string>(
    new Date(Date.now() + 2 * 3600000).toISOString().slice(0, 16)
  );
  const [recipientDetails, setRecipientDetails] = useState<string>(
    'Evening hot meal distribution for 40 resident elder shelter beneficiaries.'
  );
  const [specialInstructions, setSpecialInstructions] = useState<string>(
    'Our pickup van has clean insulated carriers.'
  );
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestSuccessMessage, setRequestSuccessMessage] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  const trustLat = currentUser?.lat || 19.0016;
  const trustLng = currentUser?.lng || 72.8422;

  // Compute Match Score and filter listings
  const processedListings = listings
    .filter((item) => {
      // Must be Published or Partially Reserved with available food
      if (item.status !== 'Published' && item.status !== 'Partially Reserved') return false;
      if (item.remainingPackets <= 0) return false;

      // Provider verification check: only show verified hotel providers
      const hotelUser = users.find((u) => u.uid === item.hotelId);
      if (foodSafetyFilter === 'Verified Only' && hotelUser && hotelUser.verificationStatus !== 'verified') {
        return false;
      }

      // Location / City filter
      if (locationQuery !== 'All' && !item.city.toLowerCase().includes(locationQuery.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Quantity filter
      if (item.remainingPackets < minAvailableQuantity) {
        return false;
      }

      // Vegetarian filter
      if (vegetarianOnly && !item.isVegetarian) {
        return false;
      }

      // Distance filter
      const distance = calculateHaversineDistanceKm(trustLat, trustLng, item.lat, item.lng);
      if (distance !== null && distance > maxDistanceKm) {
        return false;
      }

      return true;
    })
    .map((item) => {
      const distance = calculateHaversineDistanceKm(trustLat, trustLng, item.lat, item.lng) ?? 4.5;
      const hoursUntilSafeDeadline =
        (new Date(item.safeUseDeadline).getTime() - Date.now()) / (1000 * 3600);

      // Multi-factor Deterministic Compatibility Score (0 - 100)
      let score = 50;

      // Proximity score (+25 for close, penalty for far)
      if (distance < 5) score += 25;
      else if (distance < 12) score += 15;
      else if (distance > 20) score -= 15;

      // Safe use urgency buffer (+15 if healthy buffer > 3h)
      if (hoursUntilSafeDeadline > 3) score += 15;
      else if (hoursUntilSafeDeadline < 1.5) score -= 20;

      // Category match with trust active requirements (+15)
      const matchingReq = requirements.find(
        (r) => r.trustId === currentUser?.uid && r.category === item.category && r.status === 'Active'
      );
      if (matchingReq) score += 15;

      const finalScore = Math.max(10, Math.min(99, score));

      // Match Reason Generator
      let matchReason = `High Proximity (${distance} km transit) · ${Math.max(0, hoursUntilSafeDeadline).toFixed(1)}h safe buffer.`;
      if (matchingReq) {
        matchReason = `Direct Demand Match for ${item.category} · ${distance} km from facility.`;
      } else if (distance < 4) {
        matchReason = `Hyper-local Neighbor Hub (${distance} km) · Immediate pickup feasible.`;
      }

      return {
        ...item,
        calculatedDistanceKm: distance,
        hoursUntilSafeDeadline,
        matchScore: finalScore,
        matchReason,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  const handleOpenRequestModal = (item: FoodListingItem) => {
    setRequestModalListing(item);
    setRequestedPackets(Math.min(item.remainingPackets, 25));
    setRequestError(null);
    setRequestSuccessMessage(null);
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestModalListing) return;

    setRequestLoading(true);
    setRequestError(null);

    const res = await createDonationRequest(
      requestModalListing.id,
      Number(requestedPackets),
      pickupDateTime,
      recipientDetails,
      specialInstructions
    );

    setRequestLoading(false);

    if (res.success) {
      setRequestSuccessMessage(
        `Request #${res.requestId} submitted to ${requestModalListing.hotelName}! The hotel coordinator has been notified for approval.`
      );
    } else {
      setRequestError(res.error || 'Failed to submit request.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Context */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-700" />
              <span>Smart Food Match Engine</span>
            </span>
            <span className="text-xs text-slate-400">· Multi-Constraint Optimization</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Surplus Food Discovery &amp; Compatibility Ranking
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Surfacing verified commercial donations ranked by geographic proximity, dietary match, and safe-use deadline buffers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setTrustSection('requests-pending')}
          className="h-9 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0"
        >
          <HeartHandshake className="w-4 h-4 text-emerald-700" />
          <span>View My Active Requests</span>
        </button>
      </div>

      {/* 2-COLUMN LAYOUT: FILTERS ON LEFT, RECOMMENDED FOOD CARDS ON RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (4 cols): MATCHING FILTERS */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 uppercase tracking-tight">
              <Filter className="w-4 h-4 text-emerald-700" />
              <span>Matching Filters</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setLocationQuery('All');
                setSelectedCategory('All');
                setMinAvailableQuantity(0);
                setMaxDistanceKm(25);
                setVegetarianOnly(false);
              }}
              className="text-[11px] text-emerald-700 hover:underline font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Filter 1: Location */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Location / District</label>
              <select
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-xs font-medium"
              >
                <option value="All">All Locations &amp; Zones</option>
                <option value="Mumbai">Mumbai Metropolitan</option>
                <option value="Churchgate">Churchgate / Marine Lines</option>
                <option value="Bandra">Bandra / BKC</option>
                <option value="Kurla">Kurla / Central Zone</option>
              </select>
            </div>

            {/* Filter 2: Food Category */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Food Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-xs font-medium"
              >
                <option value="All">All Categories</option>
                <option value="Prepared Meals">Prepared Meals</option>
                <option value="Bakery & Bread">Bakery &amp; Bread</option>
                <option value="Fresh Produce">Fresh Produce</option>
                <option value="Dairy & Eggs">Dairy &amp; Eggs</option>
                <option value="Cooked Catering">Cooked Catering</option>
              </select>
            </div>

            {/* Filter 3: Minimum Available Packets */}
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Minimum Packets</span>
                <span className="font-mono text-emerald-800">{minAvailableQuantity} pkts</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={minAvailableQuantity}
                onChange={(e) => setMinAvailableQuantity(Number(e.target.value))}
                className="w-full accent-emerald-700"
              />
            </div>

            {/* Filter 4: Maximum Distance */}
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Maximum Transit Distance</span>
                <span className="font-mono text-emerald-800">{maxDistanceKm} km</span>
              </div>
              <input
                type="range"
                min="3"
                max="35"
                step="1"
                value={maxDistanceKm}
                onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
                className="w-full accent-emerald-700"
              />
            </div>

            {/* Filter 5: Food Safety Status */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Food Safety Status</label>
              <select
                value={foodSafetyFilter}
                onChange={(e) => setFoodSafetyFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-xs font-medium"
              >
                <option value="Verified Only">Verified Donors Only (Strict)</option>
                <option value="All">Include Pending Verifications</option>
              </select>
            </div>

            {/* Vegetarian Only Toggle */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Vegetarian Only</span>
              <button
                type="button"
                onClick={() => setVegetarianOnly(!vegetarianOnly)}
                className={`w-11 h-6 rounded-full transition cursor-pointer p-0.5 ${
                  vegetarianOnly ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    vegetarianOnly ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (8 cols): RECOMMENDED FOOD CARDS */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Recommended Surplus Food ({processedListings.length})</span>
            </h2>
            <span className="text-xs text-slate-500">
              Ranked by compatibility algorithm
            </span>
          </div>

          {processedListings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <Package className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">No surplus food listings match your criteria</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try expanding the maximum distance slider or resetting category filters to discover more food.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {processedListings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    {/* Header: Hotel Name & Compatibility Score */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1 truncate">
                          <Building2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>{item.hotelName}</span>
                        </span>
                        <h3 className="font-extrabold text-sm text-slate-900 mt-0.5 leading-snug">
                          {item.foodName}
                        </h3>
                      </div>

                      <div className="px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-center shrink-0">
                        <span className="text-[10px] text-emerald-700 uppercase font-bold block leading-none">
                          Fit Score
                        </span>
                        <span className="text-sm font-extrabold text-emerald-900 leading-tight">
                          {item.matchScore}%
                        </span>
                      </div>
                    </div>

                    {/* Tags: Packets, Category, Veg */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-extrabold rounded-md">
                        {item.remainingPackets} {item.unit} available
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded-md">
                        {item.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 font-semibold rounded-md ${
                          item.isVegetarian
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-rose-50 text-rose-800'
                        }`}
                      >
                        {item.isVegetarian ? 'Vegetarian' : 'Non-Veg'}
                      </span>
                    </div>

                    {/* Location & Distance */}
                    <div className="text-[11px] text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-1 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{item.address}, {item.city}</span>
                        <span className="font-mono text-emerald-800 font-bold shrink-0">
                          ({item.calculatedDistanceKm} km)
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-amber-800 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Safe-use deadline: {new Date(item.safeUseDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div className="text-[10px] text-emerald-800 bg-emerald-50/70 p-1.5 rounded-lg border border-emerald-200/60 leading-snug">
                        <strong>Match Reason:</strong> {item.matchReason}
                      </div>
                    </div>
                  </div>

                  {/* Functional Buttons: View Details & Request Food */}
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDetailModalListing(item)}
                      className="flex-1 h-9 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>View Details</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenRequestModal(item)}
                      className="flex-1 h-9 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>Request Food</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DEDICATED REQUEST FOOD MODAL */}
      {requestModalListing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150 text-xs">
            <button
              type="button"
              onClick={() => setRequestModalListing(null)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Official Donation Request Form
              </span>
            </div>

            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Request Food Donation
            </h2>
            <p className="text-slate-500 mt-0.5 mb-4">
              Allocate packets directly from {requestModalListing.hotelName}.
            </p>

            {requestSuccessMessage ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">Request Submitted Successfully</h3>
                  <p className="text-slate-600">{requestSuccessMessage}</p>
                </div>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRequestModalListing(null);
                      setTrustSection('requests-pending');
                    }}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition cursor-pointer"
                  >
                    View in Pending Requests
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendRequest} className="space-y-4">
                {requestError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{requestError}</span>
                  </div>
                )}

                {/* Selected Food & Hotel Overview Card */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Selected Food</span>
                      <div className="font-bold text-slate-900 text-sm">{requestModalListing.foodName}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold">
                      {requestModalListing.remainingPackets} {requestModalListing.unit} available
                    </span>
                  </div>

                  <div className="text-slate-500 flex justify-between text-[11px] pt-1">
                    <span>Hotel: <strong>{requestModalListing.hotelName}</strong></span>
                    <span>Safe-use until: <strong>{new Date(requestModalListing.safeUseDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></span>
                  </div>
                </div>

                {/* Requested Quantity */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Requested Packets *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max={requestModalListing.remainingPackets}
                      value={requestedPackets}
                      onChange={(e) => setRequestedPackets(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-sm text-emerald-900"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Max available: {requestModalListing.remainingPackets}
                    </span>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Pickup Target Time *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={pickupDateTime}
                      onChange={(e) => setPickupDateTime(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                {/* Recipient Details */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Beneficiary / Recipient Details *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={recipientDetails}
                    onChange={(e) => setRecipientDetails(e.target.value)}
                    placeholder="e.g. 35 children and resident staff at St. Jude Community Hall"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl resize-none"
                  />
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Special Pickup Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Volunteer vehicle arrives with insulated containers"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRequestModalListing(null)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={requestLoading}
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold rounded-xl transition cursor-pointer"
                  >
                    {requestLoading ? 'Submitting to Firestore...' : 'Submit Food Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {detailModalListing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative text-xs">
            <button
              type="button"
              onClick={() => setDetailModalListing(null)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-extrabold text-slate-900">{detailModalListing.foodName}</h3>
            <span className="text-[11px] text-emerald-700 font-semibold">{detailModalListing.hotelName}</span>

            <div className="my-4 space-y-2 text-slate-600">
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <strong>Storage:</strong> {detailModalListing.storageConditions}
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <strong>Pickup Instructions:</strong> {detailModalListing.pickupInstructions}
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <strong>Address:</strong> {detailModalListing.address}, {detailModalListing.city}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const item = detailModalListing;
                setDetailModalListing(null);
                handleOpenRequestModal(item);
              }}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl cursor-pointer"
            >
              Proceed to Request This Food
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
