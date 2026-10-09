import React, { useState } from 'react';
import { History, CheckCircle2, Search, Filter, Calendar, Download, Building2 } from 'lucide-react';
import { useFoodBridge } from '../../context/FoodBridgeContext';

export const HotelDonationHistory: React.FC = () => {
  const { currentUser, requests } = useFoodBridge();
  const [searchTerm, setSearchTerm] = useState('');

  const hotelHistory = requests.filter(
    (r) => r.hotelId === currentUser?.uid && (r.status === 'PICKED UP' || r.status === 'COMPLETED')
  );

  const filteredHistory = hotelHistory.filter(
    (r) =>
      r.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.trustName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
              Audit &amp; Archival Trail
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Historical Redistribution Record
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically logged handovers with verified timestamps for regulatory ESG and tax audit compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => alert('Exporting signed CSR compliance CSV report...')}
            className="h-9 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSR Log</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by food name, trust, or ID..."
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200/70">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Food Item</th>
                <th className="py-3 px-4">Recipient Trust</th>
                <th className="py-3 px-4">Quantity Handed Over</th>
                <th className="py-3 px-4">Verified Pickup Date</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No completed donations recorded yet.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{item.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{item.foodName}</td>
                    <td className="py-3 px-4">{item.trustName}</td>
                    <td className="py-3 px-4 font-extrabold text-emerald-800">
                      {item.requestedPackets} {item.unit}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(item.pickupVerifiedAt || item.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
