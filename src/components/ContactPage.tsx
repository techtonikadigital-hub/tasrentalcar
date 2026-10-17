import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, Navigation, Copy, Check, ExternalLink } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, submitLead, showToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Enquiry');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyAddress = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(settings.physicalAddress);
      setCopiedAddress(true);
      showToast('Address copied to clipboard!', 'success');
      setTimeout(() => setCopiedAddress(false), 2500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      submitLead({
        customerName: name,
        phoneNumber: phone,
        email,
        pickupDate: new Date().toISOString().slice(0, 10),
        returnDate: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
        customerMessage: `[Subject: ${subject}] ${message}`,
        leadSource: 'Contact Page',
      });

      setIsSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      console.error(err);
      showToast('Failed to submit message. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsAppMessage = encodeURIComponent(
    `Hello ${settings.businessName || 'TAS Car Rental'}, I would like to enquire about renting a vehicle from your Revesby depot.`
  );
  const whatsAppUrl = settings.whatsAppNumber
    ? `https://wa.me/${settings.whatsAppNumber.replace(/[^0-9]/g, '')}?text=${whatsAppMessage}`
    : null;

  return (
    <div className="bg-white min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-wider text-black bg-[#FFC928] px-3.5 py-1 rounded-full shadow-sm">
            Depot & Customer Service
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111111] tracking-tight mt-3 font-heading">
            Contact TAS Car Rental
          </h1>
          <p className="text-sm text-[#666666] mt-2">
            Collect and return vehicles directly at our Revesby depot, or reach our direct dispatch and booking team below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          {/* Contact Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">

            {/* HIGHLIGHTED DEPOT ADDRESS CARD */}
            <div className="relative rounded-2xl p-6 sm:p-7 bg-[#111111] text-white border-2 border-[#FFC928] shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFC928]/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FFC928] text-black font-extrabold text-[11px] tracking-wider uppercase">
                  <MapPin className="w-3.5 h-3.5" />
                  Primary Depot Location
                </span>
                <span className="text-[11px] text-[#FFC928] font-bold">Open 7 Days</span>
              </div>

              <h3 className="text-xl font-black text-white font-heading mt-1">
                TAS Car Rental Depot
              </h3>

              <div className="mt-3 p-3.5 rounded-xl bg-neutral-900 border border-neutral-700/80">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FFC928] text-black flex items-center justify-center shrink-0 font-bold mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                      Vehicle Pickup & Handover Address
                    </span>
                    <p className="text-base font-black text-white leading-snug mt-0.5">
                      {settings.physicalAddress}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      Revesby NSW 2212 • Direct M5 Motorway access
                    </p>
                  </div>
                </div>

                {/* Quick actions for highlighted address */}
                <div className="mt-3.5 pt-3 border-t border-neutral-800 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="flex-1 py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedAddress ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Address Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#FFC928]" />
                        <span>Copy Address</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(settings.physicalAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-lg bg-[#FFC928] hover:bg-[#E5B21E] text-black text-xs font-black flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Get Directions</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* General Contact Info Card */}
            <div className="bg-[#F5F5F5] rounded-2xl p-6 sm:p-7 border border-neutral-200 space-y-5">
              <h3 className="text-base font-black text-[#111111] font-heading">
                Direct Communications
              </h3>

              {/* Telephone */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#111111] text-[#FFC928] flex items-center justify-center shrink-0 shadow-sm">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-500 uppercase block">Phone Contact</span>
                  <a
                    href={`tel:${settings.phoneNumber}`}
                    className="text-base font-extrabold text-[#111111] hover:text-[#997300] transition-colors mt-0.5 block"
                  >
                    {settings.phoneNumber}
                  </a>
                  <span className="text-[11px] text-neutral-500 block mt-0.5">Direct line for bookings & fleet availability</span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#111111] text-[#FFC928] flex items-center justify-center shrink-0 shadow-sm">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-500 uppercase block">Official Email</span>
                  <a
                    href={`mailto:${settings.emailAddress}`}
                    className="text-sm font-bold text-[#111111] hover:text-[#997300] transition-colors mt-0.5 block break-all"
                  >
                    {settings.emailAddress}
                  </a>
                  <span className="text-[11px] text-neutral-500 block mt-0.5">Enquiries and corporate reservations</span>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#111111] text-[#FFC928] flex items-center justify-center shrink-0 shadow-sm">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-500 uppercase block">Opening Hours</span>
                  <p className="text-sm font-bold text-[#111111] mt-0.5 leading-snug">
                    {settings.businessHours}
                  </p>
                </div>
              </div>

              {/* WhatsApp direct box */}
              {whatsAppUrl && (
                <div className="pt-2 flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="text-xs font-bold text-emerald-950">
                    Instant Chat on WhatsApp
                  </div>
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Chat on WhatsApp"
                    aria-label="Chat on WhatsApp"
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
          </div>

          {/* Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm">
            {isSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#111111] font-heading">
                  Message Sent Successfully
                </h3>
                <p className="text-xs text-[#666666] max-w-md mx-auto leading-relaxed">
                  Thank you for contacting {settings.businessName || 'LAS Car Rental'}. Your message has been logged directly with our dispatch team. We typically respond within 15–30 minutes during business hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#FFC928] text-[#111111] font-bold text-xs hover:bg-[#E5B21E] transition-luxury cursor-pointer"
                >
                  <span>Send Another Message</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-neutral-100 pb-3">
                  <h3 className="text-lg font-bold text-[#111111] font-heading">
                    Send Us an Inquiry
                  </h3>
                  <p className="text-xs text-[#666666]">
                    Fill out the form below and our staff will respond immediately.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Marcus Vance"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-lg bg-neutral-50 border border-neutral-300 text-sm font-medium text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+61 413 993 439"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-lg bg-neutral-50 border border-neutral-300 text-sm font-medium text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className="w-full h-11 px-3.5 rounded-lg bg-neutral-50 border border-neutral-300 text-sm font-medium text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      Inquiry Topic
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-sm font-medium text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
                    >
                      <option value="General Enquiry">General Rental Enquiry</option>
                      <option value="12-Seater Passenger Van">12-Seater Toyota HiAce Commuter</option>
                      <option value="7-Seater People Mover">7/8-Seater Kia Carnival</option>
                      <option value="Cargo & Moving Van">Cargo / Delivery Van</option>
                      <option value="Long Term / Group Hire">Club, School & Group Hire</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Your Message / Rental Dates *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about the vehicle you're interested in, requested dates, passenger numbers, or pickup preferences..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 rounded-lg bg-neutral-50 border border-neutral-300 text-sm font-medium text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-lg bg-[#FFC928] hover:bg-[#E5B21E] text-[#111111] font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-luxury cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message to TAS Car Rental'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Google Maps Embed Section */}
        <div className="bg-[#F5F5F5] rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="p-4 sm:p-6 bg-white border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Depot Coordinates & Map</span>
              <h3 className="text-lg font-bold text-[#111111] font-heading flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#FFC928]" />
                <span>Visit Our Revesby Depot</span>
              </h3>
            </div>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(settings.physicalAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#111111] text-[#FFC928] text-xs font-bold hover:bg-neutral-800 transition-colors shrink-0"
            >
              <span>Get Driving Directions</span>
            </a>
          </div>

          <div className="w-full h-80 sm:h-96 bg-neutral-200 relative">
            {settings.googleMapsEmbedUrl ? (
              <iframe
                title="TAS Car Rental Revesby Location Map"
                src={settings.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale-[15%] contrast-[1.05]"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-neutral-100">
                <MapPin className="w-10 h-10 text-[#FFC928] mb-2" />
                <p className="font-bold text-sm text-[#111111]">{settings.physicalAddress}</p>
                <p className="text-xs text-neutral-500 mt-1">Vehicle collection & return depot.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
