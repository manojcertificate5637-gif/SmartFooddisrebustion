import React, { useState } from 'react';
import {
  Compass,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Truck,
  Sparkles,
  Sliders,
  FileDown,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fetchAIPlanExplanation } from '../../services/aiService';

export const Step5Planner: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const {
    currentPlan,
    generatePlan,
    scoringWeights,
    setScoringWeights,
    exportCsv,
    setWorkflowStep,
  } = useApp();

  const [isCalculating, setIsCalculating] = useState(false);
  const [showWeightSliders, setShowWeightSliders] = useState(false);
  const [activeTab, setActiveTab] = useState<'matches' | 'infeasible' | 'unmatched' | 'unmet'>('matches');

  // AI explanation state
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiRecs, setAiRecs] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  const handleGenerate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const plan = generatePlan();
      setIsCalculating(false);
    }, 400);
  };

  const handleRequestAiExplanation = async () => {
    if (!currentPlan) return;
    setAiLoading(true);
    const res = await fetchAIPlanExplanation({
      planSummary: {
        totalMatches: currentPlan.matches.length,
        totalAllocatedKg: currentPlan.totalAllocatedKg,
        totalAllocatedMealPacks: currentPlan.totalAllocatedMealPacks,
      },
      matches: currentPlan.matches,
      constraints: {
        scoringWeights: currentPlan.scoringWeights,
      },
    });
    setAiExplanation(res.explanation);
    setAiRecs(res.recommendations);
    setAiLoading(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Step 5 of 8 · Technical Core
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Smart Redistribution Optimization Engine
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Deterministic 12-factor allocation engine resolving supply batches, recipient priorities, storage criteria, vehicle capacities, and safe-use deadlines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowWeightSliders(!showWeightSliders)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Configure Weights</span>
          </button>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isCalculating}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded shadow-xs transition"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isCalculating ? 'CALCULATING CONSTRAINTS...' : 'GENERATE REDISTRIBUTION PLAN'}</span>
          </button>
        </div>
      </div>

      {/* Configurable Weights Drawer / Panel */}
      {showWeightSliders && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded text-xs space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-800 uppercase tracking-wider">
              Deterministic Scoring Weight Calibration
            </span>
            <button
              type="button"
              onClick={() => setShowWeightSliders(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-700 font-medium">Recipient Priority (P1/P2/P3)</label>
                <span className="font-bold">{scoringWeights.priorityWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="70"
                value={scoringWeights.priorityWeight}
                onChange={(e) =>
                  setScoringWeights({ ...scoringWeights, priorityWeight: Number(e.target.value) })
                }
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-700 font-medium">Safe-Use Urgency Buffer</label>
                <span className="font-bold">{scoringWeights.expiryUrgencyWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={scoringWeights.expiryUrgencyWeight}
                onChange={(e) =>
                  setScoringWeights({ ...scoringWeights, expiryUrgencyWeight: Number(e.target.value) })
                }
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-700 font-medium">Distance Proximity</label>
                <span className="font-bold">{scoringWeights.distanceWeight}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                value={scoringWeights.distanceWeight}
                onChange={(e) =>
                  setScoringWeights({ ...scoringWeights, distanceWeight: Number(e.target.value) })
                }
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-700 font-medium">Storage Alignment</label>
                <span className="font-bold">{scoringWeights.storageFitWeight}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={scoringWeights.storageFitWeight}
                onChange={(e) =>
                  setScoringWeights({ ...scoringWeights, storageFitWeight: Number(e.target.value) })
                }
                className="w-full"
              />
            </div>
          </div>
          <div className="text-[11px] text-slate-500">
            Note: Hard constraints (food verification status, safe-use deadline expiration, cold-chain refrigeration capability, vehicle capacity) override all mathematical ranking scores.
          </div>
        </div>
      )}

      {/* Plan Results Summary Bar */}
      {currentPlan ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="text-[11px] text-slate-500 uppercase font-medium">Plan Identifier</span>
              <div className="font-mono font-bold text-slate-900 mt-0.5">{currentPlan.planId}</div>
              <div className="text-[10px] text-slate-500">Status: {currentPlan.status}</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="text-[11px] text-slate-500 uppercase font-medium">Feasible Allocations</span>
              <div className="text-lg font-bold text-emerald-700 mt-0.5">
                {currentPlan.matches.length} Matches
              </div>
              <div className="text-[10px] text-slate-500">0 duplicate claims</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="text-[11px] text-slate-500 uppercase font-medium">Meal Packs Allocated</span>
              <div className="text-lg font-bold text-blue-700 mt-0.5">
                {currentPlan.totalAllocatedMealPacks} packs
              </div>
              <div className="text-[10px] text-slate-500">Separated unit tally</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="text-[11px] text-slate-500 uppercase font-medium">Bulk Produce / Bread</span>
              <div className="text-lg font-bold text-indigo-700 mt-0.5">
                {currentPlan.totalAllocatedKg} kg
              </div>
              <div className="text-[10px] text-slate-500">Separated unit tally</div>
            </div>
          </div>

          {/* AI Operational Explanation Assistant Panel */}
          <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-lg text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="font-bold text-indigo-950 uppercase tracking-wider">
                  AI Operational Allocation Synthesis &amp; Recommendations
                </span>
              </div>
              <button
                type="button"
                onClick={handleRequestAiExplanation}
                disabled={aiLoading}
                className="px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-white hover:bg-indigo-50 rounded border border-indigo-300 transition"
              >
                {aiLoading ? 'Synthesizing...' : 'Re-synthesize with Gemini'}
              </button>
            </div>

            <p className="text-indigo-900 leading-relaxed">
              {aiExplanation || currentPlan.aiSummary}
            </p>

            {aiRecs.length > 0 && (
              <div className="pt-2 border-t border-indigo-200/60 space-y-1">
                <span className="font-semibold text-indigo-950 text-[11px]">Recommended Logistics Actions:</span>
                <ul className="list-disc pl-5 space-y-0.5 text-indigo-900 text-[11px]">
                  {aiRecs.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Detailed Allocation Navigation Subsections */}
          <div className="flex border-b border-slate-200 gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('matches')}
              className={`pb-2 px-3 border-b-2 transition ${
                activeTab === 'matches'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Proposed Allocations ({currentPlan.matches.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('infeasible')}
              className={`pb-2 px-3 border-b-2 transition ${
                activeTab === 'infeasible'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Hard Constraint Infeasible Rejections ({currentPlan.infeasibleCandidates.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('unmatched')}
              className={`pb-2 px-3 border-b-2 transition ${
                activeTab === 'unmatched'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Unmatched Surplus ({currentPlan.unmatchedFood.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('unmet')}
              className={`pb-2 px-3 border-b-2 transition ${
                activeTab === 'unmet'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Unmet Recipient Demand ({currentPlan.unmetDemand.length})
            </button>
          </div>

          {/* TAB 1: MATCHES */}
          {activeTab === 'matches' && (
            <div className="space-y-3">
              {currentPlan.matches.map((match) => (
                <div
                  key={match.matchId}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{match.matchId}</span>
                      <span className="text-slate-400">·</span>
                      <span className="font-bold text-slate-900">{match.foodName}</span>
                      <span className="text-slate-500 font-mono">({match.foodListingId})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Score: {match.matchScore}/100
                      </span>
                      <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {match.allocatedQuantity} {match.unit}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-700 pt-1">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Recipient Destination:</span>
                      <div className="font-semibold text-slate-900">{match.recipientName}</div>
                      <div className="text-[11px] text-slate-500">{match.recipientPriority}</div>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">Transport &amp; Timing:</span>
                      <div className="font-semibold text-slate-900">{match.vehicleName}</div>
                      <div className="text-[11px] text-slate-500">
                        ~{match.estimatedDistanceKm} km · {match.estimatedDurationMin} mins transit
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">Constraint Verification:</span>
                      <div className="flex items-center gap-1.5 text-emerald-700 text-[11px] font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Safety, Storage, &amp; Vehicle Feasible</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white border border-slate-200 rounded text-slate-600 text-[11px] leading-relaxed">
                    <span className="font-semibold text-slate-800">Deterministic Engine Reasoning: </span>
                    {match.reasoning}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: INFEASIBLE CANDIDATES */}
          {activeTab === 'infeasible' && (
            <div className="space-y-2">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-900">
                <span className="font-bold">Strict Constraint Filter Audit:</span> The following pairings were evaluated but rejected by hard feasibility rules (food safety, temperature-control cold chain, vehicle capacity, or deadline limits).
              </div>

              {currentPlan.infeasibleCandidates.map((cand, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 border border-rose-200 rounded text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>{cand.foodName} &rarr; {cand.recipientName}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold text-[10px]">
                      {cand.failedConstraint}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] pl-5">{cand.reason}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: UNMATCHED FOOD */}
          {activeTab === 'unmatched' && (
            <div className="space-y-2">
              {currentPlan.unmatchedFood.map((uf, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded text-xs flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900">{uf.foodName}</div>
                    <div className="text-[11px] text-slate-500">{uf.reason}</div>
                  </div>
                  <span className="font-bold text-slate-700">
                    {uf.unallocatedQty} {uf.unit} unallocated
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: UNMET DEMAND */}
          {activeTab === 'unmet' && (
            <div className="space-y-2">
              {currentPlan.unmetDemand.map((ud, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded text-xs flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900">{ud.recipientName}</div>
                    <div className="text-[11px] text-slate-500">Category: {ud.category} · {ud.reason}</div>
                  </div>
                  <span className="font-bold text-amber-700">
                    {ud.remainingQty} {ud.unit} unmet
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Actions Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => exportCsv('plan')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export Allocation Plan (CSV)</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setWorkflowStep(6)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
              >
                Inspect Transportation Plan &rarr;
              </button>
              <button
                type="button"
                onClick={() => setWorkflowStep(7)}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded shadow-xs"
              >
                Proceed to Review &amp; Approval Gate &rarr;
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-lg space-y-3">
          <Compass className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">
            No Redistribution Plan Currently Computed
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click &ldquo;GENERATE REDISTRIBUTION PLAN&rdquo; above to run the deterministic optimization solver against current surplus inventory and recipient demand.
          </p>
          <button
            type="button"
            onClick={handleGenerate}
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded"
          >
            Run Allocation Algorithm Now
          </button>
        </div>
      )}
    </div>
  );
};
