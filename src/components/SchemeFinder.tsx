
"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { governmentSchemeSuggestions, type GovernmentSchemeSuggestionsOutput } from "@/ai/flows/government-scheme-suggestions";
import { Loader2, Bot, LocateFixed } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const formSchema = z.object({
  location: z.string().min(1, "Location is required."),
  cropType: z.string().min(1, "Crop type is required."),
  landArea: z.coerce.number().min(0.1, "Land area must be positive."),
});

const CROP_SUGGESTIONS = [
  "Apple", "Bajra", "Banana", "Barley", "Brinjal", "Cabbage", "Capsicum", "Cauliflower",
  "Chilli", "Coffee", "Cotton", "Ginger", "Gram", "Grapes", "Groundnut", "Guava",
  "Jute", "Lentil", "Maize", "Mango", "Millet", "Mustard", "Okra", "Onion", "Papaya",
  "Pomegranate", "Potato", "Pulses", "Rice", "Sorghum", "Soybean", "Sugarcane",
  "Tea", "Tomato", "Turmeric", "Wheat"
];

export default function SchemeFinder() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GovernmentSchemeSuggestionsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fetchingLocation, setFetchingLocation] = useState(false);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const cropInputRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      cropType: "",
      landArea: 1,
    },
  });
  
  const handleCropInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue("cropType", value);
    if (value) {
      const filtered = CROP_SUGGESTIONS.filter(crop =>
        crop.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    form.setValue("cropType", suggestion);
    setShowSuggestions(false);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cropInputRef.current && !cropInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await governmentSchemeSuggestions(values);
      setResult(res);
    } catch (e: any) {
      setError(e.message || t('error_unexpected'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-8 items-start">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="font-headline">{t('scheme_finder_title')}</CardTitle>
          <CardDescription>{t('scheme_finder_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form_location')}</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder={t('form_location_placeholder')}
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
                        aria-label={t('get_current_location_label')}
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
                name="cropType"
                render={({ field }) => (
                  <FormItem ref={cropInputRef}>
                    <FormLabel>{t('form_primary_crop')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('form_crop_type_placeholder')}
                        {...field}
                        onChange={handleCropInputChange}
                        autoComplete="off"
                      />
                    </FormControl>
                     {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute z-10 w-full bg-background border border-input rounded-md shadow-lg mt-1">
                        <ul className="py-1">
                          {suggestions.map((suggestion) => (
                            <li
                              key={suggestion}
                              className="px-3 py-2 cursor-pointer hover:bg-accent"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="landArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form_land_area')}</FormLabel>
                    <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('find_schemes_button')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="md:col-span-2">
        {!result && !loading && (
          <Card className="flex flex-col items-center justify-center h-full p-8 text-center bg-muted/30 border-dashed">
            <Image 
              src="https://placehold.co/400x300.png"
              alt="Illustration of a government building"
              width={400}
              height={300}
              className="mb-4 rounded-lg opacity-80"
              data-ai-hint="government building illustration"
            />
            <h3 className="text-xl font-headline text-muted-foreground">{t('scheme_finder_initial_prompt')}</h3>
            <p className="text-muted-foreground">{t('scheme_finder_initial_prompt_desc')}</p>
          </Card>
        )}
        {loading && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
            <Bot className="h-16 w-16 text-primary" />
            <p className="font-headline text-xl">{t('loading_finding_schemes')}</p>
            <p className="text-muted-foreground">{t('loading_searching_programs')}</p>
          </div>
        )}
        {error && <p className="text-destructive p-8">{error}</p>}
        {result && (
          <div className="animate-slide-up-fade">
            <h2 className="text-2xl font-headline mb-4">{t('results_suggested_schemes')}</h2>
            {result.schemes.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {result.schemes.map((scheme, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="font-headline text-lg text-left">{scheme.name}</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div>
                        <h4 className="font-semibold text-base">{t('results_description')}</h4>
                        <p className="text-muted-foreground">{scheme.description}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-base">{t('results_eligibility')}</h4>
                        <p className="text-muted-foreground">{scheme.eligibilityCriteria}</p>
                      </div>
                       <div>
                        <h4 className="font-semibold text-base">{t('results_benefits')}</h4>
                        <p className="text-muted-foreground">{scheme.benefits}</p>
                      </div>
                       <div>
                        <h4 className="font-semibold text-base">{t('results_how_to_apply')}</h4>
                        <p className="text-muted-foreground">{scheme.applicationProcedure}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
                <Card className="flex flex-col items-center justify-center p-8 text-center">
                    <CardHeader>
                        <CardTitle className="font-headline">{t('results_no_schemes_title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{t('results_no_schemes_description')}</p>
                    </CardContent>
                </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
