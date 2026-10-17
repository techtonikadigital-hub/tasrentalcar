import { Car, Lead, WebsiteSettings, AdminUser, BlogPost, Testimonial } from '../types';
import { VAN_IMAGES } from '../assets/images';

export const INITIAL_CARS: Car[] = [
  {
    id: 'car-hiace-12-seater',
    make: 'Toyota',
    model: 'HiAce 12-Seater Auto',
    year: 2024,
    category: 'Minibus',
    pricePerDay: 200,
    pricePerWeek: 850,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    seats: 12,
    doors: 4,
    mainImage: VAN_IMAGES.hiace12,
    gallery: [
      VAN_IMAGES.hiace12,
      VAN_IMAGES.fleetShowcase,
      VAN_IMAGES.luxuryShowcase,
      VAN_IMAGES.cargoVan,
    ],
    status: 'Active',
    featured: true,
    isHot: true,
    displayOrder: 1,
    shortDescription: "Australia's favourite 12-seater passenger van. Drive on a standard Australian car licence (Class C). Dual ice-cold air con and heaps of luggage room for tours, clubs, and group road trips.",
    features: [
      'Standard Car Licence (Class C)',
      '12 Comfortable Reclining Seats',
      'Dual Front & Rear Air-Con',
      'Reversing Camera & Parking Sensors',
      'Heaps of Luggage Room',
      'Bluetooth & USB Charging Ports'
    ],
    rentalTerms: 'Drive on an unrestricted Australian driver licence (Class C) or valid international licence. Minimum age 21.',
    mileageLimit: '250 km / day included (30c/km thereafter, unlimited km options available)',
    securityDeposit: 500,
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'car-carnival-2024-sli',
    make: 'Kia',
    model: 'Carnival 2024 SLI 8 Seat Auto (Luxury)',
    year: 2024,
    category: 'People Mover',
    pricePerDay: 150,
    pricePerWeek: 850,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    seats: 8,
    doors: 5,
    mainImage: VAN_IMAGES.carnival,
    gallery: [
      VAN_IMAGES.carnival,
      VAN_IMAGES.luxuryShowcase,
      VAN_IMAGES.estima,
      VAN_IMAGES.fleetShowcase,
    ],
    status: 'Active',
    featured: true,
    isHot: true,
    displayOrder: 2,
    shortDescription: 'The latest 2024 luxury 8-seater people mover. Premium leather trim, power dual sliding doors, intelligent safety suite, Apple CarPlay, and a massive boot for family road trips.',
    features: [
      '8 Full Adult Seats with Leather Trim',
      'Dual Electric Sliding Doors',
      'Apple CarPlay & Android Auto',
      'Tri-Zone Climate Air-Con',
      'Adaptive Radar Cruise Control',
      'ISOFIX Child Seat Anchors'
    ],
    rentalTerms: 'Standard Australian car licence or international licence. Minimum age 21.',
    mileageLimit: '300 km / day included (25c/km thereafter)',
    securityDeposit: 400,
    createdAt: '2026-01-12T08:00:00Z',
  },
  {
    id: 'car-carnival-2023-sli',
    make: 'Kia',
    model: 'Carnival 2023 SLI 8 Seat Auto (Luxury)',
    year: 2023,
    category: 'People Mover',
    pricePerDay: 140,
    pricePerWeek: 750,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    seats: 8,
    doors: 5,
    mainImage: VAN_IMAGES.carnival,
    gallery: [
      VAN_IMAGES.carnival,
      VAN_IMAGES.luxuryShowcase,
      VAN_IMAGES.estima,
      VAN_IMAGES.fleetShowcase,
    ],
    status: 'Active',
    featured: true,
    isHot: true,
    displayOrder: 3,
    shortDescription: 'Luxury 8-seater people mover with top comfort. Smooth automatic transmission, rear climate vents, whisper-quiet highway ride, and generous boot space for holidays.',
    features: [
      '8 Passenger Seating Layout',
      'Power Tailgate & Sliding Doors',
      'Surround Camera & Sensors',
      'Economical Turbo Diesel',
      'Rear Climate Air Controls',
      'Keyless Smart Entry & Start'
    ],
    rentalTerms: 'Standard Australian car licence required. Minimum age 21.',
    mileageLimit: '300 km / day included',
    securityDeposit: 400,
    createdAt: '2026-01-14T08:00:00Z',
  },
  {
    id: 'car-carnival-2023-si',
    make: 'Kia',
    model: 'Carnival 2023 SI 8 Seat Auto',
    year: 2023,
    category: 'People Mover',
    pricePerDay: 130,
    pricePerWeek: 650,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    seats: 8,
    doors: 5,
    mainImage: VAN_IMAGES.carnival,
    gallery: [
      VAN_IMAGES.carnival,
      VAN_IMAGES.estima,
      VAN_IMAGES.fleetShowcase,
      VAN_IMAGES.luxuryShowcase,
    ],
    status: 'Active',
    featured: true,
    isHot: true,
    displayOrder: 4,
    shortDescription: 'Spacious and reliable 8-seater Carnival SI. Room for the whole crew with fold-flat rear seats, great fuel economy, and effortless highway cruising.',
    features: [
      '8 Full Adult Seats',
      'Fold-Flat Rear Third Row',
      'Touchscreen Infotainment',
      'Reversing Camera & Sensors',
      'USB Ports for All Rows',
      'Smooth Automatic Driving'
    ],
    rentalTerms: 'Standard Australian driver licence (Class C).',
    mileageLimit: '300 km / day included',
    securityDeposit: 400,
    createdAt: '2026-01-16T08:00:00Z',
  },
  {
    id: 'car-hiace-1-5-ton',
    make: 'Toyota',
    model: 'HiAce 1.5 Tons Diesel Auto (2021–22)',
    year: 2022,
    category: 'Van',
    pricePerDay: 120,
    pricePerWeek: 550,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    seats: 3,
    doors: 5,
    mainImage: VAN_IMAGES.cargoVan,
    gallery: [
      VAN_IMAGES.cargoVan,
      VAN_IMAGES.renaultMaster,
      VAN_IMAGES.fleetShowcase,
      VAN_IMAGES.hiace12,
    ],
    status: 'Active',
    featured: true,
    isHot: false,
    displayOrder: 5,
    shortDescription: 'Heavy-duty 1.5 tonne turbo-diesel automatic van. Dual side sliding doors, large rear cargo bay with tie-down points. Ready for courier, moving, and trade contracts.',
    features: [
      '1.5 Tonne Payload Capacity',
      'Dual Side Sliding Loading Doors',
      'Reliable Turbo Diesel Engine',
      'Reverse Camera & Parking Sensors',
      'Spacious Cargo Flooring & Tie-Downs',
      'Standard Car Licence Approved'
    ],
    rentalTerms: 'Standard Australian driver licence (Class C). Commercial & personal hire accepted.',
    mileageLimit: '250 km / day included (unlimited packages available)',
    securityDeposit: 500,
    createdAt: '2026-01-18T08:00:00Z',
  },
  {
    id: 'car-renault-master-2-ton',
    make: 'Renault',
    model: 'Renault Master Two Ton Auto',
    year: 2023,
    category: 'Van',
    pricePerDay: 120,
    pricePerWeek: 550,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    seats: 3,
    doors: 5,
    mainImage: VAN_IMAGES.renaultMaster,
    gallery: [
      VAN_IMAGES.renaultMaster,
      VAN_IMAGES.cargoVan,
      VAN_IMAGES.fleetShowcase,
      VAN_IMAGES.hiace12,
    ],
    status: 'Active',
    featured: true,
    isHot: false,
    displayOrder: 6,
    shortDescription: 'Massive 2-tonne cargo capacity high-roof automatic van. Walk-in standing height inside cargo bay, heavy-duty cargo protection, and smooth automatic transmission.',
    features: [
      'Huge 2-Tonne Carrying Capacity',
      'High Roof Walk-In Cargo Height',
      'Heavy Duty Cargo Tie-Down Points',
      'Cruise Control & Reversing Camera',
      'Wide Opening Rear Barn Doors',
      'Standard Car Licence Driven'
    ],
    rentalTerms: 'Standard Australian car licence (Class C). Minimum age 21.',
    mileageLimit: '250 km / day included',
    securityDeposit: 500,
    createdAt: '2026-01-20T08:00:00Z',
  },
  {
    id: 'car-hiace-1-ton-diesel',
    make: 'Toyota',
    model: 'HiAce One Ton Diesel Auto (2021–23)',
    year: 2023,
    category: 'Van',
    pricePerDay: 110,
    pricePerWeek: 450,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    seats: 2,
    doors: 5,
    mainImage: VAN_IMAGES.cargoVan,
    gallery: [
      VAN_IMAGES.cargoVan,
      VAN_IMAGES.fleetShowcase,
      VAN_IMAGES.hiace12,
      VAN_IMAGES.renaultMaster,
    ],
    status: 'Active',
    featured: false,
    isHot: false,
    displayOrder: 7,
    shortDescription: 'Dependable Toyota HiAce 1 ton diesel automatic van. Ideal for deliveries, trades, or weekend moving. Air-con, blind spot assist, and smooth highway driving.',
    features: [
      '1 Tonne Payload Capacity',
      'Fuel-Efficient Turbo Diesel',
      'Automatic Transmission',
      'Blind Spot Monitor & Lane Departure',
      'Apple CarPlay / Android Auto',
      'Rear Reversing Camera'
    ],
    rentalTerms: 'Standard Australian car licence required.',
    mileageLimit: '250 km / day included',
    securityDeposit: 400,
    createdAt: '2026-01-22T08:00:00Z',
  },
  {
    id: 'car-toyota-estima-8',
    make: 'Toyota',
    model: 'Estima (Old) 7/8 Seats Auto',
    year: 2018,
    category: 'People Mover',
    pricePerDay: 100,
    pricePerWeek: 400,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 8,
    doors: 5,
    mainImage: VAN_IMAGES.estima,
    gallery: [
      VAN_IMAGES.estima,
      VAN_IMAGES.carnival,
      VAN_IMAGES.luxuryShowcase,
      VAN_IMAGES.fleetShowcase,
    ],
    status: 'Active',
    featured: false,
    isHot: false,
    displayOrder: 8,
    shortDescription: 'Affordable and trusted 7/8-seater people mover. Dual sliding doors, cold dual air conditioning, plush seating, and unbeatable value for families and airport trips.',
    features: [
      '7/8 Seater Flexible Cabin',
      'Dual Sliding Passenger Doors',
      'Ice Cold Front & Rear Air-Con',
      'Fold-Away Rear Seats for Bags',
      'Easy to Drive & Park in City Lots',
      'Super Economical Petrol Engine'
    ],
    rentalTerms: 'Standard Australian car licence or international licence.',
    mileageLimit: '300 km / day included',
    securityDeposit: 400,
    createdAt: '2026-01-24T08:00:00Z',
  },
  {
    id: 'car-hiace-1-ton-value',
    make: 'Toyota',
    model: 'HiAce 1 Ton Auto (Old / Classic)',
    year: 2019,
    category: 'Van',
    pricePerDay: 100,
    pricePerWeek: 400,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 3,
    doors: 5,
    mainImage: VAN_IMAGES.cargoVan,
    gallery: [
      VAN_IMAGES.cargoVan,
      VAN_IMAGES.fleetShowcase,
      VAN_IMAGES.hiace12,
      VAN_IMAGES.renaultMaster,
    ],
    status: 'Active',
    featured: false,
    isHot: false,
    displayOrder: 9,
    shortDescription: 'Budget-friendly 1 ton automatic van. Bulletproof Toyota reliability, cargo barrier, cold air conditioning, and affordable day or weekly rental rates.',
    features: [
      '1 Tonne Carrying Capacity',
      'Heavy Duty Cargo Barrier',
      'Smooth Automatic Transmission',
      'Cold Air Conditioning',
      'Easy Loading Sliding Doors',
      'Cost-Effective Long Term Rate'
    ],
    rentalTerms: 'Standard Australian car licence (Class C).',
    mileageLimit: '250 km / day included',
    securityDeposit: 400,
    createdAt: '2026-01-25T08:00:00Z',
  },
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    customerName: 'Shane Miller',
    phoneNumber: '+61 412 888 123',
    email: 'shane.miller@outlook.com.au',
    requestedCarId: 'car-hiace-12-seater',
    requestedCarName: 'Toyota HiAce 12-Seater Auto',
    requestedCarImage: VAN_IMAGES.hiace12,
    pickupDate: '2026-11-01',
    returnDate: '2026-11-05',
    pickupTime: '09:00 AM',
    customerMessage: 'Need a 12-seater for our cricket club road trip to Geelong. Can we confirm pick-up time?',
    leadSource: 'Hero Enquiry',
    submissionDate: '2026-10-14T02:15:00Z',
    status: 'New',
    internalNotes: 'Cricket club group hire. Standard licence checked.',
    estimatedTotal: 800,
  },
  {
    id: 'lead-2',
    customerName: 'Sarah Jenkins',
    phoneNumber: '+61 423 555 789',
    email: 'sjenkins@gmail.com',
    requestedCarId: 'car-carnival-2024-sli',
    requestedCarName: 'Kia Carnival 2024 SLI 8 Seat Auto (Luxury)',
    requestedCarImage: VAN_IMAGES.carnival,
    pickupDate: '2026-11-10',
    returnDate: '2026-11-17',
    pickupTime: '10:30 AM',
    customerMessage: 'Hiring for a family holiday along the coast. Do you provide baby booster seats?',
    leadSource: 'Car Details',
    submissionDate: '2026-10-13T14:40:00Z',
    status: 'Contacted',
    internalNotes: 'Followed up via WhatsApp. Confirmed 2 free booster seats.',
    estimatedTotal: 1085,
  },
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Shane & Darren',
    role: 'Cricket Club Organisers',
    company: 'Geelong Cricket Club',
    location: 'Melbourne, VIC',
    rating: 5,
    content: 'Hired the 12-seater Toyota HiAce for our weekend footy and cricket trip down the coast. Fits 12 blokes easily plus all our gear in the back. Drove on a regular car licence with no hassle at all. Top notch service, fair dinkum rates!',
    vehicleRented: 'Toyota HiAce Commuter 12-Seater',
    date: 'October 2026',
  },
  {
    id: 'test-2',
    name: 'Dave & Rebecca Paterson',
    role: 'Family Holiday',
    company: 'Private Hire',
    location: 'Sydney to Gold Coast',
    rating: 5,
    content: 'Booked the Kia Carnival 7-seater for our two-week school holiday trip. Absolutely spotless condition, super comfortable on long highway stretches, and our kids loved having their own USB ports and air-con vents.',
    vehicleRented: 'Kia Carnival Platinum 7-Seater',
    date: 'September 2026',
  },
  {
    id: 'test-3',
    name: 'Liam & Chloe O’Connor',
    role: 'Wedding Shuttle Organiser',
    company: 'Private Hire',
    location: 'Yarra Valley, VIC',
    rating: 5,
    content: 'We needed a clean 12-seater van to shuttle wedding guests from the airport to the venue. Pick up took literally 5 minutes, bond was refunded the day we returned it. No hidden charges whatsoever.',
    vehicleRented: 'Toyota HiAce Grand Cabin 12-Seater',
    date: 'September 2026',
  },
  {
    id: 'test-4',
    name: 'Michael Tran',
    role: 'Director',
    company: 'Tran Logistics & Events',
    location: 'Brisbane, QLD',
    rating: 5,
    content: 'Hired the 8-seater Carnival for our interstate team conference. Drives smoothly just like a car, parks easily, and fuel economy on the diesel was fantastic. We will be using them every time we need extra passenger seats.',
    vehicleRented: 'Kia Carnival 8-Seater',
    date: 'August 2026',
  },
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'can-you-drive-12-seater-van-on-car-licence-australia',
    title: 'Can You Drive a 12-Seater Van on a Normal Car Licence in Australia?',
    excerpt: 'The short answer is yes! Here is everything you need to know about licence rules, passenger limits, and Aussie road rules for 12-seater vans.',
    content: `### Good News: Yes, You Can Drive a 12-Seater on a Normal Licence!

One of the most common questions Aussie drivers ask is whether you need a special light rigid (LR) bus licence to drive a 12-seater passenger van like the Toyota HiAce.

In all Australian states (VIC, NSW, QLD, WA, SA, TAS, ACT, and NT), **any driver with a standard Class C unrestricted car licence can legally drive a vehicle that seats up to 12 people (including the driver)**.

### Key Things to Remember
1. **Seatbelt Laws**: Every single passenger must have their own designated seat and wear a seatbelt at all times.
2. **Luggage Space**: With 12 passengers on board, pack soft bags or make use of the generous rear boot area in our HiAce Commuters.
3. **Height Clearance**: Our high-roof HiAce vans stand around 2.28m tall. Always check clearance heights before entering underground shopping centre car parks.
4. **Child Seats**: If you are travelling with young kids, check that the vehicle has approved Australian child restraint anchor points.

Got any questions before heading out? Give our team a buzz or drop us a message on WhatsApp!`,
    category: 'Driving Tips',
    author: 'Aussie Van Crew',
    authorRole: 'Fleet Team',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    readTime: '3 min read',
    publishedDate: 'October 10, 2026',
    coverImage: VAN_IMAGES.hiace12,
    featuredCarId: 'car-hiace-12-seater',
  },
  {
    id: 'post-2',
    slug: 'kia-carnival-vs-toyota-hiace-which-van-is-right-for-you',
    title: 'Kia Carnival vs Toyota HiAce: Which Passenger Van Fits Your Trip?',
    excerpt: 'Comparing 7-seater people movers with 12-seater commuter vans so you get the best ride for your family holiday, work crew, or group weekend.',
    content: `### Choosing Between a 7-Seater and a 12-Seater

Planning a group getaway across Australia? Choosing the right people mover makes all the difference for comfort and budget.

### When to Pick the Kia Carnival (7 or 8 Seats)
- **Family Road Trips**: If you have 4 to 7 people with luggage, prams, and eskies.
- **Car-Like Driving**: The Carnival drives and parks just like a normal SUV, fitting into regular suburban garages and underground car parks easily.
- **Top Tech**: Electric sliding doors, Apple CarPlay, and rear air-con controls for the kids.

### When to Pick the Toyota HiAce (12 Seats)
- **Bigger Groups**: Footy teams, wedding guests, church groups, and extended family.
- **Keeping Everyone in One Vehicle**: Saves paying double for petrol, tolls, and parking tickets by taking one van instead of two cars.
- **Plenty of Legroom**: High ceilings and wide aisles so adults can walk through and stretch their legs.`,
    category: 'Van Guide',
    author: 'Aussie Van Crew',
    authorRole: 'Fleet Team',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    readTime: '4 min read',
    publishedDate: 'September 28, 2026',
    coverImage: VAN_IMAGES.carnival,
    featuredCarId: 'car-carnival-2024-sli',
  },
];

