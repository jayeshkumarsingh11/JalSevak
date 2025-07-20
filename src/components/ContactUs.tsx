
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export default function ContactUs() {
  const { t } = useLanguage();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would handle form submission, e.g., send an email or save to a database
    console.log(values);
    // You can use the `toast` function here to show a success message
  }

  return (
    <div id="contact-us" className="bg-muted/40 scroll-mt-20">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-headline text-primary">{t('contact_us_title')}</h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('contact_us_subtitle')}
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">{t('contact_info_title')}</CardTitle>
                <CardDescription>{t('contact_info_desc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">{t('contact_email_title')}</h3>
                    <a href="mailto:info@jalsevak.com" className="text-muted-foreground hover:text-primary">info@jalsevak.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">{t('contact_phone_title')}</h3>
                    <a href="tel:+919876543210" className="text-muted-foreground hover:text-primary">+91 987 654 3210</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">{t('contact_address_title')}</h3>
                    <p className="text-muted-foreground">{t('contact_address_value')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">{t('contact_form_title')}</CardTitle>
                <CardDescription>{t('contact_form_desc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('form_name')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('form_name_placeholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('form_email')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('form_email_placeholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('form_subject')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('form_subject_placeholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('form_message')}</FormLabel>
                          <FormControl>
                            <Textarea placeholder={t('form_message_placeholder')} className="min-h-[120px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                       <Send className="mr-2 h-4 w-4" /> {t('send_message_button')}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
