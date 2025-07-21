
"use client"

import { useState } from 'react'

import DashboardView from "@/components/DashboardView"
import IrrigationPlanner from "@/components/IrrigationPlanner"
import CropAdvisor from "@/components/CropAdvisor"
import SoilQualityAdvisor from "@/components/SoilQualityAdvisor"
import SchemeFinder from "@/components/SchemeFinder"
import TopNavBar from './TopNavBar'

export type NavItem = "Dashboard" | "Irrigation Planner" | "Crop Advisor" | "Soil Advisor" | "Govt. Schemes" | "Home" | "About Us" | "Contact Us";

interface SamriddhKhetiAppProps {
  initialView?: NavItem;
  onNavigate: (item: NavItem) => void;
}


export default function SamriddhKhetiApp({ initialView = "Dashboard", onNavigate }: SamriddhKhetiAppProps) {
  const [activeView, setActiveView] = useState<NavItem>(initialView);

  const handleNavigation = (item: NavItem) => {
    if (item === "Home") {
      onNavigate(item);
    } else {
      setActiveView(item);
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case "Dashboard":
        return <DashboardView />;
      case "Irrigation Planner":
        return <IrrigationPlanner />;
      case "Crop Advisor":
        return <CropAdvisor />;
      case "Soil Advisor":
        return <SoilQualityAdvisor />;
      case "Govt. Schemes":
        return <SchemeFinder />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopNavBar activeItem={activeView} setActiveItem={handleNavigation} isAppView={true} />
      <main className="flex-1 p-4 lg:p-6 animate-slide-up-fade">
        {renderContent()}
      </main>
    </div>
  )
}
