import { Car, Lead, WebsiteSettings, AdminUser, BlogPost, Testimonial } from '../types';
import { INITIAL_CARS, INITIAL_LEADS, INITIAL_SETTINGS, INITIAL_ADMIN_USER, INITIAL_BLOG_POSTS, INITIAL_TESTIMONIALS } from '../data/seedData';
import { VAN_IMAGES, resolveCarImage } from '../assets/images';

const STORAGE_KEYS = {
  CARS: 'tas_vans_v4',
  LEADS: 'tas_leads_v4',
  SETTINGS: 'tas_settings_v4',
  ADMIN_SESSION: 'tas_admin_session_v4',
  ADMIN_PASSWORD: 'tas_admin_pwd_v4',
  ADMIN_USER: 'tas_admin_user_v4',
  BLOGS: 'tas_blogs_v4',
  TESTIMONIALS: 'tas_testimonials_v4',
};

const FLEET_SYNC_KEY = 'tas_fleet_sync_v9_xpdx_multigallery';

const LEGACY_STORAGE_KEYS = {
  CARS: 'aussie_vans_v3',
  LEADS: 'aussie_leads_v2',
  SETTINGS: 'aussie_settings_v2',
  ADMIN_SESSION: 'aussie_admin_session_v2',
  ADMIN_PASSWORD: 'aussie_admin_pwd_v2',
  ADMIN_USER: 'aussie_admin_user_v2',
  BLOGS: 'aussie_blogs_v2',
  TESTIMONIALS: 'aussie_testimonials_v2',
};

// Default password hash/value
const DEFAULT_PASSWORD = 'admin123';

