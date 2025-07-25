
"use client"

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
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
    // On initial load, we ignore the URL, force the Home view, and scroll to top.
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      setActiveView('Home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // We can also clean the URL to prevent confusion on refresh.
      if (window.location.search) {
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

  const handleNavigation = (item: NavItem) => {
    const isCurrentlyOnAppView = APP_VIEWS.includes(activeView);

    // Update URL to reflect the new state and allow for deep-linking.
    const url = new URL(window.location.href);
    if (item === 'Home') {
      url.search = '';
    } else {
      url.searchParams.set('view', item);
    }
    // We use replaceState for scrolling on the same page to not pollute browser history
    if (HOME_SECTIONS.includes(item) && !isCurrentlyOnAppView) {
        window.history.replaceState({}, '', url.toString());
    } else {
        window.history.pushState({}, '', url.toString());
    }


    // Set state to make change feel instant
    setActiveView(item);
    
    // If the item is a section on the home page, scroll to it.
    if (HOME_SECTIONS.includes(item)) {
        // If we are on a tool page, we need to switch view first, then scroll.
        // We use a small timeout to allow React to re-render the home page components.
        if (isCurrentlyOnAppView) {
            setTimeout(() => {
                const elementId = item === 'Home' ? 'hero-page' : item.toLowerCase().replace(' ', '-');
                const element = document.getElementById(elementId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 50);
        } else {
            // If we're already on a home page section, just scroll.
             const elementId = item === 'Home' ? 'hero-page' : item.toLowerCase().replace(' ', '-');
            const element = document.getElementById(elementId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    } else {
        // For app views, just scroll to the top.
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
      // If the activeView is a tool, render the app wrapper.
      if (APP_VIEWS.includes(activeView)) {
        return <SamriddhKhetiApp initialView={activeView} onNavigate={handleNavigation} />;
      }
      
      // Otherwise, render the home page sections.
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
