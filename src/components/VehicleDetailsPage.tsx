import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Car } from '../types';
import { resolveCarImage, VAN_IMAGES } from '../assets/images';
import {
  ArrowLeft,
  Calendar,
  Users,
  Fuel,
  Gauge,
  ShieldCheck,
  Check,
  ArrowRight,
  Phone,
  Clock,
  Car as CarIcon,
  MapPin,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { CarCard } from './CarCard';

export const VehicleDetailsPage: React.FC = () => {
  const {
    selectedCarForDetails,
    setSelectedCarForDetails,
    setCurrentView,
    publicCars,
    settings,
    submitLead,
    formatCurrency,
  } = useApp();

  // If no car is selected, fall back to first active public car
  const car: Car | undefined = selectedCarForDetails || publicCars[0];

  // Active photo for the main gallery viewer
  const [activePhoto, setActivePhoto] = useState<string>('');

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
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
  const [pickupTime, setPickupTime] = useState('10:00 AM');
  const [customerMessage, setCustomerMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Gather ALL unique, valid images for this vehicle (primary image + all uploaded gallery photos)
  const vehicleImages = useMemo(() => {
    if (!car) return [];
    const images: string[] = [];
    if (car.mainImage && typeof car.mainImage === 'string' && car.mainImage.trim()) {
      images.push(car.mainImage.trim());
    }
    if (Array.isArray(car.gallery)) {
      car.gallery.forEach((img) => {
        if (img && typeof img === 'string' && img.trim() && !images.includes(img.trim())) {
          images.push(img.trim());
        }
      });
    }
    return images.length > 0 ? images : [car.mainImage || ''];
  }, [car]);

  // Synchronize active photo when car changes
  useEffect(() => {
    if (car) {
      setActivePhoto(car.mainImage || (car.gallery && car.gallery[0]) || '');
      setIsSubmittedSuccess(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [car?.id]);

  if (!car) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <CarIcon className="w-16 h-16 text-neutral-300 mb-4 animate-bounce" />
        <h2 className="text-2xl font-black text-[#111111] font-heading">Vehicle Not Found</h2>
        <p className="text-sm text-[#666666] max-w-md mt-2 mb-6">
          The requested vehicle may have been relocated or updated. Please browse our full fleet of 7 & 12 seater passenger vans.
        </p>
        <button
          onClick={() => {
            setCurrentView('cars');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold bg-[#FFC928] text-black shadow-md hover:bg-[#E5B21E]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Available Fleet</span>
        </button>
      </div>
    );
  }

  // Calculate rental duration in days
  const calculateDays = () => {
    const start = new Date(pickupDate).getTime();
    const end = new Date(returnDate).getTime();
    const diff = Math.ceil((end - start) / (1000 * 3600 * 24));
    return diff > 0 ? diff : 1;
  };

  const days = calculateDays();
  const estimatedTotal = settings.showPricing
    ? car.pricePerWeek && days >= 7
      ? Math.floor(days / 7) * car.pricePerWeek + (days % 7) * car.pricePerDay
      : days * car.pricePerDay
    : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      submitLead({
        customerName,
        phoneNumber,
        email,
        requestedCarId: car.id,
        requestedCarName: `${car.make} ${car.model}`,
        requestedCarImage: car.mainImage,
        pickupDate,
        returnDate,
        pickupTime,
        customerMessage:
          customerMessage ||
          `Interested in renting the ${car.year} ${car.make} ${car.model} for ${days} days (${pickupDate} to ${returnDate}).`,
        leadSource: 'Car Details',
        estimatedTotal,
      });

      setIsSubmittedSuccess(true);
      setCustomerName('');
      setPhoneNumber('');
      setEmail('');
      setCustomerMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsAppMessage = encodeURIComponent(
    `Hello ${settings.businessName || 'XPDX Van Hire Sydney'}, I am interested in booking the ${car.year} ${car.make} ${car.model} from ${pickupDate} to ${returnDate}. Please advise on current availability and handover details.`
  );
  const whatsAppUrl = settings.whatsAppNumber
    ? `https://wa.me/${settings.whatsAppNumber.replace(/[^0-9]/g, '')}?text=${whatsAppMessage}`
    : null;

  // Other similar vans
  const similarVans = publicCars.filter((c) => c.id !== car.id).slice(0, 3);

  return (
    <div className="bg-white min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-200">
          <button
            onClick={() => {
              setCurrentView('cars');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-700 hover:text-black transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#FFC928]" />
            <span>Back to All Passenger Vans</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500">
            <span>Home</span>
            <span>/</span>
            <span
              onClick={() => {
                setCurrentView('cars');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer hover:text-black font-semibold"
            >
              Our Fleet
            </span>
            <span>/</span>
            <span className="text-black font-bold truncate max-w-[200px]">
              {car.make} {car.model}
            </span>
          </div>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#FFC928] text-black shadow-xs">
                {car.category}
              </span>
              {car.status === 'Active' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-neutral-900 text-[#FFC928]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFC928] animate-pulse" />
                  Available at Revesby Depot
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-200 text-neutral-700">
                  Reserved / Contact for Dates
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#111111] font-heading tracking-tight">
              {car.year} {car.make} {car.model}
            </h1>
            <p className="text-xs sm:text-sm text-[#666666] mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#FFC928]" />
              <span>{settings.physicalAddress}</span>
            </p>
          </div>

          {/* Pricing Highlight on Desktop Header */}
          {settings.showPricing && (
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-right shrink-0">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block">
                Standard Hire Rate
              </span>
              <div className="flex items-baseline justify-end gap-1.5">
                <span className="text-3xl font-black text-[#111111] font-heading">
                  {formatCurrency(car.pricePerDay)}
                </span>
                <span className="text-xs text-neutral-600 font-semibold">/day</span>
              </div>
              {car.pricePerWeek && (
                <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded inline-block mt-1">
                  Weekly Rate: {formatCurrency(car.pricePerWeek)}/wk
                </span>
              )}
            </div>
          )}
        </div>

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: Main Visual, Multi-Image Gallery, Specs, Description, Terms (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Main Visual & Thumbnail Gallery Card */}
            <div className="bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800 shadow-xl">
              {/* Primary Large Vehicle Image */}
              <div className="aspect-[16/10] sm:aspect-[16/9] w-full bg-neutral-900 overflow-hidden relative flex items-center justify-center">
                <img
                  src={resolveCarImage(activePhoto || car.mainImage)}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = VAN_IMAGES.cargoVan;
                  }}
                />

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded bg-[#111111]/80 backdrop-blur-md text-white text-xs font-bold border border-white/10 shadow-md">
                    {car.year} Model
                  </span>
                </div>
              </div>

              {/* THUMBNAIL GALLERY: Displays ALL uploaded vehicle photos directly beneath main image */}
              {vehicleImages.length > 0 && (
                <div className="p-3 sm:p-4 bg-neutral-950 border-t border-neutral-800">
                  <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-1 scrollbar-thin">
                    {vehicleImages.map((imgUrl, idx) => {
                      const isSelected = (activePhoto || car.mainImage) === imgUrl;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActivePhoto(imgUrl)}
                          className={`w-20 h-14 sm:w-24 sm:h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer relative ${
                            isSelected
                              ? 'border-[#FFC928] ring-2 ring-[#FFC928]/50 scale-105 shadow-md opacity-100 z-10'
                              : 'border-neutral-700/80 opacity-70 hover:opacity-100 hover:border-neutral-400'
                          }`}
                          title={`View photo ${idx + 1} of ${vehicleImages.length}`}
                          aria-label={`View photo ${idx + 1}`}
                        >
                          <img
                            src={resolveCarImage(imgUrl)}
                            alt={`${car.make} ${car.model} photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = VAN_IMAGES.cargoVan;
                            }}
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-[#FFC928]/15 pointer-events-none" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {vehicleImages.length > 1 && (
                    <p className="text-[11px] text-neutral-400 mt-2 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFC928]" />
                      <span>
                        Showing all {vehicleImages.length} uploaded vehicle photos. Click any thumbnail to view.
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Vehicle Specifications Grid */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#111111] mb-3 font-heading">
                Key Vehicle Specifications
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-[#F5F5F5] p-3.5 rounded-xl border border-neutral-200">
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold tracking-wider mb-1">
                    Transmission
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-[#111111]">
                    <Gauge className="w-4 h-4 text-[#FFC928]" />
                    <span>{car.transmission}</span>
                  </div>
                </div>

                <div className="bg-[#F5F5F5] p-3.5 rounded-xl border border-neutral-200">
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold tracking-wider mb-1">
                    Fuel Type
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-[#111111]">
                    <Fuel className="w-4 h-4 text-[#FFC928]" />
                    <span>{car.fuelType}</span>
                  </div>
                </div>

                <div className="bg-[#F5F5F5] p-3.5 rounded-xl border border-neutral-200">
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold tracking-wider mb-1">
                    Seating Capacity
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-[#111111]">
                    <Users className="w-4 h-4 text-[#FFC928]" />
                    <span>{car.seats} Adult Seats</span>
                  </div>
                </div>

                <div className="bg-[#F5F5F5] p-3.5 rounded-xl border border-neutral-200">
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold tracking-wider mb-1">
                    Model Year
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-[#111111]">
                    <Calendar className="w-4 h-4 text-[#FFC928]" />
                    <span>{car.year} Release</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Overview Description */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#111111] mb-2.5 font-heading">
                Vehicle Overview
              </h2>
              <div className="bg-white p-5 rounded-xl border border-neutral-200 text-sm text-[#555555] leading-relaxed">
                {car.shortDescription}
              </div>
            </div>

            {/* Highlighted Amenities & Equipment */}
            {car.features && car.features.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#111111] mb-3 font-heading">
                  Included Amenities & Safety Features
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {car.features.map((feat, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 bg-neutral-50 p-3 rounded-lg border border-neutral-200 text-neutral-800"
                    >
                      <Check className="w-4 h-4 text-[#FFC928] shrink-0" />
                      <span className="font-semibold">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rental Terms & Conditions Card */}
            <div className="bg-neutral-50 rounded-2xl p-5 sm:p-6 border border-neutral-200 text-xs space-y-3.5">
              <div className="flex items-center gap-2 font-black text-sm text-neutral-900">
                <ShieldCheck className="w-5 h-5 text-[#FFC928]" />
                <span>Rental Terms & Handover Specifications</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                    Driver Licence Requirement:
                  </span>
                  <p className="font-bold text-neutral-800 mt-0.5">{car.rentalTerms}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                    Daily Mileage Allowance:
                  </span>
                  <p className="font-bold text-neutral-800 mt-0.5">{car.mileageLimit}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                    Refundable Bond:
                  </span>
                  <p className="font-bold text-neutral-800 mt-0.5">
                    {formatCurrency(car.securityDeposit)} Security Deposit
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                    Key Handover Location:
                  </span>
                  <p className="font-bold text-neutral-800 mt-0.5">
                    176 Milperra Rd, Revesby NSW (5-min turnaround)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Dedicated On-Page Rental Enquiry Form (5 cols) */}
          <div className="lg:col-span-5 sticky top-28" id="rental-enquiry-form">
            <div className="bg-white rounded-2xl border-2 border-[#111111] p-6 sm:p-7 shadow-xl">
              <div className="border-b border-neutral-100 pb-4 mb-5">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-600 mb-1">
                  <MessageSquare className="w-3.5 h-3.5 text-[#FFC928]" />
                  <span>Direct Vehicle Reservation</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#111111] font-heading">
                  Enquire for this {car.make}
                </h3>
                <p className="text-xs text-[#666666] mt-1">
                  Submit your dates below for instant availability verification at our Revesby depot.
                </p>
              </div>

              {isSubmittedSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-[#111111] font-heading">Enquiry Received!</h4>
                    <p className="text-xs text-[#666666] mt-1.5 leading-relaxed">
                      Thank you. Your rental request for the <strong className="text-black">{car.make} {car.model}</strong> has been sent directly to our dispatch team. We will contact you shortly via phone or WhatsApp.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSubmittedSuccess(false)}
                    className="mt-4 px-5 py-2.5 rounded-lg text-xs font-bold bg-[#FFC928] hover:bg-[#E5B21E] text-black transition-colors"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {/* Date Pickers */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                        Pick-up Date
                      </label>
                      <input
                        type="date"
                        required
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-semibold focus:border-[#FFC928] focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                        Return Date
                      </label>
                      <input
                        type="date"
                        required
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-semibold focus:border-[#FFC928] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Estimated Days & Total Calculation Box */}
                  <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                        Rental Duration
                      </span>
                      <span className="font-black text-sm text-[#111111]">
                        {days} {days === 1 ? 'Day' : 'Days'}
                      </span>
                    </div>

                    {settings.showPricing && estimatedTotal !== undefined && (
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                          Estimated Rate
                        </span>
                        <span className="font-black text-base text-[#111111] text-emerald-700">
                          {formatCurrency(estimatedTotal)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Customer Contact Details */}
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Liam Smith"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:border-[#FFC928] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+61 412 345 678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:border-[#FFC928] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="liam@example.com.au"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:border-[#FFC928] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                      Preferred Pick-up Time
                    </label>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:border-[#FFC928] focus:bg-white focus:outline-none"
                    >
                      <option>07:30 AM (Morning Early)</option>
                      <option>09:00 AM</option>
                      <option>10:00 AM</option>
                      <option>12:00 PM (Midday)</option>
                      <option>02:00 PM</option>
                      <option>05:00 PM (Late Afternoon)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                      Trip Details / Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Destination, luggage requirements, child car seat requests..."
                      value={customerMessage}
                      onChange={(e) => setCustomerMessage(e.target.value)}
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:border-[#FFC928] focus:bg-white focus:outline-none resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl font-black text-sm bg-[#FFC928] hover:bg-[#E5B21E] text-black shadow-md hover:shadow-lg transition-luxury flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>{isSubmitting ? 'Submitting Enquiry...' : 'Submit Rental Enquiry'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Direct Contact Buttons */}
                  <div className="pt-3 border-t border-neutral-200 space-y-2">
                    {whatsAppUrl && (
                      <a
                        href={whatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-3 rounded-lg font-bold text-xs bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center gap-2 transition-colors shadow-xs"
                      >
                        <span>Instant WhatsApp Booking</span>
                      </a>
                    )}

                    <a
                      href={`tel:${settings.phoneNumber}`}
                      className="w-full py-2.5 px-3 rounded-lg font-bold text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-800 flex items-center justify-center gap-2 transition-colors border border-neutral-200"
                    >
                      <Phone className="w-3.5 h-3.5 text-neutral-600" />
                      <span>Call Depot Directly ({settings.phoneNumber})</span>
                    </a>
                  </div>

                  <p className="text-[10px] text-neutral-500 text-center pt-1">
                    No upfront booking fee required. Quick 5-minute key handover at 176 Milperra Rd, Revesby NSW.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Similar Vehicles Section */}
        {similarVans.length > 0 && (
          <div className="mt-20 pt-12 border-t border-neutral-200">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-black bg-[#FFC928] px-3.5 py-1 rounded-full shadow-xs">
                  Explore More
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#111111] font-heading mt-2">
                  Other Passenger & Cargo Vans in Fleet
                </h3>
              </div>
              <button
                onClick={() => {
                  setCurrentView('cars');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-black cursor-pointer"
              >
                <span>View Full Fleet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarVans.map((v) => (
                <CarCard key={v.id} car={v} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
