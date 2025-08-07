import React from 'react';
import { Card, CardContent } from './ui/card';

const DestinationCardSkeleton = () => {
    return (
        <Card className="glass-card h-full overflow-hidden border-white/10 animate-pulse">
            {/* Image Skeleton */}
            <div className="relative h-48 overflow-hidden">
                <div className="w-full h-full bg-gray-700/30 shimmer"></div>

                {/* Rating Badge Skeleton */}
                <div className="absolute top-4 right-4">
                    <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                        <div className="w-4 h-4 bg-gray-600/50 rounded"></div>
                        <div className="w-6 h-4 bg-gray-600/50 rounded"></div>
                    </div>
                </div>

                {/* Title Skeleton */}
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="w-3/4 h-6 bg-gray-600/50 rounded mb-2"></div>
                </div>
            </div>

            {/* Content Skeleton */}
            <CardContent className="p-6">
                {/* Description Lines */}
                <div className="space-y-2 mb-4">
                    <div className="w-full h-4 bg-gray-700/30 rounded"></div>
                    <div className="w-4/5 h-4 bg-gray-700/30 rounded"></div>
                    <div className="w-3/5 h-4 bg-gray-700/30 rounded"></div>
                </div>

                {/* Bottom Section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gray-600/50 rounded"></div>
                        <div className="w-16 h-4 bg-gray-600/50 rounded"></div>
                    </div>
                    <div className="w-16 h-6 bg-gray-600/50 rounded-full"></div>
                </div>
            </CardContent>
        </Card>
    );
};

export default DestinationCardSkeleton;
