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
        <div className="min-h-screen bg-purple-100 dark:bg-gray-900 py-20 px-4 sm:px-6">
            <div className="container mx-auto max-w-2xl">
                <Card className="bg-purple-200 dark:bg-gray-800/30 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                            {t({ ar: 'ملف تعريف المسافر', en: 'Traveler Profile' })}
                        </CardTitle>
                        <CardDescription>
                            {t({ ar: 'بتخصيص تفضيلاتك، يمكن لـ "جواد" أن يقدم لك اقتراحات أفضل.', en: 'Customize your preferences so "Jawad" can give you better suggestions.' })}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>{t({ ar: 'اهتماماتك', en: 'Your Interests' })}</Label>
                            <div className="grid grid-cols-2 gap-4">
                                {interestsOptions.map((interest) => (
                                    <div key={interest} className="flex items-center space-x-2 rtl:space-x-reverse">
                                        <Checkbox
                                            id={interest}
                                            checked={interests.includes(interest)}
                                            onCheckedChange={() => handleInterestChange(interest)}
                                        />
                                        <label htmlFor={interest} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-200">
                                            {t({ ar: interest, en: interest })}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="budget">{t({ ar: 'الميزانية', en: 'Budget' })}</Label>
                            <Select value={budget} onValueChange={setBudget}>
                                <SelectTrigger id="budget">
                                    <SelectValue placeholder={t({ ar: 'اختر ميزانيتك', en: 'Select your budget' })} />
                                </SelectTrigger>
                                <SelectContent>
                                    {budgetOptions.map((option) => (
                                        <SelectItem key={option} value={option}>{t({ ar: option, en: option })}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="travelsWith">{t({ ar: 'تسافر مع', en: 'Traveling With' })}</Label>
                            <Select value={travelsWith} onValueChange={setTravelsWith}>
                                <SelectTrigger id="travelsWith">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Solo">{t({ ar: 'بمفردي', en: 'Solo' })}</SelectItem>
                                    <SelectItem value="Partner">{t({ ar: 'مع شريك', en: 'Partner' })}</SelectItem>
                                    <SelectItem value="Family">{t({ ar: 'مع العائلة', en: 'Family' })}</SelectItem>
                                    <SelectItem value="Friends">{t({ ar: 'مع الأصدقاء', en: 'Friends' })}</SelectItem>
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