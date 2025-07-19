"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { soilQualityAdvisor, type SoilQualityAdvisorOutput } from "@/ai/flows/soil-quality-advisor";
import { getSoilType } from "@/ai/flows/get-soil-type";
import { Loader2, Bot, LocateFixed, TestTube2, ChevronsRight, Sparkles } from "lucide-react";

const formSchema = z.object({
  location: z.string().min(1, "Location is required."),
  soilType: z.string().min(1, "Soil type is required."),
  pastCrops: z.string().min(3, "Please list at least one past crop."),
  mainConcern: z.string().min(1, "Please select your main concern."),
});

type FormValues = z.infer<typeof formSchema>;

export default function SoilQualityAdvisor() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SoilQualityAdvisorOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [fetchingSoil, setFetchingSoil] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      soilType: "",
      pastCrops: "",
      mainConcern: "Increase Yield",
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
      const res = await soilQualityAdvisor(values);
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
          <CardTitle className="font-headline">Soil Quality Advisor</CardTitle>
          <CardDescription>
            Get AI advice on improving your soil's health based on its history.
          </CardDescription>
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
                    name="pastCrops"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Past Crop History</FormLabel>
                        <FormControl>
                        <Textarea
                            placeholder="e.g., Rice, Wheat, Sugarcane"
                            {...field}
                        />
                        </FormControl>
                        <FormDescription>
                         List crops from the last 2-3 seasons, separated by commas.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
               <FormField
                control={form.control}
                name="mainConcern"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Goal for Soil</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="What is your main goal?" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Increase Yield">Increase Yield</SelectItem>
                          <SelectItem value="Reduce Fertilizer Cost">Reduce Fertilizer Cost</SelectItem>
                          <SelectItem value="Long-term Sustainability">Long-term Sustainability</SelectItem>
                          <SelectItem value="Improve Water Retention">Improve Water Retention</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get Soil Advice
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="md:col-span-2">
        {loading && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
            <Bot className="h-16 w-16 text-primary animate-bounce" />
            <p className="font-headline text-xl">Analyzing your soil's history...</p>
            <p className="text-muted-foreground">Our AI soil scientist is preparing your recommendations.</p>
          </div>
        )}
        {error && <p className="text-destructive p-8">{error}</p>}
        {result && (
          <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-3">
                        <TestTube2 className="h-6 w-6 text-primary" />
                        Initial Soil Health Analysis
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{result.soilHealthAnalysis}</p>
                </CardContent>
            </Card>

            <h2 className="text-2xl font-headline pt-4">Improvement Recommendations</h2>

            {result.recommendations.length > 0 ? (
                <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                    {result.recommendations.map((rec, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="font-headline text-lg text-left">{rec.title}</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2">
                        <div>
                            <h4 className="font-semibold text-base">What to do:</h4>
                            <p className="text-muted-foreground">{rec.description}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-base">How to implement:</h4>
                            <p className="text-muted-foreground whitespace-pre-wrap">{rec.implementation}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-base flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-accent" />
                                Why it's important (Benefits):
                            </h4>
                            <p className="text-muted-foreground">{rec.benefits}</p>
                        </div>
                        </AccordionContent>
                    </AccordionItem>
                    ))}
              </Accordion>
            ) : (
                <Card className="flex flex-col items-center justify-center p-8 text-center">
                    <CardHeader>
                        <CardTitle className="font-headline">No Specific Recommendations Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">We couldn't generate recommendations based on your inputs. Please try different criteria.</p>
                    </CardContent>
                </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
