// src/pages/UserProfile.js
import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { useToast } from '../hooks/use-toast';
import { User, Mail, Calendar, Settings, Edit, Save } from 'lucide-react';

const interestsOptions = ['Adventure', 'History', 'Food', 'Relaxation'];
const budgetOptions = ['Economy', 'Mid-range', 'Luxury'];

const UserProfile = () => {
    const { t } = useLanguage();
    const { userPreferences, saveUserPreferences, user, logout, loading } = useApp();
    const { toast } = useToast();

    // Loading and user validation checks
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-400">{t({ ar: 'جاري التحميل...', en: 'Loading...' })}</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">{t({ ar: 'غير مصرح', en: 'Unauthorized' })}</h2>
                    <p className="text-gray-400 mb-6">{t({ ar: 'يجب تسجيل الدخول للوصول لهذه الصفحة', en: 'You need to be logged in to access this page' })}</p>
                    <Button onClick={() => window.location.href = '/login'} className="bg-purple-600 hover:bg-purple-700">
                        {t({ ar: 'تسجيل الدخول', en: 'Login' })}
                    </Button>
                </div>
            </div>
        );
    }

    const [interests, setInterests] = useState([]);
    const [budget, setBudget] = useState('');
    const [travelsWith, setTravelsWith] = useState('Solo');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        // استخدام Optional Chaining لحماية أكبر
        setInterests(userPreferences?.interests || []);
        setBudget(userPreferences?.budget || '');
        setTravelsWith(userPreferences?.travelsWith || 'Solo');
    }, [userPreferences]);

    const handleInterestChange = (interest) => {
        if (!interest) return; // حماية من القيم الفارغة

        setInterests((prev) => {
            // حماية إضافية للتأكد من أن prev مصفوفة
            const currentInterests = Array.isArray(prev) ? prev : [];
            return currentInterests.includes(interest)
                ? currentInterests.filter((i) => i !== interest)
                : [...currentInterests, interest];
        });
    };

    const handleSubmit = () => {
        // حماية إضافية للتأكد من صحة البيانات قبل الحفظ
        const safeInterests = Array.isArray(interests) ? interests : [];
        const safeBudget = budget || '';
        const safeTravelsWith = travelsWith || 'Solo';

        const newPreferences = {
            interests: safeInterests,
            budget: safeBudget,
            travelsWith: safeTravelsWith
        };

        saveUserPreferences(newPreferences);
        setIsEditing(false);
        toast({
            title: t({ ar: "تم الحفظ!", en: "Preferences Saved!" }),
            description: t({ ar: "تم تحديث تفضيلاتك بنجاح.", en: "Your preferences have been successfully updated." }),
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '';

            // Simple, reliable date formatting
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Date formatting error:', error);
            return '';
        }
    };

    return (
        <div className="relative min-h-screen pt-20">
            <div className="container mx-auto px-6 py-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {t({ ar: 'الملف الشخصي', en: 'User Profile' })}
                        </h1>
                        <p className="text-muted-foreground">
                            {t({ ar: 'إدارة معلوماتك وتفضيلاتك', en: 'Manage your information and preferences' })}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* User Information Card */}
                        <div className="lg:col-span-1">
                            <Card className="glass-card border-white/10">
                                <CardHeader className="text-center">
                                    <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto flex items-center justify-center mb-4">
                                        <User className="w-12 h-12 text-white" />
                                    </div>
                                    <CardTitle className="text-white">
                                        {(user?.email ? user.email.split('@')[0] : null) || t({ ar: 'المستخدم', en: 'User' })}
                                    </CardTitle>
                                    <CardDescription>
                                        {t({ ar: 'عضو في SmartTour', en: 'SmartTour Member' })}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm">
                                        <Mail className="w-4 h-4 text-purple-400" />
                                        <span className="text-muted-foreground">{user?.email || ''}</span>
                                    </div>
                                    {user?.created_at && (
                                        <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm">
                                            <Calendar className="w-4 h-4 text-purple-400" />
                                            <span className="text-muted-foreground">
                                                {t({ ar: 'انضم في', en: 'Joined' })} {formatDate(user.created_at) || ''}
                                            </span>
                                        </div>
                                    )}
                                    <div className="pt-4">
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={logout}
                                        >
                                            {t({ ar: 'تسجيل الخروج', en: 'Logout' })}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Travel Preferences Card */}
                        <div className="lg:col-span-2">
                            <Card className="glass-card border-white/10">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-white flex items-center space-x-2 rtl:space-x-reverse">
                                                <Settings className="w-5 h-5" />
                                                <span>{t({ ar: 'تفضيلات السفر', en: 'Travel Preferences' })}</span>
                                            </CardTitle>
                                            <CardDescription>
                                                {t({ ar: 'اضبط تفضيلاتك للحصول على توصيات مخصصة', en: 'Set your preferences for personalized recommendations' })}
                                            </CardDescription>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsEditing(!isEditing)}
                                        >
                                            {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                                            <span className="ml-2">{isEditing ? t({ ar: 'حفظ', en: 'Save' }) : t({ ar: 'تعديل', en: 'Edit' })}</span>
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Current Preferences Summary - محمي بـ Optional Chaining */}
                                    {!isEditing && (
                                        <div className="bg-white/5 rounded-lg p-4 space-y-3">
                                            <h4 className="text-white font-medium mb-3">{t({ ar: 'تفضيلاتك الحالية', en: 'Your Current Preferences' })}</h4>
                                            <div className="text-sm space-y-2">
                                                <div>
                                                    <span className="text-purple-400">{t({ ar: 'الاهتمامات:', en: 'Interests:' })} </span>
                                                    <span className="text-muted-foreground">
                                                        {userPreferences?.interests?.map(interest => t({
                                                            ar: interest === 'Adventure' ? 'مغامرة' :
                                                                interest === 'History' ? 'تاريخ' :
                                                                    interest === 'Food' ? 'طعام' : 'استرخاء',
                                                            en: interest
                                                        })).join(', ') || t({ ar: 'لم يتم التحديد', en: 'Not specified' })}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-purple-400">{t({ ar: 'الميزانية:', en: 'Budget:' })} </span>
                                                    <span className="text-muted-foreground">
                                                        {userPreferences?.budget || t({ ar: 'لم يتم التحديد', en: 'Not specified' })}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-purple-400">{t({ ar: 'نمط السفر:', en: 'Travel Style:' })} </span>
                                                    <span className="text-muted-foreground">
                                                        {userPreferences?.travelsWith || t({ ar: 'لم يتم التحديد', en: 'Not specified' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Interests Section */}
                                    <div>
                                        <Label className="text-white mb-3 block">
                                            {t({ ar: 'الاهتمامات', en: 'Interests' })}
                                        </Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {interestsOptions.map((interest) => (
                                                <div key={interest} className="flex items-center space-x-2 rtl:space-x-reverse">
                                                    <Checkbox
                                                        id={interest}
                                                        checked={interests.includes(interest)}
                                                        onCheckedChange={() => handleInterestChange(interest)}
                                                        disabled={!isEditing}
                                                        className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                                    />
                                                    <Label htmlFor={interest} className="text-muted-foreground cursor-pointer">
                                                        {t({
                                                            ar: interest === 'Adventure' ? 'مغامرة' :
                                                                interest === 'History' ? 'تاريخ' :
                                                                    interest === 'Food' ? 'طعام' : 'استرخاء',
                                                            en: interest
                                                        })}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Budget Section */}
                                    <div>
                                        <Label className="text-white mb-3 block">
                                            {t({ ar: 'الميزانية', en: 'Budget' })}
                                        </Label>
                                        <Select value={budget} onValueChange={setBudget} disabled={!isEditing}>
                                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                                <SelectValue placeholder={t({ ar: 'اختر الميزانية', en: 'Select Budget' })} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {budgetOptions.map((option) => (
                                                    <SelectItem key={option} value={option}>
                                                        {t({
                                                            ar: option === 'Economy' ? 'اقتصادي' :
                                                                option === 'Mid-range' ? 'متوسط' : 'فاخر',
                                                            en: option
                                                        })}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Travel Style Section */}
                                    <div>
                                        <Label className="text-white mb-3 block">
                                            {t({ ar: 'نمط السفر', en: 'Travel Style' })}
                                        </Label>
                                        <Select value={travelsWith} onValueChange={setTravelsWith} disabled={!isEditing}>
                                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Solo">{t({ ar: 'منفرد', en: 'Solo' })}</SelectItem>
                                                <SelectItem value="Family">{t({ ar: 'عائلي', en: 'Family' })}</SelectItem>
                                                <SelectItem value="Friends">{t({ ar: 'أصدقاء', en: 'Friends' })}</SelectItem>
                                                <SelectItem value="Partner">{t({ ar: 'شريك', en: 'Partner' })}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Save Button */}
                                    {isEditing && (
                                        <div className="pt-4">
                                            <Button onClick={handleSubmit} className="w-full gradient-purple">
                                                <Save className="w-4 h-4 mr-2" />
                                                {t({ ar: 'حفظ التفضيلات', en: 'Save Preferences' })}
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20 pointer-events-none" />
            <div className="absolute top-40 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-40 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        </div>
    );
};

export default UserProfile;