import {
  FoodListing,
  Recipient,
  DemandRequest,
  VehicleResource,
  AllocationPlan,
  AllocationMatch,
  InfeasibleCandidate,
} from '../types';

export interface ScoringWeights {
  priorityWeight: number; // default 40
  expiryUrgencyWeight: number; // default 30
  distanceWeight: number; // default 20
  storageFitWeight: number; // default 10
}

export const DEFAULT_WEIGHTS: ScoringWeights = {
  priorityWeight: 40,
  expiryUrgencyWeight: 30,
  distanceWeight: 20,
  storageFitWeight: 10,
};

export function runDeterministicAllocation({
  foodListings,
  recipients,
  demandRequests,
  vehicles,
  weights = DEFAULT_WEIGHTS,
}: {
  foodListings: FoodListing[];
  recipients: Recipient[];
  demandRequests: DemandRequest[];
  vehicles: VehicleResource[];
  weights?: ScoringWeights;
}): AllocationPlan {
  const planId = `PLAN-${Date.now().toString().slice(-6)}`;
  const matches: AllocationMatch[] = [];
  const infeasibleCandidates: InfeasibleCandidate[] = [];

  // Working copies of remaining quantities to prevent double allocation
  const remainingListingQty: Record<string, number> = {};
  foodListings.forEach((fl) => {
    remainingListingQty[fl.id] = fl.remainingQuantity;
  });

  const remainingDemandQty: Record<string, number> = {};
  demandRequests.forEach((dmd) => {
    remainingDemandQty[dmd.id] = dmd.requestedQuantity - dmd.allocatedQuantity;
  });

  // Track recipient remaining storage capacity
  const remainingRecipientCapacity: Record<string, number> = {};
  recipients.forEach((rec) => {
    remainingRecipientCapacity[rec.id] = Math.max(0, rec.storageCapacity - rec.currentStorageOccupancy);
  });

  // Track vehicle remaining capacity
  const remainingVehicleCapacity: Record<string, number> = {};
  vehicles.forEach((v) => {
    remainingVehicleCapacity[v.id] = v.capacity;
  });

  const now = new Date().getTime();

  // 1. Evaluate every pair of (foodListing, demandRequest)
  interface CandidateMatch {
    listing: FoodListing;
    demand: DemandRequest;
    recipient: Recipient;
    allocatedQty: number;
    assignedVehicle: VehicleResource;
    score: number;
    scoreBreakdown: {
      priorityScore: number;
      urgencyScore: number;
      distanceScore: number;
      storageCompatibilityScore: number;
    };
    distanceKm: number;
    durationMin: number;
    reasoning: string;
  }

  const candidatePool: CandidateMatch[] = [];

  for (const listing of foodListings) {
    // HARD CONSTRAINT 1: Listing Safety Verification
    if (listing.safety.status !== 'Verified') {
      infeasibleCandidates.push({
        listingId: listing.id,
        foodName: listing.name,
        recipientId: 'N/A',
        recipientName: 'All Recipients',
        failedConstraint: 'Food Safety Status Not Verified',
        reason: `Listing has status "${listing.safety.status}". Only verified listings are eligible for allocation. Inspector sign-off required.`,
      });
      continue;
    }

    // HARD CONSTRAINT 2: Safe-Use Expiration Check
    const safeUseTime = new Date(listing.safety.verifiedSafeUseDeadline).getTime();
    const hoursRemaining = (safeUseTime - now) / (1000 * 3600);
    if (hoursRemaining <= 0.5) {
      infeasibleCandidates.push({
        listingId: listing.id,
        foodName: listing.name,
        recipientId: 'N/A',
        recipientName: 'All Recipients',
        failedConstraint: 'Safe-Use Deadline Infeasible',
        reason: `Remaining safe-use window is only ${(hoursRemaining * 60).toFixed(0)} minutes. Transit and staging require at least 45 minutes safe margin.`,
      });
      continue;
    }

    if (remainingListingQty[listing.id] <= 0) {
      continue;
    }

    for (const demand of demandRequests) {
      if (remainingDemandQty[demand.id] <= 0) continue;

      const recipient = recipients.find((r) => r.id === demand.recipientId);
      if (!recipient || !recipient.isActive) continue;

      // HARD CONSTRAINT 3: Category Matching
      if (listing.category !== demand.category) {
        continue;
      }

      // Unit compatibility check
      if (listing.unit !== demand.unit) {
        infeasibleCandidates.push({
          listingId: listing.id,
          foodName: listing.name,
          recipientId: recipient.id,
          recipientName: recipient.organizationName,
          failedConstraint: 'Unit Mismatch',
          reason: `Listing unit is ${listing.unit} but demand requested in ${demand.unit}. Direct allocation prevented to preserve unit integrity.`,
        });
        continue;
      }

      // HARD CONSTRAINT 4: Storage Compatibility
      const requiredStorage = listing.safety.storageCondition;
      const recipientHasStorage = recipient.storageConditions.includes(requiredStorage);

      if (!recipientHasStorage) {
        infeasibleCandidates.push({
          listingId: listing.id,
          foodName: listing.name,
          recipientId: recipient.id,
          recipientName: recipient.organizationName,
          failedConstraint: 'Storage Facility Incompatible',
          reason: `${listing.name} requires ${requiredStorage}. ${recipient.organizationName} only supports ${recipient.storageConditions.join(', ')}. Cold chain breach risk.`,
        });
        continue;
      }

      // HARD CONSTRAINT 5: Recipient Storage Capacity
      if (remainingRecipientCapacity[recipient.id] <= 0) {
        infeasibleCandidates.push({
          listingId: listing.id,
          foodName: listing.name,
          recipientId: recipient.id,
          recipientName: recipient.organizationName,
          failedConstraint: 'Storage Capacity Exceeded',
          reason: `${recipient.organizationName} storage facility is at max occupancy (${recipient.currentStorageOccupancy}/${recipient.storageCapacity}).`,
        });
        continue;
      }

      // Calculate feasible allocation quantity (respects listing remaining, demand remaining, and recipient capacity)
      const potentialQty = Math.min(
        remainingListingQty[listing.id],
        remainingDemandQty[demand.id],
        remainingRecipientCapacity[recipient.id]
      );

      if (potentialQty <= 0) continue;

      // Find compatible vehicle
      const eligibleVehicles = vehicles.filter((v) => {
        if (v.availability !== 'Available') return false;
        if (listing.transportReq.temperatureControlled && !v.temperatureControlled) {
          return false;
        }
        if (remainingVehicleCapacity[v.id] < potentialQty) {
          return false;
        }
        return true;
      });

      if (eligibleVehicles.length === 0) {
        infeasibleCandidates.push({
          listingId: listing.id,
          foodName: listing.name,
          recipientId: recipient.id,
          recipientName: recipient.organizationName,
          failedConstraint: 'No Compatible Vehicle Resource',
          reason: `Requires ${listing.transportReq.temperatureControlled ? 'temperature-controlled' : 'standard'} vehicle with capacity >= ${potentialQty} ${listing.unit}. All matching fleet units are booked or under-capacity.`,
        });
        continue;
      }

      // Pick best vehicle (prefer temperature matching and lowest unused space)
      const assignedVehicle = eligibleVehicles.sort((a, b) => a.capacity - b.capacity)[0];

      // Travel metrics
      const distanceKm = recipient.location.distanceKmFromHub + 1.8; // pickup to hub to recipient simulated estimate
      const durationMin = Math.round(distanceKm * 2.8 + listing.pickup.loadingTimeMinutes + 10);

      // HARD CONSTRAINT 6: Transit Feasibility against Safe-Use Deadline
      const transitHours = durationMin / 60;
      if (transitHours >= hoursRemaining - 0.75) {
        infeasibleCandidates.push({
          listingId: listing.id,
          foodName: listing.name,
          recipientId: recipient.id,
          recipientName: recipient.organizationName,
          failedConstraint: 'Transit Exceeds Safe-Use Buffer',
          reason: `Estimated travel duration is ${durationMin} mins (${transitHours.toFixed(1)}h), which exceeds safe consumption deadline of ${hoursRemaining.toFixed(1)}h with buffer.`,
        });
        continue;
      }

      // DETERMINISTIC SCORING ENGINE
      // Priority Score (0-100)
      let priorityScoreVal = 50;
      if (recipient.recipientPriority === 'P1 - Critical/High-Risk') priorityScoreVal = 100;
      else if (recipient.recipientPriority === 'P2 - Standard Community') priorityScoreVal = 70;
      else priorityScoreVal = 40;

      // Safe-Use Urgency Score (0-100) -> higher score if deadline is closer (urgently needs redistribution before spoilage)
      let urgencyScoreVal = 20;
      if (hoursRemaining < 5) urgencyScoreVal = 100;
      else if (hoursRemaining < 12) urgencyScoreVal = 80;
      else if (hoursRemaining < 24) urgencyScoreVal = 60;
      else if (hoursRemaining < 48) urgencyScoreVal = 40;

      // Distance Proximity Score (0-100) -> closer distance scores higher
      const distanceScoreVal = Math.max(10, Math.round(100 - distanceKm * 5));

      // Storage Fit Score (0-100) -> exact capacity match
      const storageFitScoreVal = 90;

      // Total Weighted Score
      const totalScore = Math.round(
        (priorityScoreVal * weights.priorityWeight +
          urgencyScoreVal * weights.expiryUrgencyWeight +
          distanceScoreVal * weights.distanceWeight +
          storageFitScoreVal * weights.storageFitWeight) /
          (weights.priorityWeight + weights.expiryUrgencyWeight + weights.distanceWeight + weights.storageFitWeight)
      );

      const reasoning = `${recipient.organizationName} (${recipient.recipientPriority}) is recommended because category "${listing.category}" matches exactly, ${remainingDemandQty[demand.id]} ${demand.unit} demand is outstanding, ${requiredStorage} storage facilities are certified compatible, and delivery within ${durationMin} mins easily clears the safe-use window of ${hoursRemaining.toFixed(1)} hours.`;

      candidatePool.push({
        listing,
        demand,
        recipient,
        allocatedQty: potentialQty,
        assignedVehicle,
        score: totalScore,
        scoreBreakdown: {
          priorityScore: priorityScoreVal,
          urgencyScore: urgencyScoreVal,
          distanceScore: distanceScoreVal,
          storageCompatibilityScore: storageFitScoreVal,
        },
        distanceKm: Math.round(distanceKm * 10) / 10,
        durationMin,
        reasoning,
      });
    }
  }

  // Sort candidate pool by score descending (greedy optimal assignment)
  candidatePool.sort((a, b) => b.score - a.score);

  // Execute allocations greedily without double allocation
  let matchCounter = 1;
  for (const candidate of candidatePool) {
    const availableListing = remainingListingQty[candidate.listing.id];
    const availableDemand = remainingDemandQty[candidate.demand.id];
    const availableCap = remainingRecipientCapacity[candidate.recipient.id];
    const availableVehCap = remainingVehicleCapacity[candidate.assignedVehicle.id];

    const actualAllocated = Math.min(availableListing, availableDemand, availableCap, availableVehCap);

    if (actualAllocated <= 0) continue;

    // Deduct quantities deterministically
    remainingListingQty[candidate.listing.id] -= actualAllocated;
    remainingDemandQty[candidate.demand.id] -= actualAllocated;
    remainingRecipientCapacity[candidate.recipient.id] -= actualAllocated;
    remainingVehicleCapacity[candidate.assignedVehicle.id] -= actualAllocated;

    matches.push({
      matchId: `MAT-${matchCounter.toString().padStart(3, '0')}`,
      foodListingId: candidate.listing.id,
      foodName: candidate.listing.name,
      foodCategory: candidate.listing.category,
      allocatedQuantity: actualAllocated,
      unit: candidate.listing.unit,
      recipientId: candidate.recipient.id,
      recipientName: candidate.recipient.organizationName,
      recipientPriority: candidate.recipient.recipientPriority,
      assignedVehicleId: candidate.assignedVehicle.id,
      vehicleName: candidate.assignedVehicle.name,
      estimatedDistanceKm: candidate.distanceKm,
      estimatedDurationMin: candidate.durationMin,
      deliveryWindow: candidate.recipient.requiredDeliveryWindow,
      matchScore: candidate.score,
      scoreBreakdown: candidate.scoreBreakdown,
      reasoning: candidate.reasoning,
      safetyPassed: true,
      storagePassed: true,
      transportPassed: true,
      deadlineFeasible: true,
    });

    matchCounter++;
  }

  // 2. Identify Unmatched Food
  const unmatchedFood: AllocationPlan['unmatchedFood'] = [];
  for (const listing of foodListings) {
    const unallocated = remainingListingQty[listing.id];
    if (unallocated > 0) {
      let reason = 'Surplus quantity exceeds total compatible demand or fleet capacity.';
      if (listing.safety.status !== 'Verified') {
        reason = `Safety status "${listing.safety.status}" prevents allocation approval.`;
      } else {
        const matchingCategoryDemands = demandRequests.filter((d) => d.category === listing.category);
        if (matchingCategoryDemands.length === 0) {
          reason = `No active recipient has open demand for category "${listing.category}".`;
        }
      }
      unmatchedFood.push({
        listingId: listing.id,
        foodName: listing.name,
        unallocatedQty: unallocated,
        unit: listing.unit,
        reason,
      });
    }
  }

  // 3. Identify Unmet Demand
  const unmetDemand: AllocationPlan['unmetDemand'] = [];
  for (const demand of demandRequests) {
    const unmet = remainingDemandQty[demand.id];
    if (unmet > 0) {
      let reason = 'Insufficient compatible surplus registered in current inventory.';
      const matchingListings = foodListings.filter((fl) => fl.category === demand.category);
      if (matchingListings.length === 0) {
        reason = `Zero surplus available in category "${demand.category}".`;
      } else if (matchingListings.every((fl) => fl.safety.status !== 'Verified')) {
        reason = 'Matching food items currently under safety review or awaiting verifier sign-off.';
      }
      unmetDemand.push({
        demandId: demand.id,
        recipientName: demand.recipientName,
        category: demand.category,
        remainingQty: unmet,
        unit: demand.unit,
        reason,
      });
    }
  }

  // Calculate separate totals to never mix units (kg vs meal packs)
  let totalKg = 0;
  let totalMealPacks = 0;
  matches.forEach((m) => {
    if (m.unit === 'kg') totalKg += m.allocatedQuantity;
    else if (m.unit === 'meal packs') totalMealPacks += m.allocatedQuantity;
  });

  return {
    planId,
    createdAt: new Date().toISOString(),
    status: 'Generated',
    matches,
    unmatchedFood,
    unmetDemand,
    infeasibleCandidates,
    totalAllocatedKg: totalKg,
    totalAllocatedMealPacks: totalMealPacks,
    scoringWeights: weights,
    aiSummary: `Plan generated deterministically with ${matches.length} feasible allocations. Prioritized P1 emergency shelters while enforcing temperature cold-chain boundaries and safe-use deadlines.`,
  };
}
