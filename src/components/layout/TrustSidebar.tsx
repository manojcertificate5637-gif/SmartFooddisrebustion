import React, { useState } from 'react';
import {
  LayoutDashboard,
  Sparkles,
  HeartHandshake,
  Layers,
  Truck,
  QrCode,
  CheckCircle2,
  MapPin,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Search,
  Building2,
  Clock,
  Plus,
} from 'lucide-react';
import { useFoodBridge } from '../../context/FoodBridgeContext';
import { TrustNavSection } from '../../types/foodbridge';

interface TrustSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const TrustSidebar: React.FC<TrustSidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { currentUser, trustSection, setTrustSection, logout, requests, listings } = useFoodBridge();

  const [matchMenuOpen, setMatchMenuOpen] = useState(true);
  const [reqMenuOpen, setReqMenuOpen] = useState(true);
  const [requestsMenuOpen, setRequestsMenuOpen] = useState(true);

  // Badges
  const pendingRequestsCount = requests.filter(
    (r) => r.trustId === currentUser?.uid && r.status === 'REQUESTED'
  ).length;

  const approvedRequestsCount = requests.filter(
    (r) => r.trustId === currentUser?.uid && (r.status === 'APPROVED' || r.status === 'PICKUP SCHEDULED')
  ).length;

  const availableListingsCount = listings.filter(
    (l) => l.status === 'Published' || l.status === 'Partially Reserved'
  ).length;

  const handleNavClick = (section: TrustNavSection) => {
    setTrustSection(section);
    setMobileOpen(false);
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#071c10] text-emerald-100 flex flex-col border-r border-emerald-900/60 transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-emerald-900/60 bg-[#05170d]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-xs text-sm">
              FB
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white block leading-tight">
                Trust Coordinator
              </span>
              <span className="text-[10px] text-emerald-400 font-medium block">
                FoodBridge AI Operations
              </span>
            </div>
          </div>
        </div>

        {/* User Identity Chip */}
        <div className="p-3 bg-[#0a2315] border-b border-emerald-900/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-800/80 text-emerald-200 flex items-center justify-center font-bold text-xs shrink-0">
              {currentUser?.organizationName?.substring(0, 2).toUpperCase() || 'TR'}
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-bold text-xs text-white block truncate">
                {currentUser?.organizationName || 'Trust / NGO'}
              </span>
              <span className="text-[10px] text-emerald-400/80 block truncate">
                {currentUser?.fullName}
              </span>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] px-1">
            <span className="text-emerald-400/70">Status:</span>
            {currentUser?.verificationStatus === 'verified' ? (
              <span className="text-emerald-300 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Verified Trust</span>
              </span>
            ) : (
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-amber-400" />
                <span>Pending Audit</span>
              </span>
            )}
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto text-xs" aria-label="Trust Sidebar Navigation">
          {/* 1. Overview */}
          <button
            type="button"
            onClick={() => handleNavClick('overview')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition cursor-pointer font-medium ${
              trustSection === 'overview'
                ? 'bg-emerald-800 text-white font-bold shadow-xs'
                : 'text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-400" />
            <span>Overview</span>
          </button>

          {/* 2. Smart Food Match (Prominent Feature on Left Sidebar) */}
          <div className="pt-1.5">
            <button
              type="button"
              onClick={() => setMatchMenuOpen(!matchMenuOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-emerald-300 hover:text-white rounded-lg transition cursor-pointer font-semibold"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Smart Food Match</span>
              </div>
              <div className="flex items-center gap-1">
                {availableListingsCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-600 text-white rounded-full font-bold">
                    {availableListingsCount}
                  </span>
                )}
                {matchMenuOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </div>
            </button>

            {matchMenuOpen && (
              <div className="pl-6 space-y-0.5 mt-0.5 border-l border-emerald-900/60 ml-4">
                <button
                  type="button"
                  onClick={() => handleNavClick('match-recommended')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center justify-between ${
                    trustSection === 'match-recommended' ? 'bg-emerald-800/90 text-white font-bold' : 'text-emerald-300 hover:text-white hover:bg-emerald-900/40'
                  }`}
                >
                  <span>Recommended Food</span>
                  <span className="text-[10px] px-1 bg-emerald-700/80 rounded text-emerald-200">AI</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('match-nearby')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                    trustSection === 'match-nearby' ? 'bg-emerald-800/90 text-white font-bold' : 'text-emerald-300 hover:text-white hover:bg-emerald-900/40'
                  }`}
                >
                  Nearby Hotels
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('match-search')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                    trustSection === 'match-search' ? 'bg-emerald-800/90 text-white font-bold' : 'text-emerald-300 hover:text-white hover:bg-emerald-900/40'
                  }`}
                >
                  Search Available Food
                </button>
              </div>
            )}
          </div>

          {/* 3. Food Requirements (Nested) */}
          <div className="pt-1.5">
            <button
              type="button"
              onClick={() => setReqMenuOpen(!reqMenuOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-emerald-300 hover:text-white rounded-lg transition cursor-pointer font-semibold"
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Food Requirements</span>
              </div>
              {reqMenuOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            {reqMenuOpen && (
              <div className="pl-6 space-y-0.5 mt-0.5 border-l border-emerald-900/60 ml-4">
                <button
                  type="button"
                  onClick={() => handleNavClick('req-add')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                    trustSection === 'req-add' ? 'bg-emerald-800/90 text-white font-bold' : 'text-emerald-300 hover:text-white hover:bg-emerald-900/40'
                  }`}
                >
                  + Add Food Requirement
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('req-update')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                    trustSection === 'req-update' ? 'bg-emerald-800/90 text-white font-bold' : 'text-emerald-300 hover:text-white hover:bg-emerald-900/40'
                  }`}
                >
                  Update Demand
                </button>
              </div>
            )}
          </div>

          {/* 4. Food Requests (Nested) */}
          <div className="pt-1.5">
            <button
              type="button"
              onClick={() => setRequestsMenuOpen(!requestsMenuOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-emerald-300 hover:text-white rounded-lg transition cursor-pointer font-semibold"
            >
              <div className="flex items-center gap-2.5">
                <HeartHandshake className="w-4 h-4 text-emerald-400" />
                <span>Food Requests</span>
              </div>
              <div className="flex items-center gap-1">
                {pendingRequestsCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 bg-amber-500 text-white rounded-full font-bold">
                    {pendingRequestsCount}
                  </span>
                )}
                {requestsMenuOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </div>
            </button>

            {requestsMenuOpen && (
              <div className="pl-6 space-y-0.5 mt-0.5 border-l border-emerald-900/60 ml-4">
                <button
                  type="button"
                  onClick={() => handleNavClick('requests-pending')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center justify-between ${
                    trustSection === 'requests-pending' ? 'bg-emerald-800/90 text-white font-bold' : 'text-emerald-300 hover:text-white hover:bg-emerald-900/40'
                  }`}
                >
                  <span>Pending Requests</span>
                  {pendingRequestsCount > 0 && (
                    <span className="text-[10px] font-bold text-amber-300">({pendingRequestsCount})</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('requests-approved')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                    trustSection === 'requests-approved' ? 'bg-emerald-800/90 text-white font-bold' : 'text-emerald-300 hover:text-white hover:bg-emerald-900/40'
                  }`}
                >
                  Approved Requests
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('requests-rejected')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                    trustSection === 'requests-rejected' ? 'bg-emerald-800/90 text-white font-bold' : 'text-emerald-300 hover:text-white hover:bg-emerald-900/40'
                  }`}
                >
                  Rejected Requests
                </button>
              </div>
            )}
          </div>

          {/* 5. Pickup Reservations */}
          <button
            type="button"
            onClick={() => handleNavClick('pickup-reservations')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer font-medium ${
              trustSection === 'pickup-reservations'
                ? 'bg-emerald-800 text-white font-bold shadow-xs'
                : 'text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Pickup Reservations</span>
            </div>
            {approvedRequestsCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500 text-white rounded-full font-bold">
                {approvedRequestsCount}
              </span>
            )}
          </button>

          {/* 6. QR Verification */}
          <button
            type="button"
            onClick={() => handleNavClick('qr-verification')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition cursor-pointer font-medium ${
              trustSection === 'qr-verification'
                ? 'bg-emerald-800 text-white font-bold shadow-xs'
                : 'text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>QR Verification</span>
          </button>

          {/* 7. Received Donations */}
          <button
            type="button"
            onClick={() => handleNavClick('received-donations')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition cursor-pointer font-medium ${
              trustSection === 'received-donations'
                ? 'bg-emerald-800 text-white font-bold shadow-xs'
                : 'text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Received Donations</span>
          </button>

          {/* 8. Location */}
          <button
            type="button"
            onClick={() => handleNavClick('location')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition cursor-pointer font-medium ${
              trustSection === 'location'
                ? 'bg-emerald-800 text-white font-bold shadow-xs'
                : 'text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Location &amp; Coordinates</span>
          </button>

          {/* 9. Settings */}
          <button
            type="button"
            onClick={() => handleNavClick('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition cursor-pointer font-medium ${
              trustSection === 'settings'
                ? 'bg-emerald-800 text-white font-bold shadow-xs'
                : 'text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4 text-emerald-400" />
            <span>Settings</span>
          </button>
        </nav>

        {/* 10. Logout in Footer */}
        <div className="p-3 border-t border-emerald-900/60 bg-[#05170d]">
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-300 hover:bg-rose-950/50 hover:text-rose-200 transition font-semibold cursor-pointer border border-rose-900/40"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
