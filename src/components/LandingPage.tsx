
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

export default function LandingPage() {
  const searchParams = useSearchParams();
  const [activeView, setActiveView] = useState<NavItem>('Home');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const viewFromUrl = searchParams.get('view') as NavItem;
    // On initial load, we want to start at the Home page, but allow deep links to scroll to sections later.
    if (isInitialLoad) {
        setIsInitialLoad(false);
        // If a view is in the URL (e.g. from a bookmark), set the state to that view.
        if (viewFromUrl && (APP_VIEWS.includes(viewFromUrl) || ['About Us', 'Contact Us', 'Home'].includes(viewFromUrl))) {
            if (APP_VIEWS.includes(viewFromUrl)) {
              setActiveView(viewFromUrl);
            } else {
              // This handles scrolling to #about-us or #contact-us on first load
              const element = document.getElementById(viewFromUrl.toLowerCase().replace(' ', '-'));
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }
        }
        return;
    }
    
    // For subsequent navigation events handled by history.pushState
    if (viewFromUrl && (APP_VIEWS.includes(viewFromUrl) || ['About Us', 'Contact Us', 'Home'].includes(viewFromUrl))) {
      if (APP_VIEWS.includes(viewFromUrl)) {
        setActiveView(viewFromUrl);
      } else {
        setActiveView('Home');
        const element = document.getElementById(viewFromUrl.toLowerCase().replace(' ', '-'));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      setActiveView('Home');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);


  const handleNavigation = (item: NavItem) => {
    window.scrollTo({ top: 0, behavior: 'smooth'});

    const url = new URL(window.location.href);
    url.searchParams.set('view', item);
    // This updates the URL and triggers the useEffect above to handle the view change.
    window.history.pushState({}, '', url.toString());

    // We also manually set the active view to make the change feel instantaneous.
    if (APP_VIEWS.includes(item)) {
       setActiveView(item);
    } else { // Home, About Us, Contact Us
       setActiveView('Home'); // Stay on home page to show sections
       // We need a timeout to ensure the DOM has re-rendered to the 'Home' view before we try to scroll.
       setTimeout(() => {
           const elementId = item.toLowerCase().replace(' ', '-');
           const element = document.getElementById(elementId);
           if (element) {
               element.scrollIntoView({ behavior: 'smooth' });
           }
       }, 100);
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
          <HeroPage onNavigate={handleNavigation} onLearnMoreClick={handleLearnMoreClick} />
          <AboutPage />
          <ContactUs />
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
