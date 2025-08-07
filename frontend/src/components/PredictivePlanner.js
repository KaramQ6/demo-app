import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Checkbox } from '../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import {
    Brain,
    MapPin,
    Calendar,
    DollarSign,
    Users,
    Star,
    Clock,
    Compass,
    TrendingUp,
    Zap,
    Target,
    Lightbulb
} from 'lucide-react';
import { aiAPI } from '../api';

const PredictivePlanner = () => {
    const [preferences, setPreferences] = useState({
        budget: [500],
        duration: [3],
        groupSize: [2],
        interests: [],
        travelStyle: '',
        season: '',
        accommodation: '',
        activityLevel: [3]
    });

    const [predictedTrip, setPredictedTrip] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [confidence, setConfidence] = useState(85);

    const interests = [
        { id: 'history', label: 'Historical Sites', icon: '🏛️' },
        { id: 'nature', label: 'Nature & Wildlife', icon: '🌿' },
        { id: 'adventure', label: 'Adventure Sports', icon: '⛰️' },
        { id: 'culture', label: 'Culture & Arts', icon: '🎨' },
        { id: 'food', label: 'Culinary Experiences', icon: '🍜' },
        { id: 'relaxation', label: 'Wellness & Spa', icon: '🧘' },
        { id: 'photography', label: 'Photography', icon: '📸' },
        { id: 'nightlife', label: 'Nightlife', icon: '🌃' }
    ];

    const travelStyles = [
        { value: 'luxury', label: 'Luxury' },
        { value: 'budget', label: 'Budget-Friendly' },
        { value: 'mid-range', label: 'Mid-Range' },
        { value: 'adventure', label: 'Adventure' },
        { value: 'cultural', label: 'Cultural Immersion' },
        { value: 'family', label: 'Family-Friendly' }
    ];

    const seasons = [
        { value: 'spring', label: 'Spring (Mar-May)' },
        { value: 'summer', label: 'Summer (Jun-Aug)' },
        { value: 'autumn', label: 'Autumn (Sep-Nov)' },
        { value: 'winter', label: 'Winter (Dec-Feb)' }
    ];

    const accommodations = [
        { value: 'hotel', label: 'Hotels' },
        { value: 'resort', label: 'Resorts' },
        { value: 'boutique', label: 'Boutique Hotels' },
        { value: 'camp', label: 'Desert Camps' },
        { value: 'hostel', label: 'Hostels' },
        { value: 'apartment', label: 'Apartments' }
    ];

    // Hardcoded predicted trip result for demo
    const mockPredictedTrip = {
        title: "Jordan Heritage & Adventure Explorer",
        duration: preferences.duration[0],
        totalBudget: preferences.budget[0],
        confidence: 92,
        matchScore: 'Excellent Match',
        highlights: [
            "Petra by Night Experience",
            "Wadi Rum Desert Safari",
            "Dead Sea Floating",
            "Jerash Roman Ruins",
            "Amman Cultural Walk"
        ],
        itinerary: [
            {
                day: 1,
                location: "Amman",
                activities: ["Airport pickup", "Amman Citadel", "Roman Theater", "Rainbow Street dinner"],
                accommodation: "Boutique hotel in Amman",
                meals: ["Dinner"]
            },
            {
                day: 2,
                location: "Petra",
                activities: ["Travel to Petra", "Petra site exploration", "Treasury visit", "Monastery hike"],
                accommodation: "Hotel near Petra",
                meals: ["Breakfast", "Lunch", "Dinner"]
            },
            {
                day: 3,
                location: "Wadi Rum",
                activities: ["Wadi Rum jeep safari", "Camel riding", "Sunset at natural arch", "Desert camp"],
                accommodation: "Desert camp under stars",
                meals: ["Breakfast", "Lunch", "Dinner"]
            }
        ],
        budgetBreakdown: {
            accommodation: 180,
            transportation: 120,
            activities: 150,
            meals: 80,
            guide: 60,
            miscellaneous: 40
        },
        weatherForecast: {
            temperature: "22-28°C",
            conditions: "Sunny with clear skies",
            rainfall: "Minimal"
        },
        crowdLevel: "Moderate",
        bestTime: "Perfect timing for your preferences",
        alternatives: [
            {
                title: "Jordan Classic in 4 Days",
                price: 650,
                highlights: ["Extended Petra time", "Jerash addition", "Dead Sea resort"]
            },
            {
                title: "Adventure Jordan Express",
                price: 420,
                highlights: ["Action-packed itinerary", "Budget accommodations", "Group tours"]
            }
        ]
    };

    const handleInterestChange = (interestId, checked) => {
        setPreferences(prev => ({
            ...prev,
            interests: checked
                ? [...prev.interests, interestId]
                : prev.interests.filter(id => id !== interestId)
        }));
    };

    const handleGenerateTrip = async () => {
        setIsGenerating(true);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            // In a real implementation, this would call aiAPI.getPredictedTrip(preferences)
            setPredictedTrip(mockPredictedTrip);
            setConfidence(mockPredictedTrip.confidence);
        } catch (error) {
            console.error('Error generating trip:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const ConfidenceIndicator = ({ score }) => (
        <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all duration-500 ${score >= 90 ? 'bg-green-500' :
                            score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                    style={{ width: `${score}%` }}
                />
            </div>
            <span className="text-sm font-medium">{score}%</span>
        </div>
    );

    const PredictedTripCard = ({ trip }) => (
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl text-blue-800">{trip.title}</CardTitle>
                        <CardDescription>AI-Generated Perfect Trip for You</CardDescription>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">${trip.totalBudget}</div>
                        <div className="text-sm text-gray-600">{trip.duration} days</div>
                    </div>
                </div>
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Confidence Score</span>
                        <Badge variant={trip.confidence >= 90 ? "default" : trip.confidence >= 70 ? "secondary" : "destructive"}>
                            {trip.matchScore}
                        </Badge>
                    </div>
                    <ConfidenceIndicator score={trip.confidence} />
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                        <TabsTrigger value="budget">Budget</TabsTrigger>
                        <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4 mt-4">
                        <div>
                            <h4 className="font-semibold mb-2 flex items-center">
                                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                                Trip Highlights
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {trip.highlights.map((highlight, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                        <span className="text-sm">{highlight}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-white rounded-lg">
                                <div className="text-lg font-bold text-blue-600">{trip.weatherForecast.temperature}</div>
                                <div className="text-xs text-gray-600">Temperature</div>
                                <div className="text-xs">{trip.weatherForecast.conditions}</div>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg">
                                <div className="text-lg font-bold text-green-600">{trip.crowdLevel}</div>
                                <div className="text-xs text-gray-600">Crowd Level</div>
                                <div className="text-xs">{trip.bestTime}</div>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg">
                                <div className="text-lg font-bold text-purple-600">{trip.duration}</div>
                                <div className="text-xs text-gray-600">Days</div>
                                <div className="text-xs">Perfect duration</div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="itinerary" className="space-y-4 mt-4">
                        {trip.itinerary.map((day) => (
                            <Card key={day.day} className="p-4">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                        {day.day}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-lg mb-1">{day.location}</h4>
                                        <div className="space-y-2">
                                            <div>
                                                <span className="text-sm font-medium text-gray-600">Activities:</span>
                                                <ul className="text-sm mt-1">
                                                    {day.activities.map((activity, index) => (
                                                        <li key={index} className="flex items-center space-x-2">
                                                            <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                                                            <span>{activity}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-medium text-gray-600">Accommodation:</span> {day.accommodation}
                                            </div>
                                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                <span>Meals: {day.meals.join(', ')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </TabsContent>

                    <TabsContent value="budget" className="space-y-4 mt-4">
                        <div className="space-y-3">
                            {Object.entries(trip.budgetBreakdown).map(([category, amount]) => (
                                <div key={category} className="flex items-center justify-between">
                                    <span className="capitalize font-medium">{category}</span>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: `${(amount / trip.totalBudget) * 100}%` }}
                                            />
                                        </div>
                                        <span className="font-bold">${amount}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t pt-3 flex justify-between items-center font-bold text-lg">
                            <span>Total Budget</span>
                            <span className="text-green-600">${trip.totalBudget}</span>
                        </div>
                    </TabsContent>

                    <TabsContent value="alternatives" className="space-y-4 mt-4">
                        {trip.alternatives.map((alt, index) => (
                            <Card key={index} className="p-4 border-gray-200">
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-semibold">{alt.title}</h4>
                                    <div className="text-right">
                                        <div className="font-bold text-green-600">${alt.price}</div>
                                        <Badge variant="outline" className="text-xs">Alternative</Badge>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    {alt.highlights.map((highlight, idx) => (
                                        <div key={idx} className="flex items-center space-x-2 text-sm">
                                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                            <span>{highlight}</span>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="outline" size="sm" className="mt-3">
                                    View Details
                                </Button>
                            </Card>
                        ))}
                    </TabsContent>
                </Tabs>

                <div className="mt-6 flex space-x-3">
                    <Button className="flex-1">
                        Book This Trip
                    </Button>
                    <Button variant="outline">
                        Customize
                    </Button>
                    <Button variant="outline">
                        Save to Wishlist
                    </Button>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                        <Brain className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">AI Predictive Planner</h1>
                        <p className="text-gray-600">Let our AI create the perfect Jordan itinerary for you</p>
                    </div>
                </div>

                <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span>Powered by advanced AI</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Target className="w-4 h-4 text-green-500" />
                        <span>Personalized recommendations</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        <span>Real-time data analysis</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Preferences Form */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Preferences</CardTitle>
                            <CardDescription>
                                Tell us about your ideal trip and we'll predict the perfect itinerary
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Budget */}
                            <div>
                                <Label className="text-sm font-medium mb-2 block">
                                    <DollarSign className="w-4 h-4 inline mr-1" />
                                    Budget per person: ${preferences.budget[0]}
                                </Label>
                                <Slider
                                    value={preferences.budget}
                                    onValueChange={(value) => setPreferences(prev => ({ ...prev, budget: value }))}
                                    max={2000}
                                    min={100}
                                    step={50}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>$100</span>
                                    <span>$2000</span>
                                </div>
                            </div>

                            {/* Duration */}
                            <div>
                                <Label className="text-sm font-medium mb-2 block">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    Trip Duration: {preferences.duration[0]} days
                                </Label>
                                <Slider
                                    value={preferences.duration}
                                    onValueChange={(value) => setPreferences(prev => ({ ...prev, duration: value }))}
                                    max={14}
                                    min={1}
                                    step={1}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>1 day</span>
                                    <span>14 days</span>
                                </div>
                            </div>

                            {/* Group Size */}
                            <div>
                                <Label className="text-sm font-medium mb-2 block">
                                    <Users className="w-4 h-4 inline mr-1" />
                                    Group Size: {preferences.groupSize[0]} people
                                </Label>
                                <Slider
                                    value={preferences.groupSize}
                                    onValueChange={(value) => setPreferences(prev => ({ ...prev, groupSize: value }))}
                                    max={10}
                                    min={1}
                                    step={1}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Solo</span>
                                    <span>Group</span>
                                </div>
                            </div>

                            {/* Activity Level */}
                            <div>
                                <Label className="text-sm font-medium mb-2 block">
                                    Activity Level: {
                                        preferences.activityLevel[0] <= 2 ? 'Relaxed' :
                                            preferences.activityLevel[0] <= 4 ? 'Moderate' : 'Active'
                                    }
                                </Label>
                                <Slider
                                    value={preferences.activityLevel}
                                    onValueChange={(value) => setPreferences(prev => ({ ...prev, activityLevel: value }))}
                                    max={5}
                                    min={1}
                                    step={1}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Relaxed</span>
                                    <span>Very Active</span>
                                </div>
                            </div>

                            {/* Interests */}
                            <div>
                                <Label className="text-sm font-medium mb-3 block">Interests</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {interests.map((interest) => (
                                        <div key={interest.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={interest.id}
                                                checked={preferences.interests.includes(interest.id)}
                                                onCheckedChange={(checked) => handleInterestChange(interest.id, checked)}
                                            />
                                            <Label htmlFor={interest.id} className="text-sm cursor-pointer">
                                                <span className="mr-1">{interest.icon}</span>
                                                {interest.label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Travel Style */}
                            <div>
                                <Label className="text-sm font-medium mb-2 block">Travel Style</Label>
                                <Select value={preferences.travelStyle} onValueChange={(value) =>
                                    setPreferences(prev => ({ ...prev, travelStyle: value }))
                                }>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your style" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {travelStyles.map((style) => (
                                            <SelectItem key={style.value} value={style.value}>
                                                {style.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Season */}
                            <div>
                                <Label className="text-sm font-medium mb-2 block">Preferred Season</Label>
                                <Select value={preferences.season} onValueChange={(value) =>
                                    setPreferences(prev => ({ ...prev, season: value }))
                                }>
                                    <SelectTrigger>
                                        <SelectValue placeholder="When do you want to travel?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {seasons.map((season) => (
                                            <SelectItem key={season.value} value={season.value}>
                                                {season.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                onClick={handleGenerateTrip}
                                className="w-full"
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Generating Perfect Trip...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <Lightbulb className="w-4 h-4" />
                                        <span>Generate My Perfect Trip</span>
                                    </div>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Predicted Trip Result */}
                <div className="lg:col-span-2">
                    {predictedTrip ? (
                        <PredictedTripCard trip={predictedTrip} />
                    ) : (
                        <Card className="h-96 flex items-center justify-center border-2 border-dashed border-gray-300">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                    <Compass className="w-8 h-8 text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-600">Ready to Plan Your Perfect Trip?</h3>
                                    <p className="text-gray-500">
                                        Set your preferences on the left and click "Generate My Perfect Trip" to see AI-powered recommendations.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PredictivePlanner;
