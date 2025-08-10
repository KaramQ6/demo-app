import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { supabase } from '../supabaseClient';
import AlternativeCrowdDataService from '../services/alternativeCrowdDataService';

export const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [globalError, setGlobalError] = useState(null);
    const { language, t } = useLanguage();
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [showChatbot, setShowChatbot] = useState(true);
    const [liveData, setLiveData] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [citiesData, setCitiesData] = useState([]);
    const [isCitiesLoading, setIsCitiesLoading] = useState(true);
    const [iotHubData, setIotHubData] = useState([]);
    const [isIotHubLoading, setIsIotHubLoading] = useState(true);
    const [userPreferences, setUserPreferences] = useState({
        interests: [],
        budget: '',
        travelsWith: 'Solo'
    });
    const [suggestedItinerary, setSuggestedItinerary] = useState(null);
    const [isSuggestingItinerary, setIsSuggestingItinerary] = useState(true);
    const [iotData, setIotData] = useState({});
    const [sidebarPinned, setSidebarPinned] = useState(() => {
        const saved = localStorage.getItem('sidebarPinned');
        return saved ? JSON.parse(saved) : false;
    });
    const [navigationHistory, setNavigationHistory] = useState(() => {
        const saved = localStorage.getItem('navigationHistory');
        return saved ? JSON.parse(saved) : [];
    });
    const [quickSearchOpen, setQuickSearchOpen] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('online');
    const [notificationCount, setNotificationCount] = useState(0);
    const [crowdDataService] = useState(() => new AlternativeCrowdDataService());
    const [realCrowdData, setRealCrowdData] = useState({});
    const [crowdUpdateInterval, setCrowdUpdateInterval] = useState(null);

    const clearGlobalError = () => setGlobalError(null);

    const updateIotData = (destinationId, newData) => {
        setIotData(prev => ({
            ...prev,
            [destinationId]: newData
        }));
    };

    const toggleSidebarPin = () => {
        const newPinState = !sidebarPinned;
        setSidebarPinned(newPinState);
        localStorage.setItem('sidebarPinned', JSON.stringify(newPinState));
    };

    const addToNavigationHistory = (path, title) => {
        const newEntry = { path, title, timestamp: Date.now() };
        setNavigationHistory(prev => {
            const filtered = prev.filter(item => item.path !== path);
            const updated = [newEntry, ...filtered].slice(0, 5);
            localStorage.setItem('navigationHistory', JSON.stringify(updated));
            return updated;
        });
    };

    const toggleQuickSearch = () => setQuickSearchOpen(!quickSearchOpen);
    const updateNotificationCount = (count) => setNotificationCount(count);

    const initializeRealCrowdData = async () => {
        try {
            const destinationIds = [
                'petra', 'jerash', 'wadi-rum', 'dead-sea', 'amman-citadel',
                'ajloun-castle', 'dana-reserve', 'karak-castle', 'aqaba', 'rainbow-street'
            ];

            const initialData = await crowdDataService.getMultipleCrowdData(destinationIds);
            setRealCrowdData(initialData);

            if (crowdUpdateInterval) {
                clearInterval(crowdUpdateInterval);
            }

            const intervalId = crowdDataService.startPeriodicUpdates(
                destinationIds,
                (updatedData) => {
                    setRealCrowdData(updatedData);
                },
                10
            );

            setCrowdUpdateInterval(intervalId);

        } catch (error) {
            console.error('Failed to initialize real crowd data:', error);
        }
    };

    const getRealCrowdData = async (destinationId) => {
        try {
            const data = await crowdDataService.getRealCrowdData(destinationId);
            setRealCrowdData(prev => ({
                ...prev,
                [destinationId]: data
            }));
            return data;
        } catch (error) {
            console.error(`Failed to get crowd data for ${destinationId}:`, error);
            return null;
        }
    };

    useEffect(() => {
        const updateOnlineStatus = () => {
            setConnectionStatus(navigator.onLine ? 'online' : 'offline');
        };

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
        };
    }, []);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                toggleQuickSearch();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    useEffect(() => {
        initializeRealCrowdData();

        return () => {
            if (crowdUpdateInterval) {
                clearInterval(crowdUpdateInterval);
            }
        };
    }, []);

    const saveUserPreferences = async (preferences) => {
        setUserPreferences(preferences);
        localStorage.setItem('userPreferences', JSON.stringify(preferences));

        if (user) {
            try {
                const { error } = await supabase
                    .from('profiles')
                    .upsert({
                        id: user.id,
                        preferences: preferences
                    });

                if (error) {
                    console.warn('Unable to save preferences to database');
                }
            } catch (error) {
                console.warn('Unable to save preferences to Supabase');
            }
        }
    };

    useEffect(() => {
        setLoading(true);

        const checkUserAndLoadProfile = async (currentUser) => {
            if (!currentUser) {
                const savedPrefs = localStorage.getItem('userPreferences');
                if (savedPrefs) {
                    setUserPreferences(JSON.parse(savedPrefs));
                } else {
                    setUserPreferences({ interests: [], budget: '', travelsWith: 'Solo' });
                }
                setLoading(false);
                return;
            }

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('preferences')
                .eq('id', currentUser.id)
                .single();

            if (profile && profile.preferences && Object.keys(profile.preferences).length > 0) {
                setUserPreferences(profile.preferences);
                localStorage.setItem('userPreferences', JSON.stringify(profile.preferences));
            } else if (error && error.code !== 'PGRST116') {
                console.warn("Unable to fetch profile data");
            }

            setLoading(false);
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = session?.user;
            setUser(currentUser);
            checkUserAndLoadProfile(currentUser);
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
                setLocationError(null);
            },
            (error) => {
                console.warn("Location access denied, using default Amman location");
                setLocationError("Location access denied");
                setUserLocation({ lat: 31.9539, lon: 35.9106 });
            }
        );
    }, []);

    useEffect(() => {
        if (!userLocation) return;
        const fetchUserLiveData = async () => {
            setIsLoadingData(true);

            const weatherApiUrl = "https://n8n.smart-tour.app/webhook/Simple-Weather-API-Live-Data";

            const generateRealisticWeatherData = () => {
                const currentHour = new Date().getHours();
                const isNight = currentHour < 6 || currentHour > 18;

                const getCityFromCoordinates = (lat, lon) => {
                    const jordanCities = [
                        { name: 'Amman', nameAr: 'عمان', lat: 31.9539, lon: 35.9106 },
                        { name: 'Irbid', nameAr: 'إربد', lat: 32.5556, lon: 35.85 },
                        { name: 'Zarqa', nameAr: 'الزرقاء', lat: 32.0728, lon: 36.0877 },
                        { name: 'Aqaba', nameAr: 'العقبة', lat: 29.5267, lon: 35.0067 },
                        { name: 'Karak', nameAr: 'الكرك', lat: 31.1848, lon: 35.7047 },
                        { name: 'Madaba', nameAr: 'مأدبا', lat: 31.7194, lon: 35.7956 },
                        { name: 'Jerash', nameAr: 'جرش', lat: 32.2744, lon: 35.8906 },
                        { name: 'Ajloun', nameAr: 'عجلون', lat: 32.3328, lon: 35.7517 },
                        { name: 'Tafilah', nameAr: 'الطفيلة', lat: 30.8372, lon: 35.6042 },
                        { name: 'Mafraq', nameAr: 'المفرق', lat: 32.3426, lon: 36.2082 }
                    ];

                    let closestCity = jordanCities[0];
                    let minDistance = Infinity;

                    jordanCities.forEach(city => {
                        const distance = Math.sqrt(
                            Math.pow(lat - city.lat, 2) + Math.pow(lon - city.lon, 2)
                        );
                        if (distance < minDistance) {
                            minDistance = distance;
                            closestCity = city;
                        }
                    });

                    return closestCity;
                };

                const currentCity = getCityFromCoordinates(userLocation.lat, userLocation.lon);

                let baseTemp;
                if (currentCity.name === 'Aqaba') {
                    baseTemp = isNight ?
                        Math.floor(Math.random() * 8) + 20 :
                        Math.floor(Math.random() * 12) + 30;
                } else if (currentCity.name === 'Ajloun' || currentCity.name === 'Jerash') {
                    baseTemp = isNight ?
                        Math.floor(Math.random() * 8) + 12 :
                        Math.floor(Math.random() * 12) + 22;
                } else {
                    baseTemp = isNight ?
                        Math.floor(Math.random() * 10) + 15 :
                        Math.floor(Math.random() * 15) + 25;
                }

                return {
                    name: language === 'ar' ? currentCity.nameAr : currentCity.name,
                    cityName: language === 'ar' ? currentCity.nameAr : currentCity.name,
                    main: {
                        temp: baseTemp,
                        humidity: Math.floor(Math.random() * 30) + 40,
                        pressure: Math.floor(Math.random() * 30) + 1010,
                    },
                    temperature: baseTemp,
                    weather: [{
                        main: isNight ? "Clear" : ["Clear", "Clouds", "Sunny"][Math.floor(Math.random() * 3)],
                        description: language === 'ar' ?
                            (isNight ? "سماء صافية" : "أجواء مشمسة") :
                            (isNight ? "clear sky" : "sunny weather")
                    }],
                    wind: {
                        speed: Math.floor(Math.random() * 8) + 3
                    },
                    dt: Math.floor(Date.now() / 1000),
                    timezone: 10800,
                    locationSource: locationError ? "default" : "gps",
                    coordinates: { lat: userLocation.lat, lon: userLocation.lon }
                };
            };

            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                const requestBody = {
                    lat: userLocation.lat,
                    lon: userLocation.lon,
                    cityName: 'User Location',
                    lang: language === 'ar' ? 'ar' : 'en'
                };

                const response = await fetch(weatherApiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(requestBody),
                    signal: controller.signal,
                    mode: 'cors'
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }

                const text = await response.text();

                if (!text || text.trim() === '') {
                    setLiveData(generateRealisticWeatherData());
                    setIsLoadingData(false);
                    return;
                }

                const data = JSON.parse(text);

                if (data && (data.temperature || data.temp || data.main)) {
                    const enhancedData = {
                        name: data.cityName || 'Amman',
                        cityName: data.cityName || 'Amman',
                        main: {
                            temp: parseFloat(data.temperature || data.temp || data.main?.temp) || 25,
                            humidity: parseFloat(data.humidity || data.main?.humidity) || 50,
                            pressure: parseFloat(data.pressure || data.main?.pressure) || 1013,
                            feels_like: parseFloat(data.feels_like || data.main?.feels_like) || 25
                        },
                        temperature: parseFloat(data.temperature || data.temp || data.main?.temp) || 25,
                        weather: [{
                            main: data.weather?.[0]?.main || "Clear",
                            description: data.description || data.weather?.[0]?.description ||
                                (language === 'ar' ? "أجواء صافية" : "clear sky")
                        }],
                        wind: {
                            speed: parseFloat(data.wind_speed || data.wind?.speed) || 5
                        },
                        locationSource: locationError ? "default" : "gps",
                        coordinates: { lat: userLocation.lat, lon: userLocation.lon },
                        source: 'api'
                    };
                    setLiveData(enhancedData);
                } else {
                    setLiveData(generateRealisticWeatherData());
                }

            } catch (error) {
                setLiveData(generateRealisticWeatherData());
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchUserLiveData();
    }, [userLocation, language]);

    useEffect(() => {
        const fetchCitiesData = async () => {
            const allGovernoratesOfJordan = [
                { name: 'Amman', nameAr: 'عمان', lat: 31.9539, lon: 35.9106, type: 'governorate' },
                { name: 'Irbid', nameAr: 'إربد', lat: 32.5556, lon: 35.85, type: 'governorate' },
                { name: 'Zarqa', nameAr: 'الزرقاء', lat: 32.0728, lon: 36.0877, type: 'governorate' },
                { name: 'Balqa', nameAr: 'البلقاء', lat: 32.0347, lon: 35.7439, type: 'governorate' },
                { name: 'Mafraq', nameAr: 'المفرق', lat: 32.3426, lon: 36.2082, type: 'governorate' },
                { name: 'Jerash', nameAr: 'جرش', lat: 32.2744, lon: 35.8906, type: 'governorate' },
                { name: 'Ajloun', nameAr: 'عجلون', lat: 32.3328, lon: 35.7517, type: 'governorate' },
                { name: 'Madaba', nameAr: 'مأدبا', lat: 31.7194, lon: 35.7956, type: 'governorate' },
                { name: 'Karak', nameAr: 'الكرك', lat: 31.1848, lon: 35.7047, type: 'governorate' },
                { name: 'Tafilah', nameAr: 'الطفيلة', lat: 30.8372, lon: 35.6042, type: 'governorate' },
                { name: 'Ma\'an', nameAr: 'معان', lat: 30.1962, lon: 35.7340, type: 'governorate' },
                { name: 'Aqaba', nameAr: 'العقبة', lat: 29.5267, lon: 35.0067, type: 'governorate' }
            ];

            const touristMainAreas = [
                { name: 'Amman', nameAr: 'عمان', lat: 31.9539, lon: 35.9106, type: 'tourist' },
                { name: 'Petra', nameAr: 'البتراء', lat: 30.3285, lon: 35.4444, type: 'tourist' },
                { name: 'Aqaba', nameAr: 'العقبة', lat: 29.5267, lon: 35.0067, type: 'tourist' },
                { name: 'Jerash', nameAr: 'جرش', lat: 32.2744, lon: 35.8906, type: 'tourist' },
                { name: 'Dead Sea', nameAr: 'البحر الميت', lat: 31.5590, lon: 35.4732, type: 'tourist' },
                { name: 'Wadi Rum', nameAr: 'وادي رم', lat: 29.5324, lon: 35.4206, type: 'tourist' }
            ];

            setIsCitiesLoading(true);

            const weatherApiUrl = "https://n8n.smart-tour.app/webhook/Simple-Weather-API-Live-Data";

            const fetchCityWeather = async (city) => {
                const cityName = typeof city === 'string' ? city : city.name || city.cityName || 'Unknown';
                const cityLat = city.lat || 31.9539;
                const cityLon = city.lon || 35.9106;

                try {
                    const response = await fetch(weatherApiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            lat: cityLat,
                            lon: cityLon,
                            cityName: cityName,
                            lang: language === 'ar' ? 'ar' : 'en'
                        }),
                        mode: 'cors'
                    });

                    if (response.ok) {
                        const text = await response.text();

                        if (text && text.trim()) {
                            const data = JSON.parse(text);

                            return {
                                name: cityName,
                                cityName: cityName,
                                main: {
                                    temp: parseFloat(data.temperature || data.temp || data.main?.temp) || 25,
                                    humidity: parseFloat(data.humidity || data.main?.humidity) || 50,
                                },
                                temperature: parseFloat(data.temperature || data.temp || data.main?.temp) || 25,
                                weather: [{
                                    main: data.weather?.[0]?.main || "Clear",
                                    description: data.description || (language === 'ar' ? "أجواء صافية" : "clear sky")
                                }],
                                coordinates: { lat: cityLat, lon: cityLon },
                                source: 'api'
                            };
                        }
                    }
                } catch (error) {
                    console.warn(`API failed for ${cityName}:`, error.message);
                }

                return generateRealisticWeatherData(cityName);
            };

            const generateRealisticWeatherData = (city) => {
                const currentHour = new Date().getHours();
                const isNight = currentHour < 6 || currentHour > 18;

                const cityName = typeof city === 'string' ? city : city.name || city.cityName || 'Unknown';

                let baseTemp;
                if (cityName === 'Aqaba') {
                    baseTemp = isNight ?
                        Math.floor(Math.random() * 8) + 22 :
                        Math.floor(Math.random() * 12) + 32;
                } else if (cityName === 'Ajloun' || cityName === 'Jerash') {
                    baseTemp = isNight ?
                        Math.floor(Math.random() * 8) + 14 :
                        Math.floor(Math.random() * 12) + 24;
                } else if (cityName === 'Dead Sea') {
                    baseTemp = isNight ?
                        Math.floor(Math.random() * 8) + 20 :
                        Math.floor(Math.random() * 12) + 30;
                } else {
                    baseTemp = isNight ?
                        Math.floor(Math.random() * 8) + 16 :
                        Math.floor(Math.random() * 12) + 26;
                }

                const weatherConditions = [
                    { main: "Clear", descAr: "سماء صافية", descEn: "clear sky" },
                    { main: "Clouds", descAr: "غائم جزئياً", descEn: "partly cloudy" },
                    { main: "Sunny", descAr: "مشمس", descEn: "sunny" }
                ];

                const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];

                return {
                    name: cityName,
                    cityName: cityName,
                    main: {
                        temp: baseTemp,
                        humidity: Math.floor(Math.random() * 30) + 40,
                        feels_like: baseTemp + Math.floor(Math.random() * 4) - 2,
                        pressure: Math.floor(Math.random() * 30) + 1010
                    },
                    temperature: baseTemp,
                    weather: [{
                        main: condition.main,
                        description: language === 'ar' ? condition.descAr : condition.descEn
                    }],
                    wind: {
                        speed: Math.floor(Math.random() * 8) + 3
                    },
                    source: 'fallback'
                };
            };

            try {
                const governoratesPromises = allGovernoratesOfJordan.map(city => fetchCityWeather(city));
                const governoratesData = await Promise.all(governoratesPromises);

                setCitiesData(governoratesData);

            } catch (error) {
                const fallbackGovernoratesData = allGovernoratesOfJordan.map(generateRealisticWeatherData);
                setCitiesData(fallbackGovernoratesData);
            } finally {
                setIsCitiesLoading(false);
            }

            setIsIotHubLoading(true);

            try {
                const touristPromises = touristMainAreas.map(city => fetchCityWeather(city));
                const touristData = await Promise.all(touristPromises);

                setIotHubData(touristData);

            } catch (error) {
                const fallbackTouristData = touristMainAreas.map(generateRealisticWeatherData);
                setIotHubData(fallbackTouristData);
            } finally {
                setIsIotHubLoading(false);
            }
        };

        fetchCitiesData();
    }, [language]);

    const login = (email, password) => supabase.auth.signInWithPassword({ email, password });
    const register = (email, password) => supabase.auth.signUp({ email, password });
    const logout = () => supabase.auth.signOut();

    const sendMessage = async (userInput) => {
        const userMessage = { id: Date.now(), text: userInput, type: 'user', timestamp: new Date() };
        setChatMessages(prev => [...prev, userMessage]);

        let sessionId = localStorage.getItem('chatSessionId') || `session_${Date.now()}`;
        localStorage.setItem('chatSessionId', sessionId);

        const chatUrl = "https://n8n.smart-tour.app/webhook/gemini-tour-chat";

        try {
            const response = await fetch(chatUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Origin': window.location.origin
                },
                body: JSON.stringify({
                    message: userInput,
                    sessionId: sessionId,
                    preferences: userPreferences || {},
                    language: language || 'en',
                    location: userLocation || null,
                    liveData: liveData || null
                }),
                mode: 'cors'
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const text = await response.text();
            if (!text || text.trim() === '') {
                throw new Error('Empty response from server');
            }

            let data;
            try {
                data = JSON.parse(text);
            } catch (jsonError) {
                data = { reply: text };
            }

            const botMessage = {
                id: Date.now() + 1,
                text: data.reply || data.response || data.answer || text || t({
                    ar: "عذراً، لم أتمكن من الحصول على رد صحيح",
                    en: "Sorry, I couldn't get a proper response"
                }),
                type: 'bot',
                timestamp: new Date()
            };
            setChatMessages(prev => [...prev, botMessage]);
        } catch (error) {
            let errorMessage = t({
                ar: "❌ عذراً، حدث خطأ في الاتصال.",
                en: "❌ Sorry, there was a connection error."
            });

            if (error.message && (
                error.message.includes('CORS') ||
                error.message.includes('Access-Control-Allow-Origin') ||
                error.message.includes('blocked by CORS policy')
            )) {
                errorMessage = t({
                    ar: "❌ مشكلة في الاتصال بالخادم. يرجى المحاولة لاحقاً.",
                    en: "❌ Server connection issue. Please try again later."
                });
            } else if (error.message && error.message.includes('Failed to fetch')) {
                errorMessage = t({
                    ar: "❌ لا يمكن الوصول للخادم. تحقق من الاتصال بالإنترنت.",
                    en: "❌ Cannot reach server. Check your internet connection."
                });
            }

            const errorMsg = {
                id: Date.now() + 1,
                text: errorMessage,
                type: 'bot',
                timestamp: new Date()
            };
            setChatMessages(prev => [...prev, errorMsg]);
        }
    };

    const openChatbot = () => setIsChatbotOpen(true);
    const closeChatbot = () => setIsChatbotOpen(false);
    const toggleChatbotVisibility = () => setShowChatbot(prev => !prev);

    const fetchSuggestedItinerary = async () => {
        if (isSuggestingItinerary) {
            return;
        }

        setIsSuggestingItinerary(true);

        const itineraryApiUrl = 'https://n8n.smart-tour.app/webhook/Smart-Itinerary-Planner';

        try {
            const requestBody = {
                preferences: userPreferences || { interests: [], budget: 'medium', travelsWith: 'Solo' },
                user: user ? { email: user.email } : null,
                language: language || 'en',
                location: userLocation || { lat: 31.9539, lon: 35.9106 },
                liveData: liveData || null
            };

            const response = await fetch(itineraryApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const text = await response.text();
            if (!text || text.trim() === '') {
                throw new Error('Empty response from itinerary API');
            }

            let data;
            try {
                data = JSON.parse(text);
            } catch (jsonError) {
                data = {
                    tripPlan: {
                        details: text
                    },
                    suggestedAlternative: null,
                    planModified: "false",
                    crowdLevel: Math.floor(Math.random() * 100)
                };
            }

            if (!data.tripPlan) {
                data.tripPlan = {
                    details: data.reply || data.response || text || t({
                        ar: "تم إنشاء خطة سفر مخصصة لك بناءً على تفضيلاتك والطقس الحالي.",
                        en: "A personalized travel plan has been created for you based on your preferences and current weather."
                    })
                };
            }

            setSuggestedItinerary(data);

        } catch (error) {
            const mockItinerary = {
                tripPlan: {
                    details: t({
                        ar: `خطة سفر مقترحة في الأردن:

🌅 اليوم الأول:
- زيارة وسط البلد عمان
- التجول في جبل القلعة  
- تناول العشاء في رينبو ستريت

🏛️ اليوم الثاني:
- رحلة إلى جرش لاستكشاف الآثار الرومانية
- زيارة قلعة عجلون
- العودة إلى عمان مساءً

🏖️ اليوم الثالث:
- رحلة إلى البحر الميت
- الاستمتاع بالطين الطبيعي والعوم
- المبيت في منتجع البحر الميت

💎 اليوم الرابع:
- السفر إلى البتراء
- استكشاف المدينة الوردية
- مشاهدة الخزنة والدير

🌵 اليوم الخامس:
- رحلة إلى وادي رم
- جولة صحراوية بالسيارة الرباعية
- قضاء ليلة تحت النجوم`,
                        en: `Suggested Jordan Travel Plan:

🌅 Day 1:
- Visit Downtown Amman
- Explore Amman Citadel
- Dinner at Rainbow Street

🏛️ Day 2:
- Trip to Jerash Roman ruins
- Visit Ajloun Castle
- Return to Amman evening

🏖️ Day 3:
- Dead Sea excursion
- Natural mud therapy and floating
- Overnight at Dead Sea resort

💎 Day 4:
- Travel to Petra
- Explore the Rose City
- See the Treasury and Monastery

🌵 Day 5:
- Wadi Rum desert adventure
- 4WD desert tour
- Overnight under the stars`
                    })
                },
                suggestedAlternative: null,
                planModified: "false",
                crowdLevel: Math.floor(Math.random() * 60) + 20
            };

            setSuggestedItinerary(mockItinerary);
        } finally {
            setIsSuggestingItinerary(false);
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isChatbotOpen,
        openChatbot,
        closeChatbot,
        chatMessages,
        sendMessage,
        showChatbot,
        toggleChatbotVisibility,
        liveData,
        isLoadingData,
        locationError,
        citiesData,
        isCitiesLoading,
        iotHubData,
        isIotHubLoading,
        userPreferences,
        saveUserPreferences,
        suggestedItinerary,
        isSuggestingItinerary,
        fetchSuggestedItinerary,
        globalError,
        clearGlobalError,
        iotData,
        updateIotData,
        sidebarPinned,
        toggleSidebarPin,
        navigationHistory,
        addToNavigationHistory,
        quickSearchOpen,
        toggleQuickSearch,
        connectionStatus,
        notificationCount,
        updateNotificationCount,
        realCrowdData,
        getRealCrowdData,
        initializeRealCrowdData,
        crowdDataService
    };

    return (
        <AppContext.Provider value={value}>
            {loading ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
                        <p className="text-lg text-gray-400">Loading...</p>
                    </div>
                </div>
            ) : (
                children
            )}
        </AppContext.Provider>
    );
};
