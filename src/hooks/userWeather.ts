// src/hooks/useWeather.ts
import { useState, useEffect } from 'react';

const API_KEY = 'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}'; // Replace with your API key

interface WeatherData {
  temp: number;
  humidity: number;
  recommendation: string;
  location: string;
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Get user location
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
        );
        
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        const hydrationRecommendation = (temp: number): string => {
          if (temp > 30) return "🌡️ ¡Calor intenso! Aumenta tu consumo de agua en 500ml";
          if (temp > 25) return "☀️ Día cálido - Considera beber más agua hoy";
          if (temp < 15) return "❄️ Día fresco - Mantén tu hidratación regular";
          return "✨ Mantén tu consumo regular de agua";
        };

        setWeather({
          temp: data.main.temp,
          humidity: data.main.humidity,
          recommendation: hydrationRecommendation(data.main.temp),
          location: data.name
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al obtener el clima');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return { weather, loading, error };
}