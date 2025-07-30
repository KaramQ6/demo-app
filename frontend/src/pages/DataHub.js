import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { iotData as mockIotData } from '../mock'; // Ensure this path is correct
import { Card, CardContent } from '../components/ui/card';
import { MapPin, Thermometer, Activity, Zap } from 'lucide-react';

const DataHub = () => {
  const { t, isRTL } = useLanguage();
  const iotData = mockIotData; // Using mock data directly

  // Defensive Check: Ensure iotData is a valid array before rendering
  if (!iotData || !Array.isArray(iotData)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Error: Could not load IoT data. Please check the mock file.
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