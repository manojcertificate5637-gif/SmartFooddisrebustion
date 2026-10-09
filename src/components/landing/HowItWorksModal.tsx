import React from 'react';
import { X, CheckCircle2, ShieldCheck, QrCode, Truck, HeartHandshake, ArrowRight } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole?: (role: 'hotel' | 'trust') => void;
}

export const HowItWorksModal: React.FC<ModalProps> = ({ isOpen, onClose, onSelectRole }) => {
  if (!isOpen) return null;

  const steps = [
    {
      step: '01',
      title: 'Surplus Food Published',
      actor: 'Hotel & Restaurant',
      desc: 'Commercial kitchens list excess banquet or buffet food with preparation time, vegetarian tags, safe-use deadline, and storage conditions.',
      icon: CheckCircle2,
    },
    {
      step: '02',
      title: 'Smart Matching & Discovery',
      actor: 'Charitable Trust & NGO',
      desc: 'Trusts discover eligible batches ranked by compatibility scores, travel distance, dietary preferences, and verified cold-chain constraints.',
      icon: HeartHandshake,
    },
    {
      step: '03',
      title: 'Reservation & Allocation',
      actor: 'Dual Confirmation',
      desc: 'The Trust requests specific packet quantities. The Hotel reviews and approves the request, locking inventory atomically.',
      icon: ShieldCheck,
    },
    {
      step: '04',
      title: 'QR Code Handover Verification',
      actor: 'Logistics Handover',
      desc: 'A secure opaque QR code token is generated. On-site staff scan or verify the token to confirm physical pickup, preventing double-claims.',
      icon: QrCode,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
            End-To-End Workflow
          </span>
          <span className="text-xs text-slate-500">FoodBridge AI Platform Architecture</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          How FoodBridge AI Works
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 mb-6">
          A closed-loop, verified redistribution system ensuring zero food wastage and guaranteed food safety for underprivileged communities.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-extrabold text-emerald-700 text-xs px-2 py-0.5 bg-emerald-100/70 rounded">
                    Step {s.step}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">
                    {s.actor}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Icon className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{s.title}</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">{s.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-500">Ready to join our redistribution network?</span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                onClose();
                onSelectRole?.('hotel');
              }}
              className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold transition cursor-pointer"
            >
              Register Hotel
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onSelectRole?.('trust');
              }}
              className="flex-1 sm:flex-initial px-4 py-2 bg-[#0a2315] hover:bg-[#071b10] text-emerald-100 rounded-lg font-semibold transition cursor-pointer"
            >
              Register Trust
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
