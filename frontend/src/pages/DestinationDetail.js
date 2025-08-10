import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import RealCrowdDisplay from '../components/RealCrowdDisplay';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Star,
  Clock,
  Users,
  Thermometer,
  Cloud,
  MessageCircle,
  Lightbulb,
  TrendingUp,
  Camera,
  Navigation
} from 'lucide-react';
import { destinations } from '../mock';

const DestinationDetail = () => {
  const { id } = useParams();
  const { t, language, isRTL } = useLanguage();
  const { openChatbot, iotData, setIotData } = useApp();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [crowdFeedback, setCrowdFeedback] = useState(null);
  const [hasGivenFeedback, setHasGivenFeedback] = useState(false);

  const destination = destinations.find(dest => dest.id === parseInt(id));

  useEffect(() => {
    // Check if user has already given feedback for this destination
    const feedbackKey = `feedback_${id}`;
    const existingFeedback = localStorage.getItem(feedbackKey);
    if (existingFeedback) {
      setHasGivenFeedback(true);
      setCrowdFeedback(JSON.parse(existingFeedback));
    }
  }, [id]);

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            {t({ ar: 'الوجهة غير موجودة', en: 'Destination not found' })}
          </h1>
          <Link to="/destinations">
            <Button variant="outline" className="glass border-primary text-primary">
              {t({ ar: 'العودة للوجهات', en: 'Back to Destinations' })}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Mock image gallery (in real app, would come from destination data)
  const imageGallery = [
    destination.image,
    'https://instagram.famm13-1.fna.fbcdn.net/v/t51.2885-15/473023756_458411074012548_522496253386996261_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQuaW1hZ2VfdXJsZ2VuLjEwODB4MTM1MC5zZHIuZjI4ODUuZGVmYXVsdF9pbWFnZS5jMiJ9&_nc_ht=instagram.famm13-1.fna.fbcdn.net&_nc_cat=100&_nc_oc=Q6cZ2QGTDv26wYtyeRmR8HMd85Hte0UjSvQeNI4T6EFBHsUSQapkJR6FkQtBZLQtx3tmuRY&_nc_ohc=-vkRfLRaVicQ7kNvwHxTGz7&_nc_gid=RKlcm70j-9CVhq0aRFMEvw&edm=APoiHPcBAAAA&ccb=7-5&ig_cache_key=MzU0NDY2MzIxMDQ4NDE4Nzg1Nw%3D%3D.3-ccb7-5&oh=00_AfXEj_zimRhqrh5SAUen-bHbTqnwbcEHps1U_GsMtQuB-Q&oe=689EB747&_nc_sid=22de04',
    'https://www.reflectionsenroute.com/wp-content/uploads/2014/05/Jordan-8.jpg.webp',
    'https://instagram.famm10-1.fna.fbcdn.net/v/t51.2885-15/463364185_912462524097380_7758625016692203577_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQuaW1hZ2VfdXJsZ2VuLjEwODB4MTM1MC5zZHIuZjI4ODUuZGVmYXVsdF9pbWFnZS5jMiJ9&_nc_ht=instagram.famm10-1.fna.fbcdn.net&_nc_cat=108&_nc_oc=Q6cZ2QH0_BRekojV9VbjWqyoGBDoqOZi2r9TFZHP3ePkd6eY8N9-a-hL8VjxowsaN_F93A4&_nc_ohc=TBQMaBh9x5IQ7kNvwEzsIST&_nc_gid=P3hiKJ3pgqTf2T66mAB6BQ&edm=APoiHPcBAAAA&ccb=7-5&ig_cache_key=MzQ4MDEyNzk3MDIyNTc3NjM3OA%3D%3D.3-ccb7-5&oh=00_AfWPxO6laeZi8rJurpTvqdzAfPNShiLM84ymi-zP1D2Xig&oe=689ED150&_nc_sid=22de04'
  ];

  const handleCrowdFeedback = (level) => {
    const feedback = {
      level,
      timestamp: new Date().toISOString(),
      destinationId: id
    };

    setCrowdFeedback(feedback);
    setHasGivenFeedback(true);

    // Save to localStorage
    localStorage.setItem(`feedback_${id}`, JSON.stringify(feedback));

    // Update IoT data
    const crowdValue = level === 'low' ? 25 : level === 'medium' ? 55 : 85;
    setIotData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        crowdLevel: crowdValue,
        lastUpdated: new Date()
      }
    }));
  };

  const handleAskJawad = () => {
    const message = t({
      ar: `أخبرني المزيد عن ${t(destination.name)} وما الأنشطة التي يمكنني القيام بها هناك؟`,
      en: `Tell me more about ${t(destination.name)} and what activities can I do there?`
    });
    openChatbot(message);
  };

  const smartTips = {
    jerash: {
      ar: 'أفضل وقت للزيارة هو الصباح الباكر (8-10 ص) لتجنب الحرارة والازدحام. احرص على ارتداء حذاء مريح للمشي على الحجارة الأثرية.',
      en: 'Best time to visit is early morning (8-10 AM) to avoid heat and crowds. Make sure to wear comfortable shoes for walking on ancient stones.'
    },
    petra: {
      ar: 'ابدأ رحلتك مبكراً واحضر كمية كافية من الماء. الطريق إلى الخزنة يستغرق 20 دقيقة مشياً على الأقدام. تذكر أن هناك أماكن للاستراحة على الطريق.',
      en: 'Start your journey early and bring plenty of water. The walk to the Treasury takes at least 20 minutes on foot. Remember there are rest areas along the way.'
    },
    'wadi-rum': {
      ar: 'الليل في وادي رم ساحر للغاية! احجز تجربة النوم تحت النجوم ولا تنس إحضار ملابس دافئة لأن الليل بارد في الصحراء.',
      en: 'The night in Wadi Rum is absolutely magical! Book a stargazing sleep experience and don\'t forget to bring warm clothes as desert nights are cold.'
    },
    'umm-qais': {
      ar: 'المنظر من أم قيس خلاب خاصة عند الغروب. احضر كاميرا جيدة والتقط صوراً للمناظر الطبيعية المذهلة لبحيرة طبريا ومرتفعات الجولان.',
      en: 'The view from Umm Qais is breathtaking especially at sunset. Bring a good camera and capture amazing landscape photos of Sea of Galilee and Golan Heights.'
    },
    ajloun: {
      ar: 'قلعة عجلون محاطة بطبيعة خضراء جميلة. يمكنك الجمع بين زيارة القلعة والتنزه في محمية عجلون الطبيعية في نفس اليوم.',
      en: 'Ajloun Castle is surrounded by beautiful green nature. You can combine visiting the castle with hiking in Ajloun Nature Reserve on the same day.'
    },
    salt: {
      ar: 'تجول في الأسواق التراثية واستمتع بالعمارة العثمانية الأصيلة. لا تفوت زيارة أبو جابر ومتحف السلط التاريخي.',
      en: 'Stroll through heritage markets and enjoy authentic Ottoman architecture. Don\'t miss visiting Abu Jaber and As-Salt Historical Museum.'
    }
  };

  return (
    <div className="relative min-h-screen py-20">
      {/* Breadcrumb */}
      <div className="container mx-auto px-6 mb-8 relative z-10">
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground font-['Open_Sans']">
          <Link to="/" className="hover:text-primary transition-colors">
            {t({ ar: 'الرئيسية', en: 'Home' })}
          </Link>
          <span>/</span>
          <Link to="/destinations" className="hover:text-primary transition-colors">
            {t({ ar: 'الوجهات', en: 'Destinations' })}
          </Link>
          <span>/</span>
          <span className="text-white">{t(destination.name)}</span>
        </div>
      </div>

      {/* Hero Section with Image Gallery */}
      <div className="container mx-auto px-6 mb-12 relative z-10">
        <div className="relative h-96 md:h-[32rem] rounded-2xl overflow-hidden glass-card animate-fade-in-up">
          <img
            src={imageGallery[currentImageIndex]}
            alt={t(destination.name)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          {/* Image Navigation */}
          <button
            onClick={() => setCurrentImageIndex(prev => prev === 0 ? imageGallery.length - 1 : prev - 1)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 glass rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all interactive-button"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentImageIndex(prev => prev === imageGallery.length - 1 ? 0 : prev + 1)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 glass rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all interactive-button"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {imageGallery.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
              />
            ))}
          </div>

          {/* Overlay Content */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold font-['Montserrat'] text-white mb-4">
                  {t(destination.name)}
                </h1>
                <div className="flex items-center space-x-4 rtl:space-x-reverse text-white">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{destination.rating}</span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <MapPin className="w-5 h-5" />
                    <span>{t({ ar: 'الأردن', en: 'Jordan' })}</span>
                  </div>
                </div>
              </div>

              {/* Ask Jawad Button */}
              <Button
                onClick={handleAskJawad}
                className="gradient-purple text-white hover:scale-105 transition-all duration-300 interactive-button font-['Open_Sans']"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {t({ ar: 'اسأل جواد عن هذه الوجهة', en: 'Ask Jawad about this destination' })}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 relative z-10">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 glass mb-8">
            <TabsTrigger value="overview" className="font-['Open_Sans']">
              {t({ ar: 'نظرة عامة', en: 'Overview' })}
            </TabsTrigger>
            <TabsTrigger value="smart-tip" className="font-['Open_Sans']">
              <Lightbulb className="w-4 h-4 mr-2" />
              {t({ ar: 'نصيحة جواد الذكية', en: 'Jawad\'s Smart Tip' })}
            </TabsTrigger>
            <TabsTrigger value="crowd-level" className="font-['Open_Sans']">
              <TrendingUp className="w-4 h-4 mr-2" />
              {t({ ar: 'مستوى الازدحام الآن', en: 'Current Crowd Level' })}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="animate-fade-in-up">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Description */}
              <div className="lg:col-span-2">
                <Card className="glass-card border-white/10">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold font-['Montserrat'] text-white mb-6">
                      {t({ ar: 'عن هذه الوجهة', en: 'About This Destination' })}
                    </h2>
                    <p className="text-muted-foreground font-['Open_Sans'] leading-relaxed text-lg mb-6">
                      {t(destination.description)}
                    </p>

                    {/* Highlights */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold font-['Montserrat'] text-white mb-4">
                        {t({ ar: 'أبرز المعالم', en: 'Highlights' })}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {destination.highlights && destination.highlights.map((highlight, index) => (
                          <Badge key={index} variant="secondary" className="glass">
                            {t(highlight)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <Card className="glass-card border-white/10">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold font-['Montserrat'] text-white mb-4">
                      {t({ ar: 'معلومات سريعة', en: 'Quick Info' })}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-muted-foreground font-['Open_Sans']">
                            {t({ ar: 'التقييم', en: 'Rating' })}
                          </span>
                        </div>
                        <span className="text-white font-semibold">{destination.rating}/5</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="text-sm text-muted-foreground font-['Open_Sans']">
                            {t({ ar: 'الازدحام', en: 'Crowd Level' })}
                          </span>
                        </div>
                        <span className={`text-sm font-semibold ${destination.crowdLevel === 'low' ? 'text-green-400' :
                          destination.crowdLevel === 'medium' ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                          {destination.crowdLevel === 'low' ? t({ ar: 'هادئ', en: 'Quiet' }) :
                            destination.crowdLevel === 'medium' ? t({ ar: 'متوسط', en: 'Moderate' }) :
                              t({ ar: 'مزدحم', en: 'Busy' })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="text-sm text-muted-foreground font-['Open_Sans']">
                            {t({ ar: 'مدة الزيارة', en: 'Visit Duration' })}
                          </span>
                        </div>
                        <span className="text-white font-semibold">
                          {t({ ar: '2-4 ساعات', en: '2-4 hours' })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Weather Info */}
                <Card className="glass-card border-white/10">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold font-['Montserrat'] text-white mb-4">
                      {t({ ar: 'الطقس الحالي', en: 'Current Weather' })}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Cloud className="w-8 h-8 text-primary" />
                        <div>
                          <div className="text-2xl font-bold text-white">28°C</div>
                          <div className="text-sm text-muted-foreground">
                            {t({ ar: 'مشمس', en: 'Sunny' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Smart Tip Tab */}
          <TabsContent value="smart-tip" className="animate-fade-in-up">
            <Card className="glass-card border-primary/20 bg-gradient-to-br from-purple-900/20 to-indigo-900/20">
              <CardContent className="p-8">
                <div className="flex items-center space-x-4 rtl:space-x-reverse mb-6">
                  <div className="w-12 h-12 gradient-purple rounded-full flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-['Montserrat'] text-white">
                      {t({ ar: 'نصيحة جواد الذكية 💡', en: 'Jawad\'s Smart Tip 💡' })}
                    </h2>
                    <p className="text-muted-foreground font-['Open_Sans']">
                      {t({ ar: 'نصائح مخصصة لتحسين تجربتك', en: 'Personalized tips to enhance your experience' })}
                    </p>
                  </div>
                </div>

                <div className="glass p-6 rounded-lg">
                  <p className="text-lg text-white font-['Open_Sans'] leading-relaxed">
                    {smartTips[id] ? t(smartTips[id]) : t({
                      ar: 'تأكد من التحقق من الطقس قبل زيارتك واحضر كاميرا لالتقاط اللحظات الجميلة!',
                      en: 'Make sure to check the weather before your visit and bring a camera to capture beautiful moments!'
                    })}
                  </p>
                </div>

                <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <p className="text-sm text-blue-200 font-['Open_Sans']">
                    💡 {t({
                      ar: 'هذه النصيحة مبنية على البيانات الحية وتجارب الزوار السابقين',
                      en: 'This tip is based on live data and previous visitors\' experiences'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Crowd Level Tab */}
          <TabsContent value="crowd-level" className="animate-fade-in-up">
            {/* Real-time Crowd Data */}
            <div className="mb-6">
              <RealCrowdDisplay destinationId={destination.id} />
            </div>

            <Card className="glass-card border-white/10">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold font-['Montserrat'] text-white mb-6">
                  {t({ ar: 'تقييم الازدحام من الزوار', en: 'Visitor Crowd Assessment' })}
                </h2>

                {!hasGivenFeedback ? (
                  <div>
                    <p className="text-muted-foreground font-['Open_Sans'] mb-6">
                      {t({
                        ar: 'ساعدنا في تحديث البيانات الحية - كيف وجدت مستوى الازدحام؟',
                        en: 'Help us update live data - how did you find the crowd level?'
                      })}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button
                        onClick={() => handleCrowdFeedback('low')}
                        variant="outline"
                        className="glass border-green-500 text-green-400 hover:bg-green-500/20 interactive-button h-16"
                      >
                        <Users className="w-5 h-5 mr-2" />
                        {t({ ar: 'غير مزدحم', en: 'Not Crowded' })}
                      </Button>
                      <Button
                        onClick={() => handleCrowdFeedback('medium')}
                        variant="outline"
                        className="glass border-yellow-500 text-yellow-400 hover:bg-yellow-500/20 interactive-button h-16"
                      >
                        <Users className="w-5 h-5 mr-2" />
                        {t({ ar: 'متوسط', en: 'Moderate' })}
                      </Button>
                      <Button
                        onClick={() => handleCrowdFeedback('high')}
                        variant="outline"
                        className="glass border-red-500 text-red-400 hover:bg-red-500/20 interactive-button h-16"
                      >
                        <Users className="w-5 h-5 mr-2" />
                        {t({ ar: 'مزدحم جداً', en: 'Very Crowded' })}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold font-['Montserrat'] text-white mb-2">
                      {t({ ar: 'شكراً لمساهمتك!', en: 'Thanks for your contribution!' })}
                    </h3>
                    <p className="text-muted-foreground font-['Open_Sans']">
                      {t({
                        ar: 'تم تحديث البيانات الحية بنجاح وستساعد الزوار الآخرين',
                        en: 'Live data has been updated successfully and will help other visitors'
                      })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20 pointer-events-none" />
      <div className="absolute top-40 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
    </div>
  );
};

export default DestinationDetail;