import React, { useState, useEffect, useRef } from 'react';

const VoiceAssistantPage = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState('');
    const [conversationHistory, setConversationHistory] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [micPermission, setMicPermission] = useState('pending');
    const [voiceSettings, setVoiceSettings] = useState({
        language: 'en-US',
        voice: 'female',
        speed: 1,
        pitch: 1
    });

    const recognitionRef = useRef(null);
    const synthesisRef = useRef(null);

    // Initialize speech recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
            recognitionRef.current = new SpeechRecognition();

            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = voiceSettings.language;

            recognitionRef.current.onstart = () => {
                setIsListening(true);
                setMicPermission('granted');
            };

            recognitionRef.current.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }

                setTranscript(finalTranscript + interimTranscript);

                if (finalTranscript) {
                    handleVoiceCommand(finalTranscript);
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                if (event.error === 'not-allowed') {
                    setMicPermission('denied');
                }
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        } else {
            setMicPermission('not-supported');
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [voiceSettings.language]);

    // Start/stop voice recognition
    const toggleListening = () => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setTranscript('');
            recognitionRef.current.start();
        }
    };

    // Process voice commands and generate responses
    const handleVoiceCommand = async (command) => {
        setIsProcessing(true);

        // Add user message to conversation history
        const userMessage = {
            id: Date.now(),
            type: 'user',
            text: command,
            timestamp: new Date().toLocaleTimeString()
        };

        setConversationHistory(prev => [...prev, userMessage]);

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const assistantResponse = generateResponse(command.toLowerCase());

        const assistantMessage = {
            id: Date.now() + 1,
            type: 'assistant',
            text: assistantResponse,
            timestamp: new Date().toLocaleTimeString()
        };

        setConversationHistory(prev => [...prev, assistantMessage]);
        setResponse(assistantResponse);

        speakText(assistantResponse);
        setIsProcessing(false);
    };

    const generateResponse = (command) => {
        // Tourism and travel related responses
        if (command.includes('petra') || command.includes('treasury')) {
            return "Petra is Jordan's most famous archaeological site! The Treasury is best viewed in the morning light around 9 AM. Would you like me to help you plan a visit or book a guided tour?";
        }

        if (command.includes('wadi rum') || command.includes('desert')) {
            return "Wadi Rum is perfect for desert adventures! I recommend a 2-day experience with overnight camping under the stars. The best time to visit is between March and May. Shall I check availability for desert tours?";
        }

        if (command.includes('dead sea')) {
            return "The Dead Sea offers unique floating experiences and therapeutic mud treatments. The water temperature is perfect year-round. I can help you find the best resorts or day passes. What's your budget range?";
        }

        if (command.includes('jerash')) {
            return "Jerash has the best-preserved Roman ruins outside Italy! The site is massive, so I'd recommend at least 3-4 hours. There's also a great festival in July if you're visiting in summer. Need directions or tickets?";
        }

        if (command.includes('aqaba') || command.includes('red sea')) {
            return "Aqaba is fantastic for snorkeling and diving! The coral reefs are spectacular. I can recommend dive centers and the best spots for beginners and experts. Are you interested in water sports?";
        }

        if (command.includes('weather')) {
            return "Jordan has great weather! Spring (March-May) and autumn (September-November) are ideal for sightseeing. Summer can be hot, perfect for the Dead Sea. Winter is mild with occasional rain. What time of year are you planning to visit?";
        }

        if (command.includes('book') || command.includes('reservation')) {
            return "I can help you book tours, hotels, and activities! I have access to real-time availability and can find the best deals. What would you like to book, and for which dates?";
        }

        if (command.includes('food') || command.includes('restaurant')) {
            return "Jordanian cuisine is amazing! Try mansaf (the national dish), falafel, hummus, and kunafa for dessert. I can recommend restaurants in any city or arrange cooking classes. What type of food experience interests you?";
        }

        if (command.includes('budget') || command.includes('cost')) {
            return "Jordan can fit various budgets! Budget travelers can expect $30-50/day, mid-range $60-120/day, and luxury $150+/day. This includes accommodation, food, and activities. I can help plan within your specific budget. What's your daily budget range?";
        }

        if (command.includes('itinerary') || command.includes('plan')) {
            return "I'd love to create a personalized itinerary for you! Popular options include 3-day highlights (Petra, Wadi Rum, Dead Sea), 7-day classic tour, or 10-day comprehensive exploration. How many days do you have, and what interests you most?";
        }

        if (command.includes('visa') || command.includes('entry')) {
            return "Most visitors get a visa on arrival at the airport for 40 JOD, or you can get the Jordan Pass online which includes the visa and major attractions. The Jordan Pass is usually the best value! Need help with visa requirements for your country?";
        }

        if (command.includes('transport') || command.includes('getting around')) {
            return "Getting around Jordan is easy! Rent a car for flexibility, use JETT buses for major routes, or book private transfers. From Amman to Petra is about 3 hours. I can help arrange transportation. What's your preferred way to travel?";
        }

        if (command.includes('hello') || command.includes('hi') || command.includes('hey')) {
            return "Hello! I'm your Jordan travel assistant. I can help you plan trips, book tours, find restaurants, check weather, and answer any questions about visiting Jordan. What would you like to know?";
        }

        if (command.includes('help') || command.includes('what can you do')) {
            return "I can help you with Jordan travel planning! I can suggest destinations, check weather, book tours, recommend restaurants, create itineraries, find accommodations, and answer cultural questions. Try saying things like 'Tell me about Petra' or 'Plan a 5-day trip'!";
        }

        if (command.includes('culture') || command.includes('customs')) {
            return "Jordanians are incredibly welcoming! Dress modestly, especially at religious sites. Arabic is the main language but English is widely spoken. Tipping 10-15% is appreciated. Friday is the holy day. Want to know about any specific cultural practices?";
        }

        // Default response for unrecognized commands
        return "I'm your Jordan travel assistant! I can help with destinations like Petra and Wadi Rum, booking tours, weather information, itinerary planning, and cultural tips. Could you please rephrase your question, or try asking about specific places or activities?";
    };

    // Text-to-speech function
    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = voiceSettings.language;
            utterance.rate = voiceSettings.speed;
            utterance.pitch = voiceSettings.pitch;

            // Try to set voice based on settings
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                const preferredVoice = voices.find(voice =>
                    voice.lang.startsWith(voiceSettings.language.split('-')[0]) &&
                    (voiceSettings.voice === 'female' ? voice.name.toLowerCase().includes('female') : true)
                ) || voices[0];

                utterance.voice = preferredVoice;
            }

            utterance.onend = () => {
                // Optionally restart listening after response
            };

            window.speechSynthesis.speak(utterance);
        }
    };

    // Clear conversation history
    const clearHistory = () => {
        setConversationHistory([]);
        setTranscript('');
        setResponse('');
    };

    // Handle text input (fallback for voice)
    const handleTextInput = (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            handleVoiceCommand(e.target.value.trim());
            e.target.value = '';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                🎤 Voice Assistant
                            </h1>
                            <p className="text-gray-600">
                                Your smart Jordan travel companion - just speak naturally!
                            </p>
                        </div>
                        <div className="text-6xl">🤖</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Voice Controls */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Voice Interface */}
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            {/* Microphone Permission Status */}
                            {micPermission === 'denied' && (
                                <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
                                    <p className="font-medium">Microphone access denied</p>
                                    <p className="text-sm">Please enable microphone permissions to use voice features.</p>
                                </div>
                            )}

                            {micPermission === 'not-supported' && (
                                <div className="bg-yellow-100 border border-yellow-300 text-yellow-700 px-4 py-3 rounded-lg mb-6">
                                    <p className="font-medium">Voice recognition not supported</p>
                                    <p className="text-sm">Your browser doesn't support speech recognition. Please use text input instead.</p>
                                </div>
                            )}

                            {/* Voice Visualizer */}
                            <div className="text-center mb-8">
                                <div className={`relative inline-block ${isListening ? 'animate-pulse' : ''}`}>
                                    <button
                                        onClick={toggleListening}
                                        disabled={micPermission === 'denied' || micPermission === 'not-supported'}
                                        className={`w-24 h-24 rounded-full text-4xl transition-all duration-300 ${isListening
                                            ? 'bg-red-500 text-white shadow-lg scale-110'
                                            : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
                                            } ${micPermission === 'denied' || micPermission === 'not-supported'
                                                ? 'opacity-50 cursor-not-allowed'
                                                : 'cursor-pointer'
                                            }`}
                                    >
                                        {isListening ? '🔴' : '🎤'}
                                    </button>

                                    {isListening && (
                                        <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping"></div>
                                    )}
                                </div>

                                <p className="mt-4 text-lg font-medium text-gray-800">
                                    {isListening ? 'Listening... Speak now!' : 'Tap to start speaking'}
                                </p>

                                {isProcessing && (
                                    <p className="text-blue-600 mt-2">Processing your request...</p>
                                )}
                            </div>

                            {/* Live Transcript */}
                            {transcript && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <h4 className="font-medium text-blue-800 mb-2">You said:</h4>
                                    <p className="text-blue-700">{transcript}</p>
                                </div>
                            )}

                            {/* Text Input Fallback */}
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Or type your question:
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ask about Jordan destinations, weather, bookings..."
                                    onKeyPress={handleTextInput}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">Press Enter to send</p>
                            </div>
                        </div>

                        {/* Conversation History */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">Conversation</h3>
                                <button
                                    onClick={clearHistory}
                                    className="text-gray-500 hover:text-gray-700 text-sm"
                                >
                                    Clear History
                                </button>
                            </div>

                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {conversationHistory.length === 0 ? (
                                    <div className="text-center text-gray-500 py-8">
                                        <p className="text-lg mb-2">👋</p>
                                        <p>Start a conversation by asking about Jordan!</p>
                                        <p className="text-sm mt-2">Try: "Tell me about Petra" or "What's the weather like?"</p>
                                    </div>
                                ) : (
                                    conversationHistory.map(message => (
                                        <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.type === 'user'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 text-gray-800'
                                                }`}>
                                                <p className="text-sm">{message.text}</p>
                                                <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-200' : 'text-gray-500'
                                                    }`}>
                                                    {message.timestamp}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Settings & Quick Actions */}
                    <div className="space-y-6">
                        {/* Voice Settings */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Voice Settings</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Language
                                    </label>
                                    <select
                                        value={voiceSettings.language}
                                        onChange={(e) => setVoiceSettings(prev => ({ ...prev, language: e.target.value }))}
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                    >
                                        <option value="en-US">English (US)</option>
                                        <option value="en-GB">English (UK)</option>
                                        <option value="ar-SA">Arabic</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Speech Speed
                                    </label>
                                    <input
                                        type="range"
                                        min="0.5"
                                        max="2"
                                        step="0.1"
                                        value={voiceSettings.speed}
                                        onChange={(e) => setVoiceSettings(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Slow</span>
                                        <span>Fast</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Commands */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Commands</h3>

                            <div className="space-y-2">
                                {[
                                    { command: "Tell me about Petra", icon: "🏛️" },
                                    { command: "What's the weather like?", icon: "🌤️" },
                                    { command: "Plan a 3-day trip", icon: "📅" },
                                    { command: "Find restaurants in Amman", icon: "🍽️" },
                                    { command: "Book a desert tour", icon: "🏜️" },
                                    { command: "Dead Sea information", icon: "🌊" }
                                ].map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleVoiceCommand(item.command)}
                                        className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="mr-3">{item.icon}</span>
                                        <span className="text-sm">{item.command}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">💡 Voice Tips</h3>
                            <ul className="text-sm space-y-2 text-gray-700">
                                <li>• Speak clearly and naturally</li>
                                <li>• Ask about specific destinations</li>
                                <li>• Request weather, bookings, or tips</li>
                                <li>• Use "book," "plan," or "find" commands</li>
                                <li>• Say "help" to learn more commands</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoiceAssistantPage;
