import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-[#FFC928] shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-[#111111] text-white border-neutral-700',
    error: 'bg-red-950 text-white border-red-800',
    info: 'bg-[#111111] text-white border-neutral-700',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in slide-in-from-bottom-5 duration-300">
      <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border shadow-2xl ${bgStyles[toast.type]}`}>
        {icons[toast.type]}
        <p className="text-xs font-semibold leading-snug">{toast.message}</p>
      </div>
    </div>
  );
};
