
"use client"

import { useState, useEffect, useRef } from 'react';
import SamriddhKhetiApp from '@/components/SamriddhKhetiApp';
import TopNavBar from './TopNavBar';
import AboutPage from './AboutPage';
import HeroPage from './HeroPage';
import ContactUs from './ContactUs';
import type { NavItem } from './SamriddhKhetiApp';
import Footer from './Footer';


const APP_VIEWS: NavItem[] = ["Dashboard", "Irrigation Planner", "Crop Advisor", "Soil Advisor", "Govt. Schemes"];
const HOME_SECTIONS: NavItem[] = ["Home", "About Us", "Contact Us"];

export default function LandingPage() {
  const [activeView, setActiveView] = useState<NavItem>('Home');
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      
      const url = new URL(window.location.href);
      if (url.searchParams.has('view')) {
          url.searchParams.delete('view');
          window.history.replaceState({}, '', url.toString());
      }
      setActiveView('Home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleNavigation = (item: NavItem) => {
    const isCurrentlyOnAppView = APP_VIEWS.includes(activeView);

    const url = new URL(window.location.href);
    if (item === 'Home') {
      url.search = '';
    } else {
      url.searchParams.set('view', item);
    }
    
    window.history.pushState({}, '', url.toString());
    
    setActiveView(item);
    
    if (HOME_SECTIONS.includes(item)) {
        setTimeout(() => {
            const elementId = item === 'Home' ? 'hero-page' : item.toLowerCase().replace(' ', '-');
            const element = document.getElementById(elementId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, isCurrentlyOnAppView ? 50 : 0);
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
        <Footer onNavigate={handleNavigation} />
    </div>
  )
}
