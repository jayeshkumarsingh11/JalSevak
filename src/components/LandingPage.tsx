
"use client"

import { useState, useEffect } from 'react';
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
  const searchParams = useSearchParams();
  const [activeView, setActiveView] = useState<NavItem>('Home');

  useEffect(() => {
    const viewFromUrl = searchParams.get('view') as NavItem;
    // This effect now primarily handles deep-linking or browser back/forward navigation.
    // The initial state is always 'Home'.
    if (viewFromUrl && viewFromUrl !== activeView) {
        if ([...APP_VIEWS, ...HOME_SECTIONS].includes(viewFromUrl)) {
            setActiveView(viewFromUrl);
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleNavigation = (item: NavItem) => {
    // Manually set state to make change feel instant
    setActiveView(item);

    // Update URL to reflect the new state and allow for deep-linking.
    const url = new URL(window.location.href);
    url.searchParams.set('view', item);
    window.history.pushState({}, '', url.toString());
    
    // If the item is a section on the home page, scroll to it.
    if (HOME_SECTIONS.includes(item)) {
        // If we're not on a tool page, just scroll.
        if (!APP_VIEWS.includes(activeView)) {
            const elementId = item === 'Home' ? 'hero-page' : item.toLowerCase().replace(' ', '-');
            const element = document.getElementById(elementId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            // If we are on a tool page, we need to switch view first, then scroll.
            // We use a small timeout to allow React to re-render the home page components.
            setTimeout(() => {
                const elementId = item === 'Home' ? 'hero-page' : item.toLowerCase().replace(' ', '-');
                const element = document.getElementById(elementId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 50);
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
