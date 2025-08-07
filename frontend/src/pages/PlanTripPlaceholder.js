import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Bot, Calendar, MapPin, Users, Star, ArrowRight, ArrowLeft } from 'lucide-react';

const PlanTripPlaceholder = () => {
  const { t, isRTL } = useLanguage();
  const { openChatbot, sendMessage } = useApp();

  const handleStartPlanning = () => {
    openChatbot();
    const message = t({
      ar: 'مرحبا جواد! أريد أن أخطط لرحلة مميزة في الأردن. من أين نبدأ؟',
      en: 'Hello Jawad! I want to plan an amazing trip to Jordan. Where do we start?'
    });
    sendMessage(message);
  };

  const planningSteps = [
    {
      icon: Users,
      title: { ar: 'أخبرنا عنك', en: 'Tell Us About You' },
      description: { ar: 'مع كم شخص تسافر؟ ما اهتماماتك؟', en: 'Who are you traveling with? What are your interests?' }
    },
    {
      icon: Calendar,
      title: { ar: 'اختر التواريخ', en: 'Choose Your Dates' },
      description: { ar: 'متى تريد السفر؟ كم يوم؟', en: 'When do you want to travel? How many days?' }
    },
    {
      icon: MapPin,
      title: { ar: 'احصل على خطة مخصصة', en: 'Get Your Custom Plan' },
      description: { ar: 'جواد سيصنع لك خطة مثالية', en: 'Jawad will create your perfect itinerary' }
    }
  ];

  const quickPlanOptions = [
    {
      title: { ar: 'رحلة تاريخية - 3 أيام', en: 'Historical Journey - 3 Days' },
      destinations: { ar: 'البتراء • جرش • عمان', en: 'Petra • Jerash • Amman' },
      highlight: { ar: 'الأكثر شعبية', en: 'Most Popular' }
    },
    {
      title: { ar: 'مغامرة طبيعية - 4 أيام', en: 'Nature Adventure - 4 Days' },
      destinations: { ar: 'وادي رم • العقبة • البحر الميت', en: 'Wadi Rum • Aqaba • Dead Sea' },
      highlight: { ar: 'للباحثين عن المغامرة', en: 'For Adventure Seekers' }
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20"></div>
      
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="w-20 h-20 gradient-purple rounded-full flex items-center justify-center mx-auto mb-6">
            <Bot className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-['Montserrat']">
            {t({ ar: 'خطط رحلتك المثالية مع جواد', en: 'Plan Your Perfect Trip with Jawad' })}
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t({ 
              ar: 'دع مرشدك الذكي جواد يصنع لك خطة سفر مخصصة بناءً على اهتماماتك ووقتك وميزانيتك', 
              en: 'Let your smart guide Jawad create a personalized travel plan based on your interests, time, and budget' 
            })}
          </p>

          <Button 
            onClick={handleStartPlanning}
            size="lg" 
            className="gradient-purple text-white px-8 py-4 text-lg font-semibold hover:scale-105 transition-transform shadow-2xl"
          >
            {t({ ar: 'ابدأ التخطيط الآن', en: 'Start Planning Now' })}
            {isRTL ? <ArrowLeft className="ml-2" /> : <ArrowRight className="ml-2" />}
          </Button>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12 font-['Montserrat']">
            {t({ ar: 'كيف يعمل التخطيط الذكي', en: 'How Smart Planning Works' })}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {planningSteps.map((step, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 font-['Montserrat']">
                  {t(step.title)}
                </h3>
                
                <p className="text-gray-300 leading-relaxed font-['Open_Sans']">
                  {t(step.description)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Plan Options */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12 font-['Montserrat']">
            {t({ ar: 'أو اختر خطة جاهزة', en: 'Or Choose a Ready Plan' })}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {quickPlanOptions.map((option, index) => (
              <Card key={index} className="glass-card border-white/10 hover:border-purple-500/30 transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-3 py-1 rounded-full">
                      {t(option.highlight)}
                    </div>
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {t(option.title)}
                  </h3>
                  
                  <p className="text-gray-300 text-sm mb-4">
                    {t(option.destinations)}
                  </p>
                  
                  <Button 
                    onClick={handleStartPlanning}
                    variant="outline" 
                    className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                  >
                    {t({ ar: 'اختر هذه الخطة', en: 'Choose This Plan' })}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="glass-card border-white/10 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <Bot className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              
              <h3 className="text-2xl font-bold text-white mb-4 font-['Montserrat']">
                {t({ ar: 'جواد جاهز لمساعدتك', en: 'Jawad is Ready to Help' })}
              </h3>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                {t({ 
                  ar: 'ابدأ محادثة مع جواد الآن واحصل على خطة سفر مخصصة في دقائق', 
                  en: 'Start a conversation with Jawad now and get a personalized travel plan in minutes' 
                })}
              </p>
              
              <Button 
                onClick={handleStartPlanning}
                size="lg" 
                className="gradient-purple text-white px-6 py-3 font-semibold"
              >
                {t({ ar: 'تحدث مع جواد الآن', en: 'Talk to Jawad Now' })}
                <Bot className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlanTripPlaceholder;