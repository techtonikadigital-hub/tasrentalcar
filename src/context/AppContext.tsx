import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Car, Lead, WebsiteSettings, AdminUser, LeadStatus, BlogPost, Testimonial } from '../types';
import { storage } from '../services/storage';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type AppView = 'home' | 'cars' | 'about' | 'faq' | 'blog' | 'contact' | 'admin';

export const getViewFromUrl = (): AppView => {
  if (typeof window === 'undefined') return 'home';

  // 1. Pathname check (e.g. /cars, /about, /faq, /blog, /contact, /admin)
  const pathname = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, '');
  if (pathname === 'cars' || pathname === 'fleet') return 'cars';
  if (pathname === 'about' || pathname === 'about-us') return 'about';
  if (pathname === 'faq' || pathname === 'faqs') return 'faq';
  if (pathname === 'blog' || pathname === 'journal') return 'blog';
  if (pathname === 'contact' || pathname === 'contact-us') return 'contact';
  if (pathname === 'admin' || pathname === 'dashboard') return 'admin';

  // 2. Hash check (e.g. #/cars, #cars, #faq)
  const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '');
  if (hash === 'cars' || hash === 'fleet') return 'cars';
  if (hash === 'about') return 'about';
  if (hash === 'faq' || hash === 'faqs') return 'faq';
  if (hash === 'blog' || hash === 'journal') return 'blog';
  if (hash === 'contact') return 'contact';
  if (hash === 'admin' || hash === 'secure-admin') return 'admin';

  // 3. Query params check (e.g. ?page=cars, ?page=faq)
  const params = new URLSearchParams(window.location.search);
  const pageParam = params.get('page') || params.get('view');
  if (pageParam === 'cars') return 'cars';
  if (pageParam === 'about') return 'about';
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

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentViewInternal] = useState<AppView>(() => getViewFromUrl());
  const [selectedCarForDetails, setSelectedCarForDetails] = useState<Car | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [openPolicyModal, setOpenPolicyModal] = useState<'privacy' | 'terms' | null>(null);

  const [cars, setCars] = useState<Car[]>([]);
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

  // Sync URL routing and check admin access on mount, popstate and hashchange
  useEffect(() => {
    const handleUrlRouteSync = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const secretParam = params.get('admin_access') || params.get('admin_key') || params.get('portal');
      const hash = window.location.hash;
      const currentSettings = storage.getSettings();
      const expectedKey = currentSettings.secretAdminKey || 'las-hq-secure-key-928';

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
        const targetPath = view === 'home' ? '/' : `/${view}`;
        if (window.location.pathname !== targetPath) {
          window.history.pushState({ view }, '', targetPath);
        }
      }
    },
    []
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

  const openBookingForCar = useCallback((car: Car | null) => {
    setSelectedCarForDetails(car);
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
