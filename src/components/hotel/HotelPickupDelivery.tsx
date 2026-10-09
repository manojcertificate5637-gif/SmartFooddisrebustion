import React, { useState } from 'react';
import {
  Truck,
  QrCode,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Phone,
  Building2,
  Search,
  Scan,
} from 'lucide-react';
import { useFoodBridge } from '../../context/FoodBridgeContext';
import { DonationRequestItem } from '../../types/foodbridge';

interface HotelPickupDeliveryProps {
  initialSubSection?: 'schedule' | 'handover' | 'completed';
}

export const HotelPickupDelivery: React.FC<HotelPickupDeliveryProps> = ({ initialSubSection = 'handover' }) => {
  const { currentUser, requests, schedulePickup, confirmPickupViaQR } = useFoodBridge();

  const [activeTab, setActiveTab] = useState<'schedule' | 'handover' | 'completed'>(initialSubSection);
  const [tokenInput, setTokenInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [validating, setValidating] = useState(false);

  // Schedule modal state
  const [schedulingReq, setSchedulingReq] = useState<DonationRequestItem | null>(null);
  const [scheduledTime, setScheduledTime] = useState(
    new Date(Date.now() + 2 * 3600000).toISOString().slice(0, 16)
  );

  // Filter requests
  const hotelRequests = requests.filter((r) => r.hotelId === currentUser?.uid);
  const approvedRequests = hotelRequests.filter((r) => r.status === 'APPROVED');
  const scheduledRequests = hotelRequests.filter((r) => r.status === 'PICKUP SCHEDULED');
  const readyForHandover = hotelRequests.filter(
    (r) => r.status === 'APPROVED' || r.status === 'PICKUP SCHEDULED'
  );
  const completedDonations = hotelRequests.filter(
    (r) => r.status === 'PICKED UP' || r.status === 'COMPLETED'
  );

  const handleVerifyToken = async (tokenToVerify?: string) => {
    const token = tokenToVerify || tokenInput;
    if (!token.trim()) return;

    setValidating(true);
    setVerificationResult(null);

    const res = await confirmPickupViaQR(token);
    setValidating(false);
    setVerificationResult(res);

    if (res.success) {
      setTokenInput('');
    }
  };

  const handleConfirmSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedulingReq) return;
    await schedulePickup(schedulingReq.id, scheduledTime);
    setSchedulingReq(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Pickup &amp; Delivery Logistics
              </span>
              <span className="text-xs text-slate-400">· Cold-Chain Safe Handovers</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              QR Code Handover &amp; Dispatch Verification
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify incoming recipient transport units using cryptographic QR tokens to prevent unauthorized claims and record real-time pickup logs.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setActiveTab('handover')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'handover'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Confirm Handover (QR Scanner)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'schedule'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Schedule Pickup ({approvedRequests.length + scheduledRequests.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'completed'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed Donations ({completedDonations.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: QR HANDOVER SCANNER & VERIFICATION CONSOLE */}
      {activeTab === 'handover' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left (7 cols): QR Validator Terminal */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Scan className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Staff Dispatch Verification Terminal
                </h2>
                <span className="text-[11px] text-slate-500">
                  Scan driver's mobile QR code or enter the opaque token code.
                </span>
              </div>
            </div>

            {verificationResult && (
              <div
                className={`p-4 rounded-xl text-xs flex items-start gap-2.5 border ${
                  verificationResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                {verificationResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <strong className="block font-bold">
                    {verificationResult.success ? 'Handover Confirmed & Locked!' : 'Verification Error'}
                  </strong>
                  <p className="mt-0.5 leading-relaxed">{verificationResult.message}</p>
                </div>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Opaque Pickup QR Token Code
                </label>
                <div className="relative">
                  <QrCode className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="e.g. FB-QR-8812-HP-40PK"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl font-mono text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Token is cryptographically verified against Firestore. Prevents repeated scans.
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={validating || !tokenInput.trim()}
                  onClick={() => handleVerifyToken()}
                  className="flex-1 h-10 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{validating ? 'Verifying with Backend...' : 'Validate Token & Confirm Handover'}</span>
                </button>
              </div>
            </div>

            {/* Quick 1-Click Test Simulation Helper */}
            {readyForHandover.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Quick Testing: Click Any Approved Reservation Token to Simulate Scan
                </span>
                <div className="space-y-1.5">
                  {readyForHandover.map((req) => (
                    <button
                      key={req.id}
                      type="button"
                      onClick={() => {
                        if (req.qrToken) {
                          setTokenInput(req.qrToken);
                          handleVerifyToken(req.qrToken);
                        }
                      }}
                      className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 text-left flex items-center justify-between text-xs transition cursor-pointer"
                    >
                      <div>
                        <span className="font-bold text-slate-900">{req.trustName}</span>
                        <span className="text-[11px] text-slate-500 ml-2">
                          ({req.requestedPackets} pkts · {req.foodName})
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded font-bold">
                        {req.qrToken || 'Token Ready'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right (5 cols): Active Ready For Handover Manifest */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-700" />
              <span>Awaiting Vehicle Arrival ({readyForHandover.length})</span>
            </h3>

            {readyForHandover.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No reservations pending pickup. All approved food has been safely handed over.
              </div>
            ) : (
              <div className="space-y-3">
                {readyForHandover.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{req.trustName}</span>
                      <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">
                        {req.id}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600">
                      Food: <strong>{req.foodName}</strong> ({req.requestedPackets} pkts)
                    </div>

                    <div className="text-[11px] text-slate-500 flex justify-between">
                      <span>Phone: {req.trustPhone}</span>
                      <span className="text-emerald-700 font-semibold">{req.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: SCHEDULE PICKUP LIST */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                Approved Reservations Scheduled for Pickup
              </h2>
              <span className="text-xs text-slate-500">
                Coordinate exact loading bay windows with recipient drivers.
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {readyForHandover.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{req.trustName}</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                      {req.id}
                    </span>
                    <span className="text-emerald-700 font-semibold">
                      {req.requestedPackets} {req.unit} of {req.foodName}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Pickup Target: {new Date(req.requestedPickupTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setSchedulingReq(req);
                      setScheduledTime(new Date(req.requestedPickupTime).toISOString().slice(0, 16));
                    }}
                    className="h-8 px-3 bg-white hover:bg-slate-100 border border-slate-300 font-semibold rounded-lg text-slate-700 transition cursor-pointer"
                  >
                    Adjust Window
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('handover');
                      if (req.qrToken) setTokenInput(req.qrToken);
                    }}
                    className="h-8 px-3 bg-emerald-700 hover:bg-emerald-800 font-bold rounded-lg text-white transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Scan QR</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: COMPLETED DONATIONS */}
      {activeTab === 'completed' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                Completed &amp; Handed-Over Surplus Food
              </h2>
              <span className="text-xs text-slate-500">
                100% verified digital handover logs with signed timestamps.
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              {completedDonations.length} Verified Runs
            </span>
          </div>

          <div className="space-y-3">
            {completedDonations.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{req.foodName}</span>
                    <span className="font-mono text-[10px] text-slate-500">({req.id})</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                    <span>{req.status}</span>
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                  <span>Recipient: <strong>{req.trustName}</strong></span>
                  <span>Quantity: <strong>{req.requestedPackets} {req.unit}</strong></span>
                  <span>Handover Verified: <strong>{new Date(req.pickupVerifiedAt || req.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Adjust Window Modal */}
      {schedulingReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Adjust Pickup Window</h3>
            <p className="text-slate-600">
              Set confirmed pickup date and time for <strong>{schedulingReq.trustName}</strong>.
            </p>

            <form onSubmit={handleConfirmSchedule} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Confirmed Pickup Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSchedulingReq(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold cursor-pointer"
                >
                  Confirm Window
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
