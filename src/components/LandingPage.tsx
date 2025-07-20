
"use client"

import { useState } from 'react';
import JalSevakApp from './JalSevakApp';
import TopNavBar from './TopNavBar';
import AboutPage from './AboutPage';
import HeroPage from './HeroPage';
import ContactUs from './ContactUs';
import type { NavItem } from './JalSevakApp';

export default function LandingPage() {
  const [activeView, setActiveView] = useState<NavItem>('Home');

  const handleNavigation = (item: NavItem) => {
    setActiveView(item);
  };
  
  const renderContent = () => {
    switch (activeView) {
      case 'Home':
        return (
          <>
            <HeroPage onNavigate={handleNavigation} />
            <AboutPage />
            <ContactUs />
          </>
        );
      case 'About Us':
        return <AboutPage />;
      case 'Contact Us':
        return <ContactUs />;
      case 'Dashboard':
      case 'Irrigation Planner':
      case 'Crop Advisor':
      case 'Soil Advisor':
      case 'Govt. Schemes':
        return <JalSevakApp initialView={activeView} onNavigate={handleNavigation} />;
      default:
        return <HeroPage onNavigate={handleNavigation} />;
    }
  };

  if (['Dashboard', 'Irrigation Planner', 'Crop Advisor', 'Soil Advisor', 'Govt. Schemes'].includes(activeView)) {
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
