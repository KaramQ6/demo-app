import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { useParallaxEffect, useScrollAnimation } from '../hooks/useScrollAnimation';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ArrowRight, ArrowLeft, MessageCircle, Search, MapPin, Activity, Zap, Brain } from 'lucide-react';
import { destinations, heroImages } from '../mock';

const Homepage = () => {
  const { t, isRTL, language } = useLanguage();
  const { openChatbot } = useApp();
  const parallaxRef = useParallaxEffect();
  const howItWorksRef = useScrollAnimation();
  const destinationsRef = useScrollAnimation();

  const heroTitle = {
    ar: 'اكتشف الأردن الحقيقي، بعيداً عن الزحام',
    en: 'Discover the Real Jordan, Away from the Crowds'
  };

  const heroSubtitle = {
    ar: 'خطط لرحلتك بذكاء مع مرشدك الشخصي جواد المدعوم بالذكاء الاصطناعي',
    en: 'Plan your trip smartly with your AI-powered personal guide Jawad'
  };

  const ctaText = {
    ar: 'خطط لرحلتك الآن',
    en: 'Plan Your Trip Now'
  };

  const howItWorksTitle = {
    ar: 'كيف يعمل النظام الذكي',
    en: 'How Our Smart System Works'
  };

  const featuredDestinationsTitle = {
    ar: 'وجهات مميزة',
    en: 'Featured Destinations'
  };

  const steps = [
    {
      icon: MessageCircle,
      title: { ar: 'تحدث مع جواد', en: 'Talk to Jawad' },
      description: { ar: 'أخبرنا عن اهتماماتك وتفضيلاتك بالذكاء الاصطناعي', en: 'Tell us about your interests and preferences with AI' }
    },
    {
      icon: Brain,
      title: { ar: 'احصل على خطة ذكية', en: 'Get AI-Powered Plan' },
      description: { ar: 'استلم خطة مخصصة تتجنب الازدحام مع البيانات الحية', en: 'Receive a custom plan that avoids crowds with live data' }
    },
    {
      icon: Activity,
      title: { ar: 'استكشف بالتقنية', en: 'Explore with Technology' },
      description: { ar: 'استخدم أدواتنا التفاعلية وإنترنت الأشياء لتجربة فريدة', en: 'Use our interactive tools and IoT for a unique experience' }
    }
  ];

  // Main CTA function - opens chatbot with initial planning message
  const handleMainCTA = () => {
    const initialMessage = language === 'ar' 
      ? 'أريد المساعدة في تخطيط رحلتي إلى الأردن'
      : 'I need help planning my trip to Jordan';
    
    openChatbot(initialMessage);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Parallax Background */}
      <section className="relative h-screen flex items-center justify-center text-white overflow-hidden">
        {/* Parallax Background Image */}
        <div className="absolute inset-0 z-0">
          <div ref={parallaxRef} className="parallax-element w-full h-full">
            <img
              src={heroImages.main}
              alt={t({ ar: 'منظر طبيعي أردني', en: 'Jordan Landscape' })}
              className="w-full h-full object-cover scale-110"
            />
          </div>
          <div className="absolute inset-0 gradient-overlay"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 font-['Montserrat'] leading-tight animate-slide-up">
            {t(heroTitle)}
          </h1>
          <p className="text-xl md:text-2xl mb-12 font-['Open_Sans'] opacity-90 leading-relaxed animate-fade-in max-w-3xl mx-auto" style={{ animationDelay: '0.3s' }}>
            {t(heroSubtitle)}
          </p>
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button
              onClick={handleMainCTA}
              size="lg"
              className="gradient-purple hover:scale-105 text-white px-12 py-6 text-xl font-semibold rounded-2xl interactive-button shadow-2xl font-['Open_Sans']"
              aria-label={t({ ar: 'ابدأ التخطيط لرحلتك مع جواد', en: 'Start planning your trip with Jawad' })}
            >
              <Zap className="mr-3 rtl:mr-0 rtl:ml-3 h-6 w-6" />
              {t(ctaText)}
              {isRTL ? <ArrowLeft className="mr-3 h-6 w-6" /> : <ArrowRight className="ml-3 h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Floating Elements with Enhanced Animations */}
        <div className="absolute bottom-12 left-12 glass-card p-6 rounded-xl animate-pulse-glow">
          <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm">
            <Activity className="w-5 h-5 text-primary" />
            <span className="text-white font-['Open_Sans'] font-medium">
              {t({ ar: 'بيانات حية', en: 'Live Data' })}
            </span>
          </div>
        </div>

        <div className="absolute bottom-12 right-12 glass-card p-6 rounded-xl animate-pulse-glow" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm">
            <Brain className="w-5 h-5 text-primary" />
            <span className="text-white font-['Open_Sans'] font-medium">
              {t({ ar: 'ذكاء اصطناعي', en: 'AI Powered' })}
            </span>
          </div>
        </div>
      </section>

      {/* How It Works Section with Scroll Animation */}
      <section ref={howItWorksRef} className="py-24 px-6 scroll-animate">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-['Montserrat']">
              {t(howItWorksTitle)}
            </h2>
            <div className="w-24 h-1 gradient-purple mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-['Open_Sans']">
              {t({ 
                ar: 'نظام متكامل يجمع بين الذكاء الاصطناعي وإنترنت الأشياء لتجربة سياحية فريدة',
                en: 'An integrated system combining AI and IoT for a unique tourism experience'
              })}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center group animate-scale-in" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="mb-8 flex justify-center">
                    <div className="w-24 h-24 glass-card rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl interactive-card">
                      <Icon className="w-12 h-12 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4 font-['Montserrat']">
                    {t(step.title)}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed font-['Open_Sans'] text-lg">
                    {t(step.description)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Destinations Section with Scroll Animation */}
      <section ref={destinationsRef} className="py-24 px-6 scroll-animate">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-['Montserrat']">
              {t(featuredDestinationsTitle)}
            </h2>
            <div className="w-24 h-1 gradient-purple mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-['Open_Sans']">
              {t({ 
                ar: 'اكتشف أجمل الوجهات في الأردن مع البيانات الحية والتوصيات الذكية',
                en: 'Discover Jordan\'s most beautiful destinations with live data and smart recommendations'
              })}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.slice(0, 6).map((destination, index) => (
              <Link key={destination.id} to={`/destinations/${destination.id}`}>
                <Card className="glass-card interactive-card h-full overflow-hidden border-white/10 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={destination.image}
                      alt={t(destination.name)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 gradient-overlay" />
                    
                    {/* Live Status Indicator */}
                    <div className="absolute top-4 right-4 glass px-3 py-2 rounded-full flex items-center space-x-2 rtl:space-x-reverse text-xs">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-glow"></div>
                      <span className="text-white font-['Open_Sans'] font-medium">
                        {t({ ar: 'مباشر', en: 'Live' })}
                      </span>
                    </div>
                    
                    {/* Destination Name Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white text-xl font-semibold font-['Montserrat'] mb-2">
                        {t(destination.name)}
                      </h3>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-sm text-white/80 font-['Open_Sans']">
                          {t({ ar: 'الأردن', en: 'Jordan' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <p className="text-muted-foreground leading-relaxed mb-4 font-['Open_Sans']">
                      {t(destination.shortDescription)}
                    </p>
                    
                    {/* Features */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse glass px-3 py-2 rounded-full">
                        <Activity className="w-3 h-3 text-primary" />
                        <span className="text-white font-['Open_Sans']">
                          {t({ ar: 'IoT', en: 'IoT Enabled' })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse glass px-3 py-2 rounded-full">
                        <Brain className="w-3 h-3 text-primary" />
                        <span className="text-white font-['Open_Sans']">
                          {t({ ar: 'ذكي', en: 'AI Ready' })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <Link to="/destinations">
              <Button className="gradient-purple hover:scale-105 px-12 py-4 text-lg font-semibold rounded-2xl interactive-button shadow-xl font-['Open_Sans']">
                {t({ ar: 'استكشف جميع الوجهات', en: 'Explore All Destinations' })}
                {isRTL ? <ArrowLeft className="mr-3 h-5 w-5" /> : <ArrowRight className="ml-3 h-5 w-5" />}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;