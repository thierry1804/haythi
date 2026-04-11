import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-headline font-bold uppercase tracking-[0.15em] transition-all duration-300 focus:outline-none',
          {
            // Primary: Solid primary-container with on-primary-container text
            'bg-primary-container text-on-primary-container rounded-sm hover:brightness-110 active:scale-95': variant === 'primary',
            // Secondary (HUD): Transparent, ghost border, tertiary text
            'bg-transparent border border-outline text-tertiary hover:bg-tertiary/5 hover:border-tertiary/50': variant === 'secondary',
            // Tertiary: Text with underline
            'bg-transparent text-tertiary underline underline-offset-4 decoration-tertiary decoration-2 hover:text-tertiary-fixed': variant === 'tertiary',
            'px-4 py-2 text-[10px]': size === 'sm',
            'px-6 py-3 text-xs': size === 'md',
            'px-8 py-4 text-sm': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
