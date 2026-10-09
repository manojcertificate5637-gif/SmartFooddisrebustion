import React from 'react';
import {
  LayoutDashboard,
  Package,
  HeartHandshake,
  Truck,
  BarChart3,
  Users,
  Settings,
  RotateCcw,
  Menu,
  X,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavPage } from '../../types';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { currentPage, setCurrentPage, alerts, resetDemoData, deliveries } = useApp();

  const activeAlerts = alerts.filter((a) => !a.resolved).length;
  const inTransitCount = deliveries.filter((d) => d.status === 'In Transit').length;

  const navItems: { id: NavPage; label: string; icon: React.FC<{ className?: string }>; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'donations', label: 'Food Donations', icon: Package },
    { id: 'matching', label: 'Recipient Matching', icon: HeartHandshake },
    { id: 'logistics', label: 'Delivery & Logistics', icon: Truck, badge: inTransitCount > 0 ? `${inTransitCount} live` : undefined },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0a2315] border-r border-emerald-900/40 text-emerald-100 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-emerald-900/60 bg-[#071b10]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-sm text-sm">
              SF
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white block leading-tight">
                Smart Food Platform
              </span>
              <span className="text-[10px] text-emerald-400 font-medium block">
                Right Food · Right Time
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-emerald-400 hover:text-white p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Sidebar Navigation">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-emerald-500/80">
            Navigation Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCurrentPage(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-sm font-semibold'
                    : 'text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-semibold border border-emerald-500/40">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info & Reset Demo */}
        <div className="p-3 border-t border-emerald-900/60 bg-[#071b10] space-y-2">
          {activeAlerts > 0 && (
            <div className="p-2 rounded bg-amber-950/60 border border-amber-800/60 text-amber-300 text-[11px] flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{activeAlerts} system alerts active</span>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-emerald-400 px-1 pt-1">
            <span>Demo Mode Active</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <button
            type="button"
            onClick={resetDemoData}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs text-emerald-300 bg-emerald-900/50 hover:bg-emerald-900 border border-emerald-800/80 transition"
          >
            <RotateCcw className="w-3 h-3 text-emerald-400" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </aside>
    </>
  );
};
