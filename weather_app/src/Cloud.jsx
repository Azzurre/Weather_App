import React, { useState, useEffect } from "react"; // Ensure useState and useEffect are imported
import "./Clouds.css"; // Cloud-specific CSS

// Individual cloud component
const Cloud = ({ size, speed, top, left, opacity }) => (
    <div
        className="cloud"
        style={{
            width: `${size}px`,
            height: `${size / 2}px`,
            top: `${top}%`,
            left: `${left}%`,
            opacity: opacity,
            animationDuration: `${speed}s`,
        }}
    />
);

// Clouds component containing multiple random clouds
const Clouds = () => {
    const [cloudData, setCloudData] = useState([]); // State for cloud data

    // Generate clouds only once on component mount
    useEffect(() => {
        const generateCloudData = () => {
            return Array.from({ length: 5 }, () => ({
                size: Math.random() * 150 + 100,  // Random size between 100px and 250px
                speed: Math.random() * 20 + 30,   // Random speed between 30s and 50s
                top: Math.random() * 50,          // Random top position between 0% and 50%
                left: Math.random() * -100,       // Start clouds off-screen (negative left)
                opacity: Math.random() * 0.3 + 0.7 // Random opacity between 0.7 and 1
            }));
        };

        // Generate cloud data once when component mounts
        setCloudData(generateCloudData());
    }, []); // Empty dependency array ensures it only runs once

    return (
        <div className="cloud-container">
            {cloudData.map((cloud, index) => (
                <Cloud key={index} {...cloud} />
            ))}
        </div>
    );
};

export default Clouds;
