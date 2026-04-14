import React from 'react';

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const SelectField: React.FC<SelectFieldProps> = ({ 
  label, 
  error, 
  options,
  className = '',
  required,
  ...props 
}) => {
  const selectClasses = `w-full bg-surface-container-highest border-none rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer ${className}`;

  return (
    <div>
      {label && (
        <label className="block font-label text-xs uppercase tracking-wider text-on-surface-variant mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select className={selectClasses} {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-surface-container-highest text-white">
              {option.label}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-sm">
          expand_more
        </span>
      </div>
      {error && (
        <p className="text-error text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default SelectField;
