import React from 'react';

interface AvatarProps {
  src?: string | null;
  alt?: string; // 🔥 make optional
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
  };

  // 🔥 SAFE initials generator
  const getInitials = (name?: string): string => {
    if (!name) return 'U';

    const parts = name.trim().split(' ').filter(Boolean);

    const first = parts[0]?.[0] || '';
    const second = parts[1]?.[0] || '';

    const initials = (first + second).toUpperCase();

    return initials || name.substring(0, 2).toUpperCase();
  };

  // 🔥 fallback alt
  const safeAlt = alt || 'User';

  if (src) {
    return (
      <img
        src={src}
        alt={safeAlt}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-primary/20 ${className}`}
        onError={(e) => {
          // 🔥 fallback if image fails
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-primary-container flex items-center justify-center text-white font-bold border-2 border-primary/20 ${className}`}
    >
      {getInitials(safeAlt)}
    </div>
  );
};

export default Avatar;