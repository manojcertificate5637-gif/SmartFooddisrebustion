import React, { useState } from 'react';
import { Layers, Plus, Clock, AlertCircle, CheckCircle2, Edit2, X } from 'lucide-react';
import { useFoodBridge } from '../../context/FoodBridgeContext';
import { FoodCategory, FoodRequirementItem } from '../../types/foodbridge';

interface TrustFoodRequirementsProps {
  initialSubSection?: 'add' | 'update';
}

export const TrustFoodRequirements: React.FC<TrustFoodRequirementsProps> = ({ initialSubSection = 'add' }) => {
  const { currentUser, requirements, addFoodRequirement, updateFoodRequirement } = useFoodBridge();

  const [activeTab, setActiveTab] = useState<'add' | 'update'>(initialSubSection);
  const [category, setCategory] = useState<FoodCategory>('Prepared Meals');
  const [requiredPackets, setRequiredPackets] = useState<number>(40);
  const [urgency, setUrgency] = useState<'Low' | 'Medium' | 'High' | 'Emergency'>('High');
  const [note, setNote] = useState('Daily evening meal supply for 40 resident shelter occupants.');
  const [success, setSuccess] = useState<string | null>(null);

  const trustRequirements = requirements.filter((r) => r.trustId === currentUser?.uid);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addFoodRequirement({
      trustId: currentUser?.uid || 'trust-hope-foundation',
      trustName: currentUser?.organizationName || 'Hope Horizon Trust',
      category,
      requiredPackets: Number(requiredPackets),
      urgency,
      note: note.trim(),
    });
    setSuccess('Demand requirement posted! Smart Food Match will prioritize this category.');
    setTimeout(() => setSuccess(null), 4000);
    setActiveTab('update');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Community Demand Signal
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Food Requirements &amp; Beneficiary Demand
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify your recurring meal packet needs so hotels and caterers can allocate surplus to your facility first.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('add')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'add' ? 'bg-emerald-800 text-white shadow-2xs' : 'bg-slate-100 text-slate-700'
              }`}
            >
              + Add Requirement
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('update')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'update' ? 'bg-emerald-800 text-white shadow-2xs' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Update Demand ({trustRequirements.length})
            </button>
          </div>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* FORM: ADD FOOD REQUIREMENT */}
      {activeTab === 'add' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-5">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
            Signal New Food Demand Requirement
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Food Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FoodCategory)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-xs font-medium"
                >
                  <option value="Prepared Meals">Prepared Meals</option>
                  <option value="Bakery & Bread">Bakery &amp; Bread</option>
                  <option value="Fresh Produce">Fresh Produce</option>
                  <option value="Dairy & Eggs">Dairy &amp; Eggs</option>
                  <option value="Packaged & Dry Goods">Packaged &amp; Dry Goods</option>
                  <option value="Cooked Catering">Cooked Catering</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Packets Needed *</label>
                <input
                  type="number"
                  min="5"
                  required
                  value={requiredPackets}
                  onChange={(e) => setRequiredPackets(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-emerald-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Priority Urgency *</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-xs font-semibold"
                >
                  <option value="Low">Low - General Reserve</option>
                  <option value="Medium">Medium - Regular Batch</option>
                  <option value="High">High - Impending Shortage</option>
                  <option value="Emergency">Emergency - Immediate Hunger Need</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Beneficiary Notes &amp; Dietary Context</label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Mention elderly care, orphanage dietary preferences, etc."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl resize-none text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition cursor-pointer"
              >
                Publish Demand Requirement
              </button>
            </div>
          </form>
        </div>
      )}

      {/* UPDATE DEMAND LIST */}
      {activeTab === 'update' && (
        <div className="space-y-3">
          {trustRequirements.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              No demand requirements registered yet.
            </div>
          ) : (
            trustRequirements.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{req.category}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {req.requiredPackets} pkts
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        req.urgency === 'Emergency'
                          ? 'bg-rose-100 text-rose-800'
                          : req.urgency === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {req.urgency} Urgency
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{req.note}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-slate-400">
                    Status: <strong className="text-emerald-700">{req.status}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => updateFoodRequirement(req.id, { status: req.status === 'Active' ? 'Fulfilled' : 'Active' })}
                    className="h-8 px-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
                  >
                    Mark {req.status === 'Active' ? 'Fulfilled' : 'Active'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
