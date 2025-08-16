import React from 'react';

// Using a static, high-resolution image of the Earth.
const globeImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg';

const RotatingGlobe: React.FC = () => {
    return (
        <>
            <style>{`
                @keyframes slow-rotate {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                .globe-image-container {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 95vmax;
                    height: 95vmax;
                    max-width: 1200px;
                    max-height: 1200px;
                    pointer-events: none;
                    opacity: 0.4; /* Dark mode opacity */
                    transition: opacity 0.5s ease-in-out;
                }
                
                html.light .globe-image-container {
                    opacity: 0.4; /* Light mode opacity */
                    filter: grayscale(10%) brightness(120%) contrast(100%);
                }

                .globe-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 50%;
                    animation: slow-rotate 360s linear infinite;
                }
            `}</style>
            <div className="globe-image-container">
                <img src={globeImageUrl} alt="Rotating Earth" className="globe-image" />
            </div>
        </>
    );
};

export default RotatingGlobe;