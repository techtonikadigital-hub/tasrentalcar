import React from 'react';
import { useApp } from '../context/AppContext';
import { VAN_IMAGES, resolveCarImage } from '../assets/images';
import {
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  ArrowRight,
  Navigation,
  Car as CarIcon,
  Users,
  Compass,
  Sparkles,
} from 'lucide-react';

export const ServiceAreaPage: React.FC = () => {
  const { settings, setCurrentView, openBookingForCar, publicCars } = useApp();

  const cleanWaNumber = settings.whatsAppNumber
    ? settings.whatsAppNumber.replace(/[^0-9]/g, '')
    : '';
  const waGreeting = encodeURIComponent(
    `G’day! I would like to enquire about passenger van hire service areas with ${settings.businessName || 'XPDX Van Hire Sydney'}.`
  );

  // Existing service locations across Sydney connected to our central Revesby Depot
  const serviceLocations = [
    {
      id: 'revesby-hq',
      name: 'Revesby & Canterbury-Bankstown (Depot HQ)',
      badge: 'Primary Showroom & Depot',
      distance: 'Depot Location (0 min)',
      image: VAN_IMAGES.fleetShowcase,
      description:
        'Our primary depot is centrally stationed at 176 Milperra Rd, Revesby NSW 2212. Direct M5 Motorway access, dedicated customer parking, and 5-minute key handover for Revesby, Bankstown, Padstow, Panania, and Milperra hirers.',
      keyHighlight: 'Instant 5-minute handover & 7-day pickup/drop-off',
      popularVans: '12-Seater Commuter & 7-Seater Carnival',
    },
    {
      id: 'liverpool-south-west',
      name: 'South-Western Sydney & Liverpool',
      badge: 'Rapid 10-Min M5 Transit',
      distance: 'Approx 8 km via M5 / Newbridge Rd',
      image: VAN_IMAGES.hiace12,
      description:
        'Serving Liverpool CBD, Moorebank, Prestons, Warwick Farm, and Campbelltown. Ideal for local sporting teams, school excursions, church communities, and tradies needing spacious 12-seater passenger and cargo vans.',
      keyHighlight: 'Direct arterial connection via Newbridge Road & M5',
      popularVans: 'Toyota HiAce 12-Seater & 1.5T Cargo Van',
    },
    {
      id: 'sydney-airport-mascot',
      name: 'Sydney Airport & Mascot (Group Transfers)',
      badge: 'Direct Tunnel Corridor',
      distance: 'Approx 18 km via M5 East Motorway',
      image: VAN_IMAGES.carnival,
      description:
        'Fast motorway access directly into Sydney Domestic (T2/T3) and International (T1) terminals. Our 7 & 8-seater Kia Carnivals offer luxury seating and massive luggage capacity for incoming and departing holidaymakers.',
      keyHighlight: 'Expansive boot luggage space for travel groups',
      popularVans: 'Kia Carnival 2024 SLI & Toyota Estima',
    },
    {
      id: 'parramatta-inner-west',
      name: 'Parramatta & Sydney Olympic Park',
      badge: 'Central Western Hub',
      distance: 'Approx 15 km via Woodville Rd / A3',
      image: VAN_IMAGES.estima,
      description:
        'Quick transit across Woodville Road into Parramatta CBD, Homebush, Strathfield, and Sydney Olympic Park. The go-to passenger van solution for concert shuttles, corporate summits, and sporting tournaments.',
      keyHighlight: 'Group transit for Olympic Park events & stadiums',
      popularVans: 'Toyota Estima 8-Seater & Kia Carnival',
    },
    {
      id: 'sydney-cbd-eastern',
      name: 'Sydney CBD & Eastern Suburbs',
      badge: 'Metro Connected',
      distance: 'Approx 22 km via M5 / WestConnex',
      image: VAN_IMAGES.luxuryShowcase,
      description:
        'Connected directly into Sydney City, Alexandria, Surry Hills, and Bondi. Premium, comfortable people movers for weekend coastal getaways, wedding party transfers, and executive corporate delegations.',
      keyHighlight: 'Comfortable air-conditioned long-distance cruising',
      popularVans: 'Kia Carnival Luxury 8-Seater Auto',
    },
    {
      id: 'sutherland-st-george',
      name: 'Sutherland Shire & St George',
      badge: 'Direct Bridge Crossing',
      distance: 'Approx 12 km via Alfords Point Rd',
      image: VAN_IMAGES.renaultMaster,
      description:
        'Convenient cross-river connection via Alfords Point Bridge to Menai, Miranda, Cronulla, Hurstville, and Kogarah. Popular for South Coast road trips, DIY home relocations, and weekend surf safaris.',
      keyHighlight: 'Easy gateway to Royal National Park & South Coast',
      popularVans: 'Renault Master 2T Van & Toyota HiAce',
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative bg-neutral-950 text-white overflow-hidden py-16 sm:py-24 border-b border-neutral-800">
        <div className="absolute inset-0 z-0">
          <img
            src={VAN_IMAGES.fleetShowcase}
            alt="XPDX Van Hire Sydney Fleet Showcase"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC928] text-black text-xs font-black uppercase tracking-wider shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-black" />
              <span>Sydney Service Coverage</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-heading leading-tight">
              Van Hire Service Areas Across Sydney
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
              Based at <strong className="text-[#FFC928]">{settings.physicalAddress}</strong> with direct access to the M5 Motorway, {settings.businessName || 'XPDX Van Hire Sydney'} delivers quality 7 & 12-seater passenger van and commercial van rentals across Canterbury-Bankstown, Western Sydney, Liverpool, Sydney Airport, and Greater Sydney.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  setCurrentView('cars');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-sm font-bold bg-[#FFC928] hover:bg-[#E5B21E] text-[#111111] shadow-lg hover:shadow-xl transition-luxury cursor-pointer"
              >
                <span>Browse Available Van Fleet</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`tel:${settings.phoneNumber}`}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg text-sm font-bold bg-neutral-900/90 hover:bg-neutral-800 text-white border border-neutral-700 transition-luxury"
              >
                <Phone className="w-4 h-4 text-[#FFC928]" />
                <span>Call {settings.phoneNumber}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICE AREA INTRODUCTION */}
      <section className="py-14 sm:py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-black bg-[#FFC928] px-3.5 py-1 rounded-full shadow-sm">
                Centrally Positioned in Revesby
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111111] font-heading tracking-tight">
                Direct M5 Access to Every Corner of Sydney
              </h2>
              <p className="text-sm sm:text-base text-[#666666] leading-relaxed">
                Whether you need a luxury 7 or 8-seater Kia Carnival for a family holiday, or a 12-seater Toyota HiAce commuter for a sports tournament or corporate trip, our central Revesby location gives you immediate access to Sydney’s main motorway network.
              </p>
              <p className="text-sm text-[#666666] leading-relaxed">
                Located right on Milperra Road just minutes from the M5 on-ramps, you avoid congested inner-city traffic when picking up your vehicle. We provide simple paperwork, rapid 5-minute key handovers, and clean, fully sanitised, mechanically inspected vehicles ready to hit the road.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <div className="flex items-center gap-2.5 text-xs font-bold text-neutral-800 bg-white p-3 rounded-lg border border-neutral-200 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#FFC928] shrink-0" />
                  <span>Standard Car Licence (Class C)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-neutral-800 bg-white p-3 rounded-lg border border-neutral-200 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#FFC928] shrink-0" />
                  <span>5-Minute Key Handover</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-neutral-800 bg-white p-3 rounded-lg border border-neutral-200 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#FFC928] shrink-0" />
                  <span>Generous Daily Km Allowances</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-neutral-800 bg-white p-3 rounded-lg border border-neutral-200 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#FFC928] shrink-0" />
                  <span>Open 7 Days (7:30 AM – 7:00 PM)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-[#111111] text-white p-6 sm:p-8 rounded-2xl border-2 border-[#FFC928] shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-2 text-[#FFC928] text-xs font-bold uppercase mb-2">
                  <Compass className="w-4 h-4" />
                  <span>Depot Coordinates</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
                  {settings.businessName || 'XPDX Van Hire Sydney'}
                </h3>
                <p className="text-sm font-semibold text-[#FFC928] mt-1">
                  {settings.physicalAddress}
                </p>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  Situated directly between Milperra Road and the M5 corridor, minutes from Bankstown Airport and Padstow train station.
                </p>

                <div className="mt-5 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Opening Hours:</span>
                  <span className="font-bold text-white">{settings.businessHours.split('|')[0] || 'Open 7 Days: 7:30 AM – 7:00 PM'}</span>
                </div>

                <div className="mt-4">
                  <a
                    href={settings.googleMapsEmbedUrl || `https://maps.google.com/?q=${encodeURIComponent(settings.physicalAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#FFC928] hover:bg-[#E5B21E] text-black font-bold text-xs transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Get Directions to Depot</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LOCATION CARDS GRID */}
      <section className="py-16 sm:py-24 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-black bg-[#FFC928] px-3.5 py-1 rounded-full shadow-sm">
              Destinations & Routes
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight mt-3 font-heading">
              Key Sydney Service Locations
            </h2>
            <p className="text-sm text-[#666666] mt-2">
              Explore how easy it is to hire and drive our passenger vans across Sydney’s premier regions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceLocations.map((loc) => (
              <div
                key={loc.id}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
              >
                {/* Location Image */}
                <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden shrink-0">
                  <img
                    src={resolveCarImage(loc.image)}
                    alt={loc.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#111111]/90 text-[#FFC928] backdrop-blur-sm shadow-sm">
                      {loc.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-black/75 text-white backdrop-blur-sm">
                      {loc.distance}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#111111] group-hover:text-black font-heading leading-tight mb-2">
                      {loc.name}
                    </h3>
                    <p className="text-xs text-[#666666] leading-relaxed mb-4">
                      {loc.description}
                    </p>

                    <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-100 text-xs space-y-1 mb-4">
                      <div className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider">
                        Popular Choice:
                      </div>
                      <div className="font-bold text-[#111111]">
                        {loc.popularVans}
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="pt-2 border-t border-neutral-100">
                    <button
                      onClick={() => {
                        setCurrentView('cars');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-bold bg-neutral-100 hover:bg-[#FFC928] text-[#111111] transition-all cursor-pointer"
                    >
                      <span>View Vans for This Region</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SERVICE INFORMATION & RENTAL ADVANTAGES */}
      <section className="py-16 sm:py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-black bg-[#FFC928] px-3.5 py-1 rounded-full shadow-sm">
              Simple & Professional Hire
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#111111] font-heading tracking-tight mt-3">
              Why Sydney Chooses Our Van Hire
            </h2>
            <p className="text-sm text-[#666666] mt-2">
              Straightforward terms, reliable vehicles, and fair local pricing without corporate airport markups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#FFC928]/20 text-black flex items-center justify-center font-bold mb-4">
                <CarIcon className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-base font-bold text-[#111111] font-heading mb-1.5">
                Standard Car Licence
              </h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                Both our 7-seater Kia Carnivals and 12-seater Toyota HiAce passenger vans require only a standard Class C car licence. No bus licence needed.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#FFC928]/20 text-black flex items-center justify-center font-bold mb-4">
                <Clock className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-base font-bold text-[#111111] font-heading mb-1.5">
                Quick 5-Min Handover
              </h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                No waiting in long queues. Quick licence scan, key handover, and vehicle inspection so you and your group are on the road in minutes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#FFC928]/20 text-black flex items-center justify-center font-bold mb-4">
                <Users className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-base font-bold text-[#111111] font-heading mb-1.5">
                Room for Everyone & Bags
              </h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                High-roof headroom, dual cold air conditioning throughout all passenger rows, and expansive cargo space for suitcases, sporting gear, and equipment.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#FFC928]/20 text-black flex items-center justify-center font-bold mb-4">
                <ShieldCheck className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-base font-bold text-[#111111] font-heading mb-1.5">
                Fully Maintained & Sanitised
              </h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                Every vehicle undergoes thorough mechanical roadworthy checks, tyre pressure and fluid inspections, and detailed interior sanitisation before handover.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION */}
      <section className="py-16 sm:py-20 bg-neutral-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-xs font-black uppercase tracking-wider text-black bg-[#FFC928] px-3.5 py-1 rounded-full shadow-sm inline-block mb-4">
            Instant Sydney Van Reservations
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-heading tracking-tight max-w-3xl mx-auto">
            Ready to Hire a Van in Sydney?
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base max-w-2xl mx-auto mt-4 leading-relaxed">
            Reserve your 7 or 12-seater passenger van or commercial cargo vehicle today with quick pickup at 176 Milperra Rd, Revesby.
          </p>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                setCurrentView('cars');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-lg text-sm font-black bg-[#FFC928] hover:bg-[#E5B21E] text-black shadow-xl hover:shadow-2xl transition-luxury cursor-pointer"
            >
              <span>Explore All Vehicles & Rates</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={`tel:${settings.phoneNumber}`}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-lg text-sm font-bold bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 transition-luxury"
            >
              <Phone className="w-4 h-4 text-[#FFC928]" />
              <span>Call Us: {settings.phoneNumber}</span>
            </a>

            {cleanWaNumber && (
              <a
                href={`https://wa.me/${cleanWaNumber}?text=${waGreeting}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-lg text-sm font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white transition-luxury shadow-md"
              >
                <span>WhatsApp Enquiry</span>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
