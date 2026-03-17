import { useEffect, useState } from "react";
import { getCurrentWeather, getCurrentWeatherByCoords, getWeatherForecast } from '../services/weatherApi';

export const useWeather = () => {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForeCast] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [unit, setUnits] = useState("C");

    const fetchWeatherByCity = async (city) => {
        setLoading(true);
        setError(null);
        try {
            const [weathreData, foreCast] = await Promise.all([
                getCurrentWeather(city),
                getWeatherForecast(city)
            ])

            setCurrentWeather(weathreData);
            setForeCast(foreCast);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to fetch weather data.")
        } finally {
            setLoading(false);
        }
    }

    const fetchWeatherByLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by this browser.");
        }

        setLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const weathreData = await getCurrentWeatherByCoords(latitude, longitude);
                setCurrentWeather(weathreData);

                // als fetch forecast for the current location
                const forecastData = await getWeatherForecast(weathreData.name);
                setForeCast(forecastData);

            } catch (error) {
                setError(error instanceof Error ? error.message : "Failed to fetch weather data.")
            } finally {
                setLoading(false);
            }
        }, (error) => {
            setError("unable to retreive your location");
            setLoading(false);
        })

    }

    const toggleUnit = () => {
        setUnits(unit === 'C' ? 'F' : 'C')
    }

    // Load Default weather on Mount
    useEffect(() => {
        fetchWeatherByCity('Mumbai');
    }, []);



    return { currentWeather, forecast, loading, error, unit, fetchWeatherByCity, fetchWeatherByLocation, toggleUnit };
};
