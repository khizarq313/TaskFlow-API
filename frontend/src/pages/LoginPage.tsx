import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const IS_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signInWithEmail, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSignIn = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');

    if (IS_MOCK) {
      // In mock mode, skip validation and Firebase, just navigate
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate loading
      setIsLoading(false);
      navigate('/dashboard');
      return;
    }

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);
      await signInWithEmail(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      let errorMessage = 'Failed to sign in';
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later';
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async (): Promise<void> => {
    setError('');

    if (IS_MOCK) {
      // In mock mode, skip Firebase, just navigate
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate loading
      setIsLoading(false);
      navigate('/dashboard');
      return;
    }

    try {
      setIsLoading(true);
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      let errorMessage = 'Failed to sign in with Google';
      if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in popup was closed';
      } else if (err.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Sign-in was cancelled';
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center overflow-hidden relative px-4">
      {/* Atmospheric orbs */}
      <div
        className="absolute w-[40%] h-[40%] rounded-full bg-primary-container/10 blur-[120px] top-[-10%] left-[-10%] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute w-[40%] h-[40%] rounded-full bg-tertiary-container/5 blur-[120px] bottom-[-10%] right-[-10%] pointer-events-none"
        aria-hidden="true"
      />

      <div className="w-full max-w-[440px] relative z-10">
        {/* Brand block */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 architectural-gradient rounded-lg flex items-center justify-center mb-3">
            <span
              className="material-symbols-outlined text-white"
              style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
            >
              layers
            </span>
          </div>
          <h1 className="font-headline text-2xl font-extrabold tracking-tighter text-white">
            TaskFlow
          </h1>
          <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">
            Enterprise Management
          </p>
        </div>

        {/* Login card */}
        <div className="bg-surface-container-low rounded-xl atmospheric-shadow relative">
          {/* Glassmorphism overlay */}
          <div
            className="absolute inset-0 bg-surface-variant/10 backdrop-blur-[2px] rounded-xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative p-10">
            <div className="mb-8">
              <h2 className="font-headline text-3xl font-extrabold tracking-tight text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-sm text-on-surface-variant font-body">
                Access your professional dashboard.
              </p>
            </div>

            <form onSubmit={handleEmailSignIn} className="space-y-5">
              {/* Email field */}
              <div>
                <label className="block font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <span
                    className="material-symbols-outlined absolute inset-y-0 left-4 flex items-center text-outline pointer-events-none"
                    aria-hidden="true"
                  >
                    alternate_email
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full bg-surface-container-highest border-none rounded-md py-4 pl-12 pr-4 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/20 focus:bg-surface-bright transition-all placeholder:text-outline/50"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-primary text-xs hover:text-primary-fixed-dim transition-colors"
                  >
                    Forgot Access?
                  </a>
                </div>
                <div className="relative group">
                  <span
                    className="material-symbols-outlined absolute inset-y-0 left-4 flex items-center text-outline pointer-events-none"
                    aria-hidden="true"
                  >
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-surface-container-highest border-none rounded-md py-4 pl-12 pr-12 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/20 focus:bg-surface-bright transition-all placeholder:text-outline/50"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-4 flex items-center text-outline hover:text-white transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Sign In button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full architectural-gradient text-white font-bold py-4 rounded-md shadow-lg shadow-primary-container/20 hover:opacity-90 active:scale-[0.98] transition-all font-body disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </span>
                ) : (
                  'Continue to Dashboard'
                )}
              </button>

              {/* Error message */}
              {error && (
                <div className="text-error text-sm text-center bg-error/10 rounded-md py-2">
                  {error}
                </div>
              )}
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-outline-variant/30" aria-hidden="true" />
              <span className="text-xs text-outline">or continue with</span>
              <div className="flex-1 h-px bg-outline-variant/30" aria-hidden="true" />
            </div>

            {/* Google button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="bg-surface-container-high border border-outline-variant/20 rounded-md py-3 flex items-center justify-center gap-3 w-full hover:bg-surface-variant transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z"
                  fill="#4285F4"
                />
                <path
                  d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z"
                  fill="#34A853"
                />
                <path
                  d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z"
                  fill="#FBBC05"
                />
                <path
                  d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z"
                  fill="#EA4335"
                />
              </svg>
              <span className="font-semibold text-sm text-on-surface">Sign in with Google</span>
            </button>

            {/* Demo mode banner */}
            {IS_MOCK && (
              <div className="text-xs text-tertiary text-center mt-4 bg-tertiary-container/10 rounded-md py-2 px-3">
                <span className="material-symbols-outlined text-xs inline-block mr-1 align-middle">
                  info
                </span>
                Running in demo mode — no credentials required
              </div>
            )}

            {/* Sign up link */}
            <div className="text-center mt-6">
              <span className="text-on-surface-variant text-sm">Don't have an account? </span>
              <a
                href="#"
                className="text-primary font-semibold text-sm hover:text-primary-fixed-dim transition-colors"
              >
                Create workspace
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
