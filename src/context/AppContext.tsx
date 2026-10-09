import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  FoodListing,
  Recipient,
  DemandRequest,
  VehicleResource,
  AllocationPlan,
  DeliveryRecord,
  SafetyLog,
  SystemAlert,
  PrimaryNavGroup,
  WorkflowStepState,
  StepStatus,
  DeliveryStatus,
  NavPage,
  UserAccount,
} from '../types';
import {
  INITIAL_FOOD_LISTINGS,
  INITIAL_RECIPIENTS,
  INITIAL_DEMAND_REQUESTS,
  INITIAL_VEHICLES,
  INITIAL_DELIVERIES,
  INITIAL_SAFETY_LOGS,
  INITIAL_ALERTS,
  INITIAL_USERS,
} from '../data/initialData';
import { runDeterministicAllocation, ScoringWeights, DEFAULT_WEIGHTS } from '../services/allocationEngine';

interface AppContextType {
  currentPage: NavPage;
  setCurrentPage: (page: NavPage) => void;
  primaryNav: PrimaryNavGroup;
  setPrimaryNav: (nav: PrimaryNavGroup) => void;
  workflowStep: number;
  setWorkflowStep: (step: number) => void;
  workflowStepStates: Record<number, WorkflowStepState>;
  updateStepStatus: (step: number, status: StepStatus, actionRequired?: string) => void;
  activeOperationsTab: string;
  setActiveOperationsTab: (tab: string) => void;

  // Domain Entities
  foodListings: FoodListing[];
  recipients: Recipient[];
  demandRequests: DemandRequest[];
  vehicles: VehicleResource[];
  currentPlan: AllocationPlan | null;
  deliveries: DeliveryRecord[];
  safetyLogs: SafetyLog[];
  alerts: SystemAlert[];
  users: UserAccount[];
  scoringWeights: ScoringWeights;
  setScoringWeights: (weights: ScoringWeights) => void;

  // Entity Actions
  addFoodListing: (listing: Omit<FoodListing, 'id' | 'createdAt' | 'allocatedQuantity' | 'remainingQuantity' | 'status' | 'isDemonstration'>) => FoodListing;
  updateFoodListing: (id: string, updates: Partial<FoodListing>) => void;
  cancelFoodListing: (id: string) => void;
  verifyFoodListing: (id: string, verifierName: string, notes: string, temp?: number) => void;

  addRecipient: (recipient: Omit<Recipient, 'id' | 'createdAt' | 'isDemonstration' | 'isActive'>) => Recipient;
  updateRecipient: (id: string, updates: Partial<Recipient>) => void;
  verifyRecipient: (id: string) => void;

  addDemandRequest: (demand: Omit<DemandRequest, 'id' | 'allocatedQuantity' | 'requestStatus'>) => DemandRequest;
  updateDemandRequest: (id: string, updates: Partial<DemandRequest>) => void;

  addUser: (user: Omit<UserAccount, 'id' | 'joinedDate'>) => void;
  updateUser: (id: string, updates: Partial<UserAccount>) => void;

  updateVehicle: (id: string, updates: Partial<VehicleResource>) => void;

  // Workflow Core Actions
  generatePlan: () => AllocationPlan;
  approvePlan: (approverName: string, notes: string) => { success: boolean; error?: string };
  rejectPlan: (reason: string) => void;

  updateDeliveryStatus: (deliveryId: string, status: DeliveryStatus, note: string, operator: string) => void;
  confirmDelivery: (deliveryId: string, note: string, confirmedBy: string) => void;
  addDeliveryDelay: (deliveryId: string, delayReason: string) => void;

