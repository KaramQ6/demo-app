import React, { useEffect } from 'react';

const VoiceAgentPage = () => {
    useEffect(() => {
        // Create and append the ElevenLabs script to the document body
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
        script.async = true;
        script.type = 'text/javascript';

        document.body.appendChild(script);

        // Cleanup function to remove the script when component unmounts
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <div className="relative min-h-screen">
            <div
                style={{
                    width: '100vw',
                    height: '100vh',
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <elevenlabs-convai
                    agent-id="agent_6101k289zfvxezxs06pnc7jz01pv"
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                ></elevenlabs-convai>
            </div>

            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20 pointer-events-none" />
            <div className="absolute top-40 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-40 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
    );
};

export default VoiceAgentPage;
