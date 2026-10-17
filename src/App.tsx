import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { HotCarsSection } from './components/HotCarsSection';
import { FeaturedCarsSection } from './components/FeaturedCarsSection';
import { WhyChooseUsSection } from './components/WhyChooseUsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { BlogSection } from './components/BlogSection';
import { CtaBanner } from './components/CtaBanner';
import { CarsListingPage } from './components/CarsListingPage';
import { AboutPage } from './components/AboutPage';
import { ServiceAreaPage } from './components/ServiceAreaPage';
import { BlogPage } from './components/BlogPage';
import { ContactPage } from './components/ContactPage';
import { FaqPage } from './components/FaqPage';
import { FaqSection } from './components/FaqSection';
import { FleetShowcaseSection } from './components/FleetShowcaseSection';
import { VehicleDetailsPage } from './components/VehicleDetailsPage';
import { PolicyModal } from './components/PolicyModal';
import { Toast } from './components/Toast';
import { SeoStructuredData } from './components/SeoStructuredData';
import { FloatingActions } from './components/FloatingActions';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';

const MainAppContent: React.FC = () => {
  const {
    currentView,
    isAdminLoggedIn,
    hasSecretAdminAccess,
    selectedCarForDetails,
    setSelectedCarForDetails,
  } = useApp();

  // Admin portal route: renders login if unauthenticated or full admin layout if authenticated
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-[#111111] text-neutral-900 antialiased font-sans">
        <SeoStructuredData />
        {isAdminLoggedIn ? <AdminLayout /> : <AdminLogin />}
        <Toast />
      </div>
    );
  }

  // Public Customer Website
  return (
    <div className="min-h-screen bg-white text-[#111111] flex flex-col font-sans antialiased selection:bg-[#FFC928] selection:text-black">
      {/* Schema.org Structured Data & Dynamic Metatags */}
      <SeoStructuredData />

      <Navbar />

      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroSection />
            <HotCarsSection />
            <FeaturedCarsSection />
            <WhyChooseUsSection />
            <FleetShowcaseSection />
            <TestimonialsSection />
            <FaqSection />
            <BlogSection />
            <CtaBanner />
          </>
        )}

        {currentView === 'cars' && <CarsListingPage />}

        {currentView === 'vehicle-details' && <VehicleDetailsPage />}

        {currentView === 'about' && (
          <>
            <AboutPage />
            <TestimonialsSection />
          </>
        )}

        {currentView === 'service-area' && <ServiceAreaPage />}

        {currentView === 'faq' && <FaqPage />}

        {currentView === 'blog' && <BlogPage />}

        {currentView === 'contact' && <ContactPage />}
      </main>

      <Footer />

      {/* Global Terms & Privacy Policy Modal */}
      <PolicyModal />

      {/* Floating Action Buttons: WhatsApp on Bottom-Left, Book a Car CTA on Bottom-Right */}
      <FloatingActions />

      {/* Real-time Toast Notifications */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
