import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Facebook, Instagram, Twitter, Activity } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  const quickLinks = [
    { name: { ar: 'الرئيسية', en: 'Home' }, href: '/' },
    { name: { ar: 'وجهاتنا', en: 'Destinations' }, href: '/destinations' },
    { name: { ar: 'البيانات الحية', en: 'Live Data Hub' }, href: '/iot-hub' },
    { name: { ar: 'التجربة التفاعلية', en: 'Demo' }, href: '/demo' },
    { name: { ar: 'عن المشروع', en: 'About' }, href: '/about' }
  ];

  const aboutText = {
    ar: 'منصة ذكية تقودها التكنولوجيا لاستكشاف الأردن بطريقة مبتكرة، تجمع بين الذكاء الاصطناعي وإنترنت الأشياء لتقديم تجربة سياحية فريدة.',
    en: 'A cutting-edge technology-driven platform for exploring Jordan innovatively, combining AI and IoT to provide a unique tourism experience.'
  };

  return (
    <footer className="glass-card border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Quick Links */}
          <div className="animate-fade-in">
            <h3 className="text-lg font-semibold mb-4 font-['Montserrat'] text-primary flex items-center space-x-2 rtl:space-x-reverse">
              <Activity className="w-5 h-5" />
              <span>{t({ ar: 'روابط سريعة', en: 'Quick Links' })}</span>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 font-['Open_Sans'] flex items-center space-x-2 rtl:space-x-reverse group"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    <span>{t(link.name)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-lg font-semibold mb-4 font-['Montserrat'] text-primary">
              {t({ ar: 'تابعنا', en: 'Follow Us' })}
            </h3>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-all duration-200 p-2 rounded-lg hover:bg-white/5 interactive-button"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-all duration-200 p-2 rounded-lg hover:bg-white/5 interactive-button"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-all duration-200 p-2 rounded-lg hover:bg-white/5 interactive-button"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* About */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-lg font-semibold mb-4 font-['Montserrat'] text-primary">
              {t({ ar: 'من نحن', en: 'About Us' })}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed font-['Open_Sans']">
              {t(aboutText)}
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-8 pt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-center md:text-left text-muted-foreground text-sm font-['Open_Sans']">
              © 2024 SmartTour.Jo - {t({ ar: 'جميع الحقوق محفوظة', en: 'All Rights Reserved' })}
            </p>
            <div className="flex items-center space-x-2 rtl:space-x-reverse mt-4 md:mt-0">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse-glow"></div>
              <span className="text-xs text-muted-foreground font-['Open_Sans']">
                {t({ ar: 'مدعوم بالذكاء الاصطناعي', en: 'Powered by AI' })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;