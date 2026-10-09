import React, { useState } from 'react';
import {
  Building2,
  HeartHandshake,
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  AlertCircle,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useFoodBridge } from '../../context/FoodBridgeContext';

export const LoginPage: React.FC = () => {
  const {
    activeRoleRegistration,
    setActiveView,
    loginWithCredentials,
    loginAsDemoUser,
    openRegistration,
  } = useFoodBridge();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError(null);
    const res = await loginWithCredentials(email.trim(), password);
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Invalid credentials. You may also use the instant demo accounts below.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-16">
      {/* Back button */}
      <button
        type="button"
        onClick={() => setActiveView('landing')}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#071c10] to-[#124227] text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
              Secure Authentication
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Sign In to FoodBridge AI
          </h1>
          <p className="text-xs text-emerald-100/80 mt-1">
            Access your Hotel, Trust, or Administrator command center.
          </p>
        </div>

        {/* Form */}
        <div className="p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Registered Email ID *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block text-center">
              Or Instant Demo Sign-In
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => loginAsDemoUser('hotel')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-center transition cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-emerald-700 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-slate-900 block leading-tight">Hotel</span>
                <span className="text-[9px] text-slate-500 block">Grand Palace</span>
              </button>

              <button
                type="button"
                onClick={() => loginAsDemoUser('trust')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-center transition cursor-pointer"
              >
                <HeartHandshake className="w-4 h-4 text-emerald-700 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-slate-900 block leading-tight">Trust</span>
                <span className="text-[9px] text-slate-500 block">Hope Horizon</span>
              </button>

              <button
                type="button"
                onClick={() => loginAsDemoUser('admin')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-center transition cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-purple-700 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-slate-900 block leading-tight">Admin</span>
                <span className="text-[9px] text-slate-500 block">Verification</span>
              </button>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center pt-2 text-xs text-slate-500">
            Need an organization account?{' '}
            <button
              type="button"
              onClick={() => openRegistration('hotel')}
              className="text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              Register here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
