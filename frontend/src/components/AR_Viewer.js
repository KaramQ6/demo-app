import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import {
    Camera,
    Scan,
    MapPin,
    Info,
    X,
    Play,
    Pause,
    RotateCcw,
    Eye,
    Smartphone,
    Zap,
    Target,
    Star
} from 'lucide-react';

const AR_Viewer = () => {
    const [isARActive, setIsARActive] = useState(false);
    const [hasCamera, setHasCamera] = useState(false);
    const [cameraStream, setCameraStream] = useState(null);
    const [detectedMarkers, setDetectedMarkers] = useState([]);
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // Mock AR destinations data
    const arDestinations = [
        {
            id: 'petra-treasury',
            name: 'The Treasury (Al-Khazneh)',
            location: 'Petra, Jordan',
            description: 'The most iconic monument in Petra, carved directly into sandstone cliff face.',
            historicalPeriod: '1st century BC - 1st century AD',
            height: '40 meters',
            significance: 'Nabataean tomb and temple',
            virtualContent: {
                type: '3D Model',
                interactivePoints: ['Entrance', 'Columns', 'Urn', 'Facade Details'],
                audioGuide: 'Available in 5 languages'
            },
            arMarkerColor: '#ff6b6b'
        },
        {
            id: 'wadi-rum-bridge',
            name: 'Natural Rock Bridge',
            location: 'Wadi Rum, Jordan',
            description: 'A stunning natural sandstone arch formed over millions of years.',
            geologicalAge: '540 million years',
            height: '15 meters',
            width: '45 meters',
            significance: 'Geological wonder and climbing destination',
            virtualContent: {
                type: 'Interactive Scene',
                interactivePoints: ['Climbing Routes', 'Geological Layers', 'Wildlife Spotting'],
                audioGuide: 'Geological formation story'
            },
            arMarkerColor: '#4ecdc4'
        },
        {
            id: 'jerash-temple',
            name: 'Temple of Artemis',
            location: 'Jerash, Jordan',
            description: 'One of the best-preserved Roman temples in the Middle East.',
            historicalPeriod: '150-170 AD',
            height: '20 meters',
            columns: '12 Corinthian columns',
            significance: 'Dedicated to the goddess Artemis',
            virtualContent: {
                type: 'Historical Reconstruction',
                interactivePoints: ['Original Appearance', 'Ritual Areas', 'Architectural Details'],
                audioGuide: 'Roman religious practices'
            },
            arMarkerColor: '#45b7d1'
        }
    ];

    // Initialize camera
    const initializeCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Use back camera
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            });

            setCameraStream(stream);
            setHasCamera(true);

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCamera(false);
        }
    };

    // Stop camera
    const stopCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
        setHasCamera(false);
        setIsARActive(false);
    };

    // Start AR scanning
    const startARExperience = async () => {
        setIsARActive(true);
        setIsScanning(true);
        await initializeCamera();

        // Simulate AR marker detection after a delay
        setTimeout(() => {
            simulateMarkerDetection();
            setIsScanning(false);
        }, 3000);
    };

    // Simulate AR marker detection (since we don't have actual AR library)
    const simulateMarkerDetection = () => {
        const mockDetections = [
            {
                id: 'marker-1',
                destination: arDestinations[0],
                position: { x: 0.3, y: 0.4 },
                confidence: 0.95
            },
            {
                id: 'marker-2',
                destination: arDestinations[1],
                position: { x: 0.7, y: 0.6 },
                confidence: 0.87
            }
        ];

        setDetectedMarkers(mockDetections);
    };

    // Handle marker click
    const handleMarkerClick = (marker) => {
        setSelectedDestination(marker.destination);
    };

    // AR overlay rendering
    const renderAROverlays = () => {
        if (!isARActive || detectedMarkers.length === 0) return null;

        return (
            <div className="absolute inset-0 pointer-events-none">
                {detectedMarkers.map((marker) => (
                    <div
                        key={marker.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
                        style={{
                            left: `${marker.position.x * 100}%`,
                            top: `${marker.position.y * 100}%`
                        }}
                        onClick={() => handleMarkerClick(marker)}
                    >
                        {/* AR Marker Indicator */}
                        <div className="relative">
                            <div
                                className="w-6 h-6 rounded-full border-4 border-white shadow-lg animate-pulse"
                                style={{ backgroundColor: marker.destination.arMarkerColor }}
                            />
                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                <Eye className="w-2 h-2 text-gray-600" />
                            </div>

                            {/* Information popup */}
                            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-md rounded-lg p-3 shadow-lg min-w-48">
                                <h4 className="font-semibold text-sm text-gray-800">{marker.destination.name}</h4>
                                <p className="text-xs text-gray-600 mb-2">{marker.destination.location}</p>
                                <div className="flex items-center space-x-2">
                                    <Badge variant="secondary" className="text-xs">
                                        AR Content Available
                                    </Badge>
                                    <div className="text-xs text-green-600 font-medium">
                                        {Math.round(marker.confidence * 100)}% match
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    useEffect(() => {
        return () => {
            stopCamera(); // Cleanup on unmount
        };
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                        <Scan className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">AR Explorer</h1>
                        <p className="text-gray-600">Discover Jordan's wonders through Augmented Reality</p>
                    </div>
                </div>

                <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                        <Camera className="w-4 h-4 text-blue-500" />
                        <span>Camera-based AR</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Target className="w-4 h-4 text-green-500" />
                        <span>Real-time detection</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span>Interactive content</span>
                    </div>
                </div>
            </div>

            {!isARActive ? (
                /* AR Introduction & Start */
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Experience Jordan in Augmented Reality</CardTitle>
                            <CardDescription>
                                Point your camera at Jordan's landmarks to unlock interactive historical content, 3D models, and immersive experiences.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                {arDestinations.map((destination) => (
                                    <Card key={destination.id} className="border-2 hover:border-purple-300 transition-colors">
                                        <CardContent className="p-4">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <div
                                                    className="w-4 h-4 rounded-full"
                                                    style={{ backgroundColor: destination.arMarkerColor }}
                                                />
                                                <h3 className="font-semibold">{destination.name}</h3>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3">{destination.description}</p>
                                            <div className="space-y-1 text-xs">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Content Type:</span>
                                                    <span className="font-medium">{destination.virtualContent.type}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Interactive Points:</span>
                                                    <span className="font-medium">{destination.virtualContent.interactivePoints.length}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <Alert className="mb-6">
                                <Smartphone className="h-4 w-4" />
                                <AlertDescription>
                                    <strong>How to use AR Explorer:</strong>
                                    <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                                        <li>Allow camera access when prompted</li>
                                        <li>Point your camera at Jordan landmarks or AR markers</li>
                                        <li>Wait for the system to detect and highlight points of interest</li>
                                        <li>Tap on detected markers to explore interactive content</li>
                                    </ol>
                                </AlertDescription>
                            </Alert>

                            <Button
                                onClick={startARExperience}
                                className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                size="lg"
                            >
                                <Camera className="w-5 h-5 mr-2" />
                                Start AR Experience
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                /* AR Camera View */
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Badge variant={isScanning ? "default" : "secondary"} className="flex items-center space-x-1">
                                {isScanning ? (
                                    <>
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                        <span>Scanning...</span>
                                    </>
                                ) : (
                                    <>
                                        <Eye className="w-3 h-3" />
                                        <span>{detectedMarkers.length} markers detected</span>
                                    </>
                                )}
                            </Badge>
                        </div>

                        <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={simulateMarkerDetection}>
                                <RotateCcw className="w-4 h-4 mr-1" />
                                Re-scan
                            </Button>
                            <Button variant="outline" size="sm" onClick={stopCamera}>
                                <X className="w-4 h-4 mr-1" />
                                Exit AR
                            </Button>
                        </div>
                    </div>

                    {/* AR Camera View */}
                    <Card className="relative overflow-hidden">
                        <div className="relative w-full h-96 bg-gradient-to-br from-gray-800 via-blue-900 to-purple-900">
                            {hasCamera ? (
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white">
                                    <div className="text-center">
                                        <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg mb-2">Camera View</p>
                                        <p className="text-sm opacity-75">Demo AR experience with simulated markers</p>
                                    </div>
                                </div>
                            )}

                            {/* AR Overlays */}
                            {renderAROverlays()}

                            {/* Scanning Animation */}
                            {isScanning && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <div className="text-white text-center">
                                        <div className="w-24 h-24 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-lg font-semibold">Analyzing environment...</p>
                                        <p className="text-sm opacity-75">Looking for AR markers and landmarks</p>
                                    </div>
                                </div>
                            )}

                            {/* Camera controls overlay */}
                            <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-4">
                                <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
                                    <Target className="w-4 h-4 mr-1" />
                                    Focus
                                </Button>
                                <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
                                    <Info className="w-4 h-4 mr-1" />
                                    Help
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Detected Content Panel */}
                    {selectedDestination && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center space-x-2">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: selectedDestination.arMarkerColor }}
                                        />
                                        <span>{selectedDestination.name}</span>
                                    </CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedDestination(null)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                                <CardDescription>{selectedDestination.location}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 mb-4">{selectedDestination.description}</p>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    {selectedDestination.historicalPeriod && (
                                        <div>
                                            <span className="text-sm text-gray-500">Historical Period:</span>
                                            <p className="font-semibold">{selectedDestination.historicalPeriod}</p>
                                        </div>
                                    )}
                                    {selectedDestination.height && (
                                        <div>
                                            <span className="text-sm text-gray-500">Height:</span>
                                            <p className="font-semibold">{selectedDestination.height}</p>
                                        </div>
                                    )}
                                    {selectedDestination.geologicalAge && (
                                        <div>
                                            <span className="text-sm text-gray-500">Geological Age:</span>
                                            <p className="font-semibold">{selectedDestination.geologicalAge}</p>
                                        </div>
                                    )}
                                    {selectedDestination.significance && (
                                        <div>
                                            <span className="text-sm text-gray-500">Significance:</span>
                                            <p className="font-semibold">{selectedDestination.significance}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t pt-4">
                                    <h4 className="font-semibold mb-2">Interactive AR Content:</h4>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {selectedDestination.virtualContent.interactivePoints.map((point, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                                {point}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                                            <Play className="w-4 h-4 mr-1" />
                                            Start AR Tour
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Star className="w-4 h-4 mr-1" />
                                            Add to Favorites
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
};

export default AR_Viewer;
