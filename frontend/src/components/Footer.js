import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const { t, isRTL } = useLanguage();
  const { setShowChatbot, showChatbot } = useApp();

  const restoreChatbot = () => {
    setShowChatbot(true);
    sessionStorage.removeItem('chatbotHidden');
  };

  const quickLinks = [
    { path: '/', label: { ar: 'الرئيسية', en: 'Home' } },
    { path: '/destinations', label: { ar: 'الوجهات', en: 'Destinations' } },
    { path: '/data', label: { ar: 'البيانات الحية', en: 'Live Data' } }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' }
  ];

  return (
    <footer className="glass-card border-t border-white/10 mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-8 h-8 gradient-purple rounded-lg flex items-center justify-center">
                <span className="text-white font-bold font-['Montserrat']">S</span>
              </div>
              <h3 className="text-lg font-bold font-['Montserrat'] text-white">SmartTour.Jo</h3>
            </div>
            <p className="text-muted-foreground font-['Open_Sans'] leading-relaxed">
              {t({
                ar: 'منصة ذكية تجمع بين التكنولوجيا الحديثة والتراث الأردني لاستكشاف كنوز الأردن بطريقة مبتكرة وذكية.',
                en: 'A smart platform that combines modern technology with Jordanian heritage to explore Jordan\'s treasures in an innovative and intelligent way.'
              })}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-['Open_Sans']">
                  {t({ ar: 'عمّان، الأردن', en: 'Amman, Jordan' })}
                </span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span className="font-['Open_Sans']">info@smarttour.jo</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <span className="font-['Open_Sans']">+962 6 123 4567</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-['Montserrat'] text-white">
              {t({ ar: 'روابط سريعة', en: 'Quick Links' })}
            </h3>
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-muted-foreground hover:text-primary transition-colors duration-200 font-['Open_Sans']"
                >
                  {t(link.label)}
                </Link>
              ))}
            </div>

            {/* Chatbot Restore Link - only show if chatbot is hidden */}
            {!showChatbot && (
              <button
                onClick={restoreChatbot}
                className="block text-primary hover:text-purple-400 transition-colors duration-200 font-['Open_Sans'] text-sm underline"
              >
                {t({ ar: 'إظهار مساعد جواد', en: 'Show Jawad Assistant' })}
              </button>
            )}
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-['Montserrat'] text-white">
              {t({ ar: 'تابعنا', en: 'Follow Us' })}
            </h3>
            <div className="flex space-x-4 rtl:space-x-reverse">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 glass rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-200 interactive-button"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-sm text-muted-foreground font-['Open_Sans']">
                {t({ 
                  ar: 'مدعوم بأحدث تقنيات الذكاء الاصطناعي وإنترنت الأشياء', 
                  en: 'Powered by the latest AI and IoT technologies' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-sm text-muted-foreground font-['Open_Sans']">
            © 2024 SmartTour.Jo - {t({ ar: 'جميع الحقوق محفوظة', en: 'All Rights Reserved' })}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;