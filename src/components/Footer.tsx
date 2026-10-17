import React from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setCurrentView, setOpenPolicyModal } = useApp();

  return (
    <footer className="bg-[#111111] text-white pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FFC928] flex items-center justify-center text-black font-black text-xl">
                {settings.logoText ? settings.logoText.charAt(0) : 'T'}
              </div>
              <div>
                <span className="block text-xl font-black tracking-tight text-white font-heading">
                  {settings.logoText || 'TAS'}
                </span>
                <span className="block text-[10px] tracking-widest font-bold uppercase text-neutral-400">
                  {settings.logoSubtitle || 'CAR RENTAL'}
                </span>
              </div>
            </div>

            <p className="text-sm text-neutral-400 leading-relaxed">
              {settings.footerDescription ||
                'Friendly, reliable 7 and 12 seater passenger van and car hire in Sydney. Quality Toyota HiAce and Kia Carnival people movers with no hidden fees and quick pickup at our Revesby depot.'}
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 pt-2">
              {settings.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-[#FFC928] hover:border-[#FFC928] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-[#FFC928] hover:border-[#FFC928] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks?.linkedin && (
                <a
                  href={settings.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-[#FFC928] hover:border-[#FFC928] transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks?.twitter && (
                <a
                  href={settings.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-[#FFC928] hover:border-[#FFC928] transition-colors"
                  aria-label="Twitter / X"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#FFC928]">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm text-neutral-300">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#FFC928] transition-colors cursor-pointer"
                >
                  Home Showroom
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('cars');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#FFC928] transition-colors cursor-pointer"
                >
                  Browse Available Fleet
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#FFC928] transition-colors cursor-pointer"
                >
                  About Our Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('service-area');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#FFC928] transition-colors cursor-pointer"
                >
                  Service Area Coverage
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('blog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#FFC928] transition-colors cursor-pointer"
                >
                  Automotive Journal & Routes
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('faq');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#FFC928] transition-colors cursor-pointer"
                >
                  FAQ & Rental Policies
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#FFC928] transition-colors cursor-pointer"
                >
                  Location & Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Highlighted Physical Location & Hours */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#FFC928]">
              Primary Depot Location
            </h4>
            <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3 text-sm text-neutral-200">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FFC928] shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-white block">
                    {settings.physicalAddress}
                  </span>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(settings.physicalAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#FFC928] hover:underline font-bold inline-block mt-1"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2.5 pt-2 border-t border-neutral-800/80">
                <Clock className="w-4 h-4 text-[#FFC928] shrink-0 mt-0.5" />
                <span className="text-neutral-400 text-xs">{settings.businessHours}</span>
              </div>
            </div>
            <p className="text-xs text-neutral-400 italic">
              * Vehicle handover & return at 176 Milperra Rd, Revesby NSW.
            </p>
          </div>

          {/* Column 4: Contact & Concierge */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#FFC928]">Contact Desk</h4>
            <div className="space-y-3 text-sm text-neutral-300">
              <a
                href={`tel:${settings.phoneNumber}`}
                className="flex items-center gap-2.5 hover:text-[#FFC928] transition-colors font-bold text-white text-base"
              >
                <Phone className="w-4 h-4 text-[#FFC928]" />
                <span>{settings.phoneNumber}</span>
              </a>
              <a
                href={`mailto:${settings.emailAddress}`}
                className="flex items-center gap-2.5 hover:text-[#FFC928] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#FFC928]" />
                <span className="truncate">{settings.emailAddress}</span>
              </a>
              {settings.whatsAppNumber && (
                <div className="pt-1">
                  <a
                    href={`https://wa.me/${settings.whatsAppNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      settings.whatsAppGreeting || 'Hello TAS Car Rental, I would like to enquire about renting a vehicle.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="WhatsApp TAS Car Rental"
                    aria-label="WhatsApp TAS Car Rental"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white transition-colors shadow-sm cursor-pointer"
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
          </div>
        </div>

        {/* Bottom copyright & legal */}
        <div className="pt-8 mt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div>
            © {new Date().getFullYear()} {settings.businessName || 'TAS Car Rental'}. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setOpenPolicyModal('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setOpenPolicyModal('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => {
                setCurrentView('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#FFC928] text-neutral-400 transition-colors cursor-pointer"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
