
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Sun, CloudRain, Droplets, Thermometer, Wind, Leaf, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const impactData = [
  { name: 'Water Usage', 'Without Planner': 8000, 'With Smart Planner': 5200 },
  { name: 'Disease Risk', 'Without Planner': 65, 'With Smart Planner': 30 },
  { name: 'Manual Work', 'Without Planner': 100, 'With Smart Planner': 40 },
];

const yieldData = [
  { name: 'Jan', yield: 280 },
  { name: 'Feb', yield: 310 },
  { name: 'Mar', yield: 290 },
  { name: 'Apr', yield: 350 },
  { name: 'May', yield: 380 },
  { name: 'Jun', yield: 410 },
];

interface WeatherData {
  temperature: number;
  precipitation_probability: number;
  relative_humidity: number;
  wind_speed: number;
  is_day: number;
}

interface IrrigationTime {
  time: string;
  relative: string;
}

export default function DashboardView() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [locationName, setLocationName] = useState<string | null>("Loading location...");
  const [irrigationTime, setIrrigationTime] = useState<IrrigationTime | null>(null);


  useEffect(() => {
    // Calculate irrigation time on client-side to avoid hydration mismatch
    const calculateIrrigationTime = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      tomorrow.setHours(6, 0, 0, 0); // Set to 6 AM tomorrow

      const diffMs = tomorrow.getTime() - now.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      let relativeString = '';
      if (diffHours > 0) {
        relativeString = `in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
      } else if (diffMinutes > 0) {
        relativeString = `in ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
      } else {
        relativeString = "now";
      }
      
      const irrigationDate = tomorrow.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const irrigationTimeOnly = tomorrow.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      setIrrigationTime({
        time: `${irrigationDate} at ${irrigationTimeOnly}`,
        relative: relativeString,
      });
    };

    calculateIrrigationTime();
    // Update every minute
    const interval = setInterval(calculateIrrigationTime, 60000); 

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchWeatherAndLocation = async (latitude: number, longitude: number) => {
      setLoadingWeather(true);
      try {
        // Fetch weather
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation_probability,is_day,wind_speed_10m`
        );
        const weatherData = await weatherResponse.json();
        if (weatherData && weatherData.current) {
          setWeatherData({
            temperature: Math.round(weatherData.current.temperature_2m),
            precipitation_probability: weatherData.current.precipitation_probability,
            relative_humidity: weatherData.current.relative_humidity_2m,
            wind_speed: Math.round(weatherData.current.wind_speed_10m),
            is_day: weatherData.current.is_day,
          });
        }

        // Fetch location name
        try {
            const locationResponse = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const locationData = await locationResponse.json();
            if (locationData && locationData.address) {
                const { address } = locationData;
                const locationString = [
                    address.village || address.town || address.city || address.county,
                    address.state,
                ]
                .filter(Boolean)
                .join(", ");
                setLocationName(locationString || "Current Location");
            } else {
                setLocationName("Unknown Location");
            }
        } catch (locationError) {
             console.error("Error fetching location name:", locationError);
             setLocationName("Could not fetch location");
        }

      } catch (error) {
        console.error("Failed to fetch weather data:", error);
        setWeatherData(null);
        setLocationName("Could not fetch location");
      } finally {
        setLoadingWeather(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
            fetchWeatherAndLocation(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Fallback to a default location if geolocation fails/is denied
          fetchWeatherAndLocation(28.61, 77.23); // Delhi
        }
      );
    } else {
      // Fallback for browsers that don't support geolocation
      fetchWeatherAndLocation(28.61, 77.23); // Delhi
    }
  }, []);

  return (
    <div className="grid gap-6 md:gap-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Irrigation</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {irrigationTime ? (
              <>
                <div className="text-2xl font-bold font-headline">{irrigationTime.relative}</div>
                <p className="text-xs text-muted-foreground">{irrigationTime.time}</p>
              </>
            ) : (
               <>
                <Skeleton className="h-7 w-40 mb-1" />
                <Skeleton className="h-3 w-24" />
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Water Saved</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">+35%</div>
            <p className="text-xs text-muted-foreground">~2,800L this week</p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Weather Overview</CardTitle>
             {loadingWeather ? (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Skeleton className="h-4 w-24" />
                </div>
              ) : (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                   <MapPin className="h-3 w-3" />
                  <span>{locationName}</span>
                </div>
              )}
          </CardHeader>
          <CardContent className="flex items-center justify-around pt-2">
            {loadingWeather ? (
                <>
                    <Skeleton className="h-12 w-14" />
                    <Skeleton className="h-12 w-14" />
                    <Skeleton className="h-12 w-14" />
                    <Skeleton className="h-12 w-14" />
                </>
            ) : weatherData ? (
              <>
                <div className="flex flex-col items-center gap-1">
                  <Sun className="h-6 w-6 text-accent" />
                  <span className="font-bold text-lg">{weatherData.temperature}°C</span>
                  <span className="text-xs text-muted-foreground">
                    {weatherData.is_day ? "Sunny" : "Clear"}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <CloudRain className="h-6 w-6 text-muted-foreground" />
                  <span className="font-bold text-lg">{weatherData.precipitation_probability}%</span>
                  <span className="text-xs text-muted-foreground">Rain Chance</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Thermometer className="h-6 w-6 text-muted-foreground" />
                  <span className="font-bold text-lg">{weatherData.relative_humidity}%</span>
                  <span className="text-xs text-muted-foreground">Humidity</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Wind className="h-6 w-6 text-muted-foreground" />
                  <span className="font-bold text-lg">{weatherData.wind_speed} km/h</span>
                  <span className="text-xs text-muted-foreground">Wind</span>
                </div>
              </>
            ) : (
                <p className="text-sm text-muted-foreground col-span-4 text-center">Could not load weather data.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Predicted Impact</CardTitle>
            <CardDescription>Comparison with and without JalSevak.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={impactData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip wrapperClassName="!bg-card !border-border" />
                <Legend iconSize={10} />
                <Bar dataKey="Without Planner" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="With Smart Planner" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Crop Yield Trend</CardTitle>
            <CardDescription>Projected yield consistency improvement.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yieldData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip wrapperClassName="!bg-card !border-border" />
                <Line type="monotone" dataKey="yield" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--accent))" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
