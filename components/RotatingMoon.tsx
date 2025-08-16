import React from 'react';

// Using a high-resolution static image of the moon, similar to the one provided.
const moonImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/6/61/LunarMonth.gif';

const RotatingMoon: React.FC = () => {
    return (
        <>
            <style>{`
                @keyframes slow-rotate-moon {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                .moon-image-container {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 90vmax;
                    height: 90vmax;
                    max-width: 1100px;
                    max-height: 1100px;
                    pointer-events: none;
                    opacity: 0.9;
                    transition: opacity 0.5s ease-in-out;
                    mix-blend-mode: screen; /* This will make the black background of the image transparent */
                }
                
                html.light .moon-image-container {
                    opacity: 0.9;
                }
                
                .moon-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 50%;
                    animation: slow-rotate-moon 360s linear infinite;
                }
            `}</style>
            <div className="moon-image-container">
                <img src={moonImageUrl} alt="Rotating Moon" className="moon-image" />
            </div>
        </>
    );
};

export default RotatingMoon;