import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Checkbox } from '../components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import { Star, MapPin, Heart, Trophy, Award, Camera } from 'lucide-react';
import { profileAPI } from '../api';

// PreferenceEngine Component
const PreferenceEngine = ({ preferences = {}, onPreferencesChange }) => {
    const [localPreferences, setLocalPreferences] = useState({
        history: false,
        nature: false,
        adventure: false,
        food: false,
        culture: false,
        shopping: false,
        nightlife: false,
        relaxation: false,
        sports: false,
        photography: false,
        ...preferences
    });

    const handlePreferenceChange = (preference, checked) => {
        const updated = { ...localPreferences, [preference]: checked };
        setLocalPreferences(updated);
        onPreferencesChange?.(updated);
    };

    const interestCategories = [
        { key: 'history', label: 'History & Heritage', icon: '🏛️' },
        { key: 'nature', label: 'Nature & Wildlife', icon: '🌿' },
        { key: 'adventure', label: 'Adventure Sports', icon: '⛰️' },
        { key: 'food', label: 'Food & Culinary', icon: '🍜' },
        { key: 'culture', label: 'Art & Culture', icon: '🎨' },
        { key: 'shopping', label: 'Shopping', icon: '🛍️' },
        { key: 'nightlife', label: 'Nightlife & Entertainment', icon: '🌃' },
        { key: 'relaxation', label: 'Spa & Wellness', icon: '🧘' },
        { key: 'sports', label: 'Sports & Events', icon: '⚽' },
        { key: 'photography', label: 'Photography', icon: '📸' }
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Travel Preferences</CardTitle>
                <CardDescription>
                    Tell us what interests you most to get personalized recommendations
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {interestCategories.map(({ key, label, icon }) => (
                        <div key={key} className="flex items-center space-x-2">
                            <Checkbox
                                id={key}
                                checked={localPreferences[key]}
                                onCheckedChange={(checked) => handlePreferenceChange(key, checked)}
                            />
                            <Label htmlFor={key} className="flex items-center space-x-2 cursor-pointer">
                                <span>{icon}</span>
                                <span className="text-sm">{label}</span>
                            </Label>
                        </div>
                    ))}
                </div>
                <div className="mt-6">
                    <Button className="w-full">Save Preferences</Button>
                </div>
            </CardContent>
        </Card>
    );
};

