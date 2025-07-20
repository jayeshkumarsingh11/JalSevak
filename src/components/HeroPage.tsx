
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeroPageProps {
    onNavigate: (page: 'Dashboard' | 'About Us') => void;
}

export default function HeroPage({ onNavigate }: HeroPageProps) {
  const { t } = useLanguage();

  return (
    <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden">
      <Image
        src="https://placehold.co/1200x800.png"
        alt="A vibrant corn field at sunset with a dramatic cloudy sky"
        fill
        style={{objectFit: "cover"}}
        className="z-0"
        data-ai-hint="corn field"
        priority
      />
      <div className="absolute inset-0 bg-black/50 z-10"></div>
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 animate-fade-in-down">
          {t("hero_title")}
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mb-8 animate-fade-in-up">
          {t("hero_subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-300">
          <Button size="lg" onClick={() => onNavigate('Dashboard')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {t("hero_cta_primary")}
          </Button>
          <Button size="lg" variant="outline" onClick={() => onNavigate('About Us')} className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
            {t("hero_cta_secondary")}
          </Button>
        </div>
      </div>
      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animation-delay-300 {
            animation-delay: 0.3s;
            opacity: 0;
            animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}
