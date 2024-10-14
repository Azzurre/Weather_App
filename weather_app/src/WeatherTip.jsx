// WeatherTip.jsx
import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import {
    FaUmbrella,
    FaSun,
    FaCloudRain,
    FaSnowflake,
    FaWind,
    FaSmog,
    FaCloud,
    FaPooStorm,
    FaTemperatureLow,
    FaTemperatureHigh,
} from 'react-icons/fa';
import './WeatherTip.css';


const WeatherTip = ({ weatherData, airQualityData, onClose }) => {
    const [tip, setTip] = useState({ text: '', icon: null });

    useEffect(() => {
        const getWeatherTip = () => {
            if (!weatherData) return { text: '', icon: null };

            const description = weatherData.weather[0].main.toLowerCase();
            const temp = weatherData.main.temp;
            const aqi = airQualityData?.list[0]?.main?.aqi;
            const windSpeed = weatherData.wind.speed;

            // Air Quality Tips
            if (aqi >= 4) {
                return {
                    text: 'The air quality is poor today. Consider limiting outdoor activities.',
                    icon: <FaSmog />,
                };
            }

            // Temperature Tips
            if (temp >= 30) {
                return {
                    text: "It's quite hot outside. Stay hydrated and wear sunscreen!",
                    icon: <FaTemperatureHigh />,
                };
            }
            if (temp <= 5) {
                return {
                    text: "It's cold outside. Wear warm clothing.",
                    icon: <FaTemperatureLow />,
                };
            }

            // Weather Condition Tips
            if (description.includes('rain')) {
                return {
                    text: "Don't forget to carry an umbrella today.",
                    icon: <FaUmbrella />,
                };
            }
            if (description.includes('snow')) {
                return {
                    text: "It's snowing! Wear warm clothes and be cautious on the roads.",
                    icon: <FaSnowflake />,
                };
            }
            if (description.includes('clear')) {
                return {
                    text: "It's a clear day. Enjoy the sunshine!",
                    icon: <FaSun />,
                };
            }
            if (description.includes('cloud')) {
                return {
                    text: "It's cloudy today. A perfect day for indoor activities.",
                    icon: <FaCloud />,
                };
            }
            if (description.includes('thunderstorm')) {
                return {
                    text: 'Thunderstorms expected. Stay indoors if possible.',
                    icon: <FaPooStorm />,
                };
            }
            if (windSpeed > 15) {
                return {
                    text: "It's quite windy outside. Secure loose items and wear a windbreaker.",
                    icon: <FaWind />,
                };
            }

            // Default Tip
            return { text: 'Have a great day!', icon: null };
        };

        const tipResult = getWeatherTip();
        setTip(tipResult);
    }, [weatherData, airQualityData]);

    if (!tip.text) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button
                    className="close-button"
                    onClick={() => {
                        console.log('Close button clicked');

                        onClose();
                    }}
                >
                    <FaTimes />
                </button>

                <h3>Tip of the Day</h3>
                <p>
                    {tip.icon && <span className="tip-icon">{tip.icon}</span>}
                    {tip.text}
                </p>
            </div>
        </div>
    );
};

export default WeatherTip;
