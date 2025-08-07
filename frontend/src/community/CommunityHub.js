import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Heart, MessageCircle, Share2, Camera, MapPin, Users, TrendingUp, Calendar } from 'lucide-react';
import { communityAPI } from '../api';

// Post Creation Component
const CreatePost = ({ onPostCreated }) => {
    const [postContent, setPostContent] = useState('');
    const [selectedDestination, setSelectedDestination] = useState('');
    const [postType, setPostType] = useState('general');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const newPost = {
                content: postContent,
                destination: selectedDestination,
                type: postType,
                timestamp: new Date().toISOString()
            };

            // TODO: Replace with actual API call
            onPostCreated?.(newPost);
            setPostContent('');
            setSelectedDestination('');
            setPostType('general');
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Share Your Experience</CardTitle>
                <CardDescription>
                    Tell the community about your travels in Jordan
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex space-x-2 mb-4">
                        <Button
                            type="button"
                            variant={postType === 'general' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPostType('general')}
                        >
                            General
                        </Button>
                        <Button
                            type="button"
                            variant={postType === 'review' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPostType('review')}
                        >
                            Review
                        </Button>
                        <Button
                            type="button"
                            variant={postType === 'tip' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPostType('tip')}
                        >
                            Travel Tip
                        </Button>
                        <Button
                            type="button"
                            variant={postType === 'question' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPostType('question')}
                        >
                            Question
                        </Button>
                    </div>

                    <Input
                        placeholder="Which destination are you talking about?"
                        value={selectedDestination}
                        onChange={(e) => setSelectedDestination(e.target.value)}
                    />

                    <Textarea
                        placeholder={`Share your ${postType === 'question' ? 'question' : 'experience'}...`}
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        rows={4}
                    />

                    <div className="flex space-x-2">
                        <Button type="button" variant="outline">
                            <Camera className="w-4 h-4 mr-2" />
                            Add Photo
                        </Button>
                        <Button type="button" variant="outline">
                            <MapPin className="w-4 h-4 mr-2" />
                            Add Location
                        </Button>
                    </div>

                    <Button type="submit" disabled={isSubmitting || !postContent.trim()}>
                        {isSubmitting ? 'Posting...' : 'Share Post'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

// Individual Post Component
const CommunityPost = ({ post, onLike, onComment, onShare }) => {
    const [liked, setLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');

    const handleLike = () => {
        setLiked(!liked);
        onLike?.(post.id, !liked);
    };

    const handleComment = () => {
        if (newComment.trim()) {
            onComment?.(post.id, newComment);
            setNewComment('');
        }
    };

    const getPostTypeIcon = (type) => {
        switch (type) {
            case 'review': return '⭐';
            case 'tip': return '💡';
            case 'question': return '❓';
            default: return '📝';
        }
    };

    return (
        <Card className="mb-4">
            <CardHeader className="pb-3">
                <div className="flex items-start space-x-3">
                    <Avatar>
                        <AvatarImage src={post.author.avatar} alt={post.author.name} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">{post.author.name}</h4>
                            <Badge variant="secondary" className="text-xs">
                                {getPostTypeIcon(post.type)} {post.type}
                            </Badge>
                            {post.destination && (
                                <Badge variant="outline" className="text-xs">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {post.destination}
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm text-gray-500">{post.timeAgo}</p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                <p className="mb-4">{post.content}</p>

                {post.images && post.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {post.images.slice(0, 4).map((image, index) => (
                            <div key={index} className="aspect-square bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg"></div>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex space-x-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLike}
                            className={liked ? 'text-red-500' : ''}
                        >
                            <Heart className={`w-4 h-4 mr-1 ${liked ? 'fill-current' : ''}`} />
                            {post.likes + (liked ? 1 : 0)}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowComments(!showComments)}
                        >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {post.comments.length}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onShare?.(post.id)}>
                            <Share2 className="w-4 h-4 mr-1" />
                            Share
                        </Button>
                    </div>
                </div>

                {showComments && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                        {post.comments.map((comment, index) => (
                            <div key={index} className="flex space-x-2">
                                <Avatar className="w-6 h-6">
                                    <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                                    <AvatarFallback className="text-xs">{comment.author.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="text-sm">
                                        <span className="font-medium">{comment.author.name}</span> {comment.text}
                                    </p>
                                    <p className="text-xs text-gray-500">{comment.timeAgo}</p>
                                </div>
                            </div>
                        ))}

                        <div className="flex space-x-2">
                            <Input
                                placeholder="Write a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="flex-1"
                            />
                            <Button size="sm" onClick={handleComment}>
                                Post
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

// Trending Topics Component
const TrendingTopics = () => {
    const trendingTopics = [
        { name: '#PetraAtNight', posts: 234 },
        { name: '#WadiRumStars', posts: 189 },
        { name: '#AmmanEats', posts: 167 },
        { name: '#DeadSeaFloat', posts: 143 },
        { name: '#JerashFestival', posts: 98 },
        { name: '#AqabaDiving', posts: 87 }
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Trending Topics</CardTitle>
                <CardDescription>Popular discussions right now</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {trendingTopics.map((topic, index) => (
                        <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <span className="font-medium text-blue-600">{topic.name}</span>
                            <span className="text-sm text-gray-500">{topic.posts} posts</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

// Active Travelers Component
const ActiveTravelers = () => {
    const activeTravelers = [
        { id: 1, name: 'Sarah Al-Mansouri', avatar: '/api/placeholder/40/40', status: 'In Petra', badge: 'Explorer' },
        { id: 2, name: 'Omar Khalil', avatar: '/api/placeholder/40/40', status: 'Planning Wadi Rum', badge: 'Adventure Seeker' },
        { id: 3, name: 'Layla Hassan', avatar: '/api/placeholder/40/40', status: 'At Dead Sea', badge: 'Photographer' },
        { id: 4, name: 'Kareem Abu-Zeid', avatar: '/api/placeholder/40/40', status: 'In Amman', badge: 'Local Guide' },
        { id: 5, name: 'Nour Abdallah', avatar: '/api/placeholder/40/40', status: 'Exploring Jerash', badge: 'Culture Enthusiast' }
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Active Travelers</CardTitle>
                <CardDescription>Connect with fellow explorers</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {activeTravelers.map((traveler) => (
                        <div key={traveler.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src={traveler.avatar} alt={traveler.name} />
                                    <AvatarFallback>{traveler.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-sm">{traveler.name}</p>
                                    <p className="text-xs text-gray-500">{traveler.status}</p>
                                    <Badge variant="outline" className="text-xs mt-1">
                                        {traveler.badge}
                                    </Badge>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">
                                Connect
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

// Main CommunityHub Component
const CommunityHub = () => {
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: { name: 'Ahmad Al-Zahra', avatar: '/api/placeholder/40/40' },
            type: 'review',
            destination: 'Petra',
            content: 'Just finished the night tour at Petra! The Treasury illuminated by candlelight is absolutely breathtaking. Highly recommend booking this experience if you\'re visiting. The walk through the Siq in darkness adds so much mystery to the experience.',
            timeAgo: '2 hours ago',
            likes: 24,
            comments: [
                { author: { name: 'Layla Hassan', avatar: '/api/placeholder/30/30' }, text: 'Amazing photos! How long does the night tour take?', timeAgo: '1 hour ago' },
                { author: { name: 'Omar Khalil', avatar: '/api/placeholder/30/30' }, text: 'Added to my wishlist! Thanks for sharing', timeAgo: '45 minutes ago' }
            ],
            images: ['/api/placeholder/300/200']
        },
        {
            id: 2,
            author: { name: 'Sarah Al-Mansouri', avatar: '/api/placeholder/40/40' },
            type: 'tip',
            destination: 'Wadi Rum',
            content: 'Pro tip for Wadi Rum: Book your desert camp stay during the new moon phase for the best stargazing experience! The Milky Way visibility is incredible. Also, bring warm clothes - desert nights get surprisingly cold even in summer.',
            timeAgo: '5 hours ago',
            likes: 18,
            comments: [
                { author: { name: 'Kareem Abu-Zeid', avatar: '/api/placeholder/30/30' }, text: 'Great advice! The temperature drop is real', timeAgo: '3 hours ago' }
            ],
            images: []
        },
        {
            id: 3,
            author: { name: 'Omar Khalil', avatar: '/api/placeholder/40/40' },
            type: 'question',
            destination: 'Amman',
            content: 'Planning to visit Amman next week. What are the must-try local dishes? Looking for authentic experiences beyond the touristy restaurants. Any hidden gems you\'d recommend?',
            timeAgo: '8 hours ago',
            likes: 12,
            comments: [
                { author: { name: 'Nour Abdallah', avatar: '/api/placeholder/30/30' }, text: 'Try Hashem Restaurant for the best falafel and hummus!', timeAgo: '6 hours ago' },
                { author: { name: 'Ahmad Al-Zahra', avatar: '/api/placeholder/30/30' }, text: 'Rainbow Street has great local eateries', timeAgo: '4 hours ago' }
            ],
            images: []
        }
    ]);

    const [loading, setLoading] = useState(false);

    const handlePostCreated = (newPost) => {
        const post = {
            ...newPost,
            id: posts.length + 1,
            author: { name: 'You', avatar: '/api/placeholder/40/40' },
            timeAgo: 'just now',
            likes: 0,
            comments: [],
            images: []
        };
        setPosts([post, ...posts]);
    };

    const handleLike = (postId, isLiked) => {
        setPosts(posts.map(post =>
            post.id === postId
                ? { ...post, likes: post.likes + (isLiked ? 1 : -1) }
                : post
        ));
    };

    const handleComment = (postId, comment) => {
        setPosts(posts.map(post =>
            post.id === postId
                ? {
                    ...post,
                    comments: [...post.comments, {
                        author: { name: 'You', avatar: '/api/placeholder/30/30' },
                        text: comment,
                        timeAgo: 'just now'
                    }]
                }
                : post
        ));
    };

    const handleShare = (postId) => {
        // TODO: Implement share functionality
        console.log('Sharing post:', postId);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Community Hub</h1>
                <p className="text-gray-600">Connect with fellow travelers and share your Jordan experiences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <CreatePost onPostCreated={handlePostCreated} />

                    <Tabs defaultValue="feed" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="feed">All Posts</TabsTrigger>
                            <TabsTrigger value="reviews">Reviews</TabsTrigger>
                            <TabsTrigger value="tips">Tips</TabsTrigger>
                            <TabsTrigger value="questions">Questions</TabsTrigger>
                        </TabsList>

                        <TabsContent value="feed" className="space-y-4 mt-6">
                            {posts.map((post) => (
                                <CommunityPost
                                    key={post.id}
                                    post={post}
                                    onLike={handleLike}
                                    onComment={handleComment}
                                    onShare={handleShare}
                                />
                            ))}
                        </TabsContent>

                        <TabsContent value="reviews" className="space-y-4 mt-6">
                            {posts.filter(post => post.type === 'review').map((post) => (
                                <CommunityPost
                                    key={post.id}
                                    post={post}
                                    onLike={handleLike}
                                    onComment={handleComment}
                                    onShare={handleShare}
                                />
                            ))}
                        </TabsContent>

                        <TabsContent value="tips" className="space-y-4 mt-6">
                            {posts.filter(post => post.type === 'tip').map((post) => (
                                <CommunityPost
                                    key={post.id}
                                    post={post}
                                    onLike={handleLike}
                                    onComment={handleComment}
                                    onShare={handleShare}
                                />
                            ))}
                        </TabsContent>

                        <TabsContent value="questions" className="space-y-4 mt-6">
                            {posts.filter(post => post.type === 'question').map((post) => (
                                <CommunityPost
                                    key={post.id}
                                    post={post}
                                    onLike={handleLike}
                                    onComment={handleComment}
                                    onShare={handleShare}
                                />
                            ))}
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <TrendingTopics />
                    <ActiveTravelers />

                    {/* Community Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Community Stats</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-blue-600">1,234</div>
                                    <div className="text-sm text-gray-600">Active Members</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-green-600">567</div>
                                    <div className="text-sm text-gray-600">Posts This Week</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-purple-600">89</div>
                                    <div className="text-sm text-gray-600">Destinations Covered</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-orange-600">2.3k</div>
                                    <div className="text-sm text-gray-600">Photos Shared</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CommunityHub;
