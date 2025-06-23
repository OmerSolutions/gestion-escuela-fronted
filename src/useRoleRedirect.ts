import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@utils/constants';
import {useAuth} from "@/AuthContext.tsx";

export const useRoleRedirect = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && user) {
            // Redirigir según el rol del usuario
            switch (user.rol) {
                case 0: // Alumno
                    navigate(ROUTES.DASHBOARD + '/alumno');
                    break;
                case 1: // Profesor
                    navigate(ROUTES.DASHBOARD + '/profesor');
                    break;
                case 2: // Admin
                    navigate(ROUTES.DASHBOARD + '/admin');
                    break;
                default:
                    navigate(ROUTES.DASHBOARD);
            }
        }
    }, [user, isAuthenticated, navigate]);
};