import React from 'react';
import { useApp } from '../../context/AppContext';
import { LeadStatus } from '../../types';
import {
  Users,
  Car as CarIcon,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  PlusCircle,
  FileSpreadsheet,
  AlertCircle,
  Phone,
  Mail,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenAddCar: () => void;
  onSelectLead: (leadId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateTab,
  onOpenAddCar,
  onSelectLead,
}) => {
  const { leads, cars, blogPosts, settings, updateLeadStatus, exportLeadsCSV, formatCurrency } = useApp();

  // Metrics calculation
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === 'New').length;
  const contactedLeads = leads.filter((l) => l.status === 'Contacted').length;
  const convertedLeads = leads.filter((l) => l.status === 'Converted').length;

  const totalCars = cars.length;
  const activeCars = cars.filter((c) => c.status === 'Active').length;
  const unavailableCars = cars.filter((c) => c.status === 'Unavailable').length;

  const recentLeads = [...leads].slice(0, 5);

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'New':
        return 'bg-[#FFC928] text-black font-black';
      case 'Contacted':
        return 'bg-blue-100 text-blue-800 font-bold';
      case 'Follow-up':
        return 'bg-purple-100 text-purple-800 font-bold';
      case 'Converted':
        return 'bg-emerald-100 text-emerald-800 font-bold';
      case 'Lost':
        return 'bg-neutral-200 text-neutral-600 font-medium';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner & Quick Action Buttons */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC928]/20 text-[#997300] text-xs font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-[#FFC928]"></span>
            <span>Single Showroom Dispatch Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight font-heading">
            Fleet & Lead Overview
          </h1>
          <p className="text-xs text-[#666666] mt-1">
            Live operational status for {settings.physicalAddress}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={onOpenAddCar}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#FFC928] hover:bg-[#E5B21E] text-black font-bold text-xs shadow-sm transition-luxury cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>

          <button
            onClick={() => onNavigateTab('leads')}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#111111] hover:bg-black text-white font-bold text-xs transition-luxury cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Review Leads ({newLeads} New)</span>
          </button>

          <button
            onClick={() => onNavigateTab('blog')}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-xs transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#856404]" />
            <span>Blog & SEO ({blogPosts.length})</span>
          </button>

          <button
            onClick={exportLeadsCSV}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-bold text-xs transition-colors cursor-pointer"
            title="Download CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* 6 Key Statistic Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total Leads */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
            Total Leads
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#111111] font-heading">{totalLeads}</span>
            <Users className="w-4 h-4 text-neutral-400" />
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 block">All enquiries logged</span>
        </div>

        {/* New Leads (Highlighted) */}
        <div className="bg-[#111111] p-5 rounded-xl border border-neutral-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#FFC928]/20 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFC928] block">
              New Leads
            </span>
            <span className="w-2 h-2 rounded-full bg-[#FFC928] animate-ping" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-heading">{newLeads}</span>
            <Sparkles className="w-4 h-4 text-[#FFC928]" />
          </div>
          <span className="text-[10px] text-neutral-300 mt-1 block">Awaiting first contact</span>
        </div>

        {/* Contacted */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
            Contacted
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#111111] font-heading">{contactedLeads}</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 block">In conversation</span>
        </div>

        {/* Converted */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
            Converted
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-600 font-heading">{convertedLeads}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 block">Bookings confirmed</span>
        </div>

        {/* Total Fleet */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
            Total Cars
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#111111] font-heading">{totalCars}</span>
            <CarIcon className="w-4 h-4 text-neutral-400" />
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 block">Full fleet inventory</span>
        </div>

        {/* Active Fleet */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
            Active Cars
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#111111] font-heading">{activeCars}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 block">{unavailableCars} unavailable</span>
        </div>
      </div>

      {/* Recent Enquiries Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#111111] font-heading">
              Recent Customer Enquiries
            </h2>
            <p className="text-xs text-[#666666]">
              Latest booking requests received through the website
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('leads')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#111111] hover:text-[#997300] cursor-pointer"
          >
            <span>View All ({totalLeads})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F5F5] text-neutral-600 font-bold uppercase text-[10px] tracking-wider border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Requested Vehicle</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-neutral-50 transition-colors">
                  {/* Customer */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#111111]">{lead.customerName}</div>
                    <div className="text-[11px] text-neutral-500 flex items-center gap-2 mt-0.5">
                      <span>{lead.phoneNumber}</span>
                      <span>•</span>
                      <span className="truncate max-w-[140px]">{lead.email}</span>
                    </div>
                  </td>

                  {/* Vehicle */}
                  <td className="py-3.5 px-4 font-semibold text-neutral-800">
                    {lead.requestedCarName || 'General Enquiry'}
                  </td>

                  {/* Dates */}
                  <td className="py-3.5 px-4 text-neutral-600 whitespace-nowrap">
                    <div>{lead.pickupDate}</div>
                    <div className="text-[11px] text-neutral-400">to {lead.returnDate}</div>
                  </td>

                  {/* Source */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[10px] font-medium">
                      {lead.leadSource}
                    </span>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3.5 px-4">
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                      className={`text-[11px] px-2.5 py-1 rounded-md border-0 cursor-pointer focus:ring-1 focus:ring-black ${getStatusBadge(
                        lead.status
                      )}`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Converted">Converted</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectLead(lead.id)}
                      className="px-3 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 text-[#111111] font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
