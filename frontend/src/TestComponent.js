// مكون اختبار بسيط للتأكد من عدم وجود rendering loops
import React from 'react';
import { useApp } from './contexts/AppContext';

const TestComponent = () => {
    const { user, loading } = useApp();

    console.log('TestComponent rendered - loading:', loading, 'user:', user ? 'exists' : 'null');

    if (loading) {
        return <div>Loading test component...</div>;
    }

    return (
        <div>
            <h2>Test Component</h2>
            <p>User: {user ? user.email : 'Not logged in'}</p>
            <p>System is working correctly!</p>
        </div>
    );
};

export default TestComponent;
