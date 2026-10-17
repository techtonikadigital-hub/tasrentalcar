import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Car, Lead, WebsiteSettings, AdminUser, LeadStatus, BlogPost, Testimonial } from '../types';
import { storage } from '../services/storage';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type AppView = 'home' | 'cars' | 'about' | 'service-area' | 'faq' | 'blog' | 'contact' | 'admin' | 'vehicle-details';

export const getViewFromUrl = (): AppView => {
  if (typeof window === 'undefined') return 'home';

  // 1. Pathname check (e.g. /cars, /about, /service-area, /faq, /blog, /contact, /admin, /car/:id)
  const pathname = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, '');
  if (pathname.startsWith('car/') || pathname.startsWith('cars/') || pathname.startsWith('vehicle/')) return 'vehicle-details';
  if (pathname === 'car' || pathname === 'vehicle') return 'vehicle-details';
  if (pathname === 'cars' || pathname === 'fleet') return 'cars';
  if (pathname === 'about' || pathname === 'about-us') return 'about';
  if (pathname === 'service-area' || pathname === 'service-areas' || pathname === 'servicearea') return 'service-area';
  if (pathname === 'faq' || pathname === 'faqs') return 'faq';
  if (pathname === 'blog' || pathname === 'journal') return 'blog';
  if (pathname === 'contact' || pathname === 'contact-us') return 'contact';
  if (pathname === 'admin' || pathname === 'dashboard') return 'admin';

  // 2. Hash check (e.g. #/cars, #cars, #faq, #car/:id)
  const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '');
  if (hash.startsWith('car/') || hash.startsWith('cars/') || hash.startsWith('vehicle/')) return 'vehicle-details';
  if (hash === 'cars' || hash === 'fleet') return 'cars';
  if (hash === 'about') return 'about';
  if (hash === 'service-area' || hash === 'service-areas') return 'service-area';
  if (hash === 'faq' || hash === 'faqs') return 'faq';
  if (hash === 'blog' || hash === 'journal') return 'blog';
  if (hash === 'contact') return 'contact';
  if (hash === 'admin' || hash === 'secure-admin') return 'admin';

  // 3. Query params check (e.g. ?page=cars, ?page=faq, ?car=:id)
  const params = new URLSearchParams(window.location.search);
  if (params.get('car') || params.get('vehicle')) return 'vehicle-details';
  const pageParam = params.get('page') || params.get('view');
  if (pageParam === 'vehicle-details' || pageParam === 'vehicle' || pageParam === 'car') return 'vehicle-details';
  if (pageParam === 'cars') return 'cars';
  if (pageParam === 'about') return 'about';
  if (pageParam === 'service-area' || pageParam === 'service-areas') return 'service-area';
  if (pageParam === 'faq') return 'faq';
  if (pageParam === 'blog') return 'blog';
  if (pageParam === 'contact') return 'contact';
  if (pageParam === 'admin') return 'admin';

  return 'home';
};

interface AppContextType {
  // Navigation & Page views
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedCarForDetails: Car | null;
  setSelectedCarForDetails: (car: Car | null) => void;
  openBookingForCar: (car: Car | null) => void;

  // Blog state
  selectedBlogPost: BlogPost | null;
  setSelectedBlogPost: (post: BlogPost | null) => void;
  blogPosts: BlogPost[];
  saveBlogPost: (postData: Partial<BlogPost> & { title: string; content: string }) => BlogPost;
  deleteBlogPost: (postId: string) => void;

  // Testimonials
  testimonials: Testimonial[];

  // Data
  cars: Car[];
  publicCars: Car[];
  featuredCars: Car[];
  hotCars: Car[];
  leads: Lead[];
  settings: WebsiteSettings;

  // Admin Auth & Secret Access
  isAdminLoggedIn: boolean;
  adminUser: AdminUser;
  hasSecretAdminAccess: boolean;
  getSecretAdminUrl: () => string;
  loginAdmin: (email: string, pass: string) => { success: boolean; message?: string };
  logoutAdmin: () => void;
  changePassword: (oldP: string, newP: string) => { success: boolean; message?: string };

