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
        <div
            style={{
                width: '100vw',
                height: '100vh',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#000'
            }}
        >
            <elevenlabs-convai
                agent-id="agent_4501k1tw42v5eac9stmjr5670gwh"
                style={{
                    width: '100%',
                    height: '100%'
                }}
            ></elevenlabs-convai>
        </div>
    );
};

export default VoiceAgentPage;
