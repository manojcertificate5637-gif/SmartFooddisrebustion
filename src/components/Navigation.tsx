import React from 'react';
import { LayoutDashboard, Workflow, ChartNoAxesCombined, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PrimaryNavGroup } from '../types';

export const Navigation: React.FC = () => {
  const {
    primaryNav,
    setPrimaryNav,
    alerts,
    resetDemoData,
    workflowStep,
    setWorkflowStep,
  } = useApp();

  const activeAlertCount = alerts.filter((a) => !a.resolved).length;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setPrimaryNav('OVERVIEW')}>
              <div className="w-9 h-9 rounded bg-emerald-600 flex items-center justify-center font-bold text-lg text-white shadow-sm">
                SF
              </div>
              <div>
                <span className="font-bold tracking-tight text-base sm:text-lg block leading-tight text-white">
                  SMART FOOD REDISTRIBUTION
                </span>
                <span className="text-xs text-slate-400 font-medium block">
                  Right Food. Right Place. Right Time.
                </span>
              </div>
            </div>

            <div className="hidden lg:flex items-center ml-4 pl-4 border-l border-slate-800 text-xs text-emerald-400 font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
              PROTOTYPE ENGINE ACTIVE
            </div>
          </div>

          {/* EXACTLY THREE PRIMARY NAVIGATION ICONS */}
          <nav className="flex items-center space-x-1 sm:space-x-2" aria-label="Primary Application Navigation">
            <button
              type="button"
              onClick={() => setPrimaryNav('OVERVIEW')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded transition-colors ${
                primaryNav === 'OVERVIEW'
                  ? 'bg-slate-800 text-white border-b-2 border-emerald-500 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-850'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>OVERVIEW</span>
            </button>

            <button
              type="button"
              onClick={() => setPrimaryNav('WORKFLOW')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded transition-colors ${
                primaryNav === 'WORKFLOW'
                  ? 'bg-slate-800 text-white border-b-2 border-blue-500 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Workflow className="w-4 h-4 text-blue-400" />
              <span>REDISTRIBUTION WORKFLOW</span>
            </button>

            <button
              type="button"
              onClick={() => setPrimaryNav('OPERATIONS')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded transition-colors ${
                primaryNav === 'OPERATIONS'
                  ? 'bg-slate-800 text-white border-b-2 border-amber-500 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-850'
              }`}
            >
              <ChartNoAxesCombined className="w-4 h-4 text-amber-400" />
              <span>OPERATIONS &amp; REPORTS</span>
            </button>
          </nav>

          {/* Demo Controls & Alerts indicator */}
          <div className="flex items-center gap-3">
            {activeAlertCount > 0 && (
              <button
                type="button"
                onClick={() => setPrimaryNav('OVERVIEW')}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-300 bg-amber-950/60 border border-amber-800/80 rounded hover:bg-amber-900/60"
                title={`${activeAlertCount} active alerts requiring coordinator attention`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeAlertCount} Alerts</span>
              </button>
            )}

            <button
              type="button"
              onClick={resetDemoData}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition"
              title="Reset all listings, recipients, demands, and fleet to initial baseline demonstration scenarios"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">Reset Demo</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
