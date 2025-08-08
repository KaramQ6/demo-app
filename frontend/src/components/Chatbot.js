import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { MessageCircle, X, Send, Bot, Copy, Check, Power, Loader2, MapPin, Thermometer, Plus, Brain } from 'lucide-react';
import { parseBookingRequest, generateResponseSuggestions, enhancedTravelParsing } from '../utils/nlpUtils';

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

      // Process with NLP
      const nlpResult = enhancedTravelParsing(userInput);
      console.log('NLP Analysis:', nlpResult);

      // Add typing indicator message
      const typingMessage = { id: 'typing-indicator', text: '...', type: 'bot', timestamp: new Date() };
      setLocalChatMessages(prev => [...prev, typingMessage]);
      setIsTyping(true);
      setInputValue('');

      try {
        // Handle natural language booking requests
        if (nlpResult.intent === 'booking') {
          const bookingResult = parseBookingRequest(userInput);
          console.log('Booking Analysis:', bookingResult);

          if (bookingResult.isBookingRequest) {
            await handleNaturalLanguageBooking(bookingResult);
          } else {
            await sendMessage(userInput);
          }
        } else {
          // Call the global sendMessage function
          await sendMessage(userInput);
        }

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

  // Natural Language Booking Handler with Enhanced Regex Extraction
  const handleNaturalLanguageBooking = async (bookingResult) => {
    const { bookingDetails } = bookingResult;

    // Enhanced regex patterns for better extraction
    const extractEnhancedDetails = (text) => {
      const patterns = {
        // Days pattern: "3 days", "for 5 days", "2-day trip"
        days: /(?:for\s+)?(\d+)[-\s]*days?(?:\s+trip)?/i,
        // People pattern: "2 people", "for 4 persons", "group of 5"
        people: /(?:for\s+)?(?:group\s+of\s+)?(\d+)\s+(?:people|persons?|guests?|travelers?)/i,
        // Type pattern: "adventure tour", "cultural trip", "hiking expedition"
        type: /(adventure|cultural|historical|nature|relaxing|luxury|budget|family|romantic|solo)\s+(?:tour|trip|experience|package)/i,
        // Budget pattern: "$200", "budget of 150", "under $300"
        budget: /(?:budget\s+(?:of\s+)?)?\$?(\d+)(?:\s*dollars?)?/i,
        // Destination pattern: enhanced to catch Jordan locations
        destination: /(petra|wadi\s+rum|dead\s+sea|jerash|aqaba|amman|jordan)/i
      };

      const enhanced = { ...bookingDetails };

      // Extract days
      const daysMatch = text.match(patterns.days);
      if (daysMatch) {
        enhanced.duration = { value: parseInt(daysMatch[1]), unit: 'days' };
      }

      // Extract people count
      const peopleMatch = text.match(patterns.people);
      if (peopleMatch) {
        enhanced.groupSize = parseInt(peopleMatch[1]);
      }

      // Extract trip type
      const typeMatch = text.match(patterns.type);
      if (typeMatch) {
        enhanced.tripType = typeMatch[1].toLowerCase();
      }

      // Extract budget
      const budgetMatch = text.match(patterns.budget);
      if (budgetMatch) {
        enhanced.budget = parseInt(budgetMatch[1]);
      }

      // Extract destination
      const destMatch = text.match(patterns.destination);
      if (destMatch) {
        enhanced.destination = destMatch[1].toLowerCase().replace(/\s+/g, '-');
      }

      return enhanced;
    };

    const userInput = localChatMessages[localChatMessages.length - 2]?.text || '';
    const enhancedDetails = extractEnhancedDetails(userInput);

    let response = "🎯 Perfect! I understand you want to book a trip. ";

    if (enhancedDetails.destination) {
      const destName = enhancedDetails.destination.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
      response += `You're interested in visiting ${destName}. `;
    }

    if (enhancedDetails.duration) {
      response += `For ${enhancedDetails.duration.value} ${enhancedDetails.duration.unit}. `;
    }

    if (enhancedDetails.groupSize > 1) {
      response += `For ${enhancedDetails.groupSize} ${enhancedDetails.groupSize === 2 ? 'people' : 'travelers'}. `;
    } else if (enhancedDetails.groupSize === 1) {
      response += `Solo travel adventure! `;
    }

    if (enhancedDetails.tripType) {
      response += `Looking for ${enhancedDetails.tripType} experiences. `;
    }

    if (enhancedDetails.budget) {
      response += `With a budget around $${enhancedDetails.budget}. `;
    }

    response += "\n\n💡 Based on your request, I can help you find the perfect tour options!";

    const botResponse = {
      id: Date.now() + 1,
      text: response,
      type: 'bot',
      timestamp: new Date(),
      bookingContext: enhancedDetails,
      hasBookingActions: true
    };

    setLocalChatMessages(prev => [...prev, botResponse]);

    // Generate contextual quick action buttons for booking
    setTimeout(() => {
      const actions = [
        {
          text: '🎟️ View Available Tours',
          action: 'view-tours',
          data: enhancedDetails,
          description: 'Browse all matching tours'
        },
        {
          text: '🔧 Customize Your Search',
          action: 'customize-search',
          data: enhancedDetails,
          description: 'Fine-tune your preferences'
        }
      ];

      if (enhancedDetails.destination) {
        actions.push({
          text: `📍 ${enhancedDetails.destination.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Specials`,
          action: 'destination-specials',
          data: enhancedDetails,
          description: 'View destination-specific offers'
        });
      }

      if (enhancedDetails.budget) {
        actions.push({
          text: `💰 Budget-Friendly Options`,
          action: 'budget-options',
          data: enhancedDetails,
          description: `Tours under $${enhancedDetails.budget}`
        });
      }

      const actionButtons = {
        id: 'booking-actions-' + Date.now(),
        type: 'actions',
        actions: actions.slice(0, 4), // Limit to 4 actions for clean UI
        timestamp: new Date(),
        title: 'What would you like to do next?'
      };

      setLocalChatMessages(prev => [...prev, actionButtons]);

      // Add a helpful summary card
      setTimeout(() => {
        const summaryCard = {
          id: 'booking-summary-' + Date.now(),
          type: 'booking-summary',
          details: enhancedDetails,
          timestamp: new Date()
        };
        setLocalChatMessages(prev => [...prev, summaryCard]);
      }, 800);
    }, 600);
  };

  // Handle action button clicks with enhanced functionality
  const handleActionClick = (action, data) => {
    // Add user feedback message first
    const feedbackMessage = {
      id: Date.now(),
      text: `🎯 Selected: ${action.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
      type: 'user',
      timestamp: new Date(),
      isActionFeedback: true
    };
    setLocalChatMessages(prev => [...prev, feedbackMessage]);

    // Add typing indicator
    const typingMessage = { id: 'action-typing', text: '...', type: 'bot', timestamp: new Date() };
    setLocalChatMessages(prev => [...prev, typingMessage]);
    setIsTyping(true);

    // Process different actions
    setTimeout(() => {
      let response = '';
      let hasSpecialContent = false;

      switch (action) {
        case 'view-tours':
          response = `🎟️ Here are the available tours`;
          if (data.destination) {
            response += ` for ${data.destination.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
          }
          response += `:\n\n`;
          response += `🏛️ **Classic Petra Day Tour** - $75/person\n`;
          response += `⏰ Duration: 8 hours | 👥 Max 15 people\n`;
          response += `✨ Includes: Guide, transport, lunch\n\n`;
          response += `🏜️ **Wadi Rum Desert Experience** - $95/person\n`;
          response += `⏰ Duration: 2 days | 🏕️ Camping included\n`;
          response += `✨ Includes: Camel ride, Bedouin dinner\n\n`;
          response += `🌊 **Dead Sea Relaxation Package** - $65/person\n`;
          response += `⏰ Duration: 6 hours | 🧖‍♀️ Spa treatments\n`;
          response += `✨ Includes: Mud therapy, resort access`;
          break;

        case 'customize-search':
          response = `🔧 Let's customize your search! I can help you filter by:\n\n`;
          response += `📅 **Dates**: When do you want to travel?\n`;
          response += `💰 **Budget**: What's your price range?\n`;
          response += `🎯 **Interests**: Adventure, culture, relaxation?\n`;
          response += `👥 **Group Size**: How many travelers?\n`;
          response += `⭐ **Rating**: Minimum star rating?\n\n`;
          response += `Just tell me your preferences and I'll find perfect matches!`;
          break;

        case 'destination-specials':
          const dest = data.destination?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Jordan';
          response = `📍 **${dest} Special Offers:**\n\n`;
          response += `🎉 **Early Bird Special**: 15% off bookings made 7+ days in advance\n`;
          response += `👨‍👩‍👧‍👦 **Family Package**: Kids under 12 get 50% discount\n`;
          response += `🏕️ **Adventure Combo**: Book 2+ destinations, save 20%\n`;
          response += `⭐ **Premium Experience**: Upgrade to private guide for +$30\n\n`;
          response += `💡 *Limited time offers - book now to secure these deals!*`;
          break;

        case 'budget-options':
          response = `💰 **Budget-Friendly Tours under $${data.budget || 100}:**\n\n`;
          response += `🏛️ **Jerash Half-Day** - $45/person\n`;
          response += `• 4-hour guided tour of Roman ruins\n`;
          response += `• Transport from Amman included\n\n`;
          response += `🏰 **Ajloun Castle Visit** - $35/person\n`;
          response += `• Medieval fortress exploration\n`;
          response += `• Forest reserve nature walk\n\n`;
          response += `🌊 **Dead Sea Day Trip** - $55/person\n`;
          response += `• Float experience + mud therapy\n`;
          response += `• Beach resort access included`;
          break;

        case 'get-recommendations':
          response = `🤖 **AI Personalized Recommendations:**\n\n`;
          response += `Based on your preferences, I recommend:\n\n`;
          response += `🥇 **Top Pick**: Petra + Wadi Rum Combo (3 days)\n`;
          response += `• Perfect for ${data.groupSize || 2} travelers\n`;
          response += `• Matches your ${data.tripType || 'adventure'} interest\n`;
          response += `• Within your $${data.budget || 200} budget\n\n`;
          response += `🎯 **Confidence Score**: 94% match\n`;
          response += `⭐ **User Rating**: 4.9/5 (based on similar travelers)`;
          hasSpecialContent = true;
          break;

        default:
          response = `I'm processing your request for: ${action}. Let me get that information for you!`;
      }

      // Remove typing indicator and add response
      setLocalChatMessages(prev => prev.filter(msg => msg.id !== 'action-typing'));

      const botResponse = {
        id: Date.now() + 1,
        text: response,
        type: 'bot',
        timestamp: new Date(),
        hasSpecialContent,
        actionData: data
      };

      setLocalChatMessages(prev => [...prev, botResponse]);

      // Add follow-up actions for certain responses
      if (action === 'view-tours' || action === 'get-recommendations') {
        setTimeout(() => {
          const followUpActions = {
            id: 'followup-actions-' + Date.now(),
            type: 'actions',
            actions: [
              {
                text: '📞 Contact Support',
                action: 'contact-support',
                data: data
              },
              {
                text: '💾 Save to Wishlist',
                action: 'save-wishlist',
                data: data
              },
              {
                text: '📅 Check Availability',
                action: 'check-availability',
                data: data
              }
            ],
            title: 'Next Steps:',
            timestamp: new Date()
          };

          setLocalChatMessages(prev => [...prev, followUpActions]);
        }, 1000);
      }

      setIsTyping(false);
    }, 1500); // Simulate processing time
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
            ) : liveData && (liveData.cityName || liveData.name) ? (
              <div className="flex items-center justify-between text-sm animate-fade-in">
                {/* Location - يقرأ من cityName أو name */}
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

                {/* Temperature & Weather Icon */}
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Thermometer className="w-4 h-4 text-orange-400" />
                  <span className="text-white font-medium">
                    {liveData.temperature || (liveData.main && liveData.main.temp)}°C
                  </span>
                  {/* معالجة أفضل للأيقونة */}
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

                // Handle action buttons separately
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
                          {/* Enhanced NLP context display */}
                          {message.bookingContext && (
                            <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                              <div className="font-semibold text-blue-700 mb-1">Detected booking details:</div>
                              {message.bookingContext.destination && (
                                <div>📍 Destination: {message.bookingContext.destination}</div>
                              )}
                              {message.bookingContext.duration && (
                                <div>⏰ Duration: {message.bookingContext.duration.value} {message.bookingContext.duration.unit}</div>
                              )}
                              {message.bookingContext.groupSize > 1 && (
                                <div>👥 Group: {message.bookingContext.groupSize} people</div>
                              )}
                              {message.bookingContext.budget && (
                                <div>💰 Budget: ${message.bookingContext.budget}</div>
                              )}
                            </div>
                          )}
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