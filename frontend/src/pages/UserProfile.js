// src/pages/UserProfile.js
import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { useToast } from '../hooks/use-toast';

const interestsOptions = ['Adventure', 'History', 'Food', 'Relaxation'];
const budgetOptions = ['Economy', 'Mid-range', 'Luxury'];

const UserProfile = () => {
    const { t } = useLanguage();
    const { userPreferences, saveUserPreferences } = useApp();
    const { toast } = useToast();

    const [interests, setInterests] = useState([]);
    const [budget, setBudget] = useState('');
    const [travelsWith, setTravelsWith] = useState('Solo');
    
    useEffect(() => {
        if (userPreferences) {
            setInterests(userPreferences.interests || []);
            setBudget(userPreferences.budget || '');
            setTravelsWith(userPreferences.travelsWith || 'Solo');
        }
    }, [userPreferences]);

    const handleInterestChange = (interest) => {
        setInterests((prev) =>
            prev.includes(interest)
                ? prev.filter((i) => i !== interest)
                : [...prev, interest]
        );
    };

    const handleSubmit = () => {
        const newPreferences = { interests, budget, travelsWith };
        saveUserPreferences(newPreferences);
        toast({
            title: t({ ar: "تم الحفظ!", en: "Preferences Saved!" }),
            description: t({ ar: "تم تحديث تفضيلاتك بنجاح.", en: "Your preferences have been successfully updated." }),
        });
    };

    return (
        <div className="relative min-h-screen pt-20">
            <div className="absolute inset-0 w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-900/60 to-black/80 z-10"></div>
                <img src="https://images.unsplash.com/photo-1574082512734-8336f25bb9d8" alt="Background" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-20 container mx-auto p-4 md:p-8">
                <Card className="glass-card shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-white">
                            {t({ ar: 'ملف تعريف المسافر', en: 'Traveler Profile' })}
                        </CardTitle>
                        <CardDescription className="text-gray-300">
                            {t({ ar: 'بتخصيص تفضيلاتك، يمكن لـ "جواد" أن يقدم لك اقتراحات أفضل.', en: 'Customize your preferences so "Jawad" can give you better suggestions.' })}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-white">{t({ ar: 'اهتماماتك', en: 'Your Interests' })}</Label>
                            <div className="grid grid-cols-2 gap-4">
                                {interestsOptions.map((interest) => (
                                    <div key={interest} className="flex items-center space-x-2 rtl:space-x-reverse">
                                        <Checkbox
                                            id={interest}
                                            checked={interests.includes(interest)}
                                            onCheckedChange={() => handleInterestChange(interest)}
                                        />
                                        <label htmlFor={interest} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300">
                                            {t({ ar: interest, en: interest })}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="budget" className="text-white">{t({ ar: 'الميزانية', en: 'Budget' })}</Label>
                            <Select value={budget} onValueChange={setBudget}>
                                <SelectTrigger id="budget" className="bg-white/10 text-white border-white/20">
                                    <SelectValue placeholder={t({ ar: 'اختر ميزانيتك', en: 'Select your budget' })} />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 text-white border-gray-700">
                                    {budgetOptions.map((option) => (
                                        <SelectItem key={option} value={option}>{t({ ar: option, en: option })}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="travelsWith" className="text-white">{t({ ar: 'تسافر مع', en: 'Traveling With' })}</Label>
                            <Select value={travelsWith} onValueChange={setTravelsWith}>
                                <SelectTrigger id="travelsWith" className="bg-white/10 text-white border-white/20">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 text-white border-gray-700">
                                    {['Solo', 'Partner', 'Family', 'Friends'].map(option => (
                                        <SelectItem key={option} value={option}>{t({ ar: option, en: option })}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <Button onClick={handleSubmit} className="w-full gradient-purple text-white">
                            {t({ ar: 'حفظ التفضيلات', en: 'Save Preferences' })}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UserProfile;