import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { Settings, Key, CheckCircle, XCircle, RefreshCw, ExternalLink, Info } from 'lucide-react';

const CrowdDataSettings = () => {
    const { t } = useLanguage();
    const { realCrowdData, initializeRealCrowdData } = useApp();
    const [apiKey, setApiKey] = useState('');
    const [testResult, setTestResult] = useState(null);
    const [isTesting, setIsTesting] = useState(false);
    const [isConfigured, setIsConfigured] = useState(false);

    useEffect(() => {
        // فحص إذا كان API key موجود
        const existingKey = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;
        if (existingKey && existingKey !== 'your_google_places_api_key_here') {
            setIsConfigured(true);
            setApiKey('••••••••••••••••' + existingKey.slice(-4));
        }
    }, []);

    // اختبار API key
    const testApiKey = async () => {
        setIsTesting(true);
        setTestResult(null);

        try {
            // اختبار بسيط مع البتراء
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJW_WKdJZQsBQR1Rn7jnhBwFk&fields=name,rating&key=${apiKey}`
            );

            if (response.ok) {
                const data = await response.json();
                if (data.status === 'OK') {
                    setTestResult({
                        success: true,
                        message: t({
                            ar: 'تم الاتصال بنجاح! API key يعمل بشكل صحيح',
                            en: 'Connection successful! API key is working correctly'
                        })
                    });
                    setIsConfigured(true);
                } else {
                    setTestResult({
                        success: false,
                        message: t({
                            ar: `خطأ في API: ${data.error_message || data.status}`,
                            en: `API Error: ${data.error_message || data.status}`
                        })
                    });
                }
            } else {
                setTestResult({
                    success: false,
                    message: t({
                        ar: 'فشل في الاتصال بخدمة Google Places',
                        en: 'Failed to connect to Google Places service'
                    })
                });
            }
        } catch (error) {
            setTestResult({
                success: false,
                message: t({
                    ar: 'خطأ في الشبكة أو مشكلة في CORS',
                    en: 'Network error or CORS issue'
                })
            });
        } finally {
            setIsTesting(false);
        }
    };

    // إعادة تحميل بيانات الازدحام
    const refreshCrowdData = async () => {
        await initializeRealCrowdData();
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-900 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-4 flex items-center">
                    <Settings className="w-8 h-8 mr-3 text-blue-400" />
                    {t({ ar: 'إعدادات بيانات الازدحام', en: 'Crowd Data Settings' })}
                </h1>
                <p className="text-gray-400">
                    {t({
                        ar: 'قم بإعداد Google Places API للحصول على بيانات ازدحام حقيقية للأماكن السياحية في الأردن',
                        en: 'Configure Google Places API to get real crowd data for tourist attractions in Jordan'
                    })}
                </p>
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">API Status</p>
                            <p className={`text-lg font-semibold ${isConfigured ? 'text-green-400' : 'text-red-400'}`}>
                                {isConfigured ?
                                    t({ ar: 'مُفعل', en: 'Active' }) :
                                    t({ ar: 'غير مُفعل', en: 'Inactive' })
                                }
                            </p>
                        </div>
                        {isConfigured ?
                            <CheckCircle className="w-8 h-8 text-green-400" /> :
                            <XCircle className="w-8 h-8 text-red-400" />
                        }
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">
                                {t({ ar: 'الوجهات المتتبعة', en: 'Tracked Destinations' })}
                            </p>
                            <p className="text-lg font-semibold text-blue-400">
                                {Object.keys(realCrowdData || {}).length}/10
                            </p>
                        </div>
                        <RefreshCw className="w-8 h-8 text-blue-400" />
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">
                                {t({ ar: 'آخر تحديث', en: 'Last Update' })}
                            </p>
                            <p className="text-lg font-semibold text-yellow-400">
                                {Object.keys(realCrowdData || {}).length > 0 ?
                                    t({ ar: 'نشط', en: 'Active' }) :
                                    t({ ar: 'متوقف', en: 'Stopped' })
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Setup Instructions */}
            {!isConfigured && (
                <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-6 mb-8">
                    <h3 className="text-xl font-semibold text-blue-400 mb-4 flex items-center">
                        <Info className="w-5 h-5 mr-2" />
                        {t({ ar: 'خطوات الإعداد', en: 'Setup Instructions' })}
                    </h3>

                    <ol className="space-y-3 text-gray-300">
                        <li className="flex items-start">
                            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
                            <div>
                                <p className="font-medium">
                                    {t({ ar: 'إنشاء مشروع Google Cloud', en: 'Create Google Cloud Project' })}
                                </p>
                                <p className="text-sm text-gray-400">
                                    {t({
                                        ar: 'اذهب إلى Google Cloud Console وأنشئ مشروع جديد أو استخدم مشروع موجود',
                                        en: 'Go to Google Cloud Console and create a new project or use existing one'
                                    })}
                                </p>
                                <a
                                    href="https://console.cloud.google.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm mt-1"
                                >
                                    {t({ ar: 'فتح Google Cloud Console', en: 'Open Google Cloud Console' })}
                                    <ExternalLink className="w-3 h-3 ml-1" />
                                </a>
                            </div>
                        </li>

                        <li className="flex items-start">
                            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
                            <div>
                                <p className="font-medium">
                                    {t({ ar: 'تفعيل Places API', en: 'Enable Places API' })}
                                </p>
                                <p className="text-sm text-gray-400">
                                    {t({
                                        ar: 'في قسم APIs & Services، ابحث عن Places API وقم بتفعيله',
                                        en: 'In APIs & Services section, search for Places API and enable it'
                                    })}
                                </p>
                            </div>
                        </li>

                        <li className="flex items-start">
                            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
                            <div>
                                <p className="font-medium">
                                    {t({ ar: 'إنشاء API Key', en: 'Create API Key' })}
                                </p>
                                <p className="text-sm text-gray-400">
                                    {t({
                                        ar: 'في قسم Credentials، أنشئ API key جديد واحتفظ به في مكان آمن',
                                        en: 'In Credentials section, create a new API key and keep it secure'
                                    })}
                                </p>
                            </div>
                        </li>

                        <li className="flex items-start">
                            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">4</span>
                            <div>
                                <p className="font-medium">
                                    {t({ ar: 'إضافة المفتاح إلى ملف البيئة', en: 'Add Key to Environment File' })}
                                </p>
                                <p className="text-sm text-gray-400">
                                    {t({
                                        ar: 'أنشئ ملف .env في مجلد frontend وأضف: REACT_APP_GOOGLE_PLACES_API_KEY=your_key_here',
                                        en: 'Create .env file in frontend folder and add: REACT_APP_GOOGLE_PLACES_API_KEY=your_key_here'
                                    })}
                                </p>
                            </div>
                        </li>
                    </ol>
                </div>
            )}

            {/* API Key Test */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Key className="w-5 h-5 mr-2" />
                    {t({ ar: 'اختبار API Key', en: 'Test API Key' })}
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Google Places API Key
                        </label>
                        <div className="flex space-x-3">
                            <input
                                type="text"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="AIzaSy..."
                                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isConfigured}
                            />
                            <button
                                onClick={testApiKey}
                                disabled={!apiKey || isTesting || isConfigured}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md transition-colors flex items-center"
                            >
                                {isTesting ? (
                                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                )}
                                {t({ ar: 'اختبار', en: 'Test' })}
                            </button>
                        </div>
                    </div>

                    {testResult && (
                        <div className={`p-3 rounded-md flex items-center ${testResult.success
                                ? 'bg-green-900/30 border border-green-500/50 text-green-400'
                                : 'bg-red-900/30 border border-red-500/50 text-red-400'
                            }`}>
                            {testResult.success ?
                                <CheckCircle className="w-5 h-5 mr-2" /> :
                                <XCircle className="w-5 h-5 mr-2" />
                            }
                            {testResult.message}
                        </div>
                    )}
                </div>
            </div>

            {/* Current Data Status */}
            {isConfigured && (
                <div className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-white">
                            {t({ ar: 'حالة البيانات الحالية', en: 'Current Data Status' })}
                        </h3>
                        <button
                            onClick={refreshCrowdData}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            {t({ ar: 'تحديث', en: 'Refresh' })}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(realCrowdData || {}).map(([destinationId, data]) => (
                            <div key={destinationId} className="bg-gray-700 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-white capitalize">{destinationId}</h4>
                                    {data.dataSource === 'google_places_api' ?
                                        <CheckCircle className="w-5 h-5 text-green-400" /> :
                                        <XCircle className="w-5 h-5 text-yellow-400" />
                                    }
                                </div>
                                <div className="text-sm text-gray-300 space-y-1">
                                    <p>Crowd: {data.crowdLevel}%</p>
                                    <p>Visitors: {data.currentVisitors}</p>
                                    <p>Source: {data.dataSource}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CrowdDataSettings;
