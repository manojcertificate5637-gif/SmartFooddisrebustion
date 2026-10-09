import React, { useState } from 'react';
import {
  Bell,
  Menu,
  ShieldCheck,
  ShieldAlert,
  LogOut,
  Building2,
  HeartHandshake,
  User,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useFoodBridge } from '../../context/FoodBridgeContext';
import { NotificationsPanel } from './NotificationsPanel';
import { HowItWorksModal } from '../landing/HowItWorksModal';
import { AboutModal } from '../landing/AboutModal';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const {
    currentUser,
    activeView,
    setActiveView,
    openLogin,
    openRegistration,
    logout,
    unreadNotificationsCount,
    loginAsDemoUser,
  } = useFoodBridge();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const isDashboardView =
    activeView === 'hotel-dashboard' ||
    activeView === 'trust-dashboard' ||
    activeView === 'admin-dashboard';

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Left: Brand or Sidebar Toggle */}
          <div className="flex items-center gap-3">
            {isDashboardView && onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                aria-label="Toggle Navigation Sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveView(currentUser ? activeView : 'landing')}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#071c10] to-emerald-700 text-white flex items-center justify-center font-extrabold text-sm shadow-2xs group-hover:shadow-xs transition">
                FB
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 block leading-tight">
                  FoodBridge <span className="text-emerald-700">AI</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium block">
                  Smart Food Waste Redistribution
                </span>
              </div>
            </button>
          </div>

          {/* Middle: Public Nav Links (When not in dashboard) */}
          {!isDashboardView && (
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => setActiveView('landing')}
                className={`transition cursor-pointer hover:text-emerald-800 ${
                  activeView === 'landing' ? 'text-emerald-800 font-bold' : ''
                }`}
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => setHowItWorksOpen(true)}
                className="hover:text-emerald-800 transition cursor-pointer"
              >
                How It Works
              </button>
              <button
                type="button"
                onClick={() => setAboutOpen(true)}
                className="hover:text-emerald-800 transition cursor-pointer"
              >
                About
              </button>
            </nav>
          )}

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="h-9 px-2.5 rounded-lg border border-emerald-300 bg-emerald-50/60 hover:bg-emerald-100/60 text-emerald-900 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                title="Switch Demo Role for testing"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline">Demo Switcher</span>
                <ChevronDown className="w-3 h-3 text-emerald-700" />
              </button>

              {demoDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 text-xs space-y-1">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Instant Demo Login
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      loginAsDemoUser('hotel');
                      setDemoDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 transition cursor-pointer"
                  >
                    <Building2 className="w-4 h-4 text-emerald-700" />
                    <div>
                      <div className="font-bold text-slate-900">Hotel / Restaurant</div>
                      <div className="text-[10px] text-slate-500">Grand Palace Hotel</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      loginAsDemoUser('trust');
                      setDemoDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 transition cursor-pointer"
                  >
                    <HeartHandshake className="w-4 h-4 text-emerald-700" />
                    <div>
                      <div className="font-bold text-slate-900">Trust / NGO</div>
                      <div className="text-[10px] text-slate-500">Hope Horizon Trust</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      loginAsDemoUser('admin');
                      setDemoDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 transition cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-700" />
                    <div>
                      <div className="font-bold text-slate-900">Administrator</div>
                      <div className="text-[10px] text-slate-500">Verification Desk</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* If Logged In: Notifications + User Badge + Logout */}
            {currentUser ? (
              <>
                {/* Notifications Button */}
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(true)}
                  className="relative h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
                  title="View notifications"
                  aria-label="Open notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {/* Organization & Verification Status */}
                <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-200 text-xs">
                  <div className="text-right">
                    <span className="font-bold text-slate-900 block truncate max-w-[150px]">
                      {currentUser.organizationName}
                    </span>
                    <span className="text-[10px] text-slate-500 block capitalize">
                      {currentUser.role} Account
                    </span>
                  </div>

                  {currentUser.verificationStatus === 'verified' ? (
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1"
                      title="Verified Organization"
                    >
                      <ShieldCheck className="w-3 h-3 text-emerald-700" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1"
                      title="Pending Admin Verification"
                    >
                      <ShieldAlert className="w-3 h-3 text-amber-700" />
                      <span>Pending Verification</span>
                    </span>
                  )}
                </div>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={logout}
                  className="h-9 px-2.5 sm:px-3 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              /* Public / Not logged in */
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openLogin()}
                  className="h-9 px-3.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => openRegistration('hotel')}
                  className="h-9 px-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Notifications Drawer */}
      <NotificationsPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      {/* Modals */}
      <HowItWorksModal
        isOpen={howItWorksOpen}
        onClose={() => setHowItWorksOpen(false)}
        onSelectRole={(role) => openRegistration(role)}
      />
      <AboutModal
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
      />
    </>
  );
};
