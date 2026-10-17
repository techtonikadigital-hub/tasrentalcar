import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Sparkles,
  Car as CarIcon,
  X,
  Calendar,
  Send,
  CheckCircle2,
  Phone,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const FloatingActions: React.FC = () => {
  const { settings, publicCars, submitLead, showToast, setCurrentView } = useApp();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Quick Quote Form State
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [message, setMessage] = useState('');

  // Clean WhatsApp number
  const rawWhatsApp = settings.whatsAppNumber || settings.phoneNumber || '+61413993439';
  const cleanPhone = rawWhatsApp.replace(/[^0-9]/g, '');
  const whatsAppText = encodeURIComponent(
    settings.whatsAppGreeting ||
      'Hello TAS Car Rental, I would like to enquire about renting a vehicle from your Revesby depot.'
  );
  const whatsAppLink = `https://wa.me/${cleanPhone}?text=${whatsAppText}`;

  // Handle Quick Quote Submission
  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phoneNumber || !email) {
      showToast('Please fill in your name, phone number, and email.', 'error');
      return;
    }

    setIsSubmitting(true);

    const vehicleObj = publicCars.find((c) => c.id === selectedVehicleId);
    const requestedCarName = vehicleObj
      ? `${vehicleObj.year} ${vehicleObj.make} ${vehicleObj.model}`
      : 'General Fleet / Unspecified Vehicle';

    // Submit Lead
    submitLead({
      customerName: customerName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email.trim(),
      requestedCarId: vehicleObj ? vehicleObj.id : undefined,
      requestedCarName,
      requestedCarImage: vehicleObj ? vehicleObj.mainImage : undefined,
      pickupDate: pickupDate || new Date().toISOString().split('T')[0],
      returnDate: returnDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      customerMessage: message.trim() || 'Instant quote enquiry via floating CTA button',
      leadSource: 'Floating CTA',
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      showToast('Rental quote request submitted! Our concierge will contact you promptly.', 'success');

      setTimeout(() => {
        setIsQuoteModalOpen(false);
        setSubmittedSuccess(false);
        // Reset form
        setCustomerName('');
        setPhoneNumber('');
        setEmail('');
        setSelectedVehicleId('');
        setPickupDate('');
        setReturnDate('');
        setMessage('');
      }, 2000);
    }, 400);
  };

  return (
    <>
      {/* ========================================================= */}
      {/* LEFT SIDE BOTTOM CORNER: WHATSAPP FLOATING BUTTON (ICON ONLY) */}
      {/* ========================================================= */}
      <div className="fixed bottom-5 left-4 sm:bottom-6 sm:left-6 z-40 group">
        <a
          href={whatsAppLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          title="WhatsApp Concierge"
          className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-2xl hover:shadow-[0_8px_28px_rgba(37,211,102,0.5)] transition-all duration-300 transform hover:-translate-y-1 active:scale-95 border border-white/25 cursor-pointer"
        >
          {/* Pulsing online status indicator */}
          <span className="absolute top-0.5 right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-100 border-2 border-[#25D366]"></span>
          </span>
          {/* WhatsApp Logo Icon Only - NO TEXT */}
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.711 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </div>

      {/* ========================================================= */}
      {/* RIGHT SIDE BOTTOM CORNER: CALL TO ACTION FLOATING BUTTON */}
      {/* ========================================================= */}
      <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsQuoteModalOpen(true)}
          aria-label="Book a Car or Get an Instant Rental Quote"
          className="flex items-center gap-2.5 bg-[#FFC928] hover:bg-[#E5B21E] text-[#111111] px-5 py-3 rounded-full font-bold text-xs sm:text-sm shadow-xl hover:shadow-[0_8px_25px_-4px_rgba(255,201,40,0.6)] transition-all duration-300 transform hover:-translate-y-1 active:scale-95 border border-black/10 cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full bg-[#111111] text-[#FFC928] flex items-center justify-center">
            <CarIcon className="w-3.5 h-3.5" />
          </div>
          <span className="tracking-tight">Book a Car</span>
          <ArrowRight className="w-4 h-4 ml-0.5" />
        </button>
      </div>

      {/* ========================================================= */}
      {/* QUICK QUOTE & BOOKING ENQUIRY MODAL */}
      {/* ========================================================= */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-200 relative my-8">
            {/* Modal Header */}
            <div className="bg-[#111111] text-white p-6 relative">
              <button
                onClick={() => setIsQuoteModalOpen(false)}
                className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-lg bg-neutral-800 transition-colors"
                aria-label="Close quote modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#FFC928] text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant Vehicle Quote</span>
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight font-heading">
                Reserve Your Vehicle
              </h3>
              <p className="text-xs text-neutral-300 mt-1">
                Select your preferred passenger van or car and rental dates. Our Revesby depot team will confirm availability promptly.
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {submittedSuccess ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-black text-[#111111] font-heading">
                    Quote Request Received!
                  </h4>
                  <p className="text-xs text-[#666666] max-w-sm mx-auto">
                    Thank you, <span className="font-bold text-[#111111]">{customerName}</span>. Your enquiry has been routed directly to our vehicle specialists. We will reach out shortly via phone or WhatsApp.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitQuote} className="space-y-4">
                  {/* Vehicle Selector */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      Choose Vehicle from Fleet (Optional)
                    </label>
                    <select
                      value={selectedVehicleId}
                      onChange={(e) => setSelectedVehicleId(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-neutral-50 border border-neutral-300 text-xs font-semibold text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
                    >
                      <option value="">Any Available Luxury Vehicle / General Advice</option>
                      {publicCars.map((car) => (
                        <option key={car.id} value={car.id}>
                          {car.year} {car.make} {car.model} ({car.category}) — {settings.currency}{car.pricePerDay}/day{car.pricePerWeek ? ` • ${settings.currency}${car.pricePerWeek}/wk` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dates Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Pickup Date
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="date"
                          value={pickupDate}
                          onChange={(e) => setPickupDate(e.target.value)}
                          className="w-full h-10 pl-9 pr-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Return Date
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="date"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          className="w-full h-10 pl-9 pr-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alexander Vance"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Phone / WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+61 413 993 439"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. yourname@example.com.au"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      Notes / Requirements (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Number of passengers, luggage requirements, child seats, etc."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black resize-none"
                    />
                  </div>

                  {/* Trust Badge with Highlighted Address */}
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-950">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="font-semibold">Depot: 176 Milperra Rd, Revesby NSW 2212 • Standard car licence accepted</span>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:flex-1 h-11 rounded-xl bg-[#FFC928] hover:bg-[#E5B21E] text-black font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-luxury cursor-pointer shadow-md disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Transmitting Request...' : 'Submit Instant Quote Request'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsQuoteModalOpen(false);
                        setCurrentView('cars');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full sm:w-auto h-11 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Browse Full Fleet</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
