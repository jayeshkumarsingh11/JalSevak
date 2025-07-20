
"use client";

import * as React from "react";
import { ChevronDown, Leaf } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { NavItem } from "./JalSevakApp";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";

interface TopNavBarProps {
  activeItem: NavItem;
  setActiveItem: (item: NavItem) => void;
  isAppView?: boolean;
}

const navItems: { name: NavItem, key: string, dropdown?: {key: string}[] }[] = [
    { name: "Home", key: "nav_home" },
    { name: "About Us", key: "nav_about_us" },
    { name: "Dashboard", key: "nav_dashboard", dropdown: [{key:"dropdown_overview"}, {key:"dropdown_analytics"}] },
    { name: "Irrigation Planner", key: "nav_irrigation_planner", dropdown: [{key:"dropdown_new_schedule"}, {key:"dropdown_history"}] },
    { name: "Crop Advisor", key: "nav_crop_advisor", dropdown: [{key:"dropdown_get_suggestion"}, {key:"dropdown_my_crops"}] },
    { name: "Soil Advisor", key: "nav_soil_advisor", dropdown: [{key:"dropdown_check_health"}, {key:"dropdown_improvements"}] },
    { name: "Govt. Schemes", key: "nav_govt_schemes", dropdown: [{key:"dropdown_find_schemes"}, {key:"dropdown_my_applications"}] },
];


export default function TopNavBar({ activeItem, setActiveItem, isAppView = false }: TopNavBarProps) {
    const { t } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const filteredNavItems = isAppView ? navItems.filter(item => !['Home'].includes(item.name)) : navItems.filter(item => ['Home', 'About Us', 'Dashboard'].includes(item.name));
    
    return (
    <header className="bg-background border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-4">
                <a href="#" onClick={(e) => { e.preventDefault(); setActiveItem("Home"); }} className="flex items-center gap-2 font-headline text-xl font-semibold text-primary">
                    <Leaf className="h-7 w-7" />
                    <span>JalSevak</span>
                </a>
            </div>
            
            <nav className="hidden md:flex items-center gap-1 bg-primary/20 p-1 rounded-lg">
                {filteredNavItems.map((item) => (
                    item.dropdown && isAppView ? (
                        <DropdownMenu key={item.name}>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant={activeItem === item.name ? "primary" : "ghost"} 
                                className="px-4 py-2 text-sm font-medium"
                                onClick={() => setActiveItem(item.name)}
                            >
                                {t(item.key)}
                                <ChevronDown className="ml-1 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {item.dropdown.map(subItem => (
                                <DropdownMenuItem key={subItem.key}>{t(subItem.key)}</DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button 
                            key={item.name}
                            variant={activeItem === item.name ? "primary" : "ghost"} 
                            className="px-4 py-2 text-sm font-medium"
                            onClick={() => setActiveItem(item.name)}
                        >
                            {t(item.key)}
                        </Button>
                    )
                ))}
            </nav>

            <div className="hidden md:flex items-center gap-2">
                <LanguageToggle />
                <ThemeToggle />
                <Avatar>
                    <AvatarFallback>FP</AvatarFallback>
                </Avatar>
            </div>

            <div className="md:hidden">
                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                    </svg>
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </div>
        </div>
        {isMenuOpen && (
            <div className="md:hidden bg-background border-t">
                <nav className="flex flex-col p-4 gap-2">
                    {filteredNavItems.map((item) => (
                         <Button 
                            key={item.name}
                            variant={activeItem === item.name ? "primary" : "ghost"} 
                            className="w-full justify-start"
                            onClick={() => {
                                setActiveItem(item.name);
                                setIsMenuOpen(false);
                            }}
                        >
                            {t(item.key)}
                        </Button>
                    ))}
                     <div className="border-t pt-4 flex items-center justify-between">
                        <div>
                            <LanguageToggle />
                            <ThemeToggle />
                        </div>
                        <Avatar>
                            <AvatarFallback>FP</AvatarFallback>
                        </Avatar>
                     </div>
                </nav>
            </div>
        )}
    </header>
    );
}
