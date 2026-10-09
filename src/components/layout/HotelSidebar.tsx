import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  HeartHandshake,
  Truck,
  MapPin,
  History,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Plus,
  CheckCircle2,
  Clock,
  QrCode,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { useFoodBridge } from '../../context/FoodBridgeContext';
import { HotelNavSection } from '../../types/foodbridge';

interface HotelSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const HotelSidebar: React.FC<HotelSidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { currentUser, hotelSection, setHotelSection, logout, requests, listings } = useFoodBridge();

  // Collapsible category states
  const [foodMenuOpen, setFoodMenuOpen] = useState(true);
  const [requestsMenuOpen, setRequestsMenuOpen] = useState(true);
  const [pickupMenuOpen, setPickupMenuOpen] = useState(true);

  // Counts for badges
  const pendingRequestsCount = requests.filter(
    (r) => r.hotelId === currentUser?.uid && r.status === 'REQUESTED'
  ).length;

  const approvedRequestsCount = requests.filter(
    (r) => r.hotelId === currentUser?.uid && (r.status === 'APPROVED' || r.status === 'PICKUP SCHEDULED')
  ).length;

  const activeFoodCount = listings.filter(
    (l) => l.hotelId === currentUser?.uid && l.remainingPackets > 0
  ).length;

  const handleNavClick = (section: HotelNavSection) => {
    setHotelSection(section);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
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
                Hotel Dispatch
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
              {currentUser?.organizationName?.substring(0, 2).toUpperCase() || 'HT'}
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-bold text-xs text-white block truncate">
                {currentUser?.organizationName || 'Hotel Donor'}
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
                <span>Verified Donor</span>
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
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto text-xs" aria-label="Hotel Sidebar Navigation">
          {/* 1. Overview */}
          <button
            type="button"
            onClick={() => handleNavClick('overview')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition cursor-pointer font-medium ${
              hotelSection === 'overview'
                ? 'bg-emerald-800 text-white font-bold shadow-xs'
                : 'text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-400" />
            <span>Overview</span>
          </button>

          {/* 2. Food Management (Nested) */}
          <div className="pt-1.5">
            <button
              type="button"
              onClick={() => setFoodMenuOpen(!foodMenuOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-emerald-300 hover:text-white rounded-lg transition cursor-pointer font-semibold"
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-emerald-400" />
                <span>Food Management</span>
              </div>
              <div className="flex items-center gap-1">
                {activeFoodCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-800/80 text-emerald-200 rounded-full font-bold">
                    {activeFoodCount}
                  </span>
                )}
                {foodMenuOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </div>
            </button>

            {foodMenuOpen && (
              <div className="pl-6 space-y-0.5 mt-0.5 border-l border-emerald-900/60 ml-4">
                <button
                  type="button"
                  onClick={() => handleNavClick('food-add')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                    hotelSection === 'food-add' ? 'bg-emerald-800/90 text-white font-bold' : 'text-emerald-300 hover:text-white hover:bg-emerald-900/40'
                  }`}
                >
                  + Add Surplus Food
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('food-available')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                    hotelSection === 'food-available' ? 'bg-emerald-800/90 text-white font-bold' : 'text-emerald-300 hover:text-white hover:bg-emerald-900/40'
                  }`}
                >
                  Available Food Listings
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('food-update')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                    hotelSection === 'food-update' ? 'bg-emerald-800/90 text-white font-bold' : 'text-emerald-300 hover:text-white hover:bg-emerald-900/40'
                  }`}
                >
                  Update Food Quantity
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('food-availability')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                    hotelSection === 'food-availability' ? 'bg-emerald-800/90 text-white font-bold' : 'text-emerald-300 hover:text-white hover:bg-emerald-900/40'
                  }`}
                >
                  Food Availability Status
                </button>
              </div>
            )}
          </div>

          {/* 3. Donation Requests (Nested) */}
          <div className="pt-1.5">
            <button
              type="button"
              onClick={() => setRequestsMenuOpen(!requestsMenuOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-emerald-300 hover:text-white rounded-lg transition cursor-pointer font-semibold"
            >
              <div className="flex items-center gap-2.5">
                <HeartHandshake className="w-4 h-4 text-emerald-400" />
                <span>Donation Requests</span>
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
                    hotelSection === 'requests-pending' ? 'bg-emerald-800/90 text-white font-bold' : 'text-emerald-300 hover:text-white hover:bg-emerald-900/40'
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
                    hotelSection === 'requests-approved' ? 'bg-emerald-800/90 text-white font-bold' : 'text-emerald-300 hover:text-white hover:bg-emerald-900/40'
                  }`}
                >
                  Approved Requests
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('requests-rejected')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                    hotelSection === 'requests-rejected' ? 'bg-emerald-800/90 text-white font-bold' : 'text-emerald-300 hover:text-white hover:bg-emerald-900/40'
                  }`}
                >
                  Rejected Requests
                </button>
              </div>
            )}
          </div>

          {/* 4. Pickup & Delivery (Nested) */}
          <div className="pt-1.5">
            <button
              type="button"
              onClick={() => setPickupMenuOpen(!pickupMenuOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-emerald-300 hover:text-white rounded-lg transition cursor-pointer font-semibold"
            >
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Pickup &amp; Delivery</span>
              </div>
              <div className="flex items-center gap-1">
                {approvedRequestsCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-600 text-white rounded-full font-bold">
                    {approvedRequestsCount}
                  </span>
                )}
                {pickupMenuOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </div>
            </button>

            {pickupMenuOpen && (
              <div className="pl-6 space-y-0.5 mt-0.5 border-l border-emerald-900/60 ml-4">
                <button
                  type="button"
                  onClick={() => handleNavClick('pickup-schedule')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                    hotelSection === 'pickup-schedule' ? 'bg-emerald-800/90 text-white font-bold' : 'text-emerald-300 hover:text-white hover:bg-emerald-900/40'
                  }`}
                >
                  Schedule Pickup
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('pickup-handover')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center justify-between ${
                    hotelSection === 'pickup-handover' ? 'bg-emerald-800/90 text-white font-bold' : 'text-emerald-300 hover:text-white hover:bg-emerald-900/40'
                  }`}
                >
                  <span>Confirm Handover (QR)</span>
                  <QrCode className="w-3 h-3 text-emerald-400" />
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('pickup-completed')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                    hotelSection === 'pickup-completed' ? 'bg-emerald-800/90 text-white font-bold' : 'text-emerald-300 hover:text-white hover:bg-emerald-900/40'
                  }`}
                >
                  Completed Donations
                </button>
              </div>
            )}
          </div>

          {/* 5. Location */}
          <button
            type="button"
            onClick={() => handleNavClick('location')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition cursor-pointer font-medium ${
              hotelSection === 'location'
                ? 'bg-emerald-800 text-white font-bold shadow-xs'
                : 'text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Location &amp; Coordinates</span>
          </button>

          {/* 6. Donation History */}
          <button
            type="button"
            onClick={() => handleNavClick('history')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition cursor-pointer font-medium ${
              hotelSection === 'history'
                ? 'bg-emerald-800 text-white font-bold shadow-xs'
                : 'text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <History className="w-4 h-4 text-emerald-400" />
            <span>Donation History</span>
          </button>

          {/* 7. Reports */}
          <button
            type="button"
            onClick={() => handleNavClick('reports')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition cursor-pointer font-medium ${
              hotelSection === 'reports'
                ? 'bg-emerald-800 text-white font-bold shadow-xs'
                : 'text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Reports &amp; ESG Metrics</span>
          </button>

          {/* 8. Settings */}
          <button
            type="button"
            onClick={() => handleNavClick('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition cursor-pointer font-medium ${
              hotelSection === 'settings'
                ? 'bg-emerald-800 text-white font-bold shadow-xs'
                : 'text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4 text-emerald-400" />
            <span>Settings</span>
          </button>
        </nav>

        {/* 9. Logout in Footer */}
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
