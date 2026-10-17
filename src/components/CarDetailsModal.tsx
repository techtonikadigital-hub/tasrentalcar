import React, { useState, useEffect } from 'react';
import { Car } from '../types';
import { useApp } from '../context/AppContext';
import { resolveCarImage, VAN_IMAGES } from '../assets/images';
import {
  X,
  Calendar,
  Users,
  Fuel,
  Gauge,
  ShieldCheck,
  Check,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Phone,
  Clock,
  Car as CarIcon,
} from 'lucide-react';

interface CarDetailsModalProps {
  car: Car | null;
  onClose: () => void;
}

export const CarDetailsModal: React.FC<CarDetailsModalProps> = ({ car, onClose }) => {
  const { settings, submitLead, formatCurrency } = useApp();

  // Active gallery photo
  const [activePhoto, setActivePhoto] = useState<string>('');

  // Form inputs
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
  const [customerMessage, setCustomerMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  useEffect(() => {
    if (car) {
      setActivePhoto(car.mainImage);
      setIsSubmittedSuccess(false);
    }
  }, [car]);

  if (!car) return null;

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
        pickupTime: '10:00 AM',
        customerMessage: customerMessage || `Interested in renting ${car.make} ${car.model} for ${days} days.`,
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
    `Hello ${settings.businessName || 'TAS Car Rental'}, I am interested in booking the ${car.year} ${car.make} ${car.model} from ${pickupDate} to ${returnDate}. Please advise on current availability and handover details.`
  );
  const whatsAppUrl = settings.whatsAppNumber
    ? `https://wa.me/${settings.whatsAppNumber.replace(/[^0-9]/g, '')}?text=${whatsAppMessage}`
    : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-neutral-300 relative my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-md flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="max-h-[90vh] overflow-y-auto">
          {/* Main Visual & Gallery */}
          <div className="bg-neutral-900 relative">
            <div className="aspect-[16/9] max-h-[380px] w-full bg-black overflow-hidden relative">
              <img
                src={resolveCarImage(activePhoto || car.mainImage)}
                alt={`${car.make} ${car.model}`}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = VAN_IMAGES.cargoVan;
                }}
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white pointer-events-none">
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-[#FFC928]">
                    {car.category} Collection
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black font-heading">
                    {car.make} {car.model}
                  </h2>
                </div>
                {car.status === 'Active' ? (
                  <span className="px-3 py-1 rounded bg-[#FFC928] text-black text-xs font-black">
                    AVAILABLE IN SHOWROOM
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded bg-neutral-800 text-neutral-300 text-xs font-bold">
                    RESERVED
                  </span>
                )}
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {car.gallery && car.gallery.length > 1 && (
              <div className="p-3 bg-neutral-950 flex items-center gap-2 overflow-x-auto border-t border-neutral-800">
                {car.gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhoto(imgUrl)}
                    className={`w-16 h-12 rounded overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activePhoto === imgUrl ? 'border-[#FFC928] scale-105' : 'border-neutral-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={resolveCarImage(imgUrl)}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = VAN_IMAGES.cargoVan;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 7 cols: Specifications, Description & Terms */}
            <div className="lg:col-span-7 space-y-6">
              {/* Specs Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-[#F5F5F5] p-3 rounded-lg border border-neutral-200">
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Transmission</span>
                  <span className="font-bold text-[#111111]">{car.transmission}</span>
                </div>
                <div className="bg-[#F5F5F5] p-3 rounded-lg border border-neutral-200">
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Engine & Fuel</span>
                  <span className="font-bold text-[#111111]">{car.fuelType}</span>
                </div>
                <div className="bg-[#F5F5F5] p-3 rounded-lg border border-neutral-200">
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Passengers</span>
                  <span className="font-bold text-[#111111]">{car.seats} Seats</span>
                </div>
                <div className="bg-[#F5F5F5] p-3 rounded-lg border border-neutral-200">
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Model Year</span>
                  <span className="font-bold text-[#111111]">{car.year}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111] mb-2 font-heading">
                  Vehicle Overview
                </h3>
                <p className="text-sm text-[#666666] leading-relaxed">
                  {car.shortDescription}
                </p>
              </div>

              {/* Vehicle Key Features */}
              {car.features && car.features.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111] mb-2.5 font-heading">
                    Highlighted Amenities
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {car.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-neutral-800">
                        <Check className="w-3.5 h-3.5 text-[#FFC928] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rental Terms & Conditions Card */}
              <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-neutral-900">
                  <ShieldCheck className="w-4 h-4 text-[#FFC928]" />
                  <span>Rental Terms & Handover Specifications</span>
                </div>
                <p className="text-neutral-600 leading-relaxed">
                  {car.rentalTerms ||
                    'Standard Australian Class C driver licence required. Minimum age 21. Refundable security bond held at pickup.'}
                </p>
                <div className="pt-2 border-t border-neutral-200/80 flex flex-wrap gap-4 text-neutral-700 font-medium">
                  <span>Mileage: {car.mileageLimit || '250 km / day included'}</span>
                  <span>Bond Deposit: {formatCurrency(car.securityDeposit || 500)}</span>
                </div>
                {/* Highlighted Depot Badge */}
                <div className="pt-2 border-t border-neutral-200/80 text-[11px] font-bold text-neutral-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FFC928]" />
                  <span>Depot Collection & Return: </span>
                  <span className="text-neutral-800 underline">{settings.physicalAddress}</span>
                </div>
              </div>

              {/* WhatsApp direct CTA */}
              {whatsAppUrl && (
                <div className="pt-2 flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-xs font-semibold text-emerald-950">
                    Direct Concierge Chat for this {car.make}
                  </span>
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Instant WhatsApp Enquiry for ${car.make} ${car.model}`}
                    aria-label="Instant WhatsApp Enquiry"
                    className="w-10 h-10 shrink-0 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                  >
                    <svg
                      className="w-5 h-5 fill-current"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.711 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </a>
                </div>
              )}
            </div>

            {/* Right 5 cols: Rental Enquiry Form */}
            <div className="lg:col-span-5 bg-[#F5F5F5] rounded-xl p-5 sm:p-6 border border-neutral-200 flex flex-col justify-between">
              {isSubmittedSuccess ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-[#111111] font-heading">
                    Enquiry Received!
                  </h3>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    Thank you. Your rental request for the <strong className="text-black">{car.make} {car.model}</strong> has been logged in our system. A concierge agent will phone or message you shortly to confirm handover details.
                  </p>
                  <button
                    onClick={() => setIsSubmittedSuccess(false)}
                    className="text-xs font-bold text-[#111111] underline hover:text-[#997300] cursor-pointer"
                  >
                    Submit another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="border-b border-neutral-200 pb-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-bold uppercase text-neutral-600">Rental Enquiry</span>
                      {settings.showPricing && (
                        <div className="text-right">
                          <div className="flex items-baseline justify-end gap-1">
                            <span className="text-lg font-black text-[#111111]">
                              {formatCurrency(car.pricePerDay)}
                            </span>
                            <span className="text-[10px] text-neutral-500"> / day</span>
                          </div>
                          {car.pricePerWeek && (
                            <div className="text-[11px] font-bold text-amber-800">
                              {formatCurrency(car.pricePerWeek)}
                              <span className="text-[10px] text-neutral-500 font-normal"> / week</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {settings.showPricing && (
                      <div className="text-[11px] text-neutral-600 flex justify-between mt-1">
                        <span>Duration: {days} day{days > 1 ? 's' : ''}</span>
                        <span className="font-bold text-black">Est. Total: {formatCurrency(estimatedTotal)}</span>
                      </div>
                    )}
                  </div>

                  {/* Customer Name */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Johnathan Vance"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+61 413 993 439"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. yourname@example.com.au"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Pickup Date
                      </label>
                      <input
                        type="date"
                        required
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full h-10 px-2 rounded-lg bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Return Date
                      </label>
                      <input
                        type="date"
                        required
                        min={pickupDate}
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full h-10 px-2 rounded-lg bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      Notes or Special Requirements
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Airport delivery, extra driver, flight arrival time..."
                      value={customerMessage}
                      onChange={(e) => setCustomerMessage(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-lg bg-[#FFC928] hover:bg-[#E5B21E] text-[#111111] font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-luxury cursor-pointer disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Rental Enquiry'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[10px] text-center text-neutral-500">
                    No payment required now. Our concierge will review vehicle schedule and confirm availability.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
