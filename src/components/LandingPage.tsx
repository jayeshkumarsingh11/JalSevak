
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
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    // On initial load, always reset to home view and scroll to top smoothly
    const url = new URL(window.location.href);
    if (url.searchParams.has('view')) {
      url.searchParams.delete('view');
      window.history.replaceState({}, '', url.toString());
    }
    // Let the observer handle setting the active view after scroll
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Set up refs for IntersectionObserver
    sectionRefs.current['Home'] = document.getElementById('hero-page');
    sectionRefs.current['About Us'] = document.getElementById('about-us');
    sectionRefs.current['Contact Us'] = document.getElementById('contact-us');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const view = Object.keys(sectionRefs.current).find(
              (key) => sectionRefs.current[key] === entry.target
            ) as NavItem | undefined;
            if (view && !APP_VIEWS.includes(activeView)) {
              setActiveView(view);
            }
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(sectionRefs.current).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    
    if (HOME_SECTIONS.includes(item)) {
        // If we are on an app page, we need to switch the view first
        if (isCurrentlyOnAppView) {
            setActiveView(item); // This will cause a re-render to show the home sections
            setTimeout(() => {
                const elementId = item === 'Home' ? 'hero-page' : item.toLowerCase().replace(' ', '-');
                const element = document.getElementById(elementId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 50); // A small delay to ensure the section is on the DOM
        } else {
            // If already on a home section, just scroll
            const elementId = item === 'Home' ? 'hero-page' : item.toLowerCase().replace(' ', '-');
            const element = document.getElementById(elementId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    } else {
        // This is for navigating to an app view
        setActiveView(item);
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
