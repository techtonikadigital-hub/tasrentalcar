import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Award, KeyRound, Sparkles, ArrowRight, Phone, CheckCircle2 } from 'lucide-react';
import { VAN_IMAGES } from '../assets/images';

export const FleetShowcaseSection: React.FC = () => {
  const { settings, setCurrentView } = useApp();

  const cleanWaNumber = settings.whatsAppNumber ? settings.whatsAppNumber.replace(/[^0-9]/g, '') : '';
  const waGreeting = encodeURIComponent(
    settings.whatsAppGreeting || 'G’day! I would like to check availability for hiring a 7 or 12 seater passenger van.'
  );

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-neutral-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT SIDE: Cars & Fleet Showcase Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-300 shadow-2xl bg-neutral-950 group">
              <div className="relative h-[340px] sm:h-[420px] md:h-[480px] w-full overflow-hidden">
                <img
                  src={VAN_IMAGES.fleetShowcase}
                  alt="Aussie Passenger Van Hire - Toyota HiAce 12 Seater and Kia Carnival 7 Seater"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/25 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/40 via-transparent to-transparent pointer-events-none" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="bg-[#111111]/85 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-[#FFC928] animate-pulse" />
                    <span>7 & 12 Seater Vans In Stock</span>
                  </div>
                </div>

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                  <div className="p-4 rounded-xl bg-neutral-900/90 backdrop-blur-md border border-white/15 text-white flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#FFC928]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ready For Pickup Today</span>
                      </div>
                      <p className="text-xs text-neutral-300 mt-0.5">
                        Toyota HiAce (12 Seats) • Kia Carnival (7 & 8 Seats)
                      </p>
                    </div>
                    <div className="hidden sm:block text-right">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">Licence</span>
                      <span className="text-xs font-bold text-white">Normal Car Licence</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Experience Badge: "5 Years" */}
            <div className="absolute -bottom-5 -right-3 sm:-bottom-6 sm:right-6 bg-[#111111] text-white p-4 sm:p-5 rounded-2xl border-2 border-[#FFC928] shadow-2xl flex items-center gap-4 z-20">
              <div className="w-12 h-12 rounded-xl bg-[#FFC928] text-[#111111] font-black text-2xl flex items-center justify-center shrink-0 shadow-md font-heading">
                5+
              </div>
              <div>
                <span className="text-xs sm:text-sm font-black text-white block uppercase tracking-wider">
                  Years of Van Hire
                </span>
                <span className="text-[11px] text-neutral-400 block">
                  Started 5 years ago in Australia
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Content Section */}
          <div className="lg:col-span-6 space-y-6 pt-6 lg:pt-0">
            <div>
              {/* <span className="text-xs font-bold uppercase tracking-wider text-[#997300] bg-[#FFC928]/20 px-3 py-1 rounded-full inline-block mb-3">
                Started 5 Years Ago • Local Aussie Service
              </span> */}
              <h2 className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight font-heading leading-tight">
                Trusted Van Hire Since 5 Years Ago
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#000000] leading-relaxed">
              We started out 5 years ago with a simple mission: <span className="font-semibold text-neutral-900">make hiring a 7 or 12-seater passenger van easy, affordable, and completely stress-free</span>. Five years ago, we noticed big hire companies hit Aussies with confusing rules and surprise fees. We do things differently—clean, reliable vans, straightforward pricing, and friendly service every time.
            </p>

            {/* 4 Feature Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-xl bg-[#FFFFF] border border-neutral-200">
                <div className="flex items-center gap-2 font-bold text-sm text-[#111111] mb-1">
                  {/* <ShieldCheck className="w-4 h-4 text-[#FFC928] shrink-0" /> */}
                  <span>Normal Car Licence</span>
                </div>
                <p className="text-sm text-[#000000] leading-relaxed">
                  No special bus licence needed. You can drive our 12-seater HiAce and 7-seater Carnival on a standard Class C car licence.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FFFFFFF] border border-neutral-200">
                <div className="flex items-center gap-2 font-bold text-sm text-[#111111] mb-1">
                  {/* <Award className="w-4 h-4 text-[#FFC928] shrink-0" /> */}
                  <span>5-Year Track Record</span>
                </div>
                <p className="text-sm text-[#000000] leading-relaxed">
                  Over 5 years of happy Aussie families, sports teams, church groups, and work crews on the road.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FFFFFF] border border-neutral-200">
                <div className="flex items-center gap-2 font-bold text-sm text-[#111111] mb-1">
                  {/* <KeyRound className="w-4 h-4 text-[#FFC928] shrink-0" /> */}
                  <span>Quick 5-Min Handover</span>
                </div>
                <p className="text-sm text-[#000000] leading-relaxed">
                  Quick paperwork check, keys in hand, and you’re off on your trip in just a few minutes.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FFFFFF] border border-neutral-200">
                <div className="flex items-center gap-2 font-bold text-sm text-[#111111] mb-1">
                  {/* <Sparkles className="w-4 h-4 text-[#FFC928] shrink-0" /> */}
                  <span>Spotless & Road Ready</span>
                </div>
                <p className="text-sm text-[#OOOOO] leading-relaxed">
                  Every van is mechanically inspected, vacuumed, washed, and sanitised before every hire.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setCurrentView('cars');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-sm font-bold bg-[#FFC928] hover:bg-[#E5B21E] text-[#111111] shadow-sm hover:shadow-md transition-luxury cursor-pointer"
              >
                <span>View All 7 & 12 Seater Vans</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* WhatsApp Button - Icon ONLY (no text) */}
              {cleanWaNumber && (
                <a
                  href={`https://wa.me/${cleanWaNumber}?text=${waGreeting}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="WhatsApp Enquiry"
                  aria-label="WhatsApp Enquiry"
                  className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white transition-luxury shadow-sm cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.711 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              )}

              {/* Showroom Call Button */}
              <a
                href={`tel:${settings.phoneNumber}`}
                title={`Call us: ${settings.phoneNumber}`}
                aria-label={`Call us: ${settings.phoneNumber}`}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg text-sm font-bold  hover:bg-neutral-200 text-[#111111] border border-neutral-300 transition-luxury cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#997300]" />
                <span>Call Us Directly</span>
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
