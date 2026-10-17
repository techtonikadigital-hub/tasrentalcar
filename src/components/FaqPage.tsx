import React from 'react';
import { useApp } from '../context/AppContext';
import { FaqSection } from './FaqSection';
import { HelpCircle, ShieldCheck, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="bg-white">
      {/* Page Header */}
      <div className="bg-neutral-950 text-white py-14 sm:py-20 border-b border-neutral-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#FFC928_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 mb-4">
            <button
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-[#FFC928]">Frequently Asked Questions</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-heading max-w-3xl">
            Frequently Asked Questions & Rental Policies
          </h1>
          <p className="text-base text-neutral-300 max-w-2xl mt-3 leading-relaxed">
            Everything you need to know about renting our performance and luxury fleet. We operate with complete transparency, zero hidden charges, and clear security terms.
          </p>

          {/* Quick Key Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-neutral-800 text-xs font-semibold text-neutral-200">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#FFC928] shrink-0" />
              <span>Prompt 24-48h Security Deposit Release</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#FFC928] shrink-0" />
              <span>Free Cancellation Up to 48h Prior</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#FFC928] shrink-0" />
              <span>100% Guaranteed Staged Handover</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main FAQ Accordion Component */}
      <FaqSection isStandalonePage={true} />
    </div>
  );
};
