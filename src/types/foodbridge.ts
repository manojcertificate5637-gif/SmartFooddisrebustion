export type UserRole = 'hotel' | 'trust' | 'admin';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type OrganizationType =
  | 'Hotel / Restaurant'
  | 'Catering Service'
  | 'Bakery & Confectionery'
  | 'Supermarket / Grocery'
  | 'Charitable Trust'
  | 'Non-Governmental Organization (NGO)'
  | 'Orphanage'
  | 'Community Kitchen / Shelter'
  | 'Disaster Relief Cell';

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  organizationName: string;
  organizationType: OrganizationType;
  role: UserRole;
  phone: string;
  state: string;
  districtCity: string;
  fullAddress: string;
  postalCode: string;
  verificationStatus: VerificationStatus;
  lat?: number;
  lng?: number;
  createdAt: string;
  updatedAt?: string;
}

export type FoodCategory =
  | 'Prepared Meals'
  | 'Bakery & Bread'
  | 'Fresh Produce'
  | 'Dairy & Eggs'
  | 'Packaged & Dry Goods'
  | 'Cooked Catering';

export type FoodUnit = 'packets' | 'kg' | 'trays' | 'liters';

export type StorageCondition =
  | 'Ambient'
  | 'Refrigerated (2-4°C)'
  | 'Frozen (≤-18°C)'
  | 'Hot Hold (≥60°C)';

export type ListingStatus =
  | 'Draft'
  | 'Published'
  | 'Unavailable'
  | 'Partially Reserved'
  | 'Fully Reserved'
  | 'Completed';

export interface FoodListingItem {
  id: string;
  hotelId: string;
  hotelName: string;
  hotelPhone?: string;
  foodName: string;
  category: FoodCategory;
  isVegetarian: boolean;
  availableQuantity: number;
  numberOfPackets: number;
  remainingPackets: number;
  unit: FoodUnit;
  preparationTime: string;
  safeUseDeadline: string;
  pickupDeadline: string;
  storageConditions: StorageCondition;
  pickupInstructions: string;
  imageUrl?: string;
  status: ListingStatus;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  lat: number;
  lng: number;
  requestCount: number;
  createdAt: string;
  updatedAt?: string;
}

export type RequestStatus =
  | 'REQUESTED'
  | 'APPROVED'
  | 'PICKUP SCHEDULED'
  | 'PICKED UP'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED';

export interface DonationRequestItem {
  id: string;
  listingId: string;
  foodName: string;
  hotelId: string;
  hotelName: string;
  hotelAddress?: string;
  hotelPhone?: string;
  trustId: string;
  trustName: string;
  trustPhone: string;
  trustAddress?: string;
  requestedPackets: number;
  requestedQuantity: number;
  unit: FoodUnit;
  requestedPickupTime: string;
  recipientDetails: string;
  specialInstructions?: string;
  status: RequestStatus;
  qrToken?: string;
  rejectionReason?: string;
  pickupVerifiedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface FoodRequirementItem {
  id: string;
  trustId: string;
  trustName: string;
  category: FoodCategory;
  requiredPackets: number;
  urgency: 'Low' | 'Medium' | 'High' | 'Emergency';
  note: string;
  status: 'Active' | 'Fulfilled' | 'Closed';
  createdAt: string;
}

export type NotificationType =
  | 'request_received'
  | 'request_approved'
  | 'request_rejected'
  | 'pickup_scheduled'
  | 'pickup_completed'
  | 'new_food_available'
  | 'org_verified';

export interface NotificationItem {
  id: string;
  recipientUserId: string;
  recipientOrgType: 'Hotel' | 'Trust' | 'Admin' | 'All';
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  relatedRequestId?: string;
  relatedListingId?: string;
  createdAt: string;
}

// Navigation Sub-items
export type HotelNavSection =
  | 'overview'
  | 'food-add'
  | 'food-available'
  | 'food-update'
  | 'food-availability'
  | 'requests-pending'
  | 'requests-approved'
  | 'requests-rejected'
  | 'pickup-schedule'
  | 'pickup-handover'
  | 'pickup-completed'
  | 'location'
  | 'history'
  | 'reports'
  | 'settings';

export type TrustNavSection =
  | 'overview'
  | 'match-recommended'
  | 'match-nearby'
  | 'match-search'
  | 'req-add'
  | 'req-update'
  | 'requests-pending'
  | 'requests-approved'
  | 'requests-rejected'
  | 'pickup-reservations'
  | 'qr-verification'
  | 'received-donations'
  | 'location'
  | 'settings';

export type AdminNavSection =
  | 'overview'
  | 'hotels-pending'
  | 'trusts-pending'
  | 'approved-orgs'
  | 'food-listings'
  | 'donation-requests'
  | 'pickup-monitoring'
  | 'suspicious-listings'
  | 'reports';
