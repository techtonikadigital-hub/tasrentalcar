export type VehicleCategory = 'Van' | 'People Mover' | 'Minibus' | 'SUV' | 'Sedan' | 'Luxury' | 'Coupe' | 'Convertible';
export type TransmissionType = 'Automatic' | 'Manual';
export type FuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
export type CarStatus = 'Active' | 'Inactive' | 'Unavailable';

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  category: VehicleCategory;
  pricePerDay: number;
  pricePerWeek?: number;
  transmission: TransmissionType;
  fuelType: FuelType;
  seats: number;
  doors: number;
  mainImage: string;
  gallery: string[];
  status: CarStatus;
  featured: boolean;
  isHot?: boolean;
  displayOrder: number;
  shortDescription: string;
  features: string[];
  rentalTerms: string;
  mileageLimit: string;
  securityDeposit: number;
  createdAt: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Follow-up' | 'Converted' | 'Lost';
export type LeadSource = 'Hero Enquiry' | 'Car Details' | 'Contact Page' | 'Direct Quote' | 'WhatsApp' | 'Floating CTA';

export interface Lead {
  id: string;
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
  leadSource: LeadSource;
  submissionDate: string;
  status: LeadStatus;
  internalNotes: string;
  followUpDate?: string;
  estimatedTotal?: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  readTime: string;
  publishedDate: string;
  coverImage: string;
  featuredCarId?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  isPublished?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  rating: number;
  content: string;
  vehicleRented: string;
  date: string;
}

export interface WebsiteSettings {
  // Branding
  websiteName: string;
  logoText: string;
  logoSubtitle: string;
  logoImage?: string;
  primaryYellowColor: string;
  secondaryBlackColor: string;

  // Business Information
  businessName: string;
  phoneNumber: string;
  whatsAppNumber: string;
  emailAddress: string;
  physicalAddress: string;
  googleMapsEmbedUrl: string;
  businessHours: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    linkedin: string;
    twitter: string;
  };

  // Website Configuration
  heroHeadline: string;
  heroSupportingText: string;
  heroImageUrl: string;
  fleetBannerImageUrl: string;
  footerDescription: string;
  currency: string;
  showPricing: boolean;
  seoTitle: string;
  seoMetaDescription: string;
  blogSeoTitle?: string;
  blogSeoMetaDescription?: string;
  blogSeoKeywords?: string;
  contactNotificationEmail: string;
  whatsAppGreeting: string;

  // Security
  secretAdminKey: string;

  // Legal Content
  privacyPolicy: string;
  termsAndConditions: string;

  lastUpdated: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
}
