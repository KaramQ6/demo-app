import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from './LanguageContext';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const location = useLocation();
  const { language, t } = useLanguage();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [showChatbot, setShowChatbot] = useState(true);
  const [iotData, setIotData] = useState({});
  const [isTyping, setIsTyping] = useState(false);

  const currentPage = location.pathname;

  // Simulated current location data for enhanced context awareness
  const currentLocationData = {
    name: { ar: 'جرش', en: 'Jerash' },
    temperature: 28,
    congestion: { ar: 'متوسط', en: 'Moderate' },
    congestionLevel: 'medium'
  };

  // Check sessionStorage for chatbot visibility on mount
  useEffect(() => {
    const chatbotHidden = sessionStorage.getItem('chatbotHidden');
    if (chatbotHidden === 'true') {
      setShowChatbot(false);
    }
  }, []);

  // Get contextual greeting based on current page
  const getContextualGreeting = () => {
    const isArabic = language === 'ar';
    
    if (currentPage.includes('/destinations/')) {
      const destinationId = currentPage.split('/destinations/')[1];
      const destinationNames = {
        'jerash': { ar: 'جرش', en: 'Jerash' },
        'petra': { ar: 'البتراء', en: 'Petra' },
        'umm-qais': { ar: 'أم قيس', en: 'Umm Qais' },
        'salt': { ar: 'السلط', en: 'As-Salt' },
        'ajloun': { ar: 'عجلون', en: 'Ajloun' },
        'wadi-rum': { ar: 'وادي رم', en: 'Wadi Rum' }
      };
      
      const destinationName = destinationNames[destinationId];
      if (destinationName) {
        return isArabic 
          ? `أهلاً بك في صفحة ${destinationName.ar}! هل لديك أي سؤال محدد عن هذه المدينة العريقة؟`
          : `Welcome to the ${destinationName.en} page! Do you have any specific questions about this ancient city?`;
      }
    }
    
    if (currentPage === '/data') {
      return isArabic 
        ? 'أرى أنك مهتم بالبيانات الحية. هل أحلل لك وضع الازدحام اليوم؟'
        : 'I see you\'re interested in live data. Should I analyze today\'s crowd situation for you?';
    }
    
    if (currentPage === '/destinations') {
      return isArabic 
        ? 'مرحباً! أرى أنك تتصفح الوجهات السياحية. أي نوع من التجارب تبحث عنه؟ تاريخية، طبيعية، أم ثقافية؟'
        : 'Hello! I see you\'re browsing tourist destinations. What kind of experiences are you looking for? Historical, natural, or cultural?';
    }
    
    // Default homepage greeting
    return isArabic 
      ? 'أهلاً بك في SmartTour.Jo! كيف يمكنني مساعدتك في اكتشاف كنوز الأردن؟'
      : 'Welcome to SmartTour.Jo! How can I help you discover Jordan\'s treasures?';
  };

  // Enhanced intelligent chatbot response system
  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    const isArabic = language === 'ar';

    // Priority keyword responses
    if (message.includes('خطة') || message.includes('plan')) {
      return {
        type: 'text',
        text: isArabic 
          ? 'بالتأكيد! لتصميم خطة مثالية، هل تفضل الأماكن التاريخية أم الطبيعية؟'
          : 'Certainly! To design a perfect plan, do you prefer historical places or natural ones?'
      };
    }

    if (message.includes('شكرا') || message.includes('شكراً') || message.includes('thanks') || message.includes('thank you')) {
      return {
        type: 'text',
        text: isArabic 
          ? 'على الرحب والسعة! أنا هنا للمساعدة في أي وقت.'
          : 'You\'re welcome! I\'m here to help anytime.'
      };
    }

    if (message.includes('مرحبا') || message.includes('مرحباً') || message.includes('hello') || message.includes('hi')) {
      return {
        type: 'text',
        text: getContextualGreeting()
      };
    }

    // Default fallback response
    return {
      type: 'text',
      text: isArabic 
        ? 'عفواً، لم أفهم طلبك. يمكنك أن تطلب مني \'خطة رحلة\' أو تسألني عن \'وجهة سياحية\'.'
        : 'Sorry, I didn\'t understand your request. You can ask me for a \'trip plan\' or ask about a \'tourist destination\'.'
    };
  };

  // Chatbot functions
  const openChatbot = (initialMessage = null) => {
    setIsChatbotOpen(true);
    
    if (chatMessages.length === 0) {
      const greeting = getContextualGreeting();
      const welcomeMessage = {
        id: Date.now(),
        type: 'bot',
        text: greeting,
        timestamp: new Date()
      };
      setChatMessages([welcomeMessage]);
    }

    if (initialMessage) {
      setTimeout(() => {
        sendMessage(initialMessage);
      }, 500);
    }
  };

  const closeChatbot = () => {
    setIsChatbotOpen(false);
  };

  const toggleChatbotVisibility = () => {
    const newVisibility = !showChatbot;
    setShowChatbot(newVisibility);
    sessionStorage.setItem('chatbotHidden', (!newVisibility).toString());
    if (!newVisibility) {
      setIsChatbotOpen(false);
    }
  };

  const sendMessage = (messageText) => {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: messageText,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse = getBotResponse(messageText);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: botResponse.text,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const value = {
    currentPage,
    isChatbotOpen,
    setIsChatbotOpen,
    chatMessages,
    setChatMessages,
    showChatbot,
    setShowChatbot,
    toggleChatbotVisibility,
    openChatbot,
    closeChatbot,
    sendMessage,
    isTyping,
    iotData,
    setIotData,
    getBotResponse,
    getContextualGreeting
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};