// TravelHistory Component
const TravelHistory = ({ history = [] }) => {
    const mockHistory = history.length ? history : [
        {
            id: 1,
            destination: 'Petra, Jordan',
            date: '2024-03-15',
            image: '/api/placeholder/300/200',
            rating: 5,
            highlights: ['Rose City', 'Treasury', 'Monastery']
        },
        {
            id: 2,
            destination: 'Wadi Rum, Jordan',
            date: '2024-02-10',
            image: '/api/placeholder/300/200',
            rating: 4,
            highlights: ['Desert Safari', 'Star Gazing', 'Bedouin Camp']
        },
        {
            id: 3,
            destination: 'Jerash, Jordan',
            date: '2023-12-20',
            image: '/api/placeholder/300/200',
            rating: 4,
            highlights: ['Roman Ruins', 'Jerash Festival', 'Archaeological Site']
        },
        {
            id: 4,
            destination: 'Dead Sea, Jordan',
            date: '2023-11-05',
            image: '/api/placeholder/300/200',
            rating: 5,
            highlights: ['Floating Experience', 'Mud Bath', 'Resort Spa']
        }
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Travel History</CardTitle>
                <CardDescription>
                    Places you've explored with SmartTour.Jo
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockHistory.map((trip) => (
                        <Card key={trip.id} className="overflow-hidden">
                            <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
                                <Camera className="absolute top-2 right-2 w-5 h-5 text-white" />
                                <div className="absolute bottom-2 left-2 text-white">
                                    <h4 className="font-semibold">{trip.destination}</h4>
                                    <p className="text-sm opacity-90">{new Date(trip.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <CardContent className="p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < trip.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <Button variant="outline" size="sm">View Details</Button>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {trip.highlights.slice(0, 2).map((highlight, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                            {highlight}
                                        </Badge>
                                    ))}
                                    {trip.highlights.length > 2 && (
                                        <Badge variant="outline" className="text-xs">
                                            +{trip.highlights.length - 2} more
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {mockHistory.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No travel history yet. Start exploring!</p>
                        <Button className="mt-3">Browse Destinations</Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

// Wishlist Component
const Wishlist = ({ wishlist = [], onAddToWishlist, onRemoveFromWishlist }) => {
    const [localWishlist, setLocalWishlist] = useState(wishlist.length ? wishlist : [
        {
            id: 1,
            name: 'Aqaba, Jordan',
            image: '/api/placeholder/300/200',
            description: 'Red Sea diving and coral reefs',
            estimatedCost: '$150-300',
            bestTime: 'Oct-Apr'
        },
        {
            id: 2,
            name: 'Dana Biosphere Reserve',
            image: '/api/placeholder/300/200',
            description: 'Eco-tourism and hiking trails',
            estimatedCost: '$80-200',
            bestTime: 'Mar-May, Sep-Nov'
        },
        {
            id: 3,
            name: 'Umm Qais, Jordan',
            image: '/api/placeholder/300/200',
            description: 'Ancient Gadara ruins with panoramic views',
            estimatedCost: '$50-120',
            bestTime: 'Mar-May, Sep-Nov'
        }
    ]);

    const handleRemoveFromWishlist = (itemId) => {
        const updatedWishlist = localWishlist.filter(item => item.id !== itemId);
        setLocalWishlist(updatedWishlist);
        onRemoveFromWishlist?.(itemId);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Wishlist</CardTitle>
                <CardDescription>
                    Destinations you want to visit
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {localWishlist.map((destination) => (
                        <Card key={destination.id} className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex space-x-4 flex-1">
                                    <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                                        <MapPin className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold">{destination.name}</h4>
                                        <p className="text-sm text-gray-600 mb-2">{destination.description}</p>
                                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                                            <span>💰 {destination.estimatedCost}</span>
                                            <span>📅 {destination.bestTime}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm">Plan Trip</Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleRemoveFromWishlist(destination.id)}
                                    >
                                        <Heart className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
                {localWishlist.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Your wishlist is empty. Add some destinations!</p>
                        <Button className="mt-3">Explore Destinations</Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

// Gamification Component
const Gamification = ({ userLevel = 5, totalPoints = 1250, badges = [] }) => {
    const mockBadges = badges.length ? badges : [
        { id: 1, name: 'Explorer', description: 'Visited 5+ destinations', icon: '🗺️', earned: true },
        { id: 2, name: 'Photographer', description: 'Shared 10+ photos', icon: '📸', earned: true },
        { id: 3, name: 'Reviewer', description: 'Left 5+ reviews', icon: '⭐', earned: true },
        { id: 4, name: 'Social Butterfly', description: 'Connected with 10+ travelers', icon: '🦋', earned: false },
        { id: 5, name: 'Adventure Seeker', description: 'Completed 3+ adventure activities', icon: '⛰️', earned: true },
        { id: 6, name: 'Cultural Enthusiast', description: 'Visited 5+ cultural sites', icon: '🏛️', earned: false }
    ];

    const nextLevelPoints = (userLevel + 1) * 300;
    const currentLevelPoints = userLevel * 300;
    const progressToNextLevel = ((totalPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Travel Achievements</CardTitle>
                <CardDescription>
                    Your progress and earned badges
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Level Progress */}
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-semibold">Level {userLevel}</span>
                        <span className="text-sm opacity-90">{totalPoints} points</span>
                    </div>
                    <Progress value={progressToNextLevel} className="h-2 mb-2 bg-white/20" />
                    <p className="text-sm opacity-90">
                        {nextLevelPoints - totalPoints} points to Level {userLevel + 1}
                    </p>
                </div>

                {/* Badges Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {mockBadges.map((badge) => (
                        <Card key={badge.id} className={`p-3 text-center ${badge.earned ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-60'
                            }`}>
                            <div className="text-2xl mb-2">{badge.icon}</div>
                            <h4 className="font-semibold text-sm">{badge.name}</h4>
                            <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
                            {badge.earned && (
                                <Badge variant="secondary" className="mt-2 text-xs">
                                    Earned
                                </Badge>
                            )}
                        </Card>
                    ))}
                </div>

                {/* Achievement Stats */}
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-blue-600">8</div>
                        <div className="text-xs text-gray-600">Destinations</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-green-600">23</div>
                        <div className="text-xs text-gray-600">Reviews</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-purple-600">4</div>
                        <div className="text-xs text-gray-600">Badges</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// Main UserProfile Component
const UserProfile = () => {
    const [userProfile, setUserProfile] = useState({
        name: 'Ahmad Al-Zahra',
        email: 'ahmad@example.com',
        avatar: '/api/placeholder/100/100',
        bio: 'Passionate traveler exploring Jordan and beyond',
        location: 'Amman, Jordan',
        memberSince: '2023-06-15',
        preferences: {},
        level: 5,
        points: 1250
    });

    const [preferences, setPreferences] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Load user profile data
        // This would typically come from the API
        setLoading(false);
    }, []);

    const handlePreferencesChange = (newPreferences) => {
        setPreferences(newPreferences);
        // TODO: Save to API
    };

    const handleUpdateProfile = async (updates) => {
        setLoading(true);
        try {
            // TODO: Implement API call
            setUserProfile(prev => ({ ...prev, ...updates }));
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Profile Header */}
            <Card className="mb-8">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                        <Avatar className="w-24 h-24">
                            <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                            <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-3xl font-bold">{userProfile.name}</h1>
                            <p className="text-gray-600 mb-2">{userProfile.bio}</p>
                            <div className="flex flex-wrap items-center justify-center md:justify-start space-x-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {userProfile.location}
                                </span>
                                <span>Member since {new Date(userProfile.memberSince).getFullYear()}</span>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                                <Badge className="bg-blue-100 text-blue-800">Level {userProfile.level}</Badge>
                                <Badge className="bg-green-100 text-green-800">{userProfile.points} Points</Badge>
                                <Badge className="bg-purple-100 text-purple-800">Verified Traveler</Badge>
                            </div>
                        </div>
                        <Button variant="outline">Edit Profile</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Profile Tabs */}
            <Tabs defaultValue="preferences" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="preferences">My Preferences</TabsTrigger>
                    <TabsTrigger value="history">Travel History</TabsTrigger>
                    <TabsTrigger value="wishlist">My Wishlist</TabsTrigger>
                    <TabsTrigger value="achievements">Achievements</TabsTrigger>
                </TabsList>

                <TabsContent value="preferences" className="space-y-6">
                    <PreferenceEngine
                        preferences={preferences}
                        onPreferencesChange={handlePreferencesChange}
                    />
                </TabsContent>

                <TabsContent value="history" className="space-y-6">
                    <TravelHistory />
                </TabsContent>

                <TabsContent value="wishlist" className="space-y-6">
                    <Wishlist />
                </TabsContent>

                <TabsContent value="achievements" className="space-y-6">
                    <Gamification
                        userLevel={userProfile.level}
                        totalPoints={userProfile.points}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default UserProfile;
