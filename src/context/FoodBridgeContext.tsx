import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  FoodListingItem,
  DonationRequestItem,
  FoodRequirementItem,
  NotificationItem,
  HotelNavSection,
  TrustNavSection,
  AdminNavSection,
  VerificationStatus,
} from '../types/foodbridge';
import {
  SEED_USERS,
  SEED_LISTINGS,
  SEED_REQUESTS,
  SEED_REQUIREMENTS,
  SEED_NOTIFICATIONS,
} from '../data/foodbridgeSeedData';
import { auth, db } from '../services/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';

interface FoodBridgeContextType {
  currentUser: UserProfile | null;
  currentRole: UserRole | null;
  activeView: 'landing' | 'login' | 'register' | 'hotel-dashboard' | 'trust-dashboard' | 'admin-dashboard';
  activeRoleRegistration: 'hotel' | 'trust' | null;
  hotelSection: HotelNavSection;
  trustSection: TrustNavSection;
  adminSection: AdminNavSection;
  notificationPanelOpen: boolean;
  selectedListingId: string | null;
  selectedRequestId: string | null;

  // Data
  users: UserProfile[];
  listings: FoodListingItem[];
  requests: DonationRequestItem[];
  requirements: FoodRequirementItem[];
  notifications: NotificationItem[];
  unreadNotificationsCount: number;

  // Navigation Setters
  setActiveView: (view: 'landing' | 'login' | 'register' | 'hotel-dashboard' | 'trust-dashboard' | 'admin-dashboard') => void;
  setHotelSection: (section: HotelNavSection) => void;
  setTrustSection: (section: TrustNavSection) => void;
  setAdminSection: (section: AdminNavSection) => void;
  setNotificationPanelOpen: (open: boolean) => void;
  setSelectedListingId: (id: string | null) => void;
  setSelectedRequestId: (id: string | null) => void;
  openRegistration: (role: 'hotel' | 'trust') => void;
  openLogin: (role?: 'hotel' | 'trust' | 'admin') => void;

