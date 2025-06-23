import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Tipos para las notificaciones
export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
    persistent?: boolean;
}

interface NotificationState {
    notifications: Notification[];
}

type NotificationAction =
    | { type: 'ADD_NOTIFICATION'; payload: Notification }
    | { type: 'REMOVE_NOTIFICATION'; payload: string }
    | { type: 'CLEAR_NOTIFICATIONS' };

// Estado inicial
const initialState: NotificationState = {
    notifications: [],
};

// Reducer
const notificationReducer = (
    state: NotificationState,
    action: NotificationAction
): NotificationState => {
    switch (action.type) {
        case 'ADD_NOTIFICATION':
            return {
                ...state,
                notifications: [...state.notifications, action.payload],
            };

        case 'REMOVE_NOTIFICATION':
            return {
                ...state,
                notifications: state.notifications.filter(
                    notification => notification.id !== action.payload
                ),
            };

        case 'CLEAR_NOTIFICATIONS':
            return {
                ...state,
                notifications: [],
            };

        default:
            return state;
    }
};
// Contexto
interface NotificationContextType extends NotificationState {
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;
    showSuccess: (title: string, message?: string) => void;
    showError: (title: string, message?: string) => void;
    showWarning: (title: string, message?: string) => void;
    showInfo: (title: string, message?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider
interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(notificationReducer, initialState);

    // Generar ID único
    const generateId = (): string => {
        return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };

    // Agregar notificación
    const addNotification = (notification: Omit<Notification, 'id'>): void => {
        const id = generateId();
        const newNotification: Notification = {
            id,
            duration: 5000, // 5 segundos por defecto
            ...notification,
        };

        dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });

        // Auto-remover si no es persistente
        if (!newNotification.persistent && newNotification.duration) {
            setTimeout(() => {
                dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
            }, newNotification.duration);
        }
    };

    // Remover notificación
    const removeNotification = (id: string): void => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    };

    // Limpiar todas las notificaciones
    const clearNotifications = (): void => {
        dispatch({ type: 'CLEAR_NOTIFICATIONS' });
    };

    // Métodos de conveniencia
    const showSuccess = (title: string, message?: string): void => {
        addNotification({ type: 'success', title, message });
    };

    const showError = (title: string, message?: string): void => {
        addNotification({ type: 'error', title, message, duration: 8000 });
    };

    const showWarning = (title: string, message?: string): void => {
        addNotification({ type: 'warning', title, message });
    };

    const showInfo = (title: string, message?: string): void => {
        addNotification({ type: 'info', title, message });
    };

    const value: NotificationContextType = {
        ...state,
        addNotification,
        removeNotification,
        clearNotifications,
        showSuccess,
        showError,
        showWarning,
        showInfo,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

// Hook para usar el contexto
export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};