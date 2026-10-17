import React from 'react';
import { Car } from '../types';
import { useApp } from '../context/AppContext';
import { Users, Fuel, Gauge, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { resolveCarImage, VAN_IMAGES } from '../assets/images';

interface CarCardProps {
  car: Car;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const { settings, formatCurrency, openBookingForCar } = useApp();

  const isAvailable = car.status === 'Active';

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group h-full w-full">
      {/* Image container with fixed aspect ratio - Clickable to open vehicle enquiry */}
      <div
        onClick={() => openBookingForCar(car)}
        className="relative aspect-[16/10] bg-neutral-100 overflow-hidden shrink-0 cursor-pointer"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openBookingForCar(car);
          }
        }}
        aria-label={`Enquire now for ${car.make} ${car.model}`}
      >
        <img
          src={resolveCarImage(car.mainImage)}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = VAN_IMAGES.cargoVan;
          }}
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          {isAvailable ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#111111]/90 text-[#FFC928] backdrop-blur-sm shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC928] animate-pulse"></span>
              Available
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-neutral-900/90 text-neutral-300 backdrop-blur-sm">
              <AlertCircle className="w-3 h-3 text-red-400" />
              Unavailable
            </span>
          )}
        </div>

        {/* Category Pill */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white/95 text-neutral-800 shadow-sm backdrop-blur-sm">
            {car.category}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Make, Model, Year */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0 flex-1">
              <span className="text-xs font-semibold text-[#666666] tracking-wider uppercase block truncate">
                {car.make}
              </span>
              <h3
                className="text-lg font-bold text-[#111111] group-hover:text-black transition-colors font-heading  leading-tight"
                title={`${car.make} ${car.model}`}
              >
                {car.model}
              </h3>
            </div>
            <span className="text-xs font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded shrink-0">
              {car.year}
            </span>
          </div>

          {/* <p className="text-xs text-[#666666] line-clamp-2 h-9 mb-4 leading-relaxed overflow-hidden">
            {car.shortDescription}
          </p> */}

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-neutral-100 text-xs text-neutral-600 mb-4 shrink-0 h-11 items-center">
            <div className="flex items-center gap-1.5 min-w-0">
              <Gauge className="w-3.5 h-3.5 text-[#FFC928] shrink-0" />
              <span className="truncate">{car.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <Fuel className="w-3.5 h-3.5 text-[#FFC928] shrink-0" />
              <span className="truncate">{car.fuelType}</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <Users className="w-3.5 h-3.5 text-[#FFC928] shrink-0" />
              <span className="truncate">{car.seats} Seats</span>
            </div>
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="pt-2 flex items-center justify-between gap-3 mt-auto shrink-0 min-h-[44px]">
          {/* Daily Price & Weekly Rate (only if showPricing is enabled) */}
          <div className="min-w-0 flex-1">
            {settings.showPricing ? (
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#777777] block leading-tight">Hire Rate</span>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-xl font-black text-[#111111] font-heading leading-tight truncate">
                    {formatCurrency(car.pricePerDay)}
                  </span>
                  <span className="text-xs text-[#666666] font-medium">/day</span>
                  {/* {car.pricePerWeek && (
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100/70 px-1.5 py-0.5 rounded border border-amber-200 whitespace-nowrap">
                      {formatCurrency(car.pricePerWeek)}/wk
                    </span>
                  )} */}
                </div>
              </div>
            ) : (
              <div>
                <span className="text-[11px] text-[#666666] block leading-tight">Rental Terms</span>
                <span className="text-sm font-bold text-[#111111] truncate block">Enquire for Quote</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={() => openBookingForCar(car)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold bg-[#FFC928] hover:bg-[#E5B21E] text-black transition-luxury cursor-pointer shadow-sm shrink-0 whitespace-nowrap"
          >
            <span>{isAvailable ? 'Enquire Now' : 'Details'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
