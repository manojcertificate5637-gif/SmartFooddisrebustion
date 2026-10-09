import React from 'react';
import { BarChart3, TrendingUp, Leaf, Award, Download, Users, Package } from 'lucide-react';
import { useFoodBridge } from '../../context/FoodBridgeContext';

export const HotelReports: React.FC = () => {
  const { currentUser, requests, listings } = useFoodBridge();

  const hotelRequests = requests.filter((r) => r.hotelId === currentUser?.uid);
  const completedHandovers = hotelRequests.filter(
    (r) => r.status === 'PICKED UP' || r.status === 'COMPLETED'
  );

  const totalMealsRedistributed = completedHandovers.reduce((sum, r) => sum + r.requestedPackets, 0);
  const co2SavedKg = Math.round(totalMealsRedistributed * 0.45 * 2.5); // 2.5 kg CO2e per kg saved

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
              Sustainability &amp; CSR Metrics
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Food Waste Diversion &amp; ESG Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Measured community nutrition support and landfill methane avoidance analytics.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Downloading official certified ESG report...')}
          className="h-9 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download ESG Certificate</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Meals Provided</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{totalMealsRedistributed}</div>
          <span className="text-xs text-slate-500 block">Portions distributed to verified trusts</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">CO₂e Emissions Prevented</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-800">{co2SavedKg} kg</div>
          <span className="text-xs text-slate-500 block">Diverted from anaerobic landfill decay</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Recipient Trusts Served</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">4 Shelters</div>
          <span className="text-xs text-slate-500 block">Direct community outreach impact</span>
        </div>
      </div>
    </div>
  );
};
