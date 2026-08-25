import React from 'react';
import { cn } from '@/lib/utils';
import { DeviceStatus, RoomStatus } from '@/types/domain';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'offline' | 'accent';
  status?: DeviceStatus | RoomStatus;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant,
  status,
  dot = false,
  children,
  ...props
}) => {
  let resolvedVariant = variant || 'default';

  if (status) {
    switch (status) {
      case 'online':
      case 'occupied':
      case 'active':
        resolvedVariant = 'success';
        break;
      case 'warning':
        resolvedVariant = 'warning';
        break;
      case 'offline':
        resolvedVariant = 'offline';
        break;
      case 'vacant':
        resolvedVariant = 'default';
        break;
    }
  }

  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    accent: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    offline: 'bg-slate-100 text-slate-500 border-slate-200',
  };

  const dotColors = {
    default: 'bg-slate-400',
    accent: 'bg-indigo-500',
    success: 'bg-emerald-500 animate-pulse',
    warning: 'bg-amber-500 animate-pulse',
    danger: 'bg-rose-500 animate-pulse',
    offline: 'bg-slate-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variants[resolvedVariant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full', dotColors[resolvedVariant])}
        />
      )}
      {children}
    </span>
  );
};
