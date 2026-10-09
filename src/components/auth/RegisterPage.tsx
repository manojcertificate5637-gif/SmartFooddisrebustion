import React, { useState } from 'react';
import {
  Building2,
  HeartHandshake,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
} from 'lucide-react';
import { useFoodBridge } from '../../context/FoodBridgeContext';
import { OrganizationType, UserRole } from '../../types/foodbridge';

export const RegisterPage: React.FC = () => {
  const { activeRoleRegistration, setActiveView, registerUser, openLogin } = useFoodBridge();

  const role: UserRole = activeRoleRegistration === 'trust' ? 'trust' : 'hotel';
  const isHotel = role === 'hotel';

  // Form State
  const [fullName, setFullName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [stateName, setStateName] = useState('Maharashtra');
  const [districtCity, setDistrictCity] = useState('Mumbai');
  const [fullAddress, setFullAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [organizationType, setOrganizationType] = useState<OrganizationType>(
    isHotel ? 'Hotel / Restaurant' : 'Charitable Trust'
  );

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!fullName.trim() || !organizationName.trim() || !email.trim() || !phone.trim() || !fullAddress.trim() || !postalCode.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await registerUser(
      {
        fullName: fullName.trim(),
        organizationName: organizationName.trim(),
        organizationType,
        role,
        email: email.trim(),
        phone: phone.trim(),
        state: stateName.trim(),
        districtCity: districtCity.trim(),
        fullAddress: fullAddress.trim(),
        postalCode: postalCode.trim(),
        verificationStatus: 'pending',
      },
      password
    );

    setLoading(false);
    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      {/* Back button */}
      <button
        type="button"
        onClick={() => setActiveView('landing')}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Organization Selection</span>
      </button>

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header Ribbon */}
        <div className={`p-6 sm:p-8 text-white ${isHotel ? 'bg-gradient-to-r from-[#071c10] to-[#13492a]' : 'bg-gradient-to-r from-[#071b1e] to-[#0d3b42]'}`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center font-bold text-white border border-white/20">
              {isHotel ? <Building2 className="w-6 h-6 text-emerald-300" /> : <HeartHandshake className="w-6 h-6 text-cyan-300" />}
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white">
                {isHotel ? 'Food Donor Portal' : 'Recipient Relief Portal'}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                {isHotel ? 'Hotel & Restaurant Registration' : 'Trust & NGO Registration'}
              </h1>
              <p className="text-xs text-white/80 mt-0.5">
                {isHotel
                  ? 'Register your commercial kitchen to redistribute verified surplus food safely.'
                  : 'Register your charitable foundation or shelter to claim surplus food allocations.'}
              </p>
            </div>
          </div>
        </div>

        {/* Content & Form */}
        <div className="p-6 sm:p-8">
          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900">Registration Submitted Successfully!</h2>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Your organization account for <strong>{organizationName}</strong> has been created. Initial verification has been submitted to the Admin Verification Desk.
                </p>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 max-w-md mx-auto flex items-start gap-2 text-left">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Admin Verification Required:</strong> You can explore and prepare listings right away. Confirmed dispatches are activated once administrator credentials check passes.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveView(isHotel ? 'hotel-dashboard' : 'trust-dashboard')}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Go to Organization Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Organization Type Switcher */}
              <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    useFoodBridge().openRegistration('hotel');
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    isHotel ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Hotel / Restaurant</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    useFoodBridge().openRegistration('trust');
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    !isHotel ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>Trust / NGO</span>
                </button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* 1. Full Name */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Contact Person / Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Chef Rajesh Sharma"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 2. Organization Name */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isHotel ? 'Hotel / Restaurant Name *' : 'Trust / NGO Name *'}
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      placeholder={isHotel ? 'e.g. Grand Palace Hotel' : 'e.g. Hope Horizon Welfare Trust'}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 3. Organization Type */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Organization Classification *
                  </label>
                  <select
                    value={organizationType}
                    onChange={(e) => setOrganizationType(e.target.value as OrganizationType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                  >
                    {isHotel ? (
                      <>
                        <option value="Hotel / Restaurant">Hotel / Restaurant</option>
                        <option value="Catering Service">Catering Service</option>
                        <option value="Bakery & Confectionery">Bakery &amp; Confectionery</option>
                        <option value="Supermarket / Grocery">Supermarket / Grocery</option>
                      </>
                    ) : (
                      <>
                        <option value="Charitable Trust">Charitable Trust</option>
                        <option value="Non-Governmental Organization (NGO)">Non-Governmental Organization (NGO)</option>
                        <option value="Orphanage">Orphanage</option>
                        <option value="Community Kitchen / Shelter">Community Kitchen / Shelter</option>
                        <option value="Disaster Relief Cell">Disaster Relief Cell</option>
                      </>
                    )}
                  </select>
                </div>

                {/* 4. Phone Number */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98201 00000"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 5. Email ID */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email ID *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contact@organization.org"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 6. Password */}
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
                      placeholder="At least 6 characters"
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

                {/* Confirm Password */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 7. State & District / City */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="e.g. Maharashtra"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">District / City *</label>
                  <input
                    type="text"
                    required
                    value={districtCity}
                    onChange={(e) => setDistrictCity(e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* 8. Full Address */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Full Address (Pickup / Delivery Facility) *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <textarea
                      required
                      rows={2}
                      value={fullAddress}
                      onChange={(e) => setFullAddress(e.target.value)}
                      placeholder="Building name, street, landmark, area"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* 9. Postal Code */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Postal Code (PIN) *</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 400020"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <span>Registering with Firestore...</span>
                  ) : (
                    <span>Complete {isHotel ? 'Hotel' : 'Trust'} Registration</span>
                  )}
                </button>
              </div>

              {/* Switch to Login */}
              <div className="text-center pt-2 text-xs text-slate-500">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => openLogin(role)}
                  className="text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  Login to your account
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
