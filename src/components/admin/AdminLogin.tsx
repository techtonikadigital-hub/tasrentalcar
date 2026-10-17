import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, KeyRound } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, setCurrentView, settings } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const res = loginAdmin(email, password);
    if (!res.success) {
      setErrorMsg(res.message || 'Invalid credentials');
      setIsSubmitting(false);
    }
  };

  const handleAutofillDemo = () => {
    setEmail('admin@tascarrental.com.au');
    setPassword('admin123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#FFC928]/10 blur-3xl pointer-events-none" />

      {/* Return to website link */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => setCurrentView('home')}
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white transition-colors cursor-pointer bg-neutral-900/80 px-4 py-2 rounded-lg border border-neutral-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Website</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Brand header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#FFC928] text-black font-black text-2xl flex items-center justify-center mx-auto shadow-lg mb-4">
            {settings.logoText ? settings.logoText.charAt(0) : 'T'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading">
            {settings.logoText || 'TAS'} Fleet Admin
          </h2>
          <p className="mt-1.5 text-xs text-neutral-400">
            Secure administrative control panel for TAS Car Rental depot
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-8 bg-neutral-900 border border-neutral-800 py-8 px-6 sm:px-10 rounded-2xl shadow-2xl relative">
          {errorMsg && (
            <div className="mb-5 p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-200 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@tascarrental.com.au"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-3 rounded-lg bg-neutral-950 border border-neutral-700 text-xs font-medium text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFC928]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-3 rounded-lg bg-neutral-950 border border-neutral-700 text-xs font-medium text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFC928]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 mt-2 rounded-lg bg-[#FFC928] hover:bg-[#E5B21E] text-black font-bold text-sm flex items-center justify-center gap-2 transition-luxury cursor-pointer shadow-md disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Autofill */}
          <div className="mt-6 pt-5 border-t border-neutral-800">
            <button
              type="button"
              onClick={handleAutofillDemo}
              className="w-full py-2.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#FFC928]" />
              <span>Autofill Demo Credentials</span>
            </button>
            <p className="text-[11px] text-center text-neutral-500 mt-2">
              Default: <code className="text-neutral-400">admin@tascarrental.com.au</code> / <code className="text-neutral-400">admin123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
