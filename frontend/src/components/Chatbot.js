import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { MessageCircle, X, Send, Bot, Copy, Check, Power, Loader2, MapPin, Thermometer } from 'lucide-react';

const Chatbot = () => {
  const { t, language, isRTL } = useLanguage();
  const { isChatbotOpen, openChatbot, closeChatbot, sendMessage, chatMessages, isTyping, showChatbot, toggleChatbotVisibility, liveData, isLoadingData } = useApp();
  const [inputValue, setInputValue] = useState('');
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => { scrollToBottom(); }, [chatMessages, isTyping]);
  useEffect(() => { if (isChatbotOpen) inputRef.current?.focus(); }, [isChatbotOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userInput = inputValue.trim();
    if (userInput) {
      sendMessage(userInput);
      setInputValue('');
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

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="relative group">
                  <div className={`max-w-xs px-4 py-3 rounded-xl ${msg.type === 'user' ? 'gradient-purple' : 'glass'}`}>
                    <p className="text-sm text-white whitespace-pre-line">{msg.text}</p>
                    <div className="text-xs text-white/60 mt-2">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  {msg.type === 'bot' && (
                    <button onClick={() => handleCopyMessage(msg.text, msg.id)} className={`absolute ${isRTL ? 'left-1' : 'right-1'} top-1 opacity-0 group-hover:opacity-100 p-1`}>
                      {copiedMessageId === msg.id ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isTyping && <div className="flex justify-start"><div className="glass px-4 py-3 rounded-xl"><Loader2 className="w-5 h-5 text-white animate-spin" /></div></div>}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
            <div className="flex space-x-2 rtl:space-x-reverse">
              <input ref={inputRef} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={t({ar: "اسأل جواد...", en: "Ask Jawad..."})} className="flex-1 px-4 py-2 glass rounded-lg" disabled={isTyping} />
              <button type="submit" disabled={!inputValue.trim() || isTyping} className="px-4 py-2 gradient-purple rounded-lg"><Send className="w-4 h-4" /></button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;