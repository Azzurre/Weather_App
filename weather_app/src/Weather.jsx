import React, { useState, useEffect } from "react";
import axios from "axios";
import './Weather.css';
import Clouds from "./Cloud";
import Mist from "./Mist";
import Thunder from "./Thunder";

const Weather = () => {
    // State variables
    const [weatherData, setWeatherData] = useState(null);
    const [airQualityData, setAirQualityData] = useState(null);
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [city, setCity] = useState(""); // Store user input
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [typingTimeout, setTypingTimeout] = useState(0); // For debouncing

    // Event handler for city input change
    const handleCityChange = (e) => {
        const value = e.target.value;
        setCity(value);
        if (value.length > 2) {
            // Debounce fetching city suggestions
            clearTimeout(typingTimeout);
            const timeout = setTimeout(() => {
                fetchCitySuggestions(value);
            }, 300);
            setTypingTimeout(timeout);
        } else {
            setCitySuggestions([]);
        }
        if (error) setError(null);
    };

    // Event handler for selecting a city from suggestions
    const handleCitySelect = (suggestion) => {
        setCity(`${suggestion.name}, ${suggestion.country}`);
        setCitySuggestions([]); // Clear the suggestions after selection
        fetchWeatherByCoordinates(suggestion.lat, suggestion.lon); // Fetch weather using coordinates
    };

    // Event handler for Enter key press
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            if (citySuggestions.length > 0) {
                const firstSuggestion = citySuggestions[0];
                handleCitySelect(firstSuggestion);
            } else {
                fetchWeatherByCity(city);
            }
            setCitySuggestions([]);
        }
    };

    const getAQIDescription = (aqi) => {
        switch (aqi) {
            case 1:
                return "Good";
            case 2:
                return "Fair";
            case 3:
                return "Moderate";
            case 4:
                return "Poor";
            case 5:
                return "Very Poor";
            default:
                return "Unknown";
        }
    };

    const getAQIColor = (aqi) => {
        switch (aqi) {
            case 1:
                return "green";
            case 2:
                return "yellow";
            case 3:
                return "orange";
            case 4:
                return "red";
            case 5:
                return "purple";
            default:
                return "gray";
        }
    };




    // Fetch city suggestions based on user input
    const fetchCitySuggestions = async (cityName) => {
        try {
            const apiKey = "c4c2a91410c7352c9ffda3604c38aac4"; // Replace with your OpenWeatherMap API key
            const response = await axios.get(
                `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`
            );
            setCitySuggestions(response.data);
        } catch (error) {
            setError("Error fetching city suggestions.");
        }
    };

    // Fetch weather data by city name
    const fetchWeatherByCity = async (cityName) => {
        try {
            const apiKey = "c4c2a91410c7352c9ffda3604c38aac4"; // Replace with your OpenWeatherMap API key
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
            );
            setWeatherData(response.data);
            setLoading(false);
            setError(null); // Reset error on success
        } catch (error) {
            setError("City not found. Please try again.");
            setWeatherData(null);
            setLoading(false);

            // Fetch air quality data
            fetchAirQuality(lat, lon);
        }
    };

    const fetchAirQuality = async (lat, lon) => {
        try {
            const apiKey = "c4c2a91410c7352c9ffda3604c38aac4"; // Replace with your OpenWeatherMap API key
            const response = await axios.get(
                `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
            );
            setAirQualityData(response.data);
            setLoading(false);
            setError(null); // Reset error on success
        } catch (error) {
            setError("Error fetching air quality data.");
            setAirQualityData(null);
            setLoading(false);
        }
    };

    // Fetch weather data by coordinates
    const fetchWeatherByCoordinates = async (lat, lon) => {
        try {
            const apiKey = "c4c2a91410c7352c9ffda3604c38aac4"; // Replace with your OpenWeatherMap API key
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
            );
            setWeatherData(response.data);
            setLoading(false);
            setError(null);


            // Fetch air quality data
            fetchAirQuality(lat, lon);
        } catch (error) {
            setError("Unable to fetch weather data.");
            setLoading(false);
            setWeatherData(null);
        }
    };

    // useEffect to fetch weather data based on geolocation on component mount
    useEffect(() => {
        const success = (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherByCoordinates(lat, lon);
        };

        const errorCallback = () => {
            setError("Unable to retrieve your location.");
            setLoading(false);
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, errorCallback);
        } else {
            setError("Geolocation is not supported by your browser.");
            setLoading(false);
        }
    }, []); // Empty dependency array to run only once on mount

    // useEffect to fetch city suggestions when user types
    useEffect(() => {
        return () => clearTimeout(typingTimeout); // Cleanup on unmount
    }, [typingTimeout]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="app-container">
            {/* Render weather animations based on conditions */}
            {weatherData && weatherData.weather[0].main.includes('Cloud') && <Clouds />}
            {weatherData && weatherData.weather[0].main.includes('Mist') && <Mist />}
            {weatherData && weatherData.weather[0].main.includes('Thunder') && <Thunder />}

            <div className="weather-container">
                <h1>Weather App</h1>

                {/* Input field and dropdown */}
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Enter city"
                        value={city}
                        onChange={handleCityChange}
                        onKeyDown={handleKeyDown}
                    />

                    {/* Display city suggestions */}
                    {citySuggestions.length > 0 && (
                        <ul className="city-suggestions show">
                            {citySuggestions.map((suggestion, index) => (
                                <li key={index} onClick={() => handleCitySelect(suggestion)}>
                                    {suggestion.name}, {suggestion.state && `${suggestion.state}, `}{suggestion.country}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Display error if any */}
                {error && <p className="error">{error}</p>}

                {/* Display weather data */}
                {weatherData && (
                    <div className="weather-info">
                        <h2>Weather in {weatherData.name}</h2>
                        {weatherData.sys && (
                            <img
                                src={`https://flagcdn.com/160x120/${weatherData.sys.country.toLowerCase()}.webp`}
                                alt={`Flag of ${weatherData.sys.country}`}
                                style={{ width: '50px', height: 'auto' }}
                            />
                        )}
                        <img
                            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                            alt={weatherData.weather[0].description}
                        />
                        <p>Temperature: {weatherData.main.temp}°C</p>
                        <p>Condition: {weatherData.weather[0].description}</p>
                    </div>
                )}
                {airQualityData && (
                    <div className="air-quality-info">
                        <h3>Air Quality Index</h3>
                        <p style={{ color: getAQIColor(airQualityData.list[0].main.aqi) }}>
                            AQI Level: {airQualityData.list[0].main.aqi} - {getAQIDescription(airQualityData.list[0].main.aqi)}
                        </p>

                        {/* Optionally display pollutant concentrations */}
                        <div className="air-quality-details">
                            <h4>Pollutant Concentrations (μg/m³):</h4>
                            <p>CO: {airQualityData.list[0].components.co}</p>
                            <p>NO: {airQualityData.list[0].components.no}</p>
                            <p>NO₂: {airQualityData.list[0].components.no2}</p>
                            <p>O₃: {airQualityData.list[0].components.o3}</p>
                            <p>SO₂: {airQualityData.list[0].components.so2}</p>
                            <p>PM2.5: {airQualityData.list[0].components.pm2_5}</p>
                            <p>PM10: {airQualityData.list[0].components.pm10}</p>
                            <p>NH₃: {airQualityData.list[0].components.nh3}</p>
                        </div>
                    </div>
                )}

                {/* Additional weather animations based on conditions */}
                {weatherData && weatherData.weather[0].description.includes("rain") && (
                    <div className="rain-container light-rain">
                        {/* Light rain animation */}
                        <div className="rain"></div>
                        <div className="rain"></div>
                        <div className="rain"></div>
                    </div>
                )}

                {weatherData && weatherData.weather[0].description.includes("moderate rain") && (
                    <div className="rain-container moderate-rain">
                        {/* Moderate rain animation */}
                        <div className="rain"></div>
                        <div className="rain"></div>
                        <div className="rain"></div>
                        <div className="rain"></div>
                        <div className="rain"></div>
                    </div>
                )}

                {weatherData && weatherData.weather[0].description.includes("heavy intensity rain") && (
                    <div className="rain-container heavy-rain">
                        {/* Heavy rain animation */}
                        {[...Array(20)].map((_, i) => (
                            <div className="rain" key={i}></div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Weather;
