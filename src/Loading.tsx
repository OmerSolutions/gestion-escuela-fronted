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
        ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50'
        : 'flex items-center justify-center p-4';

    return (
        <div className={containerClasses}>
            <div className="flex flex-col items-center gap-md">
                <div className={`loading ${sizeClasses[size]}`}></div>
                {message && (
                    <p className="text-secondary text-sm">{message}</p>
                )}
            </div>
        </div>
    );
};