import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Lightbulb, Users, ThumbsUp, Activity, MapPin, Star, Brain, Zap, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { destinations } from '../mock';

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const { 
    userFeedback, 
    updateUserFeedback, 
    isLoading, 
    setLoadingState,
    showNotification,
    openChatbot 
  } = useApp();
  
  const [showThanks, setShowThanks] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [feedbackAnimation, setFeedbackAnimation] = useState(null);

  const destination = destinations.find(d => d.id === id);

  useEffect(() => {
    // Check if user has already provided feedback
    if (userFeedback[id]?.crowdLevel) {
      setShowThanks(true);
    }
  }, [userFeedback, id]);

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-12 h-12 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4 font-['Montserrat']">
            {t({ ar: 'الوجهة غير موجودة', en: 'Destination Not Found' })}
          </h1>
          <p className="text-muted-foreground mb-8 font-['Open_Sans']">
            {t({ 
              ar: 'الوجهة التي تبحث عنها غير متوفرة',
              en: 'The destination you are looking for is not available'
            })}
          </p>
          <Button 
            onClick={() => navigate('/destinations')}
            className="gradient-purple hover:scale-105 px-8 py-3 interactive-button"
          >
            {isRTL ? <ArrowLeft className="mr-2 h-5 w-5" /> : <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />}
            {t({ ar: 'العودة للوجهات', en: 'Back to Destinations' })}
          </Button>
        </div>
      </div>
    );
  }

  const handleCrowdFeedback = async (level) => {
    const loadingKey = `crowd-feedback-${id}`;
    setLoadingState(loadingKey, true);
    setFeedbackAnimation(level);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateUserFeedback(id, 'crowdLevel', level);
      setShowThanks(true);
      
      // Show animated success
      setTimeout(() => {
        setFeedbackAnimation(null);
      }, 500);
      
      // Auto-hide thanks message after 5 seconds
      setTimeout(() => {
        setShowThanks(false);
      }, 5000);

    } catch (error) {
      showNotification(
        t({ ar: 'حدث خطأ، حاول مرة أخرى', en: 'An error occurred, please try again' }),
        'error'
      );
    } finally {
      setLoadingState(loadingKey, false);
    }
  };

  const handleAskAboutDestination = () => {
    const message = t({ 
      ar: `أخبرني المزيد عن ${t(destination.name)} ونصائح للزيارة`,
      en: `Tell me more about ${t(destination.name)} and visiting tips`
    });
    openChatbot(message);
  };

  const crowdOptions = [
    { 
      level: 'low', 
      text: { ar: 'غير مزدحم', en: 'Not Crowded' },
      color: 'bg-green-500',
      icon: '😊'
    },
    { 
      level: 'medium', 
      text: { ar: 'متوسط', en: 'Moderate' },
      color: 'bg-yellow-500',
      icon: '😐'
    },
    { 
      level: 'high', 
      text: { ar: 'مزدحم جداً', en: 'Very Crowded' },
      color: 'bg-red-500',
      icon: '😰'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Image Section */}
      <section className="relative h-96 flex items-end overflow-hidden">
        <img
          src={destination.image}
          alt={t(destination.name)}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-overlay"></div>
        
        {/* Live Status Badges */}
        <div className="absolute top-8 left-8 right-8 flex justify-between z-10">
          <div className="flex space-x-3 rtl:space-x-reverse">
            <Badge className="glass bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2 animate-pulse-glow">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 rtl:mr-0 rtl:ml-2 animate-pulse-glow"></div>
              {t({ ar: 'مباشر', en: 'Live' })}
            </Badge>
            <Badge className="glass bg-primary/20 text-primary border-primary/30 px-4 py-2">
              <Brain className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {t({ ar: 'ذكي', en: 'AI Ready' })}
            </Badge>
          </div>
          <Badge className="glass bg-white/10 text-white border-white/20 px-4 py-2">
            <Star className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 text-yellow-400" />
            4.8
          </Badge>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-12 w-full">
          <div className="animate-slide-up">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-['Montserrat']">
              {t(destination.name)}
            </h1>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6 rtl:md:space-x-reverse space-y-4 md:space-y-0">
              <p className="text-xl text-white/90 font-['Open_Sans']">
                {t(destination.shortDescription)}
              </p>
              <div className="flex items-center space-x-3 rtl:space-x-reverse glass px-4 py-2 rounded-full">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-white font-['Open_Sans']">
                  {t({ ar: 'الأردن', en: 'Jordan' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-12 glass-card border border-white/10 p-2">
              <TabsTrigger 
                value="overview" 
                className="font-['Open_Sans'] data-[state=active]:bg-primary data-[state=active]:text-white px-6 py-3 text-base nav-link"
              >
                {t({ ar: 'نظرة عامة', en: 'Overview' })}
              </TabsTrigger>
              <TabsTrigger 
                value="smart-tip" 
                className="font-['Open_Sans'] data-[state=active]:bg-primary data-[state=active]:text-white px-6 py-3 text-base nav-link"
              >
                {t({ ar: 'نصيحة جواد 💡', en: 'Jawad\'s Tip 💡' })}
              </TabsTrigger>
              <TabsTrigger 
                value="crowd-level" 
                className="font-['Open_Sans'] data-[state=active]:bg-primary data-[state=active]:text-white px-6 py-3 text-base nav-link"
              >
                {t({ ar: 'مستوى الازدحام', en: 'Crowd Level' })}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0 animate-fade-in">
              <Card className="glass-card border-white/10">
                <CardContent className="p-12">
                  <div className="flex items-start space-x-6 rtl:space-x-reverse mb-8">
                    <div className="w-16 h-16 gradient-purple rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-white mb-4 font-['Montserrat']">
                        {t({ ar: 'معلومات تفصيلية', en: 'Detailed Information' })}
                      </h3>
                      <p className="text-muted-foreground text-lg leading-relaxed font-['Open_Sans']">
                        {t(destination.overview)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Additional Features */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="glass p-6 rounded-xl text-center interactive-card">
                      <Activity className="w-8 h-8 text-primary mx-auto mb-3" />
                      <div className="text-base text-white font-['Open_Sans'] font-medium">
                        {t({ ar: 'IoT مُفعل', en: 'IoT Enabled' })}
                      </div>
                    </div>
                    <div className="glass p-6 rounded-xl text-center interactive-card">
                      <Brain className="w-8 h-8 text-primary mx-auto mb-3" />
                      <div className="text-base text-white font-['Open_Sans'] font-medium">
                        {t({ ar: 'ذكاء اصطناعي', en: 'AI Powered' })}
                      </div>
                    </div>
                    <div className="glass p-6 rounded-xl text-center interactive-card">
                      <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
                      <div className="text-base text-white font-['Open_Sans'] font-medium">
                        {t({ ar: 'بيانات فورية', en: 'Real-time Data' })}
                      </div>
                    </div>
                  </div>

                  {/* Ask Jawad Button */}
                  <div className="text-center">
                    <Button
                      onClick={handleAskAboutDestination}
                      className="gradient-purple hover:scale-105 px-8 py-4 text-lg font-semibold rounded-xl interactive-button shadow-xl font-['Open_Sans']"
                    >
                      <Brain className="mr-3 rtl:mr-0 rtl:ml-3 h-5 w-5" />
                      {t({ ar: 'اسأل جواد عن هذه الوجهة', en: 'Ask Jawad about this destination' })}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="smart-tip" className="mt-0 animate-fade-in">
              <Card className="glass-card border-primary/30 border-2">
                <CardContent className="p-12">
                  <div className="flex items-start space-x-6 rtl:space-x-reverse">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 gradient-purple rounded-2xl flex items-center justify-center animate-pulse-glow">
                        <Lightbulb className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-white mb-4 font-['Montserrat'] flex items-center space-x-3 rtl:space-x-reverse">
                        <span>{t({ ar: 'نصيحة اليوم من جواد', en: 'Today\'s Tip from Jawad' })}</span>
                        <Brain className="w-6 h-6 text-primary" />
                      </h3>
                      <p className="text-muted-foreground leading-relaxed font-['Open_Sans'] text-lg mb-6">
                        {t(destination.smartTip)}
                      </p>
                      
                      {/* AI Enhancement */}
                      <div className="glass p-6 rounded-xl">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-3">
                          <Zap className="w-5 h-5 text-primary" />
                          <span className="text-lg font-semibold text-white font-['Montserrat']">
                            {t({ ar: 'تحليل ذكي', en: 'AI Analysis' })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground font-['Open_Sans']">
                          {t({ 
                            ar: 'هذه النصيحة مبنية على تحليل البيانات الحية وأنماط الزوار السابقين باستخدام الذكاء الاصطناعي',
                            en: 'This tip is based on live data analysis and previous visitor patterns using artificial intelligence'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="crowd-level" className="mt-0 animate-fade-in">
              <Card className="glass-card border-white/10">
                <CardContent className="p-12">
                  <div className="text-center">
                    <div className="mb-12">
                      <div className="inline-flex items-center justify-center w-20 h-20 gradient-purple rounded-2xl mb-6 animate-pulse-glow">
                        <Users className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-semibold text-white mb-4 font-['Montserrat']">
                        {t({ ar: 'كيف وجدت مستوى الازدحام؟', en: 'How did you find the crowd level?' })}
                      </h3>
                      <p className="text-muted-foreground font-['Open_Sans'] text-lg">
                        {t({ 
                          ar: 'ساعد الزوار الآخرين بمشاركة تجربتك مع نظامنا الذكي', 
                          en: 'Help other visitors by sharing your experience with our smart system' 
                        })}
                      </p>
                    </div>

                    {!showThanks ? (
                      <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
                        {crowdOptions.map((option) => (
                          <Button
                            key={option.level}
                            onClick={() => handleCrowdFeedback(option.level)}
                            disabled={isLoading[`crowd-feedback-${id}`]}
                            className={`font-['Open_Sans'] min-w-36 glass-card border-white/20 hover:bg-primary/20 interactive-button px-8 py-4 text-lg relative overflow-hidden ${
                              feedbackAnimation === option.level ? 'animate-pulse-glow' : ''
                            }`}
                            variant="outline"
                          >
                            {isLoading[`crowd-feedback-${id}`] && feedbackAnimation === option.level ? (
                              <Loader2 className="w-5 h-5 animate-spin mr-2 rtl:mr-0 rtl:ml-2" />
                            ) : feedbackAnimation === option.level ? (
                              <CheckCircle className="w-5 h-5 text-green-400 mr-2 rtl:mr-0 rtl:ml-2 animate-scale-in" />
                            ) : (
                              <>
                                <span className="text-xl mr-3 rtl:mr-0 rtl:ml-3">{option.icon}</span>
                                <div className={`w-4 h-4 rounded-full ${option.color} mr-3 rtl:mr-0 rtl:ml-3`} />
                              </>
                            )}
                            {t(option.text)}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center mb-8 animate-scale-in">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-2xl mb-6 animate-pulse-glow">
                          <ThumbsUp className="w-10 h-10 text-green-400" />
                        </div>
                        <h4 className="text-2xl font-semibold text-green-400 font-['Montserrat'] mb-4">
                          {t({ ar: 'شكراً لمساهمتك! 🎉', en: 'Thanks for your contribution! 🎉' })}
                        </h4>
                        <p className="text-muted-foreground font-['Open_Sans'] text-lg">
                          {t({ 
                            ar: 'ستساعد معلوماتك الزوار الآخرين في التخطيط لرحلتهم بذكاء', 
                            en: 'Your information will help other visitors plan their trip smartly' 
                          })}
                        </p>
                      </div>
                    )}

                    {/* AI Insights */}
                    <div className="glass p-6 rounded-xl">
                      <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse mb-4">
                        <Brain className="w-6 h-6 text-primary" />
                        <span className="text-lg font-semibold text-white font-['Montserrat']">
                          {t({ ar: 'رؤى ذكية', en: 'AI Insights' })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground font-['Open_Sans']">
                        {t({ 
                          ar: 'نستخدم الذكاء الاصطناعي لتحليل بياناتك وتقديم توصيات مخصصة للزوار القادمين بناءً على التجارب الحقيقية',
                          en: 'We use AI to analyze your data and provide personalized recommendations for future visitors based on real experiences'
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default DestinationDetail;