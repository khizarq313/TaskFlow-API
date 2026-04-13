import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, rightIcon, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <span
              className="material-symbols-outlined absolute inset-y-0 left-4 flex items-center text-outline pointer-events-none"
              aria-hidden="true"
            >
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={`w-full bg-surface-container-highest border-none rounded-md py-4 ${
              icon ? 'pl-12' : 'pl-4'
            } ${
              rightIcon ? 'pr-12' : 'pr-4'
            } text-on-surface placeholder:text-outline/50 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:bg-surface-bright transition-all ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-4 flex items-center">{rightIcon}</div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
