import React from 'react';
import { X, ShieldCheck, Heart, Leaf, Award, Globe, Users } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
            FB
          </div>
          <span className="font-bold text-xs uppercase tracking-wider text-emerald-800">
            About FoodBridge AI
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Right Food. Right Place. Right Time.
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          FoodBridge AI is an enterprise-grade food redistribution and logistics optimization platform designed to eliminate edible food waste while supporting verified charities, shelters, and orphanages.
        </p>

        <div className="my-6 space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-semibold">Cold-Chain &amp; Safety Compliance</strong>
              <span className="text-slate-600">Every listing verifies preparation times, safe-use deadlines, and temperature tolerances to ensure meal integrity.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <Heart className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-semibold">Strict Organization Verification</strong>
              <span className="text-slate-600">All hotels, caterers, and recipient trusts must be certified by platform administrators before allocations are executed.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <Leaf className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-semibold">Zero Organic Waste Diversion</strong>
              <span className="text-slate-600">Preventing edible surplus from entering landfills, directly reducing methane emissions and carbon footprint.</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Version 2.4.0 · Cloud Firestore Integrated</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
