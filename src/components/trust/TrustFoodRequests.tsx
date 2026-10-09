import React, { useState } from 'react';
import {
  HeartHandshake,
  CheckCircle2,
  Clock,
  XCircle,
  Building2,
  QrCode,
  MapPin,
  Phone,
} from 'lucide-react';
import { useFoodBridge } from '../../context/FoodBridgeContext';
import { DonationRequestItem } from '../../types/foodbridge';
import { QRCodeDisplay } from '../common/QRCodeDisplay';

interface TrustFoodRequestsProps {
  initialFilter?: 'pending' | 'approved' | 'rejected';
}

export const TrustFoodRequests: React.FC<TrustFoodRequestsProps> = ({ initialFilter = 'pending' }) => {
  const { currentUser, requests, setTrustSection } = useFoodBridge();

  const [activeFilter, setActiveFilter] = useState<'pending' | 'approved' | 'rejected'>(initialFilter);
  const [selectedQRRequest, setSelectedQRRequest] = useState<DonationRequestItem | null>(null);

  const trustRequests = requests.filter((r) => r.trustId === currentUser?.uid);
  const pendingRequests = trustRequests.filter((r) => r.status === 'REQUESTED');
  const approvedRequests = trustRequests.filter(
    (r) => r.status === 'APPROVED' || r.status === 'PICKUP SCHEDULED'
  );
  const rejectedRequests = trustRequests.filter((r) => r.status === 'REJECTED' || r.status === 'CANCELLED');

  const displayedRequests =
    activeFilter === 'pending'
      ? pendingRequests
      : activeFilter === 'approved'
      ? approvedRequests
      : rejectedRequests;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
              Food Requests Tracker
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Donation Requests &amp; Reservation Status
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time approval transitions from hotels and access verified QR pickup tokens.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveFilter('pending')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'pending'
                ? 'bg-white text-emerald-900 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Pending</span>
            {pendingRequests.length > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px]">
                {pendingRequests.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('approved')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'approved'
                ? 'bg-white text-emerald-900 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Approved / Ready</span>
            <span className="text-[10px] text-slate-400">({approvedRequests.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('rejected')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeFilter === 'rejected'
                ? 'bg-white text-emerald-900 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Declined ({rejectedRequests.length})
          </button>
        </div>
      </div>

      {displayedRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
          <HeartHandshake className="w-12 h-12 mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-700">No {activeFilter} requests</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Use Smart Food Match to discover and request fresh food batches.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs text-xs space-y-3 hover:border-emerald-300 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {req.id}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="font-bold text-slate-900 text-sm">{req.foodName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      req.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : req.status === 'PICKUP SCHEDULED'
                        ? 'bg-blue-100 text-blue-800'
                        : req.status === 'REQUESTED'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Donor Facility</span>
                  <div className="font-bold text-slate-900 text-xs">{req.hotelName}</div>
                  <div className="text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{req.hotelAddress || 'Registered Hotel Facility'}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Quantity &amp; Pickup Window</span>
                  <div className="font-extrabold text-emerald-800 text-xs">
                    {req.requestedPackets} {req.unit}
                  </div>
                  <div className="text-slate-600 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Window: {new Date(req.requestedPickupTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Your Purpose Log</span>
                  <div className="text-slate-700 leading-snug line-clamp-2">{req.recipientDetails}</div>
                </div>
              </div>

              {/* QR Token Action */}
              {req.qrToken && (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-emerald-700" />
                    <span className="text-emerald-950 font-bold">Pickup Token Ready: </span>
                    <span className="font-mono text-emerald-800 font-semibold">{req.qrToken}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedQRRequest(req)}
                    className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs cursor-pointer"
                  >
                    Display QR Code
                  </button>
                </div>
              )}

              {/* Decline Reason */}
              {req.rejectionReason && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800">
                  <strong>Declined Reason:</strong> {req.rejectionReason}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* QR Modal */}
      {selectedQRRequest && selectedQRRequest.qrToken && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              type="button"
              onClick={() => setSelectedQRRequest(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              ✕
            </button>
            <QRCodeDisplay
              token={selectedQRRequest.qrToken}
              title={`Pickup QR for ${selectedQRRequest.hotelName}`}
              subtitle={`${selectedQRRequest.requestedPackets} pkts · ${selectedQRRequest.foodName}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};
