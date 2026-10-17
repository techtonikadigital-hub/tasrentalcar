import React from 'react';
import { useApp } from '../context/AppContext';
import { CarCard } from './CarCard';
import { ArrowRight, Sparkles } from 'lucide-react';

export const FeaturedCarsSection: React.FC = () => {
  const { featuredCars, setCurrentView } = useApp();

  if (featuredCars.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-[#FFFFFF] border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
              Our Van Fleet
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight font-heading">
              Featured 7 & 12 Seater Vans
            </h2>
            <p className="text-sm text-[#666666] mt-1 max-w-xl">
              Browse our Toyota HiAce 12-seater commuter buses and Kia Carnival 7-seater people movers. Ideal for group trips, family road trips, and airport runs.
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentView('cars');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#111111] hover:text-[#997300] transition-colors cursor-pointer group shrink-0"
          >
            <span>Browse All Vans</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Cars Grid (4 cars on home page) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {featuredCars.map((car) => (
            <div key={car.id} className="h-full flex flex-col">
              <CarCard car={car} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
