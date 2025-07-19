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
} from "lucide-react";

import DashboardView from "@/components/DashboardView";
import IrrigationPlanner from "@/components/IrrigationPlanner";
import SchemeFinder from "@/components/SchemeFinder";
import AppHeader from "@/components/AppHeader";

type View = "dashboard" | "planner" | "schemes";

export default function JalSevakApp() {
  const [activeView, setActiveView] = useState<View>("dashboard");

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardView />;
      case "planner":
        return <IrrigationPlanner />;
      case "schemes":
        return <SchemeFinder />;
      default:
        return <DashboardView />;
    }
  };
  
  const getPageTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return 'Dashboard';
      case 'planner':
        return 'Smart Irrigation Planner';
      case 'schemes':
        return 'Government Scheme Finder';
      default:
        return 'Dashboard';
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
            <h1 className="text-2xl font-headline font-semibold">JalSevak</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView("dashboard")}
                isActive={activeView === "dashboard"}
                tooltip="Dashboard"
              >
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView("planner")}
                isActive={activeView === "planner"}
                tooltip="Irrigation Planner"
              >
                <Droplets />
                <span>Irrigation Planner</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView("schemes")}
                isActive={activeView === "schemes"}
                tooltip="Government Schemes"
              >
                <Landmark />
                <span>Government Schemes</span>
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
