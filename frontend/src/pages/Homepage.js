import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowRight, ArrowLeft, MapPin, Clock, Bot, Brain, Zap, Star, Thermometer, Loader2, Calendar, Users } from 'lucide-react';
import { destinations } from '../mock';

const Homepage = () => {
  const { t, language, isRTL } = useLanguage();
  const { openChatbot, sendMessage, liveData, isLoadingData } = useApp();
  const heroRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState({ home: true });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
    <div className="relative">
      {/* ENHANCED HERO SECTION */}
      <section ref={heroRef} id="home" className="relative h-screen flex items-center justify-center overflow-hidden -mt-16">
        {/* Weather Info Widget */}
        {liveData && (
          <div
            className="absolute top-20 right-4 z-40 cursor-pointer group transition-all duration-300 hover:scale-105"
            onClick={handleLocationStatusClick}
            style={{ pointerEvents: 'auto' }}
          >
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-3 shadow-xl">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <MapPin className="w-4 h-4 text-white/80" />
                <span className="text-white/90 text-sm font-medium truncate max-w-32">
                  {liveData.cityName || 'Amman'}
                </span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse mt-1">
                <Thermometer className="w-4 h-4 text-white/80" />
                <span className="text-white font-bold">
                  {Math.round(liveData.temperature || liveData.main?.temp || 25)}°C
                </span>
              </div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-blue-900/40 to-indigo-900/60 z-10 animate-pulse"></div>
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-1000 parallax" style={{ backgroundImage: `url(https://images.pexels.com/photos/1631665/pexels-photo-1631665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)`, transform: `translateY(${scrollProgress * 0.5}px) scale(1.1)` }}></div>
        <div className="absolute inset-0 z-15">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-lg animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-indigo-500/15 to-purple-500/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className={`relative z-20 text-center px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible.home ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight font-poppins tracking-tight animate-glow">
              {t({
                ar: 'اكتشف كنوز الأردن المخفية مع جواد',
                en: 'Discover Jordan\'s Hidden Gems with AI Guide Jawad'
              })}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 text-gray-200 max-w-4xl mx-auto leading-relaxed font-inter font-light">
              {t({
                ar: 'خطط رحلتك المثالية بالذكاء الاصطناعي واكتشف الأردن كما لم تره من قبل',
                en: 'Plan your perfect trip with AI and discover Jordan like never before'
              })}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button onClick={() => scrollToSection('features')} className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/30 font-inter relative overflow-hidden">
                <span className="relative z-10 flex items-center">
                  <svg className="w-5 h-5 mx-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {t({ ar: 'ابدأ التخطيط', en: 'Start Planning' })}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
              <button onClick={() => scrollToSection('map')} className="group border-2 border-white/30 hover:border-white/60 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm hover:bg-white/10 font-inter relative overflow-hidden">
                <span className="relative z-10 flex items-center">
                  <svg className="w-5 h-5 mx-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {t({ ar: 'استكشف الخريطة', en: 'Explore Map' })}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION - MOBILE OPTIMIZED */}
      <section id="features" className="py-16 md:py-20 px-4 md:px-6 relative">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold font-['Montserrat'] text-white mb-4 md:mb-6">
              {t({ ar: 'كيف يعمل SmartTour.Jo', en: 'How SmartTour.Jo Works' })}
            </h2>
            <p className="text-base md:text-xl text-muted-foreground font-['Open_Sans'] max-w-2xl mx-auto">
              {t({ ar: 'ثلاث خطوات بسيطة لرحلة لا تُنسى', en: 'Three simple steps to an unforgettable journey' })}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="w-16 h-16 md:w-20 md:h-20 gradient-purple rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <step.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold font-['Montserrat'] text-white mb-2 md:mb-3">
                  {t(step.title)}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground font-['Open_Sans'] leading-relaxed">
                  {t(step.description)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20 pointer-events-none" />
        <div className="absolute top-40 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </section>

      {/* FEATURED DESTINATIONS - MOBILE OPTIMIZED */}
      <section className="py-16 md:py-20 px-4 md:px-6 relative">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold font-['Montserrat'] text-white mb-4 md:mb-6">
              {t({ ar: 'وجهات مميزة', en: 'Featured Destinations' })}
            </h2>
            <p className="text-base md:text-xl text-muted-foreground font-['Open_Sans'] max-w-2xl mx-auto">
              {t({ ar: 'استكشف أشهر الوجهات السياحية في الأردن', en: 'Explore Jordan\'s most famous tourist destinations' })}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredDestinations.map((destination, index) => (
              <Link
                key={destination.id}
                to={`/destinations/${destination.id}`}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card className="glass-card interactive-card h-full overflow-hidden border-white/10">
                  <div className="relative h-48 md:h-56 overflow-hidden">
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
                  <CardContent className="p-4 md:p-6">
                    <p className="text-muted-foreground font-['Open_Sans'] mb-4 leading-relaxed text-sm md:text-base">
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
                        {t({
                          ar: destination.crowdLevel === 'low' ? 'هادئ' : destination.crowdLevel === 'medium' ? 'متوسط' : 'مزدحم',
                          en: destination.crowdLevel
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 md:mt-12">
            <Link to="/destinations">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-6 py-3">
                {t({ ar: 'عرض جميع الوجهات', en: 'View All Destinations' })}
                {isRTL ? <ArrowLeft className="ml-2" /> : <ArrowRight className="ml-2" />}
              </Button>
            </Link>
          </div>

          {/* Quick Access Section */}
          <div className="mt-16 mb-16">
            <h3 className="text-2xl md:text-3xl font-bold text-center text-white mb-8">
              {t({ ar: 'اكتشف المزيد', en: 'Discover More' })}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              <Link to="/booking" className="group">
                <Card className="glass-card interactive-card border-white/10 hover:border-purple-400/30 transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-2 text-lg">
                      {t({ ar: 'احجز رحلة', en: 'Book Tour' })}
                    </h4>
                    <p className="text-sm text-gray-300">
                      {t({ ar: 'احجز رحلتك الآن', en: 'Book your trip now' })}
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/community" className="group">
                <Card className="glass-card interactive-card border-white/10 hover:border-blue-400/30 transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-2 text-lg">
                      {t({ ar: 'المجتمع', en: 'Community' })}
                    </h4>
                    <p className="text-sm text-gray-300">
                      {t({ ar: 'شارك التجارب', en: 'Share experiences' })}
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/data" className="group">
                <Card className="glass-card interactive-card border-white/10 hover:border-orange-400/30 transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-2 text-lg">
                      {t({ ar: 'البيانات المباشرة', en: 'Live Data' })}
                    </h4>
                    <p className="text-sm text-gray-300">
                      {t({ ar: 'الطقس والازدحام والبيانات الذكية', en: 'Weather, crowds & smart data' })}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 via-purple-900/20 to-blue-900/20 pointer-events-none" />
        <div className="absolute top-20 right-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      </section>
    </div>
  );
};

export default Homepage;