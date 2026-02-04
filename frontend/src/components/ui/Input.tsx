import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helperText, type = 'text', ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="text-sm font-medium text-neutral-dark">
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    ref={ref}
                    className={cn(
                        'flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary disabled:cursor-not-allowed disabled:opacity-50',
                        error && 'border-error focus:ring-error/20 focus:border-error',
                        className
                    )}
                    {...props}
                />
                {error ? (
                    <p className="text-xs font-medium text-error">{error}</p>
                ) : helperText ? (
                    <p className="text-xs text-neutral-muted">{helperText}</p>
                ) : null}
            </div>
        );
    }
);

Input.displayName = 'Input';
