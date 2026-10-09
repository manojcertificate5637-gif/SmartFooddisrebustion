import React from 'react';
import { Settings, ShieldCheck, User, Building2, Bell, RotateCcw } from 'lucide-react';
import { useFoodBridge } from '../../context/FoodBridgeContext';

export const SettingsPanel: React.FC = () => {
  const { currentUser } = useFoodBridge();

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-xs">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-1">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Organization &amp; System Settings
        </h1>
        <p className="text-slate-500">
          Manage your FoodBridge AI notification preferences and facility profile credentials.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase">
          Organization Profile Credentials
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Organization Name</span>
            <div className="font-bold text-slate-900 text-sm">{currentUser?.organizationName}</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Account Role</span>
            <div className="font-bold text-slate-900 capitalize">{currentUser?.role}</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Contact Email</span>
            <div className="font-medium text-slate-800">{currentUser?.email}</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Phone Number</span>
            <div className="font-medium text-slate-800">{currentUser?.phone}</div>
          </div>
        </div>

        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <div>
              <span className="font-bold text-emerald-950 block">Admin Verification Status</span>
              <span className="text-emerald-800 capitalize font-medium">{currentUser?.verificationStatus}</span>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-700 text-white font-bold rounded-lg text-[10px]">
            ACTIVE
          </span>
        </div>
      </div>
    </div>
  );
};
