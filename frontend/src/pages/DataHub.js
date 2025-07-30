import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent } from '../components/ui/card';
import { MapPin, Thermometer, Activity, Zap } from 'lucide-react';

const DataHub = () => {
  const { t, isRTL } = useLanguage();
  const [iotData, setIotData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/iot-data.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setIotData(data);
      } catch (error) {
        console.error("Failed to fetch IoT data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        {t({ ar: 'جاري تحميل البيانات...', en: 'Loading data...' })}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        {t({ ar: 'خطأ في تحميل البيانات: ', en: 'Error loading data: ' })}{error.message}
      </div>
    );
  }

  if (!iotData || !Array.isArray(iotData) || iotData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        {t({ ar: 'لا توجد بيانات IoT متاحة.', en: 'No IoT data available.' })}
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-6 text-white">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-bold font-['Montserrat'] text-white mb-6 text-center">
          {t({ ar: 'بيانات IoT الخام', en: 'Raw IoT Data' })}
        </h1>
        <pre className="bg-gray-800 p-4 rounded-lg overflow-auto">
          <code>{JSON.stringify(iotData, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
};

export default DataHub;