import React, { useState, useContext } from 'react';
import { Shield, X, AlertTriangle } from 'lucide-react';
import { AppContext } from '../contexts/AppContext';
import ViewBookings from '../components/Admin/ViewBookings';
import ManageUsers from '../components/Admin/ManageUsers';
import PlatformAnalytics from '../components/Admin/PlatformAnalytics';
import AdminTools from '../components/Admin/AdminTools';

const AdminDashboardPage = () => {
    const { user } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('bookings');
    const [showAccessDenied, setShowAccessDenied] = useState(false);

    // Simple admin check - in real app, this would be more sophisticated
    const isAdmin = user?.email === 'admin@smarttour.jo' || user?.role === 'admin' || process.env.NODE_ENV === 'development';

    // If not admin, show access denied
    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <div className="text-red-500 mb-4">
                        <Shield className="w-16 h-16 mx-auto" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
                    <p className="text-gray-600 mb-6">
                        You don't have permission to access the admin dashboard.
                        Please contact your administrator if you believe this is an error.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Return to Homepage
                    </button>

                    {/* Development mode notice */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                            <div className="flex items-center gap-2 text-yellow-800">
                                <AlertTriangle className="w-4 h-4" />
                                <span className="text-sm font-medium">Development Mode</span>
                            </div>
                            <p className="text-sm text-yellow-700 mt-1">
                                In development, you can access admin features by setting user.role = 'admin' or user.email = 'admin@smarttour.jo'
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'bookings', name: 'View Bookings', icon: '📅' },
        { id: 'users', name: 'Manage Users', icon: '👥' },
        { id: 'analytics', name: 'Platform Analytics', icon: '📊' },
        { id: 'admin-tools', name: 'Admin Tools', icon: '🛠️' }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'bookings':
                return <ViewBookings />;
            case 'users':
                return <ManageUsers />;
            case 'analytics':
                return <PlatformAnalytics />;
            case 'admin-tools':
                return <AdminTools />;
            default:
                return <ViewBookings />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">SmartTour.Jo Admin Dashboard</h1>
                                <p className="text-gray-600">Centralized platform management</p>
                            </div>
                        </div>

                        {/* Admin User Info */}
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-sm font-medium text-gray-800">
                                    {user?.name || 'Admin User'}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {user?.email || 'admin@smarttour.jo'}
                                </div>
                            </div>
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6">
                    <nav className="flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <span className="text-lg">{tab.icon}</span>
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default AdminDashboardPage;