class StorageService {
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.initDefaults();
  }

  private initDefaults() {
    if (typeof window === 'undefined') return;

    // Migrate any legacy data from previous keys
    Object.keys(STORAGE_KEYS).forEach((k) => {
      const key = k as keyof typeof STORAGE_KEYS;
      const newKey = STORAGE_KEYS[key];
      const oldKey = LEGACY_STORAGE_KEYS[key];
      if (!localStorage.getItem(newKey) && localStorage.getItem(oldKey)) {
        localStorage.setItem(newKey, localStorage.getItem(oldKey)!);
      }
    });

    // Force refresh fleet when fleet specifications or rates change
    const syncStatus = localStorage.getItem(FLEET_SYNC_KEY);
    if (!syncStatus || syncStatus !== 'v9_xpdx_multigallery') {
      localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(INITIAL_CARS));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(INITIAL_ADMIN_USER));
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(INITIAL_LEADS));
      localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(INITIAL_BLOG_POSTS));
      localStorage.setItem(FLEET_SYNC_KEY, 'v9_xpdx_multigallery');
    } else if (!localStorage.getItem(STORAGE_KEYS.CARS)) {
      localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(INITIAL_CARS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LEADS)) {
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(INITIAL_LEADS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BLOGS)) {
      localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(INITIAL_BLOG_POSTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TESTIMONIALS)) {
      localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(INITIAL_TESTIMONIALS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD)) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, DEFAULT_PASSWORD);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ADMIN_USER)) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(INITIAL_ADMIN_USER));
    }
  }

  subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // --- CARS CRUD ---
  getCars(): Car[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CARS);
      if (data) {
        const parsed: Car[] = JSON.parse(data);
        // Ensure strictly vans with genuine van photos and no old sports/coupe models
        const validVans = parsed.filter(
          (c) =>
            !c.mainImage.includes('photo-1503376780353') &&
            !c.mainImage.includes('photo-1614162692292') &&
            !c.mainImage.includes('photo-1502877338535') &&
            c.category !== 'Coupe' &&
            c.category !== 'Convertible' &&
            c.category !== 'Sedan'
        );
        if (validVans.length > 0) {
          return validVans.map((c) => ({
            ...c,
            mainImage: resolveCarImage(c.mainImage),
            gallery: (c.gallery && c.gallery.length > 0 ? c.gallery : [c.mainImage]).map((g) => resolveCarImage(g)),
          }));
        }
      }
      return INITIAL_CARS;
    } catch (e) {
      console.error('Failed to parse cars from storage', e);
      return INITIAL_CARS;
    }
  }

  getPublicCars(): Car[] {
    return this.getCars()
      .filter((c) => c.status === 'Active' || c.status === 'Unavailable')
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  getFeaturedCars(): Car[] {
    return this.getPublicCars()
      .filter((c) => c.featured && c.status === 'Active')
      .slice(0, 4);
  }

  getHotCars(): Car[] {
    const publicActive = this.getPublicCars().filter((c) => c.status === 'Active');
    const hotTagged = publicActive.filter((c) => c.isHot);
    if (hotTagged.length >= 4) {
      return hotTagged.slice(0, 4);
    }
    const nonHot = publicActive.filter((c) => !c.isHot);
    return [...hotTagged, ...nonHot].slice(0, 4);
  }

  getBlogPosts(): BlogPost[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BLOGS);
      return data ? JSON.parse(data) : INITIAL_BLOG_POSTS;
    } catch {
      return INITIAL_BLOG_POSTS;
    }
  }

  getBlogPostBySlug(slug: string): BlogPost | undefined {
    return this.getBlogPosts().find((b) => b.slug === slug);
  }

  saveBlogPost(postData: Partial<BlogPost> & { title: string; content: string }): BlogPost {
    const posts = this.getBlogPosts();
    let updatedPost: BlogPost;

    const baseSlug = postData.slug
      ? postData.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      : postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const wordCount = postData.content ? postData.content.split(/\s+/).filter(Boolean).length : 50;
    const estimatedReadTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

    const nowFormatted = new Intl.DateTimeFormat('en-AU', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date());

    if (postData.id) {
      const index = posts.findIndex((p) => p.id === postData.id);
      if (index !== -1) {
        updatedPost = {
          ...posts[index],
          ...postData,
          slug: baseSlug,
          readTime: postData.readTime || estimatedReadTime,
        } as BlogPost;
        posts[index] = updatedPost;
      } else {
        updatedPost = postData as BlogPost;
        posts.unshift(updatedPost);
      }
    } else {
      updatedPost = {
        id: `post-${Date.now()}`,
        title: postData.title,
        slug: baseSlug || `article-${Date.now()}`,
        excerpt: postData.excerpt || (postData.content.slice(0, 150) + '...'),
        content: postData.content,
        category: postData.category || 'Driving Tips',
        author: postData.author || 'TAS Editorial Team',
        authorRole: postData.authorRole || 'Fleet Specialists',
        authorAvatar:
          postData.authorAvatar ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        readTime: postData.readTime || estimatedReadTime,
        publishedDate: postData.publishedDate || nowFormatted,
        coverImage: postData.coverImage || VAN_IMAGES.fleetShowcase,
        featuredCarId: postData.featuredCarId,
        metaTitle: postData.metaTitle || postData.title,
        metaDescription: postData.metaDescription || postData.excerpt || postData.content.slice(0, 160),
        keywords: postData.keywords || '',
        canonicalUrl: postData.canonicalUrl || '',
        ogImage: postData.ogImage || postData.coverImage || VAN_IMAGES.fleetShowcase,
        isPublished: postData.isPublished ?? true,
      };
      posts.unshift(updatedPost);
    }

    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(posts));
    this.notify();
    return updatedPost;
  }

  deleteBlogPost(id: string): boolean {
    const posts = this.getBlogPosts().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(posts));
    this.notify();
    return true;
  }

  getTestimonials(): Testimonial[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
      return data ? JSON.parse(data) : INITIAL_TESTIMONIALS;
    } catch {
      return INITIAL_TESTIMONIALS;
    }
  }

  getCarById(id: string): Car | undefined {
    return this.getCars().find((c) => c.id === id);
  }

  saveCar(carData: Partial<Car> & { make: string; model: string; year: number }): Car {
    const cars = this.getCars();
    let updatedCar: Car;

    if (carData.id) {
      // Edit existing
      const index = cars.findIndex((c) => c.id === carData.id);
      if (index !== -1) {
        updatedCar = { ...cars[index], ...carData } as Car;
        cars[index] = updatedCar;
      } else {
        updatedCar = carData as Car;
        cars.unshift(updatedCar);
      }
    } else {
      // Create new
      const newId = `car-${Date.now()}`;
      updatedCar = {
        id: newId,
        make: carData.make,
        model: carData.model,
        year: Number(carData.year) || 2024,
        category: carData.category || 'Van',
        pricePerDay: Number(carData.pricePerDay) || 120,
        pricePerWeek: carData.pricePerWeek ? Number(carData.pricePerWeek) : 550,
        transmission: carData.transmission || 'Automatic',
        fuelType: carData.fuelType || 'Diesel',
        seats: Number(carData.seats) || 8,
        doors: Number(carData.doors) || 5,
        mainImage: carData.mainImage ? resolveCarImage(carData.mainImage) : VAN_IMAGES.cargoVan,
        gallery: carData.gallery && carData.gallery.length > 0 ? carData.gallery.map(resolveCarImage) : [carData.mainImage ? resolveCarImage(carData.mainImage) : VAN_IMAGES.cargoVan],
        status: carData.status || 'Active',
        featured: carData.featured ?? false,
        displayOrder: Number(carData.displayOrder) || (cars.length + 1),
        shortDescription: carData.shortDescription || 'Clean, reliable passenger or cargo van maintained to highest road safety specifications.',
        features: carData.features || ['Dual Air-Con', 'Automatic Transmission', 'Reverse Camera', 'Bluetooth'],
        rentalTerms: carData.rentalTerms || 'Standard Australian car licence (Class C). Minimum age 21.',
        mileageLimit: carData.mileageLimit || '250 km / day included',
        securityDeposit: Number(carData.securityDeposit) || 400,
        createdAt: new Date().toISOString(),
      };
      cars.unshift(updatedCar);
    }

    localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(cars));
    this.notify();
    return updatedCar;
  }

  deleteCar(id: string): boolean {
    const cars = this.getCars().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(cars));
    this.notify();
    return true;
  }

  // --- LEADS CRUD ---
  getLeads(): Lead[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEADS);
      return data ? JSON.parse(data) : INITIAL_LEADS;
    } catch (e) {
      console.error('Failed to parse leads from storage', e);
      return INITIAL_LEADS;
    }
  }

  getLeadById(id: string): Lead | undefined {
    return this.getLeads().find((l) => l.id === id);
  }

  createLead(leadInput: {
    customerName: string;
    phoneNumber: string;
    email: string;
    requestedCarId?: string;
    requestedCarName?: string;
    requestedCarImage?: string;
    pickupDate: string;
    returnDate: string;
    pickupTime?: string;
    customerMessage: string;
    leadSource?: Lead['leadSource'];
    estimatedTotal?: number;
  }): Lead {
    const leads = this.getLeads();
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      customerName: leadInput.customerName.trim(),
      phoneNumber: leadInput.phoneNumber.trim(),
      email: leadInput.email.trim(),
      requestedCarId: leadInput.requestedCarId,
      requestedCarName: leadInput.requestedCarName,
      requestedCarImage: leadInput.requestedCarImage,
      pickupDate: leadInput.pickupDate,
      returnDate: leadInput.returnDate,
      pickupTime: leadInput.pickupTime || '10:00 AM',
      customerMessage: leadInput.customerMessage.trim() || 'Enquiry submitted via website form.',
      leadSource: leadInput.leadSource || 'Car Details',
      submissionDate: new Date().toISOString(),
      status: 'New',
      internalNotes: 'New automated enquiry from website visitor.',
      estimatedTotal: leadInput.estimatedTotal,
    };

    leads.unshift(newLead);
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
    this.notify();
    return newLead;
  }

  updateLead(lead: Lead): void {
    const leads = this.getLeads();
    const index = leads.findIndex((l) => l.id === lead.id);
    if (index !== -1) {
      leads[index] = lead;
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
      this.notify();
    }
  }

  deleteLead(id: string): boolean {
    const leads = this.getLeads().filter((l) => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
    this.notify();
    return true;
  }

  // --- SETTINGS ---
  getSettings(): WebsiteSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        const parsed = JSON.parse(data);
        // Automatically migrate any legacy references or addresses
        if (
          parsed.websiteName?.includes('Veloce') ||
          parsed.logoText === 'VELOCE' ||
          parsed.websiteName?.includes('LAS') ||
          parsed.logoText === 'LAS' ||
          parsed.physicalAddress?.includes('Commercial Road') ||
          parsed.physicalAddress?.includes('Beverly Hills') ||
          !parsed.businessName?.includes('TAS Car Rental')
        ) {
          const updated: WebsiteSettings = {
            ...INITIAL_SETTINGS,
            ...parsed,
            websiteName: 'TAS Car Rental',
            logoText: 'TAS',
            logoSubtitle: 'CAR RENTAL',
            businessName: 'TAS Car Rental',
            phoneNumber: '+61 413 993 439',
            whatsAppNumber: '+61413993439',
            emailAddress: 'bookings@tascarrental.com.au',
            physicalAddress: '176 Milperra Rd, Revesby NSW 2212, Australia',
            googleMapsEmbedUrl: 'https://maps.google.com/maps?q=176+Milperra+Rd,+Revesby+NSW+2212,+Australia&t=&z=15&ie=UTF8&iwloc=&output=embed',
            contactNotificationEmail: 'bookings@tascarrental.com.au',
            whatsAppGreeting: 'G’day! I would like to check vehicle availability with TAS Car Rental.',
            secretAdminKey: parsed.secretAdminKey || 'admin',
          };
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
          return updated;
        }
        return { ...INITIAL_SETTINGS, ...parsed };
      }
      return INITIAL_SETTINGS;
    } catch (e) {
      console.error('Failed to parse settings from storage', e);
      return INITIAL_SETTINGS;
    }
  }

  saveSettings(newSettings: WebsiteSettings): void {
    const payload = {
      ...newSettings,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(payload));
    this.notify();
  }

  resetSettingsToDefault(): WebsiteSettings {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    this.notify();
    return INITIAL_SETTINGS;
  }

  // --- AUTHENTICATION & SECURITY ---
  isAdminLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';
  }

  getAdminUser(): AdminUser {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ADMIN_USER);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.email?.includes('veloce') || parsed.email?.includes('lascarrental')) {
          parsed.email = 'admin@tascarrental.com.au';
          parsed.name = 'TAS Fleet Admin';
          localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(parsed));
        }
        return parsed;
      }
      return INITIAL_ADMIN_USER;
    } catch {
      return INITIAL_ADMIN_USER;
    }
  }

  loginAdmin(email: string, pass: string): { success: boolean; message?: string } {
    const user = this.getAdminUser();
    const storedPass = localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD) || DEFAULT_PASSWORD;

    const inputEmail = email.trim().toLowerCase();
    const isEmailValid =
      inputEmail === user.email.toLowerCase() ||
      inputEmail === 'admin@tascarrental.com.au' ||
      inputEmail === 'admin@lascarrental.com' ||
      inputEmail === 'admin@velocecars.com';

    if (isEmailValid && pass === storedPass) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
      this.notify();
      return { success: true };
    }

    return { success: false, message: 'Invalid administrator email or password.' };
  }

  logoutAdmin(): void {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    this.notify();
  }

  changePassword(oldPass: string, newPass: string): { success: boolean; message?: string } {
    const storedPass = localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD) || DEFAULT_PASSWORD;
    if (oldPass !== storedPass) {
      return { success: false, message: 'Current password is not correct.' };
    }
    if (!newPass || newPass.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, newPass);
    this.notify();
    return { success: true, message: 'Password updated successfully.' };
  }

  // --- EXPORT TO CSV ---
  exportLeadsToCSV(): void {
    const leads = this.getLeads();
    if (leads.length === 0) return;

    const headers = [
      'ID',
      'Submission Date',
      'Status',
      'Customer Name',
      'Phone Number',
      'Email',
      'Requested Vehicle',
      'Pickup Date',
      'Return Date',
      'Lead Source',
      'Estimated Total',
      'Internal Notes',
      'Follow-up Date',
      'Message',
    ];

    const rows = leads.map((l) => [
      `"${l.id}"`,
      `"${new Date(l.submissionDate).toLocaleDateString()} ${new Date(l.submissionDate).toLocaleTimeString()}"`,
      `"${l.status}"`,
      `"${l.customerName.replace(/"/g, '""')}"`,
      `"${l.phoneNumber}"`,
      `"${l.email}"`,
      `"${(l.requestedCarName || 'N/A').replace(/"/g, '""')}"`,
      `"${l.pickupDate}"`,
      `"${l.returnDate}"`,
      `"${l.leadSource}"`,
      `"${l.estimatedTotal ? `$${l.estimatedTotal}` : 'N/A'}"`,
      `"${(l.internalNotes || '').replace(/"/g, '""')}"`,
      `"${l.followUpDate || 'None'}"`,
      `"${(l.customerMessage || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `las-leads-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Preset image library for van additions
  getPresetCarImages(): { name: string; url: string; category: string }[] {
    return [
      {
        name: 'Toyota HiAce 12-Seater Commuter Auto',
        url: VAN_IMAGES.hiace12,
        category: 'Minibus',
      },
      {
        name: 'Kia Carnival 8-Seater Luxury People Mover',
        url: VAN_IMAGES.carnival,
        category: 'People Mover',
      },
      {
        name: 'Toyota HiAce 1 / 1.5 Ton Cargo Van',
        url: VAN_IMAGES.cargoVan,
        category: 'Van',
      },
      {
        name: 'Renault Master 2 Ton High-Roof Van',
        url: VAN_IMAGES.renaultMaster,
        category: 'Van',
      },
      {
        name: 'Toyota Estima 7/8-Seater People Mover',
        url: VAN_IMAGES.estima,
        category: 'People Mover',
      },
      {
        name: 'TAS Van Fleet Showcase',
        url: VAN_IMAGES.fleetShowcase,
        category: 'Van',
      },
    ];
  }
}

export const storage = new StorageService();
