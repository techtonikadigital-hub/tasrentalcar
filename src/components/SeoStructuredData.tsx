import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const SeoStructuredData: React.FC = () => {
  const { settings, currentView, selectedBlogPost, publicCars } = useApp();

  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Remove any previous schema script
    const existingScript = document.getElementById('las-schema-jsonld') || document.getElementById('veloce-schema-jsonld');
    if (existingScript) {
      existingScript.remove();
    }

    const schemas: any[] = [];

    // 1. AutoRental / LocalBusiness Schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'AutoRental',
      '@id': `${window.location.origin}#business`,
      name: settings.businessName || 'TAS Car Rental',
      description: settings.seoMetaDescription || '7 and 12 seater passenger van hire in Revesby NSW Australia.',
      url: window.location.origin,
      telephone: settings.phoneNumber || '+61 413 993 439',
      email: settings.emailAddress || 'bookings@tascarrental.com.au',
      priceRange: '$$',
      image: settings.heroImageUrl,
      address: {
        '@type': 'PostalAddress',
        streetAddress: '176 Milperra Rd',
        addressLocality: 'Revesby',
        addressRegion: 'NSW',
        postalCode: '2212',
        addressCountry: 'AU',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -33.9382,
        longitude: 150.9981,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '07:30',
          closes: '19:00',
        },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'TAS Car Rental Fleet',
        itemListElement: publicCars.slice(0, 8).map((car, index) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Car',
            name: `${car.make} ${car.model}`,
            modelDate: car.year.toString(),
            vehicleConfiguration: `${car.category} - ${car.transmission}`,
            image: car.mainImage,
          },
          price: car.pricePerDay.toString(),
          priceCurrency: 'USD',
          availability: car.status === 'Active' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          position: index + 1,
        })),
      },
    });

    // 2. Breadcrumbs Schema
    const breadcrumbItems = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: window.location.origin,
      },
    ];

    if (currentView === 'cars') {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: 'Our Luxury Fleet',
        item: `${window.location.origin}#cars`,
      });
    } else if (currentView === 'about') {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: 'About Showroom',
        item: `${window.location.origin}#about`,
      });
    } else if (currentView === 'blog') {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: 'Automotive Journal',
        item: `${window.location.origin}#blog`,
      });
      if (selectedBlogPost) {
        breadcrumbItems.push({
          '@type': 'ListItem',
          position: 3,
          name: selectedBlogPost.title,
          item: `${window.location.origin}#blog/${selectedBlogPost.slug}`,
        });
      }
    } else if (currentView === 'contact') {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: 'Showroom Coordinates',
        item: `${window.location.origin}#contact`,
      });
    }

    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems,
    });

    // 3. BlogPosting Schema if reading an article
    if (currentView === 'blog' && selectedBlogPost) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: selectedBlogPost.metaTitle || selectedBlogPost.title,
        description: selectedBlogPost.metaDescription || selectedBlogPost.excerpt,
        image: selectedBlogPost.ogImage || selectedBlogPost.coverImage,
        datePublished: selectedBlogPost.publishedDate || '2026-10-01',
        keywords: selectedBlogPost.keywords || undefined,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${window.location.origin}#blog/${selectedBlogPost.slug}`,
        },
        author: {
          '@type': 'Person',
          name: selectedBlogPost.author,
          jobTitle: selectedBlogPost.authorRole,
        },
        publisher: {
          '@type': 'Organization',
          name: settings.businessName,
          logo: {
            '@type': 'ImageObject',
            url: settings.heroImageUrl,
          },
        },
      });
    }

    // Inject script tag
    const script = document.createElement('script');
    script.id = 'las-schema-jsonld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemas);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('las-schema-jsonld');
      if (el) el.remove();
    };
  }, [currentView, selectedBlogPost, settings, publicCars]);

  return null;
};
