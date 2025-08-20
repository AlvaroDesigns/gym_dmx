import { cn } from '@/lib/utils';
import * as React from 'react';
import { Button } from './button';

export interface ViewToggleOption {
  value: string;
  icon: React.ReactNode;
  label?: string;
}

export interface ViewToggleProps {
  options: [ViewToggleOption, ViewToggleOption];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

const sizeClasses = {
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
};

export const ViewToggle = React.forwardRef<HTMLDivElement, ViewToggleProps>(
  (
    { options, value, onValueChange, className, size = 'md', variant = 'outline' },
    ref,
  ) => {
    const [firstOption, secondOption] = options;

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center border rounded overflow-hidden h-8',
          className,
        )}
      >
        <Button
          variant={variant}
          size="sm"
          className={cn(
            sizeClasses[size],
            'rounded-none border-0',
            value === firstOption.value
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'hover:bg-muted/50',
          )}
          onClick={() => onValueChange(firstOption.value)}
        >
          {firstOption.icon}
          {firstOption.label && (
            <span className="ml-2 hidden sm:inline-block">{firstOption.label}</span>
          )}
        </Button>
        <Button
          variant={variant}
          size="sm"
          className={cn(
            sizeClasses[size],
            'rounded-none border-0 border-l',
            value === secondOption.value
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'hover:bg-muted/50',
          )}
          onClick={() => onValueChange(secondOption.value)}
        >
          {secondOption.icon}
          {secondOption.label && (
            <span className="ml-2 hidden sm:inline-block">{secondOption.label}</span>
          )}
        </Button>
      </div>
    );
  },
);

ViewToggle.displayName = 'ViewToggle';
