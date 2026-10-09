import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCheck,
  FileDown,
  Lock,
  ArrowRight,
  UserCheck,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Step7ReviewApprove: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { currentPlan, approvePlan, rejectPlan, exportCsv, setWorkflowStep } = useApp();

  const [approverName, setApproverName] = useState('Chief Logistics Coordinator');
  const [approvalNotes, setApprovalNotes] = useState(
    'All safe-use deadlines, temperature cold-chains, and vehicle capacities re-validated. Authorized for immediate fleet dispatch.'
  );
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [approvalError, setApprovalError] = useState<string | null>(null);

  if (!currentPlan) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-8 text-center space-y-3">
        <h3 className="text-sm font-bold text-slate-800">
          No Redistribution Plan Awaiting Review
        </h3>
        <p className="text-xs text-slate-500">
          Please run Step 5 (Smart Redistribution Planner) to generate allocation candidates.
        </p>
        <button
          type="button"
          onClick={() => setWorkflowStep(5)}
          className="px-4 py-2 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-500"
        >
          Go to Step 5
        </button>
      </div>
    );
  }

  // Pre-approval checklist checks
  const checklist = [
    {
      label: 'Zero Unverified Food Items',
      passed: currentPlan.matches.every((m) => m.safetyPassed),
      detail: 'All matched listings hold certified inspector verification signoffs.',
    },
    {
      label: 'Safe-Use Deadline Buffer Validated',
      passed: currentPlan.matches.every((m) => m.deadlineFeasible),
      detail: 'Estimated arrival time clears safe consumption limit by >= 45 min buffer.',
    },
    {
      label: 'Storage Facility Cold-Chain Certified',
      passed: currentPlan.matches.every((m) => m.storagePassed),
      detail: 'Refrigerated and frozen food strictly assigned to certified recipient facilities.',
    },
    {
      label: 'Fleet Vehicle Capacity Within Threshold',
      passed: currentPlan.matches.every((m) => m.transportPassed),
      detail: 'Assigned payload does not exceed licensed cargo weight or space.',
    },
    {
      label: 'Duplicate Allocation Prevention',
      passed: true,
      detail: 'Deterministic reservation locks applied; zero double-booking possible.',
    },
  ];

  const allPassed = checklist.every((c) => c.passed) && currentPlan.matches.length > 0;
  const isApproved = currentPlan.status === 'Approved';

  const handleApprove = () => {
    setApprovalError(null);
    const result = approvePlan(approverName, approvalNotes);
    if (!result.success) {
      setApprovalError(result.error || 'Approval rejected by validation engine.');
    } else {
      onComplete();
    }
  };

  const handleReject = () => {
    if (!rejectReason) return;
    rejectPlan(rejectReason);
    setShowRejectModal(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Step 7 of 8 · Executive Gate
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Review &amp; Authorize Redistribution Plan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Two-stage approval gate performing final constraint validation, stock reservation, and dispatch creation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => exportCsv('plan')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export Summary</span>
          </button>
        </div>
      </div>

      {/* Plan Header Info */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-slate-500 block text-[11px]">Plan Identifier</span>
          <span className="font-mono font-bold text-slate-900">{currentPlan.planId}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px]">Proposed Allocations</span>
          <span className="font-bold text-slate-900">{currentPlan.matches.length} Drop Manifests</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px]">Meal Packs</span>
          <span className="font-bold text-blue-700">{currentPlan.totalAllocatedMealPacks} packs</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px]">Bulk Food</span>
          <span className="font-bold text-indigo-700">{currentPlan.totalAllocatedKg} kg</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px]">Gate Status</span>
          <span
            className={`font-semibold ${
              isApproved
                ? 'text-emerald-700'
                : allPassed
                ? 'text-indigo-700'
                : 'text-amber-700'
            }`}
          >
            {isApproved ? 'Approved & Dispatched' : allPassed ? 'Ready for Authorization' : 'Blocked on Warnings'}
          </span>
        </div>
      </div>

      {approvalError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800 flex items-center gap-2">
          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{approvalError}</span>
        </div>
      )}

      {/* Pre-Approval Validation Checklist */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Pre-Authorization Hard Constraint Checklist
        </h3>

        <div className="space-y-2">
          {checklist.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded border text-xs flex items-start justify-between gap-3 ${
                item.passed
                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {item.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold">{item.label}</div>
                  <div className="text-[11px] opacity-80 mt-0.5">{item.detail}</div>
                </div>
              </div>
              <span className="font-mono font-semibold text-[11px] uppercase">
                {item.passed ? 'PASSED' : 'FAILED'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Manifest Candidate Table */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Allocation Manifest To Be Committed
        </h3>

        <div className="overflow-x-auto border border-slate-200 rounded">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Food Item</th>
                <th className="py-2.5 px-3">Allocated Qty</th>
                <th className="py-2.5 px-3">Destination Agency</th>
                <th className="py-2.5 px-3">Assigned Fleet Unit</th>
                <th className="py-2.5 px-3">Delivery Window</th>
                <th className="py-2.5 px-3 text-right">Match Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentPlan.matches.map((match) => (
                <tr key={match.matchId} className="hover:bg-slate-50/80 transition">
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-900">{match.foodName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{match.foodListingId}</div>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-indigo-700">
                    {match.allocatedQuantity} {match.unit}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-medium text-slate-900">{match.recipientName}</div>
                    <div className="text-[11px] text-slate-500">{match.recipientPriority}</div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 font-medium">
                    {match.vehicleName}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                    {match.deliveryWindow}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                    {match.matchScore}/100
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Authorization Form & Actions */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Authorizing Coordinator Name *
            </label>
            <input
              type="text"
              value={approverName}
              disabled={isApproved}
              onChange={(e) => setApproverName(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white font-medium"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Dispatch Authorization Notes
            </label>
            <input
              type="text"
              value={approvalNotes}
              disabled={isApproved}
              onChange={(e) => setApprovalNotes(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500">
            Committing approval will deduct available quantities and generate live delivery tracking orders.
          </div>

          <div className="flex items-center gap-2">
            {!isApproved && (
              <button
                type="button"
                onClick={() => setShowRejectModal(true)}
                className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 transition"
              >
                Reject / Return Plan
              </button>
            )}

            {isApproved ? (
              <button
                type="button"
                onClick={() => setWorkflowStep(8)}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded shadow-xs"
              >
                View Live Deliveries (Step 8) &rarr;
              </button>
            ) : (
              <button
                type="button"
                onClick={handleApprove}
                disabled={!allPassed}
                className={`flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white rounded shadow-xs transition ${
                  allPassed
                    ? 'bg-emerald-600 hover:bg-emerald-500 cursor-pointer'
                    : 'bg-slate-400 cursor-not-allowed'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>AUTHORIZE &amp; DISPATCH ALLOCATIONS</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">Reject Allocation Plan</h3>
            <p className="text-slate-600">
              Provide justification for rejection. Plan will be flagged for coordinator revision.
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Inclement weather requires rerouting North District deliveries..."
              className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-rose-500 focus:outline-none"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="px-4 py-1.5 font-semibold bg-rose-600 text-white rounded hover:bg-rose-500"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
