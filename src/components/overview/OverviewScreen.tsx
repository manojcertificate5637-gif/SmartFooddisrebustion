import React from 'react';
import {
  ArrowRight,
  ShieldAlert,
  Clock,
  Truck,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
  Play,
  RotateCcw,
  AlertTriangle,
  Building2,
  Users,
  Compass,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OverviewScreen: React.FC = () => {
  const {
    foodListings,
    recipients,
    demandRequests,
    deliveries,
    currentPlan,
    alerts,
    dismissAlert,
    setWorkflowStep,
    setPrimaryNav,
    resetDemoData,
    workflowStepStates,
    workflowStep,
    setActiveOperationsTab,
  } = useApp();

  // Calculate separate metrics (DO NOT mix kg and meal packs!)
  const availableListings = foodListings.filter((f) => f.remainingQuantity > 0 && f.status !== 'Under Review');
  const availableKg = availableListings
    .filter((f) => f.unit === 'kg')
    .reduce((acc, curr) => acc + curr.remainingQuantity, 0);
  const availableMealPacks = availableListings
    .filter((f) => f.unit === 'meal packs')
    .reduce((acc, curr) => acc + curr.remainingQuantity, 0);

  const pendingVerificationCount = foodListings.filter((f) => f.safety.status !== 'Verified').length;
  const activeListingsCount = foodListings.length;
  const pendingDemandMatches = demandRequests.filter((d) => d.requestStatus === 'Open').length;

  const proposedAllocationsCount = currentPlan?.matches.length || 0;
  const scheduledDeliveriesCount = deliveries.filter((d) => d.status === 'Pickup Scheduled' || d.status === 'In Transit').length;
  const completedDeliveriesCount = deliveries.filter((d) => d.status === 'Delivered').length;
  const unmatchedFoodCount = currentPlan?.unmatchedFood.length ?? foodListings.filter((f) => f.remainingQuantity > 0).length;

  // Delivered quantities by unit
  const deliveredKg = deliveries
    .filter((d) => d.status === 'Delivered' && d.unit === 'kg')
    .reduce((sum, d) => sum + d.quantity, 0);
  const deliveredMealPacks = deliveries
    .filter((d) => d.status === 'Delivered' && d.unit === 'meal packs')
    .reduce((sum, d) => sum + d.quantity, 0);

  const activeAlerts = alerts.filter((a) => !a.resolved);

  return (
    <div className="space-y-6">
      {/* 1. PROJECT IDENTITY & OPERATIONAL INTRODUCTION PANEL */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 sm:p-6 text-slate-100 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                Project Identity
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-300">
                Interactive Demonstration Prototype (v1.4)
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-amber-300 font-medium bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/80">
                Fictional Demonstration Data Active
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                SMART FOOD REDISTRIBUTION
              </h1>
              <span className="text-sm font-medium text-emerald-400">
                Right Food. Right Place. Right Time.
              </span>
            </div>

            {/* Original Problem Statement exact quote */}
            <div className="bg-slate-950/90 border-l-4 border-emerald-500 p-3.5 rounded-r">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Original Problem Statement
              </p>
              <p className="text-sm text-slate-200 italic font-medium leading-relaxed">
                &ldquo;Develop a system that redistributes surplus food to suitable locations by considering food quantity, type, safe-use time, demand, transportation, storage facilities, and recipient priority to reduce food wastage.&rdquo;
              </p>
            </div>

            {/* Problem Overview & Solution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300 pt-1">
              <div className="space-y-1">
                <span className="font-semibold text-slate-200 block text-xs uppercase tracking-wider">
                  Problem Overview
                </span>
                <p className="text-slate-400 leading-relaxed text-xs">
                  Surplus food frequently remains unused while nearby communities and support organizations face shortages. Our platform evaluates available food, recipient demand, safety constraints, storage capabilities, transportation resources, and recipient priority to generate feasible redistribution plans.
                </p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-slate-200 block text-xs uppercase tracking-wider">
                  Proposed Solution
                </span>
                <p className="text-slate-400 leading-relaxed text-xs">
                  The system combines deterministic allocation logic, safety validation, recipient matching, transportation planning, and delivery tracking to help coordinators redistribute eligible surplus food efficiently.
                </p>
              </div>
            </div>

            {/* Key Functional Capabilities */}
            <div className="pt-2 text-xs text-slate-400 flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-800">
              <span className="text-slate-300 font-medium">Core Architecture:</span>
              <span>12-Parameter Deterministic Allocation</span>
              <span>·</span>
              <span>Cold-Chain &amp; Safe-Use Validation</span>
              <span>·</span>
              <span>Vehicle Capacity &amp; Route Sequencing</span>
              <span>·</span>
              <span>Pre-Approval Verification Gate</span>
              <span>·</span>
              <span>Live Delivery Lifecycle Tracking</span>
            </div>
          </div>

          {/* Prominent Action Triggers */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 self-start lg:min-w-[240px]">
            <button
              type="button"
              onClick={() => setWorkflowStep(1)}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded shadow-sm transition"
            >
              <span>START REDISTRIBUTION WORKFLOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setWorkflowStep(5);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded border border-slate-700 transition"
            >
              <Play className="w-3.5 h-3.5 text-blue-400" />
              <span>EXPLORE SAMPLE DEMO (STEP 5)</span>
            </button>

            <button
              type="button"
              onClick={resetDemoData}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-slate-200 text-xs transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Demo Baseline Records</span>
            </button>
          </div>
        </div>
      </div>

      {/* A. CURRENT WORKFLOW PROGRESS (Steps 1 to 8 Overview) */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Redistribution Workflow Progress
            </h2>
            <p className="text-xs text-slate-500">
              Central operational pipeline from surplus intake to certified receipt. Current active step: Step {workflowStep}.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setPrimaryNav('WORKFLOW');
            }}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Open Step Workflow</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => {
            const stepInfo = workflowStepStates[s];
            const isCurrent = workflowStep === s;
            let statusColor = 'text-slate-500 bg-slate-50 border-slate-200';
            if (stepInfo.status === 'Completed') {
              statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-300';
            } else if (stepInfo.status === 'Action Required') {
              statusColor = 'text-amber-700 bg-amber-50 border-amber-300';
            } else if (stepInfo.status === 'In Progress') {
              statusColor = 'text-blue-700 bg-blue-50 border-blue-300';
            } else if (stepInfo.status === 'Awaiting Approval') {
              statusColor = 'text-indigo-700 bg-indigo-50 border-indigo-300';
            }

            return (
              <button
                key={s}
                type="button"
                onClick={() => setWorkflowStep(s)}
                className={`p-2.5 text-left border rounded transition relative flex flex-col justify-between ${
                  isCurrent ? 'ring-2 ring-slate-900 bg-white shadow-xs' : 'hover:bg-slate-50'
                } ${statusColor}`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span>STEP {s}</span>
                    {stepInfo.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    {stepInfo.status === 'Action Required' && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                  </div>
                  <div className="text-xs font-medium line-clamp-1 text-slate-800">
                    {stepInfo.title.replace('Register Surplus Food', 'Food Intake')
                      .replace('Manage Recipients', 'Recipients')
                      .replace('Assess Demand', 'Demand')
                      .replace('Validate Food Safety', 'Safety Check')
                      .replace('Generate Redistribution Plan', 'Smart Plan')
                      .replace('Optimize Transportation', 'Transport')
                      .replace('Review and Approve', 'Approval')
                      .replace('Track Delivery', 'Tracking')}
                  </div>
                </div>
                <div className="mt-2 pt-1 border-t border-slate-200/60 text-[10px] uppercase font-semibold text-slate-500">
                  {stepInfo.status}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* KEY OPERATIONAL METRICS (Separate Units!) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Available Surplus (separated units) */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
            Available Surplus Food
          </div>
          <div className="space-y-0.5">
            <div className="text-xl font-bold text-slate-900">
              {availableKg} <span className="text-xs font-normal text-slate-500">kg bulk produce/bread</span>
            </div>
            <div className="text-lg font-bold text-slate-700">
              {availableMealPacks} <span className="text-xs font-normal text-slate-500">prepared meal packs</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span>{availableListings.length} active batches ready</span>
          </div>
        </div>

        {/* Metric 2: Recipient Demand */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
            Pending Recipient Matches
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {pendingDemandMatches}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Across {recipients.filter((r) => r.isActive).length} verified community agencies
          </div>
        </div>

        {/* Metric 3: Proposed & Active Allocations */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
            Proposed Allocations
          </div>
          <div className="text-2xl font-bold text-blue-700">
            {proposedAllocationsCount}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {scheduledDeliveriesCount} scheduled · {completedDeliveriesCount} completed
          </div>
        </div>

        {/* Metric 4: Safety Reviews Required */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
            Safety Reviews Required
          </div>
          <div className="text-2xl font-bold text-amber-600">
            {pendingVerificationCount}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {unmatchedFoodCount} food listings unmatched
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID: B. Priority Alerts & E. Allocation Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* B. PRIORITY ALERTS */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Priority Logistical &amp; Safety Alerts
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              {activeAlerts.length} unresolved
            </span>
          </div>

          <div className="space-y-2.5">
            {activeAlerts.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded border border-slate-100">
                All food safety, storage compatibility, and dispatch criteria are currently satisfied.
              </div>
            ) : (
              activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded border text-xs flex items-start justify-between gap-3 ${
                    alert.severity === 'critical'
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <span className="uppercase tracking-wider text-[10px] px-1.5 py-0.2 bg-white/70 rounded border border-black/10">
                        {alert.type}
                      </span>
                      <span>{alert.title}</span>
                    </div>
                    <p className="text-xs opacity-90 leading-relaxed">{alert.message}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => dismissAlert(alert.id)}
                    className="shrink-0 text-[11px] underline opacity-75 hover:opacity-100 font-medium pt-0.5"
                  >
                    Acknowledge
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 text-xs text-slate-500 flex justify-between items-center border-t border-slate-100">
            <span>Enforces zero-tolerance safety gate prior to plan approval.</span>
            <button
              type="button"
              onClick={() => setWorkflowStep(4)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Open Safety Center &rarr;
            </button>
          </div>
        </div>

        {/* E. CURRENT ALLOCATION SUMMARY */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Current Allocation Summary
            </h2>
            <span className="text-xs text-slate-500">
              Plan Status: {currentPlan?.status || 'No Plan Active'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium block uppercase tracking-wider">
                Proposed
              </span>
              <span className="text-lg font-bold text-blue-700 block mt-1">
                {currentPlan?.totalAllocatedMealPacks || 0} packs
              </span>
              <span className="text-xs text-slate-600 block">
                {currentPlan?.totalAllocatedKg || 0} kg bulk
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium block uppercase tracking-wider">
                Approved
              </span>
              <span className="text-lg font-bold text-emerald-700 block mt-1">
                {currentPlan?.status === 'Approved' ? currentPlan.totalAllocatedMealPacks : 0} packs
              </span>
              <span className="text-xs text-slate-600 block">
                {currentPlan?.status === 'Approved' ? currentPlan.totalAllocatedKg : 0} kg bulk
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium block uppercase tracking-wider">
                Delivered
              </span>
              <span className="text-lg font-bold text-slate-900 block mt-1">
                {deliveredMealPacks} packs
              </span>
              <span className="text-xs text-slate-600 block">
                {deliveredKg} kg bulk
              </span>
            </div>
          </div>

          {currentPlan ? (
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-700 font-medium">
                <span>Active Plan ID: {currentPlan.planId}</span>
                <span>{currentPlan.matches.length} matched drops</span>
              </div>
              <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-100">
                {currentPlan.aiSummary}
              </p>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setWorkflowStep(5)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
                >
                  Inspect Matches
                </button>
                <button
                  type="button"
                  onClick={() => setWorkflowStep(7)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded"
                >
                  Review &amp; Approve Gate
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center bg-slate-50 rounded border border-slate-100 text-xs text-slate-500">
              No redistribution plan currently calculated. Click below to execute the 12-factor engine.
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setWorkflowStep(5)}
                  className="px-4 py-2 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800"
                >
                  Open Smart Redistribution Planner
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* C. RECENT ACTIVITY & D. QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* D. QUICK ACTIONS */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Quick Operational Actions
          </h2>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setWorkflowStep(1)}
              className="w-full flex items-center justify-between p-3 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs font-medium text-slate-800 transition"
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-600" />
                <span>Register New Surplus Food Batch</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => setWorkflowStep(2)}
              className="w-full flex items-center justify-between p-3 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs font-medium text-slate-800 transition"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Add / Verify Recipient Agency</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => setWorkflowStep(5)}
              className="w-full flex items-center justify-between p-3 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs font-medium text-slate-800 transition"
            >
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-600" />
                <span>Generate Redistribution Plan</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => {
                setPrimaryNav('OPERATIONS');
                setActiveOperationsTab('reports');
              }}
              className="w-full flex items-center justify-between p-3 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs font-medium text-slate-800 transition"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600" />
                <span>Export Audit Reports (CSV)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* C. RECENT ACTIVITY STREAM */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Recent Application &amp; Fleet Events
            </h2>
            <span className="text-xs text-slate-500">Live Telematics &amp; Workflow Log</span>
          </div>

          <div className="space-y-2.5">
            {deliveries.slice(0, 4).map((del) => (
              <div
                key={del.deliveryId}
                className="flex items-start justify-between p-3 bg-slate-50 rounded border border-slate-100 text-xs"
              >
                <div className="space-y-1">
                  <div className="font-semibold text-slate-900 flex items-center gap-2">
                    <span>{del.deliveryId}</span>
                    <span className="text-slate-400">·</span>
                    <span>{del.foodName}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-normal text-slate-600">{del.quantity} {del.unit}</span>
                  </div>
                  <div className="text-slate-500 flex items-center gap-2 text-[11px]">
                    <span>To: {del.recipientName}</span>
                    <span>·</span>
                    <span>Vehicle: {del.vehicleName}</span>
                  </div>
                  {del.isDelayed && del.delayReason && (
                    <div className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-medium border border-amber-200">
                      Alert: {del.delayReason}
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`inline-block px-2 py-0.5 rounded font-semibold text-[11px] ${
                      del.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : del.status === 'In Transit'
                        ? 'bg-blue-100 text-blue-800'
                        : del.status === 'Delayed'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {del.status}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {new Date(del.scheduledPickup).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
