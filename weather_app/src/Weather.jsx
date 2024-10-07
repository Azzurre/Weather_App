import React, { useState, useEffect } from "react";
import axios from "axios";
import './Weather.css';
import Clouds from "./Cloud";
import Mist from "./Mist";

<div className="rain-container">
    <div className="rain"></div>
    <div className="rain"></div>
    <div className="rain"></div>
    <div className="rain"></div>
    <div className="rain"></div>
    <div className="rain"></div>


</div>



const Weather = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [city, setCity] = useState(""); // Store manually entered city
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [typingTimeout, setTypingTimeout] = useState(0); // For debouncing


    useEffect(() => {
        const fetchWeatherByCity = async (cityName) => {
            try {
                const apiKey = "c4c2a91410c7352c9ffda3604c38aac4"; // API
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
                );
                setWeatherData(response.data);
                setLoading(false);
                setError(null); //Reset error on succes
            } catch (error) {
                setError("City not found. Please try again.");
                setWeatherData(null);
                setLoading(false);
                
            }
        };
        // Function to fetch the weather by the coordinates using longitude and latitude
        const fetchWeatherByCoordinates = async (lat, lon) => {
            try {
                const apiKey = "c4c2a91410c7352c9ffda3604c38aac4"; // API
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
                );
                setWeatherData(response.data);
                setLoading(false);
                setError(null);
            } catch (error) {
                setError("Unable to fetch weather data.");
                setLoading(false);
                setWeatherData(null); //Clear previous weather data to avoid confusion
            }
        };

        //If the user enters a city, fetch the weather for the city
        // If the user enters a city, fetch weather for that city, but debounce it
        if (city.length > 2) { // Only search if city name is longer than 2 characters
            // Debounce API call (wait 500ms after the user stops typing)
            clearTimeout(typingTimeout); // Clear the timeout if the user is still typing
            setTypingTimeout(
                setTimeout(() => {
                    fetchWeatherByCity(city);
                }, 500)
            );
        } else if (!city) {
            // Use geolocation for the default city when no city is typed
            const success = (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                setLatitude(lat);
                setLongitude(lon);
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
        }
    }, [city]); // Dependency on `city` to refetch when the user enters a new city

    const handleCityChange = (e) => {
        setCity(e.target.value);
        if (error) setError(null); // Clear error as user is typing
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="app-container">
            {/* Render Clouds if the weather is cloudy */}
            {weatherData && weatherData.weather[0].main.includes('Cloud') && <Clouds />}
            {weatherData && weatherData.weather[0].main.includes('Mist') && <Mist />}

        <div className="weather-container">
            <h1>Weather App</h1>

            {/* Input for entering a city manually */}
            <input
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={handleCityChange}
                style={{ display: "block", marginBottom: "10px" }} // Ensures the input field is always visible

            />

            {/* Display an error if the city is not found */}
            {error && <p className="error">{error}</p>}

            {/* If no weather data, prompt user to enter a city */}
            {!weatherData && !error && <div>Enter a city to see the weather</div>}

            {weatherData && weatherData.weather[0].main.includes('Cloud') && (
                <div className="cloud-container">
                    <div className="cloud"></div>
                    <div className="cloud"></div>
                    <div className="cloud"></div>
                    <div className="cloud"></div>
                </div>
            )}


            {/* Show raindrop animation when weather is "Rain" */}
            {weatherData && weatherData.weather[0].description.includes("light rain") && (
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
                    <div className="rain"></div>
                    <div className="rain"></div>
                    <div className="rain"></div>
                    <div className="rain"></div>
                    <div className="rain"></div>
                    <div className="rain"></div>
                    <div className="rain"></div>
                    <div className="rain"></div>
                    <div className="rain"></div>
                    <div className="rain"></div>
                    <div className="rain"></div>
                    <div className="rain"></div>
                    <div className="rain"></div>
                    <div className="rain"></div>
                    <div className="rain"></div>
                    <div className="rain"></div>
                    <div className="rain"></div>
                    <div className="rain"></div>
                    <div className="rain"></div>
                    <div className="rain"></div>
                    <div className="rain"></div>
                    <div className="rain"></div>
                </div>
            )}



            {/* Display weather data if available */}
            {weatherData && (
                <div className="weather-info">
                    <h2>Weather in {weatherData.name}</h2>
                    <img
                        src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                        alt={weatherData.weather[0].description}
                    />
                    <p>Temperature: {weatherData.main.temp}°C</p>
                    <p>Condition: {weatherData.weather[0].description}</p>
                </div>
            )}
            </div>
        </div>
    );
};
export default Weather;
