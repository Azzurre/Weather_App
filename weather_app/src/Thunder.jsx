import React, { useEffect, useState } from "react";
import "./Thunder.css"; // Thunder-specific CSS

const Thunder = () => {
    const [thunderVisible, setThunderVisible] = useState(false);

    useEffect(() => {
        const thunderInterval = setInterval(() => {
            // Randomly show thunder
            if (Math.random() < 0.1) { // 10% chance of thunder
                setThunderVisible(true);
                setTimeout(() => setThunderVisible(false), 300); // Hide after 300ms
            }
        }, 2000); // Check every 2 seconds

        return () => clearInterval(thunderInterval); // Cleanup on unmount
    }, []);

    return (
        <div className={`thunder ${thunderVisible ? "active" : ""}`}>
            {/* Thunder effect can be visually represented using CSS */}
        </div>
    );
};

export default Thunder;
