import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Eye,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FoodCategory, FoodListing } from '../../types';

interface DonationsPageProps {
  onOpenAddDonation: () => void;
}

export const DonationsPage: React.FC<DonationsPageProps> = ({ onOpenAddDonation }) => {
  const { foodListings, updateFoodListing, cancelFoodListing, setCurrentPage } = useApp();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedListing, setSelectedListing] = useState<FoodListing | null>(null);
  const [editListing, setEditListing] = useState<FoodListing | null>(null);

  const filteredListings = foodListings.filter((fl) => {
    const matchesSearch =
      fl.name.toLowerCase().includes(search.toLowerCase()) ||
      fl.id.toLowerCase().includes(search.toLowerCase()) ||
      fl.provider.name.toLowerCase().includes(search.toLowerCase()) ||
      fl.pickup.address.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || fl.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || fl.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editListing) return;
    updateFoodListing(editListing.id, {
      name: editListing.name,
      quantity: Number(editListing.quantity),
      remainingQuantity: Number(editListing.remainingQuantity),
      description: editListing.description,
    });
    setEditListing(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Surplus Food Donation Registry
          </h2>
          <p className="text-xs text-slate-500">
            Monitor, update, and manage surplus batches logged by registered commercial and community food providers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenAddDonation}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Surplus Donation</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search food item, donor, address, ID..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700 font-medium"
          >
            <option value="All">All Food Categories</option>
            <option value="Prepared Meals">Prepared Meals</option>
            <option value="Bakery & Bread">Bakery &amp; Bread</option>
            <option value="Fresh Produce">Fresh Produce</option>
            <option value="Dairy & Eggs">Dairy &amp; Eggs</option>
            <option value="Packaged & Dry Goods">Packaged &amp; Dry Goods</option>
            <option value="Cooked Catering">Cooked Catering</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700 font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Partially Allocated">Partially Allocated</option>
            <option value="Fully Allocated">Fully Allocated</option>
            <option value="Expired">Cancelled / Expired</option>
            <option value="Under Review">Under Review</option>
          </select>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Item &amp; ID</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Total Qty</th>
                <th className="py-3 px-4">Remaining</th>
                <th className="py-3 px-4">Storage</th>
                <th className="py-3 px-4">Safe-Use Window</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredListings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No food donations match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredListings.map((item) => {
                  const safeHoursLeft = (
                    (new Date(item.safety.verifiedSafeUseDeadline).getTime() - Date.now()) /
                    (1000 * 3600)
                  ).toFixed(1);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
                          <span>{item.id}</span>
                          <span>·</span>
                          <span>{item.provider.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">{item.category}</td>
                      <td className="py-3 px-4 text-slate-700">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-800">
                        {item.remainingQuantity} {item.unit}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {item.safety.storageCondition}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <div className="font-mono text-[11px]">
                          {new Date(item.safety.verifiedSafeUseDeadline).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <span className="text-[10px] text-slate-400">{safeHoursLeft}h left</span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold text-[11px] px-2 py-0.5 rounded-full ${
                            item.status === 'Available'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'Partially Allocated'
                              ? 'bg-blue-100 text-blue-800'
                              : item.status === 'Fully Allocated'
                              ? 'bg-slate-200 text-slate-700'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedListing(item)}
                            className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditListing(item)}
                            className="p-1 text-slate-500 hover:text-blue-700 rounded hover:bg-slate-100"
                            title="Edit Listing"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {item.status !== 'Expired' && (
                            <button
                              type="button"
                              onClick={() => cancelFoodListing(item.id)}
                              className="p-1 text-slate-500 hover:text-rose-700 rounded hover:bg-slate-100"
                              title="Cancel / Archive Donation"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 text-xs">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-slate-500">{selectedListing.id}</span>
                <h3 className="text-base font-bold text-slate-900">{selectedListing.name}</h3>
                <span className="text-slate-600">{selectedListing.category}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedListing(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Total Quantity</span>
                <span className="font-bold text-slate-800">{selectedListing.quantity} {selectedListing.unit}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Remaining Stock</span>
                <span className="font-bold text-emerald-700">{selectedListing.remainingQuantity} {selectedListing.unit}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Storage Environment</span>
                <span className="font-bold text-slate-800">{selectedListing.safety.storageCondition}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Safe-Use Deadline</span>
                <span className="font-bold text-slate-800">
                  {new Date(selectedListing.safety.verifiedSafeUseDeadline).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="font-semibold text-slate-700">Donor Information:</span>
              <p className="text-slate-600">
                {selectedListing.provider.name} · {selectedListing.provider.contactPerson} · {selectedListing.provider.phone}
              </p>
              <p className="text-slate-500">Pickup Address: {selectedListing.pickup.address}</p>
            </div>

            {selectedListing.description && (
              <div className="space-y-1">
                <span className="font-semibold text-slate-700">Description &amp; Handling:</span>
                <p className="text-slate-600">{selectedListing.description}</p>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedListing(null);
                  setCurrentPage('matching');
                }}
                className="px-4 py-2 font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg"
              >
                Find Recipient Match
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Listing Modal */}
      {editListing && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleSaveEdit}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs"
          >
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Edit Donation Listing</h3>
              <button
                type="button"
                onClick={() => setEditListing(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={editListing.name}
                  onChange={(e) => setEditListing({ ...editListing, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Available Quantity ({editListing.unit})</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={editListing.remainingQuantity}
                  onChange={(e) => setEditListing({ ...editListing, remainingQuantity: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editListing.description}
                  onChange={(e) => setEditListing({ ...editListing, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditListing(null)}
                className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-semibold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
