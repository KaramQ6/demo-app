import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const IoTCardSkeleton = () => {
    return (
        <Card className="glass-card border-white/10 animate-pulse overflow-hidden">
            {/* Header Skeleton */}
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="w-6 h-6 bg-gray-600/50 rounded shimmer"></div>
                        <div className="w-32 h-6 bg-gray-600/50 rounded shimmer"></div>
                    </div>
                    <div className="w-16 h-6 bg-gray-600/50 rounded-full shimmer"></div>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Circular Progress Skeleton */}
                <div className="flex items-center justify-between">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gray-700/30 rounded-full shimmer mx-auto"></div>
                        <div className="w-24 h-4 bg-gray-600/50 rounded mt-3 mx-auto shimmer"></div>
                    </div>

                    <div className="space-y-4 flex-1 ml-8 rtl:ml-0 rtl:mr-8">
                        {/* Data Rows Skeleton */}
                        {Array.from({ length: 3 }, (_, index) => (
                            <div key={index} className="flex items-center justify-between glass p-4 rounded-lg">
                                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                    <div className="w-5 h-5 bg-gray-600/50 rounded shimmer"></div>
                                    <div className="w-20 h-4 bg-gray-600/50 rounded shimmer"></div>
                                </div>
                                <div className="w-16 h-4 bg-gray-600/50 rounded shimmer"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Visitors Count Skeleton */}
                <div className="flex items-center justify-between glass p-4 rounded-lg">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="w-5 h-5 bg-gray-600/50 rounded shimmer"></div>
                        <div className="w-28 h-4 bg-gray-600/50 rounded shimmer"></div>
                    </div>
                    <div className="w-12 h-4 bg-gray-600/50 rounded shimmer"></div>
                </div>

                {/* Last Update Skeleton */}
                <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse pt-4 border-t border-white/10">
                    <div className="w-4 h-4 bg-gray-600/50 rounded shimmer"></div>
                    <div className="w-24 h-4 bg-gray-600/50 rounded shimmer"></div>
                </div>
            </CardContent>
        </Card>
    );
};

export default IoTCardSkeleton;
