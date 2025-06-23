import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { ROUTES } from './utils/constants';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { MainLayout } from './layouts/MainLayout';
import { LoginPage } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardPage } from './layouts/DashboardPage';

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <NotificationProvider>
                    <div className="App">
                        <Routes>
                            <Route path="/" element={<MainLayout />}>
                                {/* Ruta pública */}
                                <Route path={ROUTES.LOGIN} element={<LoginPage />} />

                                {/* Redirección de la raíz */}
                                <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />

                                {/* Rutas protegidas */}
                                <Route path={ROUTES.DASHBOARD} element={
                                    <ProtectedRoute>
                                        <DashboardPage />
                                    </ProtectedRoute>
                                } />

                              {/*  <Route path={`${ROUTES.USUARIOS}/*`} element={
                                    <ProtectedRoute requiredRole={2}>
                                        <UsuariosPage />
                                    </ProtectedRoute>
                                } />

                                <Route path={`${ROUTES.ALUMNOS}/*`} element={
                                    <ProtectedRoute requiredRole={[1, 2]}>
                                        <AlumnosPage />
                                    </ProtectedRoute>
                                } />

                                <Route path={`${ROUTES.CURSOS}/*`} element={
                                    <ProtectedRoute requiredRole={[1, 2]}>
                                        <CursosPage />
                                    </ProtectedRoute>
                                } />

                                <Route path={`${ROUTES.SECCIONES}/*`} element={
                                    <ProtectedRoute requiredRole={[1, 2]}>
                                        <SeccionesPage />
                                    </ProtectedRoute>
                                } />

                                <Route path={`${ROUTES.ASISTENCIAS}/*`} element={
                                    <ProtectedRoute>
                                        <AsistenciasPage />
                                    </ProtectedRoute>
                                } />

                                <Route path={`${ROUTES.HORARIOS}/*`} element={
                                    <ProtectedRoute>
                                        <HorariosPage />
                                    </ProtectedRoute>
                                } />

                                <Route path={`${ROUTES.MATERIALES}/*`} element={
                                    <ProtectedRoute>
                                        <MaterialesPage />
                                    </ProtectedRoute>
                                } />

                                <Route path={`${ROUTES.INSTITUCIONES}/*`} element={
                                    <ProtectedRoute requiredRole={2}>
                                        <InstitucionesPage />
                                    </ProtectedRoute>
                                } />*/}

                                {/* Ruta 404 */}
                                <Route path="*" element={
                                    <div className="flex items-center justify-center min-h-screen">
                                        <div className="text-center">
                                            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                                            <p className="text-gray-600 mb-4">Página no encontrada</p>
                                            <Navigate to={ROUTES.DASHBOARD} replace />
                                        </div>
                                    </div>
                                } />
                            </Route>
                        </Routes>
                    </div>
                </NotificationProvider>
            </AuthProvider>
        </Router>
    );
};

export default App;
