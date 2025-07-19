"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { governmentSchemeSuggestions, type GovernmentSchemeSuggestionsOutput } from "@/ai/flows/government-scheme-suggestions";
import { Loader2, Bot } from "lucide-react";

const formSchema = z.object({
  location: z.string().min(1, "Location is required."),
  cropType: z.string().min(1, "Crop type is required."),
  landArea: z.coerce.number().min(0.1, "Land area must be positive."),
});

export default function SchemeFinder() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GovernmentSchemeSuggestionsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      cropType: "",
      landArea: 1,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await governmentSchemeSuggestions(values);
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
          <CardTitle className="font-headline">Find Government Schemes</CardTitle>
          <CardDescription>
            Discover subsidies and schemes you are eligible for.
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
                    <FormControl><Input placeholder="e.g., Village, State" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cropType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Crop</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a crop" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Any">Any / Multiple</SelectItem>
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
                name="landArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Land Area (acres)</FormLabel>
                    <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Find Schemes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="md:col-span-2">
        {loading && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
            <Bot className="h-16 w-16 text-primary animate-bounce" />
            <p className="font-headline text-xl">Finding relevant schemes...</p>
            <p className="text-muted-foreground">Our AI is searching for programs tailored to your needs.</p>
          </div>
        )}
        {error && <p className="text-destructive p-8">{error}</p>}
        {result && (
          <div>
            <h2 className="text-2xl font-headline mb-4">Suggested Schemes for You</h2>
            {result.schemes.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {result.schemes.map((scheme, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="font-headline text-lg text-left">{scheme.name}</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div>
                        <h4 className="font-semibold text-base">Description</h4>
                        <p className="text-muted-foreground">{scheme.description}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-base">Eligibility</h4>
                        <p className="text-muted-foreground">{scheme.eligibilityCriteria}</p>
                      </div>
                       <div>
                        <h4 className="font-semibold text-base">Benefits</h4>
                        <p className="text-muted-foreground">{scheme.benefits}</p>
                      </div>
                       <div>
                        <h4 className="font-semibold text-base">How to Apply</h4>
                        <p className="text-muted-foreground">{scheme.applicationProcedure}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
                <Card className="flex flex-col items-center justify-center p-8 text-center">
                    <CardHeader>
                        <CardTitle className="font-headline">No Schemes Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">We couldn't find any specific government schemes based on the information you provided. Please try adjusting your search criteria.</p>
                    </CardContent>
                </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
