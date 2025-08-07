import React, { useState, useRef, useEffect } from 'react';

const AR_Viewer = () => {
    const [isARActive, setIsARActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [detectedMarkers, setDetectedMarkers] = useState([]);
    const [selectedDestination, setSelectedDestination] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const arContainerRef = useRef(null);

    // Simulated AR marker data for Jordan destinations
    const arMarkers = [
        {
            id: 'petra-treasury',
            name: 'Petra Treasury',
            description: 'The iconic facade carved into rose-red stone',
            position: { x: 50, y: 30 },
            info: {
                built: '1st century BC',
                height: '43 meters',
                significance: 'Nabataean architectural masterpiece',
                funFact: 'Used in Indiana Jones filming'
            },
            color: '#e74c3c'
        },
        {
            id: 'wadi-rum-bridge',
            name: 'Wadi Rum Natural Bridge',
            description: 'Stunning sandstone arch formation',
            position: { x: 70, y: 60 },
            info: {
                height: '25 meters',
                age: 'Over 2 million years old',
                significance: 'Geological wonder of Jordan',
                funFact: 'Featured in Lawrence of Arabia'
            },
            color: '#f39c12'
        },
        {
            id: 'jerash-temple',
            name: 'Temple of Artemis',
            description: 'Ancient Roman temple ruins',
            position: { x: 30, y: 45 },
            info: {
                built: '150-170 AD',
                height: 'Originally 15 meters',
                significance: 'One of Jordan\'s best preserved Roman sites',
                funFact: 'Columns still stand after 1,800 years'
            },
            color: '#3498db'
        }
    ];

    // Initialize camera for AR view
    const initializeCamera = async () => {
        setIsLoading(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Use back camera for AR
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                setIsARActive(true);

                // Simulate marker detection after a short delay
                setTimeout(() => {
                    simulateMarkerDetection();
                }, 2000);
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Unable to access camera. Please ensure camera permissions are granted.');
        } finally {
            setIsLoading(false);
        }
    };

    // Simulate AR marker detection (in real implementation, this would use actual AR library)
    const simulateMarkerDetection = () => {
        // Randomly show 1-3 markers as "detected"
        const numMarkers = Math.floor(Math.random() * 3) + 1;
        const shuffled = [...arMarkers].sort(() => 0.5 - Math.random());
        const detected = shuffled.slice(0, numMarkers);
        setDetectedMarkers(detected);
    };

    // Stop AR session
    const stopAR = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsARActive(false);
        setDetectedMarkers([]);
        setSelectedDestination(null);
    };

    // Handle marker click for detailed info
    const handleMarkerClick = (marker) => {
        setSelectedDestination(marker);
    };

    // Simulate AR overlay rendering
    useEffect(() => {
        if (isARActive && canvasRef.current && videoRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            const drawOverlay = () => {
                if (!isARActive) return;

                // Clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Draw AR markers
                detectedMarkers.forEach(marker => {
                    const x = (marker.position.x / 100) * canvas.width;
                    const y = (marker.position.y / 100) * canvas.height;

                    // Draw marker circle
                    ctx.beginPath();
                    ctx.arc(x, y, 20, 0, 2 * Math.PI);
                    ctx.fillStyle = marker.color + '80'; // Semi-transparent
                    ctx.fill();
                    ctx.strokeStyle = marker.color;
                    ctx.lineWidth = 3;
                    ctx.stroke();

                    // Draw marker label
                    ctx.fillStyle = marker.color;
                    ctx.font = 'bold 14px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(marker.name, x, y - 30);

                    // Draw connecting line to info
                    ctx.beginPath();
                    ctx.moveTo(x, y - 20);
                    ctx.lineTo(x, y - 50);
                    ctx.strokeStyle = marker.color;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                });

                requestAnimationFrame(drawOverlay);
            };

            drawOverlay();
        }
    }, [isARActive, detectedMarkers]);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">AR Destination Viewer</h2>
                        <p className="opacity-90">Discover Jordan's landmarks through Augmented Reality</p>
                    </div>
                    <div className="text-4xl">🏛️</div>
                </div>
            </div>

            {/* AR View Container */}
            <div className="relative">
                {!isARActive ? (
                    // AR Start Screen
                    <div className="h-96 flex items-center justify-center bg-gray-100">
                        <div className="text-center">
                            <div className="text-6xl mb-4">📱</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Start AR Experience</h3>
                            <p className="text-gray-600 mb-6">Point your camera at Jordan landmarks to see AR information</p>
                            <button
                                onClick={initializeCamera}
                                disabled={isLoading}
                                className="bg-purple-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Starting Camera...
                                    </div>
                                ) : (
                                    'Launch AR Viewer'
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    // Active AR View
                    <div ref={arContainerRef} className="relative h-96 overflow-hidden">
                        {/* Camera Feed */}
                        <video
                            ref={videoRef}
                            className="w-full h-full object-cover"
                            autoPlay
                            playsInline
                            muted
                        />

                        {/* AR Overlay Canvas */}
                        <canvas
                            ref={canvasRef}
                            className="absolute inset-0 w-full h-full pointer-events-none"
                            width="640"
                            height="360"
                        />

                        {/* AR Markers as Clickable Overlays */}
                        {detectedMarkers.map(marker => (
                            <button
                                key={marker.id}
                                onClick={() => handleMarkerClick(marker)}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 animate-pulse hover:scale-110 transition-transform"
                                style={{
                                    left: `${marker.position.x}%`,
                                    top: `${marker.position.y}%`,
                                    borderColor: marker.color,
                                    backgroundColor: marker.color + '30'
                                }}
                            >
                                <span className="sr-only">View {marker.name}</span>
                            </button>
                        ))}

                        {/* AR Controls */}
                        <div className="absolute top-4 right-4 flex gap-2">
                            <button
                                onClick={simulateMarkerDetection}
                                className="bg-white bg-opacity-80 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition-opacity"
                                title="Rescan for markers"
                            >
                                🔍
                            </button>
                            <button
                                onClick={stopAR}
                                className="bg-red-500 bg-opacity-80 text-white p-2 rounded-full hover:bg-opacity-100 transition-opacity"
                                title="Stop AR"
                            >
                                ❌
                            </button>
                        </div>

                        {/* Detection Status */}
                        <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                                <span className="text-sm">
                                    {detectedMarkers.length} landmarks detected
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Destination Info Panel */}
            {selectedDestination && (
                <div className="p-6 bg-gray-50 border-t">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800">{selectedDestination.name}</h3>
                            <p className="text-gray-600">{selectedDestination.description}</p>
                        </div>
                        <button
                            onClick={() => setSelectedDestination(null)}
                            className="text-gray-400 hover:text-gray-600 text-xl"
                        >
                            ×
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        {Object.entries(selectedDestination.info).map(([key, value]) => (
                            <div key={key}>
                                <span className="font-medium text-gray-700 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                                </span>
                                <div className="text-gray-600">{value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 flex gap-2">
                        <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm">
                            Learn More
                        </button>
                        <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors text-sm">
                            Book Tour
                        </button>
                        <button className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors text-sm">
                            Share AR View
                        </button>
                    </div>
                </div>
            )}

            {/* AR Instructions */}
            <div className="p-6 border-t">
                <h3 className="font-semibold text-gray-800 mb-3">📱 How to Use AR Viewer</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-start">
                        <span className="text-lg mr-2">1️⃣</span>
                        <div>
                            <div className="font-medium">Launch AR</div>
                            <div>Tap "Launch AR Viewer" to start the camera</div>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <span className="text-lg mr-2">2️⃣</span>
                        <div>
                            <div className="font-medium">Point & Scan</div>
                            <div>Aim your camera at Jordan landmarks</div>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <span className="text-lg mr-2">3️⃣</span>
                        <div>
                            <div className="font-medium">Explore Info</div>
                            <div>Tap AR markers to learn fascinating details</div>
                        </div>
                    </div>
                </div>

                {/* Supported Landmarks */}
                <div className="mt-6">
                    <h4 className="font-medium text-gray-800 mb-2">🏛️ Supported Landmarks</h4>
                    <div className="flex flex-wrap gap-2">
                        {arMarkers.map(marker => (
                            <span
                                key={marker.id}
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
                                style={{ backgroundColor: marker.color + '20', color: marker.color }}
                            >
                                {marker.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Coming Soon Features */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-t">
                <h3 className="font-semibold text-gray-800 mb-3">🚀 Coming Soon</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <div className="font-medium text-blue-700">🎯 Advanced Tracking</div>
                        <div className="text-gray-600">Real-time GPS-based AR positioning</div>
                    </div>
                    <div>
                        <div className="font-medium text-purple-700">📸 AR Photo Capture</div>
                        <div className="text-gray-600">Save and share your AR discoveries</div>
                    </div>
                    <div>
                        <div className="font-medium text-green-700">🎧 Audio Guides</div>
                        <div className="text-gray-600">Interactive audio narration in AR</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AR_Viewer;
