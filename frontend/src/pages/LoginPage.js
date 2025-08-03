// src/pages/LoginPage.js
import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();

    // الصفحة المطلوبة بعد تسجيل الدخول
    const from = location.state?.from?.pathname || '/profile';

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert('يرجى ملء جميع الحقول');
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await login(email, password);
            if (error) {
                alert(error.message);
            } else {
                navigate(from, { replace: true }); // اذهب إلى الصفحة المطلوبة بعد النجاح
            }
        } catch (error) {
            alert('حدث خطأ غير متوقع');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        تسجيل الدخول
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        أو{' '}
                        <Link
                            to="/register"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            إنشاء حساب جديد
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                البريد الإلكتروني
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="البريد الإلكتروني"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                كلمة المرور
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="كلمة المرور"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link
                            to="/reset-password"
                            className="text-sm text-indigo-600 hover:text-indigo-500"
                        >
                            نسيت كلمة المرور؟
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
