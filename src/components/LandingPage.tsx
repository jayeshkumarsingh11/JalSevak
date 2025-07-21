
"use client"

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import JalSevakApp from './JalSevakApp';
import TopNavBar from './TopNavBar';
import AboutPage from './AboutPage';
import HeroPage from './HeroPage';
import ContactUs from './ContactUs';
import type { NavItem } from './JalSevakApp';

export default function LandingPage() {
  const searchParams = useSearchParams();
  const [activeView, setActiveView] = useState<NavItem>('Home');

  useEffect(() => {
    const viewFromUrl = searchParams.get('view') as NavItem;
    if (viewFromUrl) {
        setActiveView(viewFromUrl);
    } else {
        // Default to home, which doesn't prerender the heavy app components
        setActiveView('Home');
    }
  }, [searchParams]);


  const handleNavigation = (item: NavItem) => {
    setActiveView(item);
  };
  
  const handleLearnMoreClick = () => {
    const aboutSection = document.getElementById('about-us');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderContent = () => {
      switch (activeView) {
        case 'Dashboard':
        case 'Irrigation Planner':
        case 'Crop Advisor':
        case 'Soil Advisor':
        case 'Govt. Schemes':
          return <JalSevakApp initialView={activeView} onNavigate={handleNavigation} />;
        case 'Home':
             return (
              <>
                <HeroPage onNavigate={handleNavigation} onLearnMoreClick={handleLearnMoreClick} />
                <AboutPage />
                <ContactUs />
              </>
            );
        case 'About Us':
             return (
              <>
                <HeroPage onNavigate={handleNavigation} onLearnMoreClick={handleLearnMoreClick} />
                <AboutPage />
                <ContactUs />
              </>
            );
        case 'Contact Us':
            return (
              <>
                <HeroPage onNavigate={handleNavigation} onLearnMoreClick={handleLearnMoreClick} />
                <AboutPage />
                <ContactUs />
              </>
            );
        default:
           // Fallback to home to prevent build errors
           return (
            <>
              <HeroPage onNavigate={handleNavigation} onLearnMoreClick={handleLearnMoreClick} />
              <AboutPage />
              <ContactUs />
            </>
          );
      }
  };
  
  const isAppView = ['Dashboard', 'Irrigation Planner', 'Crop Advisor', 'Soil Advisor', 'Govt. Schemes'].includes(activeView);

  if (isAppView) {
    return renderContent();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
        <TopNavBar activeItem={activeView} setActiveItem={handleNavigation} isAppView={false} />
        <main className="flex-1 animate-slide-up-fade">
            {renderContent()}
        </main>
        <footer className="py-4 text-center text-sm text-muted-foreground bg-muted/40 border-t">
            © 2025 Team SeedSorrower
        </footer>
    </div>
  )
}
