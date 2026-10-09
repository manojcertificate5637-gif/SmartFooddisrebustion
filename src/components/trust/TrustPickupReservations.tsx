import React, { useState } from 'react';
import {
  Truck,
  QrCode,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { useFoodBridge } from '../../context/FoodBridgeContext';
import { QRCodeDisplay } from '../common/QRCodeDisplay';
import { DonationRequestItem } from '../../types/foodbridge';

export const TrustPickupReservations: React.FC = () => {
  const { currentUser, requests } = useFoodBridge();
  const [selectedQR, setSelectedQR] = useState<DonationRequestItem | null>(null);

  const activeReservations = requests.filter(
    (r) =>
      r.trustId === currentUser?.uid &&
      (r.status === 'APPROVED' || r.status === 'PICKUP SCHEDULED')
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
              Active Logistics Manifest
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Pickup Reservations &amp; QR Passports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Present your digital QR code upon vehicle arrival at the hotel receiving bay for instant handover sign-off.
          </p>
        </div>

        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full shrink-0">
          {activeReservations.length} Active Reservations
        </span>
      </div>

      {activeReservations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
          <Truck className="w-12 h-12 mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-700">No pickup reservations currently scheduled</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Once a hotel approves your food request, the digital pickup QR code will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {activeReservations.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border-2 border-emerald-700/30 p-6 shadow-sm space-y-4 text-xs"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                    {req.id}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 mt-1">
                    {req.foodName}
                  </h3>
                  <span className="text-emerald-700 font-semibold text-xs">
                    {req.requestedPackets} {req.unit} reserved
                  </span>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {req.status}
                </span>
              </div>

              {/* Donor Facility Coordinates */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-[11px]">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  <span>{req.hotelName}</span>
                </div>
                <div className="text-slate-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{req.hotelAddress || 'Plot 42, Marine Lines, Churchgate'}</span>
                </div>
                <div className="text-slate-600 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{req.hotelPhone || '+91 98201 44210'}</span>
                </div>
              </div>

              {/* Target Pickup Time */}
              <div className="flex items-center justify-between text-[11px] p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                <span className="text-emerald-900 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Scheduled Pickup:</span>
                </span>
                <span className="font-bold text-slate-900">
                  {new Date(req.requestedPickupTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>

              {/* Embedded QR Code Display */}
              {req.qrToken ? (
                <div className="pt-2">
                  <QRCodeDisplay
                    token={req.qrToken}
                    title="Pickup Authorization QR"
                    subtitle="Scan at Hotel Receiving Bay"
                    size={170}
                  />
                </div>
              ) : (
                <div className="p-4 text-center bg-slate-50 rounded-xl text-slate-500">
                  Generating secure pickup token...
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
