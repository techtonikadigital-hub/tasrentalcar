import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, MapPin, Award, CheckCircle, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { settings, setCurrentView } = useApp();

  return (
    <div className="bg-white min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Split About Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-black bg-[#FFC928] px-3.5 py-1 rounded-full shadow-sm">
              About TAS Car Rental
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111111] tracking-tight font-heading">
              Making 7 & 12 Seater Van Hire Easy in Sydney
            </h1>
            <p className="text-base text-[#666666] leading-relaxed">
              G’day! Based at <strong className="text-neutral-900 font-bold">{settings.physicalAddress}</strong>, {settings.businessName || 'TAS Car Rental'} provides clean, reliable passenger vans and vehicles without the hassle or high prices of big corporate car rental companies.
            </p>
            <p className="text-sm text-[#666666] leading-relaxed">
              Whether you are taking the family down the coast in a comfortable 7-seater Kia Carnival, or heading away with your footy club, church group, or work crew in a 12-seater Toyota HiAce, we make hiring simple. Quick 5-minute key handover at our Revesby depot, straightforward terms, and no hidden fees.
            </p>

            {/* Trust points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#F5F5F5] border border-neutral-200">
                <div className="flex items-center gap-2 font-bold text-sm text-[#111111] mb-1">
                  <ShieldCheck className="w-4 h-4 text-[#FFC928]" />
                  <span>Standard Car Licence OK</span>
                </div>
                <p className="text-xs text-[#666666]">
                  Every single van we hire—including the 12-seater Toyota HiAce—can be driven on a regular Australian Class C driver licence.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F5F5F5] border border-neutral-200">
                <div className="flex items-center gap-2 font-bold text-sm text-[#111111] mb-1">
                  <Award className="w-4 h-4 text-[#FFC928]" />
                  <span>Clean & Road-Ready</span>
                </div>
                <p className="text-xs text-[#666666]">
                  Full safety checks, ice-cold dual air con, and thoroughly vacuumed and sanitised before every hire.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => {
                  setCurrentView('cars');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold bg-[#FFC928] hover:bg-[#E5B21E] text-[#111111] transition-luxury cursor-pointer shadow-sm"
              >
                <span>View Our Vans</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setCurrentView('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold bg-neutral-100 hover:bg-neutral-200 text-[#111111] border border-neutral-300 transition-luxury cursor-pointer"
              >
                <span>Contact Our Team</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#FFC928]">
              <img
                src="/src/assets/images/aussie_van_fleet_showcase_1792057595502.jpg"
                alt="TAS Car Rental Depot and Fleet"
                className="w-full h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
                <div className="flex items-center gap-2 text-[#FFC928] text-xs font-black uppercase mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>Depot Location</span>
                </div>
                <h3 className="text-xl font-black text-white">{settings.businessName || 'TAS Car Rental'}</h3>
                <p className="text-sm font-bold text-[#FFC928] mt-0.5">{settings.physicalAddress}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Principles */}
        <div className="border-t border-neutral-200 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <span className="text-2xl font-black text-[#FFC928]">01</span>
              <h3 className="text-lg font-bold text-[#111111] font-heading">Straightforward Pricing</h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                Clear daily rates, generous kilometre allowances, and honest bond refunds. What you see is what you pay.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-2xl font-black text-[#FFC928]">02</span>
              <h3 className="text-lg font-bold text-[#111111] font-heading">Friendly Local Service</h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                Talk directly to real locals who know passenger vans inside out. We help with child seats, luggage tips, and route planning.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-2xl font-black text-[#FFC928]">03</span>
              <h3 className="text-lg font-bold text-[#111111] font-heading">No Waiting in Long Lines</h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                Quick 5-minute key handover so you can spend less time filling out paperwork and more time enjoying your trip.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
