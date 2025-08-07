// Natural Language Processing utilities using compromise.js
import nlp from 'compromise';

// Extended compromise with custom plugins for travel domain
const travelNlp = nlp.extend((Doc, world) => {
    // Add travel-specific terms to the lexicon
    world.addWords({
        'petra': 'Place',
        'wadi rum': 'Place',
        'dead sea': 'Place',
        'amman': 'Place',
        'jerash': 'Place',
        'aqaba': 'Place',
        'jordan': 'Place',
        'book': 'Verb',
        'reserve': 'Verb',
        'plan': 'Verb',
        'visit': 'Verb',
        'explore': 'Verb',
        'tour': 'Noun',
        'trip': 'Noun',
        'vacation': 'Noun',
        'holiday': 'Noun',
        'journey': 'Noun'
    });
});

// Intent classification patterns
const intentPatterns = {
    booking: [
        /book.*trip/i,
        /book.*tour/i,
        /reserve.*tour/i,
        /make.*reservation/i,
        /i want to book/i,
        /book me/i,
        /schedule.*trip/i
    ],
    search: [
        /find.*destination/i,
        /search.*place/i,
        /looking for/i,
        /recommend.*place/i,
        /suggest.*destination/i,
        /where.*visit/i,
        /what.*see/i
    ],
    info: [
        /tell me about/i,
        /information about/i,
        /what is/i,
        /how much/i,
        /price.*for/i,
        /cost.*of/i,
        /when.*open/i,
        /opening hours/i
    ],
    planning: [
        /plan.*trip/i,
        /create.*itinerary/i,
        /help me plan/i,
        /organize.*vacation/i,
        /design.*tour/i
    ],
    greeting: [
        /hello/i,
        /hi/i,
        /hey/i,
        /good morning/i,
        /good afternoon/i,
        /good evening/i
    ],
    weather: [
        /weather/i,
        /temperature/i,
        /climate/i,
        /forecast/i,
        /rain/i,
        /sunny/i
    ]
};

