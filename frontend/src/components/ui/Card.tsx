import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'outline' | 'glass';
    hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
    className,
    variant = 'default',
    hover = false,
    children,
    ...props
}) => {
    const variants = {
        default: 'bg-white border border-gray-100 shadow-sm',
        outline: 'bg-transparent border-2 border-gray-200',
        glass: 'glass',
    };

    return (
        <div
            className={cn(
                'rounded-xl p-6 transition-all duration-300',
                variants[variant],
                hover && 'hover:shadow-premium hover:-translate-y-1',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
    <div className={cn('mb-4', className)} {...props}>
        {children}
    </div>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
    <div className={cn('', className)} {...props}>
        {children}
    </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
    <div className={cn('mt-6 pt-6 border-t border-gray-100', className)} {...props}>
        {children}
    </div>
);
