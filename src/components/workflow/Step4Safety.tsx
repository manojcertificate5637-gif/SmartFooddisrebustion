import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Clock,
  Thermometer,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  UserCheck,
  History,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Step4Safety: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { foodListings, verifyFoodListing, safetyLogs } = useApp();

  const [activeListingId, setActiveListingId] = useState<string | null>(null);
  const [inspectorName, setInspectorName] = useState('Dr. Sarah Lin (FS-88)');
  const [verificationNotes, setVerificationNotes] = useState(
    'Temperature verified with calibrated probe. Packaging tamper-evident seal confirmed intact.'
  );
  const [tempCelsius, setTempCelsius] = useState(3.2);

  const pendingListings = foodListings.filter((f) => f.safety.status !== 'Verified');
  const verifiedListings = foodListings.filter((f) => f.safety.status === 'Verified');

  const handleVerify = (id: string) => {
    verifyFoodListing(id, inspectorName, verificationNotes, tempCelsius);
    setActiveListingId(null);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            Step 4 of 8 · Safety Gate
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Food Safety Review &amp; Compliance Validation
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict verification queue enforcing safe-use deadlines, continuous cold-chain temperature thresholds, and certified verifier signatures.
          </p>
        </div>

        <button
          type="button"
          onClick={onComplete}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded"
        >
          Proceed to Smart Redistribution Planner &rarr;
        </button>
      </div>

      {/* Safety Compliance Guidance Banner */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">Deterministic Safety Enforcment Policy:</span>
          <p className="text-xs text-amber-800 leading-relaxed">
            AI-generated summaries do NOT constitute food safety certification. Listings marked &quot;Verification Required&quot;, &quot;Approaching Deadline&quot;, or &quot;Expired&quot; are strictly excluded from automated allocation approvals until certified inspection data is committed.
          </p>
        </div>
      </div>

      {/* Action Required: Items Awaiting Verification */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Inspection &amp; Verification Queue ({pendingListings.length} Flagged)</span>
          </h3>
          <span className="text-xs text-slate-500">
            Only verified items enter the approved allocation workflow
          </span>
        </div>

        {pendingListings.length === 0 ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>All current food inventory items have valid inspector certifications.</span>
          </div>
        ) : (
          <div className="space-y-2">
            {pendingListings.map((listing) => {
              const safeHoursLeft = (
                (new Date(listing.safety.verifiedSafeUseDeadline).getTime() - Date.now()) /
                (1000 * 3600)
              ).toFixed(1);

              return (
                <div
                  key={listing.id}
                  className="p-3.5 bg-slate-50 border border-amber-300 rounded flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{listing.name}</span>
                      <span className="text-slate-400">·</span>
                      <span className="font-mono text-slate-500">{listing.id}</span>
                      <span className="text-slate-400">·</span>
                      <span className="font-medium text-slate-700">{listing.quantity} {listing.unit}</span>
                    </div>

                    <div className="text-slate-600 text-[11px] flex flex-wrap items-center gap-x-3 gap-y-0.5">
                      <span>Provider: {listing.provider.name}</span>
                      <span>·</span>
                      <span>Storage Required: {listing.safety.storageCondition}</span>
                      <span>·</span>
                      <span>Safe-Use Window: {safeHoursLeft}h remaining</span>
                    </div>

                    <div className="text-amber-800 bg-amber-100/60 px-2 py-0.5 rounded text-[11px] font-medium inline-block">
                      Flag: {listing.safety.verificationNotes || 'Awaiting certified inspector review'}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveListingId(listing.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded text-xs"
                    >
                      Certify &amp; Clear Listing
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Verified Inventory Showcase */}
      <div className="space-y-3 pt-3 border-t border-slate-200">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Certified Safe Inventory Available for Allocation ({verifiedListings.length})</span>
        </h3>

        <div className="overflow-x-auto border border-slate-200 rounded">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Listing Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Available Quantity</th>
                <th className="py-2.5 px-3">Storage Condition</th>
                <th className="py-2.5 px-3">Safe-Use Deadline</th>
                <th className="py-2.5 px-3">Certified Verifier</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {verifiedListings.map((item) => {
                const hoursLeft = (
                  (new Date(item.safety.verifiedSafeUseDeadline).getTime() - Date.now()) /
                  (1000 * 3600)
                ).toFixed(1);

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-500">{item.id} · {item.provider.name}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">{item.category}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {item.remainingQuantity} {item.unit}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      {item.safety.storageCondition}
                      {item.safety.recordedTemperature && ` (${item.safety.recordedTemperature}°C)`}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px]">
                      {new Date(item.safety.verifiedSafeUseDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      <span className="text-slate-500 ml-1">({hoursLeft}h left)</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                      {item.safety.verifierName}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-emerald-700">Verified</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Trail / History */}
      <div className="space-y-2 pt-3 border-t border-slate-200">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
          <History className="w-3.5 h-3.5 text-slate-500" />
          <span>Food Safety Audit Trail Log</span>
        </h3>
        <div className="space-y-1.5 text-xs text-slate-600">
          {safetyLogs.map((log) => (
            <div key={log.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded flex justify-between items-start">
              <div>
                <span className="font-bold text-slate-800">{log.action}: {log.foodName}</span>
                <p className="text-slate-600 mt-0.5">{log.details}</p>
              </div>
              <div className="text-right shrink-0 text-[11px] text-slate-400">
                <div>{log.verifier}</div>
                <div>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certify Modal */}
      {activeListingId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Sign Off Food Safety</h3>
                <span className="text-slate-500">Certify item for automated allocation.</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveListingId(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Inspector / Verifier Name</label>
                <input
                  type="text"
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Recorded Core Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={tempCelsius}
                  onChange={(e) => setTempCelsius(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Verification Signoff Notes</label>
                <textarea
                  rows={2}
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveListingId(null)}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleVerify(activeListingId)}
                className="px-4 py-1.5 font-semibold bg-emerald-600 text-white rounded hover:bg-emerald-500"
              >
                Commit Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