// Entity extraction patterns
const entityPatterns = {
    duration: {
        pattern: /(\d+)\s*-?\s*(day|days|week|weeks|month|months)/i,
        extractor: (match) => {
            const number = parseInt(match[1]);
            const unit = match[2].toLowerCase();
            return {
                value: number,
                unit: unit.includes('week') ? 'weeks' :
                    unit.includes('month') ? 'months' : 'days'
            };
        }
    },

    groupSize: {
        pattern: /(\d+)\s*(person|people|guests?|travelers?|adults?)/i,
        extractor: (match) => parseInt(match[1])
    },

    budget: {
        pattern: /(\$?\d+)\s*(?:dollars?|usd|\$)/i,
        extractor: (match) => parseInt(match[1].replace('$', ''))
    },

    date: {
        pattern: /(next|this)\s+(week|weekend|month|year)|in\s+(\d+)\s+(days?|weeks?|months?)|(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/i,
        extractor: (match) => {
            if (match[1] && match[2]) {
                return `${match[1]} ${match[2]}`;
            } else if (match[3] && match[4]) {
                return `in ${match[3]} ${match[4]}`;
            } else if (match[5] && match[6] && match[7]) {
                return `${match[5]}/${match[6]}/${match[7]}`;
            }
            return null;
        }
    },

    destination: {
        pattern: /(petra|wadi rum|dead sea|amman|jerash|aqaba|jordan)/i,
        extractor: (match) => match[1].toLowerCase()
    }
};

// Main NLP processing function
export const processNaturalLanguage = (query) => {
    const doc = travelNlp(query);

    const result = {
        originalQuery: query,
        intent: null,
        entities: {},
        confidence: 0,
        processedText: doc.text(),
        tokens: doc.terms().out('array'),
        sentiment: null
    };

    // Intent classification
    result.intent = classifyIntent(query);

    // Entity extraction
    result.entities = extractEntities(query);

    // Sentiment analysis (basic)
    result.sentiment = analyzeSentiment(doc);

    // Calculate confidence based on matched patterns
    result.confidence = calculateConfidence(result);

    return result;
};

// Intent classification
const classifyIntent = (text) => {
    let bestMatch = null;
    let maxMatches = 0;

    for (const [intent, patterns] of Object.entries(intentPatterns)) {
        let matches = 0;
        for (const pattern of patterns) {
            if (pattern.test(text)) {
                matches++;
            }
        }
        if (matches > maxMatches) {
            maxMatches = matches;
            bestMatch = intent;
        }
    }

    return bestMatch || 'unknown';
};

// Entity extraction
const extractEntities = (text) => {
    const entities = {};

    for (const [entityType, config] of Object.entries(entityPatterns)) {
        const match = text.match(config.pattern);
        if (match) {
            entities[entityType] = config.extractor(match);
        }
    }

    return entities;
};

// Basic sentiment analysis
const analyzeSentiment = (doc) => {
    const positiveWords = doc.match('#Positive').length;
    const negativeWords = doc.match('#Negative').length;

    if (positiveWords > negativeWords) return 'positive';
    if (negativeWords > positiveWords) return 'negative';
    return 'neutral';
};

// Confidence calculation
const calculateConfidence = (result) => {
    let confidence = 0;

    // Base confidence from intent match
    if (result.intent !== 'unknown') confidence += 40;

    // Add confidence for each extracted entity
    const entityCount = Object.keys(result.entities).length;
    confidence += entityCount * 15;

    // Cap at 95% to account for uncertainty
    return Math.min(confidence, 95);
};

// Specific function for natural language booking
export const parseBookingRequest = (query) => {
    const result = processNaturalLanguage(query);

    // Enhanced parsing for booking-specific queries
    if (result.intent === 'booking') {
        const bookingDetails = {
            duration: result.entities.duration || null,
            groupSize: result.entities.groupSize || 1,
            budget: result.entities.budget || null,
            destination: result.entities.destination || null,
            preferredDate: result.entities.date || null,
            urgency: /urgent|asap|soon|immediately/i.test(query) ? 'high' : 'normal'
        };

        return {
            ...result,
            bookingDetails,
            isBookingRequest: true
        };
    }

    return {
        ...result,
        isBookingRequest: false
    };
};

// Generate response suggestions based on NLP analysis
export const generateResponseSuggestions = (nlpResult) => {
    const suggestions = [];

    switch (nlpResult.intent) {
        case 'booking':
            suggestions.push(
                "I'd be happy to help you book a tour! Let me find the perfect options for you.",
                "Great! I can assist with booking. What type of experience are you looking for?",
                "Let's get your trip booked! I'll need a few details to find the best tours for you."
            );
            break;

        case 'search':
            suggestions.push(
                "I can help you discover amazing destinations in Jordan. What interests you most?",
                "Let me suggest some incredible places to visit based on your preferences.",
                "Jordan has so many beautiful destinations! What type of experience are you seeking?"
            );
            break;

        case 'info':
            suggestions.push(
                "I'd be happy to provide information about that destination or tour.",
                "Let me get you the details you need about that location.",
                "I can share comprehensive information about that place or activity."
            );
            break;

        case 'planning':
            suggestions.push(
                "I love helping people plan amazing trips! Let's create something special for you.",
                "Perfect! I can help you plan an incredible Jordan itinerary.",
                "Let's design the perfect trip based on your interests and preferences."
            );
            break;

        case 'greeting':
            suggestions.push(
                "Hello! Welcome to SmartTour.Jo. How can I help you explore Jordan today?",
                "Hi there! I'm Jawad, your Jordan travel assistant. What can I help you with?",
                "Welcome! I'm here to help you discover the wonders of Jordan. What interests you?"
            );
            break;

        case 'weather':
            suggestions.push(
                "I can provide weather information for Jordan destinations. Which location are you interested in?",
                "Let me help you plan around the weather conditions for your trip.",
                "Weather planning is important! Which destination would you like weather info for?"
            );
            break;

        default:
            suggestions.push(
                "I'm here to help you with anything related to traveling in Jordan!",
                "How can I assist you with your Jordan travel plans today?",
                "I'd be happy to help! What would you like to know about Jordan?"
            );
    }

    return suggestions;
};

// Extract key phrases for better understanding
export const extractKeyPhrases = (text) => {
    const doc = travelNlp(text);

    const phrases = {
        nouns: doc.nouns().out('array'),
        verbs: doc.verbs().out('array'),
        places: doc.places().out('array'),
        dates: doc.dates().out('array'),
        money: doc.money().out('array'),
        numbers: doc.numbers().out('array')
    };

    return phrases;
};

// Enhanced query understanding for travel domain
export const enhancedTravelParsing = (query) => {
    const basicResult = processNaturalLanguage(query);
    const keyPhrases = extractKeyPhrases(query);

    // Additional travel-specific parsing
    const travelContext = {
        hasLocationMention: keyPhrases.places.length > 0,
        hasTimeMention: keyPhrases.dates.length > 0,
        hasBudgetMention: keyPhrases.money.length > 0,
        hasGroupMention: /family|couple|solo|group|friends/i.test(query),
        hasActivityMention: /adventure|culture|relax|food|history|nature/i.test(query),
        urgencyLevel: /urgent|soon|asap|immediately/i.test(query) ? 'high' :
            /later|sometime|maybe|considering/i.test(query) ? 'low' : 'medium'
    };

    return {
        ...basicResult,
        keyPhrases,
        travelContext,
        processingTimestamp: new Date().toISOString()
    };
};

export default {
    processNaturalLanguage,
    parseBookingRequest,
    generateResponseSuggestions,
    extractKeyPhrases,
    enhancedTravelParsing
};
