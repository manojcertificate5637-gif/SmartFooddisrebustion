import React, { useState } from 'react';
import { Menu, Plus, Bell, ShieldCheck, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavPage } from '../../types';

interface TopBarProps {
  onOpenMobileSidebar: () => void;
  onOpenAddDonation: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenMobileSidebar, onOpenAddDonation }) => {
  const { currentPage, alerts, dismissAlert, setCurrentPage } = useApp();
  const [alertsOpen, setAlertsOpen] = useState(false);

  const activeAlerts = alerts.filter((a) => !a.resolved);

  const pageTitles: Record<NavPage, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Platform Dashboard',
      subtitle: 'Real-time overview of surplus food redistribution & logistics metrics',
    },
    donations: {
      title: 'Food Donation Management',
      subtitle: 'Add, filter, and monitor active surplus food contributions',
    },
    matching: {
      title: 'Recipient Matching Engine',
      subtitle: 'Compatibility scores and automated matching for verified charities & shelters',
    },
    logistics: {
      title: 'Delivery Management & Smart Logistics',
      subtitle: 'Fleet dispatch, vehicle capacity utilization, and live route telematics',
    },
    analytics: {
      title: 'Analytics & Impact Reports',
      subtitle: 'Daily redistribution trends, waste diversion metrics, and export logs',
    },
    users: {
      title: 'User & Organization Directory',
      subtitle: 'Verified donors, recipient coordinators, and logistics drivers',
    },
    settings: {
      title: 'Platform Settings & Calibration',
      subtitle: 'Algorithm scoring weights, system notifications, and demonstration controls',
    },
  };

  const { title, subtitle } = pageTitles[currentPage] || {
    title: 'Smart Food Redistribution Planner',
    subtitle: 'Connecting food surplus with community hunger relief',
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-2xs">
      {/* Left: Mobile Toggle & Page Headings */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition shrink-0"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate leading-tight">
            {title}
          </h1>
          <p className="text-[11px] text-slate-500 hidden sm:block truncate mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: Operational Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Alerts Notification Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setAlertsOpen(!alertsOpen)}
            className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition relative"
            title="System Operational Alerts"
            aria-label="View Operational Alerts"
          >
            <Bell className="w-4 h-4 text-slate-700" />
            {activeAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center border-2 border-white">
                {activeAlerts.length}
              </span>
            )}
          </button>

          {/* Quick Alerts Dropdown */}
          {alertsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-4 space-y-3 z-50 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Operational Priority Alerts ({activeAlerts.length})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAlertsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {activeAlerts.length === 0 ? (
                <div className="p-3 text-center text-slate-500 bg-slate-50 rounded-lg">
                  No unresolved operational alerts. All routes and storage constraints valid.
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {activeAlerts.map((a) => (
                    <div
                      key={a.id}
                      className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 flex justify-between items-start gap-2"
                    >
                      <div>
                        <strong className="block font-semibold">{a.title}</strong>
                        <p className="text-amber-800 leading-snug mt-0.5">{a.message}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => dismissAlert(a.id)}
                        className="text-[10px] underline font-semibold text-amber-900 shrink-0 mt-0.5"
                      >
                        Dismiss
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Primary Action Button: Donate Food */}
        <button
          type="button"
          onClick={onOpenAddDonation}
          className="h-9 px-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Donate Food</span>
          <span className="sm:hidden">Donate</span>
        </button>

        {/* Professional Operations Desk Badge */}
        <div className="flex items-center gap-2 pl-2.5 sm:pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs border border-emerald-200/80 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="hidden md:block text-left text-xs leading-tight">
            <span className="font-semibold text-slate-800 block truncate">Operations Desk</span>
            <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Coordinator
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
