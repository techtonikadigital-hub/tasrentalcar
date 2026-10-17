import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CarCard } from './CarCard';
import {
  Search,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  MapPin,
  ShieldCheck,
  ArrowUpDown,
  Sparkles,
  X,
  Check,
} from 'lucide-react';
import { VAN_IMAGES } from '../assets/images';

export const CarsListingPage: React.FC = () => {
  const { publicCars, settings } = useApp();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTransmission, setSelectedTransmission] = useState<string>('All');
  const [selectedFuelType, setSelectedFuelType] = useState<string>('All');
  const [selectedSeats, setSelectedSeats] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [availabilityOnly, setAvailabilityOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'year-desc'>('recommended');
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  // Highest price in fleet
  const highestPriceInFleet = useMemo(() => {
    if (publicCars.length === 0) return 1000;
    return Math.max(...publicCars.map((c) => c.pricePerDay), 800);
  }, [publicCars]);

  const categories = ['All', 'Van', 'People Mover', 'Minibus'];

  // Filtered & Sorted cars
  const filteredAndSortedCars = useMemo(() => {
    let result = publicCars.filter((car) => {
      // Search query (make, model, features)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = `${car.make} ${car.model}`.toLowerCase().includes(q);
        const matchesCategory = car.category.toLowerCase().includes(q);
        const matchesFeature = car.features?.some((f) => f.toLowerCase().includes(q));
        if (!matchesName && !matchesCategory && !matchesFeature) return false;
      }

      // Category
      if (selectedCategory !== 'All' && car.category !== selectedCategory) {
        return false;
      }

      // Transmission
      if (selectedTransmission !== 'All' && car.transmission !== selectedTransmission) {
        return false;
      }

      // Fuel Type
      if (selectedFuelType !== 'All' && car.fuelType !== selectedFuelType) {
        return false;
      }

      // Seats
      if (selectedSeats !== 'All') {
        if (selectedSeats === '12') {
          if (car.seats !== 12) return false;
        } else if (selectedSeats === '7-8') {
          if (car.seats < 7 || car.seats > 8) return false;
        } else if (selectedSeats === '2-3') {
          if (car.seats > 3) return false;
        } else {
          const seatNum = parseInt(selectedSeats, 10);
          if (car.seats !== seatNum) return false;
        }
      }

      // Price filter (if pricing enabled)
      if (settings.showPricing && car.pricePerDay > maxPrice) {
        return false;
      }

      // Availability filter
      if (availabilityOnly && car.status !== 'Active') {
        return false;
      }

      return true;
    });

    // Sorting
    return result.sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePerDay - b.pricePerDay;
      if (sortBy === 'price-desc') return b.pricePerDay - a.pricePerDay;
      if (sortBy === 'year-desc') return b.year - a.year;
      return a.displayOrder - b.displayOrder;
    });
  }, [
    publicCars,
    searchQuery,
    selectedCategory,
    selectedTransmission,
    selectedFuelType,
    selectedSeats,
    maxPrice,
    availabilityOnly,
    sortBy,
    settings.showPricing,
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedTransmission('All');
    setSelectedFuelType('All');
    setSelectedSeats('All');
    setMaxPrice(highestPriceInFleet);
    setAvailabilityOnly(false);
    setSortBy('recommended');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'All' ||
    selectedTransmission !== 'All' ||
    selectedFuelType !== 'All' ||
    selectedSeats !== 'All' ||
    availabilityOnly ||
    (settings.showPricing && maxPrice < highestPriceInFleet);

  // Background image for "Our Passenger Van Fleet" header section
  const fleetBannerImg =
    settings.fleetBannerImageUrl ||
    VAN_IMAGES.hiace12;

  return (
    <div className="bg-white min-h-screen">
      {/* 1. 'Our Fleet' Hero Section with Passenger Van Background Image */}
      <section className="relative bg-neutral-950 text-white overflow-hidden py-16 sm:py-24 border-b border-neutral-800">
        <div className="absolute inset-0 z-0">
          <img
            src={fleetBannerImg}
            alt="TAS Car Rental Van Fleet Background"
            className="w-full h-full object-cover object-center opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/40" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-700 text-xs font-bold text-[#FFC928] mb-4 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#FFC928] animate-pulse"></span>
              <span className="uppercase tracking-widest">Passenger & Commercial Van Hire</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-heading leading-tight">
              Passenger Vans & People Movers
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 mt-3 font-normal leading-relaxed">
              Explore 7 & 8-seater Kia Carnival people movers, 12-seater Toyota HiAce commuter minibuses, and 1 to 2-tonne cargo vans. Transparent daily & weekly rates with pickup in Revesby NSW.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-neutral-300">
              <div className="flex items-center gap-1.5 bg-black/50 px-3 py-1.5 rounded-lg border border-neutral-700">
                <MapPin className="w-3.5 h-3.5 text-[#FFC928]" />
                <span>Pickup Depot: {settings.physicalAddress}</span>
              </div>
              {/* <div className="flex items-center gap-1.5 bg-black/50 px-3 py-1.5 rounded-lg border border-neutral-700">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FFC928]" />
                <span>Drive on Normal Car Licence (Class C)</span>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Main Container with Left Filter Sidebar and 4 Cards/Row Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* LEFT FILTER SIDEBAR (Desktop) */}
          <aside className="w-full lg:w-72 shrink-0 hidden lg:block sticky top-24 bg-[#F5F5F5] p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#111111]" />
                <h3 className="font-bold text-sm text-[#111111] font-heading">Filter Fleet</h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-neutral-600 hover:text-black font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Keyword Search
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="HiAce, Carnival, Estima, Master..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-lg bg-white border border-neutral-300 text-xs font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Vehicle Category Radio / List */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-2">
                Vehicle Category
              </label>
              <div className="space-y-1">
                {categories.map((cat) => {
                  const count =
                    cat === 'All'
                      ? publicCars.length
                      : publicCars.filter((c) => c.category === cat).length;
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#111111] text-[#FFC928] font-bold shadow-xs'
                          : 'text-neutral-700 hover:bg-neutral-200/80 bg-white/60'
                      }`}
                    >
                      <span>{cat}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          isSelected ? 'bg-neutral-800 text-[#FFC928]' : 'bg-neutral-200 text-neutral-600'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Max Daily Rate Slider */}
            {settings.showPricing && (
              <div className="pt-2 border-t border-neutral-200">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-neutral-700">Max Daily Rate</label>
                  <span className="text-xs font-black text-[#111111]">
                    {settings.currency}{maxPrice}/day
                  </span>
                </div>
                <input
                  type="range"
                  min="80"
                  max={highestPriceInFleet}
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#FFC928] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
                  <span>{settings.currency}80</span>
                  <span>{settings.currency}{highestPriceInFleet}+</span>
                </div>
              </div>
            )}

            {/* Transmission */}
            <div className="pt-2 border-t border-neutral-200">
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Transmission
              </label>
              <select
                value={selectedTransmission}
                onChange={(e) => setSelectedTransmission(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-white border border-neutral-300 text-xs font-medium text-neutral-800 focus:outline-none focus:border-black"
              >
                <option value="All">All Transmissions</option>
                <option value="Automatic">Automatic Only</option>
                <option value="Manual">Manual Only</option>
              </select>
            </div>

            {/* Fuel / Powertrain */}
            <div className="pt-2 border-t border-neutral-200">
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Powertrain
              </label>
              <select
                value={selectedFuelType}
                onChange={(e) => setSelectedFuelType(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-white border border-neutral-300 text-xs font-medium text-neutral-800 focus:outline-none focus:border-black"
              >
                <option value="All">All Powertrains</option>
                <option value="Petrol">Petrol</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
                <option value="Diesel">Diesel</option>
              </select>
            </div>

            {/* Seating Capacity */}
            <div className="pt-2 border-t border-neutral-200">
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Passengers
              </label>
              <select
                value={selectedSeats}
                onChange={(e) => setSelectedSeats(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-white border border-neutral-300 text-xs font-medium text-neutral-800 focus:outline-none focus:border-black"
              >
                <option value="All">Any Seating</option>
                <option value="2-3">2–3 Passengers (Cargo Vans)</option>
                <option value="7-8">7–8 Passengers (People Movers)</option>
                <option value="12">12 Passengers (HiAce Minibus)</option>
              </select>
            </div>

            {/* Available Only */}
            <div className="pt-2 border-t border-neutral-200">
              <label className="inline-flex items-center gap-2 text-xs font-bold text-neutral-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={availabilityOnly}
                  onChange={(e) => setAvailabilityOnly(e.target.checked)}
                  className="rounded accent-[#FFC928] w-4 h-4 cursor-pointer"
                />
                <span>Show Available Vehicles Only</span>
              </label>
            </div>

            {/* Depot Location Guarantee Box */}
            <div className="p-3.5 rounded-xl bg-white border-2 border-[#FFC928]/40 text-xs text-neutral-600 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#111111]">
                <ShieldCheck className="w-4 h-4 text-[#FFC928]" />
                <span>Revesby Depot Collection</span>
              </div>
              <p className="text-[11px] leading-relaxed text-neutral-600">
                All vehicles are stationed at our depot at <strong className="text-neutral-900 font-bold">{settings.physicalAddress}</strong>.
              </p>
            </div>
          </aside>

          {/* MAIN FLEET CONTENT (Right) */}
          <div className="flex-1 min-w-0 w-full space-y-6">
            {/* Top Toolbar: Mobile filter button, Result Count & Sort order */}
            <div className="bg-[#F5F5F5] rounded-xl p-4 border border-neutral-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 justify-between sm:justify-start">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFiltersMobile(true)}
                  className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-neutral-300 text-xs font-bold text-neutral-800 shadow-xs"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#FFC928]" />
                  <span>Filters {hasActiveFilters && '(Active)'}</span>
                </button>

                <p className="text-xs font-semibold text-neutral-600">
                  Showing <span className="font-bold text-[#111111]">{filteredAndSortedCars.length}</span> of {publicCars.length} vehicles
                </p>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
                <span className="text-xs font-bold text-neutral-700 whitespace-nowrap">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="h-9 px-3 rounded-lg bg-white border border-neutral-300 text-xs font-semibold text-neutral-900 focus:outline-none focus:border-black"
                >
                  <option value="recommended">Featured / Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="year-desc">Year: Newest</option>
                </select>
              </div>
            </div>

            {/* 3 CARDS PER ROW GRID IN CAR LAYOUT */}
            {filteredAndSortedCars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {filteredAndSortedCars.map((car) => (
                  <div key={car.id} className="h-full flex flex-col">
                    <CarCard car={car} />
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16 bg-[#F5F5F5] rounded-2xl border border-dashed border-neutral-300 p-8">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm mx-auto flex items-center justify-center text-neutral-400 mb-4">
                  <Filter className="w-8 h-8 text-[#FFC928]" />
                </div>
                <h3 className="text-xl font-bold text-[#111111] font-heading">
                  No matching vehicles found
                </h3>
                <p className="text-xs text-[#666666] max-w-md mx-auto mt-2 leading-relaxed">
                  We couldn't find any vehicle in our showroom matching your current filter criteria. Try adjusting the category, transmission, or price range.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FFC928] text-[#111111] font-bold text-xs hover:bg-[#E5B21E] transition-luxury cursor-pointer shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {showFiltersMobile && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm lg:hidden flex justify-end animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xs h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="font-bold text-base text-[#111111] font-heading">Filter Fleet</h3>
              <button
                onClick={() => setShowFiltersMobile(false)}
                className="p-1.5 rounded-lg bg-neutral-100 text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-2">Category</label>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold ${
                      selectedCategory === cat
                        ? 'bg-[#111111] text-[#FFC928] font-bold'
                        : 'bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Max Price */}
            {settings.showPricing && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-neutral-700">Max Daily Rate</label>
                  <span className="text-xs font-bold text-[#111111]">
                    {settings.currency}{maxPrice}/day
                  </span>
                </div>
                <input
                  type="range"
                  min="200"
                  max={highestPriceInFleet}
                  step="25"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#FFC928]"
                />
              </div>
            )}

            {/* Mobile Transmission */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Transmission</label>
              <select
                value={selectedTransmission}
                onChange={(e) => setSelectedTransmission(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium"
              >
                <option value="All">All Transmissions</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            {/* Mobile Powertrain */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Powertrain</label>
              <select
                value={selectedFuelType}
                onChange={(e) => setSelectedFuelType(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium"
              >
                <option value="All">All Powertrains</option>
                <option value="Petrol">Petrol</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
                <option value="Diesel">Diesel</option>
              </select>
            </div>

            <div className="pt-4 border-t border-neutral-200 space-y-2">
              <button
                onClick={() => setShowFiltersMobile(false)}
                className="w-full py-3 rounded-lg bg-[#FFC928] text-black font-bold text-xs shadow-sm"
              >
                Show {filteredAndSortedCars.length} Results
              </button>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="w-full py-2.5 rounded-lg bg-neutral-100 text-neutral-700 font-bold text-xs"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
