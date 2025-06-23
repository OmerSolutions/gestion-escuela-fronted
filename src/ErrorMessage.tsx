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
        <div className="alert alert-error">
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-sm">
        <svg
            className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 20 20"
    >
    <path
        fillRule="evenodd"
    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
    clipRule="evenodd"
        />
        </svg>
        <span>{message}</span>
        </div>

        <div className="flex gap-sm">
        {onRetry && (
            <button
                onClick={onRetry}
    className="btn btn-sm btn-secondary"
        >
        Reintentar
        </button>
)}
    {onDismiss && (
        <button
            onClick={onDismiss}
        className="btn btn-sm btn-secondary"
            >
              ✕
            </button>
    )}
    </div>
    </div>
    </div>
);
};