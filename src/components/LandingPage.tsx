
"use client"

import { useState } from 'react';
import JalSevakApp from './JalSevakApp';
import TopNavBar from './TopNavBar';
import AboutPage from './AboutPage';
import HeroPage from './HeroPage';
import type { NavItem } from './JalSevakApp';

export default function LandingPage() {
  const [activeView, setActiveView] = useState<NavItem>('Home');

  const handleNavigation = (item: NavItem) => {
    setActiveView(item);
  };
  
  const renderContent = () => {
    switch (activeView) {
      case 'Home':
        return <HeroPage onNavigate={handleNavigation} />;
      case 'About Us':
        return <AboutPage />;
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

  // If we are in the main application, render it directly.
  if (['Dashboard', 'Irrigation Planner', 'Crop Advisor', 'Soil Advisor', 'Govt. Schemes'].includes(activeView)) {
    return renderContent();
  }

  // Otherwise, render the landing/marketing page layout.
  return (
    <div className="flex flex-col min-h-screen bg-background">
        <TopNavBar activeItem={activeView} setActiveItem={handleNavigation} isAppView={false} />
        <main className="flex-1">
            {renderContent()}
        </main>
    </div>
  )
}
