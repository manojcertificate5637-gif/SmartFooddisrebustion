import React, { useState } from 'react';
import { CheckCircle2, HeartHandshake, Package, Clock, Building2, Check } from 'lucide-react';
import { useFoodBridge } from '../../context/FoodBridgeContext';

export const TrustReceivedDonations: React.FC = () => {
  const { currentUser, requests, confirmTrustReceipt } = useFoodBridge();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const trustReceived = requests.filter(
    (r) => r.trustId === currentUser?.uid && (r.status === 'PICKED UP' || r.status === 'COMPLETED')
  );

  const handleConfirm = async (id: string, foodName: string) => {
    await confirmTrustReceipt(id);
    setSuccessMsg(`Marked ${foodName} as safely received and completed! Thank-you notification sent to hotel.`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
              Receipt Confirmation
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Received Donations &amp; Community Distribution
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Confirm physical receipt of collected food and mark meals as successfully distributed to your beneficiaries.
          </p>
        </div>

        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full shrink-0">
          {trustReceived.length} Received Batches
        </span>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {trustReceived.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
          <Package className="w-12 h-12 mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-700">No received donations recorded yet</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Once hotel staff verify your pickup via QR code, the batch will appear here to record final distribution.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {trustReceived.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs text-xs space-y-3 hover:border-emerald-300 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {req.id}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{req.foodName}</span>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    req.status === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {req.status === 'COMPLETED' ? 'Distribution Confirmed' : 'Picked Up (Pending Final Sign-Off)'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Donor Hotel</span>
                  <div className="font-bold text-slate-900 text-xs">{req.hotelName}</div>
                  <div className="text-slate-500">{req.hotelAddress}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Redistributed Quantity</span>
                  <div className="font-extrabold text-emerald-800 text-xs">
                    {req.requestedPackets} {req.unit}
                  </div>
                  <div className="text-slate-500">
                    Handover verified on: {new Date(req.pickupVerifiedAt || req.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Distribution Purpose</span>
                  <div className="text-slate-700 leading-snug line-clamp-2">{req.recipientDetails}</div>
                </div>
              </div>

              {/* Confirm Receipt Button */}
              {req.status === 'PICKED UP' && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500 text-[11px]">
                    Food has arrived at your facility. Confirm that beneficiaries were served:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleConfirm(req.id, req.foodName)}
                    className="h-8 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirm Receipt &amp; Mark Completed</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
