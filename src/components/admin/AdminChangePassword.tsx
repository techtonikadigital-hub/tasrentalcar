import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KeyRound, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminChangePassword: React.FC = () => {
  const { changePassword, showToast } = useApp();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSuccess(false);

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }

    const res = changePassword(currentPassword, newPassword);
    if (res.success) {
      setIsSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Administrator password updated successfully.', 'success');
    } else {
      setErrorMsg(res.message || 'Failed to update password.');
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#111111] font-heading">
          Security & Password
        </h1>
        <p className="text-xs text-[#666666] mt-0.5">
          Update the administrator authentication credentials for this single location dealership portal.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm">
        {isSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Password successfully changed. You can now use the new password on future sign-ins.</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1">
              Current Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
              />
            </div>
            <p className="text-[10px] text-neutral-500 mt-1">Default is admin123</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1">
              New Password *
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1">
              Confirm New Password *
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-black focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-11 rounded-lg bg-[#FFC928] hover:bg-[#E5B21E] text-black font-bold text-xs shadow-sm transition-luxury cursor-pointer"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
