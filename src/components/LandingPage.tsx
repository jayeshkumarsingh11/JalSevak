
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
    if (isInitialLoad) {
        setIsInitialLoad(false);
        if (viewFromUrl && (APP_VIEWS.includes(viewFromUrl) || ['About Us', 'Contact Us'].includes(viewFromUrl))) {
             // If there's a view in the URL on first load, we want to stay on the home page
             // but allow deep links to scroll to sections later if needed.
             // For now, we set the view to Home.
             setActiveView('Home');
        }
        return;
    }
    
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
    window.history.pushState({}, '', url.toString());
    
    if (APP_VIEWS.includes(item)) {
       setActiveView(item);
    } else { // Home, About Us, Contact Us
       if (item === 'Home') {
         setActiveView('Home');
       } else {
         setActiveView('Home'); // Stay on home page to show sections
         const elementId = item.toLowerCase().replace(' ', '-');
         setTimeout(() => {
             const element = document.getElementById(elementId);
             if (element) {
                 element.scrollIntoView({ behavior: 'smooth' });
             }
         }, 100); // Small delay to ensure the view is set to home first
       }
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
