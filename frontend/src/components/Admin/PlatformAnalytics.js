import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Calendar, Star, MapPin, Clock } from 'lucide-react';

const PlatformAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('month');
    const [metrics, setMetrics] = useState({});

    useEffect(() => {
        loadAnalytics();
    }, [timeRange]);

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            // Simulate API call - in real app, this would fetch analytics data
            await new Promise(resolve => setTimeout(resolve, 1000));

            setMetrics({
                totalRevenue: 245670,
                totalBookings: 2890,
                newUsers: 89,
                avgRating: 4.8,
                revenueGrowth: 15,
                bookingsGrowth: 8,
                usersGrowth: 12,
                ratingChange: 0.2
            });
        } catch (error) {
            console.error('Failed to load analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    // Mock data for charts
    const bookingsOverTime = [
        { month: 'Jan', bookings: 240, revenue: 18400 },
        { month: 'Feb', bookings: 280, revenue: 21200 },
        { month: 'Mar', bookings: 320, revenue: 24800 },
        { month: 'Apr', bookings: 350, revenue: 27300 },
        { month: 'May', bookings: 410, revenue: 32100 },
        { month: 'Jun', bookings: 480, revenue: 38400 },
        { month: 'Jul', bookings: 520, revenue: 42000 }
    ];

    const destinationStats = [
        { name: 'Petra', bookings: 890, percentage: 31 },
        { name: 'Wadi Rum', bookings: 720, percentage: 25 },
        { name: 'Dead Sea', bookings: 580, percentage: 20 },
        { name: 'Jerash', bookings: 400, percentage: 14 },
        { name: 'Aqaba', bookings: 300, percentage: 10 }
    ];

    const userGrowth = [
        { month: 'Jan', users: 45, active: 38 },
        { month: 'Feb', users: 52, active: 48 },
        { month: 'Mar', users: 67, active: 61 },
        { month: 'Apr', users: 78, active: 72 },
        { month: 'May', users: 85, active: 79 },
        { month: 'Jun', users: 94, active: 87 },
        { month: 'Jul', users: 89, active: 82 }
    ];

    const deviceStats = [
        { name: 'Mobile', value: 65, color: '#3B82F6' },
        { name: 'Desktop', value: 28, color: '#10B981' },
        { name: 'Tablet', value: 7, color: '#F59E0B' }
    ];

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const formatPercentage = (value) => {
        return `${value > 0 ? '+' : ''}${value}%`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Platform Analytics</h2>
                    <p className="text-gray-600">Insights and performance metrics</p>
                </div>

                {/* Time Range Filter */}
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="quarter">Last Quarter</option>
                    <option value="year">Last Year</option>
                </select>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-green-600">{formatCurrency(metrics.totalRevenue)}</div>
                            <div className="text-sm text-gray-600">Total Revenue</div>
                            <div className={`text-xs mt-1 flex items-center ${metrics.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                <TrendingUp className="w-3 h-3 mr-1" />
                                {formatPercentage(metrics.revenueGrowth)} this month
                            </div>
                        </div>
                        <div className="text-3xl text-green-500">
                            <DollarSign className="w-8 h-8" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-blue-600">{metrics.totalBookings.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">Total Bookings</div>
                            <div className={`text-xs mt-1 flex items-center ${metrics.bookingsGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                <TrendingUp className="w-3 h-3 mr-1" />
                                {formatPercentage(metrics.bookingsGrowth)} this month
                            </div>
                        </div>
                        <div className="text-3xl text-blue-500">
                            <Calendar className="w-8 h-8" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-purple-600">{metrics.newUsers}</div>
                            <div className="text-sm text-gray-600">New Users This Month</div>
                            <div className={`text-xs mt-1 flex items-center ${metrics.usersGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                <TrendingUp className="w-3 h-3 mr-1" />
                                {formatPercentage(metrics.usersGrowth)} vs last month
                            </div>
                        </div>
                        <div className="text-3xl text-purple-500">
                            <Users className="w-8 h-8" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-yellow-600">{metrics.avgRating}/5</div>
                            <div className="text-sm text-gray-600">Average Rating</div>
                            <div className={`text-xs mt-1 flex items-center ${metrics.ratingChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                <TrendingUp className="w-3 h-3 mr-1" />
                                {formatPercentage(metrics.ratingChange * 20)} this month
                            </div>
                        </div>
                        <div className="text-3xl text-yellow-500">
                            <Star className="w-8 h-8" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bookings Over Time */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Bookings Over Time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={bookingsOverTime}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip
                                formatter={(value, name) => [
                                    name === 'bookings' ? value : formatCurrency(value),
                                    name === 'bookings' ? 'Bookings' : 'Revenue'
                                ]}
                            />
                            <Line
                                type="monotone"
                                dataKey="bookings"
                                stroke="#3B82F6"
                                strokeWidth={2}
                                dot={{ fill: '#3B82F6' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue Trend */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={bookingsOverTime}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                            <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
                            <Bar dataKey="revenue" fill="#10B981" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Destinations */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Destinations</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={destinationStats}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="bookings"
                            >
                                {destinationStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value, name, props) => [value, props.payload.name]} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                        {destinationStats.map((destination, index) => (
                            <div key={destination.name} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div
                                        className="w-3 h-3 rounded-full mr-2"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    ></div>
                                    <span className="text-sm text-gray-600">{destination.name}</span>
                                </div>
                                <span className="text-sm font-medium text-gray-800">
                                    {destination.bookings} ({destination.percentage}%)
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* User Growth */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">User Growth</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={userGrowth}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="users"
                                stroke="#8B5CF6"
                                strokeWidth={2}
                                name="New Users"
                            />
                            <Line
                                type="monotone"
                                dataKey="active"
                                stroke="#F59E0B"
                                strokeWidth={2}
                                name="Active Users"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Device Usage */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Device Usage</h3>
                    <div className="space-y-3">
                        {deviceStats.map((device) => (
                            <div key={device.name} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">{device.name}</span>
                                <div className="flex items-center">
                                    <div className="w-20 h-2 bg-gray-200 rounded-full mr-3">
                                        <div
                                            className="h-2 rounded-full"
                                            style={{
                                                width: `${device.value}%`,
                                                backgroundColor: device.color
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-800">{device.value}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-800">New booking</div>
                                <div className="text-xs text-gray-500">2 minutes ago</div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-800">New user registered</div>
                                <div className="text-xs text-gray-500">5 minutes ago</div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                <Star className="w-4 h-4 text-yellow-600" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-800">New 5-star review</div>
                                <div className="text-xs text-gray-500">8 minutes ago</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Average booking value</span>
                            <span className="text-sm font-medium text-gray-800">$85</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Conversion rate</span>
                            <span className="text-sm font-medium text-gray-800">3.2%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Customer retention</span>
                            <span className="text-sm font-medium text-gray-800">68%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Active guides</span>
                            <span className="text-sm font-medium text-gray-800">24</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformAnalytics;
