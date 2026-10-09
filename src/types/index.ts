export type NavPage =
  | 'dashboard'
  | 'donations'
  | 'matching'
  | 'logistics'
  | 'analytics'
  | 'users'
  | 'settings';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Donor' | 'Recipient Admin' | 'Logistics Driver' | 'Platform Admin';
  organization: string;
  status: 'Active' | 'Pending Verification' | 'Suspended';
  assignedZone: string;
  donationsOrDeliveriesCount: number;
  joinedDate: string;
}

export type FoodCategory =
  | 'Prepared Meals'
  | 'Bakery & Bread'
  | 'Fresh Produce'
  | 'Dairy & Eggs'
  | 'Packaged & Dry Goods'
  | 'Cooked Catering';

export type FoodUnit = 'kg' | 'meal packs' | 'crates' | 'liters';

export type StorageCondition = 'Ambient' | 'Refrigerated (2-4°C)' | 'Frozen (≤-18°C)';

export type SafetyVerificationStatus =
  | 'Verified'
  | 'Verification Required'
  | 'Approaching Deadline'
  | 'Safety Review Required'
  | 'Expired'
  | 'Not Eligible for Allocation';

export type VehicleType =
  | 'Refrigerated Van'
  | 'Cargo Van'
  | 'Heavy Box Truck'
  | 'Electric Light Courier';

export type RecipientPriority = 'P1 - Critical/High-Risk' | 'P2 - Standard Community' | 'P3 - Flexible';

export type RecipientType =
  | 'Emergency Shelter'
  | 'Food Bank'
  | 'Community Kitchen'
  | 'Youth / School Pantry'
  | 'Elder Care Center';

export interface FoodListing {
  id: string;
  name: string;
  category: FoodCategory;
  description: string;
  quantity: number;
  unit: FoodUnit;
  mealPacksCount?: number;
  preparationTime: string;
  provider: {
    name: string;
    contactPerson: string;
    phone: string;
    address: string;
    zone: string;
  };
  safety: {
    status: SafetyVerificationStatus;
    verifiedSafeUseDeadline: string; // ISO String
    storageCondition: StorageCondition;
    recordedTemperature?: number; // in Celsius
    handlingInstructions: string;
    verifierName: string;
    verificationNotes: string;
    verifiedAt?: string;
  };
  pickup: {
    address: string;
    availabilityWindow: string; // e.g. "Today 10:00 - 13:00"
    loadingTimeMinutes: number;
    collectionNotes: string;
  };
  transportReq: {
    requiredVehicleType: VehicleType;
    temperatureControlled: boolean;
    cargoHandling: string;
    readinessStatus: 'Ready Now' | 'Ready in 30m' | 'Staged for Pickup';
  };
  allocatedQuantity: number;
  remainingQuantity: number;
  status: 'Available' | 'Partially Allocated' | 'Fully Allocated' | 'Expired' | 'Under Review';
  isDemonstration: boolean;
  createdAt: string;
}

