import React, { useState } from 'react';
import {
  HeartHandshake,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  QrCode,
  ShieldCheck,
  AlertTriangle,
  User,
  Phone,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useFoodBridge } from '../../context/FoodBridgeContext';
import { DonationRequestItem } from '../../types/foodbridge';
import { QRCodeDisplay } from '../common/QRCodeDisplay';

interface HotelDonationRequestsProps {
  initialFilter?: 'all' | 'pending' | 'approved' | 'rejected';
}

export const HotelDonationRequests: React.FC<HotelDonationRequestsProps> = ({ initialFilter = 'pending' }) => {
  const { currentUser, requests, approveRequest, rejectRequest, setHotelSection } = useFoodBridge();

  const [activeFilter, setActiveFilter] = useState<'pending' | 'approved' | 'rejected'>(
    initialFilter === 'all' ? 'pending' : initialFilter
  );
  const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Insufficient remaining portions due to earlier allocation.');
  const [selectedQRRequest, setSelectedQRRequest] = useState<DonationRequestItem | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Filter requests for current hotel
  const hotelRequests = requests.filter((r) => r.hotelId === currentUser?.uid);

  const pendingRequests = hotelRequests.filter((r) => r.status === 'REQUESTED');
  const approvedRequests = hotelRequests.filter(
    (r) => r.status === 'APPROVED' || r.status === 'PICKUP SCHEDULED' || r.status === 'PICKED UP'
  );
  const rejectedRequests = hotelRequests.filter((r) => r.status === 'REJECTED' || r.status === 'CANCELLED');

  const displayedRequests =
    activeFilter === 'pending'
      ? pendingRequests
      : activeFilter === 'approved'
      ? approvedRequests
      : rejectedRequests;

  const handleApprove = async (id: string) => {
    await approveRequest(id);
    setActionSuccess(`Request ${id} approved! Opaque QR token generated for Trust pickup.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleConfirmReject = async (id: string) => {
    await rejectRequest(id, rejectReason);
    setRejectingRequestId(null);
    setActionSuccess(`Request ${id} declined. Packets returned to active surplus listing.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
              Donation Requests Desk
            </span>
            <span className="text-xs text-slate-400">· Trust Claim Allocations</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Incoming Recipient Demands &amp; Approvals
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review requests from verified charitable trusts, approve allocations to generate pickup QR tokens, or decline.
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
            <span>Approved / QR</span>
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
            Rejected ({rejectedRequests.length})
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Requests Table / Cards */}
      {displayedRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <HeartHandshake className="w-12 h-12 mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-700">No {activeFilter} donation requests</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            When verified charitable trusts request your published food batches, they will appear here for one-click approval.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:border-emerald-300 transition text-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {req.id}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="font-bold text-emerald-900 text-sm">{req.foodName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      req.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : req.status === 'PICKUP SCHEDULED'
                        ? 'bg-blue-100 text-blue-800'
                        : req.status === 'PICKED UP'
                        ? 'bg-purple-100 text-purple-800'
                        : req.status === 'REQUESTED'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {req.status}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Request Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Requesting Organization</span>
                  <div className="font-bold text-slate-900 text-xs">{req.trustName}</div>
                  <div className="text-slate-600 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{req.trustPhone}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Quantity &amp; Target Time</span>
                  <div className="font-extrabold text-emerald-800 text-xs">
                    {req.requestedPackets} {req.unit}
                  </div>
                  <div className="text-slate-600 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Target: {new Date(req.requestedPickupTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Distribution Purpose</span>
                  <div className="text-slate-700 leading-snug line-clamp-2">
                    {req.recipientDetails}
                  </div>
                  {req.specialInstructions && (
                    <div className="text-[10px] text-slate-500 italic">
                      Note: {req.specialInstructions}
                    </div>
                  )}
                </div>
              </div>

              {/* QR Token Info for Approved Requests */}
              {req.qrToken && (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <span className="font-bold text-emerald-950">Active Pickup Token: </span>
                      <span className="font-mono text-emerald-800 font-semibold">{req.qrToken}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedQRRequest(req)}
                    className="text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    View QR Code
                  </button>
                </div>
              )}

              {/* Rejection Note */}
              {req.rejectionReason && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                  <strong>Declined Reason:</strong> {req.rejectionReason}
                </div>
              )}

              {/* Action Buttons for Pending Requests */}
              {req.status === 'REQUESTED' && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRejectingRequestId(req.id)}
                    className="h-9 px-4 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Decline Request</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApprove(req.id)}
                    className="h-9 px-5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve &amp; Generate QR</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectingRequestId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Decline Food Donation Request</h3>
            <p className="text-slate-600">
              Please specify the reason for declining. Packets will be restored to your active surplus listing.
            </p>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Reason for Rejection</label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl resize-none text-xs"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectingRequestId(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleConfirmReject(rejectingRequestId)}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-bold cursor-pointer"
              >
                Confirm Decline
              </button>
            </div>
          </div>
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
              title={`Pickup QR for ${selectedQRRequest.trustName}`}
              subtitle={`${selectedQRRequest.requestedPackets} pkts of ${selectedQRRequest.foodName}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};
