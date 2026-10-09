import React from 'react';
import {
  Building2,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  QrCode,
  Package,
  TrendingUp,
  Leaf,
  Users,
  Clock,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { useFoodBridge } from '../../context/FoodBridgeContext';

export const LandingPage: React.FC = () => {
  const { openRegistration, openLogin, loginAsDemoUser, listings, requests } = useFoodBridge();

  const totalPacketsAvailable = listings
    .filter((l) => l.status === 'Published' || l.status === 'Partially Reserved')
    .reduce((sum, l) => sum + l.remainingPackets, 0);

  const completedPickupsCount = requests.filter(
    (r) => r.status === 'PICKED UP' || r.status === 'COMPLETED'
  ).length;

  return (
    <div className="space-y-12 py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. Hero Platform Introduction */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#05170d] via-[#092b18] to-[#124227] text-white p-8 sm:p-12 shadow-xl border border-emerald-900/50">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/25 text-emerald-300 border border-emerald-400/40">
              FoodBridge AI Engine
            </span>
            <span className="text-emerald-300 text-xs font-medium">
              Deterministic Cold-Chain &amp; Logistics Allocation
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Right Food. Right Place. <br className="hidden sm:inline" />
            <span className="text-emerald-400">Right Time.</span>
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-normal">
            Connecting surplus food from commercial hotels, banquet halls, and restaurants directly to verified charitable trusts, orphanages, and community shelters before safe-use deadlines expire.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="bg-emerald-950/60 border border-emerald-800/60 rounded-xl p-3">
              <span className="text-[11px] text-emerald-300 block font-medium">Available Surplus</span>
              <span className="text-xl font-extrabold text-white">{totalPacketsAvailable} pkts</span>
            </div>
            <div className="bg-emerald-950/60 border border-emerald-800/60 rounded-xl p-3">
              <span className="text-[11px] text-emerald-300 block font-medium">Verified Handovers</span>
              <span className="text-xl font-extrabold text-white">{completedPickupsCount + 18} runs</span>
            </div>
            <div className="bg-emerald-950/60 border border-emerald-800/60 rounded-xl p-3">
              <span className="text-[11px] text-emerald-300 block font-medium">Safe-Use Guarantee</span>
              <span className="text-xl font-extrabold text-white">100% Inspected</span>
            </div>
            <div className="bg-emerald-950/60 border border-emerald-800/60 rounded-xl p-3">
              <span className="text-[11px] text-emerald-300 block font-medium">QR Token Security</span>
              <span className="text-xl font-extrabold text-white">Zero Double-Claims</span>
            </div>
          </div>
        </div>

        {/* Subtle Background Glow */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Primary Selection Section: TWO LARGE DISTINCT CARDS */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Select Organization Type
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How Would You Like to Participate?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Dedicated registration, access, and workflow management for food donors and welfare organizations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {/* CARD 1: Hotel / Restaurant */}
          <div className="bg-white rounded-3xl border-2 border-emerald-800/30 hover:border-emerald-700 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group">
            {/* Card Header */}
            <div className="p-6 sm:p-8 bg-gradient-to-b from-emerald-50/70 to-white border-b border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0a2315] text-emerald-300 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
                  <Building2 className="w-7 h-7 text-emerald-400" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-200">
                  Surplus Donor
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Hotel / Restaurant / Caterer
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                Publish excess banquet, buffet, or kitchen batches with verified temperature conditions and dispatch to authenticated hunger relief partners.
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="p-6 sm:p-8 flex-1 space-y-3.5 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Manage Surplus Food</strong>
                  <span className="text-slate-500">Log prepared meals, category, safe-use deadline, and storage requirements.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">View &amp; Approve Donation Requests</strong>
                  <span className="text-slate-500">Review incoming recipient demands and lock allocated packets atomically.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">QR Code Handover Verification</strong>
                  <span className="text-slate-500">Scan or validate digital pickup tokens at the receiving bay to record receipt.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">CSR &amp; Environmental Impact</strong>
                  <span className="text-slate-500">Generate compliance audit trails and carbon emission savings statements.</span>
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="p-6 sm:p-8 bg-slate-50/80 border-t border-slate-100 space-y-2.5">
              <button
                type="button"
                onClick={() => openRegistration('hotel')}
                className="w-full h-11 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Hotel Registration</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openLogin('hotel')}
                  className="flex-1 h-10 px-4 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Hotel Login</span>
                </button>
                <button
                  type="button"
                  onClick={() => loginAsDemoUser('hotel')}
                  className="h-10 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer shrink-0"
                  title="Try Instant Hotel Demo"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Demo Hotel</span>
                </button>
              </div>
            </div>
          </div>

          {/* CARD 2: Trust / NGO */}
          <div className="bg-white rounded-3xl border-2 border-emerald-800/30 hover:border-emerald-700 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group">
            {/* Card Header */}
            <div className="p-6 sm:p-8 bg-gradient-to-b from-emerald-50/70 to-white border-b border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0a2315] text-emerald-300 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
                  <HeartHandshake className="w-7 h-7 text-emerald-400" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-200">
                  Recipient Trust
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Charitable Trust / NGO / Shelter
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                Discover nearby surplus food matching your community requirements, request exact quantities, and secure verified meals for shelters.
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="p-6 sm:p-8 flex-1 space-y-3.5 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Smart Food Match Engine</strong>
                  <span className="text-slate-500">Compatibility ranking by dietary type, distance, and storage capabilities.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Post Food Requirements &amp; Demand</strong>
                  <span className="text-slate-500">Signal recurring lunch, dinner, or breakfast needs for resident beneficiaries.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Pickup Reservations &amp; Digital QR</strong>
                  <span className="text-slate-500">Receive an encrypted pickup token to show hotel staff upon vehicle arrival.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Verified Safe Consumption</strong>
                  <span className="text-slate-500">Access full preparation timestamp logs and cold-chain compliance history.</span>
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="p-6 sm:p-8 bg-slate-50/80 border-t border-slate-100 space-y-2.5">
              <button
                type="button"
                onClick={() => openRegistration('trust')}
                className="w-full h-11 px-4 bg-[#0a2315] hover:bg-[#071b10] text-emerald-100 font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Trust Registration</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openLogin('trust')}
                  className="flex-1 h-10 px-4 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Trust Login</span>
                </button>
                <button
                  type="button"
                  onClick={() => loginAsDemoUser('trust')}
                  className="h-10 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer shrink-0"
                  title="Try Instant Trust Demo"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Demo Trust</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Administrative Portal Ribbon */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-purple-700" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Platform Administration &amp; Verification Desk</h4>
            <p className="text-xs text-slate-500">
              Audit newly registered organizations, inspect flagged listings, and approve organization credentials.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => loginAsDemoUser('admin')}
          className="h-9 px-4 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0"
        >
          <span>Admin Access</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
