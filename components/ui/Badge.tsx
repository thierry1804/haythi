import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'tertiary';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-3 py-1 text-[9px] font-headline tracking-widest uppercase',
          {
            'bg-surface-container-highest text-on-surface': variant === 'default',
            'bg-primary/20 text-primary': variant === 'primary',
            'bg-tertiary/20 text-tertiary': variant === 'tertiary',
          },
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
