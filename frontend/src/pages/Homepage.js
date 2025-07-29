import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Play, ArrowRight, ArrowLeft, MapPin, Clock, Users, Brain, Zap, Star, Thermometer, Activity } from 'lucide-react';
import { destinations } from '../mock';

const Homepage = () => {
  const { t, language, isRTL } = useLanguage();
  const { openChatbot } = useApp();
  const heroRef = useRef(null);



  // Hero parallax effect
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
    const message = t({
      ar: 'أهلاً! أريد التخطيط لرحلة استكشافية في الأردن. ما الذي تنصحني به؟',
      en: 'Hello! I want to plan an exploratory trip in Jordan. What do you recommend?'
    });
    openChatbot(message);
  };

  const handleLocationStatusClick = () => {
    const message = t({
      ar: `أرى أنني الآن في ${currentLocationData.name.ar}. ما الأنشطة والمعالم التي يمكنني زيارتها هنا؟`,
      en: `I see I'm currently in ${currentLocationData.name.en}. What activities and attractions can I visit here?`
    });
    openChatbot(message);
  };

  const howItWorksSteps = [
    {
      icon: Brain,
      title: { ar: 'تحدث مع جواد', en: 'Talk to Jawad' },
      description: { ar: 'أخبرنا عن اهتماماتك وتفضيلاتك', en: 'Tell us about your interests and preferences' }
    },
    {
      icon: Zap,
      title: { ar: 'احصل على خطة ذكية', en: 'Get Smart Plan' },
      description: { ar: 'استلم خطة مخصصة تتجنب الازدحام', en: 'Receive a customized plan that avoids crowds' }
    },
    {
      icon: Star,
      title: { ar: 'استكشف كالمحترفين', en: 'Explore Like Pros' },
      description: { ar: 'استخدم أدواتنا التفاعلية لتجربة فريدة', en: 'Use our interactive tools for a unique experience' }
    }
  ];

  const featuredDestinations = destinations.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video/Image */}
        <div
          ref={heroRef}
          className="absolute inset-0 w-full h-full transition-transform duration-100 ease-out"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-900/60 to-black/80 z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1574082512734-8336f25bb9d8"
            alt="Wadi Rum Desert"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold font-['Montserrat'] text-white mb-6 animate-text-glow">
            {t({ ar: 'اكتشف الأردن الحقيقي، بعيداً عن الزحام', en: 'Discover the Real Jordan, Away from the Crowds' })}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 font-['Open_Sans'] max-w-3xl mx-auto">
            {t({
              ar: 'خطط لرحلتك بذكاء مع مرشدك الشخصي جواد واستمتع بتجربة سياحية فريدة مدعومة بالذكاء الاصطناعي',
              en: 'Plan your trip intelligently with your personal guide Jawad and enjoy a unique tourism experience powered by artificial intelligence'
            })}
          </p>

          {/* CTA Button */}
          <Button
            onClick={handleCTAClick}
            size="lg"
            className="gradient-purple text-white px-8 py-4 text-lg font-semibold font-['Open_Sans'] hover:scale-105 transition-all duration-300 interactive-button shadow-2xl"
          >
            {t({ ar: 'خطط لرحلتك الآن', en: 'Plan Your Trip Now' })}
            {isRTL ? (
              <ArrowLeft className="ml-2 h-5 w-5" />
            ) : (
              <ArrowRight className="ml-2 h-5 w-5" />
            )}
          </Button>

          import {Map, Clock, Bot} from 'lucide-react'; // <-- تأكد من استيراد الأيقونات في بداية الملف

          // ... داخل دالة return في Homepage.js ...

          {/* Stats Section (Improved) */}
          <div className="py-16 sm:py-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto text-center">

              {/* Stat 1: Destinations */}
              <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <Map className="w-10 h-10 mb-3 text-purple-400" />
                <div className="text-5xl font-bold font-['Montserrat'] gradient-purple bg-clip-text text-transparent">
                  50+
                </div>
                <div className="mt-2 text-lg text-gray-300 font-['Open_Sans']">
                  {t({ ar: 'وجهة فريدة', en: 'Unique Destinations' })}
                </div>
              </div>

              {/* Stat 2: Live Monitoring */}
              <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <Clock className="w-10 h-10 mb-3 text-purple-400" />
                <div className="text-5xl font-bold font-['Montserrat'] gradient-purple bg-clip-text text-transparent">
                  24/7
                </div>
                <div className="mt-2 text-lg text-gray-300 font-['Open_Sans']">
                  {t({ ar: 'مراقبة حية', en: 'Live Monitoring' })}
                </div>
              </div>

              {/* Stat 3: AI Powered */}
              <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <Bot className="w-10 h-10 mb-3 text-purple-400" />
                <div className="text-5xl font-bold font-['Montserrat'] gradient-purple bg-clip-text text-transparent">
                  AI
                </div>
                <div className="mt-2 text-lg text-gray-300 font-['Open_Sans']">
                  {t({ ar: 'مدعوم بالذكاء الاصطناعي', en: 'Powered' })}
                </div>
              </div>

            </div>
          </div>

          {/* NEW: Location Status Bar */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-md px-6">
            <button
              onClick={handleLocationStatusClick}
              className="w-full glass-card hover:bg-white/10 transition-all duration-300 interactive-button rounded-2xl p-4 border border-white/20 animate-fade-in-up group"
              style={{ animationDelay: '1.4s' }}
              aria-label={t({ ar: 'عرض معلومات الموقع الحالي', en: 'View current location information' })}
            >
              <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse text-white">
                {/* Location */}
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium font-['Open_Sans']">
                    {t(currentLocationData.name)}
                  </span>
                </div>

                {/* Temperature */}
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <Thermometer className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium font-['Open_Sans']">
                    {currentLocationData.temperature}°{t({ ar: 'م', en: 'C' })}
                  </span>
                </div>

                {/* Congestion */}
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <Activity className={`w-4 h-4 ${currentLocationData.congestionLevel === 'low' ? 'text-green-400' :
                      currentLocationData.congestionLevel === 'medium' ? 'text-yellow-400' :
                        'text-red-400'
                    }`} />
                  <span className={`text-sm font-medium font-['Open_Sans'] ${currentLocationData.congestionLevel === 'low' ? 'text-green-400' :
                      currentLocationData.congestionLevel === 'medium' ? 'text-yellow-400' :
                        'text-red-400'
                    }`}>
                    {t({ ar: `الازدحام: ${currentLocationData.congestion.ar}`, en: `Crowd: ${currentLocationData.congestion.en}` })}
                  </span>
                </div>
              </div>

              {/* Subtle call-to-action hint */}
              <div className="mt-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {t({ ar: 'اضغط للحصول على نصائح محلية من جواد', en: 'Tap for local insights from Jawad' })}
              </div>
            </button>
          </div>

          {/* Original Scroll Indicator - moved up */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold font-['Montserrat'] text-white mb-6">
              {t({ ar: 'كيف يعمل النظام؟', en: 'How It Works?' })}
            </h2>
            <p className="text-xl text-muted-foreground font-['Open_Sans'] max-w-2xl mx-auto">
              {t({
                ar: 'ثلاث خطوات بسيطة لتخطيط رحلة مثالية باستخدام أحدث التقنيات',
                en: 'Three simple steps to plan the perfect trip using the latest technologies'
              })}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div
                key={index}
                className="text-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-20 h-20 mx-auto mb-6 gradient-purple rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold font-['Montserrat'] text-white mb-4">
                  {t(step.title)}
                </h3>
                <p className="text-muted-foreground font-['Open_Sans'] leading-relaxed">
                  {t(step.description)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 px-6 bg-gradient-to-br from-purple-900/10 to-indigo-900/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold font-['Montserrat'] text-white mb-6">
              {t({ ar: 'وجهات مميزة', en: 'Featured Destinations' })}
            </h2>
            <p className="text-xl text-muted-foreground font-['Open_Sans'] max-w-2xl mx-auto">
              {t({
                ar: 'اكتشف أروع الوجهات السياحية في الأردن مع بيانات حية ونصائح ذكية',
                en: 'Discover the most amazing tourist destinations in Jordan with live data and smart tips'
              })}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredDestinations.map((destination, index) => (
              <Link
                key={destination.id}
                to={`/destinations/${destination.id}`}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <Card className="glass-card interactive-card h-full overflow-hidden border-white/10">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={destination.image}
                      alt={t(destination.name)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white text-sm font-semibold">{destination.rating}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold font-['Montserrat'] text-white mb-2">
                        {t(destination.name)}
                      </h3>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground font-['Open_Sans'] mb-4 leading-relaxed">
                      {t(destination.shortDescription)}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="font-['Open_Sans']">
                          {t({ ar: 'الأردن', en: 'Jordan' })}
                        </span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${destination.crowdLevel === 'low' ? 'bg-green-500/20 text-green-400' :
                          destination.crowdLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                        }`}>
                        {destination.crowdLevel === 'low' ? t({ ar: 'هادئ', en: 'Quiet' }) :
                          destination.crowdLevel === 'medium' ? t({ ar: 'متوسط', en: 'Moderate' }) :
                            t({ ar: 'مزدحم', en: 'Busy' })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* View All Destinations Button */}
          <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <Link to="/destinations">
              <Button
                variant="outline"
                size="lg"
                className="glass border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 interactive-button font-['Open_Sans']"
              >
                {t({ ar: 'استكشف جميع الوجهات', en: 'Explore All Destinations' })}
                {isRTL ? (
                  <ArrowLeft className="ml-2 h-5 w-5" />
                ) : (
                  <ArrowRight className="ml-2 h-5 w-5" />
                )}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;