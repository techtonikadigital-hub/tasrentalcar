import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WebsiteSettings } from '../../types';
import {
  Save,
  RotateCcw,
  Sparkles,
  Palette,
  Building,
  Sliders,
  FileText,
  MapPin,
  Phone,
  Mail,
  Check,
  ShieldCheck,
  KeyRound,
  Copy,
  ExternalLink,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, resetSettings, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'branding' | 'business' | 'config' | 'legal' | 'security'>('branding');

  // Form State
  const [formData, setFormData] = useState<WebsiteSettings>({ ...settings });

  const handleChange = (field: keyof WebsiteSettings, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialChange = (network: keyof WebsiteSettings['socialLinks'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [network]: value,
      },
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  const handleReset = () => {
    if (window.confirm('Reset all website branding and settings back to default values?')) {
      resetSettings();
    }
  };

  const secretAdminUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/?admin_access=${formData.secretAdminKey || 'las-hq-secure-key-928'}`
    : `/?admin_access=${formData.secretAdminKey || 'las-hq-secure-key-928'}`;

  const copySecretUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(secretAdminUrl);
      showToast('Secret Admin URL copied to clipboard!', 'success');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111111] font-heading">
            Website & Showroom Settings
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Dynamic control over branding, showroom contact details, pricing visibility, fleet banners, and private admin URL access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#FFC928] hover:bg-[#E5B21E] text-black text-xs font-bold shadow-sm transition-luxury cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save All Settings</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-neutral-200 gap-2 overflow-x-auto pb-0">
        <button
          onClick={() => setActiveTab('branding')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'branding'
              ? 'border-[#FFC928] text-black font-extrabold'
              : 'border-transparent text-neutral-500 hover:text-black'
          }`}
        >
          <Palette className="w-4 h-4 text-[#FFC928]" />
          <span>Branding & Identity</span>
        </button>

        <button
          onClick={() => setActiveTab('business')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'business'
              ? 'border-[#FFC928] text-black font-extrabold'
              : 'border-transparent text-neutral-500 hover:text-black'
          }`}
        >
          <Building className="w-4 h-4 text-[#FFC928]" />
          <span>Showroom & Contact</span>
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'config'
              ? 'border-[#FFC928] text-black font-extrabold'
              : 'border-transparent text-neutral-500 hover:text-black'
          }`}
        >
          <Sliders className="w-4 h-4 text-[#FFC928]" />
          <span>Website Configuration</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'security'
              ? 'border-[#FFC928] text-black font-extrabold'
              : 'border-transparent text-neutral-500 hover:text-black'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-[#FFC928]" />
          <span>Secret Admin URL</span>
        </button>

        <button
          onClick={() => setActiveTab('legal')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'legal'
              ? 'border-[#FFC928] text-black font-extrabold'
              : 'border-transparent text-neutral-500 hover:text-black'
          }`}
        >
          <FileText className="w-4 h-4 text-[#FFC928]" />
          <span>Terms & Privacy Policies</span>
        </button>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: BRANDING */}
        {activeTab === 'branding' && (
          <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-[#111111] font-heading border-b border-neutral-100 pb-3">
              Brand Identity & Logo Configuration
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">Website Name</label>
                <input
                  type="text"
                  value={formData.websiteName}
                  onChange={(e) => handleChange('websiteName', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">Logo Primary Text</label>
                <input
                  type="text"
                  value={formData.logoText}
                  onChange={(e) => handleChange('logoText', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">Logo Subtitle</label>
                <input
                  type="text"
                  value={formData.logoSubtitle}
                  onChange={(e) => handleChange('logoSubtitle', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">Logo Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.logoImage || ''}
                  onChange={(e) => handleChange('logoImage', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                />
              </div>
            </div>

            {/* Colors */}
            <div className="pt-4 border-t border-neutral-100">
              <span className="text-xs font-bold text-neutral-800 block mb-3">Brand Color Theme</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <input
                    type="color"
                    value={formData.primaryYellowColor}
                    onChange={(e) => handleChange('primaryYellowColor', e.target.value)}
                    className="w-10 h-10 rounded border-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold block text-neutral-800">Primary Accent Yellow</span>
                    <span className="text-[11px] font-mono text-neutral-500">{formData.primaryYellowColor}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <input
                    type="color"
                    value={formData.secondaryBlackColor}
                    onChange={(e) => handleChange('secondaryBlackColor', e.target.value)}
                    className="w-10 h-10 rounded border-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold block text-neutral-800">Secondary Black</span>
                    <span className="text-[11px] font-mono text-neutral-500">{formData.secondaryBlackColor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BUSINESS INFORMATION */}
        {activeTab === 'business' && (
          <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-[#111111] font-heading border-b border-neutral-100 pb-3">
              Single Showroom & Concierge Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">Business Name</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleChange('businessName', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">Direct Phone Number</label>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">WhatsApp Business Number</label>
                <input
                  type="text"
                  value={formData.whatsAppNumber}
                  onChange={(e) => handleChange('whatsAppNumber', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">Official Email Address</label>
                <input
                  type="email"
                  value={formData.emailAddress}
                  onChange={(e) => handleChange('emailAddress', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Physical Showroom Address (Single Location)
                </label>
                <input
                  type="text"
                  value={formData.physicalAddress}
                  onChange={(e) => handleChange('physicalAddress', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Google Maps Embed URL (iframe src)
                </label>
                <input
                  type="text"
                  value={formData.googleMapsEmbedUrl}
                  onChange={(e) => handleChange('googleMapsEmbedUrl', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-neutral-800 mb-1">Showroom Operating Hours</label>
                <input
                  type="text"
                  value={formData.businessHours}
                  onChange={(e) => handleChange('businessHours', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                />
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-4 border-t border-neutral-100">
              <span className="text-xs font-bold text-neutral-800 block mb-3">Social Media URLs</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Instagram URL</label>
                  <input
                    type="url"
                    value={formData.socialLinks?.instagram || ''}
                    onChange={(e) => handleSocialChange('instagram', e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Facebook URL</label>
                  <input
                    type="url"
                    value={formData.socialLinks?.facebook || ''}
                    onChange={(e) => handleSocialChange('facebook', e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={formData.socialLinks?.linkedin || ''}
                    onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Twitter / X URL</label>
                  <input
                    type="url"
                    value={formData.socialLinks?.twitter || ''}
                    onChange={(e) => handleSocialChange('twitter', e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: WEBSITE CONFIGURATION */}
        {activeTab === 'config' && (
          <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-[#111111] font-heading border-b border-neutral-100 pb-3">
              Homepage Content, Pricing & Fleet Banners
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">Homepage Headline</label>
                <input
                  type="text"
                  value={formData.heroHeadline}
                  onChange={(e) => handleChange('heroHeadline', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">Hero Supporting Text</label>
                <textarea
                  rows={2}
                  value={formData.heroSupportingText}
                  onChange={(e) => handleChange('heroSupportingText', e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Hero Section Background Image URL
                </label>
                <input
                  type="url"
                  value={formData.heroImageUrl}
                  onChange={(e) => handleChange('heroImageUrl', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                />
                <p className="text-[10px] text-neutral-500 mt-1">
                  High-resolution cinematic automotive background image displayed across the hero section.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  'Our Luxury Fleet' Section Background Image URL
                </label>
                <input
                  type="url"
                  value={formData.fleetBannerImageUrl || ''}
                  onChange={(e) => handleChange('fleetBannerImageUrl', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                />
                <p className="text-[10px] text-neutral-500 mt-1">
                  High-resolution automotive backdrop displayed on the Our Cars listing page header.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">Footer Description</label>
                <textarea
                  rows={2}
                  value={formData.footerDescription}
                  onChange={(e) => handleChange('footerDescription', e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              {/* Pricing Display Toggle & Currency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">Default Currency Symbol</label>
                  <input
                    type="text"
                    value={formData.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-white border border-neutral-300 text-xs font-bold"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="inline-flex items-center gap-2 text-xs font-bold text-neutral-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showPricing}
                      onChange={(e) => handleChange('showPricing', e.target.checked)}
                      className="rounded accent-[#FFC928] w-4 h-4"
                    />
                    <span>Display Pricing Publicly on Website</span>
                  </label>
                </div>
              </div>

              {/* SEO and Notification Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">SEO Page Title</label>
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => handleChange('seoTitle', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Contact Form Notification Email
                  </label>
                  <input
                    type="email"
                    value={formData.contactNotificationEmail}
                    onChange={(e) => handleChange('contactNotificationEmail', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-800 mb-1">SEO Meta Description</label>
                  <textarea
                    rows={2}
                    value={formData.seoMetaDescription}
                    onChange={(e) => handleChange('seoMetaDescription', e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium"
                  />
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-neutral-200">
                  <span className="text-xs font-black text-neutral-900 block mb-1">
                    Blog & Journal SEO Defaults
                  </span>
                  <p className="text-[11px] text-neutral-500 mb-3">
                    Default search metadata for the public blog index and guide archive.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">Blog SEO Title</label>
                  <input
                    type="text"
                    placeholder="TAS Car Rental Journal | Van Travel & Driving Guides"
                    value={formData.blogSeoTitle || ''}
                    onChange={(e) => handleChange('blogSeoTitle', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">Blog Target Keywords</label>
                  <input
                    type="text"
                    placeholder="12 seater van hire Sydney, passenger van rental"
                    value={formData.blogSeoKeywords || ''}
                    onChange={(e) => handleChange('blogSeoKeywords', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-800 mb-1">Blog SEO Meta Description</label>
                  <textarea
                    rows={2}
                    placeholder="Expert guides on 7 and 12-seater passenger van hire, Australian driver licence rules, and road trip itineraries."
                    value={formData.blogSeoMetaDescription || ''}
                    onChange={(e) => handleChange('blogSeoMetaDescription', e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    WhatsApp Default Greeting
                  </label>
                  <input
                    type="text"
                    value={formData.whatsAppGreeting}
                    onChange={(e) => handleChange('whatsAppGreeting', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SECURITY & SECRET ADMIN URL */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-[#111111] font-heading">
                Secret Admin Access & Portal Security
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Public links and buttons to this administrative panel are hidden from the website. Only administrators visiting with the specific secret URL can open this portal.
              </p>
            </div>

            {/* Secret URL Box */}
            <div className="bg-[#111111] text-white p-5 rounded-2xl border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#FFC928] uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4" />
                  <span>Your Secret Admin URL</span>
                </span>
                <span className="text-[10px] bg-neutral-800 px-2 py-0.5 rounded text-neutral-300">
                  Private Link
                </span>
              </div>

              <div className="flex items-center gap-2 bg-neutral-900 p-2.5 rounded-xl border border-neutral-700">
                <code className="text-xs font-mono text-neutral-200 break-all select-all flex-1">
                  {secretAdminUrl}
                </code>
                <button
                  type="button"
                  onClick={copySecretUrl}
                  className="px-3 py-1.5 rounded-lg bg-[#FFC928] hover:bg-[#E5B21E] text-black font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </button>
              </div>

              <p className="text-[11px] text-neutral-400">
                Bookmark this URL in your browser. Navigating to the site without this secret token keeps the admin portal invisible and protected.
              </p>
            </div>

            {/* Secret Key Customization */}
            <div className="pt-3 border-t border-neutral-100">
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Customize Secret Access Key
              </label>
              <input
                type="text"
                value={formData.secretAdminKey || ''}
                onChange={(e) => handleChange('secretAdminKey', e.target.value.trim().toLowerCase())}
                className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-mono font-medium focus:outline-none focus:border-black focus:bg-white"
                placeholder="e.g. las-hq-secure-key-928"
              />
              <p className="text-[11px] text-neutral-500 mt-1">
                If you change this key and click Save, update your browser bookmark to match the new URL.
              </p>
            </div>
          </div>
        )}

        {/* TAB 5: LEGAL & POLICIES */}
        {activeTab === 'legal' && (
          <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-[#111111] font-heading border-b border-neutral-100 pb-3">
              Rental Terms & Privacy Policy Content
            </h2>
            <p className="text-xs text-neutral-500">
              This text is displayed to customers in the website footer modals and vehicle details pages.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Terms & Conditions (Markdown supported)
                </label>
                <textarea
                  rows={8}
                  value={formData.termsAndConditions}
                  onChange={(e) => handleChange('termsAndConditions', e.target.value)}
                  className="w-full p-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-mono leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Privacy Policy (Markdown supported)
                </label>
                <textarea
                  rows={8}
                  value={formData.privacyPolicy}
                  onChange={(e) => handleChange('privacyPolicy', e.target.value)}
                  className="w-full p-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-mono leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex items-center justify-between">
          <span className="text-xs text-neutral-500">
            Last updated: {new Date(formData.lastUpdated).toLocaleString()}
          </span>

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-[#FFC928] hover:bg-[#E5B21E] text-black text-xs font-bold shadow-sm transition-luxury cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
