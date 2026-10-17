import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminDashboard } from './AdminDashboard';
import { AdminCarManagement } from './AdminCarManagement';
import { AdminLeadManagement } from './AdminLeadManagement';
import { AdminBlogManagement } from './AdminBlogManagement';
import { AdminSettings } from './AdminSettings';
import { AdminChangePassword } from './AdminChangePassword';
import {
  LayoutDashboard,
  Car as CarIcon,
  Users,
  BookOpen,
  Settings as SettingsIcon,
  KeyRound,
  ExternalLink,
  LogOut,
  Menu,
  X,
  MapPin,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const {
    leads,
    blogPosts,
    settings,
    adminUser,
    logoutAdmin,
    setCurrentView,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'cars' | 'leads' | 'blog' | 'settings' | 'password'>('dashboard');
  const [selectedLeadIdForDetail, setSelectedLeadIdForDetail] = useState<string | null>(null);
  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const newLeadsCount = leads.filter((l) => l.status === 'New').length;

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLeadFromDashboard = (leadId: string) => {
    setSelectedLeadIdForDetail(leadId);
    setActiveTab('leads');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cars', label: 'Manage Cars', icon: CarIcon },
    {
      id: 'leads',
      label: 'Manage Leads',
      icon: Users,
      badge: newLeadsCount > 0 ? `${newLeadsCount} New` : undefined,
    },
    {
      id: 'blog',
      label: 'Manage Blog & SEO',
      icon: BookOpen,
      badge: blogPosts.length > 0 ? `${blogPosts.length}` : undefined,
    },
    { id: 'settings', label: 'Website Settings', icon: SettingsIcon },
    { id: 'password', label: 'Change Password', icon: KeyRound },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-[#111111] text-white p-4 flex items-center justify-between border-b border-neutral-800 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FFC928] text-black font-black text-sm flex items-center justify-center">
            {settings.logoText ? settings.logoText.charAt(0) : 'L'}
          </div>
          <div>
            <span className="font-black text-sm block font-heading">{settings.logoText || 'LAS'} Admin</span>
            <span className="text-[10px] text-neutral-400 block truncate max-w-[160px]">{settings.physicalAddress}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('home')}
            className="p-2 text-xs font-bold text-neutral-300 hover:text-white"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-lg bg-neutral-800 text-white"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar (Desktop & Mobile) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#111111] text-white flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0 border-r border-neutral-800 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand header in sidebar */}
          <div className="p-6 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFC928] text-black font-black text-xl flex items-center justify-center shadow-sm">
                {settings.logoText ? settings.logoText.charAt(0) : 'L'}
              </div>
              <div className="overflow-hidden">
                <span className="block text-lg font-black tracking-tight text-white font-heading truncate">
                  {settings.logoText || 'LAS'}
                </span>
                <span className="block text-[10px] tracking-widest font-semibold uppercase text-neutral-400">
                  ADMIN PORTAL
                </span>
              </div>
            </div>

            {/* Single Showroom Indicator */}
            <div className="mt-4 p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400">
              <div className="flex items-center gap-1.5 text-neutral-300 font-semibold mb-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#FFC928]" />
                <span className="truncate">Single Showroom Hub</span>
              </div>
              <p className="truncate text-[10px] text-neutral-500">{settings.physicalAddress}</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FFC928] text-black shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-neutral-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                        isActive ? 'bg-black text-[#FFC928]' : 'bg-[#FFC928] text-black'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with View Website & Logout */}
        <div className="p-4 border-t border-neutral-800 space-y-2">
          {/* Admin User Profile */}
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-bold text-[#FFC928]">
              {adminUser.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">{adminUser.name}</div>
              <div className="text-[10px] text-neutral-400 truncate">{adminUser.email}</div>
            </div>
          </div>

          <button
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#FFC928]" />
            <span>View Public Website</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-neutral-400 hover:text-red-400 text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {activeTab === 'dashboard' && (
          <AdminDashboard
            onNavigateTab={handleTabChange}
            onOpenAddCar={() => {
              setActiveTab('cars');
              setIsAddCarModalOpen(true);
            }}
            onSelectLead={handleSelectLeadFromDashboard}
          />
        )}

        {activeTab === 'cars' && (
          <AdminCarManagement
            isAddModalOpenInitially={isAddCarModalOpen}
            onCloseAddModal={() => setIsAddCarModalOpen(false)}
          />
        )}

        {activeTab === 'leads' && (
          <AdminLeadManagement
            initialSelectedLeadId={selectedLeadIdForDetail}
            onClearSelectedLead={() => setSelectedLeadIdForDetail(null)}
          />
        )}

        {activeTab === 'blog' && <AdminBlogManagement />}

        {activeTab === 'settings' && <AdminSettings />}

        {activeTab === 'password' && <AdminChangePassword />}
      </main>

      {/* Backdrop for mobile sidebar */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
        />
      )}
    </div>
  );
};
