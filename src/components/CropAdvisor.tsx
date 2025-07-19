"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cropSuggestion, type CropSuggestionOutput } from "@/ai/flows/crop-suggestion";
import { getSoilType } from "@/ai/flows/get-soil-type";
import { Loader2, Bot, LocateFixed, Leaf, Droplets, Banknote, CalendarDays } from "lucide-react";

const formSchema = z.object({
  location: z.string().min(1, "Location is required."),
  soilType: z.string().min(1, "Soil type is required."),
  waterAvailability: z.string().min(1, "Water availability is required."),
  farmerPreference: z.string().min(1, "Please select a preference."),
});

type FormValues = z.infer<typeof formSchema>;

export default function CropAdvisor() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CropSuggestionOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [fetchingSoil, setFetchingSoil] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      soilType: "",
      waterAvailability: "",
      farmerPreference: "Maximize Profit",
    },
  });

  const fetchSoilType = async (location: string) => {
    if (!location) return;
    setFetchingSoil(true);
    try {
      const { soilType } = await getSoilType({ location });
      if (soilType) {
        form.setValue("soilType", soilType, { shouldValidate: true });
      }
    } catch (error) {
      console.error("Error fetching soil type:", error);
    } finally {
      setFetchingSoil(false);
    }
  };

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
            const finalLocation = locationString || data.display_name;
            form.setValue("location", finalLocation);
            await fetchSoilType(finalLocation);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await cropSuggestion(values);
      setResult(res);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-8 items-start">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="font-headline">Crop Advisor</CardTitle>
          <CardDescription>Get AI-powered crop recommendations tailored to your farm.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Location</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="e.g., Village, State"
                          {...field}
                          className="pr-10"
                          onBlur={(e) => fetchSoilType(e.target.value)}
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
                name="soilType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soil Type</FormLabel>
                     <Select onValueChange={field.onChange} value={field.value} disabled={fetchingSoil}>
                        <FormControl>
                           <SelectTrigger>
                            {fetchingSoil ? (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Determining soil type...</span>
                              </div>
                            ) : (
                              <SelectValue placeholder="Select soil type" />
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Loamy">Loamy</SelectItem>
                          <SelectItem value="Clay">Clay</SelectItem>
                          <SelectItem value="Sandy">Sandy</SelectItem>
                          <SelectItem value="Alluvial">Alluvial</SelectItem>
                          <SelectItem value="Black Soil">Black Soil (Regur)</SelectItem>
                          <SelectItem value="Red and Yellow Soil">Red and Yellow Soil</SelectItem>
                          <SelectItem value="Laterite Soil">Laterite Soil</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                control={form.control}
                name="waterAvailability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Water Availability</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select water availability" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Abundant">Abundant (Canal, River)</SelectItem>
                          <SelectItem value="Moderate">Moderate (Well, Borewell)</SelectItem>
                          <SelectItem value="Scarce">Scarce (Rain-fed)</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="farmerPreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Goal</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="What is your main goal?" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Maximize Profit">Maximize Profit</SelectItem>
                          <SelectItem value="Drought Resistant">Drought Resistant</SelectItem>
                          <SelectItem value="Low Maintenance">Low Maintenance</SelectItem>
                          <SelectItem value="Improve Soil Health">Improve Soil Health</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get Recommendations
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="md:col-span-2">
        {loading && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
            <Bot className="h-16 w-16 text-primary animate-bounce" />
            <p className="font-headline text-xl">Analyzing your farm...</p>
            <p className="text-muted-foreground">Our AI is finding the best crops for you.</p>
          </div>
        )}
        {error && <p className="text-destructive p-8">{error}</p>}
        {result && (
          <div className="space-y-6">
            <h2 className="text-2xl font-headline mb-4">Top Crop Recommendations</h2>
            {result.suggestions.length > 0 ? (
                result.suggestions.map((crop, index) => (
                  <Card key={index}>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-3">
                            <Leaf className="h-6 w-6 text-primary" />
                            {crop.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div>
                            <h4 className="font-semibold text-base">Why we suggest this crop:</h4>
                            <p className="text-muted-foreground">{crop.justification}</p>
                       </div>
                       <div className="grid grid-cols-3 gap-4 text-sm">
                           <div className="flex items-center gap-2">
                                <Banknote className="h-4 w-4 text-muted-foreground"/>
                                <div>
                                    <p className="font-semibold">Profit Potential</p>
                                    <p className="text-muted-foreground">{crop.estimatedProfit}</p>
                                </div>
                           </div>
                           <div className="flex items-center gap-2">
                                <Droplets className="h-4 w-4 text-muted-foreground"/>
                                 <div>
                                    <p className="font-semibold">Water Needs</p>
                                    <p className="text-muted-foreground">{crop.waterNeeds}</p>
                                </div>
                           </div>
                           <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-muted-foreground"/>
                                 <div>
                                    <p className="font-semibold">Growing Season</p>
                                    <p className="text-muted-foreground">{crop.growingSeason}</p>
                                </div>
                           </div>
                       </div>
                    </CardContent>
                  </Card>
                ))
            ) : (
                <Card className="flex flex-col items-center justify-center p-8 text-center">
                    <CardHeader>
                        <CardTitle className="font-headline">No Specific Recommendations Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">We couldn't generate specific recommendations based on your inputs. Please try different criteria.</p>
                    </CardContent>
                </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
