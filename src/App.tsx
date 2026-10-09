/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FoodBridgeProvider, useFoodBridge } from './context/FoodBridgeContext';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { LoginPage } from './components/auth/LoginPage';
import { HotelSidebar } from './components/layout/HotelSidebar';
import { TrustSidebar } from './components/layout/TrustSidebar';
import { HotelOverview } from './components/hotel/HotelOverview';
import { HotelFoodManagement } from './components/hotel/HotelFoodManagement';
import { HotelDonationRequests } from './components/hotel/HotelDonationRequests';
import { HotelPickupDelivery } from './components/hotel/HotelPickupDelivery';
import { HotelDonationHistory } from './components/hotel/HotelDonationHistory';
import { HotelReports } from './components/hotel/HotelReports';
import { TrustOverview } from './components/trust/TrustOverview';
import { TrustSmartFoodMatch } from './components/trust/TrustSmartFoodMatch';
import { TrustFoodRequirements } from './components/trust/TrustFoodRequirements';
import { TrustFoodRequests } from './components/trust/TrustFoodRequests';
import { TrustPickupReservations } from './components/trust/TrustPickupReservations';
import { TrustQRVerification } from './components/trust/TrustQRVerification';
import { TrustReceivedDonations } from './components/trust/TrustReceivedDonations';
import { LocationPanel } from './components/common/LocationPanel';
import { SettingsPanel } from './components/common/SettingsPanel';
import { AdminDashboard } from './components/admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { activeView, hotelSection, trustSection } = useFoodBridge();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // 1. Landing Page
  if (activeView === 'landing') {
    return (
      <div className="min-h-screen bg-slate-100/90 text-slate-900 flex flex-col font-sans antialiased">
        <Navbar />
        <main className="flex-1">
          <LandingPage />
        </main>
        <footer className="border-t border-slate-200 bg-white py-6 px-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              <span className="font-bold text-slate-800">FoodBridge AI Platform</span>
              <span className="mx-2 text-slate-300">·</span>
              <span>Right Food. Right Place. Right Time.</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Deterministic Cold-Chain &amp; Logistical Safety Engine · Cloud Firestore Integrated
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // 2. Registration Page
  if (activeView === 'register') {
    return (
      <div className="min-h-screen bg-slate-100/90 text-slate-900 flex flex-col font-sans antialiased">
        <Navbar />
        <main className="flex-1">
          <RegisterPage />
        </main>
      </div>
    );
  }

  // 3. Login Page
  if (activeView === 'login') {
    return (
      <div className="min-h-screen bg-slate-100/90 text-slate-900 flex flex-col font-sans antialiased">
        <Navbar />
        <main className="flex-1">
          <LoginPage />
        </main>
      </div>
    );
  }

  // 4. Hotel Dashboard
  if (activeView === 'hotel-dashboard') {
    return (
      <div className="min-h-screen bg-slate-100/90 text-slate-900 flex font-sans antialiased">
        <HotelSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />
        <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
          <Navbar onToggleSidebar={() => setMobileSidebarOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {hotelSection === 'overview' && <HotelOverview />}
            {hotelSection === 'food-add' && <HotelFoodManagement initialSubSection="add" />}
            {hotelSection === 'food-available' && <HotelFoodManagement initialSubSection="available" />}
            {hotelSection === 'food-update' && <HotelFoodManagement initialSubSection="update" />}
            {hotelSection === 'food-availability' && <HotelFoodManagement initialSubSection="availability" />}
            {hotelSection === 'requests-pending' && <HotelDonationRequests initialFilter="pending" />}
            {hotelSection === 'requests-approved' && <HotelDonationRequests initialFilter="approved" />}
            {hotelSection === 'requests-rejected' && <HotelDonationRequests initialFilter="rejected" />}
            {hotelSection === 'pickup-schedule' && <HotelPickupDelivery initialSubSection="schedule" />}
            {hotelSection === 'pickup-handover' && <HotelPickupDelivery initialSubSection="handover" />}
            {hotelSection === 'pickup-completed' && <HotelPickupDelivery initialSubSection="completed" />}
            {hotelSection === 'location' && <LocationPanel />}
            {hotelSection === 'history' && <HotelDonationHistory />}
            {hotelSection === 'reports' && <HotelReports />}
            {hotelSection === 'settings' && <SettingsPanel />}
          </main>
        </div>
      </div>
    );
  }

  // 5. Trust Dashboard
  if (activeView === 'trust-dashboard') {
    return (
      <div className="min-h-screen bg-slate-100/90 text-slate-900 flex font-sans antialiased">
        <TrustSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />
        <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
          <Navbar onToggleSidebar={() => setMobileSidebarOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {trustSection === 'overview' && <TrustOverview />}
            {trustSection === 'match-recommended' && <TrustSmartFoodMatch />}
            {trustSection === 'match-nearby' && <TrustSmartFoodMatch />}
            {trustSection === 'match-search' && <TrustSmartFoodMatch />}
            {trustSection === 'req-add' && <TrustFoodRequirements initialSubSection="add" />}
            {trustSection === 'req-update' && <TrustFoodRequirements initialSubSection="update" />}
            {trustSection === 'requests-pending' && <TrustFoodRequests initialFilter="pending" />}
            {trustSection === 'requests-approved' && <TrustFoodRequests initialFilter="approved" />}
            {trustSection === 'requests-rejected' && <TrustFoodRequests initialFilter="rejected" />}
            {trustSection === 'pickup-reservations' && <TrustPickupReservations />}
            {trustSection === 'qr-verification' && <TrustQRVerification />}
            {trustSection === 'received-donations' && <TrustReceivedDonations />}
            {trustSection === 'location' && <LocationPanel />}
            {trustSection === 'settings' && <SettingsPanel />}
          </main>
        </div>
      </div>
    );
  }

  // 6. Admin Dashboard
  if (activeView === 'admin-dashboard') {
    return (
      <div className="min-h-screen bg-slate-100/90 text-slate-900 flex flex-col font-sans antialiased">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <AdminDashboard />
        </main>
      </div>
    );
  }

  return null;
};

export default function App() {
  return (
    <FoodBridgeProvider>
      <AppContent />
    </FoodBridgeProvider>
  );
}
