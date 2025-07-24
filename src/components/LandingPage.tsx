
"use client"

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SamriddhKhetiApp from '@/components/SamriddhKhetiApp';
import TopNavBar from './TopNavBar';
import AboutPage from './AboutPage';
import HeroPage from './HeroPage';
import ContactUs from './ContactUs';
import type { NavItem } from './SamriddhKhetiApp';

const APP_VIEWS: NavItem[] = ["Dashboard", "Irrigation Planner", "Crop Advisor", "Soil Advisor", "Govt. Schemes"];
const HOME_SECTIONS: NavItem[] = ["Home", "About Us", "Contact Us"];

export default function LandingPage() {
  const searchParams = useSearchParams();
  const [activeView, setActiveView] = useState<NavItem>('Home');

  useEffect(() => {
    const viewFromUrl = searchParams.get('view') as NavItem;
    if (viewFromUrl && viewFromUrl !== activeView) {
        if (APP_VIEWS.includes(viewFromUrl)) {
            setActiveView(viewFromUrl);
        } else if (HOME_SECTIONS.includes(viewFromUrl)) {
            const elementId = viewFromUrl === 'Home' ? 'hero-page' : viewFromUrl.toLowerCase().replace(' ', '-');
            const element = document.getElementById(elementId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleNavigation = (item: NavItem) => {
    window.scrollTo({ top: 0, behavior: 'smooth'});
    
    // Always update the URL to trigger the state change
    const url = new URL(window.location.href);
    url.searchParams.set('view', item);
    window.history.pushState({}, '', url.toString());

    // Manually set state to make change feel instant
    setActiveView(item);
  };
  
  const handleLearnMoreClick = () => {
    const aboutSection = document.getElementById('about-us');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderContent = () => {
      if (APP_VIEWS.includes(activeView)) {
        return <SamriddhKhetiApp initialView={activeView} onNavigate={handleNavigation} />;
      }
      
      return (
        <>
          <div id="hero-page">
            <HeroPage onNavigate={handleNavigation} onLearnMoreClick={handleLearnMoreClick} />
          </div>
          <div id="about-us">
            <AboutPage />
          </div>
          <div id="contact-us">
            <ContactUs />
          </div>
        </>
      );
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
        <TopNavBar activeItem={activeView} setActiveItem={handleNavigation} />
        <main className="flex-1">
            {renderContent()}
        </main>
    </div>
  )
}
