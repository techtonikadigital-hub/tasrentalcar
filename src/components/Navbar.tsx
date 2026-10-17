import React, { useState } from 'react';
import { useApp, AppView } from '../context/AppContext';
import { ShieldCheck, Phone, Menu, X, Car as CarIcon, ArrowRight, Clock, MapPin } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentView, setCurrentView, settings, isAdminLoggedIn } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: AppView; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'cars', label: 'Our Cars' },
    { id: 'about', label: 'About Us' },
    { id: 'service-area', label: 'Service Area' },
    { id: 'faq', label: 'FAQ' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNav = (viewId: AppView) => {
    setCurrentView(viewId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* Top highlight bar for Depot Address & Direct Contact */}
      <div className="bg-[#111111] text-xs text-neutral-300 py-2 px-4 sm:px-8 flex justify-between items-center border-b border-neutral-800">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FFC928] text-black font-black text-[10px] tracking-wider uppercase shadow-sm">
            <MapPin className="w-3 h-3 text-black shrink-0" />
            Depot
          </span>
          <span className="text-white font-bold tracking-tight text-xs sm:text-[13px] truncate">
            {settings.physicalAddress || '176 Milperra Rd, Revesby NSW 2212, Australia'}
          </span>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(settings.physicalAddress || '176 Milperra Rd, Revesby NSW 2212, Australia')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-[11px] text-[#FFC928] hover:text-white underline font-semibold transition-colors ml-1"
          >
            <span>View Map</span>
          </a>
        </div>
        <div className="hidden md:flex items-center gap-5 shrink-0 text-neutral-300">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <Clock className="w-3 h-3 text-[#FFC928]" />
            <span>{settings.businessHours.split('|')[0] || 'Open 7 Days: 7:30 AM - 7:00 PM'}</span>
          </div>
          <a
            href={`tel:${settings.phoneNumber}`}
            className="hover:text-[#FFC928] transition-colors flex items-center gap-1.5 text-white font-bold bg-neutral-900 px-3 py-1 rounded-full border border-neutral-700 hover:border-[#FFC928]"
          >
            <Phone className="w-3 h-3 text-[#FFC928]" />
            <span>{settings.phoneNumber}</span>
          </a>
          {/* Only shown if administrator has an active authenticated session */}
          {isAdminLoggedIn && (
            <button
              onClick={() => handleNav('admin')}
              className="flex items-center gap-1 text-[#FFC928] hover:text-white transition-colors cursor-pointer text-xs font-bold bg-neutral-900 px-2.5 py-0.5 rounded border border-neutral-800"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Active</span>
            </button>
          )}
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNav('home')}
          className="flex items-center gap-3 text-left focus:outline-none cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-[#111111] flex items-center justify-center text-[#FFC928] font-black text-xl shadow-sm border border-neutral-800 group-hover:border-[#FFC928] transition-colors">
            {settings.logoText ? settings.logoText.charAt(0) : 'T'}
          </div>
          <div>
            <span className="block text-2xl font-black tracking-tight text-[#111111] font-heading">
              {settings.logoText || 'TAS'}
            </span>
            <span className="block text-[10px] tracking-widest font-bold uppercase text-[#666666]">
              {settings.logoSubtitle || 'CAR RENTAL'}
            </span>
          </div>
        </button>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`text-sm font-semibold tracking-wide transition-colors relative py-1 cursor-pointer ${
                  isActive
                    ? 'text-[#111111] font-bold'
                    : 'text-[#666666] hover:text-[#111111]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FFC928] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => handleNav('cars')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-[#FFC928] hover:bg-[#E5B21E] text-[#111111] shadow-sm hover:shadow transition-luxury cursor-pointer"
          >
            <span>Book a Car</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => handleNav('cars')}
            className="px-3 py-1.5 rounded-md text-xs font-bold bg-[#FFC928] text-[#111111]"
          >
            Fleet
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-neutral-800 hover:bg-neutral-100 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200 px-5 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="space-y-1 mb-5">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-base font-semibold ${
                  currentView === link.id
                    ? 'bg-neutral-100 text-[#111111] border-l-4 border-[#FFC928]'
                    : 'text-[#666666] hover:bg-neutral-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-100 space-y-2.5">
            <button
              onClick={() => handleNav('cars')}
              className="w-full py-3 rounded-lg font-bold bg-[#FFC928] text-[#111111] flex items-center justify-center gap-2"
            >
              <CarIcon className="w-4 h-4" />
              <span>Browse All Cars</span>
            </button>
            {isAdminLoggedIn && (
              <button
                onClick={() => handleNav('admin')}
                className="w-full py-2.5 rounded-lg text-xs font-semibold bg-neutral-900 text-[#FFC928] flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Open Admin Dashboard</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
