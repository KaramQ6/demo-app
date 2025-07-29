import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowRight, ArrowLeft, MapPin, Clock, Bot, Brain, Zap, Star, Thermometer, Loader2 } from 'lucide-react';
import { destinations } from '../mock';

const Homepage = () => {
  const { t, language, isRTL } = useLanguage();
  const { openChatbot, sendMessage, liveData, isLoadingData } = useApp();
  const heroRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth - 0.5) * 20;
        const y = (clientY / innerHeight - 0.5) * 20;
        heroRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleCTAClick = () => {
    openChatbot();
    const message = t({
      ar: 'أهلاً! أريد التخطيط لرحلة في الأردن.',
      en: 'Hello! I want to plan a trip in Jordan.'
    });
    sendMessage(message);
  };

  const handleLocationStatusClick = () => {
    if (!liveData || !liveData.cityName) return;
    openChatbot();
    const message = t({
      ar: `أخبرني المزيد عن ${liveData.cityName}.`,
      en: `Tell me more about ${liveData.cityName}.`
    });
    sendMessage(message);
  };

  const howItWorksSteps = [
    { icon: Brain, title: { ar: 'تحدث مع جواد', en: 'Talk to Jawad' }, description: { ar: 'أخبرنا عن اهتماماتك', en: 'Tell us your interests' } },
    { icon: Zap, title: { ar: 'احصل على خطة ذكية', en: 'Get a Smart Plan' }, description: { ar: 'استلم خطة مخصصة', en: 'Receive a custom plan' } },
    { icon: Star, title: { ar: 'استكشف كالمحترفين', en: 'Explore Like a Pro' }, description: { ar: 'استخدم أدواتنا التفاعلية', en: 'Use our interactive tools' } }
  ];

  const featuredDestinations = destinations.slice(0, 3);

  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div ref={heroRef} className="absolute inset-0 w-full h-full transition-transform duration-100 ease-out">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-900/60 to-black/80 z-10"></div>
          <img src="https://images.unsplash.com/photo-1574082512734-8336f25bb9d8" alt="Wadi Rum Desert" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">{t({ ar: 'اكتشف الأردن الحقيقي، بعيداً عن الزحام', en: 'Discover the Real Jordan, Away from the Crowds' })}</h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">{t({ ar: 'خطط لرحلتك بذكاء مع مرشدك الشخصي جواد', en: 'Plan your trip intelligently with your personal guide Jawad' })}</p>
          <Button onClick={handleCTAClick} size="lg" className="gradient-purple text-white px-8 py-4 text-lg font-semibold">
            {t({ ar: 'خطط لرحلتك الآن', en: 'Plan Your Trip Now' })} {isRTL ? <ArrowLeft className="ml-2" /> : <ArrowRight className="ml-2" />}
          </Button>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xs md:max-w-sm px-6 z-20">
          <button onClick={handleLocationStatusClick} className="w-full glass-card hover:bg-white/10 transition-all rounded-2xl p-3 border border-white/20 animate-fade-in-up group">
            {isLoadingData ? (
              <div className="flex items-center justify-center text-white text-sm"><Loader2 className="w-4 h-4 mr-2 animate-spin" /><span>{t({ ar: 'جاري تحديد الموقع...', en: 'Detecting location...' })}</span></div>
            ) : liveData && liveData.cityName ? (
              <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse text-white">
                <div className="flex items-center space-x-1 rtl:space-x-reverse"><MapPin className="w-4 h-4 text-blue-400" /><span className="text-sm font-medium">{liveData.cityName}</span></div>
                <div className="flex items-center space-x-1 rtl:space-x-reverse"><Thermometer className="w-4 h-4 text-orange-400" /><span className="text-sm font-medium">{liveData.temperature}°م</span></div>
              </div>
            ) : (
              <div className="text-center text-xs text-red-400">{t({ ar: 'فشل تحديد الموقع', en: 'Location access failed' })}</div>
            )}
          </button>
        </div>
      </section>
      {/* ... Other sections remain the same ... */}
    </div>
  );
};

export default Homepage;