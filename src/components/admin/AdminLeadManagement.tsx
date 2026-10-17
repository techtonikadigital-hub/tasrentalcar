import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Lead, LeadStatus } from '../../types';
import {
  Search,
  Filter,
  FileSpreadsheet,
  Trash2,
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  Car as CarIcon,
  X,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
} from 'lucide-react';

interface AdminLeadManagementProps {
  initialSelectedLeadId?: string | null;
  onClearSelectedLead?: () => void;
}

export const AdminLeadManagement: React.FC<AdminLeadManagementProps> = ({
  initialSelectedLeadId,
  onClearSelectedLead,
}) => {
  const { leads, cars, updateLeadStatus, updateLeadDetails, deleteLead, exportLeadsCSV, formatCurrency } = useApp();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [vehicleFilter, setVehicleFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<'All' | 'Today' | 'Week' | 'Month'>('All');

  // Selected lead for detail modal / drawer
  const [activeLead, setActiveLead] = useState<Lead | null>(() => {
    if (initialSelectedLeadId) {
      return leads.find((l) => l.id === initialSelectedLeadId) || null;
    }
    return null;
  });

  // Modal editing state for internal notes & follow-up date
  const [editNotes, setEditNotes] = useState('');
  const [editFollowUpDate, setEditFollowUpDate] = useState('');
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  // Sync activeLead when selection changes
  const handleOpenLead = (lead: Lead) => {
    setActiveLead(lead);
    setEditNotes(lead.internalNotes || '');
    setEditFollowUpDate(lead.followUpDate || '');
  };

  const handleCloseLead = () => {
    setActiveLead(null);
    if (onClearSelectedLead) onClearSelectedLead();
  };

  const handleSaveNotes = () => {
    if (!activeLead) return;
    const updated: Lead = {
      ...activeLead,
      internalNotes: editNotes,
      followUpDate: editFollowUpDate || undefined,
    };
    updateLeadDetails(updated);
    setActiveLead(updated);
  };

  const confirmDelete = () => {
    if (!leadToDelete) return;
    deleteLead(leadToDelete.id);
    if (activeLead?.id === leadToDelete.id) {
      handleCloseLead();
    }
    setLeadToDelete(null);
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = lead.customerName.toLowerCase().includes(q);
        const matchesEmail = lead.email.toLowerCase().includes(q);
        const matchesPhone = lead.phoneNumber.toLowerCase().includes(q);
        const matchesCar = (lead.requestedCarName || '').toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesCar) return false;
      }

      // Status
      if (statusFilter !== 'All' && lead.status !== statusFilter) {
        return false;
      }

      // Vehicle
      if (vehicleFilter !== 'All' && lead.requestedCarId !== vehicleFilter) {
        return false;
      }

      // Date
      if (dateFilter !== 'All') {
        const submissionTime = new Date(lead.submissionDate).getTime();
        const now = Date.now();
        if (dateFilter === 'Today') {
          if (now - submissionTime > 86400000) return false;
        } else if (dateFilter === 'Week') {
          if (now - submissionTime > 86400000 * 7) return false;
        } else if (dateFilter === 'Month') {
          if (now - submissionTime > 86400000 * 30) return false;
        }
      }

      return true;
    });
  }, [leads, searchQuery, statusFilter, vehicleFilter, dateFilter]);

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
    <div className="space-y-6">
      {/* Top Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111111] font-heading">
            Lead & Customer Enquiries
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Track customer requests, booking details, follow-ups, and conversion statuses.
          </p>
        </div>

        <button
          onClick={exportLeadsCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#111111] hover:bg-black text-[#FFC928] font-bold text-xs transition-luxury cursor-pointer shadow-sm shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customer, phone, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium text-neutral-800 focus:outline-none focus:border-black focus:bg-white"
            >
              <option value="All">All Statuses ({leads.length})</option>
              <option value="New">New ({leads.filter((l) => l.status === 'New').length})</option>
              <option value="Contacted">Contacted ({leads.filter((l) => l.status === 'Contacted').length})</option>
              <option value="Follow-up">Follow-up ({leads.filter((l) => l.status === 'Follow-up').length})</option>
              <option value="Converted">Converted ({leads.filter((l) => l.status === 'Converted').length})</option>
              <option value="Lost">Lost ({leads.filter((l) => l.status === 'Lost').length})</option>
            </select>
          </div>

          {/* Vehicle Filter */}
          <div>
            <select
              value={vehicleFilter}
              onChange={(e) => setVehicleFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium text-neutral-800 focus:outline-none focus:border-black focus:bg-white"
            >
              <option value="All">All Vehicles</option>
              {cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.make} {car.model}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="w-full h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium text-neutral-800 focus:outline-none focus:border-black focus:bg-white"
            >
              <option value="All">All Timeframes</option>
              <option value="Today">Past 24 Hours</option>
              <option value="Week">Past 7 Days</option>
              <option value="Month">Past 30 Days</option>
            </select>
          </div>
        </div>

        {/* Clear filters shortcut */}
        {(searchQuery || statusFilter !== 'All' || vehicleFilter !== 'All' || dateFilter !== 'All') && (
          <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-100">
            <span>Filtering leads ({filteredLeads.length} matching)</span>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
                setVehicleFilter('All');
                setDateFilter('All');
              }}
              className="text-[#111111] hover:text-[#997300] font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F5F5] text-neutral-600 font-bold uppercase text-[10px] tracking-wider border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Vehicle Requested</th>
                <th className="py-3 px-4">Rental Dates</th>
                <th className="py-3 px-4">Lead Source</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-neutral-50 transition-colors">
                  {/* Submission Date */}
                  <td className="py-3.5 px-4 text-neutral-500 whitespace-nowrap">
                    <div className="font-semibold text-neutral-800">
                      {new Date(lead.submissionDate).toLocaleDateString()}
                    </div>
                    <div className="text-[10px]">
                      {new Date(lead.submissionDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>

                  {/* Customer Info */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#111111]">{lead.customerName}</div>
                    <div className="text-[11px] text-neutral-600 mt-0.5">{lead.phoneNumber}</div>
                    <div className="text-[10px] text-neutral-400 truncate max-w-[150px]">{lead.email}</div>
                  </td>

                  {/* Vehicle */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#111111]">
                      {lead.requestedCarName || 'General Inquiry'}
                    </div>
                    {lead.estimatedTotal && (
                      <span className="text-[10px] text-emerald-700 font-bold">
                        Est: {formatCurrency(lead.estimatedTotal)}
                      </span>
                    )}
                  </td>

                  {/* Rental Dates */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-medium text-neutral-800">{lead.pickupDate}</div>
                    <div className="text-[10px] text-neutral-500">to {lead.returnDate}</div>
                  </td>

                  {/* Source */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 text-neutral-700">
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

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleOpenLead(lead)}
                      className="px-3 py-1 rounded-md bg-[#FFC928] text-black font-bold text-[11px] hover:bg-[#E5B21E] transition-colors cursor-pointer mr-2 shadow-xs"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => setLeadToDelete(lead)}
                      className="p-1 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete lead"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    No leads found matching current filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Details Drawer / Modal */}
      {activeLead && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-neutral-300 overflow-hidden relative my-6">
            {/* Header */}
            <div className="bg-[#111111] text-white p-6 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[11px] px-2.5 py-0.5 rounded ${getStatusBadge(activeLead.status)}`}>
                    {activeLead.status}
                  </span>
                  <span className="text-xs text-neutral-400">
                    Received {new Date(activeLead.submissionDate).toLocaleString()}
                  </span>
                </div>
                <h2 className="text-xl font-bold font-heading">{activeLead.customerName}</h2>
                <span className="text-xs text-neutral-300">Source: {activeLead.leadSource}</span>
              </div>

              <button
                onClick={handleCloseLead}
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Contact Bar */}
            <div className="bg-neutral-100 p-4 border-b border-neutral-200 flex flex-wrap gap-2 text-xs">
              <a
                href={`tel:${activeLead.phoneNumber}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-300 font-bold text-neutral-800 hover:bg-neutral-50"
              >
                <Phone className="w-3.5 h-3.5 text-neutral-600" />
                <span>Call {activeLead.phoneNumber}</span>
              </a>

              <a
                href={`https://wa.me/${activeLead.phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello ${activeLead.customerName}, this is LAS Car Rental concierge regarding your vehicle enquiry.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Customer</span>
              </a>

              <a
                href={`mailto:${activeLead.email}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-300 font-bold text-neutral-800 hover:bg-neutral-50"
              >
                <Mail className="w-3.5 h-3.5 text-neutral-600" />
                <span>Email Customer</span>
              </a>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-5 text-xs max-h-[60vh] overflow-y-auto">
              {/* Requested Vehicle & Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F5F5F5] p-4 rounded-xl border border-neutral-200">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                    Requested Vehicle
                  </span>
                  <div className="font-bold text-sm text-[#111111] mt-0.5">
                    {activeLead.requestedCarName || 'General Showroom Enquiry'}
                  </div>
                  {activeLead.estimatedTotal && (
                    <span className="text-xs font-bold text-emerald-700 block mt-1">
                      Estimated Total: {formatCurrency(activeLead.estimatedTotal)}
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                    Requested Rental Period
                  </span>
                  <div className="font-bold text-sm text-[#111111] mt-0.5">
                    {activeLead.pickupDate} to {activeLead.returnDate}
                  </div>
                  <span className="text-[11px] text-neutral-500 block mt-0.5">
                    Target Handover: {activeLead.pickupTime || '10:00 AM'}
                  </span>
                </div>
              </div>

              {/* Customer Message */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  Customer Inquiry Message
                </span>
                <div className="p-3.5 rounded-xl bg-white border border-neutral-200 text-neutral-800 leading-relaxed font-sans text-xs">
                  {activeLead.customerMessage || 'No specific notes entered.'}
                </div>
              </div>

              {/* Status Update Dropdown */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  Update Lead Pipeline Status
                </span>
                <div className="flex flex-wrap gap-2">
                  {(['New', 'Contacted', 'Follow-up', 'Converted', 'Lost'] as LeadStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => updateLeadStatus(activeLead.id, st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeLead.status === st
                          ? `${getStatusBadge(st)} ring-2 ring-black`
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal Notes & Follow-up Date */}
              <div className="border-t border-neutral-200 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-700">
                    Administrator Internal Notes & Follow-up
                  </span>
                </div>

                <div>
                  <textarea
                    rows={3}
                    placeholder="Enter internal notes on customer conversation, requirements, or agreed quote..."
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-neutral-700">Follow-up Date:</label>
                    <input
                      type="date"
                      value={editFollowUpDate}
                      onChange={(e) => setEditFollowUpDate(e.target.value)}
                      className="h-8 px-2 rounded bg-neutral-50 border border-neutral-300 text-xs font-medium"
                    />
                  </div>

                  <button
                    onClick={handleSaveNotes}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FFC928] hover:bg-[#E5B21E] text-black font-bold text-xs transition-luxury cursor-pointer shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Notes</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-neutral-50 p-4 border-t border-neutral-200 flex items-center justify-between">
              <button
                onClick={() => setLeadToDelete(activeLead)}
                className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Lead</span>
              </button>

              <button
                onClick={handleCloseLead}
                className="px-4 py-2 rounded-lg bg-[#111111] text-white text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {leadToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-neutral-300">
            <div className="flex items-center gap-2.5 text-red-600 font-bold text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>Confirm Lead Deletion</span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Are you sure you want to permanently delete the enquiry record for{' '}
              <strong className="text-black">{leadToDelete.customerName}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setLeadToDelete(null)}
                className="px-3.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-neutral-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-bold text-white shadow-sm"
              >
                Delete Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
