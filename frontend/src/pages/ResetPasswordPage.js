// src/pages/ResetPasswordPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

const ResetPasswordPage = () => {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!email) {
            setError(t({ ar: 'يرجى إدخال البريد الإلكتروني', en: 'Please enter your email address' }));
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password-confirm`,
            });

            if (error) {
                setError(error.message);
            } else {
                setIsSuccess(true);
            }
        } catch (error) {
            setError(t({ ar: 'حدث خطأ غير متوقع', en: 'An unexpected error occurred' }));
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            {t({ ar: 'تم إرسال الرابط', en: 'Link Sent' })}
                        </h2>
                        <p className="mt-4 text-sm text-gray-600">
                            {t({
                                ar: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى فحص صندوق البريد والرسائل غير المرغوب فيها.',
                                en: 'A password reset link has been sent to your email address. Please check your inbox and spam folder.'
                            })}
                        </p>
                        <div className="mt-6">
                            <Link
                                to="/login"
                                className="flex items-center justify-center space-x-2 rtl:space-x-reverse text-indigo-600 hover:text-indigo-500"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>{t({ ar: 'العودة لتسجيل الدخول', en: 'Back to Login' })}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {t({ ar: 'إعادة تعيين كلمة المرور', en: 'Reset Password' })}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {t({
                            ar: 'أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور',
                            en: 'Enter your email address and we\'ll send you a password reset link'
                        })}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
                    <div>
                        <label htmlFor="email" className="sr-only">
                            {t({ ar: 'البريد الإلكتروني', en: 'Email Address' })}
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-md relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder={t({ ar: 'البريد الإلكتروني', en: 'Email Address' })}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isLoading
                                ? t({ ar: 'جاري الإرسال...', en: 'Sending...' })
                                : t({ ar: 'إرسال رابط إعادة التعيين', en: 'Send Reset Link' })
                            }
                        </button>
                    </div>

                    <div className="text-center">
                        <Link
                            to="/login"
                            className="flex items-center justify-center space-x-2 rtl:space-x-reverse text-indigo-600 hover:text-indigo-500"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>{t({ ar: 'العودة لتسجيل الدخول', en: 'Back to Login' })}</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
