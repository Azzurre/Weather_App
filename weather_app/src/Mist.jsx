import React, { useState, useEffect } from "react";
import "./Mist.css"; // Mist-specific CSS

const Mist = () => {
    const [mistData, setMistData] = useState([]);

    useEffect(() => {
        const generateMistData = () => {
            return Array.from({ length: 10 }, () => ({
                size: Math.random() * 100 + 50, // Random size between 50px and 150px
                top: Math.random() * 100, // Random top position (0% to 100%)
                left: Math.random() * 100, // Random left position (0% to 100%)
                opacity: Math.random() * 0.5 + 0.3, // Random opacity (0.3 to 0.8)
                animationDuration: Math.random() * 5 + 5 // Random animation duration (5s to 10s)
            }));
        };

        setMistData(generateMistData());
    }, []); // Only run once on mount

    return (
        <div className="mist-container">
            {mistData.map((mist, index) => (
                <div
                    key={index}
                    className="mist"
                    style={{
                        width: `${mist.size}px`,
                        height: `${mist.size}px`,
                        top: `${mist.top}%`,
                        left: `${mist.left}%`,
                        opacity: mist.opacity,
                        animationDuration: `${mist.animationDuration}s`
                    }}
                />
            ))}
        </div>
    );
};

export default Mist;