import React from 'react';

interface LoadingProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
    fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
                                                    message = 'Cargando...',
                                                    size = 'md',
                                                    fullScreen = false,
                                                }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    const containerClasses = fullScreen
        ? 'fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50'
        : 'flex items-center justify-center p-4';

    return (
        <div className={containerClasses}>
            <div className="flex flex-col items-center gap-3">
                <div className={`animate-spin rounded-full border-4 border-primary-color border-t-transparent ${sizeClasses[size]}`}></div>
                {message && (
                    <p className="text-primary-color text-base font-semibold text-center mt-2">{message}</p>
                )}
            </div>
        </div>
    );
};