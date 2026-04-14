import React from 'react';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({ label, children, required = false }) => {
  return (
    <div>
      <label className="block font-label text-xs uppercase tracking-wider text-on-surface-variant mb-2">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      {children}
    </div>
  );
};

export default FormField;
