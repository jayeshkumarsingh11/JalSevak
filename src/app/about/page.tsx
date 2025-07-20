
import Footer from "@/components/Footer";
import { Leaf } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
       <header className="p-4 md:px-6 flex items-center justify-between border-b">
         <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
              <Leaf className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-headline font-semibold">JalSevak</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/about" className="text-primary transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
          </nav>
          <Button asChild>
            <Link href="/app">Launch App</Link>
          </Button>
      </header>
      <main className="flex-1 py-12 md:py-20 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">About JalSevak</h2>
              <p className="text-muted-foreground mb-4">
                JalSevak was born from a desire to merge cutting-edge technology with traditional farming wisdom. We aim to provide Indian farmers with accessible, data-driven tools to enhance productivity, promote sustainability, and ensure profitability.
              </p>
              <p className="text-muted-foreground mb-4">
                Our platform leverages artificial intelligence to analyze soil, weather, and crop data, offering personalized recommendations that empower farmers to make the best decisions for their land. From smart irrigation schedules to AI-powered crop advice, JalSevak is a trusted partner in the field.
              </p>
               <p className="text-muted-foreground">
                We believe in a future where technology and agriculture work hand-in-hand to create a more prosperous and food-secure India.
              </p>
            </div>
            <div className="relative h-80 rounded-lg overflow-hidden">
                <Image 
                    src="https://placehold.co/600x400.png"
                    alt="Farmer using a tablet in a field"
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="farmer technology field"
                />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
