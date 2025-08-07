import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Checkbox } from '../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar, CalendarDays } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Progress } from '../components/ui/progress';
import {
    CalendarIcon,
    Users,
    MapPin,
    Clock,
    Star,
    Shield,
    CreditCard,
    CheckCircle,
    AlertCircle,
    Camera,
    Utensils,
    Car,
    Home
} from 'lucide-react';
import { format } from 'date-fns';
import { bookingAPI } from '../api';

// Step 1: Tour Selection
const TourSelection = ({ selectedTour, onTourSelect, onNext }) => {
    const [tourCategory, setTourCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const mockTours = [
        {
            id: 1,
            name: 'Petra Day Tour',
            description: 'Explore the ancient city of Petra with expert guides',
            duration: '8 hours',
            price: 75,
            rating: 4.8,
            reviews: 234,
            category: 'historical',
            highlights: ['Treasury', 'Monastery', 'Royal Tombs'],
            includes: ['Transportation', 'Guide', 'Entry Ticket'],
            image: '/api/placeholder/300/200'
        },
        {
            id: 2,
            name: 'Wadi Rum Desert Adventure',
            description: 'Desert safari with camel riding and Bedouin camp',
            duration: '2 days / 1 night',
            price: 120,
            rating: 4.9,
            reviews: 189,
            category: 'adventure',
            highlights: ['Desert Safari', 'Camel Riding', 'Star Gazing'],
            includes: ['Transportation', 'Meals', 'Camping', 'Guide'],
            image: '/api/placeholder/300/200'
        },
        {
            id: 3,
            name: 'Dead Sea Relaxation',
            description: 'Float in the Dead Sea and enjoy spa treatments',
            duration: '6 hours',
            price: 55,
            rating: 4.6,
            reviews: 156,
            category: 'wellness',
            highlights: ['Dead Sea Floating', 'Mud Bath', 'Spa Treatment'],
            includes: ['Transportation', 'Lunch', 'Spa Access'],
            image: '/api/placeholder/300/200'
        },
        {
            id: 4,
            name: 'Jerash & Ajloun Tour',
            description: 'Historical sites and Islamic castle exploration',
            duration: '7 hours',
            price: 65,
            rating: 4.7,
            reviews: 98,
            category: 'historical',
            highlights: ['Roman Ruins', 'Ajloun Castle', 'Archaeological Sites'],
            includes: ['Transportation', 'Guide', 'Entry Tickets'],
            image: '/api/placeholder/300/200'
        },
        {
            id: 5,
            name: 'Amman City Walking Tour',
            description: 'Discover the modern and ancient sides of Amman',
            duration: '4 hours',
            price: 35,
            rating: 4.5,
            reviews: 76,
            category: 'cultural',
            highlights: ['Citadel', 'Roman Theater', 'Rainbow Street'],
            includes: ['Guide', 'Refreshments'],
            image: '/api/placeholder/300/200'
        },
        {
            id: 6,
            name: 'Aqaba Diving Experience',
            description: 'Red Sea diving and coral reef exploration',
            duration: '6 hours',
            price: 85,
            rating: 4.8,
            reviews: 67,
            category: 'adventure',
            highlights: ['Coral Reefs', 'Marine Life', 'Diving Equipment'],
            includes: ['Equipment', 'Instructor', 'Lunch'],
            image: '/api/placeholder/300/200'
        }
    ];

    const filteredTours = mockTours.filter(tour => {
        const matchesCategory = tourCategory === 'all' || tour.category === tourCategory;
        const matchesSearch = tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tour.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const categories = [
        { value: 'all', label: 'All Tours' },
        { value: 'historical', label: 'Historical' },
        { value: 'adventure', label: 'Adventure' },
        { value: 'cultural', label: 'Cultural' },
        { value: 'wellness', label: 'Wellness' }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Select Your Tour</h2>
                <p className="text-gray-600">Choose from our curated selection of Jordan experiences</p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <Input
                    placeholder="Search tours..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                />
                <Select value={tourCategory} onValueChange={setTourCategory}>
                    <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                                {category.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Tours Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTours.map((tour) => (
                    <Card
                        key={tour.id}
                        className={`cursor-pointer transition-all ${selectedTour?.id === tour.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-lg'
                            }`}
                        onClick={() => onTourSelect(tour)}
                    >
                        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg">
                            <Badge className="absolute top-2 left-2 bg-white text-gray-800">
                                {tour.category}
                            </Badge>
                            <div className="absolute top-2 right-2 flex items-center space-x-1 bg-white/90 px-2 py-1 rounded">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-medium">{tour.rating}</span>
                            </div>
                        </div>
                        <CardContent className="p-4">
                            <div className="mb-3">
                                <h3 className="font-semibold text-lg mb-1">{tour.name}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2">{tour.description}</p>
                            </div>

                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center text-sm text-gray-500">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {tour.duration}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Users className="w-4 h-4 mr-1" />
                                    {tour.reviews} reviews
                                </div>
                            </div>

                            <div className="mb-3">
                                <p className="text-sm text-gray-600 mb-2">Highlights:</p>
                                <div className="flex flex-wrap gap-1">
                                    {tour.highlights.slice(0, 3).map((highlight, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                            {highlight}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold text-blue-600">
                                    ${tour.price}
                                    <span className="text-sm text-gray-500 font-normal"> /person</span>
                                </div>
                                <Button
                                    variant={selectedTour?.id === tour.id ? "default" : "outline"}
                                    size="sm"
                                >
                                    {selectedTour?.id === tour.id ? 'Selected' : 'Select'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={onNext}
                    disabled={!selectedTour}
                    className="w-full md:w-auto"
                >
                    Continue to Guest Details
                </Button>
            </div>
        </div>
    );
};

// Step 2: Guest Details
const GuestDetails = ({ guestInfo, onGuestInfoChange, onNext, onBack }) => {
    const [formData, setFormData] = useState({
        numberOfGuests: 2,
        leadGuest: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            nationality: '',
            dateOfBirth: null
        },
        additionalGuests: [],
        specialRequests: '',
        dietaryRestrictions: [],
        accessibilityNeeds: '',
        emergencyContact: {
            name: '',
            relationship: '',
            phone: ''
        },
        ...guestInfo
    });

    const [selectedDate, setSelectedDate] = useState(null);

    const handleInputChange = (field, value, section = null) => {
        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleDietaryChange = (restriction, checked) => {
        const updated = checked
            ? [...formData.dietaryRestrictions, restriction]
            : formData.dietaryRestrictions.filter(r => r !== restriction);

        setFormData(prev => ({
            ...prev,
            dietaryRestrictions: updated
        }));
    };

    const handleNext = () => {
        onGuestInfoChange(formData);
        onNext();
    };

    const dietaryOptions = [
        'Vegetarian',
        'Vegan',
        'Gluten-free',
        'Halal',
        'Kosher',
        'No pork',
        'No seafood',
        'Nut allergy'
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Guest Details</h2>
                <p className="text-gray-600">Please provide information for all guests</p>
            </div>

            {/* Number of Guests */}
            <Card>
                <CardHeader>
                    <CardTitle>Group Size</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4">
                        <Label>Number of guests:</Label>
                        <Select
                            value={formData.numberOfGuests.toString()}
                            onValueChange={(value) => handleInputChange('numberOfGuests', parseInt(value))}
                        >
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[...Array(10)].map((_, i) => (
                                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                                        {i + 1}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Tour Date Selection */}
            <Card>
                <CardHeader>
                    <CardTitle>Select Tour Date</CardTitle>
                </CardHeader>
                <CardContent>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full md:w-80 justify-start text-left font-normal"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </CardContent>
            </Card>

            {/* Lead Guest Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Lead Guest Information</CardTitle>
                    <CardDescription>Primary contact for this booking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                                id="firstName"
                                value={formData.leadGuest.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value, 'leadGuest')}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input
                                id="lastName"
                                value={formData.leadGuest.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value, 'leadGuest')}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.leadGuest.email}
                                onChange={(e) => handleInputChange('email', e.target.value, 'leadGuest')}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.leadGuest.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value, 'leadGuest')}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="nationality">Nationality</Label>
                            <Input
                                id="nationality"
                                value={formData.leadGuest.nationality}
                                onChange={(e) => handleInputChange('nationality', e.target.value, 'leadGuest')}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
                <CardHeader>
                    <CardTitle>Emergency Contact</CardTitle>
                    <CardDescription>Someone we can reach in case of emergency</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="emergencyName">Contact Name</Label>
                            <Input
                                id="emergencyName"
                                value={formData.emergencyContact.name}
                                onChange={(e) => handleInputChange('name', e.target.value, 'emergencyContact')}
                            />
                        </div>
                        <div>
                            <Label htmlFor="emergencyRelationship">Relationship</Label>
                            <Input
                                id="emergencyRelationship"
                                value={formData.emergencyContact.relationship}
                                onChange={(e) => handleInputChange('relationship', e.target.value, 'emergencyContact')}
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                        <Input
                            id="emergencyPhone"
                            type="tel"
                            value={formData.emergencyContact.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value, 'emergencyContact')}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Special Requirements */}
            <Card>
                <CardHeader>
                    <CardTitle>Special Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Dietary Restrictions</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                            {dietaryOptions.map((option) => (
                                <div key={option} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={option}
                                        checked={formData.dietaryRestrictions.includes(option)}
                                        onCheckedChange={(checked) => handleDietaryChange(option, checked)}
                                    />
                                    <Label htmlFor={option} className="text-sm">{option}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="accessibility">Accessibility Needs</Label>
                        <Textarea
                            id="accessibility"
                            placeholder="Please describe any accessibility requirements..."
                            value={formData.accessibilityNeeds}
                            onChange={(e) => handleInputChange('accessibilityNeeds', e.target.value)}
                        />
                    </div>

                    <div>
                        <Label htmlFor="specialRequests">Additional Special Requests</Label>
                        <Textarea
                            id="specialRequests"
                            placeholder="Any other special requests or information we should know..."
                            value={formData.specialRequests}
                            onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-between">
                <Button variant="outline" onClick={onBack}>
                    Back to Tour Selection
                </Button>
                <Button onClick={handleNext}>
                    Continue to Payment
                </Button>
            </div>
        </div>
    );
};

// Step 3: Payment (UI SCAFFOLDING ONLY - NO LOGIC)
const Payment = ({ bookingData, onNext, onBack }) => {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardInfo, setCardInfo] = useState({
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        cardholderName: ''
    });
    const [billingAddress, setBillingAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });

    // IMPORTANT: This is UI scaffolding ONLY - no actual payment processing
    const handlePayment = () => {
        // TODO: Integrate with actual payment processor (Stripe, PayPal, etc.)
        console.log('Payment processing - UI ONLY');
        onNext();
    };

    const totalAmount = bookingData.selectedTour ?
        bookingData.selectedTour.price * (bookingData.guestInfo?.numberOfGuests || 1) : 0;
    const serviceFee = totalAmount * 0.05; // 5% service fee
    const taxes = totalAmount * 0.16; // 16% VAT (Jordan standard)
    const finalTotal = totalAmount + serviceFee + taxes;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Payment Details</h2>
                <p className="text-gray-600">Secure payment processing - Your information is protected</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Payment Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Payment Method Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="card" id="card" />
                                    <Label htmlFor="card" className="flex items-center space-x-2">
                                        <CreditCard className="w-4 h-4" />
                                        <span>Credit/Debit Card</span>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="paypal" id="paypal" />
                                    <Label htmlFor="paypal" className="flex items-center space-x-2">
                                        <span className="w-4 h-4 bg-blue-600 rounded"></span>
                                        <span>PayPal</span>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="bank" id="bank" />
                                    <Label htmlFor="bank" className="flex items-center space-x-2">
                                        <Home className="w-4 h-4" />
                                        <span>Bank Transfer</span>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </CardContent>
                    </Card>

                    {/* Card Details - SCAFFOLDING ONLY */}
                    {paymentMethod === 'card' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Card Information</CardTitle>
                                <CardDescription>
                                    <Shield className="w-4 h-4 inline mr-1" />
                                    Your payment information is secure and encrypted
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="cardNumber">Card Number *</Label>
                                    <Input
                                        id="cardNumber"
                                        placeholder="1234 5678 9012 3456"
                                        value={cardInfo.cardNumber}
                                        onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value })}
                                    />
                                    <p className="text-xs text-red-500 mt-1">
                                        ⚠️ DEMO ONLY - DO NOT ENTER REAL CARD DETAILS
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="expiryMonth">Month *</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="MM" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[...Array(12)].map((_, i) => (
                                                    <SelectItem key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                                                        {(i + 1).toString().padStart(2, '0')}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="expiryYear">Year *</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="YYYY" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[...Array(10)].map((_, i) => (
                                                    <SelectItem key={i} value={(new Date().getFullYear() + i).toString()}>
                                                        {new Date().getFullYear() + i}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="cvv">CVV *</Label>
                                        <Input
                                            id="cvv"
                                            placeholder="123"
                                            maxLength="4"
                                            value={cardInfo.cvv}
                                            onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="cardholderName">Cardholder Name *</Label>
                                    <Input
                                        id="cardholderName"
                                        placeholder="Full name as on card"
                                        value={cardInfo.cardholderName}
                                        onChange={(e) => setCardInfo({ ...cardInfo, cardholderName: e.target.value })}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Billing Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Billing Address</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="street">Street Address</Label>
                                <Input
                                    id="street"
                                    value={billingAddress.street}
                                    onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        value={billingAddress.city}
                                        onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="state">State/Province</Label>
                                    <Input
                                        id="state"
                                        value={billingAddress.state}
                                        onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                                    <Input
                                        id="zipCode"
                                        value={billingAddress.zipCode}
                                        onChange={(e) => setBillingAddress({ ...billingAddress, zipCode: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="country">Country</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="jordan">Jordan</SelectItem>
                                            <SelectItem value="saudi">Saudi Arabia</SelectItem>
                                            <SelectItem value="uae">UAE</SelectItem>
                                            <SelectItem value="usa">United States</SelectItem>
                                            <SelectItem value="uk">United Kingdom</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Summary */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {bookingData.selectedTour && (
                                <div>
                                    <h4 className="font-semibold">{bookingData.selectedTour.name}</h4>
                                    <p className="text-sm text-gray-600">{bookingData.selectedTour.duration}</p>
                                    <div className="flex justify-between mt-2">
                                        <span>{bookingData.guestInfo?.numberOfGuests || 1} × ${bookingData.selectedTour.price}</span>
                                        <span>${totalAmount}</span>
                                    </div>
                                </div>
                            )}

                            <hr />

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${totalAmount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Service Fee</span>
                                    <span>${serviceFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Taxes (16% VAT)</span>
                                    <span>${taxes.toFixed(2)}</span>
                                </div>
                            </div>

                            <hr />

                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${finalTotal.toFixed(2)}</span>
                            </div>

                            <div className="text-xs text-gray-500 space-y-1">
                                <div className="flex items-center">
                                    <Shield className="w-3 h-3 mr-1" />
                                    <span>Secure payment processing</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    <span>Free cancellation up to 24h</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start">
                            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 mr-2" />
                            <div className="text-xs text-yellow-800">
                                <p className="font-medium">DEMO WARNING:</p>
                                <p>This is a demo interface only. No actual payments will be processed. Do not enter real payment information.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between">
                <Button variant="outline" onClick={onBack}>
                    Back to Guest Details
                </Button>
                <Button onClick={handlePayment} className="bg-green-600 hover:bg-green-700">
                    Complete Booking
                </Button>
            </div>
        </div>
    );
};

// Step 4: Confirmation
const Confirmation = ({ bookingData, onNewBooking }) => {
    const bookingId = `ST${Date.now().toString().slice(-6)}`;

    return (
        <div className="space-y-6 text-center">
            <div className="mb-8">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-green-600 mb-2">Booking Confirmed!</h2>
                <p className="text-gray-600">Thank you for choosing SmartTour.Jo</p>
            </div>

            <Card className="max-w-2xl mx-auto">
                <CardHeader className="bg-green-50">
                    <CardTitle className="text-center">Booking Details</CardTitle>
                    <CardDescription className="text-center">
                        Booking ID: <span className="font-mono font-semibold">{bookingId}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    {bookingData.selectedTour && (
                        <div className="space-y-4">
                            <div className="text-left">
                                <h3 className="font-semibold text-lg mb-2">{bookingData.selectedTour.name}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Duration:</span>
                                        <span className="ml-2">{bookingData.selectedTour.duration}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Guests:</span>
                                        <span className="ml-2">{bookingData.guestInfo?.numberOfGuests || 1}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Lead Guest:</span>
                                        <span className="ml-2">{bookingData.guestInfo?.leadGuest?.firstName} {bookingData.guestInfo?.leadGuest?.lastName}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Email:</span>
                                        <span className="ml-2">{bookingData.guestInfo?.leadGuest?.email}</span>
                                    </div>
                                </div>
                            </div>

                            <hr />

                            <div className="text-left">
                                <h4 className="font-semibold mb-2">What's Next?</h4>
                                <ul className="text-sm space-y-2">
                                    <li className="flex items-start">
                                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 mr-2" />
                                        <span>Confirmation email sent to {bookingData.guestInfo?.leadGuest?.email}</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 mr-2" />
                                        <span>Tour guide will contact you 24 hours before the tour</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 mr-2" />
                                        <span>Download SmartTour.Jo mobile app for real-time updates</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 mr-2" />
                                        <span>Free cancellation available up to 24 hours before tour</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                <Button variant="outline">
                    View My Bookings
                </Button>
                <Button onClick={onNewBooking}>
                    Book Another Tour
                </Button>
                <Button variant="outline">
                    Download Mobile App
                </Button>
            </div>
        </div>
    );
};

// Main BookingEngine Component
const BookingEngine = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [bookingData, setBookingData] = useState({
        selectedTour: null,
        guestInfo: null
    });

    const steps = [
        { id: 1, title: 'Select Tour', description: 'Choose your experience' },
        { id: 2, title: 'Guest Details', description: 'Provide information' },
        { id: 3, title: 'Payment', description: 'Secure checkout' },
        { id: 4, title: 'Confirmation', description: 'Booking complete' }
    ];

    const handleTourSelect = (tour) => {
        setBookingData(prev => ({
            ...prev,
            selectedTour: tour
        }));
    };

    const handleGuestInfoChange = (guestInfo) => {
        setBookingData(prev => ({
            ...prev,
            guestInfo
        }));
    };

    const nextStep = () => {
        setCurrentStep(prev => Math.min(prev + 1, 4));
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const resetBooking = () => {
        setCurrentStep(1);
        setBookingData({
            selectedTour: null,
            guestInfo: null
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Progress Indicator */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step.id
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : 'border-gray-300 text-gray-500'
                                }`}>
                                {currentStep > step.id ? (
                                    <CheckCircle className="w-6 h-6" />
                                ) : (
                                    <span className="font-semibold">{step.id}</span>
                                )}
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <h1 className="text-2xl font-bold">{steps[currentStep - 1].title}</h1>
                    <p className="text-gray-600">{steps[currentStep - 1].description}</p>
                </div>

                <Progress value={(currentStep / steps.length) * 100} className="mt-4" />
            </div>

            {/* Step Content */}
            <div className="max-w-6xl mx-auto">
                {currentStep === 1 && (
                    <TourSelection
                        selectedTour={bookingData.selectedTour}
                        onTourSelect={handleTourSelect}
                        onNext={nextStep}
                    />
                )}

                {currentStep === 2 && (
                    <GuestDetails
                        guestInfo={bookingData.guestInfo}
                        onGuestInfoChange={handleGuestInfoChange}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                )}

                {currentStep === 3 && (
                    <Payment
                        bookingData={bookingData}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                )}

                {currentStep === 4 && (
                    <Confirmation
                        bookingData={bookingData}
                        onNewBooking={resetBooking}
                    />
                )}
            </div>
        </div>
    );
};

export default BookingEngine;
