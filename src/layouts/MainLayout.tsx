import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NotificationContainer } from '../components/NotificationContainer';
import { Header } from '../components/Header';
import { Sidebar } from '../components/SliderBar';

export const MainLayout: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex">
                {user && <Sidebar />}
                <main className={`flex-1 ${user ? 'ml-64' : ''} p-6`}>
                    <Outlet />
                </main>
            </div>
            <NotificationContainer />
        </div>
    );
};