  // Lead Actions
  submitLead: (leadInput: {
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
  }) => Lead;
  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  updateLeadDetails: (lead: Lead) => void;
  deleteLead: (leadId: string) => void;
  exportLeadsCSV: () => void;

  // Car Actions
  saveCar: (carData: Partial<Car> & { make: string; model: string; year: number }) => Car;
  deleteCar: (carId: string) => void;

  // Settings Actions
  updateSettings: (settings: WebsiteSettings) => void;
  resetSettings: () => void;

  // Feedback & Dialogs
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  openPolicyModal: 'privacy' | 'terms' | null;
  setOpenPolicyModal: (type: 'privacy' | 'terms' | null) => void;

  // Utility
  formatCurrency: (amount?: number) => string;
  getCarById: (id: string) => Car | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const resolveCarFromUrl = (allCars: Car[]): Car | null => {
  if (typeof window === 'undefined' || !allCars || allCars.length === 0) return null;
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash;
  const pathParts = window.location.pathname.replace(/^\/+|\/+$/g, '').split('/');
  let carIdFromUrl: string | null = null;

  if (
    (pathParts[0]?.toLowerCase() === 'car' ||
      pathParts[0]?.toLowerCase() === 'cars' ||
      pathParts[0]?.toLowerCase() === 'vehicle') &&
    pathParts[1]
  ) {
    carIdFromUrl = pathParts[1];
  }
  if (!carIdFromUrl) {
    carIdFromUrl = params.get('car') || params.get('vehicle') || params.get('enquiry') || params.get('id');
  }
  if (!carIdFromUrl && hash) {
    const cleanHash = hash.replace(/^#\/?/, '');
    const hashParts = cleanHash.split('/');
    if (
      (hashParts[0]?.toLowerCase() === 'car' || hashParts[0]?.toLowerCase() === 'vehicle') &&
      hashParts[1]
    ) {
      carIdFromUrl = hashParts[1];
    }
  }

  if (carIdFromUrl) {
    const target = decodeURIComponent(carIdFromUrl).trim().toLowerCase();
    const byId = allCars.find((c) => c.id.toLowerCase() === target);
    if (byId) return byId;

    const bySlug = allCars.find((c) => {
      const slug = `${c.make}-${c.model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return slug === target || slug.replace(/^-+|-+$/g, '') === target;
    });
    if (bySlug) return bySlug;

    const byPartial = allCars.find((c) => {
      const slug = `${c.make}-${c.model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return slug.includes(target) || target.includes(c.id.toLowerCase()) || c.id.toLowerCase().includes(target);
    });
    if (byPartial) return byPartial;
  }
  return null;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentViewInternal] = useState<AppView>(() => getViewFromUrl());
  const [selectedCarForDetails, setSelectedCarForDetailsInternal] = useState<Car | null>(() => {
    return resolveCarFromUrl(storage.getCars());
  });
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [openPolicyModal, setOpenPolicyModal] = useState<'privacy' | 'terms' | null>(null);

  const [cars, setCars] = useState<Car[]>(() => storage.getCars());
  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings>(storage.getSettings());
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser>(storage.getAdminUser());
  const [hasSecretAdminAccess, setHasSecretAdminAccess] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Sync state from storage
  const syncData = useCallback(() => {
    setCars(storage.getCars());
    setLeads(storage.getLeads());
    setSettings(storage.getSettings());
    setBlogPosts(storage.getBlogPosts());
    setTestimonials(storage.getTestimonials());
    setIsAdminLoggedIn(storage.isAdminLoggedIn());
    setAdminUser(storage.getAdminUser());
  }, []);

  useEffect(() => {
    syncData();
    const unsubscribe = storage.subscribe(syncData);
    return () => {
      unsubscribe();
    };
  }, [syncData]);

  // Navigates directly to the dedicated individual vehicle page
  const openBookingForCar = useCallback((car: Car | null) => {
    if (!car) return;
    setSelectedCarForDetailsInternal(car);
    setCurrentViewInternal('vehicle-details');
    if (typeof window !== 'undefined') {
      const targetPath = `/car/${car.id}`;
      window.history.pushState({ view: 'vehicle-details', carId: car.id }, '', targetPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const setSelectedCarForDetails = useCallback((car: Car | null) => {
    setSelectedCarForDetailsInternal(car);
    if (car) {
      setCurrentViewInternal('vehicle-details');
      if (typeof window !== 'undefined') {
        const targetPath = `/car/${car.id}`;
        window.history.pushState({ view: 'vehicle-details', carId: car.id }, '', targetPath);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      setCurrentViewInternal('cars');
      if (typeof window !== 'undefined') {
        window.history.pushState({ view: 'cars' }, '', '/cars');
      }
    }
  }, []);

  // Sync URL routing and check admin access on mount, popstate and hashchange
  useEffect(() => {
    const handleUrlRouteSync = () => {
      if (typeof window === 'undefined') return;
      const allCars = storage.getCars();
      const matchedCar = resolveCarFromUrl(allCars);
      if (matchedCar) {
        setSelectedCarForDetailsInternal(matchedCar);
        setCurrentViewInternal('vehicle-details');
        setHasSecretAdminAccess(true);
        return;
      }

      setHasSecretAdminAccess(true);
      const detectedView = getViewFromUrl();
      setCurrentViewInternal(detectedView);
    };

    handleUrlRouteSync();
    window.addEventListener('popstate', handleUrlRouteSync);
    window.addEventListener('hashchange', handleUrlRouteSync);
    return () => {
      window.removeEventListener('popstate', handleUrlRouteSync);
      window.removeEventListener('hashchange', handleUrlRouteSync);
    };
  }, []);

  // Synchronizes browser URL for page refresh persistence
  const setCurrentView = useCallback(
    (view: AppView) => {
      setCurrentViewInternal(view);
      if (typeof window !== 'undefined') {
        const targetPath =
          view === 'home'
            ? '/'
            : view === 'vehicle-details' && selectedCarForDetails
            ? `/car/${selectedCarForDetails.id}`
            : `/${view}`;
        if (window.location.pathname !== targetPath) {
          window.history.pushState({ view }, '', targetPath);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [selectedCarForDetails]
  );

  const getSecretAdminUrl = useCallback(() => {
    if (typeof window === 'undefined') return '';
    const key = settings.secretAdminKey || 'las-hq-secure-key-928';
    return `${window.location.origin}/?admin_access=${key}`;
  }, [settings.secretAdminKey]);

  // Synchronize dynamic SEO metadata across every view
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const baseTitle = settings.websiteName || 'TAS Car Rental';
    let pageTitle = `${baseTitle} | 7 & 12 Seater Passenger Van Hire Revesby NSW`;
    let metaDesc = settings.seoMetaDescription || `Hire passenger vans and vehicles at ${settings.physicalAddress}. Call ${settings.phoneNumber}.`;

    switch (currentView) {
      case 'home':
        pageTitle = `${baseTitle} | 7 & 12 Seater Toyota HiAce & Kia Carnival Hire`;
        metaDesc = `Rent 7-seater Kia Carnival people movers and 12-seater Toyota HiAce passenger vans at ${settings.physicalAddress}. Call ${settings.phoneNumber}.`;
        break;
      case 'cars':
        pageTitle = `Our Fleet | ${baseTitle} Revesby NSW`;
        metaDesc = `Browse 7 & 12-seater passenger vans, people movers, and commercial vans stationed at ${settings.physicalAddress}.`;
        break;
      case 'about':
        pageTitle = `About Us | ${baseTitle} Revesby`;
        metaDesc = `Learn about TAS Car Rental based at ${settings.physicalAddress}. Simple passenger van hire on a normal car licence.`;
        break;
      case 'service-area':
        pageTitle = `Van Hire Service Areas Across Sydney | ${baseTitle} Revesby`;
        metaDesc = `XPDX / TAS Van Hire Sydney service areas. Passenger van and commercial van hire depot at ${settings.physicalAddress} with rapid access across Canterbury-Bankstown, Liverpool, Sydney Airport, Parramatta & Greater Sydney.`;
        break;
      case 'vehicle-details':
        pageTitle = selectedCarForDetails
          ? `${selectedCarForDetails.year} ${selectedCarForDetails.make} ${selectedCarForDetails.model} Hire | ${baseTitle}`
          : `Vehicle Hire Details & Enquiry | ${baseTitle}`;
        metaDesc = selectedCarForDetails
          ? `Enquire and hire the ${selectedCarForDetails.year} ${selectedCarForDetails.make} ${selectedCarForDetails.model} from ${settings.physicalAddress}. ${selectedCarForDetails.shortDescription}`
          : `Hire passenger vans and vehicles at ${settings.physicalAddress}. Call ${settings.phoneNumber}.`;
        break;
      case 'blog':
        pageTitle = selectedBlogPost
          ? `${selectedBlogPost.metaTitle || selectedBlogPost.title} | ${baseTitle}`
          : `${settings.blogSeoTitle || 'Van Hire Guides & Road Trips'} | ${baseTitle}`;
        metaDesc = selectedBlogPost
          ? (selectedBlogPost.metaDescription || selectedBlogPost.excerpt)
          : (settings.blogSeoMetaDescription || `Passenger van comparisons, road trip tips, and driver licence guides by ${baseTitle}.`);
        break;
      case 'contact':
        pageTitle = `Contact & Depot Location | ${baseTitle}`;
        metaDesc = `Visit our depot at ${settings.physicalAddress} or call our team directly on ${settings.phoneNumber}.`;
        break;
      case 'faq':
        pageTitle = `FAQ & Rental Terms | ${baseTitle}`;
        metaDesc = `Clear answers on 7 and 12-seater passenger van hire, standard licence requirements, and booking at ${baseTitle}.`;
        break;
      case 'admin':
        pageTitle = `Fleet Administration Hub | ${baseTitle}`;
        metaDesc = `Secure fleet management and enquiry tracking portal for authorized personnel.`;
        break;
    }

    document.title = pageTitle;

    // Update Meta Description
    let metaEl = document.querySelector('meta[name="description"]');
    if (!metaEl) {
      metaEl = document.createElement('meta');
      metaEl.setAttribute('name', 'description');
      document.head.appendChild(metaEl);
    }
    metaEl.setAttribute('content', metaDesc);

    // Update OpenGraph
    let ogTitleEl = document.querySelector('meta[property="og:title"]');
    if (ogTitleEl) ogTitleEl.setAttribute('content', pageTitle);
    let ogDescEl = document.querySelector('meta[property="og:description"]');
    if (ogDescEl) ogDescEl.setAttribute('content', metaDesc);
  }, [currentView, selectedBlogPost, settings]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}`;
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4000);
  }, []);

  const formatCurrency = useCallback(
    (amount?: number) => {
      if (amount === undefined || isNaN(amount)) return '';
      return `${settings.currency || '$'}${amount.toLocaleString()}`;
    },
    [settings.currency]
  );

  const getCarById = useCallback(
    (id: string) => {
      return cars.find((c) => c.id === id);
    },
    [cars]
  );

  // Lead handling
  const submitLead = useCallback(
    (leadInput: {
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
    }) => {
      const newLead = storage.createLead(leadInput);
      showToast('Your rental enquiry has been received! Our concierge team will contact you shortly.', 'success');
      return newLead;
    },
    [showToast]
  );

  const updateLeadStatus = useCallback(
    (leadId: string, status: LeadStatus) => {
      const lead = storage.getLeadById(leadId);
      if (lead) {
        storage.updateLead({ ...lead, status });
        showToast(`Lead status updated to ${status}.`, 'info');
      }
    },
    [showToast]
  );

  const updateLeadDetails = useCallback(
    (updatedLead: Lead) => {
      storage.updateLead(updatedLead);
      showToast('Lead details and notes saved.', 'success');
    },
    [showToast]
  );

  const deleteLead = useCallback(
    (leadId: string) => {
      storage.deleteLead(leadId);
      showToast('Lead deleted.', 'info');
    },
    [showToast]
  );

  const exportLeadsCSV = useCallback(() => {
    storage.exportLeadsToCSV();
    showToast('Lead records exported to CSV.', 'success');
  }, [showToast]);

  // Car handling
  const handleSaveCar = useCallback(
    (carData: Partial<Car> & { make: string; model: string; year: number }) => {
      const saved = storage.saveCar(carData);
      showToast(`${saved.make} ${saved.model} saved successfully!`, 'success');
      return saved;
    },
    [showToast]
  );

  const handleDeleteCar = useCallback(
    (carId: string) => {
      storage.deleteCar(carId);
      showToast('Vehicle removed from fleet.', 'info');
    },
    [showToast]
  );

  // Blog post handling
  const handleSaveBlogPost = useCallback(
    (postData: Partial<BlogPost> & { title: string; content: string }) => {
      const saved = storage.saveBlogPost(postData);
      showToast(postData.id ? 'Blog article and SEO settings updated!' : 'New blog article published successfully!', 'success');
      return saved;
    },
    [showToast]
  );

  const handleDeleteBlogPost = useCallback(
    (postId: string) => {
      storage.deleteBlogPost(postId);
      if (selectedBlogPost?.id === postId) {
        setSelectedBlogPost(null);
      }
      showToast('Article deleted successfully.', 'info');
    },
    [selectedBlogPost, showToast]
  );

  // Settings handling
  const handleUpdateSettings = useCallback(
    (newSettings: WebsiteSettings) => {
      storage.saveSettings(newSettings);
      showToast('Website and business settings updated successfully!', 'success');
    },
    [showToast]
  );

  const handleResetSettings = useCallback(() => {
    storage.resetSettingsToDefault();
    showToast('Settings reset to defaults.', 'info');
  }, [showToast]);

  // Admin auth
  const handleLoginAdmin = useCallback(
    (email: string, pass: string) => {
      const res = storage.loginAdmin(email, pass);
      if (res.success) {
        showToast('Welcome back, Fleet Administrator.', 'success');
      } else {
        showToast(res.message || 'Login failed.', 'error');
      }
      return res;
    },
    [showToast]
  );

  const handleLogoutAdmin = useCallback(() => {
    storage.logoutAdmin();
    setHasSecretAdminAccess(false);
    showToast('Administrator session ended.', 'info');
    setCurrentViewInternal('home');
  }, [showToast]);

  const handleChangePassword = useCallback(
    (oldP: string, newP: string) => {
      const res = storage.changePassword(oldP, newP);
      if (res.success) {
        showToast('Admin password changed successfully.', 'success');
      } else {
        showToast(res.message || 'Failed to update password.', 'error');
      }
      return res;
    },
    [showToast]
  );

  const publicCars = cars
    .filter((c) => c.status === 'Active' || c.status === 'Unavailable')
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const featuredCars = publicCars
    .filter((c) => c.featured && c.status === 'Active')
    .slice(0, 4);

  const activePublicCars = publicCars.filter((c) => c.status === 'Active');
  const hotTaggedCars = activePublicCars.filter((c) => c.isHot);
  const hotCars = (
    hotTaggedCars.length >= 4
      ? hotTaggedCars
      : [
          ...hotTaggedCars,
          ...activePublicCars.filter((c) => !hotTaggedCars.some((h) => h.id === c.id)),
        ]
  ).slice(0, 4);

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedCarForDetails,
        setSelectedCarForDetails,
        openBookingForCar,
        selectedBlogPost,
        setSelectedBlogPost,
        blogPosts,
        testimonials,
        cars,
        publicCars,
        featuredCars,
        hotCars,
        leads,
        settings,
        isAdminLoggedIn,
        adminUser,
        hasSecretAdminAccess,
        getSecretAdminUrl,
        loginAdmin: handleLoginAdmin,
        logoutAdmin: handleLogoutAdmin,
        changePassword: handleChangePassword,
        submitLead,
        updateLeadStatus,
        updateLeadDetails,
        deleteLead,
        exportLeadsCSV,
        saveCar: handleSaveCar,
        deleteCar: handleDeleteCar,
        saveBlogPost: handleSaveBlogPost,
        deleteBlogPost: handleDeleteBlogPost,
        updateSettings: handleUpdateSettings,
        resetSettings: handleResetSettings,
        toast,
        showToast,
        openPolicyModal,
        setOpenPolicyModal,
        formatCurrency,
        getCarById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
