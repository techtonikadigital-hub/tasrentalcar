import React from 'react';
import { ShieldCheck, Banknote, Zap, Headphones, CheckCircle2 } from 'lucide-react';

export const WhyChooseUsSection: React.FC = () => {
  const benefits = [
    {
      icon: ShieldCheck,
      title: 'Drive on a Normal Car Licence',
      description: 'No special bus licence required. You can drive our 12-seater Toyota HiAce and 7-seater Kia Carnival on any standard Class C car licence.',
    },
    {
      icon: Banknote,
      title: 'Fair & Honest Aussie Pricing',
      description: 'Zero hidden fees, transparent bonds, and clear daily rates. What you see is what you pay—no surprise add-ons.',
    },
    {
      icon: Zap,
      title: 'Quick 5-Minute Pickup',
      description: 'Fast paperwork and key handover at our depot. Jump in and get your family or crew on the road without waiting in long queues.',
    },
    {
      icon: Headphones,
      title: 'Friendly Local Support',
      description: 'Need help with booster seats, luggage questions, or road trip advice? Give our friendly Aussie team a call or WhatsApp message anytime.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#997300] bg-[#FFC928]/20 px-3 py-1 rounded-full">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight mt-3 font-heading">
            Why Aussies Choose Our Vans
          </h2>
          <p className="text-sm text-[#666666] mt-2">
            Reliable, clean, and spacious passenger vans for family holidays, road trips, footy clubs, and work crews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-neutral-200 p-6 hover:border-[#FFC928] hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-[#111111] flex items-center justify-center text-[#FFC928] mb-5 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#111111] mb-2 font-heading">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#666666] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-1.5 text-[11px] font-semibold text-neutral-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FFC928]" />
                  <span>Guaranteed Quality</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
