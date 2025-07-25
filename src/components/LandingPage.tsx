
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

  // Scroll spy for home page sections
  useEffect(() => {
    // Do not run the observer if we are on an app view
    if (APP_VIEWS.includes(activeView)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            let newActiveView: NavItem;
            if (id === 'hero-page') {
              newActiveView = 'Home';
            } else if (id === 'about-us') {
              newActiveView = 'About Us';
            } else if (id === 'contact-us') {
              newActiveView = 'Contact Us';
            } else {
              return;
            }
            
            // Only update if the view has changed
            setActiveView(prev => {
              if (prev !== newActiveView) {
                const url = new URL(window.location.href);
                if (newActiveView === 'Home') {
                  url.searchParams.delete('view');
                } else {
                  url.searchParams.set('view', newActiveView);
                }
                // Use replaceState to not pollute browser history with scroll changes
                window.history.replaceState({}, '', url.toString());
              }
              return newActiveView;
            });
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' } // Trigger when the section is in the middle of the screen
    );

    const sections = document.querySelectorAll('#hero-page, #about-us, #contact-us');
    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, [activeView]);


  useEffect(() => {
    // On initial load, determine view from URL or default to Home.
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      const urlParams = new URLSearchParams(window.location.search);
      const viewFromUrl = urlParams.get('view') as NavItem | null;

      if (viewFromUrl && (APP_VIEWS.includes(viewFromUrl) || HOME_SECTIONS.includes(viewFromUrl))) {
        setActiveView(viewFromUrl);
        // If the URL has a section, scroll to it.
        if (HOME_SECTIONS.includes(viewFromUrl)) {
             setTimeout(() => {
              const elementId = viewFromUrl === 'Home' ? 'hero-page' : viewFromUrl.toLowerCase().replace(' ', '-');
              document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
      } else {
        setActiveView('Home');
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
    
    // Use pushState to add to browser history for meaningful navigation changes.
    window.history.pushState({}, '', url.toString());
    
    // Set state to make change feel instant for app views or when coming from an app view
    setActiveView(item);
    
    // If the item is a section on the home page, scroll to it.
    if (HOME_SECTIONS.includes(item)) {
        // Use a small timeout to allow React to re-render the home page components if needed.
        setTimeout(() => {
            const elementId = item === 'Home' ? 'hero-page' : item.toLowerCase().replace(' ', '-');
            const element = document.getElementById(elementId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, isCurrentlyOnAppView ? 50 : 0);
    } else {
        // For app views, scroll to the top.
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
