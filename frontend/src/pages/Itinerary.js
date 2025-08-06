import React, { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Loader2, Info, CheckCircle, XCircle, Users } from 'lucide-react';

const Itinerary = () => {
  const { t } = useLanguage();
  // استورد المتغيرات الجديدة من السياق
  const { suggestedItinerary, isSuggestingItinerary, fetchSuggestedItinerary } = useApp();

  // استدعِ الدالة مرة واحدة فقط عند تحميل المكون
  useEffect(() => {
    fetchSuggestedItinerary();
  }, []); // [] تضمن أن هذا يعمل مرة واحدة فقط

  const getCrowdLevelColor = (level) => {
    if (!level) return 'text-gray-400';
    if (level > 80) return 'text-red-500';
    if (level > 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  if (isSuggestingItinerary) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="text-center relative z-10">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
          <span className="text-xl text-white">{t({ ar: 'جواد يحضر لك اقتراحًا...', en: 'Jawad is preparing a suggestion...' })}</span>
        </div>
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20 pointer-events-none" />
        <div className="absolute top-40 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>
    );
  }

  if (!suggestedItinerary) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center relative z-10">
          <XCircle className="w-16 h-16 mb-4 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold mb-2 text-white">{t({ ar: 'خطأ في تحميل الاقتراح', en: 'Error Loading Suggestion' })}</h2>
          <p className="text-lg text-center text-muted-foreground">{t({ ar: 'تعذر تحميل الاقتراح. يرجى التأكد من اتصالك بالإنترنت والمحاولة مرة أخرى.', en: 'Failed to load suggestion. Please check your internet connection and try again.' })}</p>
        </div>
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20 pointer-events-none" />
        <div className="absolute top-40 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>
    );
  }

  // استخدم `suggestedItinerary` بدلاً من `itineraryData`
  const { tripPlan, suggestedAlternative, planModified, crowdLevel } = suggestedItinerary;

  return (
    <div className="relative min-h-screen py-20 px-6">
      <div className="container mx-auto max-w-4xl glass-card border-white/10 p-8 rounded-lg relative z-10">
        <h1 className="text-4xl font-bold mb-6 text-center text-purple-600 dark:text-purple-400">
          {t({ ar: 'خطتك الذكية للرحلة', en: 'Your Smart Trip Plan' })}
        </h1>

        {/* Crowd Level Display */}
        {crowdLevel !== undefined && (
          <div className="flex items-center justify-center mb-6 text-lg font-semibold">
            <Users className={`w-6 h-6 mr-2 ${getCrowdLevelColor(crowdLevel)}`} />
            <span className={getCrowdLevelColor(crowdLevel)}>
              {t({ ar: 'مستوى الازدحام:', en: 'Crowd Level:' })} {crowdLevel}%
            </span>
          </div>
        )}

        {/* Main Plan Details */}
        <div className="mb-8 p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-inner">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-white">
            {t({ ar: 'تفاصيل الخطة', en: 'Plan Details' })}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {tripPlan?.details || tripPlan || t({ ar: 'لا توجد تفاصيل خطة متاحة.', en: 'No plan details available.' })}
          </p>
        </div>

        {/* Suggestion Box */}
        {planModified === "true" && suggestedAlternative && (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-500/50 p-6 rounded-lg shadow-md animate-fade-in-up">
            <div className="flex items-center mb-4">
              <Info className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-3" />
              <h3 className="text-xl font-semibold text-yellow-800 dark:text-yellow-300">
                {t({ ar: 'اقتراح بديل', en: 'Alternative Suggestion' })}
              </h3>
            </div>
            <p className="text-yellow-700 dark:text-yellow-200 mb-6">
              {suggestedAlternative}
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
              <button
                onClick={() => fetchSuggestedItinerary()}
                className="flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                {t({ ar: 'تحديث الاقتراح', en: 'Refresh Suggestion' })}
              </button>
              <button
                onClick={() => window.history.back()}
                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                <XCircle className="w-5 h-5 mr-2" />
                {t({ ar: 'العودة', en: 'Go Back' })}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20 pointer-events-none" />
      <div className="absolute top-40 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
    </div>
  );
};

export default Itinerary;