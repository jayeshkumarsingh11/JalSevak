
"use client"

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import JalSevakApp from './JalSevakApp';
import TopNavBar from './TopNavBar';
import AboutPage from './AboutPage';
import HeroPage from './HeroPage';
import ContactUs from './ContactUs';
import type { NavItem } from './JalSevakApp';
import { useAuth } from '@/contexts/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [activeView, setActiveView] = useState<NavItem>('Home');

  useEffect(() => {
    const viewFromUrl = searchParams.get('view') as NavItem;
    if (viewFromUrl && user) {
        setActiveView(viewFromUrl);
    } else if (!user) {
        setActiveView('Home');
    }
  }, [searchParams, user]);


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
    if (user) {
      switch (activeView) {
        case 'Dashboard':
        case 'Irrigation Planner':
        case 'Crop Advisor':
        case 'Soil Advisor':
        case 'Govt. Schemes':
          return <JalSevakApp initialView={activeView} onNavigate={handleNavigation} />;
        default:
          return <JalSevakApp initialView={'Dashboard'} onNavigate={handleNavigation} />;
      }
    } else {
        return (
          <>
            <HeroPage onNavigate={handleNavigation} onLearnMoreClick={handleLearnMoreClick} />
            <AboutPage />
            <ContactUs />
          </>
        );
    }
  };
  
  const isAppView = user && ['Dashboard', 'Irrigation Planner', 'Crop Advisor', 'Soil Advisor', 'Govt. Schemes'].includes(activeView);

  if (isAppView) {
    return renderContent();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
        <TopNavBar activeItem={activeView} setActiveItem={handleNavigation} isAppView={false} />
        <main className="flex-1">
            {renderContent()}
        </main>
    </div>
  )
}
