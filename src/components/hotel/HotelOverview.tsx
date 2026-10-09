import React from 'react';
import {
  Package,
  HeartHandshake,
  Truck,
  CheckCircle2,
  TrendingUp,
  Clock,
  Plus,
  ShieldCheck,
  Building2,
  QrCode,
  ArrowRight,
  Leaf,
  MapPin,
  AlertTriangle,
} from 'lucide-react';
import { useFoodBridge } from '../../context/FoodBridgeContext';

export const HotelOverview: React.FC = () => {
  const { currentUser, listings, requests, setHotelSection } = useFoodBridge();

  const hotelListings = listings.filter((l) => l.hotelId === currentUser?.uid);
  const hotelRequests = requests.filter((r) => r.hotelId === currentUser?.uid);

  const activeBatchesCount = hotelListings.filter((l) => l.remainingPackets > 0).length;
  const totalPacketsAvailable = hotelListings.reduce((sum, l) => sum + l.remainingPackets, 0);
  const pendingRequests = hotelRequests.filter((r) => r.status === 'REQUESTED');
  const approvedRequests = hotelRequests.filter(
    (r) => r.status === 'APPROVED' || r.status === 'PICKUP SCHEDULED'
  );
  const completedHandovers = hotelRequests.filter(
    (r) => r.status === 'PICKED UP' || r.status === 'COMPLETED'
  );

  const totalMealsRedistributed = completedHandovers.reduce((sum, r) => sum + r.requestedPackets, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Executive Platform Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#071c10] via-[#0d2f1b] to-[#123e25] text-white p-6 sm:p-7 shadow-sm border border-emerald-900/60">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/25 text-emerald-300 border border-emerald-400/30">
                Hotel Donor Command
              </span>
              <span className="text-emerald-300 text-xs font-semibold">
                {currentUser?.organizationName || 'Grand Palace Hotel & Banquets'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Right Food. Right Place. Right Time.
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed pt-0.5">
              Evaluating surplus batches, verified safe-use windows, cold-chain boundaries, and recipient trust requests to eliminate food waste.
            </p>
          </div>

          {/* Action Triggers */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setHotelSection('food-add')}
              className="h-10 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Add Surplus Food</span>
            </button>
            <button
              type="button"
              onClick={() => setHotelSection('pickup-handover')}
              className="h-10 px-4 bg-[#0a2315] hover:bg-[#071b10] text-emerald-100 font-semibold text-xs rounded-xl border border-emerald-700/70 shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>Scan Pickup QR</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metric Cards (Uniform Height & Balanced Padding) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between h-[120px] hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Active Batches
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 leading-none">
              {activeBatchesCount}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Live surplus lots</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between h-[120px] hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Available Food
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-800 leading-none">
              {totalPacketsAvailable}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Packets in stock</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between h-[120px] hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Pending Requests
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 leading-none">
              {pendingRequests.length}
            </div>
            <span className="text-[11px] text-amber-700 font-medium mt-1 block">Needs your sign-off</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between h-[120px] hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Approved Orders
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 leading-none">
              {approvedRequests.length}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium mt-1 block">QR token issued</span>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between h-[120px] hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Completed Runs
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 leading-none">
              {completedHandovers.length}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">100% verified pickup</span>
          </div>
        </div>

        {/* Metric 6 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between h-[120px] hover:border-emerald-300 transition bg-emerald-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-900">
              Meals Diverted
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-800 leading-none">
              {totalMealsRedistributed}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Portions distributed</span>
          </div>
        </div>
      </div>

      {/* 3. Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left (7 cols): Incoming Trust Requests Pending Approval */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-emerald-700" />
                <span>Pending Donation Requests</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Incoming demands from verified trusts awaiting your approval
              </p>
            </div>
            <button
              type="button"
              onClick={() => setHotelSection('requests-pending')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {pendingRequests.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No pending requests. All allocations are currently up to date!
              </div>
            ) : (
              pendingRequests.slice(0, 3).map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{req.trustName}</span>
                      <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">
                        {req.id}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Requested: <strong>{req.requestedPackets} {req.unit}</strong> of {req.foodName}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setHotelSection('requests-pending')}
                    className="h-8 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs transition cursor-pointer self-end sm:self-center"
                  >
                    Review Request
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right (5 cols): Active Food Listings Quick Glance */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-700" />
                <span>Active Surplus Lots</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Current inventory published for community pickup
              </p>
            </div>
            <button
              type="button"
              onClick={() => setHotelSection('food-available')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 cursor-pointer"
            >
              Manage &rarr;
            </button>
          </div>

          <div className="space-y-2.5">
            {hotelListings.slice(0, 3).map((l) => (
              <div
                key={l.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1"
              >
                <div className="flex justify-between items-center font-bold text-slate-900">
                  <span className="truncate">{l.foodName}</span>
                  <span className="text-emerald-800 font-extrabold shrink-0">
                    {l.remainingPackets} {l.unit}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span>{l.category}</span>
                  <span className="text-amber-800 font-medium">Safe until: {new Date(l.safeUseDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
