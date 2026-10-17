import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  ChevronDown,
  HelpCircle,
  ShieldCheck,
  CreditCard,
  KeyRound,
  Fuel,
  Search,
  MessageCircle,
  PhoneCall,
  ArrowRight,
} from 'lucide-react';

export interface FaqItem {
  id: string;
  category: 'General' | 'Booking' | 'Security & Deposit' | 'Driving & Fuel' | 'Insurance';
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'General',
    question: 'Can I drive a 12-seater passenger van on a normal Australian car licence?',
    answer:
      'Yes, absolutely! In Australia (across all states including VIC, NSW, QLD, WA, SA, TAS, ACT, and NT), any driver holding an unrestricted Class C car licence can legally drive a vehicle that seats up to 12 people (including the driver). You do not need a special bus licence or light rigid licence.',
  },
  {
    id: 'faq-2',
    category: 'General',
    question: 'How easy is it to drive a 7-seater Kia Carnival?',
    answer:
      'Very easy! The Kia Carnival drives and parks just like a normal family car or SUV. It comes with reversing cameras, parking sensors, blind-spot monitoring, and automatic transmission. It fits comfortably in normal shopping centre and hotel car parks.',
  },
  {
    id: 'faq-3',
    category: 'Security & Deposit',
    question: 'How does the bond (security deposit) work, and when do I get it back?',
    answer:
      'We place a simple refundable security bond hold on your card upon pickup ($400 for 7-seaters, $500 for 12-seaters). When you return the van without damage and with a full tank of fuel, the bond is released straight back to your card on the same day.',
  },
  {
    id: 'faq-4',
    category: 'Booking',
    question: 'Can international tourists and overseas visitors hire your vans?',
    answer:
      'Yes! We welcome travellers from around the world. All you need is your valid home-country driver licence (with an English translation or International Driving Permit if not in English) and your passport.',
  },
  {
    id: 'faq-5',
    category: 'Driving & Fuel',
    question: 'How much luggage fits in the 7-seater and 12-seater vans?',
    answer:
      'Our 12-seater Toyota HiAce has a generous rear luggage boot that comfortably fits 8 to 10 large suitcases plus soft travel bags. Our Kia Carnival 7-seater has plenty of boot space for family luggage, and the rear seats fold flat into the floor if you need extra room for eskies, prams, or camping gear.',
  },
  {
    id: 'faq-6',
    category: 'Driving & Fuel',
    question: 'What is the fuel policy?',
    answer:
      'It’s a simple full-to-full policy. We hand the van over to you with a full tank of fuel, and you simply fill it up before returning it. The Toyota HiAce runs on standard Diesel, and the Kia Carnival runs on standard Unleaded petrol.',
  },
  {
    id: 'faq-7',
    category: 'Booking',
    question: 'Can we add an extra driver to the hire agreement?',
    answer:
      'Yes! We know road trips can be long, so you can add an extra driver for free as long as they show a valid driver licence when collecting the van.',
  },
  {
    id: 'faq-8',
    category: 'Booking',
    question: 'What happens if we need to change or cancel our dates?',
    answer:
      'We keep things fair and flexible. If your plans change, just give us at least 48 hours notice before your hire start date for a full refund or a free date change.',
  },
];

export const FaqSection: React.FC<{ isStandalonePage?: boolean }> = ({ isStandalonePage = false }) => {
  const { setCurrentView, settings } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-2']);

  const categories = ['All', 'General', 'Booking', 'Security & Deposit', 'Driving & Fuel', 'Insurance'];

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const whatsAppPhoneClean = settings.whatsAppNumber
    ? settings.whatsAppNumber.replace(/[^0-9]/g, '')
    : '13105550199';

  return (
    <section className={`py-16 sm:py-24 ${isStandalonePage ? 'bg-white' : 'bg-[#FAFAFA] border-b border-neutral-200'}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight font-heading">
            Everything You Need to Know
          </h2>
          <p className="text-sm text-[#666666] mt-2">
            Clear, simple answers on licence rules, luggage space, security bonds, and fuel.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8 relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g., deposit, age limit, mileage, insurance)..."
            className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-neutral-300 text-sm text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#FFC928] focus:border-[#FFC928] shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400 hover:text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#111111] text-white shadow-sm'
                    : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100 hover:text-black'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden transition-all duration-200 hover:border-neutral-300"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:bg-neutral-50"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 shrink-0">
                        {faq.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-[#111111]">
                        {faq.question}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-neutral-500 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-[#111111]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-[#555555] leading-relaxed border-t border-neutral-100 bg-neutral-50/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-neutral-200">
              <HelpCircle className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-neutral-700">No matching questions found</p>
              <p className="text-xs text-neutral-500 mt-1">
                Try searching with different keywords or browse all categories.
              </p>
            </div>
          )}
        </div>

        {/* Quick Assistance Help Card */}
        <div className="mt-12 bg-gradient-to-r from-neutral-900 to-neutral-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-neutral-800">
          <div className="text-center sm:text-left">
            <h4 className="text-lg font-bold text-white">Have a specific question or custom enquiry?</h4>
            <p className="text-xs text-neutral-400 mt-1">
              Our private concierge desk is online 24/7 to provide instant quotes, verify availability, and answer any questions.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={`https://wa.me/${whatsAppPhoneClean}?text=${encodeURIComponent(
                settings.whatsAppGreeting || 'Hello, I have a question regarding vehicle rental with LAS Car Rental.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp Concierge"
              aria-label="WhatsApp Concierge"
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-sm transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.711 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
            <button
              onClick={() => {
                setCurrentView('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors cursor-pointer"
            >
              <span>Contact Showroom</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
