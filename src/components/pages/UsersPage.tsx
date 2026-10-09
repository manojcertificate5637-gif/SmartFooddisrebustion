import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Mail,
  Phone,
  Building2,
  UserCheck,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserAccount } from '../../types';

export const UsersPage: React.FC = () => {
  const { users, addUser, updateUser } = useApp();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserAccount['role']>('Donor');
  const [organization, setOrganization] = useState('');
  const [assignedZone, setAssignedZone] = useState('Central Zone');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.organization.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    addUser({
      name,
      email,
      phone,
      role,
      organization: organization || 'Independent Partner',
      status: 'Active',
      assignedZone,
      donationsOrDeliveriesCount: 0,
    });

    setIsAddUserOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    setOrganization('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            User &amp; Organization Directory
          </h2>
          <p className="text-xs text-slate-500">
            Authenticated commercial donors, certified recipient coordinators, and logistics driver personnel.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddUserOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-sm transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Search and Role Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, organization, email..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700 font-medium"
        >
          <option value="All">All User Roles</option>
          <option value="Donor">Commercial Donors</option>
          <option value="Recipient Admin">Recipient Coordinators</option>
          <option value="Logistics Driver">Logistics Drivers</option>
          <option value="Platform Admin">Platform Admins</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">User Name &amp; ID</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Affiliated Organization</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Assigned Zone</th>
                <th className="py-3 px-4">Activity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{user.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{user.id}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-semibold text-[11px] px-2 py-0.5 rounded-full ${
                        user.role === 'Donor'
                          ? 'bg-emerald-100 text-emerald-800'
                          : user.role === 'Recipient Admin'
                          ? 'bg-blue-100 text-blue-800'
                          : user.role === 'Logistics Driver'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-800 font-medium">{user.organization}</td>
                  <td className="py-3 px-4 text-slate-600">
                    <div>{user.email}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{user.phone}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{user.assignedZone}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {user.donationsOrDeliveriesCount} transactions
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-emerald-700 font-semibold">{user.status}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        updateUser(user.id, {
                          status: user.status === 'Active' ? 'Suspended' : 'Active',
                        })
                      }
                      className="text-[11px] text-slate-600 hover:text-slate-900 underline"
                    >
                      {user.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleCreateUser}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs"
          >
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Register New User</h3>
              <button
                type="button"
                onClick={() => setIsAddUserOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Donor">Commercial Donor</option>
                  <option value="Recipient Admin">Recipient Admin</option>
                  <option value="Logistics Driver">Logistics Driver</option>
                  <option value="Platform Admin">Platform Admin</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Organization Name</label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddUserOpen(false)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 font-semibold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
