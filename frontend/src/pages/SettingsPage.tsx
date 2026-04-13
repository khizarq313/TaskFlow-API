import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';

export const SettingsPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-surface pt-24 px-4 md:px-8 pb-12">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tighter text-white">
          Settings
        </h1>
        <p className="text-sm text-on-surface-variant font-body mt-2">
          Manage your account and preferences
        </p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Profile Section */}
        <div className="bg-surface-container-low rounded-xl p-6">
          <h2 className="font-headline font-bold text-lg text-white mb-6">Profile</h2>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar src={user?.photoURL} alt={user?.displayName || 'User'} size="lg" />
              <div className="flex-1">
                <p className="font-semibold text-white">{user?.displayName || 'User'}</p>
                <p className="text-sm text-on-surface-variant">{user?.email}</p>
              </div>
              <Button variant="secondary" size="sm" disabled>
                Change Photo
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={user?.displayName || ''}
                  disabled
                  className="w-full bg-surface-container-highest border-none rounded-md py-3 px-4 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/20 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block font-label text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-surface-container-highest border-none rounded-md py-3 px-4 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/20 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="primary" disabled>
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="bg-surface-container-low rounded-xl p-6">
          <h2 className="font-headline font-bold text-lg text-white mb-6">Appearance</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Dark Mode</p>
                <p className="text-sm text-on-surface-variant">
                  Currently enabled and permanent for this application
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">dark_mode</span>
                <span className="text-sm font-semibold text-primary">Always On</span>
              </div>
            </div>

            <div className="bg-surface-variant/10 rounded-md p-4 flex items-start gap-3">
              <span className="material-symbols-outlined text-primary flex-shrink-0">info</span>
              <p className="text-sm text-on-surface-variant">
                This application is designed exclusively for dark mode to provide the best visual
                experience and reduce eye strain during extended use.
              </p>
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-surface-container-low rounded-xl p-6">
          <h2 className="font-headline font-bold text-lg text-white mb-6">Account</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-outline-variant/10">
              <div>
                <p className="font-semibold text-white">Sign Out</p>
                <p className="text-sm text-on-surface-variant">
                  Sign out of your account on this device
                </p>
              </div>
              <Button variant="secondary" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-semibold text-error">Delete Account</p>
                <p className="text-sm text-on-surface-variant">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button variant="danger" disabled title="Coming soon">
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-surface-container-low rounded-xl p-6">
          <h2 className="font-headline font-bold text-lg text-white mb-6">Notifications</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-outline-variant/10">
              <div>
                <p className="font-semibold text-white">Email Notifications</p>
                <p className="text-sm text-on-surface-variant">
                  Receive email updates about your tasks
                </p>
              </div>
              <button
                disabled
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-surface-variant opacity-50 cursor-not-allowed"
              >
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-outline-variant/10">
              <div>
                <p className="font-semibold text-white">Push Notifications</p>
                <p className="text-sm text-on-surface-variant">
                  Receive push notifications in your browser
                </p>
              </div>
              <button
                disabled
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-surface-variant opacity-50 cursor-not-allowed"
              >
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-semibold text-white">Task Reminders</p>
                <p className="text-sm text-on-surface-variant">
                  Get reminders for upcoming due dates
                </p>
              </div>
              <button
                disabled
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-surface-variant opacity-50 cursor-not-allowed"
              >
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-surface-container-low rounded-xl p-6">
          <h2 className="font-headline font-bold text-lg text-white mb-6">About</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Version</span>
              <span className="text-white font-semibold">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Build</span>
              <span className="text-white font-semibold">2026.04.12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Environment</span>
              <span className="text-white font-semibold">
                {import.meta.env.VITE_USE_MOCK === 'true' ? 'Mock Mode' : 'Production'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
