import React from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, FileText } from 'lucide-react';

export const PolicyModal: React.FC = () => {
  const { openPolicyModal, setOpenPolicyModal, settings } = useApp();

  if (!openPolicyModal) return null;

  const isPrivacy = openPolicyModal === 'privacy';
  const title = isPrivacy ? 'Privacy Policy' : 'Rental Terms & Conditions';
  const rawContent = isPrivacy ? settings.privacyPolicy : settings.termsAndConditions;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-neutral-300 overflow-hidden relative my-8">
        {/* Modal Header */}
        <div className="bg-[#111111] text-white px-6 py-5 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            {isPrivacy ? (
              <ShieldCheck className="w-5 h-5 text-[#FFC928]" />
            ) : (
              <FileText className="w-5 h-5 text-[#FFC928]" />
            )}
            <h3 className="text-lg font-bold font-heading">{title}</h3>
          </div>
          <button
            onClick={() => setOpenPolicyModal(null)}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto text-xs sm:text-sm text-neutral-700 leading-relaxed space-y-4">
          <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 text-xs text-neutral-500 flex justify-between items-center">
            <span>Official Policy for {settings.businessName}</span>
            <span>Single Showroom: {settings.physicalAddress}</span>
          </div>

          <div className="whitespace-pre-wrap font-sans text-neutral-800 leading-relaxed">
            {rawContent}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-neutral-100 px-6 py-4 border-t border-neutral-200 flex justify-end">
          <button
            onClick={() => setOpenPolicyModal(null)}
            className="px-5 py-2 rounded-lg bg-[#111111] text-white text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
