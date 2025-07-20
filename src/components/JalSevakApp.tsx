"use client"

import { useState } from 'react'

import AppHeader from "@/components/AppHeader"
import Sidebar from "@/components/Sidebar"
import DashboardView from "@/components/DashboardView"
import IrrigationPlanner from "@/components/IrrigationPlanner"
import CropAdvisor from "@/components/CropAdvisor"
import SoilQualityAdvisor from "@/components/SoilQualityAdvisor"
import SchemeFinder from "@/components/SchemeFinder"
import type { NavItem } from "@/components/Sidebar"

export default function JalSevakApp() {
  const [activeView, setActiveView] = useState<NavItem>("Dashboard");

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
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-sidebar md:block">
        <Sidebar activeItem={activeView} setActiveItem={setActiveView} />
      </div>
      <div className="flex flex-col">
        <AppHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/40">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