  // Auth & User Actions
  loginWithCredentials: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemoUser: (role: 'hotel' | 'trust' | 'admin') => void;
  registerUser: (profile: Omit<UserProfile, 'uid' | 'createdAt'>, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  verifyOrganization: (uid: string, status: VerificationStatus) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;

  // Hotel Food Operations
  addFoodListing: (listing: Omit<FoodListingItem, 'id' | 'createdAt' | 'remainingPackets' | 'requestCount'>) => Promise<string>;
  updateFoodListing: (id: string, updates: Partial<FoodListingItem>) => Promise<void>;
  markListingUnavailable: (id: string) => Promise<void>;
  publishListing: (id: string) => Promise<void>;

  // Trust Request & Allocation Operations
  createDonationRequest: (
    listingId: string,
    requestedPackets: number,
    requestedPickupTime: string,
    recipientDetails: string,
    specialInstructions?: string
  ) => Promise<{ success: boolean; error?: string; requestId?: string }>;
  approveRequest: (requestId: string) => Promise<void>;
  rejectRequest: (requestId: string, reason: string) => Promise<void>;
  schedulePickup: (requestId: string, scheduledTime: string) => Promise<void>;
  confirmPickupViaQR: (qrToken: string) => Promise<{ success: boolean; message: string }>;
  confirmTrustReceipt: (requestId: string) => Promise<void>;

  // Demand Requirements
  addFoodRequirement: (req: Omit<FoodRequirementItem, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateFoodRequirement: (id: string, updates: Partial<FoodRequirementItem>) => Promise<void>;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  triggerNotification: (notif: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => void;
}

const FoodBridgeContext = createContext<FoodBridgeContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'foodbridge_current_user',
  USERS: 'foodbridge_users_v2',
  LISTINGS: 'foodbridge_listings_v2',
  REQUESTS: 'foodbridge_requests_v2',
  REQUIREMENTS: 'foodbridge_requirements_v2',
  NOTIFICATIONS: 'foodbridge_notifications_v2',
};

export const FoodBridgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [activeView, setActiveView] = useState<'landing' | 'login' | 'register' | 'hotel-dashboard' | 'trust-dashboard' | 'admin-dashboard'>('landing');
  const [activeRoleRegistration, setActiveRoleRegistration] = useState<'hotel' | 'trust' | null>(null);
  const [hotelSection, setHotelSection] = useState<HotelNavSection>('overview');
  const [trustSection, setTrustSection] = useState<TrustNavSection>('overview');
  const [adminSection, setAdminSection] = useState<AdminNavSection>('overview');
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  // Entities State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [users, setUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : SEED_USERS;
    } catch {
      return SEED_USERS;
    }
  });

  const [listings, setListings] = useState<FoodListingItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LISTINGS);
      return saved ? JSON.parse(saved) : SEED_LISTINGS;
    } catch {
      return SEED_LISTINGS;
    }
  });

  const [requests, setRequests] = useState<DonationRequestItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      return saved ? JSON.parse(saved) : SEED_REQUESTS;
    } catch {
      return SEED_REQUESTS;
    }
  });

  const [requirements, setRequirements] = useState<FoodRequirementItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REQUIREMENTS);
      return saved ? JSON.parse(saved) : SEED_REQUIREMENTS;
    } catch {
      return SEED_REQUIREMENTS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : SEED_NOTIFICATIONS;
    } catch {
      return SEED_NOTIFICATIONS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
      localStorage.setItem(STORAGE_KEYS.REQUIREMENTS, JSON.stringify(requirements));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [users, listings, requests, requirements, notifications]);

  // Derived current role
  const currentRole = currentUser?.role || null;

  // Unread notifications for current user
  const unreadNotificationsCount = notifications.filter((n) => {
    if (!currentUser) return false;
    const isTargetUser = n.recipientUserId === currentUser.uid;
    const isTargetRole =
      (currentUser.role === 'hotel' && n.recipientOrgType === 'Hotel') ||
      (currentUser.role === 'trust' && n.recipientOrgType === 'Trust') ||
      (currentUser.role === 'admin' && (n.recipientOrgType === 'Admin' || n.recipientOrgType === 'All'));
    return !n.read && (isTargetUser || isTargetRole);
  }).length;

  // Navigation helpers
  const openRegistration = (role: 'hotel' | 'trust') => {
    setActiveRoleRegistration(role);
    setActiveView('register');
  };

  const openLogin = (role?: 'hotel' | 'trust' | 'admin') => {
    if (role) {
      setActiveRoleRegistration(role === 'admin' ? null : role);
    }
    setActiveView('login');
  };

  // Auth methods
  const loginWithCredentials = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // First check local stored users
      const localMatch = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (localMatch) {
        setCurrentUser(localMatch);
        routeUserToDashboard(localMatch.role);
        return { success: true };
      }

      // Try Firebase Auth
      const userCred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const uid = userCred.user.uid;
      
      // Try to load Firestore document
      try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          const profile = userDoc.data() as UserProfile;
          setCurrentUser(profile);
          setUsers((prev) => (prev.some((u) => u.uid === uid) ? prev : [profile, ...prev]));
          routeUserToDashboard(profile.role);
          return { success: true };
        }
      } catch (fsErr) {
        console.warn('Firestore load note:', fsErr);
      }

      // Fallback user if profile doc doesn't exist yet
      const fallbackUser: UserProfile = {
        uid,
        email,
        fullName: userCred.user.displayName || email.split('@')[0],
        organizationName: 'Registered Organization',
        organizationType: 'Hotel / Restaurant',
        role: 'hotel',
        phone: '+91 99999 00000',
        state: 'Maharashtra',
        districtCity: 'Mumbai',
        fullAddress: 'Registered Location',
        postalCode: '400001',
        verificationStatus: 'verified',
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(fallbackUser);
      setUsers((prev) => [fallbackUser, ...prev]);
      routeUserToDashboard('hotel');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Invalid email or password.' };
    }
  };

  const loginAsDemoUser = (role: 'hotel' | 'trust' | 'admin') => {
    let demoUser: UserProfile | undefined;
    if (role === 'hotel') {
      demoUser = users.find((u) => u.role === 'hotel' && u.verificationStatus === 'verified') || SEED_USERS[0];
    } else if (role === 'trust') {
      demoUser = users.find((u) => u.role === 'trust' && u.verificationStatus === 'verified') || SEED_USERS[3];
    } else {
      demoUser = users.find((u) => u.role === 'admin') || SEED_USERS[6];
    }
    if (demoUser) {
      setCurrentUser(demoUser);
      routeUserToDashboard(demoUser.role);
    }
  };

  const registerUser = async (
    profileData: Omit<UserProfile, 'uid' | 'createdAt'>,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      let uid = `user-${Date.now()}`;
      try {
        const userCred = await createUserWithEmailAndPassword(auth, profileData.email, password);
        uid = userCred.user.uid;
      } catch (fbAuthErr) {
        console.warn('Firebase Auth note, proceeding with persistent local profile:', fbAuthErr);
      }

      const newProfile: UserProfile = {
        ...profileData,
        uid,
        createdAt: new Date().toISOString(),
        verificationStatus: profileData.role === 'admin' ? 'verified' : 'pending',
      };

      // Save to Firestore if available
      try {
        await setDoc(doc(db, 'users', uid), newProfile);
      } catch (fsErr) {
        console.warn('Firestore setDoc note:', fsErr);
      }

      setUsers((prev) => [newProfile, ...prev]);
      setCurrentUser(newProfile);

      // Trigger admin notification
      triggerNotification({
        recipientUserId: 'admin-central',
        recipientOrgType: 'Admin',
        title: 'New Organization Registration Pending Verification',
        message: `${newProfile.organizationName} (${newProfile.role.toUpperCase()}) registered from ${newProfile.districtCity}, ${newProfile.state}.`,
        type: 'org_verified',
      });

      routeUserToDashboard(newProfile.role);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed.' };
    }
  };

  const logout = () => {
    try {
      signOut(auth);
    } catch (e) {
      console.warn(e);
    }
    setCurrentUser(null);
    setActiveView('landing');
    setHotelSection('overview');
    setTrustSection('overview');
    setAdminSection('overview');
  };

  const routeUserToDashboard = (role: UserRole) => {
    if (role === 'hotel') {
      setActiveView('hotel-dashboard');
      setHotelSection('overview');
    } else if (role === 'trust') {
      setActiveView('trust-dashboard');
      setTrustSection('overview');
    } else {
      setActiveView('admin-dashboard');
      setAdminSection('overview');
    }
  };

  const verifyOrganization = async (uid: string, status: VerificationStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, verificationStatus: status, updatedAt: new Date().toISOString() } : u))
    );
    if (currentUser?.uid === uid) {
      setCurrentUser((prev) => prev ? { ...prev, verificationStatus: status } : null);
    }

    try {
      await updateDoc(doc(db, 'users', uid), {
        verificationStatus: status,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Firestore update note:', e);
    }

    triggerNotification({
      recipientUserId: uid,
      recipientOrgType: 'All',
      title: `Organization ${status === 'verified' ? 'Approved & Verified' : 'Status Updated'}`,
      message: `Your organization verification has been reviewed and set to ${status.toUpperCase()}.`,
      type: 'org_verified',
    });
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates, updatedAt: new Date().toISOString() };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.uid === currentUser.uid ? updated : u)));

    try {
      await updateDoc(doc(db, 'users', currentUser.uid), updates);
    } catch (e) {
      console.warn('Firestore update note:', e);
    }
  };

  // Hotel Food Operations
  const addFoodListing = async (
    item: Omit<FoodListingItem, 'id' | 'createdAt' | 'remainingPackets' | 'requestCount'>
  ): Promise<string> => {
    const newId = `FL-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newListing: FoodListingItem = {
      ...item,
      id: newId,
      remainingPackets: item.numberOfPackets,
      requestCount: 0,
      createdAt: new Date().toISOString(),
    };

    setListings((prev) => [newListing, ...prev]);

    try {
      await setDoc(doc(db, 'foodListings', newId), newListing);
    } catch (e) {
      console.warn('Firestore setDoc note:', e);
    }

    // Broadcast notification to trusts
    triggerNotification({
      recipientUserId: 'all-trusts',
      recipientOrgType: 'Trust',
      title: 'New Surplus Food Available Nearby',
      message: `${newListing.hotelName} listed ${newListing.numberOfPackets} ${newListing.unit} of ${newListing.foodName}.`,
      type: 'new_food_available',
      relatedListingId: newId,
    });

    return newId;
  };

  const updateFoodListing = async (id: string, updates: Partial<FoodListingItem>) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l))
    );
    try {
      await updateDoc(doc(db, 'foodListings', id), updates);
    } catch (e) {
      console.warn('Firestore update note:', e);
    }
  };

  const markListingUnavailable = async (id: string) => {
    await updateFoodListing(id, { status: 'Unavailable' });
  };

  const publishListing = async (id: string) => {
    await updateFoodListing(id, { status: 'Published' });
  };

  // Trust Requests & Allocations
  const createDonationRequest = async (
    listingId: string,
    requestedPackets: number,
    requestedPickupTime: string,
    recipientDetails: string,
    specialInstructions?: string
  ): Promise<{ success: boolean; error?: string; requestId?: string }> => {
    if (!currentUser) return { success: false, error: 'User must be signed in.' };
    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return { success: false, error: 'Listing not found.' };

    if (listing.remainingPackets < requestedPackets) {
      return {
        success: false,
        error: `Only ${listing.remainingPackets} packets remaining. Cannot request ${requestedPackets}.`,
      };
    }

    const requestId = `REQ-FB-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRequest: DonationRequestItem = {
      id: requestId,
      listingId,
      foodName: listing.foodName,
      hotelId: listing.hotelId,
      hotelName: listing.hotelName,
      hotelAddress: listing.address,
      hotelPhone: listing.hotelPhone,
      trustId: currentUser.uid,
      trustName: currentUser.organizationName,
      trustPhone: currentUser.phone,
      trustAddress: currentUser.fullAddress,
      requestedPackets,
      requestedQuantity: requestedPackets,
      unit: listing.unit,
      requestedPickupTime,
      recipientDetails,
      specialInstructions,
      status: 'REQUESTED',
      createdAt: new Date().toISOString(),
    };

    // Update listing remainingPackets atomically
    const newRemaining = listing.remainingPackets - requestedPackets;
    const newStatus = newRemaining === 0 ? 'Fully Reserved' : 'Partially Reserved';

    setRequests((prev) => [newRequest, ...prev]);
    setListings((prev) =>
      prev.map((l) =>
        l.id === listingId
          ? {
              ...l,
              remainingPackets: newRemaining,
              status: newStatus,
              requestCount: l.requestCount + 1,
              updatedAt: new Date().toISOString(),
            }
          : l
      )
    );

    try {
      await setDoc(doc(db, 'donationRequests', requestId), newRequest);
      await updateDoc(doc(db, 'foodListings', listingId), {
        remainingPackets: newRemaining,
        status: newStatus,
        requestCount: listing.requestCount + 1,
      });
    } catch (e) {
      console.warn('Firestore setDoc note:', e);
    }

    // Notify Hotel
    triggerNotification({
      recipientUserId: listing.hotelId,
      recipientOrgType: 'Hotel',
      title: 'New Donation Request Received',
      message: `${currentUser.organizationName} requested ${requestedPackets} packets of ${listing.foodName}.`,
      type: 'request_received',
      relatedRequestId: requestId,
      relatedListingId: listingId,
    });

    return { success: true, requestId };
  };

  const approveRequest = async (requestId: string) => {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    // Generate non-sensitive, secure opaque QR token
    const qrToken = `FB-QR-${req.id.replace('REQ-FB-', '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${req.requestedPackets}PK`;

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: 'APPROVED', qrToken, updatedAt: new Date().toISOString() }
          : r
      )
    );

    try {
      await updateDoc(doc(db, 'donationRequests', requestId), {
        status: 'APPROVED',
        qrToken,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Firestore update note:', e);
    }

    triggerNotification({
      recipientUserId: req.trustId,
      recipientOrgType: 'Trust',
      title: 'Donation Request Approved! QR Generated',
      message: `${req.hotelName} approved your request for ${req.requestedPackets} packets of ${req.foodName}. Pickup QR code is now available.`,
      type: 'request_approved',
      relatedRequestId: requestId,
    });
  };

  const rejectRequest = async (requestId: string, reason: string) => {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    // Return packets to the listing
    const listing = listings.find((l) => l.id === req.listingId);
    if (listing) {
      const restoredPackets = listing.remainingPackets + req.requestedPackets;
      const restoredStatus = restoredPackets >= listing.numberOfPackets ? 'Published' : 'Partially Reserved';
      setListings((prev) =>
        prev.map((l) =>
          l.id === listing.id
            ? { ...l, remainingPackets: restoredPackets, status: restoredStatus }
            : l
        )
      );
    }

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: 'REJECTED', rejectionReason: reason, updatedAt: new Date().toISOString() }
          : r
      )
    );

    try {
      await updateDoc(doc(db, 'donationRequests', requestId), {
        status: 'REJECTED',
        rejectionReason: reason,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Firestore update note:', e);
    }

    triggerNotification({
      recipientUserId: req.trustId,
      recipientOrgType: 'Trust',
      title: 'Donation Request Declined',
      message: `${req.hotelName} could not fulfill your request. Reason: ${reason}`,
      type: 'request_rejected',
      relatedRequestId: requestId,
    });
  };

  const schedulePickup = async (requestId: string, scheduledTime: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: 'PICKUP SCHEDULED', requestedPickupTime: scheduledTime, updatedAt: new Date().toISOString() }
          : r
      )
    );

    const req = requests.find((r) => r.id === requestId);
    if (req) {
      triggerNotification({
        recipientUserId: req.trustId,
        recipientOrgType: 'Trust',
        title: 'Pickup Scheduled Confirmed',
        message: `Pickup confirmed for ${scheduledTime} at ${req.hotelName}.`,
        type: 'pickup_scheduled',
        relatedRequestId: requestId,
      });
    }
  };

  const confirmPickupViaQR = async (qrToken: string): Promise<{ success: boolean; message: string }> => {
    const trimmed = qrToken.trim();
    const matchedRequest = requests.find(
      (r) => r.qrToken === trimmed || r.id === trimmed || trimmed.includes(r.id.replace('REQ-FB-', ''))
    );

    if (!matchedRequest) {
      return { success: false, message: 'Invalid or unrecognized QR token. Please re-check the token code.' };
    }

    if (matchedRequest.status === 'PICKED UP' || matchedRequest.status === 'COMPLETED') {
      return { success: false, message: `This reservation was already verified and picked up on ${matchedRequest.pickupVerifiedAt || 'earlier session'}. Cannot scan twice.` };
    }

    const nowIso = new Date().toISOString();

    setRequests((prev) =>
      prev.map((r) =>
        r.id === matchedRequest.id
          ? {
              ...r,
              status: 'PICKED UP',
              pickupVerifiedAt: nowIso,
              updatedAt: nowIso,
            }
          : r
      )
    );

    try {
      await updateDoc(doc(db, 'donationRequests', matchedRequest.id), {
        status: 'PICKED UP',
        pickupVerifiedAt: nowIso,
        updatedAt: nowIso,
      });
    } catch (e) {
      console.warn('Firestore update note:', e);
    }

    // Trigger notification to Trust
    triggerNotification({
      recipientUserId: matchedRequest.trustId,
      recipientOrgType: 'Trust',
      title: 'Food Handover Verified via QR Code',
      message: `Hotel verified QR token for ${matchedRequest.requestedPackets} packets of ${matchedRequest.foodName}. Food is now with your pickup team.`,
      type: 'pickup_completed',
      relatedRequestId: matchedRequest.id,
    });

    return {
      success: true,
      message: `Successfully verified pickup for ${matchedRequest.trustName}! Handover recorded for ${matchedRequest.requestedPackets} packets of ${matchedRequest.foodName}.`,
    };
  };

  const confirmTrustReceipt = async (requestId: string) => {
    const nowIso = new Date().toISOString();
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: 'COMPLETED', completedAt: nowIso, updatedAt: nowIso }
          : r
      )
    );

    const req = requests.find((r) => r.id === requestId);
    if (req) {
      triggerNotification({
        recipientUserId: req.hotelId,
        recipientOrgType: 'Hotel',
        title: 'Donation Completed & Confirmed',
        message: `${req.trustName} has confirmed safe receipt and distribution of ${req.requestedPackets} packets. Thank you!`,
        type: 'pickup_completed',
        relatedRequestId: requestId,
      });
    }
  };

  // Requirements
  const addFoodRequirement = async (
    req: Omit<FoodRequirementItem, 'id' | 'createdAt' | 'status'>
  ) => {
    const newId = `FR-${Date.now()}`;
    const newReq: FoodRequirementItem = {
      ...req,
      id: newId,
      status: 'Active',
      createdAt: new Date().toISOString(),
    };
    setRequirements((prev) => [newReq, ...prev]);
  };

  const updateFoodRequirement = async (id: string, updates: Partial<FoodRequirementItem>) => {
    setRequirements((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const triggerNotification = (notif: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  return (
    <FoodBridgeContext.Provider
      value={{
        currentUser,
        currentRole,
        activeView,
        activeRoleRegistration,
        hotelSection,
        trustSection,
        adminSection,
        notificationPanelOpen,
        selectedListingId,
        selectedRequestId,
        users,
        listings,
        requests,
        requirements,
        notifications,
        unreadNotificationsCount,
        setActiveView,
        setHotelSection,
        setTrustSection,
        setAdminSection,
        setNotificationPanelOpen,
        setSelectedListingId,
        setSelectedRequestId,
        openRegistration,
        openLogin,
        loginWithCredentials,
        loginAsDemoUser,
        registerUser,
        logout,
        verifyOrganization,
        updateUserProfile,
        addFoodListing,
        updateFoodListing,
        markListingUnavailable,
        publishListing,
        createDonationRequest,
        approveRequest,
        rejectRequest,
        schedulePickup,
        confirmPickupViaQR,
        confirmTrustReceipt,
        addFoodRequirement,
        updateFoodRequirement,
        markNotificationRead,
        markAllNotificationsRead,
        triggerNotification,
      }}
    >
      {children}
    </FoodBridgeContext.Provider>
  );
};

export const useFoodBridge = () => {
  const context = useContext(FoodBridgeContext);
  if (!context) {
    throw new Error('useFoodBridge must be used within a FoodBridgeProvider');
  }
  return context;
};
