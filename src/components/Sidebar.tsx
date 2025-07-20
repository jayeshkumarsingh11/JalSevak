"use client";

import { Leaf, Droplets, Wheat, Sprout, Landmark, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type NavItem = "Dashboard" | "Irrigation Planner" | "Crop Advisor" | "Soil Advisor" | "Govt. Schemes";

interface SidebarProps {
  activeItem?: NavItem;
  setActiveItem?: (item: NavItem) => void;
  className?: string;
}

const navItems: { name: NavItem; icon: React.ElementType }[] = [
  { name: "Dashboard", icon: BarChart3 },
  { name: "Irrigation Planner", icon: Droplets },
  { name: "Crop Advisor", icon: Wheat },
  { name: "Soil Advisor", icon: Sprout },
  { name: "Govt. Schemes", icon: Landmark },
];

export default function Sidebar({ activeItem, setActiveItem, className }: SidebarProps) {
  return (
    <div className={cn("flex h-full max-h-screen flex-col gap-2", className)}>
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <a href="/" className="flex items-center gap-2 font-headline text-lg font-semibold">
          <Leaf className="h-6 w-6 text-primary" />
          <span>JalSevak</span>
        </a>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant={activeItem === item.name ? "primary" : "ghost"}
              className="justify-start gap-3 px-3 my-1"
              onClick={() => setActiveItem && setActiveItem(item.name)}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
}
