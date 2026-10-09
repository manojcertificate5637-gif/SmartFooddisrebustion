import React from 'react';
import {
  Sparkles,
  HeartHandshake,
  Truck,
  QrCode,
  CheckCircle2,
  Package,
  Clock,
  ArrowRight,
  Building2,
  ShieldCheck,
  TrendingUp,
  Layers,
} from 'lucide-react';
import { useFoodBridge } from '../../context/FoodBridgeContext';

export const TrustOverview: React.FC = () => {
  const { currentUser, requests, listings, requirements, setTrustSection } = useFoodBridge();

  const trustRequests = requests.filter((r) => r.trustId === currentUser?.uid);
  const pendingRequests = trustRequests.filter((r) => r.status === 'REQUESTED');
  const approvedReservations = trustRequests.filter(
    (r) => r.status === 'APPROVED' || r.status === 'PICKUP SCHEDULED'
  );
  const receivedDonations = trustRequests.filter(
    (r) => r.status === 'PICKED UP' || r.status === 'COMPLETED'
  );

  const availableSurplusNearby = listings.filter(
    (l) => l.status === 'Published' || l.status === 'Partially Reserved'
  ).length;

  const totalMealsReceived = receivedDonations.reduce((sum, r) => sum + r.requestedPackets, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Executive Platform Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#071b1e] via-[#0d2f35] to-[#12403b] text-white p-6 sm:p-7 shadow-sm border border-emerald-900/60">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/25 text-cyan-300 border border-cyan-400/30">
                Trust &amp; NGO Operations
              </span>
              <span className="text-cyan-300 text-xs font-semibold">
                {currentUser?.organizationName || 'Hope Horizon Welfare Trust'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Food Supply &amp; Relief Operations
            </h1>
            <p className="text-xs sm:text-sm text-cyan-100/90 leading-relaxed pt-0.5">
              Matching resident demand with nearby commercial food surplus, monitoring approved reservations, and managing secure QR-verified collection.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setTrustSection('match-recommended')}
              className="h-10 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Smart Food Match</span>
            </button>
            <button
              type="button"
              onClick={() => setTrustSection('pickup-reservations')}
              className="h-10 px-4 bg-[#0a2315] hover:bg-[#071b10] text-emerald-100 font-semibold text-xs rounded-xl border border-emerald-700/70 shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>View Pickup QR</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between h-[120px] hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Nearby Surplus
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 leading-none">
              {availableSurplusNearby}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Batches in zone</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between h-[120px] hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Pending Requests
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 leading-none">
              {pendingRequests.length}
            </div>
            <span className="text-[11px] text-amber-700 font-medium mt-1 block">Awaiting hotel</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between h-[120px] hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Approved QR
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-800 leading-none">
              {approvedReservations.length}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Ready for pickup</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between h-[120px] hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Active Needs
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 leading-none">
              {requirements.filter((r) => r.trustId === currentUser?.uid).length}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Demand profiles</span>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between h-[120px] hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Completed Lots
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 leading-none">
              {receivedDonations.length}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Received &amp; fed</span>
          </div>
        </div>

        {/* Metric 6 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between h-[120px] hover:border-emerald-300 transition bg-emerald-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-900">
              Portions Fed
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-800 leading-none">
              {totalMealsReceived}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Beneficiary meals</span>
          </div>
        </div>
      </div>

      {/* 3. Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left (7 cols): Approved Pickup Reservations Ready for Dispatch */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-700" />
                <span>Pickup Reservations Ready</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Approved allocations with verified QR code tokens ready for driver collection
              </p>
            </div>
            <button
              type="button"
              onClick={() => setTrustSection('pickup-reservations')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
            >
              <span>View QR Tokens</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {approvedReservations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No active pickup reservations. Use Smart Food Match to request surplus food!
              </div>
            ) : (
              approvedReservations.map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{req.foodName}</span>
                      <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">
                        {req.id}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      From: <strong>{req.hotelName}</strong> ({req.requestedPackets} {req.unit})
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setTrustSection('pickup-reservations')}
                    className="h-8 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs transition flex items-center gap-1.5 cursor-pointer self-end sm:self-center"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Show QR</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right (5 cols): Recommended Food Highlights */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Recommended Nearby Food</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Surplus batches matching your trust location
              </p>
            </div>
            <button
              type="button"
              onClick={() => setTrustSection('match-recommended')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 cursor-pointer"
            >
              Explore &rarr;
            </button>
          </div>

          <div className="space-y-2.5">
            {listings
              .filter((l) => l.status === 'Published' || l.status === 'Partially Reserved')
              .slice(0, 3)
              .map((l) => (
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
                    <span>{l.hotelName}</span>
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
