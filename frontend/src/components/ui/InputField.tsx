import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  error, 
  className = '',
  required,
  ...props 
}) => {
  const inputClasses = `w-full bg-surface-container-highest border-none rounded-md py-3 px-4 text-white placeholder:text-outline/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${className}`;

  return (
    <div>
      {label && (
        <label className="block font-label text-xs uppercase tracking-wider text-on-surface-variant mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <input className={inputClasses} {...props} />
      {error && (
        <p className="text-error text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default InputField;
