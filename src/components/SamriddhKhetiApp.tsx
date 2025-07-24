
"use client"

import { useState } from 'react'

import DashboardView from "@/components/DashboardView"
import IrrigationPlanner from "@/components/IrrigationPlanner"
import CropAdvisor from "@/components/CropAdvisor"
import SoilQualityAdvisor from "@/components/SoilQualityAdvisor"
import SchemeFinder from "@/components/SchemeFinder"

export type NavItem = "Dashboard" | "Irrigation Planner" | "Crop Advisor" | "Soil Advisor" | "Govt. Schemes" | "Home" | "About Us" | "Contact Us" | "Tools";

interface SamriddhKhetiAppProps {
  initialView?: NavItem;
  onNavigate: (item: NavItem) => void;
}


export default function SamriddhKhetiApp({ initialView = "Dashboard", onNavigate }: SamriddhKhetiAppProps) {
  const [activeView, setActiveView] = useState<NavItem>(initialView);

  const handleNavigation = (item: NavItem) => {
    if (item === "Home" || item === "About Us" || item === "Contact Us") {
        const url = new URL(window.location.href);
        url.searchParams.set('view', item);
        window.location.href = url.toString().replace(url.origin, '');
    } else {
      setActiveView(item);
       const url = new URL(window.location.href);
       url.searchParams.set('view', item);
       window.history.pushState({}, '', url.toString());
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case "Dashboard":
        return <DashboardView onNavigate={handleNavigation} />;
      case "Irrigation Planner":
        return <IrrigationPlanner />;
      case "Crop Advisor":
        return <CropAdvisor />;
      case "Soil Advisor":
        return <SoilQualityAdvisor />;
      case "Govt. Schemes":
        return <SchemeFinder />;
      default:
        return <DashboardView onNavigate={handleNavigation}/>;
    }
  };

  return (
    <main className="flex-1 p-4 lg:p-6">
      {renderContent()}
    </main>
  )
}
