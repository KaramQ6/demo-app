import React, { useState, useEffect } from 'react';
import { Shield, UserCheck, Users, AlertCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { supabase } from '../../supabaseClient';

const AdminTools = () => {
    const { user } = useApp();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState('');

    // New states for admin creation form
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newAdminData, setNewAdminData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: ''
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error loading users:', error);
            setMessage('خطأ في تحميل المستخدمين');
        } finally {
            setLoading(false);
        }
    };

    const makeAdmin = async (userId, userEmail) => {
        try {
            setUpdating(true);

            // Update user role in profiles table
            const { error } = await supabase
                .from('profiles')
                .update({ role: 'admin' })
                .eq('id', userId);

            if (error) throw error;

            setMessage(`تم تعيين ${userEmail} كمدير بنجاح!`);
            await loadUsers();
        } catch (error) {
            console.error('Error making admin:', error);
            setMessage('خطأ في تعيين المدير');
        } finally {
            setUpdating(false);
        }
    };

    const removeAdmin = async (userId, userEmail) => {
        try {
            setUpdating(true);

            // Update user role in profiles table
            const { error } = await supabase
                .from('profiles')
                .update({ role: 'user' })
                .eq('id', userId);

            if (error) throw error;

            setMessage(`تم إزالة صلاحية الإدارة من ${userEmail}`);
            await loadUsers();
        } catch (error) {
            console.error('Error removing admin:', error);
            setMessage('خطأ في إزالة صلاحية الإدارة');
        } finally {
            setUpdating(false);
        }
    };

    const createAdminAccount = async (e) => {
        e.preventDefault();

        // Validation
        if (!newAdminData.email || !newAdminData.password || !newAdminData.confirmPassword || !newAdminData.name) {
            setMessage('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        if (newAdminData.password !== newAdminData.confirmPassword) {
            setMessage('كلمتا المرور غير متطابقتين');
            return;
        }

        if (newAdminData.password.length < 6) {
            setMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
            return;
        }

        try {
            setUpdating(true);

            // Create admin user with Supabase Auth
            const { data, error } = await supabase.auth.signUp({
                email: newAdminData.email,
                password: newAdminData.password,
                options: {
                    data: {
                        name: newAdminData.name,
                        role: 'admin'
                    }
                }
            });

            if (error) throw error;

            setMessage(`تم إنشاء حساب الإدمن بنجاح! الإيميل: ${newAdminData.email}, الاسم: ${newAdminData.name}`);

            // Reset form and hide it
            setNewAdminData({
                email: '',
                password: '',
                confirmPassword: '',
                name: ''
            });
            setShowCreateForm(false);

            setTimeout(() => loadUsers(), 2000);
        } catch (error) {
            console.error('Error creating admin:', error);
            setMessage('خطأ في إنشاء حساب الإدمن: ' + error.message);
        } finally {
            setUpdating(false);
        }
    }; if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-red-500" />
                    أدوات الإدارة
                </h2>
            </div>

            {/* Message */}
            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-2 ${message.includes('خطأ') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'
                    }`}>
                    <AlertCircle className="w-5 h-5" />
                    {message}
                    <button
                        onClick={() => setMessage('')}
                        className="ml-auto text-lg font-bold hover:opacity-70"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Admin Creation Form */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-blue-500" />
                    إنشاء حساب إدمن جديد
                </h3>

                {!showCreateForm ? (
                    <div>
                        <p className="text-gray-600 mb-4">
                            إنشاء حساب إدمن جديد بالمعلومات التي تحددها
                        </p>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                            <Shield className="w-4 h-4" />
                            إنشاء حساب إدمن
                        </button>
                    </div>
                ) : (
                    <form onSubmit={createAdminAccount} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    الاسم الكامل *
                                </label>
                                <input
                                    type="text"
                                    value={newAdminData.name}
                                    onChange={(e) => setNewAdminData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="أدخل الاسم الكامل"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    البريد الإلكتروني *
                                </label>
                                <input
                                    type="email"
                                    value={newAdminData.email}
                                    onChange={(e) => setNewAdminData(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="admin@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    كلمة المرور *
                                </label>
                                <input
                                    type="password"
                                    value={newAdminData.password}
                                    onChange={(e) => setNewAdminData(prev => ({ ...prev, password: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="6 أحرف على الأقل"
                                    minLength="6"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    تأكيد كلمة المرور *
                                </label>
                                <input
                                    type="password"
                                    value={newAdminData.confirmPassword}
                                    onChange={(e) => setNewAdminData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="أعد كتابة كلمة المرور"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={updating}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Shield className="w-4 h-4" />
                                {updating ? 'جارٍ الإنشاء...' : 'إنشاء الحساب'}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowCreateForm(false);
                                    setNewAdminData({
                                        email: '',
                                        password: '',
                                        confirmPassword: '',
                                        name: ''
                                    });
                                }}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                            >
                                إلغاء
                            </button>
                        </div>

                        <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                            <strong>ملاحظة:</strong> سيتم إنشاء الحساب بصلاحيات مدير كاملة. تأكد من استخدام بريد إلكتروني صحيح للتأكيد.
                        </div>
                    </form>
                )}
            </div>

            {/* Users Management */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-500" />
                    إدارة المستخدمين ({users.length})
                </h3>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">المستخدم</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإيميل</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الصلاحية</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map((userItem) => (
                                <tr key={userItem.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {userItem.name || 'مستخدم'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{userItem.email}</div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${userItem.role === 'admin'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {userItem.role === 'admin' && <Shield className="w-3 h-3" />}
                                            {userItem.role === 'admin' ? 'مدير' : 'مستخدم'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        {userItem.role === 'admin' ? (
                                            <button
                                                onClick={() => removeAdmin(userItem.id, userItem.email)}
                                                disabled={updating || userItem.id === user?.id}
                                                className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                إزالة الإدارة
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => makeAdmin(userItem.id, userItem.email)}
                                                disabled={updating}
                                                className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                تعيين كمدير
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        لا يوجد مستخدمون حالياً
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminTools;
