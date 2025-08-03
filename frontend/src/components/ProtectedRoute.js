// src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AppContext);
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">جاري التحقق من المصادقة...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        // حفظ الصفحة المطلوبة للعودة إليها بعد تسجيل الدخول
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
