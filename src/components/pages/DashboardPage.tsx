import React from 'react';
import {
  Package,
  HeartHandshake,
  Truck,
  Users,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Clock,
  MapPin,
  Leaf,
  Plus,
  ShieldCheck,
  Building2,
  FileText,
  Sliders,
  Check,
  Thermometer,
  ShieldAlert,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DashboardPageProps {
  onOpenAddDonation: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onOpenAddDonation }) => {
  const {
    foodListings,
    recipients,
    deliveries,
    users,
    setCurrentPage,
    alerts,
    verifyFoodListing,
  } = useApp();

  // Metrics
  const totalDonationsCount = foodListings.length;
  const availableKg = foodListings
    .filter((f) => f.unit === 'kg' && f.status === 'Available')
    .reduce((sum, f) => sum + f.remainingQuantity, 0);
  const availableMealPacks = foodListings
    .filter((f) => f.unit === 'meal packs' && f.status === 'Available')
    .reduce((sum, f) => sum + f.remainingQuantity, 0);

  const successfulDeliveries = deliveries.filter((d) => d.status === 'Delivered').length;
  const inTransitDeliveries = deliveries.filter((d) => d.status === 'In Transit').length;
  const activeDonorsCount = users.filter((u) => u.role === 'Donor').length;
  const registeredRecipientsCount = recipients.length;

  // Estimated meals redistributed
  const deliveredMealPacks = deliveries
    .filter((d) => d.status === 'Delivered' && d.unit === 'meal packs')
    .reduce((sum, d) => sum + d.quantity, 0);
  const deliveredKg = deliveries
    .filter((d) => d.status === 'Delivered' && d.unit === 'kg')
    .reduce((sum, d) => sum + d.quantity, 0);
  const estimatedMealsRedistributed = deliveredMealPacks + Math.round(deliveredKg * 2.2);

  // Pending safety verifications
  const pendingVerificationListings = foodListings.filter((f) => f.safety.status !== 'Verified');
  const firstUnverified = pendingVerificationListings[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Executive Platform Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#071c10] via-[#0d2f1b] to-[#123e25] text-white p-6 sm:p-7 shadow-sm border border-emerald-900/60">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/25 text-emerald-300 border border-emerald-400/30">
                Operational Command
              </span>
              <span className="text-emerald-400 text-xs font-semibold tracking-wide">
                Smart Food Redistribution Platform
              </span>
              <span className="text-emerald-500/60 hidden sm:inline">·</span>
              <span className="text-emerald-300/80 text-xs hidden sm:inline">
                Live Local Demo Environment
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Right Food. Right Place. Right Time.
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed pt-0.5">
              Evaluating surplus food quantity, verified safe-use deadlines, temperature cold-chain boundaries, and recipient priority to minimize hunger and eliminate organic waste.
            </p>
          </div>

          {/* Top Operational Triggers */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenAddDonation}
              className="h-10 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-2 cursor-pointer focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Donate Food</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('matching')}
              className="h-10 px-4 bg-[#0a2315] hover:bg-[#071b10] text-emerald-100 font-semibold text-xs rounded-lg border border-emerald-700/70 shadow-sm transition flex items-center justify-center gap-2 cursor-pointer focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              <span>Run Matching</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Live Key Metric Cards (Uniform Height, Balanced Padding & Consistent Spacing) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {/* Metric 1: Total Donations */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between h-[120px] hover:border-emerald-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Total Donations
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-100 transition">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 leading-none">
              {totalDonationsCount}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Registered batches</span>
          </div>
        </div>

        {/* Metric 2: Available Stock */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between h-[120px] hover:border-emerald-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Available Stock
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-100 transition">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-emerald-800 leading-tight">
              {availableMealPacks} <span className="text-xs font-normal text-slate-500">packs</span>
            </div>
            <span className="text-xs font-semibold text-slate-700 mt-0.5 block">
              {availableKg} <span className="text-[10px] font-normal text-slate-500">kg bulk</span>
            </span>
          </div>
        </div>

        {/* Metric 3: Deliveries Done */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between h-[120px] hover:border-emerald-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Deliveries Done
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-100 transition">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 leading-none">
              {successfulDeliveries}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
              {inTransitDeliveries > 0 ? `${inTransitDeliveries} in transit` : '100% verified'}
            </span>
          </div>
        </div>

        {/* Metric 4: Active Donors */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between h-[120px] hover:border-emerald-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Active Donors
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-100 transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 leading-none">
              {activeDonorsCount}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Hotels &amp; kitchens</span>
          </div>
        </div>

        {/* Metric 5: Hostels & Shelters */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between h-[120px] hover:border-emerald-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Hostels &amp; Shelters
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-100 transition">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 leading-none">
              {registeredRecipientsCount}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Verified agencies</span>
          </div>
        </div>

        {/* Metric 6: Meals Redistributed */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between h-[120px] hover:border-emerald-300 transition group bg-emerald-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-900">
              Meals Saved
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-200 transition">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-800 leading-none">
              {estimatedMealsRedistributed}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Portions delivered</span>
          </div>
        </div>
      </div>

      {/* 3. Operational Content Grid: Surplus Batches & Live Telematics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Available Surplus Food Parcels */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight uppercase flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-700" />
                <span>Surplus Food Awaiting Redistribution</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Eligible batches ready for immediate matching and transport planning
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentPage('donations')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span>View All Batches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {foodListings.slice(0, 4).map((item) => {
              const safeHoursLeft = (
                (new Date(item.safety.verifiedSafeUseDeadline).getTime() - Date.now()) /
                (1000 * 3600)
              ).toFixed(1);

              const isVerified = item.safety.status === 'Verified';

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-lg border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 truncate">{item.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                        {item.id}
                      </span>
                      <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/70">
                        {item.category}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                      <span className="text-slate-700">
                        Food From: <strong className="text-slate-900 font-semibold">{item.provider.name}</strong>
                      </span>
                      <span className="text-slate-300">·</span>
                      <span>Storage: {item.safety.storageCondition}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-amber-700 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600 inline" />
                        {safeHoursLeft}h safe-use window
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <div className="text-right pr-1">
                      <span className="font-extrabold text-slate-900 text-sm block leading-tight">
                        {item.remainingQuantity} {item.unit}
                      </span>
                      <span className="text-[10px] text-slate-500">available parcels</span>
                    </div>

                    {!isVerified ? (
                      <button
                        type="button"
                        onClick={() =>
                          verifyFoodListing(item.id, 'Inspector Verification', 'Inspected and verified at desk')
                        }
                        className="h-8 px-3 bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs rounded-lg transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        title="Sign off safety verification"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verify</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setCurrentPage('matching')}
                        className="h-8 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <HeartHandshake className="w-3.5 h-3.5" />
                        <span>Match</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (5 cols): Live In-Transit Telematics */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight uppercase flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-700" />
                <span>Live Logistics Telematics</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                In-flight delivery manifests to hostels and community centers
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentPage('logistics')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 shrink-0 cursor-pointer"
            >
              Logistics Hub &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {deliveries.slice(0, 3).map((del) => (
              <div
                key={del.deliveryId}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900">{del.deliveryId}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      del.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : del.status === 'In Transit'
                        ? 'bg-blue-100 text-blue-800'
                        : del.status === 'Delayed'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {del.status}
                  </span>
                </div>

                <div className="font-semibold text-slate-800 truncate">
                  {del.foodName} ({del.quantity} {del.unit})
                </div>

                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span className="truncate pr-2">To: {del.recipientName}</span>
                  <span className="font-medium shrink-0">{del.vehicleName}</span>
                </div>

                {del.isDelayed && del.delayReason && (
                  <div className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Delay alert: {del.delayReason}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. PROFESSIONAL OPERATIONAL ACTION & DISPATCH COMMAND DOCK */}
      {/* Specifically resolves all layout, spacing, alignment, and button consistency requirements */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-5">
        {/* Section Header */}
        <div className="border-b border-slate-200/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                Action Center
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Operational Command &amp; Quick Dispatch Hub
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Coordinated intake, safety verification, hostel matching, and parcel logistics workflows.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational</span>
            </span>
          </div>
        </div>

        {/* 4 Balanced, Uniform Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Surplus Food Intake & Donate Food */}
          <div className="bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-200/90 p-4 flex flex-col justify-between space-y-4 transition">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                  <Package className="w-5 h-5 text-emerald-700" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    Surplus Food Intake
                  </h4>
                  <span className="text-[11px] text-slate-500 block truncate">
                    Food From commercial donors
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Log newly available surplus batches with safety deadlines, storage conditions, and pickup locations.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200/70 flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenAddDonation}
                className="h-10 px-3 flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-2xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Donate Food</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage('donations')}
                className="h-10 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                title="View All Surplus Parcels"
              >
                <FileText className="w-3.5 h-3.5 text-slate-600" />
                <span>Parcels</span>
              </button>
            </div>
          </div>

          {/* Card 2: Recipient & Hostel Matching */}
          <div className="bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-200/90 p-4 flex flex-col justify-between space-y-4 transition">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                  <HeartHandshake className="w-5 h-5 text-emerald-700" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    Hostel &amp; Shelter Matching
                  </h4>
                  <span className="text-[11px] text-slate-500 block truncate">
                    Demand &amp; compatibility pairing
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Connect surplus parcels to nearby Community Hostels, Crisis Shelters, and Kitchens using scoring logic.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200/70 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage('matching')}
                className="h-10 px-3 flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-lg shadow-2xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Run Matching</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage('users')}
                className="h-10 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                title="View Registered Hostels & Shelters"
              >
                <Building2 className="w-3.5 h-3.5 text-slate-600" />
                <span>Hostels</span>
              </button>
            </div>
          </div>

          {/* Card 3: Food Safety & Desk Verification */}
          <div className="bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-200/90 p-4 flex flex-col justify-between space-y-4 transition">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                  <ShieldCheck className="w-5 h-5 text-amber-700" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    Food Safety Verification
                  </h4>
                  <span className="text-[11px] text-slate-500 block truncate">
                    {pendingVerificationListings.length > 0
                      ? `${pendingVerificationListings.length} batch awaiting verify`
                      : 'All batches certified safe'}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Inspect storage conditions and certify temperature tolerances before approving parcels for dispatch.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200/70 flex items-center gap-2">
              {firstUnverified ? (
                <button
                  type="button"
                  onClick={() =>
                    verifyFoodListing(firstUnverified.id, 'Inspector Verification', 'Verified via Quick Command Dock')
                  }
                  className="h-10 px-3 flex-1 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-lg shadow-2xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  title={`Sign off verification for ${firstUnverified.name}`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify ({firstUnverified.id})</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="h-10 px-3 flex-1 bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-lg border border-emerald-200 transition flex items-center justify-center gap-1.5 cursor-default"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>All Verified</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setCurrentPage('donations')}
                className="h-10 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                title="View All Safety Logs"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-600" />
                <span>Audit</span>
              </button>
            </div>
          </div>

          {/* Card 4: Parcel Logistics & Route Telematics */}
          <div className="bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-200/90 p-4 flex flex-col justify-between space-y-4 transition">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                  <Truck className="w-5 h-5 text-emerald-700" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    Smart Parcel Logistics
                  </h4>
                  <span className="text-[11px] text-slate-500 block truncate">
                    Fleet payload &amp; live routing
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Assign temperature-controlled vehicles, optimize delivery route sequences, and track signed receipts.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200/70 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage('logistics')}
                className="h-10 px-3 flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-2xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Track Logistics</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage('analytics')}
                className="h-10 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                title="View Redistribution Reports"
              >
                <TrendingUp className="w-3.5 h-3.5 text-slate-600" />
                <span>Reports</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5. Uniform Quick Navigation Strip */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Quick Navigation:</span>
            <span className="text-slate-400">Direct operational shortcuts</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenAddDonation}
              className="h-8 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium border border-emerald-200 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Donate Food (+)</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('matching')}
              className="h-8 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium border border-emerald-200 transition flex items-center gap-1.5 cursor-pointer"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Run Matching</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('donations')}
              className="h-8 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Food Parcels</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('users')}
              className="h-8 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Hostels Directory</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('logistics')}
              className="h-8 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Delivery Management</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
