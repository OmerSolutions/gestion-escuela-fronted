import React from 'react';
import { Outlet } from 'react-router-dom';
import {useAuth} from "@/AuthContext.tsx";
import {NotificationContainer} from "@/NotificationContainer.tsx";
import {Header} from "@/Header.tsx";
import {Sidebar} from "@/SliderBar.tsx";

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