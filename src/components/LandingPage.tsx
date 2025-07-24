
"use client"

import { useState, useEffect, useRef } from 'react';
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
  const activeViewRef = useRef(activeView);

  // Keep a ref to the current activeView to prevent stale closures in callbacks
  useEffect(() => {
    activeViewRef.current = activeView;
  }, [activeView]);

  // Initial view setup and URL-based navigation
  useEffect(() => {
    const viewFromUrl = searchParams.get('view') as NavItem;
    if (viewFromUrl && viewFromUrl !== activeView) {
      if (APP_VIEWS.includes(viewFromUrl)) {
        setActiveView(viewFromUrl);
      } else if (HOME_SECTIONS.includes(viewFromUrl)) {
        setActiveView('Home');
        // Timeout to allow the DOM to render before scrolling
        setTimeout(() => {
          const elementId = viewFromUrl === 'Home' ? 'hero-page' : viewFromUrl.toLowerCase().replace(' ', '-');
          const element = document.getElementById(elementId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Scroll spy for home page sections
  useEffect(() => {
    // Only run the observer if we are on the home page view
    if (activeView === 'Home') {
      const observerOptions = {
        root: null, // observing intersections with the viewport
        rootMargin: '0px',
        threshold: 0.5, // 50% of the element must be visible
      };

      const handleIntersect = (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            let newView: NavItem = 'Home';
            if (entry.target.id === 'about-us') newView = 'About Us';
            if (entry.target.id === 'contact-us') newView = 'Contact Us';
            
            // Only update if the view has changed to prevent infinite loops
            if (activeViewRef.current !== newView) {
              // Update the URL without adding to history or triggering a re-render
              const url = new URL(window.location.href);
              url.searchParams.set('view', newView);
              window.history.replaceState({}, '', url.toString());

              // Manually update the state for the navbar highlight
              // This is now safe because we are checking activeViewRef
              setActiveView(newView);
            }
          }
        });
      };

      const observer = new IntersectionObserver(handleIntersect, observerOptions);

      const sections = document.querySelectorAll('#hero-page, #about-us, #contact-us');
      sections.forEach(section => observer.observe(section));

      return () => sections.forEach(section => observer.unobserve(section));
    }
  }, [activeView]); // Re-run if activeView changes (e.g., user navigates away from home)


  const handleNavigation = (item: NavItem) => {
    // Only scroll to top if navigating to a new tool/app view
    if (APP_VIEWS.includes(item)) {
       window.scrollTo({ top: 0, behavior: 'smooth'});
    }
    
    // Always update the URL to trigger the state change
    const url = new URL(window.location.href);
    url.searchParams.set('view', item);
    window.history.pushState({}, '', url.toString());

    // Manually set state to make change feel instant
    if (APP_VIEWS.includes(item)) {
      setActiveView(item);
    } else {
      setActiveView('Home');
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
          <AboutPage />
          <ContactUs />
        </>
      );
  };
  
  const navBarActiveItem = HOME_SECTIONS.includes(activeViewRef.current) 
    ? activeViewRef.current 
    : APP_VIEWS.includes(activeView) ? activeView : 'Home';

  return (
    <div className="flex flex-col min-h-screen bg-background">
        <TopNavBar activeItem={navBarActiveItem} setActiveItem={handleNavigation} />
        <main className="flex-1">
            {renderContent()}
        </main>
    </div>
  )
}
