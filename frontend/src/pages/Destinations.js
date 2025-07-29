import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { MapPin, Clock, Users, Activity, Brain, Zap, MessageCircle } from 'lucide-react';
import { destinations } from '../mock';

const Destinations = () => {
  const { t, language } = useLanguage();
  const { openChatbot, iotData } = useApp();

  const pageTitle = {
    ar: 'جميع الوجهات السياحية',
    en: 'All Tourist Destinations'
  };

  const pageDescription = {
    ar: 'استكشف أجمل الوجهات السياحية في الأردن مع مرشدك الذكي جواد والبيانات الحية',
    en: 'Explore the most beautiful tourist destinations in Jordan with your smart guide Jawad and live data'
  };

  const handleGetRecommendations = () => {
    const message = language === 'ar' 
      ? 'أريد توصيات للوجهات السياحية في الأردن بناءً على اهتماماتي'
      : 'I want recommendations for tourist destinations in Jordan based on my interests';
    
    openChatbot(message);
  };

  const getCrowdLevel = (destinationId) => {
    const data = iotData[destinationId];
    if (!data) return { level: 'medium', percentage: 50 };
    
    const percentage = data.crowdLevel || 50;
    let level = 'medium';
    if (percentage < 40) level = 'low';
    else if (percentage > 70) level = 'high';
    
    return { level, percentage: Math.round(percentage) };
  };

  const getCrowdColor = (level) => {
    switch (level) {
      case 'low': return 'text-green-400';
      case 'high': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-['Montserrat']">
            {t(pageTitle)}
          </h1>
          <div className="w-24 h-1 gradient-purple mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto font-['Open_Sans'] mb-12">
            {t(pageDescription)}
          </p>
          
          {/* Live Status and CTA */}
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 rtl:md:space-x-reverse">
            <div className="flex items-center space-x-3 rtl:space-x-reverse glass-card p-4 rounded-2xl">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-glow"></div>
              <Activity className="w-6 h-6 text-green-500" />
              <span className="text-lg font-medium text-white font-['Open_Sans']">
                {t({ ar: 'بيانات مباشرة نشطة', en: 'Live Data Active' })}
              </span>
            </div>
            
            <Button
              onClick={handleGetRecommendations}
              className="gradient-purple hover:scale-105 px-8 py-4 text-lg font-semibold rounded-2xl interactive-button shadow-xl font-['Open_Sans']"
            >
              <MessageCircle className="mr-3 rtl:mr-0 rtl:ml-3 h-5 w-5" />
              {t({ ar: 'احصل على توصيات', en: 'Get Recommendations' })}
            </Button>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {destinations.map((destination, index) => {
            const crowdData = getCrowdLevel(destination.id);
            
            return (
              <Link key={destination.id} to={`/destinations/${destination.id}`}>
                <Card className="glass-card interactive-card h-full overflow-hidden border-white/10 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={destination.image}
                      alt={t(destination.name)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 gradient-overlay" />
                    
                    {/* Live Status and AI Badge */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between">
                      <Badge className="glass bg-green-500/20 text-green-400 border-green-500/30 px-3 py-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 rtl:mr-0 rtl:ml-2 animate-pulse-glow"></div>
                        {t({ ar: 'مباشر', en: 'Live' })}
                      </Badge>
                      <Badge className="glass bg-primary/20 text-primary border-primary/30 px-3 py-2">
                        <Brain className="w-3 h-3 mr-2 rtl:mr-0 rtl:ml-2" />
                        {t({ ar: 'ذكي', en: 'AI' })}
                      </Badge>
                    </div>
                    
                    {/* Destination Name Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white text-2xl font-bold mb-3 font-['Montserrat']">
                        {t(destination.name)}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <MapPin className="w-5 h-5 text-primary" />
                          <span className="text-base text-white/80 font-['Open_Sans']">
                            {t({ ar: 'الأردن', en: 'Jordan' })}
                          </span>
                        </div>
                        {/* Live crowd level indicator */}
                        <div className="flex items-center space-x-2 rtl:space-x-reverse glass px-3 py-2 rounded-full">
                          <Users className={`w-4 h-4 ${getCrowdColor(crowdData.level)}`} />
                          <span className="text-sm text-white font-['Open_Sans'] font-medium">
                            {crowdData.percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-8">
                    <p className="text-muted-foreground leading-relaxed mb-6 font-['Open_Sans'] text-base">
                      {t(destination.shortDescription)}
                    </p>
                    
                    {/* Destination Features */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse glass p-3 rounded-lg">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-white font-['Open_Sans']">
                          {t({ ar: 'يوم كامل', en: 'Full day' })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse glass p-3 rounded-lg">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-white font-['Open_Sans']">
                          {t({ ar: 'للعائلات', en: 'Family' })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse glass p-3 rounded-lg">
                        <Activity className="w-4 h-4 text-primary" />
                        <span className="text-white font-['Open_Sans']">
                          {t({ ar: 'IoT', en: 'IoT Enabled' })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse glass p-3 rounded-lg">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-white font-['Open_Sans']">
                          {t({ ar: 'ذكي', en: 'Smart' })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="glass-card rounded-3xl p-12 shadow-2xl max-w-3xl mx-auto border border-primary/20">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 gradient-purple rounded-full mb-6 animate-pulse-glow">
                <Brain className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-6 font-['Montserrat']">
              {t({ ar: 'هل تحتاج مساعدة في التخطيط؟', en: 'Need help planning?' })}
            </h2>
            <p className="text-muted-foreground mb-8 font-['Open_Sans'] text-lg leading-relaxed">
              {t({ 
                ar: 'تحدث مع جواد واحصل على خطة سفر مخصصة تناسب اهتماماتك مع البيانات الحية وتوصيات الذكاء الاصطناعي', 
                en: 'Talk to Jawad and get a custom travel plan that suits your interests with live data and AI recommendations' 
              })}
            </p>
            <div className="flex items-center justify-center space-x-8 rtl:space-x-reverse text-base text-muted-foreground mb-8">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Activity className="w-5 h-5 text-green-400" />
                <span>{t({ ar: 'بيانات حية', en: 'Live Data' })}</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Brain className="w-5 h-5 text-primary" />
                <span>{t({ ar: 'ذكاء اصطناعي', en: 'AI Powered' })}</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span>{t({ ar: 'فوري', en: 'Instant' })}</span>
              </div>
            </div>
            <Button
              onClick={handleGetRecommendations}
              className="gradient-purple hover:scale-105 px-12 py-4 text-xl font-semibold rounded-2xl interactive-button shadow-xl font-['Open_Sans']"
            >
              <MessageCircle className="mr-3 rtl:mr-0 rtl:ml-3 h-6 w-6" />
              {t({ ar: 'ابدأ المحادثة مع جواد', en: 'Start Chat with Jawad' })}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Destinations;