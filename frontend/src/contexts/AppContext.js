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
    
    // Enhanced contextual greetings with location awareness
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
        ? `أرى أنك مهتم بالبيانات الحية. بالمناسبة، أنت الآن في ${currentLocationData.name.ar} حيث الازدحام ${currentLocationData.congestion.ar}. هل أحلل لك وضع الازدحام اليوم؟`
        : `I see you're interested in live data. By the way, you're currently in ${currentLocationData.name.en} where crowd level is ${currentLocationData.congestion.en}. Should I analyze today's crowd situation for you?`;
    }
    
    if (currentPage === '/destinations') {
      return isArabic 
        ? 'مرحباً! أرى أنك تتصفح الوجهات السياحية. أي نوع من التجارب تبحث عنه؟ تاريخية، طبيعية، أم ثقافية؟'
        : 'Hello! I see you\'re browsing tourist destinations. What kind of experiences are you looking for? Historical, natural, or cultural?';
    }
    
    if (currentPage === '/demo') {
      return isArabic 
        ? `أهلاً بك في التجربة التفاعلية! هل تريد معرفة المزيد عن تقنياتنا المتطورة أم لديك أسئلة حول كيفية عمل النظام؟`
        : `Welcome to the interactive experience! Would you like to know more about our advanced technologies or do you have questions about how the system works?`;
    }
    
    if (currentPage === '/about') {
      return isArabic 
        ? `أهلاً بك! أرى أنك تتعرف على مشروعنا. هل لديك أسئلة حول رؤيتنا أو التقنيات التي نستخدمها؟`
        : `Welcome! I see you're learning about our project. Do you have questions about our vision or the technologies we use?`;
    }
    
    // Enhanced homepage greeting with location context
    return isArabic 
      ? `أهلاً بك في SmartTour.Jo! أرى أنك في ${currentLocationData.name.ar} الآن. كيف يمكنني مساعدتك في اكتشاف كنوز الأردن؟`
      : `Welcome to SmartTour.Jo! I see you're currently in ${currentLocationData.name.en}. How can I help you discover Jordan's treasures?`;
  };

  // Enhanced intelligent chatbot response system
  const getBotResponse = (userMessage) => {
    // Ensure userMessage is a string
    const messageText = typeof userMessage === 'string' ? userMessage : String(userMessage);
    const message = messageText.toLowerCase();
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

    // Context-aware responses based on current page
    if (currentPage === '/data') {
      if (message.includes('ازدحام') || message.includes('crowd') || message.includes('busy')) {
        return {
          type: 'text',
          text: isArabic 
            ? 'بناءً على البيانات الحية الحالية، أنصحك بزيارة أم قيس أو عجلون حيث مستوى الازدحام منخفض. البتراء وجرش مزدحمتان حالياً. هل تريد تفاصيل أكثر عن وجهة معينة؟'
            : 'Based on current live data, I recommend visiting Umm Qais or Ajloun where crowd levels are low. Petra and Jerash are currently crowded. Would you like more details about a specific destination?'
        };
      }
    }

    // Extended keyword matching logic
    const destinationKeywords = ['وجهة', 'مكان', 'سياحة', 'زيارة', 'destination', 'place', 'visit', 'tourist'];
    const weatherKeywords = ['طقس', 'جو', 'حرارة', 'weather', 'temperature', 'climate'];
    const foodKeywords = ['طعام', 'أكل', 'مطعم', 'food', 'eat', 'restaurant'];
    const transportKeywords = ['مواصلات', 'سيارة', 'حافلة', 'transport', 'car', 'bus'];
    const crowdKeywords = ['ازدحام', 'زحمة', 'مزدحم', 'crowd', 'busy', 'crowded'];
    const iotKeywords = ['بيانات', 'استشعار', 'iot', 'sensor', 'data', 'live'];

    // Check for destination inquiry
    if (destinationKeywords.some(keyword => message.includes(keyword))) {
      return {
        type: 'destinations',
        text: isArabic 
          ? 'إليك أفضل الوجهات السياحية في الأردن مع البيانات الحية:'
          : 'Here are the best tourist destinations in Jordan with live data:',
        showDestinations: true
      };
    }

    // Check for weather inquiry
    if (weatherKeywords.some(keyword => message.includes(keyword))) {
      return {
        type: 'text',
        text: isArabic 
          ? `الطقس حالياً في ${currentLocationData.name.ar} هو ${currentLocationData.temperature}°م. الجو مناسب للتنزه! هل تريد نصائح حول أفضل الأنشطة في هذا الطقس؟`
          : `Current weather in ${currentLocationData.name.en} is ${currentLocationData.temperature}°C. Perfect for sightseeing! Would you like tips on the best activities for this weather?`
      };
    }

    // Check for food inquiry
    if (foodKeywords.some(keyword => message.includes(keyword))) {
      return {
        type: 'text',
        text: isArabic 
          ? 'يمكنني أن أنصحك بأفضل المطاعم المحلية! هل تفضل المأكولات التراثية الأردنية أم تبحث عن خيارات عالمية؟'
          : 'I can recommend the best local restaurants! Do you prefer traditional Jordanian cuisine or are you looking for international options?'
      };
    }

    // Check for transportation inquiry
    if (transportKeywords.some(keyword => message.includes(keyword))) {
      return {
        type: 'text',
        text: isArabic 
          ? 'يمكنني مساعدتك في ترتيب المواصلات! هل تفضل استئجار سيارة، أم تريد معلومات عن الحافلات السياحية، أم تبحث عن خدمات النقل الخاص؟'
          : 'I can help you arrange transportation! Do you prefer car rental, tourist bus information, or private transport services?'
      };
    }

    // Check for crowd information
    if (crowdKeywords.some(keyword => message.includes(keyword))) {
      return {
        type: 'text',
        text: isArabic 
          ? 'يمكنك مراجعة البيانات الحية للازدحام في صفحة "مركز البيانات الحية". نستخدم أجهزة استشعار IoT لتقديم معلومات فورية عن مستوى الازدحام في كل موقع! هل تريد مني تحليل الوضع الحالي؟'
          : 'You can check live crowd data in the "Live Data Hub" page. We use IoT sensors to provide real-time information about crowd levels at each location! Would you like me to analyze the current situation?'
      };
    }

    // Default response with context awareness - as specifically requested fallback
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
    getContextualGreeting,
    currentLocationData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};