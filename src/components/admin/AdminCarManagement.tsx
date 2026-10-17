import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Car, CarStatus, FuelType, TransmissionType, VehicleCategory } from '../../types';
import { storage } from '../../services/storage';
import { fileToDataUrl, filesToDataUrls } from '../../utils/imageUpload';
import {
  Plus,
  Edit,
  Trash2,
  Star,
  Check,
  AlertCircle,
  X,
  Image as ImageIcon,
  ArrowUpDown,
  Car as CarIcon,
  Search,
  Upload,
  Layers,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

interface AdminCarManagementProps {
  isAddModalOpenInitially?: boolean;
  onCloseAddModal?: () => void;
}

export const AdminCarManagement: React.FC<AdminCarManagementProps> = ({
  isAddModalOpenInitially = false,
  onCloseAddModal,
}) => {
  const { cars, saveCar, deleteCar, formatCurrency, settings, showToast } = useApp();

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(isAddModalOpenInitially);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);

  // Form Fields
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(2024);
  const [category, setCategory] = useState<VehicleCategory>('People Mover');
  const [pricePerDay, setPricePerDay] = useState<number>(140);
  const [pricePerWeek, setPricePerWeek] = useState<number | ''>(650);
  const [transmission, setTransmission] = useState<TransmissionType>('Automatic');
  const [fuelType, setFuelType] = useState<FuelType>('Diesel');
  const [seats, setSeats] = useState<number>(8);
  const [doors, setDoors] = useState<number>(5);

  // Manual Image Upload States
  const [mainImage, setMainImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [showMainUrlOption, setShowMainUrlOption] = useState(false);
  const [singleGalleryUrlInput, setSingleGalleryUrlInput] = useState('');
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryFilesInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<CarStatus>('Active');
  const [featured, setFeatured] = useState<boolean>(false);
  const [isHot, setIsHot] = useState<boolean>(false);
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [shortDescription, setShortDescription] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [rentalTerms, setRentalTerms] = useState('');
  const [mileageLimit, setMileageLimit] = useState('200 km / day included');
  const [securityDeposit, setSecurityDeposit] = useState<number>(1500);

  const presetImages = storage.getPresetCarImages();

  // Handle Main Image Manual File Upload
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingMain(true);
      const dataUrl = await fileToDataUrl(file, 1600, 1000, 0.85);
      setMainImage(dataUrl);
      showToast('Main vehicle image uploaded successfully!', 'success');
    } catch (err) {
      showToast('Could not process main image file.', 'error');
    } finally {
      setIsUploadingMain(false);
      if (mainImageInputRef.current) mainImageInputRef.current.value = '';
    }
  };

  // Handle Multiple Gallery Images Manual Upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploadingGallery(true);
      const urls = await filesToDataUrls(files, 1600, 1000, 0.85);
      setGalleryImages((prev) => [...prev, ...urls]);
      if (!mainImage && urls.length > 0) {
        setMainImage(urls[0]);
      }
      showToast(`${urls.length} gallery image(s) uploaded!`, 'success');
    } catch (err) {
      showToast('Could not process some gallery images.', 'error');
    } finally {
      setIsUploadingGallery(false);
      if (galleryFilesInputRef.current) galleryFilesInputRef.current.value = '';
    }
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetAsMain = (imageUrl: string) => {
    setMainImage(imageUrl);
    showToast('Set as main vehicle photo!', 'info');
  };

  const handleAddGalleryUrl = () => {
    if (!singleGalleryUrlInput.trim()) return;
    setGalleryImages((prev) => [...prev, singleGalleryUrlInput.trim()]);
    setSingleGalleryUrlInput('');
    showToast('Gallery image link added!', 'success');
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingCar(null);
    setMake('');
    setModel('');
    setYear(2024);
    setCategory('People Mover');
    setPricePerDay(130);
    setPricePerWeek(650);
    setTransmission('Automatic');
    setFuelType('Diesel');
    setSeats(8);
    setDoors(5);
    setMainImage('');
    setGalleryImages([]);
    setShowMainUrlOption(false);
    setSingleGalleryUrlInput('');
    setStatus('Active');
    setFeatured(false);
    setIsHot(false);
    setDisplayOrder(cars.length + 1);
    setShortDescription('Comfortable and spacious passenger van with dual air-con and generous luggage room.');
    setFeaturesInput('Standard Car Licence (Class C), Dual Air-Con, Reverse Camera, Apple CarPlay, Bluetooth');
    setRentalTerms('Standard Australian driver licence (Class C). Minimum age 21.');
    setMileageLimit('250 km / day included');
    setSecurityDeposit(400);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (car: Car) => {
    setEditingCar(car);
    setMake(car.make);
    setModel(car.model);
    setYear(car.year);
    setCategory(car.category);
    setPricePerDay(car.pricePerDay);
    setPricePerWeek(car.pricePerWeek ?? '');
    setTransmission(car.transmission);
    setFuelType(car.fuelType);
    setSeats(car.seats);
    setDoors(car.doors);
    setMainImage(car.mainImage);
    setGalleryImages(car.gallery && car.gallery.length > 0 ? [...car.gallery] : [car.mainImage]);
    setShowMainUrlOption(false);
    setSingleGalleryUrlInput('');
    setStatus(car.status);
    setFeatured(car.featured);
    setIsHot(car.isHot ?? false);
    setDisplayOrder(car.displayOrder);
    setShortDescription(car.shortDescription);
    setFeaturesInput(car.features ? car.features.join(', ') : '');
    setRentalTerms(car.rentalTerms);
    setMileageLimit(car.mileageLimit);
    setSecurityDeposit(car.securityDeposit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCar(null);
    if (onCloseAddModal) onCloseAddModal();
  };

  // Form Submit
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const featuresList = featuresInput
      .split(',')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const fallbackImage = '/src/assets/images/toyota_hiace_12_seater_1792057594958.jpg';
    const effectiveMainImage = mainImage || (galleryImages.length > 0 ? galleryImages[0] : fallbackImage);
    const effectiveGallery = galleryImages.length > 0 ? galleryImages : [effectiveMainImage];

    saveCar({
      id: editingCar ? editingCar.id : undefined,
      make,
      model,
      year: Number(year),
      category,
      pricePerDay: Number(pricePerDay),
      pricePerWeek: pricePerWeek ? Number(pricePerWeek) : undefined,
      transmission,
      fuelType,
      seats: Number(seats),
      doors: Number(doors),
      mainImage: effectiveMainImage,
      gallery: effectiveGallery,
      status,
      featured,
      isHot,
      displayOrder: Number(displayOrder),
      shortDescription,
      features: featuresList,
      rentalTerms,
      mileageLimit,
      securityDeposit: Number(securityDeposit),
    });

    handleCloseModal();
  };

  const confirmDelete = () => {
    if (!carToDelete) return;
    deleteCar(carToDelete.id);
    setCarToDelete(null);
  };

  // Filtered cars
  const filteredCars = cars.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = `${c.make} ${c.model}`.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (categoryFilter !== 'All' && c.category !== categoryFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111111] font-heading">
            Showroom Fleet Management
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Add, update, or reorganize vehicle availability, specifications, and daily rental rates.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#FFC928] hover:bg-[#E5B21E] text-black font-bold text-xs shadow-sm transition-luxury cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search make or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-neutral-600 whitespace-nowrap">Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium text-neutral-800 focus:outline-none focus:border-black"
          >
            <option value="All">All Categories ({cars.length})</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Coupe">Coupe</option>
            <option value="Luxury">Luxury</option>
            <option value="Convertible">Convertible</option>
          </select>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F5F5] text-neutral-600 font-bold uppercase text-[10px] tracking-wider border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Specifications</th>
                <th className="py-3 px-4">Daily Rate</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredCars.map((car) => (
                <tr key={car.id} className="hover:bg-neutral-50 transition-colors">
                  {/* Vehicle with thumbnail */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={car.mainImage}
                        alt=""
                        className="w-14 h-10 object-cover rounded-md bg-neutral-100 shrink-0 border border-neutral-200"
                      />
                      <div>
                        <div className="font-bold text-[#111111] text-sm font-heading">
                          {car.make} {car.model}
                        </div>
                        <div className="text-[11px] text-neutral-500">Year: {car.year}</div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-neutral-100 text-neutral-800">
                      {car.category}
                    </span>
                  </td>

                  {/* Specs */}
                  <td className="py-3.5 px-4 text-neutral-600">
                    <div>{car.transmission} • {car.fuelType}</div>
                    <div className="text-[10px] text-neutral-400">{car.seats} Seats • {car.doors} Doors</div>
                  </td>

                  {/* Daily & Weekly Rate */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-baseline gap-1">
                      <span className="font-bold text-[#111111] text-sm">
                        {formatCurrency(car.pricePerDay)}
                      </span>
                      <span className="text-[10px] text-neutral-500">/day</span>
                    </div>
                    {car.pricePerWeek && (
                      <div className="text-[11px] font-semibold text-amber-700">
                        {formatCurrency(car.pricePerWeek)}
                        <span className="text-[10px] text-neutral-500 font-normal">/wk</span>
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        car.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : car.status === 'Unavailable'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          car.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                      {car.status}
                    </span>
                  </td>

                  {/* Featured */}
                  <td className="py-3.5 px-4">
                    {car.featured ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#997300] bg-[#FFC928]/20 px-2 py-0.5 rounded">
                        <Star className="w-3 h-3 fill-[#FFC928] text-[#997300]" />
                        <span>Featured</span>
                      </span>
                    ) : (
                      <span className="text-neutral-400 text-[11px]">-</span>
                    )}
                  </td>

                  {/* Display Order */}
                  <td className="py-3.5 px-4 font-mono font-semibold text-neutral-700">
                    #{car.displayOrder}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleOpenEdit(car)}
                      className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-md transition-colors cursor-pointer mr-1"
                      title="Edit vehicle"
                    >
                      <Edit className="w-4 h-4 inline" />
                    </button>
                    <button
                      onClick={() => setCarToDelete(car)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                      title="Delete vehicle"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredCars.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500">
                    No vehicles found. Click "Add New Vehicle" to add one to the showroom.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Car Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-neutral-300 overflow-hidden relative my-6">
            {/* Modal Header */}
            <div className="bg-[#111111] text-white p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-heading">
                  {editingCar ? `Edit ${editingCar.make} ${editingCar.model}` : 'Add New Fleet Vehicle'}
                </h2>
                <p className="text-xs text-neutral-400">
                  Configure vehicle specifications, pricing, imagery, and homepage visibility
                </p>
              </div>

              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
              {/* Row 1: Make, Model, Year, Category */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">Make *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Toyota, Kia, Renault"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HiAce 12-Seater Auto"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">Year *</label>
                  <input
                    type="number"
                    required
                    min="2018"
                    max="2027"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as VehicleCategory)}
                    className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                  >
                    <option value="People Mover">People Mover (7-8 Seats)</option>
                    <option value="Minibus">Minibus (12 Seats)</option>
                    <option value="Van">Van / Commercial (1-2 Ton)</option>
                    <option value="SUV">SUV</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Price, Weekly Price, Transmission, Fuel, Seats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Daily Rate ({settings.currency}) *
                  </label>
                  <input
                    type="number"
                    required
                    min="20"
                    step="5"
                    value={pricePerDay}
                    onChange={(e) => setPricePerDay(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Weekly Rate ({settings.currency})
                  </label>
                  <input
                    type="number"
                    min="50"
                    step="10"
                    placeholder="e.g. 850"
                    value={pricePerWeek}
                    onChange={(e) => setPricePerWeek(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">Transmission *</label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value as TransmissionType)}
                    className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">Fuel / Powertrain *</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as FuelType)}
                    className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                    <option value="Diesel">Diesel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">Seating Capacity *</label>
                  <input
                    type="number"
                    required
                    min="2"
                    max="15"
                    value={seats}
                    onChange={(e) => setSeats(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>
              </div>

              {/* SECTION: MAIN VEHICLE IMAGE (MANUAL UPLOAD) */}
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-neutral-800">
                      Main Vehicle Photo (Manual Upload) *
                    </label>
                    <span className="text-[11px] text-neutral-500">
                      Upload primary vehicle showcase photo from your computer.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowMainUrlOption(!showMainUrlOption)}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer underline"
                  >
                    {showMainUrlOption ? 'Hide URL/Presets' : 'Or select preset / URL'}
                  </button>
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={mainImageInputRef}
                  onChange={handleMainImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                {mainImage ? (
                  <div className="relative rounded-xl overflow-hidden border border-neutral-300 bg-neutral-900 group">
                    <img
                      src={mainImage}
                      alt="Main Vehicle Preview"
                      className="w-full h-48 object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-4">
                      <div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFC928] text-black">
                          <Check className="w-3 h-3" />
                          <span>Main Showcase Photo</span>
                        </span>
                        <p className="text-[11px] text-neutral-300 mt-1 truncate max-w-sm">
                          {mainImage.startsWith('data:') ? 'Custom uploaded image (Ready)' : mainImage}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => mainImageInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-black text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Replace</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setMainImage('')}
                          className="p-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white cursor-pointer"
                          title="Remove image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => mainImageInputRef.current?.click()}
                    className="border-2 border-dashed border-neutral-300 hover:border-black rounded-xl p-6 text-center cursor-pointer bg-white transition-all hover:bg-neutral-50/50 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-neutral-100 group-hover:bg-[#FFC928]/20 flex items-center justify-center mx-auto mb-2 transition-colors">
                      <Upload className="w-5 h-5 text-neutral-600 group-hover:text-black transition-colors" />
                    </div>
                    <span className="block text-xs font-bold text-neutral-800 mb-0.5">
                      {isUploadingMain ? 'Processing and optimizing image...' : 'Click to Browse or Drag & Drop Main Vehicle Photo'}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      Supports JPG, PNG, WebP up to 15MB • Automatically scaled for fast loading
                    </span>
                  </div>
                )}

                {/* Preset image picker & URL fallback */}
                {showMainUrlOption && (
                  <div className="pt-2 space-y-2 border-t border-neutral-200">
                    <span className="text-[10px] text-neutral-500 font-bold block">
                      Select from fleet showcase assets or enter URL:
                    </span>
                    <div className="flex gap-2 overflow-x-auto py-1">
                      {presetImages.map((p, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setMainImage(p.url);
                            if (!make) setMake(p.name.split(' ')[0]);
                          }}
                          className={`shrink-0 text-[10px] font-semibold px-2 py-1 rounded border transition-colors cursor-pointer ${
                            mainImage === p.url
                              ? 'bg-[#FFC928] text-black border-black font-bold'
                              : 'bg-white text-neutral-700 hover:bg-neutral-100 border-neutral-300'
                          }`}
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>

                    <input
                      type="url"
                      placeholder="Or paste external image URL (https://...)"
                      value={mainImage.startsWith('data:') ? '' : mainImage}
                      onChange={(e) => setMainImage(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg bg-white border border-neutral-300 text-xs font-medium"
                    />
                  </div>
                )}
              </div>

              {/* SECTION: ADDITIONAL GALLERY IMAGES (MANUAL MULTIPLE UPLOAD) */}
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-neutral-800">
                      Additional Gallery Photos (Manual Multiple Upload)
                    </label>
                    <span className="text-[11px] text-neutral-500">
                      Upload multiple photos at once: interior seating, luggage bay, cabin, dash & exterior.
                    </span>
                  </div>

                  {galleryImages.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#111111] text-[#FFC928]">
                      {galleryImages.length} Photo{galleryImages.length > 1 ? 's' : ''} in Gallery
                    </span>
                  )}
                </div>

                {/* Hidden Multi-file input */}
                <input
                  type="file"
                  ref={galleryFilesInputRef}
                  onChange={handleGalleryUpload}
                  multiple
                  accept="image/*"
                  className="hidden"
                />

                {/* Dropzone for Multiple Gallery Files */}
                <div
                  onClick={() => galleryFilesInputRef.current?.click()}
                  className="border-2 border-dashed border-neutral-300 hover:border-black rounded-xl p-5 text-center cursor-pointer bg-white transition-all hover:bg-neutral-50/50 group"
                >
                  <div className="w-10 h-10 rounded-full bg-neutral-100 group-hover:bg-[#FFC928]/20 flex items-center justify-center mx-auto mb-1.5 transition-colors">
                    <Layers className="w-4 h-4 text-neutral-600 group-hover:text-black transition-colors" />
                  </div>
                  <span className="block text-xs font-bold text-neutral-800">
                    {isUploadingGallery ? 'Uploading multiple photos...' : 'Click to Select Multiple Photos or Drag & Drop Here'}
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    Select 2, 5, 10+ photos at once • Supports all standard image formats
                  </span>
                </div>

                {/* Live Gallery Photos Grid */}
                {galleryImages.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-neutral-700">Uploaded Gallery Images:</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => galleryFilesInputRef.current?.click()}
                          className="text-[11px] text-[#856404] hover:underline font-bold cursor-pointer"
                        >
                          + Add More Photos
                        </button>
                        <span className="text-neutral-300">•</span>
                        <button
                          type="button"
                          onClick={() => setGalleryImages([])}
                          className="text-[11px] text-red-600 hover:underline font-bold cursor-pointer"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto p-1 bg-white rounded-lg border border-neutral-200">
                      {galleryImages.map((imgUrl, index) => {
                        const isCurrentMain = mainImage === imgUrl;
                        return (
                          <div
                            key={index}
                            className="relative group rounded-lg overflow-hidden border border-neutral-200 aspect-[4/3] bg-neutral-100"
                          >
                            <img
                              src={imgUrl}
                              alt={`Gallery photo ${index + 1}`}
                              className="w-full h-full object-cover"
                            />

                            {/* Badge Index */}
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/70 text-white">
                              #{index + 1}
                            </span>

                            {isCurrentMain && (
                              <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FFC928] text-black shadow-xs">
                                Main
                              </span>
                            )}

                            {/* Overlay Controls */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveGalleryImage(index)}
                                  className="w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center cursor-pointer transition-colors"
                                  title="Delete photo"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {!isCurrentMain && (
                                <button
                                  type="button"
                                  onClick={() => handleSetAsMain(imgUrl)}
                                  className="w-full py-1 rounded bg-white text-black text-[10px] font-bold hover:bg-[#FFC928] transition-colors cursor-pointer"
                                >
                                  Set as Main
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Add Photo by URL Fallback */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="url"
                    placeholder="Or paste an image URL to add into gallery..."
                    value={singleGalleryUrlInput}
                    onChange={(e) => setSingleGalleryUrlInput(e.target.value)}
                    className="flex-1 h-8 px-2.5 rounded-lg bg-white border border-neutral-300 text-xs font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryUrl}
                    className="h-8 px-3 rounded-lg bg-neutral-800 hover:bg-black text-white text-xs font-bold cursor-pointer"
                  >
                    + Add URL
                  </button>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Short Vehicle Description *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe powertrain, comfort package, and road character..."
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              {/* Features / Amenities */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Key Amenities (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Sport Chrono, Bose Surround Sound, Heated Seats, 360 Camera"
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              {/* Rental Terms & Security Deposit */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Rental Terms & Requirements
                  </label>
                  <input
                    type="text"
                    value={rentalTerms}
                    onChange={(e) => setRentalTerms(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Security Hold ({settings.currency})
                  </label>
                  <input
                    type="number"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>
              </div>

              {/* Status, Featured, Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">Fleet Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as CarStatus)}
                    className="w-full h-10 px-3 rounded-lg bg-white border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black"
                  >
                    <option value="Active">Active (Publicly bookable)</option>
                    <option value="Unavailable">Unavailable (Marked on site)</option>
                    <option value="Inactive">Inactive (Hidden from site)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg bg-white border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black"
                  />
                </div>

                <div className="flex flex-col gap-2 pt-3">
                  <label className="inline-flex items-center gap-2 text-xs font-bold text-neutral-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="rounded accent-[#FFC928] w-4 h-4 cursor-pointer"
                    />
                    <span>Feature on Homepage</span>
                  </label>

                  <label className="inline-flex items-center gap-2 text-xs font-bold text-red-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isHot}
                      onChange={(e) => setIsHot(e.target.checked)}
                      className="rounded accent-red-600 w-4 h-4 cursor-pointer"
                    />
                    <span>Mark as Hot / Trending Pick</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#FFC928] hover:bg-[#E5B21E] text-black font-bold text-xs shadow-sm transition-luxury cursor-pointer"
                >
                  {editingCar ? 'Save Vehicle Changes' : 'Create & Publish Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {carToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-neutral-300">
            <div className="flex items-center gap-2.5 text-red-600 font-bold text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>Confirm Vehicle Removal</span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Are you sure you want to remove the{' '}
              <strong className="text-black">{carToDelete.make} {carToDelete.model}</strong> from the fleet database?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCarToDelete(null)}
                className="px-3.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-neutral-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-bold text-white shadow-sm"
              >
                Delete Vehicle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
