import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { MessageCircle, X, Send, Bot, Copy, Check, Power, Loader2, MapPin, Thermometer, Plus } from 'lucide-react';

const Chatbot = () => {
  const { t, language, isRTL } = useLanguage();
  const { isChatbotOpen, openChatbot, closeChatbot, sendMessage, chatMessages, showChatbot, toggleChatbotVisibility, liveData, isLoadingData, user } = useApp();
  const [inputValue, setInputValue] = useState('');
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [localChatMessages, setLocalChatMessages] = useState([]);
  const [isAddingToItinerary, setIsAddingToItinerary] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Prompt starters based on language
  const promptStarters = {
    ar: [
      "ما هي أفضل الأماكن للزيارة في الأردن؟",
      "كيف هو الطقس اليوم؟",
      "اقترح عليّ خطة سفر لثلاثة أيام",
      "ما هي أفضل الأوقات لزيارة البتراء؟"
    ],
    en: [
      "What are the best places to visit in Jordan?",
      "How's the weather today?",
      "Suggest a 3-day travel itinerary for me",
      "What are the best times to visit Petra?"
    ]
  };

  const currentStarters = promptStarters[language] || promptStarters.en;

  // قائمة الوجهات المتاحة مع معرفاتها
  const availableDestinations = [
    { id: 'petra', names: ['البتراء', 'Petra', 'petra'] },
    { id: 'jerash', names: ['جرش', 'Jerash', 'jerash'] },
    { id: 'wadi-rum', names: ['وادي رم', 'Wadi Rum', 'wadi-rum', 'وادي القمر'] },
    { id: 'aqaba', names: ['العقبة', 'Aqaba', 'aqaba'] },
    { id: 'amman', names: ['عمان', 'Amman', 'amman'] },
    { id: 'dead-sea', names: ['البحر الميت', 'Dead Sea', 'dead-sea'] }
  ];

  // التحقق من وجود اقتراح وجهة في النص
  const extractDestinationFromMessage = (text) => {
    const lowerText = text.toLowerCase();
    for (const destination of availableDestinations) {
      for (const name of destination.names) {
        if (lowerText.includes(name.toLowerCase())) {
          return destination.id;
        }
      }
    }
    return null;
  };

  // إضافة وجهة إلى المسار
  const addToItinerary = async (destinationId, messageId) => {
    if (!user) {
      alert(t({ ar: 'يجب تسجيل الدخول أولاً', en: 'Please login first' }));
      return;
    }

    setIsAddingToItinerary(messageId);

    try {
      const response = await fetch('https://karamq5.app.n8n.cloud/webhook/addToItinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          destinationId: destinationId
        })
      });

      if (response.ok) {
        // إظهار رسالة نجاح
        alert(t({ ar: 'تمت إضافة الوجهة إلى خطتك بنجاح!', en: 'Destination added to your itinerary successfully!' }));
      } else {
        throw new Error('Failed to add to itinerary');
      }
    } catch (error) {
      console.error('Error adding to itinerary:', error);
      alert(t({ ar: 'حدث خطأ أثناء إضافة الوجهة', en: 'Error adding destination to itinerary' }));
    } finally {
      setIsAddingToItinerary(null);
    }
  };

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  // Sync with global chat messages and add typing indicator
  useEffect(() => {
    setLocalChatMessages(chatMessages);
  }, [chatMessages]);

  useEffect(() => { scrollToBottom(); }, [localChatMessages, isTyping]);
  useEffect(() => { if (isChatbotOpen) inputRef.current?.focus(); }, [isChatbotOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInput = inputValue.trim();
    if (userInput && !isTyping) {
      // Add user message
      const userMessage = { id: Date.now(), text: userInput, type: 'user', timestamp: new Date() };
      setLocalChatMessages(prev => [...prev, userMessage]);

      // Add typing indicator message
      const typingMessage = { id: 'typing-indicator', text: '...', type: 'bot', timestamp: new Date() };
      setLocalChatMessages(prev => [...prev, typingMessage]);
      setIsTyping(true);
      setInputValue('');

      try {
        // Call the global sendMessage function
        await sendMessage(userInput);

        // Remove typing indicator after response
        setLocalChatMessages(prev => prev.filter(msg => msg.id !== 'typing-indicator'));
      } catch (error) {
        console.error('Error sending message:', error);
        // Remove typing indicator on error
        setLocalChatMessages(prev => prev.filter(msg => msg.id !== 'typing-indicator'));
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleStarterClick = (starterText) => {
    if (!isTyping) {
      setInputValue(starterText);
      // Trigger form submission with the starter text
      setTimeout(() => {
        const event = new Event('submit', { bubbles: true, cancelable: true });
        document.querySelector('#chatbot-form').dispatchEvent(event);
      }, 100);
    }
  };

  const handleCopyMessage = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(id);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  if (!showChatbot) return null;

  return (
    <>
      {!isChatbotOpen && (
        <button onClick={openChatbot} className="fixed bottom-6 right-6 w-16 h-16 gradient-purple rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-all z-50">
          <MessageCircle className="w-7 h-7" />
        </button>
      )}
      {isChatbotOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[32rem] glass-card rounded-2xl shadow-2xl flex flex-col z-50 animate-slide-up border border-white/20">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-10 h-10 gradient-purple rounded-full flex items-center justify-center"><Bot className="w-5 h-5 text-white" /></div>
              <div>
                <h3 className="font-semibold text-white">{t({ ar: 'جواد', en: 'Jawad' })}</h3>
                <p className="text-xs text-muted-foreground">{t({ ar: 'مرشدك الذكي', en: 'Your Smart Guide' })}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <button onClick={toggleChatbotVisibility} className="p-2 rounded-lg hover:bg-white/10"><Power className="w-4 h-4 text-muted-foreground" /></button>
              <button onClick={closeChatbot} className="p-2 rounded-lg hover:bg-white/10"><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
          </div>

          <div className="px-4 py-3 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-b border-white/5 min-h-[50px]">
            {isLoadingData ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              </div>
            ) : liveData && liveData.cityName ? (
              <div className="flex items-center justify-between text-sm animate-fade-in">
                {/* Location - Reads from the correct 'cityName' property */}
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium">
                    {liveData.cityName}
                  </span>
                </div>

                {/* Temperature & Weather Icon - Reads from 'weather.iconUrl' */}
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Thermometer className="w-4 h-4 text-orange-400" />
                  <span className="text-white font-medium">
                    {liveData.temperature}°م
                  </span>
                  {/* Defensive check for iconUrl */}
                  {liveData.weather && liveData.weather.iconUrl && (
                    <img
                      src={liveData.weather.iconUrl}
                      alt={liveData.weather.description || 'Weather icon'}
                      className="w-6 h-6"
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-xs text-red-400">
                {t({ ar: 'فشل تحميل البيانات', en: 'Failed to load data' })}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: '400px' }}>
            {localChatMessages.length === 0 ? (
              <div className="text-center space-y-4">
                <div className="text-gray-500 mb-4">
                  {language === 'ar' ? 'كيف يمكنني مساعدتك اليوم؟' : 'How can I help you today?'}
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {currentStarters.map((starter, index) => (
                    <button
                      key={index}
                      onClick={() => handleStarterClick(starter)}
                      className="p-3 text-sm border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                      disabled={isTyping}
                    >
                      {starter}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              localChatMessages.map((message) => {
                const destinationId = message.type === 'bot' ? extractDestinationFromMessage(message.text) : null;

                return (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : message.id === 'typing-indicator'
                        ? 'bg-gray-200 text-gray-600 animate-pulse'
                        : 'bg-gray-200 text-gray-800'
                      }`}>
                      {message.id === 'typing-indicator' ? (
                        <div className="flex items-center space-x-1">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-xs ml-2">{language === 'ar' ? 'يكتب...' : 'typing...'}</span>
                        </div>
                      ) : (
                        <>
                          <div className="mb-2">{message.text}</div>
                          {/* إضافة زر "أضف إلى خطتي" إذا كانت الرسالة تحتوي على اقتراح وجهة */}
                          {destinationId && message.type === 'bot' && (
                            <button
                              onClick={() => addToItinerary(destinationId, message.id)}
                              disabled={isAddingToItinerary === message.id}
                              className="mt-2 flex items-center space-x-2 rtl:space-x-reverse px-3 py-1.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isAddingToItinerary === message.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Plus className="w-3 h-3" />
                              )}
                              <span>
                                {isAddingToItinerary === message.id
                                  ? t({ ar: 'جاري الإضافة...', en: 'Adding...' })
                                  : t({ ar: 'أضف إلى خطتي', en: 'Add to My Plan' })
                                }
                              </span>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>                  <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200" id="chatbot-form">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={language === 'ar' ? 'اكتب رسالتك هنا...' : 'Type your message here...'}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={isTyping || !inputValue.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;