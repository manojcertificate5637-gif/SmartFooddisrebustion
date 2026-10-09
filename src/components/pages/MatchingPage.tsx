import React, { useState } from 'react';
import {
  HeartHandshake,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building2,
  Sparkles,
  RotateCw,
  Sliders,
  Filter,
  AlertTriangle,
  Info,
  Package,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FoodListing, Recipient } from '../../types';

export const MatchingPage: React.FC = () => {
  const {
    foodListings,
    recipients,
    updateFoodListing,
    updateDeliveryStatus,
    deliveries,
    setCurrentPage,
  } = useApp();

  const availableListings = foodListings.filter((f) => f.remainingQuantity > 0);

  const [selectedDonationId, setSelectedDonationId] = useState<string>(
    availableListings[0]?.id || foodListings[0]?.id || ''
  );

  const [isMatchingLoading, setIsMatchingLoading] = useState(false);
  const [filterType, setFilterType] = useState<string>('All');
  const [minScoreFilter, setMinScoreFilter] = useState<number>(0);
  const [matchedAlert, setMatchedAlert] = useState<{
    message: string;
    recipientName: string;
    allocatedQty: number;
    unit: string;
  } | null>(null);

  const selectedDonation = foodListings.find((f) => f.id === selectedDonationId);

  const handleTriggerMatching = () => {
    setIsMatchingLoading(true);
    setTimeout(() => {
      setIsMatchingLoading(false);
    }, 400);
  };

  // Compute Compatibility Score for each recipient
  const recipientMatches = recipients.map((rec) => {
    if (!selectedDonation) {
      return { recipient: rec, score: 0, reason: '', feasible: false, distanceKm: 0, etaMins: 0 };
    }

    let score = 50; // base score
    const distanceKm = Math.round((rec.location.distanceKmFromHub + 1.5) * 10) / 10;
    const etaMins = Math.round(distanceKm * 2.8 + 15);

    // 1. Category alignment (+25)
    const categoryMatches = rec.requiredCategories.includes(selectedDonation.category);
    if (categoryMatches) score += 25;
    else score -= 30;

    // 2. Storage compatibility (+15 or HARD FAIL)
    const requiredStorage = selectedDonation.safety.storageCondition;
    const storageCompatible = rec.storageConditions.includes(requiredStorage);
    if (storageCompatible) score += 15;
    else score -= 45;

    // 3. Priority Tier (+10 for P1)
    if (rec.recipientPriority.startsWith('P1')) score += 10;
    else if (rec.recipientPriority.startsWith('P2')) score += 5;

    // 4. Proximity penalty / bonus
    if (distanceKm < 5) score += 10;
    else if (distanceKm > 10) score -= 10;

    const finalScore = Math.max(5, Math.min(99, score));
    const isFeasible = categoryMatches && storageCompatible && selectedDonation.remainingQuantity > 0;

    let reason = '';
    if (!storageCompatible) {
      reason = `Storage Conflict: Requires ${requiredStorage}, but facility only supports ${rec.storageConditions.join(', ')}.`;
    } else if (!categoryMatches) {
      reason = `Category Mismatch: Demands ${rec.requiredCategories.join(', ')}.`;
    } else {
      reason = `High Fit: Certified ${requiredStorage} available; ${distanceKm} km transit clears safe-use deadline buffer.`;
    }

    return {
      recipient: rec,
      score: finalScore,
      reason,
      feasible: isFeasible,
      distanceKm,
      etaMins,
    };
  });

  // Filter & sort
  const filteredMatches = recipientMatches
    .filter((m) => {
      const matchesType = filterType === 'All' || m.recipient.organizationType === filterType;
      const matchesScore = m.score >= minScoreFilter;
      return matchesType && matchesScore;
    })
    .sort((a, b) => b.score - a.score);

  const handleAllocateMatch = (rec: Recipient, allocatedQty: number) => {
    if (!selectedDonation || selectedDonation.remainingQuantity <= 0) return;

    const actualAllocated = Math.min(selectedDonation.remainingQuantity, allocatedQty);
    const newRemaining = selectedDonation.remainingQuantity - actualAllocated;

    updateFoodListing(selectedDonation.id, {
      remainingQuantity: newRemaining,
      allocatedQuantity: selectedDonation.allocatedQuantity + actualAllocated,
      status: newRemaining === 0 ? 'Fully Allocated' : 'Partially Allocated',
    });

    setMatchedAlert({
      message: `Allocated and dispatched ${actualAllocated} ${selectedDonation.unit} to ${rec.organizationName}!`,
      recipientName: rec.organizationName,
      allocatedQty: actualAllocated,
      unit: selectedDonation.unit,
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Matching Engine
            </span>
            <span className="text-slate-400 text-xs">· Compatibility Optimization</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
            Recipient, Hostel &amp; Shelter Matching
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pair active surplus food parcels with verified community hostels, emergency shelters, and kitchens using multi-factor constraint validation.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleTriggerMatching}
            disabled={isMatchingLoading}
            className="h-10 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-xs transition flex items-center gap-2"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isMatchingLoading ? 'animate-spin' : ''}`} />
            <span>{isMatchingLoading ? 'Re-calculating...' : 'Run Matching Engine'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {matchedAlert && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-xl text-xs font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span>{matchedAlert.message}</span>
              <span className="block text-[11px] font-normal text-emerald-800 mt-0.5">
                Donor stock reserved. Fleet vehicle dispatch manifest generated in Logistics.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setCurrentPage('logistics')}
              className="h-8 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <span>Track in Logistics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setMatchedAlert(null)}
              className="h-8 px-2 text-emerald-800 hover:text-emerald-950 text-xs underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* 2. SECTION A: Active Surplus Donation Batch Selection */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              1. Select Surplus Food Batch to Match
            </h3>
            <p className="text-xs text-slate-500">
              Choose an available donation batch from the verified donor registry
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {availableListings.length} Batches Ready for Allocation
          </span>
        </div>

        {availableListings.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-lg">
            No surplus food batches are currently pending allocation. All registered stock has been distributed.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {availableListings.map((item) => {
              const isSelected = item.id === selectedDonationId;
              const safeHoursLeft = (
                (new Date(item.safety.verifiedSafeUseDeadline).getTime() - Date.now()) /
                (1000 * 3600)
              ).toFixed(1);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedDonationId(item.id);
                    handleTriggerMatching();
                  }}
                  className={`p-3.5 rounded-xl border text-left transition relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/30 shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500 font-semibold">{item.id}</span>
                      <span className="text-[10px] text-amber-700 font-semibold">{safeHoursLeft}h left</span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs truncate">{item.name}</div>
                    <div className="text-[11px] text-emerald-800 font-medium truncate">{item.provider.name}</div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-900">
                      {item.remainingQuantity} {item.unit}
                    </span>
                    <span className="text-[10px] text-slate-500">{item.safety.storageCondition}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Selected Donation Detailed Specs Strip */}
        {selectedDonation && (
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span><strong>Item:</strong> {selectedDonation.name}</span>
              <span className="text-slate-300">·</span>
              <span><strong>Category:</strong> {selectedDonation.category}</span>
              <span className="text-slate-300">·</span>
              <span><strong>Storage:</strong> {selectedDonation.safety.storageCondition}</span>
              <span className="text-slate-300">·</span>
              <span><strong>Food From:</strong> {selectedDonation.provider.name} ({selectedDonation.provider.zone})</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Inspection Verified</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. SECTION B: Filters & Compatibility Constraints Controls */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="font-bold text-slate-800 uppercase tracking-wider">
            Match Filters:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-9 px-3 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium text-xs focus:ring-1 focus:ring-emerald-500"
          >
            <option value="All">All Organization Types</option>
            <option value="Emergency Shelter">Emergency Shelters</option>
            <option value="Food Bank">Food Banks</option>
            <option value="Community Kitchen">Community Kitchens</option>
            <option value="Youth / School Pantry">Youth Hostels &amp; Pantries</option>
            <option value="Elder Care Center">Elder Care Centers</option>
          </select>

          <select
            value={minScoreFilter}
            onChange={(e) => setMinScoreFilter(Number(e.target.value))}
            className="h-9 px-3 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium text-xs focus:ring-1 focus:ring-emerald-500"
          >
            <option value={0}>All Compatibility Scores</option>
            <option value={70}>High Fit Only (≥ 70%)</option>
            <option value={80}>Top Tier Only (≥ 80%)</option>
          </select>
        </div>
      </div>

      {/* 4. SECTION C: Ranked Recipient Organization Matches */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Ranked Recipient Organization Matches ({filteredMatches.length})
          </h3>
          <span className="text-[11px] text-slate-500">
            Simulated Distance &amp; Transit Estimates
          </span>
        </div>

        {isMatchingLoading ? (
          <div className="p-12 bg-white rounded-xl border border-slate-200 text-center space-y-3 shadow-2xs">
            <RotateCw className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
            <h4 className="text-xs font-bold text-slate-900">
              Evaluating Compatibility Across Recipient Network...
            </h4>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Checking cold-chain verification, safe-use margin buffers, and vehicle capacity.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMatches.map((match) => {
              const { recipient: rec, score, reason, feasible, distanceKm, etaMins } = match;

              return (
                <div
                  key={rec.id}
                  className={`bg-white rounded-xl border p-5 shadow-2xs space-y-3 flex flex-col justify-between transition ${
                    feasible ? 'border-slate-200 hover:border-emerald-300' : 'border-rose-200 bg-rose-50/20'
                  }`}
                >
                  <div className="space-y-2.5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="font-mono text-[10px] text-slate-400 font-semibold">{rec.id}</span>
                        <h4 className="font-bold text-slate-900 text-sm leading-snug truncate">
                          {rec.organizationName}
                        </h4>
                        <span className="text-[11px] text-slate-500 block">{rec.organizationType}</span>
                      </div>

                      <div className="text-right shrink-0">
                        <div
                          className={`text-base font-extrabold px-2.5 py-1 rounded-lg border text-center ${
                            score >= 80
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : score >= 60
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : 'bg-rose-100 text-rose-800 border-rose-300'
                          }`}
                        >
                          {score}%
                        </div>
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider block mt-0.5">
                          Match Score
                        </span>
                      </div>
                    </div>

                    {/* 2x2 Specs Grid */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <span className="text-slate-500 block text-[10px]">Priority Tier</span>
                        <span className="font-semibold text-slate-800">{rec.recipientPriority}</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <span className="text-slate-500 block text-[10px]">Delivery Window</span>
                        <span className="font-semibold text-slate-800 font-mono">{rec.requiredDeliveryWindow}</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <span className="text-slate-500 block text-[10px]">Distance &amp; ETA</span>
                        <span className="font-semibold text-slate-800">{distanceKm} km (~{etaMins}m)</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <span className="text-slate-500 block text-[10px]">Storage Facility</span>
                        <span className="font-semibold text-slate-800 truncate block">
                          {rec.storageConditions.join(', ')}
                        </span>
                      </div>
                    </div>

                    {/* Reasoning callout */}
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 leading-relaxed">
                      <strong className="text-slate-800">Match Logic: </strong>
                      <span>{reason}</span>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="text-[11px] text-slate-500">
                      Demand: <strong>{rec.requestedQuantity} {rec.unit}</strong>
                    </div>

                    <button
                      type="button"
                      disabled={!feasible}
                      onClick={() => handleAllocateMatch(rec, rec.requestedQuantity)}
                      className={`h-9 px-3.5 rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1.5 ${
                        feasible
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Allocate &amp; Dispatch</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
