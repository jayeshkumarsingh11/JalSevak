
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 md:px-6 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
              <Leaf className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-headline font-semibold">JalSevak</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
          </nav>
          <Button asChild>
            <Link href="/app">Launch App</Link>
          </Button>
      </header>
      <main className="flex-1">
        <section className="relative w-full h-[60vh] md:h-[70vh]">
           <Image
            src="https://placehold.co/1600x900.png"
            alt="Lush green field"
            layout="fill"
            objectFit="cover"
            className="opacity-90"
            data-ai-hint="lush green farm field"
          />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white bg-black/50 p-4">
            <h2 className="text-4xl md:text-6xl font-headline font-bold drop-shadow-lg">JalSevak</h2>
            <p className="mt-4 text-lg md:text-xl max-w-2xl drop-shadow-md">
              Empowering Indian farmers with data-driven insights for a prosperous and sustainable future.
            </p>
             <Button asChild size="lg" className="mt-8">
                <Link href="/app">Get Started</Link>
            </Button>
          </div>
        </section>
        <section className="py-12 md:py-20 px-4 md:px-6">
            <div className="container mx-auto">
                <h3 className="text-3xl font-headline text-center mb-8">Our Features</h3>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center">
                        <Leaf className="h-12 w-12 text-primary mb-4"/>
                        <h4 className="text-xl font-headline mb-2">AI Crop Advisor</h4>
                        <p className="text-muted-foreground">Get tailored crop recommendations based on your farm's unique conditions.</p>
                    </div>
                     <div className="flex flex-col items-center">
                        <Leaf className="h-12 w-12 text-primary mb-4"/>
                        <h4 className="text-xl font-headline mb-2">Smart Irrigation</h4>
                        <p className="text-muted-foreground">Optimize water usage with intelligent, weather-aware irrigation schedules.</p>
                    </div>
                     <div className="flex flex-col items-center">
                        <Leaf className="h-12 w-12 text-primary mb-4"/>
                        <h4 className="text-xl font-headline mb-2">Soil Health Analysis</h4>
                        <p className="text-muted-foreground">Improve long-term yield with AI-powered soil quality advice.</p>
                    </div>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
