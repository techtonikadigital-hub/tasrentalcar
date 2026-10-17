import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Car as CarIcon,
  ArrowRight,
} from 'lucide-react';

export const FloatingActions: React.FC = () => {
  const { settings, currentView, setCurrentView } = useApp();

  // Clean WhatsApp number
  const rawWhatsApp = settings.whatsAppNumber || settings.phoneNumber || '+61413993439';
  const cleanPhone = rawWhatsApp.replace(/[^0-9]/g, '');
  const whatsAppText = encodeURIComponent(
    settings.whatsAppGreeting ||
      'Hello TAS Car Rental, I would like to enquire about renting a vehicle from your Revesby depot.'
  );
  const whatsAppLink = `https://wa.me/${cleanPhone}?text=${whatsAppText}`;

  const handleBookClick = () => {
    if (currentView === 'vehicle-details') {
      const enquiryForm = document.getElementById('rental-enquiry-form');
      if (enquiryForm) {
        enquiryForm.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    setCurrentView('cars');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          onClick={handleBookClick}
          aria-label="Book a Car or View Passenger Van Fleet"
          className="flex items-center gap-2.5 bg-[#FFC928] hover:bg-[#E5B21E] text-[#111111] px-5 py-3 rounded-full font-bold text-xs sm:text-sm shadow-xl hover:shadow-[0_8px_25px_-4px_rgba(255,201,40,0.6)] transition-all duration-300 transform hover:-translate-y-1 active:scale-95 border border-black/10 cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full bg-[#111111] text-[#FFC928] flex items-center justify-center">
            <CarIcon className="w-3.5 h-3.5" />
          </div>
          <span className="tracking-tight">Book a Car</span>
          <ArrowRight className="w-4 h-4 ml-0.5" />
        </button>
      </div>
    </>
  );
};

