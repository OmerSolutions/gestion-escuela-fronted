import React from 'react';

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
    onDismiss?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
                                                              message,
                                                              onRetry,
                                                              onDismiss,
                                                          }) => {
    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md max-w-lg mx-auto my-4 animate-fade-in">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-base">{message}</span>
                </div>
                <div className="flex gap-2">
                    {onRetry && (
                        <button onClick={onRetry} className="btn btn-sm btn-secondary">Reintentar</button>
                    )}
                    {onDismiss && (
                        <button onClick={onDismiss} className="btn btn-sm btn-error">Cerrar</button>
                    )}
                </div>
            </div>
        </div>
    );
};