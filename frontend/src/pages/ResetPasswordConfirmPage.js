// src/pages/ResetPasswordConfirmPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';

const ResetPasswordConfirmPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // التحقق من وجود رموز الاستعلام المطلوبة
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    
    if (!accessToken || !refreshToken) {
      setError(t({ ar: 'رابط غير صالح أو منتهي الصلاحية', en: 'Invalid or expired reset link' }));
    }
  }, [searchParams, t]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setError(t({ ar: 'يرجى ملء جميع الحقول', en: 'Please fill in all fields' }));
      return;
    }

    if (password !== confirmPassword) {
      setError(t({ ar: 'كلمتا المرور غير متطابقتين', en: 'Passwords do not match' }));
      return;
    }

    if (password.length < 6) {
      setError(t({ ar: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل', en: 'Password must be at least 6 characters long' }));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError(error.message);
      } else {
        setIsSuccess(true);
        // توجيه المستخدم لصفحة تسجيل الدخول بعد 3 ثوان
        setTimeout(() => {
          navigate('/login');
        }, 3000);
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
              {t({ ar: 'تم تحديث كلمة المرور', en: 'Password Updated' })}
            </h2>
            <p className="mt-4 text-sm text-gray-600">
              {t({ 
                ar: 'تم تحديث كلمة المرور بنجاح. سيتم توجيهك لصفحة تسجيل الدخول خلال 3 ثوان...', 
                en: 'Your password has been updated successfully. You will be redirected to the login page in 3 seconds...' 
              })}
            </p>
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
            {t({ ar: 'تعيين كلمة مرور جديدة', en: 'Set New Password' })}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t({ 
              ar: 'أدخل كلمة المرور الجديدة لحسابك', 
              en: 'Enter your new password for your account' 
            })}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
          <div className="space-y-4">
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="sr-only">
                {t({ ar: 'كلمة المرور الجديدة', en: 'New Password' })}
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder={t({ ar: 'كلمة المرور الجديدة (6 أحرف على الأقل)', en: 'New Password (minimum 6 characters)' })}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                {t({ ar: 'تأكيد كلمة المرور', en: 'Confirm Password' })}
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder={t({ ar: 'تأكيد كلمة المرور', en: 'Confirm New Password' })}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
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
                ? t({ ar: 'جاري التحديث...', en: 'Updating...' })
                : t({ ar: 'تحديث كلمة المرور', en: 'Update Password' })
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordConfirmPage;
