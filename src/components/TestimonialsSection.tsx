import React from 'react';
import { useApp } from '../context/AppContext';
import { Star, ShieldCheck, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { testimonials, settings } = useApp();

  return (
    <section className="py-16 sm:py-24 bg-[#FFFFFF] border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#997300] bg-[#FFC928]/20 px-3 py-1 rounded-full">
            Real Customer Reviews
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight mt-3 font-heading">
            What Tas Drivers Say About Our Vans
          </h2>
          <p className="text-sm text-[#666666] mt-2">
            Real feedback from local families, sporting clubs, wedding parties, and road trippers across Australia.
          </p>
        </div>

        {/* Testimonials Grid (4 cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm flex flex-col justify-between hover:border-[#FFC928] hover:shadow-md transition-all duration-300"
            >
              <div>
                {/* 5 Stars Rating & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#FFC928] text-[#FFC928]" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-neutral-300 shrink-0" />
                </div>

                {/* Content */}
                <p className="text-xs text-neutral-700 leading-relaxed italic mb-6">
                  "{t.content}"
                </p>
              </div>

              {/* Author & Vehicle */}
              <div className="pt-4 border-t border-neutral-100">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-[#111111]">{t.name}</div>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                </div>

                <div className="text-[11px] text-neutral-500">{t.role}, {t.company}</div>

                {/* <div className="mt-2.5 inline-block text-[10px] font-semibold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                  Vehicle: {t.vehicleRented}
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
