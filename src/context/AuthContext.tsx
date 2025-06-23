import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { UsuarioDto } from '../types/usuario.types';

// Tipos para el estado de autenticación
interface AuthState {
    isAuthenticated: boolean;
    user: UsuarioDto | null;
    loading: boolean;
    error: string | null;
}

// Tipos para las acciones
type AuthAction =
    | { type: 'AUTH_START' }
    | { type: 'AUTH_SUCCESS'; payload: UsuarioDto }
    | { type: 'AUTH_ERROR'; payload: string }
    | { type: 'AUTH_LOGOUT' }
    | { type: 'CLEAR_ERROR' };

// Estado inicial
const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
};

// Reducer para manejar el estado
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'AUTH_START':
            return {
                ...state,
                loading: true,
                error: null,
            };

        case 'AUTH_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
                loading: false,
                error: null,
            };

        case 'AUTH_ERROR':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                loading: false,
                error: action.payload,
            };

        case 'AUTH_LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                loading: false,
                error: null,
            };

        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };

        default:
            return state;
    }
};

// Contexto de autenticación
interface AuthContextType extends AuthState {
    login: (correo: string, contrasena: string) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
    isAdmin: () => boolean;
    isProfesor: () => boolean;
    isAlumno: () => boolean;
    hasRole: (role: number) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider del contexto
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Verificar autenticación al cargar la aplicación
    useEffect(() => {
        const checkAuth = () => {
            try {
                if (authService.isAuthenticated()) {
                    const user = authService.getCurrentUser();
                    if (user) {
                        dispatch({ type: 'AUTH_SUCCESS', payload: user });
                    } else {
                        dispatch({ type: 'AUTH_LOGOUT' });
                    }
                } else {
                    dispatch({ type: 'AUTH_LOGOUT' });
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                dispatch({ type: 'AUTH_LOGOUT' });
            }
        };

        checkAuth();
    }, []);

    // Función de login
    const login = async (correo: string, contrasena: string): Promise<void> => {
        dispatch({ type: 'AUTH_START' });

        try {
            const response = await authService.login({ correo, contrasena });
            dispatch({ type: 'AUTH_SUCCESS', payload: response.usuario });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error de autenticación';
            dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
            throw error;
        }
    };

    // Función de logout
    const logout = async (): Promise<void> => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            dispatch({ type: 'AUTH_LOGOUT' });
        }
    };

    // Limpiar errores
    const clearError = (): void => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    // Funciones de verificación de roles
    const isAdmin = (): boolean => {
        return state.user?.rol === 2;
    };

    const isProfesor = (): boolean => {
        return state.user?.rol === 1;
    };

    const isAlumno = (): boolean => {
        return state.user?.rol === 0;
    };

    const hasRole = (role: number): boolean => {
        return state.user?.rol === role;
    };

    const value: AuthContextType = {
        ...state,
        login,
        logout,
        clearError,
        isAdmin,
        isProfesor,
        isAlumno,
        hasRole,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook para usar el contexto
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};