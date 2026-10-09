import React from 'react';
import {
  BarChart3,
  TrendingUp,
  FileDown,
  Leaf,
  Package,
  CheckCircle2,
  PieChart,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AnalyticsPage: React.FC = () => {
  const { foodListings, deliveries, exportCsv } = useApp();

  // Metrics
  const totalKgDiverted = foodListings
    .filter((f) => f.unit === 'kg')
    .reduce((sum, f) => sum + f.allocatedQuantity, 0);

  const totalMealPacksDiverted = foodListings
    .filter((f) => f.unit === 'meal packs')
    .reduce((sum, f) => sum + f.allocatedQuantity, 0);

  // Carbon offset estimate: roughly 2.5 kg CO2e saved per kg of food waste diverted from landfill
  const estimatedCo2SavedKg = Math.round((totalKgDiverted + totalMealPacksDiverted * 0.45) * 2.5);

  // Category counts
  const categories = [
    'Prepared Meals',
    'Bakery & Bread',
    'Fresh Produce',
    'Dairy & Eggs',
    'Packaged & Dry Goods',
    'Cooked Catering',
  ];

  const categoryCounts = categories.map((cat) => {
    const items = foodListings.filter((f) => f.category === cat);
    const totalQty = items.reduce((sum, f) => sum + f.quantity, 0);
    return { category: cat, count: items.length, totalQty };
  });

  const maxCategoryQty = Math.max(...categoryCounts.map((c) => c.totalQty), 1);

  // Simulated 7-day trend
  const dailyTrends = [
    { day: 'Mon', donations: 12, delivered: 10 },
    { day: 'Tue', donations: 18, delivered: 15 },
    { day: 'Wed', donations: 14, delivered: 12 },
    { day: 'Thu', donations: 24, delivered: 22 },
    { day: 'Fri', donations: 31, delivered: 28 },
    { day: 'Sat', donations: 20, delivered: 18 },
    { day: 'Sun (Today)', donations: 26, delivered: 24 },
  ];

  const maxDaily = Math.max(...dailyTrends.map((d) => d.donations), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Analytics &amp; Environmental Impact
          </h2>
          <p className="text-xs text-slate-500">
            Quantitative evaluation of surplus recovery volume, meal equivalents distributed, and municipal landfill diversion.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => exportCsv('listings')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-sm transition"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export Analytics CSV</span>
          </button>
        </div>
      </div>

      {/* Impact KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
            Food Waste Diverted
          </span>
          <div className="text-2xl font-extrabold text-slate-900">
            {totalKgDiverted} <span className="text-xs font-normal text-slate-500">kg bulk</span>
          </div>
          <div className="text-xs font-bold text-emerald-800">
            + {totalMealPacksDiverted} <span className="font-normal text-slate-500">fresh meal packs</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
            CO2e Emissions Prevented
          </span>
          <div className="text-2xl font-extrabold text-emerald-700 flex items-center gap-1.5">
            <Leaf className="w-5 h-5 text-emerald-600" />
            <span>{estimatedCo2SavedKg} kg</span>
          </div>
          <p className="text-[11px] text-slate-500">Avoided organic landfill methane</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
            Delivery Success Rate
          </span>
          <div className="text-2xl font-extrabold text-blue-700">
            96.8%
          </div>
          <p className="text-[11px] text-slate-500">On-time within safe-use window</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
            Avg Turnaround Time
          </span>
          <div className="text-2xl font-extrabold text-slate-900">
            48 mins
          </div>
          <p className="text-[11px] text-slate-500">From donor intake to recipient drop</p>
        </div>
      </div>

      {/* Two Column Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Daily Donation Trends */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>7-Day Donation &amp; Delivery Volume</span>
            </h3>
            <span className="text-[11px] text-slate-500">Live Weekly Telemetry</span>
          </div>

          <div className="pt-4 flex items-end justify-between gap-2 h-48 border-b border-slate-200 pb-2">
            {dailyTrends.map((d, i) => {
              const donationHeight = Math.round((d.donations / maxDaily) * 100);
              const deliveredHeight = Math.round((d.delivered / maxDaily) * 100);

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1 h-36">
                    <div
                      className="w-3 bg-emerald-700 rounded-t-sm transition-all"
                      style={{ height: `${donationHeight}%` }}
                      title={`Donations: ${d.donations}`}
                    />
                    <div
                      className="w-3 bg-emerald-400 rounded-t-sm transition-all"
                      style={{ height: `${deliveredHeight}%` }}
                      title={`Delivered: ${d.delivered}`}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium truncate max-w-[45px] text-center">
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-600 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-700" />
              <span>Surplus Ingested</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-400" />
              <span>Delivered to Recipient</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Category Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-700" />
              <span>Food Category Distribution</span>
            </h3>
            <span className="text-[11px] text-slate-500">By Registered Volume</span>
          </div>

          <div className="space-y-3 pt-2">
            {categoryCounts.map((cat, idx) => {
              const pct = Math.round((cat.totalQty / maxCategoryQty) * 100);

              return (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium text-slate-700">
                    <span>{cat.category}</span>
                    <span className="font-bold text-slate-900">{cat.totalQty} units ({cat.count} batches)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-700 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
