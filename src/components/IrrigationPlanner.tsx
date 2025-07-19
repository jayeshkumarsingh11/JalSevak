"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { smartIrrigationSchedule, type SmartIrrigationScheduleOutput } from "@/ai/flows/smart-irrigation-scheduling";
import { Loader2, Droplets, Bot, LocateFixed } from "lucide-react";

const formSchema = z.object({
  cropType: z.string().min(1, "Crop type is required."),
  farmArea: z.coerce.number().min(0.1, "Farm area must be positive."),
  waterSource: z.string().min(1, "Water source is required."),
  location: z.string().min(1, "Location is required."),
  weatherData: z.string().min(1, "Weather data is required."),
  soilData: z.string().min(1, "Soil data is required."),
});

export default function IrrigationPlanner() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SmartIrrigationScheduleOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fetchingLocation, setFetchingLocation] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropType: "",
      farmArea: 1,
      waterSource: "",
      location: "",
      weatherData: "Temperature: 28°C, Humidity: 65%, Chance of rain: 15%, Wind: 12 km/h",
      soilData: "Soil Moisture: 45%, Soil Temperature: 22°C, Type: Loamy",
    },
  });

  const getLocation = () => {
    if (navigator.geolocation) {
      setFetchingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const { address } = data;
            const locationString = [
              address.village || address.town || address.city_district,
              address.city,
              address.state,
            ]
              .filter(Boolean)
              .join(", ");
            form.setValue("location", locationString || data.display_name);
          } catch (error) {
            console.error("Error fetching location name:", error);
          } finally {
            setFetchingLocation(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setFetchingLocation(false);
        }
      );
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await smartIrrigationSchedule(values);
      setResult(res);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Plan Your Irrigation</CardTitle>
          <CardDescription>
            Enter your farm's details to get a smart, dynamic irrigation schedule.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cropType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crop Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a crop" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Wheat">Wheat</SelectItem>
                          <SelectItem value="Rice">Rice</SelectItem>
                          <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                          <SelectItem value="Cotton">Cotton</SelectItem>
                          <SelectItem value="Maize">Maize</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farmArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Farm Area (acres)</FormLabel>
                      <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="waterSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Water Source</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a water source" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Canal">Canal</SelectItem>
                          <SelectItem value="Well">Well</SelectItem>
                          <SelectItem value="Borewell">Borewell</SelectItem>
                          <SelectItem value="River">River</SelectItem>
                          <SelectItem value="Rainwater Harvesting">Rainwater Harvesting</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="e.g., Village, District, State"
                          {...field}
                          className="pr-10"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-1/2 right-1 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                        onClick={getLocation}
                        disabled={fetchingLocation}
                        aria-label="Get current location"
                      >
                        {fetchingLocation ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <LocateFixed className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weatherData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Weather Data</FormLabel>
                    <FormControl><Textarea {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="soilData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Soil Data</FormLabel>
                    <FormControl><Textarea {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get Schedule
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="flex items-center justify-center h-full">
        {loading && (
          <div className="flex flex-col items-center gap-4 text-center p-8">
            <Bot className="h-16 w-16 text-primary animate-bounce" />
            <p className="font-headline text-xl">Analyzing your farm data...</p>
            <p className="text-muted-foreground">Our AI is preparing your custom irrigation plan.</p>
          </div>
        )}
        {error && <p className="text-destructive p-8">{error}</p>}
        {result && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Droplets className="text-primary"/> Recommended Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">Schedule</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{result.irrigationSchedule}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Water Amount</h3>
                <p className="text-muted-foreground">{result.waterAmount} Liters</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Justification</h3>
                <p className="text-muted-foreground">{result.justification}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
