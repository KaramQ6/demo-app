import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { MessageCircle, X, Send, Bot, Power, Loader2, MapPin, Thermometer, Plus, Brain } from 'lucide-react';

const Chatbot = () => {
  const { t, language } = useLanguage();
  const { isChatbotOpen, openChatbot, closeChatbot, sendMessage, chatMessages, showChatbot, toggleChatbotVisibility, liveData, isLoadingData, user } = useApp();
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [localChatMessages, setLocalChatMessages] = useState([]);
  const [isAddingToItinerary, setIsAddingToItinerary] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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

  const availableDestinations = [
    { id: 'petra', names: ['البتراء', 'Petra', 'petra'] },
    { id: 'jerash', names: ['جرش', 'Jerash', 'jerash'] },
    { id: 'wadi-rum', names: ['وادي رم', 'Wadi Rum', 'wadi-rum', 'وادي القمر'] },
    { id: 'aqaba', names: ['العقبة', 'Aqaba', 'aqaba'] },
    { id: 'amman', names: ['عمان', 'Amman', 'amman'] },
    { id: 'dead-sea', names: ['البحر الميت', 'Dead Sea', 'dead-sea'] }
  ];

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

  const addToItinerary = async (destinationId, messageId) => {
    if (!user) {
      alert(t({ ar: 'يجب تسجيل الدخول أولاً', en: 'Please login first' }));
      return;
    }

    setIsAddingToItinerary(messageId);

    try {
      const response = await fetch('https://n8n.smart-tour.app/webhook/addToItinerary', {
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
        alert(t({ ar: 'تمت إضافة الوجهة إلى خطتك بنجاح!', en: 'Destination added to your itinerary successfully!' }));
      } else {
        throw new Error('Failed to add to itinerary');
      }
    } catch (error) {
      alert(t({ ar: 'حدث خطأ أثناء إضافة الوجهة', en: 'Error adding destination to itinerary' }));
    } finally {
      setIsAddingToItinerary(null);
    }
  };

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    setLocalChatMessages(chatMessages);
  }, [chatMessages]);

  useEffect(() => { scrollToBottom(); }, [localChatMessages, isTyping]);
  useEffect(() => { if (isChatbotOpen) inputRef.current?.focus(); }, [isChatbotOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInput = inputValue.trim();
    if (userInput && !isTyping) {
      const userMessage = { id: Date.now(), text: userInput, type: 'user', timestamp: new Date() };
      setLocalChatMessages(prev => [...prev, userMessage]);

      const typingMessage = { id: 'typing-indicator', text: '...', type: 'bot', timestamp: new Date() };
      setLocalChatMessages(prev => [...prev, typingMessage]);
      setIsTyping(true);
      setInputValue('');

      try {
        await sendMessage(userInput);
        setLocalChatMessages(prev => prev.filter(msg => msg.id !== 'typing-indicator'));
      } catch (error) {
        setLocalChatMessages(prev => prev.filter(msg => msg.id !== 'typing-indicator'));
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleActionClick = (action, data) => {
    const feedbackMessage = {
      id: Date.now(),
      text: `🎯 Selected: ${action.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
      type: 'user',
      timestamp: new Date(),
      isActionFeedback: true
    };
    setLocalChatMessages(prev => [...prev, feedbackMessage]);

    const typingMessage = { id: 'action-typing', text: '...', type: 'bot', timestamp: new Date() };
    setLocalChatMessages(prev => [...prev, typingMessage]);
    setIsTyping(true);

    setTimeout(() => {
      let response = '';

      switch (action) {
        case 'view-tours':
          response = `🎟️ Here are the available tours`;
          if (data.destination) {
            response += ` for ${data.destination.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
          }
          response += `:\n\n🏛️ **Classic Petra Day Tour** - $75/person\n⏰ Duration: 8 hours | 👥 Max 15 people\n✨ Includes: Guide, transport, lunch\n\n🏜️ **Wadi Rum Desert Experience** - $95/person\n⏰ Duration: 2 days | 🏕️ Camping included\n✨ Includes: Camel ride, Bedouin dinner`;
          break;
        case 'customize-search':
          response = `🔧 Let's customize your search! I can help you filter by:\n\n📅 **Dates**: When do you want to travel?\n💰 **Budget**: What's your price range?\n🎯 **Interests**: Adventure, culture, relaxation?\n👥 **Group Size**: How many travelers?`;
          break;
        default:
          response = `I'm processing your request for: ${action}. Let me get that information for you!`;
      }

      setLocalChatMessages(prev => prev.filter(msg => msg.id !== 'action-typing'));

      const botResponse = {
        id: Date.now() + 1,
        text: response,
        type: 'bot',
        timestamp: new Date(),
        actionData: data
      };

      setLocalChatMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleStarterClick = (starterText) => {
    if (!isTyping) {
      setInputValue(starterText);
      setTimeout(() => {
        const event = new Event('submit', { bubbles: true, cancelable: true });
        document.querySelector('#chatbot-form').dispatchEvent(event);
      }, 100);
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
              <div className="w-10 h-10 gradient-purple rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{t({ ar: 'جواد', en: 'Jawad' })}</h3>
                <p className="text-xs text-muted-foreground">{t({ ar: 'مرشدك الذكي', en: 'Your Smart Guide' })}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <button onClick={toggleChatbotVisibility} className="p-2 rounded-lg hover:bg-white/10">
                <Power className="w-4 h-4 text-muted-foreground" />
              </button>
              <button onClick={closeChatbot} className="p-2 rounded-lg hover:bg-white/10">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="px-4 py-3 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-b border-white/5 min-h-[50px]">
            {isLoadingData ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              </div>
            ) : liveData && (liveData.cityName || liveData.name) ? (
              <div className="flex items-center justify-between text-sm animate-fade-in">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium">
                    {liveData.cityName || liveData.name}
                    {liveData.locationSource === 'default' && (
                      <span className="text-xs text-gray-400 ml-1">
                        ({t({ ar: '(افتراضي)', en: '(default)' })})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Thermometer className="w-4 h-4 text-orange-400" />
                  <span className="text-white font-medium">
                    {liveData.temperature || (liveData.main && liveData.main.temp)}°C
                  </span>
                  {liveData.weather && liveData.weather[0] && (
                    <span className="text-lg">
                      {liveData.weather[0].main === 'Clear' ? '☀️' :
                        liveData.weather[0].main === 'Clouds' ? '☁️' :
                          liveData.weather[0].main === 'Rain' ? '🌧️' : '🌤️'}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-xs text-yellow-400">
                {t({ ar: 'استخدام الموقع الافتراضي - عمان', en: 'Using default location - Amman' })}
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

                if (message.type === 'actions') {
                  return (
                    <div key={message.id} className="flex justify-start">
                      <div className="max-w-xs lg:max-w-md">
                        <div className="flex flex-wrap gap-2">
                          {message.actions.map((action, index) => (
                            <button
                              key={index}
                              onClick={() => handleActionClick(action.action, action.data)}
                              className="px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all flex items-center space-x-1"
                            >
                              <Brain className="w-3 h-3" />
                              <span>{action.text}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

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
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200" id="chatbot-form">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
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
