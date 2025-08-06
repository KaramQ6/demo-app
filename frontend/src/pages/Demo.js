import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Camera, History, MessageCircle, CheckCircle, Star, Brain, Zap, Activity } from 'lucide-react';
import { heroImages } from '../mock';

const Demo = () => {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState('original');
  const [showHistory, setShowHistory] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const arGuideTitle = {
    ar: 'تجربة المرشد التفاعلي',
    en: 'Interactive AR Guide Experience'
  };

  const smartBookingTitle = {
    ar: 'نظام الحجز الذكي',
    en: 'Smart Booking System'
  };

  const artifactImages = {
    original: heroImages.demo,
    reconstructed: 'https://images.unsplash.com/photo-1615811648503-479d06197ff3'
  };

  const handleTellHistory = () => {
    setShowHistory(true);
  };

  const handleShowOriginal = () => {
    setSelectedImage('reconstructed');
  };

  const handleBooking = () => {
    setIsBooked(true);
    setTimeout(() => {
      setIsBookingModalOpen(false);
      setIsBooked(false);
    }, 2000);
  };

  const historyText = {
    ar: 'هذا العمود الكورنثي يعود إلى القرن الثاني الميلادي، وهو جزء من المعبد الكبير في البتراء. نُحت بدقة متناهية من الحجر الرملي الوردي المحلي، ويُعتبر من أروع الأمثلة على فن العمارة النبطية الرومانية. كان هذا المعبد مركزاً دينياً مهماً حيث تُقام الطقوس والاحتفالات الدينية.',
    en: 'This Corinthian column dates back to the 2nd century AD and is part of the Great Temple in Petra. It was carved with exquisite precision from local rose-colored sandstone and is considered one of the finest examples of Nabataean-Roman architectural art. This temple was an important religious center where rituals and religious ceremonies were held.'
  };

  const chatSnippet = {
    ar: 'لقد وجدت لك فندقاً بيئياً رائعاً في عجلون بتقييم 9.2. هل أقوم بالحجز لك؟',
    en: 'I found you a wonderful eco-friendly hotel in Ajloun with a 9.2 rating. Should I make the booking for you?'
  };

  return (
    <div className="relative min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto relative z-10">

        {/* Page Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 font-['Montserrat']">
            {t({ ar: 'التجربة التفاعلية', en: 'Interactive Experience' })}
          </h1>
          <div className="w-24 h-1 gradient-purple mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-muted-foreground font-['Open_Sans'] max-w-4xl mx-auto">
            {t({
              ar: 'استكشف تقنياتنا المتطورة لتجربة سياحية فريدة تجمع بين الذكاء الاصطناعي والواقع المعزز',
              en: 'Explore our advanced technologies for a unique tourism experience combining AI and augmented reality'
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Interactive AR Guide Section */}
          <Card className="glass-card overflow-hidden border-white/10 interactive-card animate-scale-in">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="flex items-center space-x-3 rtl:space-x-reverse text-white font-['Montserrat'] text-2xl">
                <div className="w-12 h-12 gradient-purple rounded-xl flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <span>{t(arGuideTitle)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-8">

              {/* Artifact Image */}
              <div className="relative">
                <img
                  src={artifactImages[selectedImage]}
                  alt={t({ ar: 'عمود من البتراء', en: 'Column from Petra' })}
                  className="w-full h-72 object-cover rounded-xl shadow-lg transition-all duration-500"
                />
                <Badge
                  className={`absolute top-4 right-4 px-4 py-2 text-base ${selectedImage === 'reconstructed' ? 'bg-primary text-white' : 'glass bg-white/10 text-white border-white/20'
                    }`}
                >
                  {selectedImage === 'reconstructed'
                    ? t({ ar: 'الشكل الأصلي', en: 'Original Form' })
                    : t({ ar: 'الوضع الحالي', en: 'Current State' })
                  }
                </Badge>
                <div className="absolute bottom-4 left-4 right-4 flex space-x-2 rtl:space-x-reverse">
                  <Badge className="glass bg-green-500/20 text-green-400 border-green-500/30">
                    <Activity className="w-3 h-3 mr-1 rtl:mr-0 rtl:ml-1" />
                    {t({ ar: 'AR نشط', en: 'AR Active' })}
                  </Badge>
                  <Badge className="glass bg-primary/20 text-primary border-primary/30">
                    <Brain className="w-3 h-3 mr-1 rtl:mr-0 rtl:ml-1" />
                    {t({ ar: 'AI مُحلل', en: 'AI Analyzing' })}
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleTellHistory}
                  variant="outline"
                  className="flex-1 font-['Open_Sans'] glass-card border-white/20 hover:bg-white/10 text-white py-4 text-lg interactive-button"
                >
                  <History className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3" />
                  {t({ ar: 'حدثني عن تاريخها', en: 'Tell me about its history' })}
                </Button>
                <Button
                  onClick={handleShowOriginal}
                  className="flex-1 gradient-purple hover:scale-105 font-['Open_Sans'] py-4 text-lg interactive-button"
                >
                  <Zap className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3" />
                  {t({ ar: 'أرني شكلها الأصلي', en: 'Show me its original form' })}
                </Button>
              </div>

              {/* History Text */}
              {showHistory && (
                <div className="glass p-6 rounded-xl border border-primary/30 animate-fade-in">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                    <Brain className="w-6 h-6 text-primary" />
                    <span className="text-lg font-semibold text-white font-['Montserrat']">
                      {t({ ar: 'تحليل الذكاء الاصطناعي', en: 'AI Analysis' })}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed font-['Open_Sans']">
                    {t(historyText)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Smart Booking Section */}
          <Card className="glass-card overflow-hidden border-white/10 interactive-card animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="border-b border-white/10">
              <CardTitle className="flex items-center space-x-3 rtl:space-x-reverse text-white font-['Montserrat'] text-2xl">
                <div className="w-12 h-12 gradient-purple rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span>{t(smartBookingTitle)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-8">

              {/* Chat Snippet */}
              <div className="glass rounded-xl p-6 border border-white/10">
                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                  <div className="w-12 h-12 gradient-purple rounded-full flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse mb-3">
                      <span className="font-semibold text-white font-['Montserrat'] text-lg">
                        {t({ ar: 'جواد', en: 'Jawad' })}
                      </span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                        {t({ ar: 'الآن', en: 'Now' })}
                      </Badge>
                      <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                        <Brain className="w-3 h-3 mr-1 rtl:mr-0 rtl:ml-1" />
                        {t({ ar: 'AI', en: 'AI' })}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed font-['Open_Sans'] text-lg">
                      {t(chatSnippet)}
                    </p>

                    {/* Hotel Details */}
                    <div className="mt-6 p-4 glass rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-white font-['Montserrat'] text-lg">
                          {t({ ar: 'فندق الغابات الخضراء', en: 'Green Forest Hotel' })}
                        </h4>
                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                          <Star className="w-5 h-5 text-yellow-500" />
                          <span className="text-base font-semibold text-white">9.2</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground font-['Open_Sans']">
                        {t({ ar: 'عجلون • بيئي • إطلالة على الغابة', en: 'Ajloun • Eco-friendly • Forest view' })}
                      </p>
                      <div className="flex items-center space-x-4 rtl:space-x-reverse mt-4">
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          {t({ ar: 'بيئي', en: 'Eco-friendly' })}
                        </Badge>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          {t({ ar: 'متاح', en: 'Available' })}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Button */}
              <Button
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full gradient-purple hover:scale-105 font-['Open_Sans'] py-4 text-xl interactive-button"
                size="lg"
              >
                <CheckCircle className="mr-3 rtl:mr-0 rtl:ml-3 h-6 w-6" />
                {t({ ar: 'نعم، قم بالحجز الآن', en: 'Yes, make the booking now' })}
              </Button>

              {/* Features List */}
              <div className="space-y-4">
                <p className="text-lg font-semibold text-white font-['Montserrat'] flex items-center space-x-2 rtl:space-x-reverse">
                  <Zap className="w-5 h-5 text-primary" />
                  <span>{t({ ar: 'مميزات الحجز الذكي:', en: 'Smart Booking Features:' })}</span>
                </p>
                <ul className="space-y-3 font-['Open_Sans']">
                  <li className="flex items-center space-x-3 rtl:space-x-reverse text-muted-foreground">
                    <div className="w-2 h-2 gradient-purple rounded-full"></div>
                    <span>{t({ ar: 'مقارنة الأسعار تلقائياً', en: 'Automatic price comparison' })}</span>
                  </li>
                  <li className="flex items-center space-x-3 rtl:space-x-reverse text-muted-foreground">
                    <div className="w-2 h-2 gradient-purple rounded-full"></div>
                    <span>{t({ ar: 'تجنب أوقات الازدحام', en: 'Avoid crowded times' })}</span>
                  </li>
                  <li className="flex items-center space-x-3 rtl:space-x-reverse text-muted-foreground">
                    <div className="w-2 h-2 gradient-purple rounded-full"></div>
                    <span>{t({ ar: 'توصيات شخصية', en: 'Personal recommendations' })}</span>
                  </li>
                  <li className="flex items-center space-x-3 rtl:space-x-reverse text-muted-foreground">
                    <div className="w-2 h-2 gradient-purple rounded-full"></div>
                    <span>{t({ ar: 'دعم بيئي', en: 'Eco-friendly support' })}</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technology Showcase */}
        <div className="mt-20 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="glass-card p-12 rounded-3xl border border-primary/20">
            <div className="inline-flex items-center justify-center w-20 h-20 gradient-purple rounded-full mb-8 animate-pulse-glow">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-6 font-['Montserrat']">
              {t({ ar: 'تقنيات متطورة لتجربة فريدة', en: 'Advanced Technologies for Unique Experience' })}
            </h3>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto font-['Open_Sans'] mb-8">
              {t({
                ar: 'نجمع بين الذكاء الاصطناعي والواقع المعزز وإنترنت الأشياء لتقديم تجربة سياحية تفاعلية لا مثيل لها',
                en: 'We combine artificial intelligence, augmented reality, and IoT to deliver an unparalleled interactive tourism experience'
              })}
            </p>
            <div className="flex items-center justify-center space-x-8 rtl:space-x-reverse text-base text-muted-foreground">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Brain className="w-6 h-6 text-primary" />
                <span>{t({ ar: 'ذكاء اصطناعي', en: 'AI' })}</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Camera className="w-6 h-6 text-primary" />
                <span>{t({ ar: 'واقع معزز', en: 'AR' })}</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Activity className="w-6 h-6 text-primary" />
                <span>{t({ ar: 'إنترنت الأشياء', en: 'IoT' })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
          <DialogContent className="sm:max-w-md glass-strong border border-primary/30">
            <DialogHeader>
              <DialogTitle className="text-center font-['Montserrat'] text-white text-xl">
                {isBooked
                  ? t({ ar: 'تم تأكيد الحجز!', en: 'Booking Confirmed!' })
                  : t({ ar: 'تأكيد الحجز', en: 'Confirm Booking' })
                }
              </DialogTitle>
            </DialogHeader>
            <div className="text-center py-8">
              {isBooked ? (
                <div className="space-y-6 animate-scale-in">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full animate-pulse-glow">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-green-400 mb-4 font-['Montserrat']">
                      {t({ ar: 'تهانينا!', en: 'Congratulations!' })}
                    </h3>
                    <p className="text-muted-foreground font-['Open_Sans'] text-lg">
                      {t({
                        ar: 'تم تأكيد حجزك بنجاح. (هذه نسخة تجريبية)',
                        en: 'Your booking has been confirmed successfully. (This is a demo version)'
                      })}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="w-20 h-20 gradient-purple rounded-full flex items-center justify-center mx-auto animate-pulse-glow">
                    <MessageCircle className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-6 font-['Open_Sans'] text-lg">
                      {t({
                        ar: 'هل أنت متأكد من رغبتك في حجز فندق الغابات الخضراء؟',
                        en: 'Are you sure you want to book Green Forest Hotel?'
                      })}
                    </p>
                    <Button
                      onClick={handleBooking}
                      className="w-full gradient-purple hover:scale-105 font-['Open_Sans'] py-4 text-lg interactive-button"
                    >
                      <CheckCircle className="mr-3 rtl:mr-0 rtl:ml-3 h-5 w-5" />
                      {t({ ar: 'تأكيد الحجز', en: 'Confirm Booking' })}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20 pointer-events-none" />
      <div className="absolute top-40 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
    </div>
  );
};

export default Demo;