export const INITIAL_ADMIN_USER: AdminUser = {
  id: 'admin-1',
  name: 'TAS Fleet Admin',
  email: 'admin@tascarrental.com.au',
  role: 'Administrator',
};

export const INITIAL_SETTINGS: WebsiteSettings = {
  websiteName: 'TAS Car Rental',
  logoText: 'TAS',
  logoSubtitle: 'CAR RENTAL',
  logoImage: '',
  primaryYellowColor: '#FFC928',
  secondaryBlackColor: '#111111',

  businessName: 'TAS Car Rental',
  phoneNumber: '+61 413 993 439',
  whatsAppNumber: '+61413993439',
  emailAddress: 'bookings@tascarrental.com.au',
  physicalAddress: '176 Milperra Rd, Revesby NSW 2212, Australia',
  googleMapsEmbedUrl: 'https://maps.google.com/maps?q=176+Milperra+Rd,+Revesby+NSW+2212,+Australia&t=&z=15&ie=UTF8&iwloc=&output=embed',
  businessHours: 'Monday – Sunday: 7:30 AM – 7:00 PM (Open 7 Days)',
  lastUpdated: '2026-10-15T04:15:00Z',
  socialLinks: {
    instagram: 'https://instagram.com/tascarrental',
    facebook: 'https://facebook.com/tascarrental',
    linkedin: 'https://linkedin.com/company/tascarrental',
    twitter: 'https://twitter.com/tascarrental',
  },

  heroHeadline: 'Easy 7 & 12 Seater Passenger Van & Car Hire.',
  heroSupportingText: 'Need a passenger van for your family holiday, road trip, or group event? Hire reliable Toyota HiAce 12-seaters and Kia Carnival 7-seaters from TAS Car Rental in Revesby NSW. Drive on a normal car licence with fair, honest Aussie rates.',
  heroImageUrl: VAN_IMAGES.fleetShowcase,
  fleetBannerImageUrl: VAN_IMAGES.hiace12,
  footerDescription: 'Friendly, reliable 7-seater and 12-seater passenger van and car hire in Sydney. Quality Toyota HiAce and Kia Carnival people movers with no hidden fees and convenient pickup at 176 Milperra Rd, Revesby NSW.',
  currency: '$',
  showPricing: true,
  seoTitle: 'TAS Car Rental | 7 & 12 Seater Van & Car Hire Revesby NSW',
  seoMetaDescription: 'TAS Car Rental at 176 Milperra Rd, Revesby NSW 2212. Quality 7 & 12 seater Toyota HiAce and Kia Carnival passenger van hire. Call +61 413 993 439.',
  contactNotificationEmail: 'bookings@tascarrental.com.au',
  whatsAppGreeting: 'G’day! I would like to check availability with TAS Car Rental for hiring a vehicle.',

  secretAdminKey: 'admin',

  privacyPolicy: `## 1. Information We Collect
We collect the necessary details to organise your van hire, including:
- Your name, phone number, and email address
- Driver's licence details and ID when collecting the vehicle
- Hire dates and passenger requirements

## 2. How We Use It
Your details are only used to:
- Confirm your van booking and availability
- Send you hire agreements and receipts
- Comply with Australian vehicle insurance and road safety laws

We will never sell or share your personal details with third-party marketers.`,

  termsAndConditions: `## 1. Driver Requirements
- Drivers must hold a valid, unrestricted Australian driver licence (Class C car licence) or approved international driving permit.
- Standard minimum driving age is 21 years old.
- A credit card or debit card in the main driver's name is required for the refundable security bond upon pickup.

## 2. Vehicle Collection & Return
- Vans are collected and returned to our depot at 176 Milperra Rd, Revesby NSW 2212, Australia (or your agreed delivery location).
- Return the van with the same level of fuel as when collected to avoid refuelling charges.

## 3. Included Kilometres & Cleanliness
- Standard rentals include generous daily kilometre allowances (250 km/day for 12-seaters, 300 km/day for 7-seaters).
- Vans are provided thoroughly clean and sanitised. Please return them reasonably tidy.`,
};
