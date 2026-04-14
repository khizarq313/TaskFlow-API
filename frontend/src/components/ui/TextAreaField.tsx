import React from 'react';

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({ 
  label, 
  error, 
  className = '',
  required,
  ...props 
}) => {
  const textareaClasses = `w-full bg-surface-container-highest border-none rounded-md py-3 px-4 text-on-surface placeholder:text-outline/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all ${className}`;

  return (
    <div>
      {label && (
        <label className="block font-label text-xs uppercase tracking-wider text-on-surface-variant mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <textarea className={textareaClasses} {...props} />
      {error && (
        <p className="text-error text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default TextAreaField;
