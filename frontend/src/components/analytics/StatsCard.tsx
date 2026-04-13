import React from 'react';

interface StatsCardProps {
  icon: string;
  iconColor: string;
  value: string | number;
  label: string;
  trend?: string;
  trendUp?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  iconColor,
  value,
  label,
  trend,
  trendUp,
}) => {
  return (
    <div className="bg-surface-container-low rounded-xl p-6">
      <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center mb-4">
        <span className={`material-symbols-outlined ${iconColor}`} aria-hidden="true">
          {icon}
        </span>
      </div>

      <div className="font-headline text-3xl font-extrabold tracking-tighter text-white mt-2">
        {value}
      </div>

      <div className="font-label text-xs uppercase tracking-wider text-on-surface-variant mt-1">
        {label}
      </div>

      {trend && (
        <div className="flex items-center gap-1 mt-2">
          <span
            className={`material-symbols-outlined text-sm ${
              trendUp ? 'text-emerald-400' : 'text-error'
            }`}
            aria-hidden="true"
          >
            {trendUp ? 'trending_up' : 'trending_down'}
          </span>
          <span className={`text-xs ${trendUp ? 'text-emerald-400' : 'text-error'}`}>{trend}</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
