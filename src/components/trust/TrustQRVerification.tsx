import React, { useState } from 'react';
import { QrCode, ShieldCheck, Lock, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { useFoodBridge } from '../../context/FoodBridgeContext';
import { QRCodeDisplay } from '../common/QRCodeDisplay';

export const TrustQRVerification: React.FC = () => {
  const { currentUser, requests } = useFoodBridge();

  const trustRequests = requests.filter((r) => r.trustId === currentUser?.uid && r.qrToken);
  const [selectedTokenReq, setSelectedTokenReq] = useState(trustRequests[0] || null);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
              Security Protocol
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            QR Code Verification &amp; Anti-Double-Claim Gate
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Every approved donation generates an opaque, single-use digital authorization token validated atomically on the server.
          </p>
        </div>

        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full shrink-0">
          {trustRequests.length} Generated Tokens
        </span>
      </div>

      {/* Security Principles Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 space-y-1">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Zero Sensitive Data in QR</span>
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            QR codes contain only opaque pseudorandom hash tokens. No passwords, donor PII, or internal keys are ever encoded.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 space-y-1">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Lock className="w-4 h-4 text-emerald-700" />
            <span>Strict Single-Scan Guarantee</span>
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Repeated scans are rejected by the backend once a pickup has been stamped as PICKED UP or COMPLETED.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 space-y-1">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Dual Confirmation State</span>
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Status moves from APPROVED &rarr; PICKED UP (by Hotel scan) &rarr; COMPLETED (when Trust confirms safe distribution).
          </p>
        </div>
      </div>

      {/* Main Content */}
      {trustRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
          <QrCode className="w-12 h-12 mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-700">No QR Tokens Issued Yet</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Submit a food request through Smart Food Match. Once approved by the donor, your digital QR code will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Token List */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
              Active Authorization Tokens
            </h2>

            <div className="space-y-2">
              {trustRequests.map((req) => {
                const isSelected = selectedTokenReq?.id === req.id;
                const isHandedOver = req.status === 'PICKED UP' || req.status === 'COMPLETED';

                return (
                  <button
                    key={req.id}
                    type="button"
                    onClick={() => setSelectedTokenReq(req)}
                    className={`w-full p-3.5 rounded-xl border text-left transition flex items-center justify-between text-xs cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{req.foodName}</span>
                        <span className="font-mono text-[10px] text-slate-500">({req.id})</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {req.hotelName} · {req.requestedPackets} {req.unit}
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isHandedOver
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Rendered QR Code */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs flex flex-col items-center">
            {selectedTokenReq && selectedTokenReq.qrToken ? (
              <QRCodeDisplay
                token={selectedTokenReq.qrToken}
                title={`Pickup QR: ${selectedTokenReq.foodName}`}
                subtitle={`For pickup at ${selectedTokenReq.hotelName}`}
                size={220}
              />
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                Select a token from the left list to display its secure QR code.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
