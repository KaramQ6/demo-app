import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent } from '../components/ui/card';
import { Brain, Users, Leaf, MapPin, Lightbulb, Heart, Zap, Activity, Globe } from 'lucide-react';

const About = () => {
  const { t } = useLanguage();

  const aboutTitle = {
    ar: 'عن مشروع SmartTour.Jo',
    en: 'About SmartTour.Jo Project'
  };

  const aboutDescription = {
    ar: 'منصة ذكية تهدف إلى إعادة تعريف تجربة السياحة في الأردن من خلال دمج التكنولوجيا المتطورة مع الثراء الثقافي والطبيعي للمملكة.',
    en: 'A smart platform that aims to redefine the tourism experience in Jordan by integrating advanced technology with the Kingdom\'s cultural and natural richness.'
  };

  const visionTitle = {
    ar: 'رؤيتنا',
    en: 'Our Vision'
  };

  const visionText = {
    ar: 'أن نكون الرائدين في تقديم تجارب سياحية ذكية ومستدامة تحافظ على التراث الأردني وتعزز من قيمته عالمياً.',
    en: 'To be leaders in providing smart and sustainable tourism experiences that preserve Jordanian heritage and enhance its global value.'
  };

  const missionTitle = {
    ar: 'مهمتنا',
    en: 'Our Mission'
  };

  const missionText = {
    ar: 'نسعى لتوفير منصة تقنية متطورة تساعد الزوار على اكتشاف الأردن الحقيقي بطريقة مبتكرة تتجنب الازدحام وتحترم البيئة والمجتمعات المحلية.',
    en: 'We strive to provide an advanced technology platform that helps visitors discover the real Jordan in an innovative way that avoids crowds and respects the environment and local communities.'
  };

  const features = [
    {
      icon: Brain,
      title: { ar: 'ذكاء اصطناعي متطور', en: 'Advanced AI' },
      description: {
        ar: 'مرشد ذكي يتعلم من تفضيلاتك ويقدم توصيات شخصية',
        en: 'Smart guide that learns from your preferences and provides personal recommendations'
      }
    },
    {
      icon: Users,
      title: { ar: 'تجنب الازدحام', en: 'Crowd Avoidance' },
      description: {
        ar: 'نظام ذكي يساعدك في تجنب الأوقات والأماكن المزدحمة',
        en: 'Smart system that helps you avoid crowded times and places'
      }
    },
    {
      icon: Leaf,
      title: { ar: 'سياحة مستدامة', en: 'Sustainable Tourism' },
      description: {
        ar: 'نشجع الممارسات البيئية والاجتماعية المسؤولة',
        en: 'We encourage responsible environmental and social practices'
      }
    },
    {
      icon: MapPin,
      title: { ar: 'اكتشاف أماكن جديدة', en: 'Discover New Places' },
      description: {
        ar: 'نكشف لك الكنوز المخفية والأماكن الأقل شهرة',
        en: 'We reveal hidden treasures and lesser-known places'
      }
    },
    {
      icon: Lightbulb,
      title: { ar: 'تجارب تفاعلية', en: 'Interactive Experiences' },
      description: {
        ar: 'تقنيات الواقع المعزز وأدوات تفاعلية متطورة',
        en: 'Augmented reality technologies and advanced interactive tools'
      }
    },
    {
      icon: Heart,
      title: { ar: 'دعم المجتمع المحلي', en: 'Local Community Support' },
      description: {
        ar: 'نساهم في دعم الاقتصاد المحلي والحرف التراثية',
        en: 'We contribute to supporting the local economy and traditional crafts'
      }
    }
  ];

  const teamTitle = {
    ar: 'قيمنا',
    en: 'Our Values'
  };

  const values = [
    {
      title: { ar: 'الأصالة', en: 'Authenticity' },
      description: { ar: 'نحافظ على الهوية الأردنية الأصيلة', en: 'We preserve authentic Jordanian identity' }
    },
    {
      title: { ar: 'الاستدامة', en: 'Sustainability' },
      description: { ar: 'نحمي البيئة للأجيال القادمة', en: 'We protect the environment for future generations' }
    },
    {
      title: { ar: 'الابتكار', en: 'Innovation' },
      description: { ar: 'نستخدم أحدث التقنيات بطريقة إبداعية', en: 'We use the latest technologies creatively' }
    },
    {
      title: { ar: 'الجودة', en: 'Quality' },
      description: { ar: 'نسعى دائماً لتقديم أفضل تجربة ممكنة', en: 'We always strive to provide the best possible experience' }
    }
  ];

  return (
    <div className="relative min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto relative z-10">

        {/* Hero Section */}
        <div className="text-center mb-20 animate-slide-up">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 font-['Montserrat']">
            {t(aboutTitle)}
          </h1>
          <div className="w-24 h-1 gradient-purple mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-['Open_Sans']">
            {t(aboutDescription)}
          </p>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <Card className="glass-card border-l-4 border-l-primary interactive-card animate-scale-in">
            <CardContent className="p-12">
              <div className="flex items-center space-x-4 rtl:space-x-reverse mb-6">
                <div className="w-16 h-16 gradient-purple rounded-2xl flex items-center justify-center">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white font-['Montserrat']">
                  {t(visionTitle)}
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed font-['Open_Sans'] text-lg">
                {t(visionText)}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-l-4 border-l-secondary interactive-card animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-12">
              <div className="flex items-center space-x-4 rtl:space-x-reverse mb-6">
                <div className="w-16 h-16 gradient-purple rounded-2xl flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white font-['Montserrat']">
                  {t(missionTitle)}
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed font-['Open_Sans'] text-lg">
                {t(missionText)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-white text-center mb-16 font-['Montserrat'] animate-fade-in">
            {t({ ar: 'ما يميزنا', en: 'What Makes Us Special' })}
          </h2>
          <div className="w-24 h-1 gradient-purple mx-auto rounded-full mb-16"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="glass-card text-center group interactive-card animate-scale-in border-white/10" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-8">
                    <div className="w-20 h-20 gradient-purple rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 animate-pulse-glow">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4 font-['Montserrat']">
                      {t(feature.title)}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed font-['Open_Sans']">
                      {t(feature.description)}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Values */}
        <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <h2 className="text-4xl font-bold text-white text-center mb-16 font-['Montserrat']">
            {t(teamTitle)}
          </h2>
          <div className="w-24 h-1 gradient-purple mx-auto rounded-full mb-16"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="glass-card hover:bg-primary/5 transition-all duration-300 interactive-card border-white/10">
                <CardContent className="p-10">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse mb-4">
                    <div className="w-3 h-3 gradient-purple rounded-full animate-pulse-glow"></div>
                    <h3 className="text-2xl font-semibold text-white font-['Montserrat']">
                      {t(value.title)}
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed font-['Open_Sans'] text-lg">
                    {t(value.description)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="mt-20 text-center animate-fade-in" style={{ animationDelay: '1s' }}>
          <div className="glass-card p-12 rounded-3xl border border-primary/20">
            <div className="inline-flex items-center justify-center w-20 h-20 gradient-purple rounded-full mb-8 animate-pulse-glow">
              <Activity className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-6 font-['Montserrat']">
              {t({ ar: 'مدعوم بأحدث التقنيات', en: 'Powered by Latest Technology' })}
            </h3>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto font-['Open_Sans']">
              {t({
                ar: 'نجمع بين الذكاء الاصطناعي وإنترنت الأشياء والواقع المعزز لتقديم تجربة سياحية لا مثيل لها في العالم العربي',
                en: 'We combine AI, IoT, and augmented reality to deliver an unparalleled tourism experience in the Arab world'
              })}
            </p>
            <div className="flex items-center justify-center space-x-8 rtl:space-x-reverse mt-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Brain className="w-5 h-5 text-primary" />
                <span>{t({ ar: 'تقنية ذكية', en: 'Smart Technology' })}</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Activity className="w-5 h-5 text-primary" />
                <span>{t({ ar: 'إنترنت الأشياء', en: 'Internet of Things' })}</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Zap className="w-5 h-5 text-primary" />
                <span>{t({ ar: 'واقع معزز', en: 'Augmented Reality' })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20 pointer-events-none" />
      <div className="absolute top-40 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
    </div>
  );
};

export default About;