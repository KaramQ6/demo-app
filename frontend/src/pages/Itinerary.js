import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { Loader2, Info, CheckCircle, XCircle, Users } from 'lucide-react';

const Itinerary = () => {
  const { t } = useLanguage();
  const { itineraryData, isItineraryLoading } = useApp();

  const handleAcceptSuggestion = () => {
    console.log('Suggestion Accepted!');
    alert('Suggestion Accepted! (Check console)');
    // Implement logic to update the trip plan with the suggestion
  };

  const handleKeepOriginalPlan = () => {
    console.log('Keeping Original Plan!');
    alert('Keeping Original Plan! (Check console)');
    // Implement logic to dismiss the suggestion and keep the original plan
  };

  const getCrowdLevelColor = (level) => {
    if (level > 80) return 'text-red-500';
    if (level > 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  if (isItineraryLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
        <span className="ml-3 text-xl">{t({ ar: 'جاري تحميل خطة الرحلة...', en: 'Loading trip plan...' })}</span>
      </div>
    );
  }

  if (!itineraryData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-red-500 p-4">
        <XCircle className="w-16 h-16 mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t({ ar: 'خطأ في تحميل خطة الرحلة', en: 'Error loading trip plan' })}</h2>
        <p className="text-lg text-center">{t({ ar: 'تعذر تحميل بيانات خطة الرحلة. يرجى المحاولة مرة أخرى.', en: 'Failed to load trip plan data. Please try again.' })}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto max-w-4xl bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center text-purple-600 dark:text-purple-400">
          {t({ ar: 'خطتك الذكية للرحلة', en: 'Your Smart Trip Plan' })}
        </h1>

        {/* Crowd Level Display */}
        {itineraryData.crowdLevel !== undefined && (
          <div className="flex items-center justify-center mb-6 text-lg font-semibold">
            <Users className={`w-6 h-6 mr-2 ${getCrowdLevelColor(itineraryData.crowdLevel)}`} />
            <span className={getCrowdLevelColor(itineraryData.crowdLevel)}>
              {t({ ar: 'مستوى الازدحام:', en: 'Crowd Level:' })} {itineraryData.crowdLevel}%
            </span>
          </div>
        )}

        {/* Main Plan Details */}
        <div className="mb-8 p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-inner">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-white">
            {t({ ar: 'تفاصيل الخطة', en: 'Plan Details' })}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {itineraryData.tripPlan?.details || t({ ar: 'لا توجد تفاصيل خطة متاحة.', en: 'No plan details available.' })}
          </p>
        </div>

        {/* Suggestion Box */}
        {itineraryData.planModified === "true" && itineraryData.suggestedAlternative && (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-500/50 p-6 rounded-lg shadow-md animate-fade-in-up">
            <div className="flex items-center mb-4">
              <Info className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-3" />
              <h3 className="text-xl font-semibold text-yellow-800 dark:text-yellow-300">
                {t({ ar: 'اقتراح بديل', en: 'Alternative Suggestion' })}
              </h3>
            </div>
            <p className="text-yellow-700 dark:text-yellow-200 mb-6">
              {itineraryData.suggestedAlternative}
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
              <button
                onClick={handleAcceptSuggestion}
                className="flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                {t({ ar: 'قبول الاقتراح', en: 'Accept Suggestion' })}
              </button>
              <button
                onClick={handleKeepOriginalPlan}
                className="flex items-center justify-center px-6 py-3 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                <XCircle className="w-5 h-5 mr-2" />
                {t({ ar: 'الاحتفاظ بالخطة الأصلية', en: 'Keep Original Plan' })}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Itinerary;