
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

interface HeroPageProps {
    onNavigate: (page: 'Dashboard') => void;
    onLearnMoreClick: () => void;
}

export default function HeroPage({ onNavigate, onLearnMoreClick }: HeroPageProps) {

  return (
    <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden">
      <Image
        src="https://khetibuddy.com/wp-content/uploads/2024/06/Crops.jpg"
        alt="A vibrant corn field at sunset with a dramatic cloudy sky"
        fill
        style={{objectFit: "cover"}}
        className="z-0"
        data-ai-hint="corn field"
        priority
      />
      <div className="absolute inset-0 bg-black/60 z-10"></div>
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 animate-slide-up-fade" style={{ animationDelay: '0.3s' }}>
          Revolutionizing Agriculture with AI
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mb-8 animate-slide-up-fade" style={{ animationDelay: '0.5s' }}>
          Welcome to Samriddh Kheti, your smart farming assistant designed to revolutionize agricultural practices in India by empowering farmers with data-driven insights. Our mission is to optimize resource usage, improve crop yields, and enhance the livelihoods of farmers for a prosperous, sustainable, and food-secure nation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up-fade" style={{ animationDelay: '0.7s' }}>
          <Button size="lg" onClick={() => onNavigate('Dashboard')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Go to Dashboard
          </Button>
          <Button size="lg" variant="outline" onClick={onLearnMoreClick} className="bg-transparent border-white text-white hover:bg-white hover:text-black">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}