  dismissAlert: (id: string) => void;
  resetDemoData: () => void;
  exportCsv: (dataType: 'listings' | 'recipients' | 'demands' | 'deliveries' | 'plan') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'smart_food_redistribution_data_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPageState] = useState<NavPage>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_current_page`);
    return (saved as NavPage) || 'dashboard';
  });

  const setCurrentPage = (page: NavPage) => {
    setCurrentPageState(page);
    try {
      localStorage.setItem(`${STORAGE_KEY}_current_page`, page);
    } catch {}
  };

  const [primaryNav, setPrimaryNav] = useState<PrimaryNavGroup>('OVERVIEW');
  const [workflowStep, setWorkflowStepState] = useState<number>(1);
  const [activeOperationsTab, setActiveOperationsTab] = useState<string>('inventory');

  // Core Data
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [foodListings, setFoodListings] = useState<FoodListing[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_listings`);
    return saved ? JSON.parse(saved) : INITIAL_FOOD_LISTINGS;
  });

  const [recipients, setRecipients] = useState<Recipient[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_recipients`);
    return saved ? JSON.parse(saved) : INITIAL_RECIPIENTS;
  });

  const [demandRequests, setDemandRequests] = useState<DemandRequest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_demands`);
    return saved ? JSON.parse(saved) : INITIAL_DEMAND_REQUESTS;
  });

  const [vehicles, setVehicles] = useState<VehicleResource[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_vehicles`);
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [currentPlan, setCurrentPlan] = useState<AllocationPlan | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_plan`);
    return saved ? JSON.parse(saved) : null;
  });

  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_deliveries`);
    return saved ? JSON.parse(saved) : INITIAL_DELIVERIES;
  });

  const [safetyLogs, setSafetyLogs] = useState<SafetyLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_safety`);
    return saved ? JSON.parse(saved) : INITIAL_SAFETY_LOGS;
  });

  const [alerts, setAlerts] = useState<SystemAlert[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_alerts`);
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [scoringWeights, setScoringWeights] = useState<ScoringWeights>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_weights`);
    return saved ? JSON.parse(saved) : DEFAULT_WEIGHTS;
  });

  // Step States
  const [workflowStepStates, setWorkflowStepStates] = useState<Record<number, WorkflowStepState>>({
    1: {
      step: 1,
      title: 'Register Surplus Food',
      description: 'Capture batch details, verified safe-use deadlines, handling, and pickup windows.',
      status: 'Completed',
    },
    2: {
      step: 2,
      title: 'Manage Recipients',
      description: 'Audit verified organizations, priority tier, storage capabilities, and receiving docks.',
      status: 'Completed',
    },
    3: {
      step: 3,
      title: 'Assess Demand',
      description: 'Review active recipient demand requests, urgency levels, and category requirements.',
      status: 'Completed',
    },
    4: {
      step: 4,
      title: 'Validate Food Safety',
      description: 'Enforce cold-chain integrity, safe-use buffers, and storage facility compatibility.',
      status: 'Action Required',
      actionRequired: 'Listing FL-103 requires temperature inspection sign-off.',
    },
    5: {
      step: 5,
      title: 'Generate Redistribution Plan',
      description: 'Execute deterministic multi-variable allocation engine across supply, demand, and safety constraints.',
      status: 'In Progress',
    },
    6: {
      step: 6,
      title: 'Optimize Transportation',
      description: 'Assign compatible vehicles, sequence stops, and verify capacity utilization.',
      status: 'Not Started',
    },
    7: {
      step: 7,
      title: 'Review and Approve',
      description: 'Execute final pre-approval constraint re-validation and issue dispatch authorization.',
      status: 'Awaiting Approval',
    },
    8: {
      step: 8,
      title: 'Track Delivery',
      description: 'Monitor live transit milestones, enforce temperature thresholds, and record receipt signatures.',
      status: 'In Progress',
    },
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_listings`, JSON.stringify(foodListings));
      localStorage.setItem(`${STORAGE_KEY}_recipients`, JSON.stringify(recipients));
      localStorage.setItem(`${STORAGE_KEY}_demands`, JSON.stringify(demandRequests));
      localStorage.setItem(`${STORAGE_KEY}_vehicles`, JSON.stringify(vehicles));
      localStorage.setItem(`${STORAGE_KEY}_plan`, JSON.stringify(currentPlan));
      localStorage.setItem(`${STORAGE_KEY}_deliveries`, JSON.stringify(deliveries));
      localStorage.setItem(`${STORAGE_KEY}_safety`, JSON.stringify(safetyLogs));
      localStorage.setItem(`${STORAGE_KEY}_alerts`, JSON.stringify(alerts));
      localStorage.setItem(`${STORAGE_KEY}_weights`, JSON.stringify(scoringWeights));
    } catch (e) {
      console.warn('Storage quota exceeded or storage error:', e);
    }
  }, [foodListings, recipients, demandRequests, vehicles, currentPlan, deliveries, safetyLogs, alerts, scoringWeights]);

  const updateStepStatus = (step: number, status: StepStatus, actionRequired?: string) => {
    setWorkflowStepStates((prev) => ({
      ...prev,
      [step]: {
        ...prev[step],
        status,
        actionRequired,
      },
    }));
  };

  const setWorkflowStep = (step: number) => {
    if (step < 1 || step > 8) return;
    setWorkflowStepState(step);
    setPrimaryNav('WORKFLOW');
  };

  // Add Food Listing
  const addFoodListing = (
    item: Omit<FoodListing, 'id' | 'createdAt' | 'allocatedQuantity' | 'remainingQuantity' | 'status' | 'isDemonstration'>
  ): FoodListing => {
    const newId = `FL-${(foodListings.length + 101).toString()}`;
    const newListing: FoodListing = {
      ...item,
      id: newId,
      allocatedQuantity: 0,
      remainingQuantity: item.quantity,
      status: item.safety.status === 'Verified' ? 'Available' : 'Under Review',
      isDemonstration: false,
      createdAt: new Date().toISOString(),
    };

    setFoodListings((prev) => [newListing, ...prev]);

    // Add safety log
    const log: SafetyLog = {
      id: `LOG-${Date.now().toString().slice(-6)}`,
      foodListingId: newId,
      foodName: item.name,
      action: item.safety.status === 'Verified' ? 'Cleared' : 'Flagged',
      verifier: item.safety.verifierName || 'System Registration',
      timestamp: new Date().toISOString(),
      details: item.safety.verificationNotes || 'Listing registered through Step 1 Workflow.',
      temperatureRecorded: item.safety.recordedTemperature,
    };
    setSafetyLogs((prev) => [log, ...prev]);

    // Check if safety alert is warranted
    if (item.safety.status !== 'Verified') {
      const alert: SystemAlert = {
        id: `ALT-${Date.now().toString().slice(-6)}`,
        type: 'safety',
        severity: 'warning',
        title: `Verification Required for ${item.name}`,
        message: `Listing ${newId} requires inspector signoff prior to allocation.`,
        timestamp: new Date().toISOString(),
        relatedEntityId: newId,
        resolved: false,
      };
      setAlerts((prev) => [alert, ...prev]);
    }

    return newListing;
  };

  const updateFoodListing = (id: string, updates: Partial<FoodListing>) => {
    setFoodListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const cancelFoodListing = (id: string) => {
    setFoodListings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'Expired', remainingQuantity: 0 } : item
      )
    );
  };

  const addUser = (userData: Omit<UserAccount, 'id' | 'joinedDate'>) => {
    const newUser: UserAccount = {
      ...userData,
      id: `USR-${(users.length + 1).toString().padStart(2, '0')}`,
      joinedDate: new Date().toISOString().slice(0, 10),
    };
    setUsers((prev) => [newUser, ...prev]);
  };

  const updateUser = (id: string, updates: Partial<UserAccount>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
  };

  const verifyFoodListing = (id: string, verifierName: string, notes: string, temp?: number) => {
    setFoodListings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            safety: {
              ...item.safety,
              status: 'Verified',
              verifierName,
              verificationNotes: notes,
              recordedTemperature: temp ?? item.safety.recordedTemperature,
              verifiedAt: new Date().toISOString(),
            },
            status: item.remainingQuantity > 0 ? 'Available' : item.status,
          };
        }
        return item;
      })
    );

    const listing = foodListings.find((f) => f.id === id);
    if (listing) {
      const log: SafetyLog = {
        id: `LOG-${Date.now().toString().slice(-6)}`,
        foodListingId: id,
        foodName: listing.name,
        action: 'Cleared',
        verifier: verifierName,
        timestamp: new Date().toISOString(),
        details: `Inspected and verified: ${notes}`,
        temperatureRecorded: temp,
      };
      setSafetyLogs((prev) => [log, ...prev]);

      // Resolve alert if present
      setAlerts((prev) =>
        prev.map((a) => (a.relatedEntityId === id ? { ...a, resolved: true } : a))
      );
    }
  };

  const addRecipient = (
    recipient: Omit<Recipient, 'id' | 'createdAt' | 'isDemonstration' | 'isActive'>
  ): Recipient => {
    const newId = `REC-${(recipients.length + 201).toString()}`;
    const newRec: Recipient = {
      ...recipient,
      id: newId,
      isDemonstration: false,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    setRecipients((prev) => [...prev, newRec]);
    return newRec;
  };

  const updateRecipient = (id: string, updates: Partial<Recipient>) => {
    setRecipients((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const verifyRecipient = (id: string) => {
    setRecipients((prev) =>
      prev.map((r) => (r.id === id ? { ...r, verificationStatus: 'Verified' } : r))
    );
  };

  const addDemandRequest = (
    demand: Omit<DemandRequest, 'id' | 'allocatedQuantity' | 'requestStatus'>
  ): DemandRequest => {
    const newId = `DMD-${(demandRequests.length + 301).toString()}`;
    const newDmd: DemandRequest = {
      ...demand,
      id: newId,
      allocatedQuantity: 0,
      requestStatus: 'Open',
    };
    setDemandRequests((prev) => [...prev, newDmd]);
    return newDmd;
  };

  const updateDemandRequest = (id: string, updates: Partial<DemandRequest>) => {
    setDemandRequests((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
  };

  const updateVehicle = (id: string, updates: Partial<VehicleResource>) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
  };

  // Generate Plan deterministically
  const generatePlan = (): AllocationPlan => {
    const plan = runDeterministicAllocation({
      foodListings,
      recipients,
      demandRequests,
      vehicles,
      weights: scoringWeights,
    });
    setCurrentPlan(plan);
    updateStepStatus(5, 'Completed');
    updateStepStatus(6, 'In Progress');
    updateStepStatus(7, 'Awaiting Approval');
    return plan;
  };

  // Approve Plan: executes strict re-validation and creates deliveries
  const approvePlan = (approverName: string, notes: string): { success: boolean; error?: string } => {
    if (!currentPlan) {
      return { success: false, error: 'No plan currently generated.' };
    }

    if (currentPlan.matches.length === 0) {
      return { success: false, error: 'Cannot approve plan with 0 valid allocations.' };
    }

    // REVALIDATE INVENTORY & DEMAND CONSTRAINTS
    for (const match of currentPlan.matches) {
      const listing = foodListings.find((fl) => fl.id === match.foodListingId);
      if (!listing) {
        return { success: false, error: `Listing ${match.foodListingId} no longer exists.` };
      }
      if (listing.remainingQuantity < match.allocatedQuantity) {
        return {
          success: false,
          error: `Insufficient stock for ${listing.name}. Remaining: ${listing.remainingQuantity}, Requested: ${match.allocatedQuantity}. Re-run plan generation.`,
        };
      }
      if (listing.safety.status !== 'Verified') {
        return {
          success: false,
          error: `Safety check failed: ${listing.name} is not verified. Approval aborted.`,
        };
      }
    }

    // Apply inventory deductions and update demands
    const updatedListings = [...foodListings];
    const updatedDemands = [...demandRequests];
    const newDeliveries: DeliveryRecord[] = [];

    const now = new Date();
    const scheduledPickupTime = new Date(now.getTime() + 30 * 60000).toISOString();
    const estArrivalTime = new Date(now.getTime() + 90 * 60000).toISOString();

    currentPlan.matches.forEach((match, index) => {
      // 1. Deduct from listing
      const flIndex = updatedListings.findIndex((fl) => fl.id === match.foodListingId);
      if (flIndex !== -1) {
        const item = updatedListings[flIndex];
        const newAllocated = item.allocatedQuantity + match.allocatedQuantity;
        const newRemaining = Math.max(0, item.quantity - newAllocated);
        updatedListings[flIndex] = {
          ...item,
          allocatedQuantity: newAllocated,
          remainingQuantity: newRemaining,
          status: newRemaining === 0 ? 'Fully Allocated' : 'Partially Allocated',
        };
      }

      // 2. Deduct from demand
      const dmdIndex = updatedDemands.findIndex(
        (d) => d.recipientId === match.recipientId && d.category === match.foodCategory
      );
      if (dmdIndex !== -1) {
        const dmd = updatedDemands[dmdIndex];
        const newAllocatedDmd = dmd.allocatedQuantity + match.allocatedQuantity;
        const isFulfilled = newAllocatedDmd >= dmd.requestedQuantity;
        updatedDemands[dmdIndex] = {
          ...dmd,
          allocatedQuantity: newAllocatedDmd,
          requestStatus: isFulfilled ? 'Fulfilled' : 'Partially Matched',
        };
      }

      // 3. Create Delivery Record
      const listing = foodListings.find((fl) => fl.id === match.foodListingId);
      const deliveryId = `DEL-${(700 + deliveries.length + index + 1).toString()}`;

      newDeliveries.push({
        deliveryId,
        planId: currentPlan.planId,
        matchId: match.matchId,
        foodListingId: match.foodListingId,
        foodName: match.foodName,
        foodCategory: match.foodCategory,
        sourceLocation: listing ? listing.pickup.address : 'Central Supply Depot',
        destinationLocation: match.recipientName,
        recipientId: match.recipientId,
        recipientName: match.recipientName,
        quantity: match.allocatedQuantity,
        unit: match.unit,
        vehicleId: match.assignedVehicleId,
        vehicleName: match.vehicleName,
        scheduledPickup: scheduledPickupTime,
        estimatedArrival: estArrivalTime,
        status: 'Pickup Scheduled',
        isDelayed: false,
        safeUseDeadline: listing?.safety.verifiedSafeUseDeadline || new Date().toISOString(),
        timeline: [
          {
            status: 'Pickup Scheduled',
            timestamp: new Date().toISOString(),
            note: `Plan approved by ${approverName}. Dispatched to ${match.vehicleName}.`,
            operator: approverName,
          },
        ],
      });
    });

    setFoodListings(updatedListings);
    setDemandRequests(updatedDemands);
    setDeliveries((prev) => [...newDeliveries, ...prev]);

    // Update Plan Status
    const approvedPlan: AllocationPlan = {
      ...currentPlan,
      status: 'Approved',
      approvalInfo: {
        approvedBy: approverName,
        approvedAt: new Date().toISOString(),
        notes,
      },
    };
    setCurrentPlan(approvedPlan);

    updateStepStatus(7, 'Completed');
    updateStepStatus(8, 'In Progress');

    // Automatically navigate to Step 8 Delivery Tracking
    setWorkflowStepState(8);

    return { success: true };
  };

  const rejectPlan = (reason: string) => {
    if (!currentPlan) return;
    setCurrentPlan({
      ...currentPlan,
      status: 'Rejected',
    });
    updateStepStatus(7, 'Action Required', `Plan rejected: ${reason}. Please adjust parameters and recalculate.`);
  };

  const updateDeliveryStatus = (
    deliveryId: string,
    status: DeliveryStatus,
    note: string,
    operator: string
  ) => {
    setDeliveries((prev) =>
      prev.map((del) => {
        if (del.deliveryId === deliveryId) {
          const newTimeline = [
            ...del.timeline,
            {
              status,
              timestamp: new Date().toISOString(),
              note,
              operator,
            },
          ];

          return {
            ...del,
            status,
            actualPickup: status === 'Picked Up' ? new Date().toISOString() : del.actualPickup,
            actualDelivery: status === 'Delivered' ? new Date().toISOString() : del.actualDelivery,
            isDelayed: status === 'Delayed' ? true : del.isDelayed,
            timeline: newTimeline,
          };
        }
        return del;
      })
    );
  };

  const confirmDelivery = (deliveryId: string, note: string, confirmedBy: string) => {
    updateDeliveryStatus(deliveryId, 'Delivered', `Delivery accepted by recipient: ${note}`, confirmedBy);
    setDeliveries((prev) =>
      prev.map((d) =>
        d.deliveryId === deliveryId
          ? {
              ...d,
              confirmationNote: note,
              confirmedBy,
              actualDelivery: new Date().toISOString(),
              status: 'Delivered',
            }
          : d
      )
    );
  };

  const addDeliveryDelay = (deliveryId: string, delayReason: string) => {
    const del = deliveries.find((d) => d.deliveryId === deliveryId);
    if (!del) return;

    // Check if delay impacts safe-use deadline
    const deadlineTime = new Date(del.safeUseDeadline).getTime();
    const newEstArrival = new Date(new Date().getTime() + 60 * 60000).getTime();
    const safeMarginMin = Math.round((deadlineTime - newEstArrival) / 60000);

    let note = `Transit delay reported: ${delayReason}.`;
    if (safeMarginMin < 45) {
      note += ` WARNING: Safe-use buffer reduced to ${safeMarginMin} mins. Immediate expedite required!`;
      // Create high priority alert
      setAlerts((prev) => [
        {
          id: `ALT-DELAY-${Date.now().toString().slice(-4)}`,
          type: 'delay',
          severity: 'critical',
          title: `Delivery Delay Compromises Safe-Use Window (${deliveryId})`,
          message: `${del.foodName} heading to ${del.recipientName} has delay: ${delayReason}. Safe margin down to ${safeMarginMin} min!`,
          timestamp: new Date().toISOString(),
          relatedEntityId: deliveryId,
          resolved: false,
        },
        ...prev,
      ]);
    }

    updateDeliveryStatus(deliveryId, 'Delayed', note, 'Fleet Telematics');
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, resolved: true } : a)));
  };

  const resetDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_listings`);
    localStorage.removeItem(`${STORAGE_KEY}_recipients`);
    localStorage.removeItem(`${STORAGE_KEY}_demands`);
    localStorage.removeItem(`${STORAGE_KEY}_vehicles`);
    localStorage.removeItem(`${STORAGE_KEY}_plan`);
    localStorage.removeItem(`${STORAGE_KEY}_deliveries`);
    localStorage.removeItem(`${STORAGE_KEY}_safety`);
    localStorage.removeItem(`${STORAGE_KEY}_alerts`);
    localStorage.removeItem(`${STORAGE_KEY}_weights`);
    localStorage.removeItem(`${STORAGE_KEY}_users`);
    localStorage.removeItem(`${STORAGE_KEY}_current_page`);

    setFoodListings(INITIAL_FOOD_LISTINGS);
    setRecipients(INITIAL_RECIPIENTS);
    setDemandRequests(INITIAL_DEMAND_REQUESTS);
    setVehicles(INITIAL_VEHICLES);
    setCurrentPlan(null);
    setDeliveries(INITIAL_DELIVERIES);
    setSafetyLogs(INITIAL_SAFETY_LOGS);
    setAlerts(INITIAL_ALERTS);
    setUsers(INITIAL_USERS);
    setCurrentPage('dashboard');
    setScoringWeights(DEFAULT_WEIGHTS);
    setWorkflowStepState(1);
    setPrimaryNav('OVERVIEW');
  };

  const exportCsv = (dataType: 'listings' | 'recipients' | 'demands' | 'deliveries' | 'plan') => {
    let csvContent = '';
    let filename = `smart_food_${dataType}_${new Date().toISOString().slice(0, 10)}.csv`;

    if (dataType === 'listings') {
      const headers = ['ID', 'Name', 'Category', 'Quantity', 'Unit', 'SafetyStatus', 'SafeUseDeadline', 'StorageCondition', 'Provider', 'Status'];
      const rows = foodListings.map((fl) => [
        fl.id,
        `"${fl.name.replace(/"/g, '""')}"`,
        fl.category,
        fl.quantity,
        fl.unit,
        fl.safety.status,
        fl.safety.verifiedSafeUseDeadline,
        fl.safety.storageCondition,
        `"${fl.provider.name.replace(/"/g, '""')}"`,
        fl.status,
      ]);
      csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    } else if (dataType === 'recipients') {
      const headers = ['ID', 'Organization', 'Type', 'Priority', 'RequestedQty', 'Unit', 'StorageCapacity', 'StorageTypes', 'Status'];
      const rows = recipients.map((r) => [
        r.id,
        `"${r.organizationName.replace(/"/g, '""')}"`,
        r.organizationType,
        r.recipientPriority,
        r.requestedQuantity,
        r.unit,
        r.storageCapacity,
        `"${r.storageConditions.join('; ')}"`,
        r.verificationStatus,
      ]);
      csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    } else if (dataType === 'deliveries') {
      const headers = ['DeliveryID', 'PlanID', 'FoodName', 'Recipient', 'Quantity', 'Unit', 'Vehicle', 'Status', 'ScheduledPickup', 'EstimatedArrival', 'ActualDelivery'];
      const rows = deliveries.map((d) => [
        d.deliveryId,
        d.planId,
        `"${d.foodName.replace(/"/g, '""')}"`,
        `"${d.recipientName.replace(/"/g, '""')}"`,
        d.quantity,
        d.unit,
        `"${d.vehicleName.replace(/"/g, '""')}"`,
        d.status,
        d.scheduledPickup,
        d.estimatedArrival,
        d.actualDelivery || 'N/A',
      ]);
      csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    } else if (dataType === 'plan' && currentPlan) {
      const headers = ['MatchID', 'FoodListingID', 'FoodName', 'RecipientName', 'AllocatedQty', 'Unit', 'Vehicle', 'DistanceKm', 'Score', 'Reasoning'];
      const rows = currentPlan.matches.map((m) => [
        m.matchId,
        m.foodListingId,
        `"${m.foodName.replace(/"/g, '""')}"`,
        `"${m.recipientName.replace(/"/g, '""')}"`,
        m.allocatedQuantity,
        m.unit,
        `"${m.vehicleName.replace(/"/g, '""')}"`,
        m.estimatedDistanceKm,
        m.matchScore,
        `"${m.reasoning.replace(/"/g, '""')}"`,
      ]);
      csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    }

    if (!csvContent) return;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        primaryNav,
        setPrimaryNav,
        workflowStep,
        setWorkflowStep,
        workflowStepStates,
        updateStepStatus,
        activeOperationsTab,
        setActiveOperationsTab,

        foodListings,
        recipients,
        demandRequests,
        vehicles,
        currentPlan,
        deliveries,
        safetyLogs,
        alerts,
        users,
        scoringWeights,
        setScoringWeights,

        addFoodListing,
        updateFoodListing,
        cancelFoodListing,
        verifyFoodListing,
        addRecipient,
        updateRecipient,
        verifyRecipient,
        addDemandRequest,
        updateDemandRequest,
        addUser,
        updateUser,
        updateVehicle,

        generatePlan,
        approvePlan,
        rejectPlan,

        updateDeliveryStatus,
        confirmDelivery,
        addDeliveryDelay,
        dismissAlert,
        resetDemoData,
        exportCsv,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
