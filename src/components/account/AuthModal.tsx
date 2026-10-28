import React, { useState } from 'react';
import { X, User, Lock, Mail, Phone, MapPin, Store, CheckCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KENYA_COUNTIES } from '../../data/kenyaLocations';
import { UserRole } from '../../types';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, registerUser, loginUser, loginWithGoogle, switchRole, users, showToast } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Register state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+254 ');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');
  const [county, setCounty] = useState('Nairobi');
  const [town, setTown] = useState('Westlands');
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');

  // Login state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const countyData = KENYA_COUNTIES.find((c) => c.name === county) || KENYA_COUNTIES[0];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    registerUser({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role,
      county,
      town,
      businessProfile: role === 'business' ? {
        storeName: storeName.trim() || `${name.trim()}'s Store`,
        address: storeAddress.trim() || `${town}, ${county}`,
        description: 'Authentic products and reliable delivery across Kenya.',
        openingHours: 'Mon - Sat: 8:30 AM - 6:30 PM',
        whatsapp: phone.trim(),
      } : undefined,
    });

    setIsAuthModalOpen(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      showToast('Please enter your email or phone number', 'error');
      return;
    }

    const success = loginUser(loginIdentifier.trim());
    if (success) {
      setIsAuthModalOpen(false);
    }
  };

  const handleQuickDemoLogin = (targetRole: UserRole) => {
    switchRole(targetRole);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-3 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded-lg shadow-2xl overflow-hidden my-4">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-[17px] tracking-tight text-gray-900 dark:text-white">
              ad<span className="text-[#F59E0B]">Bay</span>
            </span>
            <span className="text-[12px] text-gray-400 font-medium">|</span>
            <span className="text-[13px] font-bold text-gray-700 dark:text-gray-300">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </span>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 text-[13px] border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setMode('login')}
            className={`py-2 text-center font-bold transition border-b-2 ${
              mode === 'login'
                ? 'border-[#00A859] text-[#00A859]'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`py-2 text-center font-bold transition border-b-2 ${
              mode === 'register'
                ? 'border-[#00A859] text-[#00A859]'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Register on adBay
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 space-y-3 text-[13px] max-h-[75vh] overflow-y-auto">
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="font-semibold text-gray-800 dark:text-gray-200 block mb-1">
                  Email Address or Kenyan Phone Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. faith.mwangi@gmail.com or 0713456789"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px] text-gray-900 dark:text-white focus:outline-none focus:border-[#00A859]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-800 dark:text-gray-200 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px] text-gray-900 dark:text-white focus:outline-none focus:border-[#00A859]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#00A859] hover:bg-[#00924c] text-white font-bold py-2 rounded text-[13px] shadow-xs transition"
              >
                Sign In to adBay
              </button>

              <button
                type="button"
                onClick={async () => {
                  await loginWithGoogle();
                  setIsAuthModalOpen(false);
                }}
                className="w-full py-1.5 px-3 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded font-bold text-[13px] text-gray-800 dark:text-gray-200 flex items-center justify-center gap-2 shadow-2xs transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google Account</span>
              </button>

              {/* Demo quick accounts */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Or 1-Click Sign In as:
                </span>
                <div className="space-y-1 text-[12px]">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('seller')}
                    className="w-full p-1.5 rounded bg-gray-100 dark:bg-gray-800 hover:bg-[#00A859]/10 hover:text-[#00A859] text-left flex items-center justify-between"
                  >
                    <span>👤 Individual Seller (Faith Mwangi)</span>
                    <span className="text-[#00A859] font-bold">Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('business')}
                    className="w-full p-1.5 rounded bg-gray-100 dark:bg-gray-800 hover:bg-[#00A859]/10 hover:text-[#00A859] text-left flex items-center justify-between"
                  >
                    <span>🏪 Business Merchant (Apex Tech Kenya)</span>
                    <span className="text-[#00A859] font-bold">Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('buyer')}
                    className="w-full p-1.5 rounded bg-gray-100 dark:bg-gray-800 hover:bg-[#00A859]/10 hover:text-[#00A859] text-left flex items-center justify-between"
                  >
                    <span>🛒 Registered Buyer (Brian Otieno)</span>
                    <span className="text-[#00A859] font-bold">Sign In</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="font-semibold text-gray-800 dark:text-gray-200 block mb-1">
                  Full Name / Contact Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Joy Wanjiku"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px] text-gray-900 dark:text-white focus:outline-none focus:border-[#00A859]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-800 dark:text-gray-200 block mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. joy.wanjiku@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px] text-gray-900 dark:text-white focus:outline-none focus:border-[#00A859]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-800 dark:text-gray-200 block mb-1">
                  Kenyan Mobile Number (M-Pesa enabled) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                  <input
                    type="tel"
                    required
                    placeholder="+254 7XX XXX XXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px] text-gray-900 dark:text-white focus:outline-none focus:border-[#00A859]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-800 dark:text-gray-200 block mb-1">
                  Choose Account Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-1 text-[12px]">
                  {[
                    { id: 'buyer', label: 'Buyer', desc: 'Save & Buy' },
                    { id: 'seller', label: 'Individual Seller', desc: 'Sell Goods' },
                    { id: 'business', label: 'Business Store', desc: 'Shop / Store' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRole(item.id as UserRole)}
                      className={`p-2 rounded text-center border transition ${
                        role === item.id
                          ? 'border-[#00A859] bg-[#00A859]/10 text-[#00A859] font-bold'
                          : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className="block text-[11px] leading-tight">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Business store specifics if business role selected */}
              {role === 'business' && (
                <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded space-y-2">
                  <span className="text-[12px] font-bold text-blue-700 dark:text-blue-300 block">
                    Business Store Details
                  </span>
                  <div>
                    <label className="text-[11px] text-gray-600 dark:text-gray-400 block">Store Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Nairobi Gadget Hub"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-700 text-[12px] bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-600 dark:text-gray-400 block">Physical Shop Address</label>
                    <input
                      type="text"
                      placeholder="e.g. Shop G12, Moi Avenue, Nairobi"
                      value={storeAddress}
                      onChange={(e) => setStoreAddress(e.target.value)}
                      className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-700 text-[12px] bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>
              )}

              {/* Location in Kenya */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-gray-800 dark:text-gray-200 block mb-1">County</label>
                  <select
                    value={county}
                    onChange={(e) => {
                      const newCounty = e.target.value;
                      setCounty(newCounty);
                      const cData = KENYA_COUNTIES.find((c) => c.name === newCounty);
                      if (cData && cData.towns.length > 0) setTown(cData.towns[0]);
                    }}
                    className="w-full px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[12px] text-gray-900 dark:text-white"
                  >
                    {KENYA_COUNTIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-800 dark:text-gray-200 block mb-1">Town</label>
                  <select
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    className="w-full px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[12px] text-gray-900 dark:text-white"
                  >
                    {countyData.towns.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-800 dark:text-gray-200 block mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="Create a secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px] text-gray-900 dark:text-white focus:outline-none focus:border-[#00A859]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#00A859] hover:bg-[#00924c] text-white font-bold py-2 rounded text-[13px] shadow-xs transition"
              >
                Create Account & Join adBay
              </button>

              <button
                type="button"
                onClick={async () => {
                  await loginWithGoogle();
                  setIsAuthModalOpen(false);
                }}
                className="w-full py-1.5 px-3 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded font-bold text-[13px] text-gray-800 dark:text-gray-200 flex items-center justify-center gap-2 shadow-2xs transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign up with Google Account</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
