"use client";

import { useState } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Droplets,
  Landmark,
  Leaf,
  BrainCircuit,
  TestTube2
} from "lucide-react";

import DashboardView from "@/components/DashboardView";
import IrrigationPlanner from "@/components/IrrigationPlanner";
import SchemeFinder from "@/components/SchemeFinder";
import CropAdvisor from "@/components/CropAdvisor";
import AppHeader from "@/components/AppHeader";
import SoilQualityAdvisor from "@/components/SoilQualityAdvisor";
import { useTranslations } from "next-intl";

type View = "dashboard" | "planner" | "schemes" | "advisor" | "soil";

export default function JalSevakApp() {
  const [activeView, setActiveView] = useState<View>("dashboard");
  const t = useTranslations('JalSevakApp');

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardView />;
      case "planner":
        return <IrrigationPlanner />;
      case "schemes":
        return <SchemeFinder />;
      case "advisor":
        return <CropAdvisor />;
      case "soil":
        return <SoilQualityAdvisor />;
      default:
        return <DashboardView />;
    }
  };
  
  const getPageTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return t('page_title_dashboard');
      case 'planner':
        return t('page_title_planner');
      case 'schemes':
        return t('page_title_schemes');
      case 'advisor':
        return t('page_title_advisor');
      case 'soil':
        return t('page_title_soil');
      default:
        return t('page_title_dashboard');
    }
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
              <Leaf className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-headline font-semibold">{t('title')}</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView("dashboard")}
                isActive={activeView === "dashboard"}
                tooltip={t('dashboard')}
              >
                <LayoutDashboard />
                <span>{t('dashboard')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView("advisor")}
                isActive={activeView === "advisor"}
                tooltip={t('crop_advisor')}
              >
                <BrainCircuit />
                <span>{t('crop_advisor')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView("planner")}
                isActive={activeView === "planner"}
                tooltip={t('irrigation_planner')}
              >
                <Droplets />
                <span>{t('irrigation_planner')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView("soil")}
                isActive={activeView === "soil"}
                tooltip={t('soil_quality')}
              >
                <TestTube2 />
                <span>{t('soil_quality')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView("schemes")}
                isActive={activeView === "schemes"}
                tooltip={t('government_schemes')}
              >
                <Landmark />
                <span>{t('government_schemes')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           {/* Pro upgrade banner removed */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <AppHeader title={getPageTitle()} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
