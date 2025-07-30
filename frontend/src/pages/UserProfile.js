import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';

const UserProfile = () => {
  const { t } = useLanguage();
  const { userPreferences, saveUserPreferences } = useApp();

  const [interests, setInterests] = useState([]);
  const [budget, setBudget] = useState('');
  const [travelsWith, setTravelsWith] = useState('');

  useEffect(() => {
    if (userPreferences) {
      setInterests(userPreferences.interests || []);
      setBudget(userPreferences.budget || '');
      setTravelsWith(userPreferences.travelsWith || '');
    }
  }, [userPreferences]);

  const handleInterestChange = (e) => {
    const { value, checked } = e.target;
    setInterests(prev => 
      checked ? [...prev, value] : prev.filter(interest => interest !== value)
    );
  };

  const handleBudgetChange = (e) => {
    setBudget(e.target.value);
  };

  const handleTravelsWithChange = (e) => {
    setTravelsWith(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const preferences = { interests, budget, travelsWith };
    saveUserPreferences(preferences);
    alert('Preferences Saved!');
  };

  return (
    <div className="min-h-screen py-20 px-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto max-w-3xl bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {t({ ar: 'ملف تعريف المستخدم', en: 'User Profile' })}
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          {t({ ar: 'قم بتخصيص تفضيلات سفرك للحصول على توصيات أفضل.', en: 'Customize your travel preferences for better recommendations.' })}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Interests Section */}
          <div>
            <label className="block text-lg font-medium mb-2">
              {t({ ar: 'الاهتمامات', en: 'Interests' })}
            </label>
            <div className="grid grid-cols-2 gap-4">
              {['Adventure', 'History', 'Food', 'Relaxation', 'Nature', 'Culture'].map(interest => (
                <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    value={interest}
                    checked={interests.includes(interest)}
                    onChange={handleInterestChange}
                    className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-gray-700 dark:text-gray-200">{t({ ar: interest, en: interest })}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Budget Section */}
          <div>
            <label htmlFor="budget" className="block text-lg font-medium mb-2">
              {t({ ar: 'الميزانية', en: 'Budget' })}
            </label>
            <select
              id="budget"
              value={budget}
              onChange={handleBudgetChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-700 dark:text-white"
            >
              <option value="">{t({ ar: 'اختر ميزانية', en: 'Select a budget' })}</option>
              <option value="Economy">{t({ ar: 'اقتصادي', en: 'Economy' })}</option>
              <option value="Mid-range">{t({ ar: 'متوسط', en: 'Mid-range' })}</option>
              <option value="Luxury">{t({ ar: 'فاخر', en: 'Luxury' })}</option>
            </select>
          </div>

          {/* Travels With Section */}
          <div>
            <label className="block text-lg font-medium mb-2">
              {t({ ar: 'السفر مع', en: 'Travels With' })}
            </label>
            <div className="mt-1 space-y-2">
              {['Solo', 'Family', 'Friends', 'Partner'].map(option => (
                <label key={option} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="travelsWith"
                    value={option}
                    checked={travelsWith === option}
                    onChange={handleTravelsWithChange}
                    className="form-radio h-5 w-5 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-700 dark:text-gray-200">{t({ ar: option, en: option })}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Save Preferences Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-md shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {t({ ar: 'حفظ التفضيلات', en: 'Save Preferences' })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;