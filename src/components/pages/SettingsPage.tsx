import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  RotateCcw,
  CheckCircle2,
  Bell,
  ShieldCheck,
  Server,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { scoringWeights, setScoringWeights, resetDemoData } = useApp();

  const [notificationToggles, setNotificationToggles] = useState({
    expiryWarning: true,
    telematicsDelay: true,
    newDonation: true,
    emailSummary: false,
  });

  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    resetDemoData();
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Platform Settings &amp; Configuration
          </h2>
          <p className="text-xs text-slate-500">
            Tune multi-factor allocation scoring weights, automated alerts, and baseline demonstration environments.
          </p>
        </div>
      </div>

      {resetSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>All demonstration records successfully restored to factory baseline.</span>
        </div>
      )}

      {/* Algorithm Weights Calibration */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-700" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Matching Algorithm Weights Calibration
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Adjust the relative influence of factors when generating automated donation-to-recipient compatibility scores.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs pt-2">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-700">Priority Tier (P1/P2)</span>
              <span className="text-emerald-800 font-extrabold">{scoringWeights.priorityWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              value={scoringWeights.priorityWeight}
              onChange={(e) =>
                setScoringWeights({ ...scoringWeights, priorityWeight: Number(e.target.value) })
              }
              className="w-full accent-emerald-600"
            />
            <span className="text-[10px] text-slate-400 block">Favors emergency shelters</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-700">Safe-Use Urgency</span>
              <span className="text-emerald-800 font-extrabold">{scoringWeights.expiryUrgencyWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={scoringWeights.expiryUrgencyWeight}
              onChange={(e) =>
                setScoringWeights({ ...scoringWeights, expiryUrgencyWeight: Number(e.target.value) })
              }
              className="w-full accent-emerald-600"
            />
            <span className="text-[10px] text-slate-400 block">Fast-tracks near-expiry food</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-700">Proximity &amp; Distance</span>
              <span className="text-emerald-800 font-extrabold">{scoringWeights.distanceWeight}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              value={scoringWeights.distanceWeight}
              onChange={(e) =>
                setScoringWeights({ ...scoringWeights, distanceWeight: Number(e.target.value) })
              }
              className="w-full accent-emerald-600"
            />
            <span className="text-[10px] text-slate-400 block">Minimizes transport duration</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-700">Storage Facility Match</span>
              <span className="text-emerald-800 font-extrabold">{scoringWeights.storageFitWeight}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={scoringWeights.storageFitWeight}
              onChange={(e) =>
                setScoringWeights({ ...scoringWeights, storageFitWeight: Number(e.target.value) })
              }
              className="w-full accent-emerald-600"
            />
            <span className="text-[10px] text-slate-400 block">Cold-chain refrigeration alignment</span>
          </div>
        </div>
      </div>

      {/* Notifications Preferences */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4 text-xs">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-700" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Automated Operational Alerts
          </h3>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/80 cursor-pointer">
            <div>
              <span className="font-semibold text-slate-800 block">Safe-Use Expiration Alerts</span>
              <span className="text-[11px] text-slate-500">Emit warning when safe-use window drops below 45 minutes</span>
            </div>
            <input
              type="checkbox"
              checked={notificationToggles.expiryWarning}
              onChange={(e) =>
                setNotificationToggles({ ...notificationToggles, expiryWarning: e.target.checked })
              }
              className="accent-emerald-600 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/80 cursor-pointer">
            <div>
              <span className="font-semibold text-slate-800 block">Transit Delay Telematics Notifications</span>
              <span className="text-[11px] text-slate-500">Alert dispatchers if fleet encounters road congestion</span>
            </div>
            <input
              type="checkbox"
              checked={notificationToggles.telematicsDelay}
              onChange={(e) =>
                setNotificationToggles({ ...notificationToggles, telematicsDelay: e.target.checked })
              }
              className="accent-emerald-600 w-4 h-4"
            />
          </label>
        </div>
      </div>

      {/* Demo Controls Reset */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4 text-xs">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-700" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Demonstration Environment Control
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="space-y-1">
            <span className="font-bold text-slate-900 block text-xs">
              Reset Prototype Data to Factory Baseline
            </span>
            <p className="text-slate-500 text-[11px] max-w-lg">
              Clears localStorage and reloads all 10 pristine demonstration scenarios (cold-chain tests, unverified food gates, multi-drop splits).
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shrink-0 shadow-xs transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Baseline</span>
          </button>
        </div>
      </div>
    </div>
  );
};