export interface Recipient {
  id: string;
  organizationName: string;
  organizationType: RecipientType;
  location: {
    address: string;
    zone: string;
    distanceKmFromHub: number;
  };
  verificationStatus: 'Verified' | 'Pending Verification' | 'Suspended';
  requiredCategories: FoodCategory[];
  requestedQuantity: number;
  unit: FoodUnit;
  peopleServed: number;
  requiredDeliveryWindow: string; // e.g. "11:30 - 14:00"
  storageCapacity: number;
  currentStorageOccupancy: number;
  storageConditions: StorageCondition[];
  temperatureControlAvailable: boolean;
  transportationAccess: 'Loading Dock' | 'Street Parking' | 'Ground Floor Ramp' | 'Elevator Only';
  recipientPriority: RecipientPriority;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  isDemonstration: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface DemandRequest {
  id: string;
  recipientId: string;
  recipientName: string;
  category: FoodCategory;
  requestedQuantity: number;
  allocatedQuantity: number;
  unit: FoodUnit;
  deliveryDeadline: string; // ISO string or time window
  urgency: 'Urgent (Within 3h)' | 'High (Today)' | 'Standard (Within 24h)';
  peopleServed: number;
  storageCapability: StorageCondition;
  verificationStatus: 'Verified' | 'Under Review';
  requestStatus: 'Open' | 'Partially Matched' | 'Fulfilled' | 'Expired';
  notes: string;
}

export interface VehicleResource {
  id: string;
  name: string;
  type: VehicleType;
  capacity: number;
  capacityUnit: FoodUnit;
  currentLocation: string;
  availability: 'Available' | 'On Delivery' | 'Maintenance' | 'Scheduled';
  temperatureControlled: boolean;
  targetTempCelsius?: number;
  maxRangeKm: number;
  driverName: string;
  driverPhone: string;
}

export interface AllocationMatch {
  matchId: string;
  foodListingId: string;
  foodName: string;
  foodCategory: FoodCategory;
  allocatedQuantity: number;
  unit: FoodUnit;
  recipientId: string;
  recipientName: string;
  recipientPriority: RecipientPriority;
  assignedVehicleId: string;
  vehicleName: string;
  estimatedDistanceKm: number;
  estimatedDurationMin: number;
  deliveryWindow: string;
  matchScore: number;
  scoreBreakdown: {
    priorityScore: number;
    urgencyScore: number;
    distanceScore: number;
    storageCompatibilityScore: number;
  };
  reasoning: string;
  safetyPassed: boolean;
  storagePassed: boolean;
  transportPassed: boolean;
  deadlineFeasible: boolean;
}

export interface InfeasibleCandidate {
  listingId: string;
  foodName: string;
  recipientId: string;
  recipientName: string;
  failedConstraint: string;
  reason: string;
}

export interface AllocationPlan {
  planId: string;
  createdAt: string;
  status: 'Draft' | 'Generated' | 'Approved' | 'Rejected' | 'Delivered';
  matches: AllocationMatch[];
  unmatchedFood: {
    listingId: string;
    foodName: string;
    unallocatedQty: number;
    unit: FoodUnit;
    reason: string;
  }[];
  unmetDemand: {
    demandId: string;
    recipientName: string;
    category: FoodCategory;
    remainingQty: number;
    unit: FoodUnit;
    reason: string;
  }[];
  infeasibleCandidates: InfeasibleCandidate[];
  totalAllocatedKg: number;
  totalAllocatedMealPacks: number;
  scoringWeights: {
    priorityWeight: number; // default 40
    expiryUrgencyWeight: number; // default 30
    distanceWeight: number; // default 20
    storageFitWeight: number; // default 10
  };
  aiSummary?: string;
  aiRecommendations?: string[];
  approvalInfo?: {
    approvedBy: string;
    approvedAt: string;
    notes: string;
  };
}

export type DeliveryStatus =
  | 'Awaiting Pickup'
  | 'Pickup Scheduled'
  | 'Picked Up'
  | 'In Transit'
  | 'Delivered'
  | 'Delayed'
  | 'Cancelled'
  | 'Safety Review Required';

export interface DeliveryTimelineEvent {
  status: DeliveryStatus;
  timestamp: string;
  note: string;
  operator: string;
}

export interface DeliveryRecord {
  deliveryId: string;
  planId: string;
  matchId: string;
  foodListingId: string;
  foodName: string;
  foodCategory: FoodCategory;
  sourceLocation: string;
  destinationLocation: string;
  recipientId: string;
  recipientName: string;
  quantity: number;
  unit: FoodUnit;
  vehicleId: string;
  vehicleName: string;
  scheduledPickup: string;
  estimatedArrival: string;
  actualPickup?: string;
  actualDelivery?: string;
  status: DeliveryStatus;
  timeline: DeliveryTimelineEvent[];
  temperatureLog?: { temp: number; time: string }[];
  isDelayed: boolean;
  delayReason?: string;
  confirmationNote?: string;
  confirmedBy?: string;
  safeUseDeadline: string;
}

export interface SafetyLog {
  id: string;
  foodListingId: string;
  foodName: string;
  action: 'Inspected' | 'Flagged' | 'Cleared' | 'Temperature Check' | 'Rejected';
  verifier: string;
  timestamp: string;
  details: string;
  temperatureRecorded?: number;
}

export interface SystemAlert {
  id: string;
  type: 'safety' | 'deadline' | 'storage' | 'transport' | 'delay' | 'demand';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  relatedEntityId?: string;
  resolved: boolean;
}

export type PrimaryNavGroup = 'OVERVIEW' | 'WORKFLOW' | 'OPERATIONS';

export type StepStatus =
  | 'Not Started'
  | 'In Progress'
  | 'Completed'
  | 'Action Required'
  | 'Blocked'
  | 'Awaiting Approval';

export interface WorkflowStepState {
  step: number;
  title: string;
  description: string;
  status: StepStatus;
  actionRequired?: string;
}
