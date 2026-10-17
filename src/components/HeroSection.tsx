import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Calendar, Car as CarIcon, CheckCircle2, ShieldCheck, Sparkles, MapPin, Phone } from 'lucide-react';
import { resolveCarImage, VAN_IMAGES } from '../assets/images';

export const HeroSection: React.FC = () => {
  const { settings, publicCars, setCurrentView, openBookingForCar } = useApp();

  const [pickupDate, setPickupDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });

  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().slice(0, 10);
  });

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');

  const handleQuickEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedVehicleId) {
      const car = publicCars.find((c) => c.id === selectedVehicleId);
      if (car) {
        openBookingForCar(car);
        return;
      }
    }
    // If no vehicle selected, proceed to car catalogue
    setCurrentView('cars');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-neutral-950 border-b border-neutral-800 text-white py-12 lg:py-20">
      {/* Background Image with Cinematic Dark Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={resolveCarImage(settings.heroImageUrl || VAN_IMAGES.fleetShowcase)}
          alt="TAS Car Rental Fleet Background"
          className="w-full h-full object-cover object-center scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = VAN_IMAGES.fleetShowcase;
          }}
        />
        {/* Multilayer gradient for high contrast readability and luxury mood */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/95 via-neutral-950/88 to-neutral-900/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#FFC928]/10 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline, Copy, CTA */}
          <div className="lg:col-span-7 space-y-6">

            {/* Prominently Highlighted Depot Address */}
            {/* <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/95 border-2 border-[#FFC928] text-xs text-white shadow-lg backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFC928] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFC928]"></span>
              </span>
              <MapPin className="w-4 h-4 text-[#FFC928] shrink-0" />
              <span className="font-extrabold text-[#FFC928] uppercase tracking-wide">Pickup & Return Depot:</span>
              <span className="font-bold text-white">{settings.physicalAddress}</span>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(settings.physicalAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-[#FFC928] hover:text-white underline font-extrabold transition-colors"
              >
                Directions
              </a>
            </div> */}

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] font-heading">
              {settings.heroHeadline || 'Find the Perfect Car for Your Next Journey.'}
            </h1>

            <p className="text-lg text-neutral-300 font-normal leading-relaxed max-w-xl">
              {settings.heroSupportingText ||
                'Pristine luxury, performance sports cars, and executive SUVs available for immediate handover from our flagship boutique lounge.'}
            </p>

            {/* Trust Highlights */}
            {/* <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-semibold text-neutral-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FFC928] shrink-0" />
                <span>Drive on Normal Car Licence</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FFC928] shrink-0" />
                <span>Clean, Cold Air-Con Vans</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FFC928] shrink-0" />
                <span>Fair Dinkum, No Hidden Fees</span>
              </div>
            </div> */}

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => {
                  setCurrentView('cars');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg text-base font-bold bg-[#FFC928] hover:bg-[#E5B21E] text-[#111111] shadow-lg hover:shadow-xl transition-luxury cursor-pointer"
              >
                <span>View 7 & 12 Seater Vans</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setCurrentView('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-base font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-luxury cursor-pointer"
              >
                <span>Get a Quick Quote</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Automotive Showcase Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden bg-neutral-900/80 border border-white/20 shadow-2xl group backdrop-blur-sm">
              <img
                src={resolveCarImage(settings.heroImageUrl || VAN_IMAGES.fleetShowcase)}
                alt="Australian Toyota HiAce and Kia Carnival Passenger Vans"
                className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = VAN_IMAGES.fleetShowcase;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold tracking-widest text-[#FFC928] uppercase">
                      Open 7 Days • In Stock
                    </span>
                    <h3 className="text-xl font-bold text-white">Toyota HiAce & Kia Carnival</h3>
                    <p className="text-xs text-neutral-300">7 & 12-seater passenger vans ready for pickup</p>
                  </div>
                  <div className="bg-[#FFC928] text-black px-3 py-1.5 rounded-md text-xs font-black shadow-sm">
                    READY
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Rental Enquiry Bar */}
        <div className="mt-12 bg-white rounded-xl border border-neutral-300 p-4 sm:p-6 shadow-2xl text-neutral-900">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-600">
              <Sparkles className="w-3.5 h-3.5 text-[#FFC928]" />
              <span>Quick Van Availability & Quote</span>
            </div>
            <span className="text-xs text-neutral-500 hidden sm:inline">
              Instant quote & friendly team support
            </span>
          </div>

          <form onSubmit={handleQuickEnquiry} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Vehicle Selection */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Select Vehicle
              </label>
              <div className="relative">
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full h-11 pl-3 pr-8 rounded-lg bg-neutral-50 border border-neutral-300 text-sm font-medium text-neutral-900 focus:outline-none focus:border-black focus:bg-white transition-colors"
                >
                  <option value="">All Vehicles / Any Model</option>
                  {publicCars.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.make} {car.model} ({settings.showPricing ? `${settings.currency}${car.pricePerDay}/day${car.pricePerWeek ? ` • ${settings.currency}${car.pricePerWeek}/wk` : ''}` : car.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pickup Date */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Pickup Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-sm font-medium text-neutral-900 focus:outline-none focus:border-black focus:bg-white transition-colors"
                  required
                />
              </div>
            </div>

            {/* Return Date */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Return Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={returnDate}
                  min={pickupDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-sm font-medium text-neutral-900 focus:outline-none focus:border-black focus:bg-white transition-colors"
                  required
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full h-11 rounded-lg bg-[#FFC928] hover:bg-[#E5B21E] text-[#111111] font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-luxury cursor-pointer"
              >
                <span>Check Availability</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
