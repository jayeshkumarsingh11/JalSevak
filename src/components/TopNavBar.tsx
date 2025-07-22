
"use client";

import Image from "next/image";
import * as React from "react";
import { Button } from "@/components/ui/button";
import type { NavItem } from "./SamriddhKhetiApp";
import { ThemeToggle } from "./ThemeToggle";
import image from "@/components/images/logo.png"
import { useLanguage } from "@/contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Languages, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface TopNavBarProps {
  activeItem: NavItem;
  setActiveItem: (item: NavItem) => void;
  isAppView?: boolean; // This prop is no longer used but kept to avoid breaking changes if it was used elsewhere.
}

const navItems: NavItem[] = ["Home", "About Us", "Contact Us", "Dashboard"];

const toolNavItems: NavItem[] = [
    "Irrigation Planner",
    "Crop Advisor",
    "Soil Advisor",
    "Govt. Schemes",
];

const languageOptions = [
    { name: 'English', code: 'en' },
    { name: 'हिंदी', code: 'hi' }, // Hindi
    { name: 'தமிழ்', code: 'ta' }, // Tamil
    { name: 'తెలుగు', code: 'te' }, // Telugu
    { name: 'ಕನ್ನಡ', code: 'kn' }, // Kannada
    { name: 'ਪੰਜਾਬੀ', code: 'pa' }, // Punjabi
];

export default function TopNavBar({ activeItem, setActiveItem }: TopNavBarProps) {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const { t, languageCode, setLanguage } = useLanguage();

    const handleScroll = (targetId: string) => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const handleNavClick = (item: NavItem) => {
        setActiveItem(item);
        if(item === "About Us") {
            setTimeout(() => handleScroll('about-us'), 0);
        } else if (item === "Contact Us") {
            setTimeout(() => handleScroll('contact-us'), 0);
        }
        setIsMenuOpen(false);
    }
    
    const handleLanguageChange = (code: string) => {
        const selectedLang = languageOptions.find(l => l.code === code);
        if (selectedLang) {
            setLanguage(selectedLang.name, selectedLang.code);
        }
    };

    const navItemMap: Record<NavItem, string> = {
        "Home": "nav_home",
        "Dashboard": "nav_dashboard",
        "Irrigation Planner": "nav_irrigation_planner",
        "Crop Advisor": "nav_crop_advisor",
        "Soil Advisor": "nav_soil_advisor",
        "Govt. Schemes": "nav_govt_schemes",
        "About Us": "nav_about_us",
        "Contact Us": "nav_contact_us",
        "Tools": "nav_tools",
    };
    
    const isToolActive = toolNavItems.some(item => item === activeItem);

    return (
    <header className="bg-background/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-4">
                <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick("Home"); }} className="flex items-center gap-2 font-headline text-xl font-semibold text-primary">
                <Image
                    src={image}
                    alt="A vibrant corn field at sunset with a dramatic cloudy sky"
                    style={{
                        width: "50px",
                        height: "50px"
                    }}
                    className="z-0"
                    data-ai-hint="corn field"
                    priority
                />
                <span>Samriddh Kheti</span>
                </a>
            </div>
            
            <nav className="hidden md:flex items-center gap-2">
                {navItems.map((item) => (
                    <Button 
                        key={item}
                        variant={activeItem === item ? "secondary" : "ghost"} 
                        onClick={() => handleNavClick(item)}
                    >
                        {t(navItemMap[item])}
                    </Button>
                ))}
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={isToolActive ? "secondary" : "ghost"}>
                            {t('nav_tools')}
                            <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {toolNavItems.map((item) => (
                            <DropdownMenuItem key={item} onClick={() => handleNavClick(item)}>
                                {t(navItemMap[item])}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </nav>

            <div className="hidden md:flex items-center gap-2">
                 <Select onValueChange={handleLanguageChange} value={languageCode}>
                    <SelectTrigger className="w-auto gap-2">
                        <Languages className="h-4 w-4" />
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                        {languageOptions.map(lang => (
                            <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <ThemeToggle />
            </div>

            <div className="md:hidden">
                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <ChevronDown className="h-6 w-6" />
                </Button>
            </div>
        </div>
        {isMenuOpen && (
            <div className="md:hidden bg-background/95 pb-4">
                <nav className="flex flex-col items-center gap-2 px-4">
                    {navItems.map((item) => (
                         <Button 
                            key={item}
                            variant={activeItem === item ? "secondary" : "ghost"} 
                            onClick={() => handleNavClick(item)}
                            className="w-full"
                        >
                            {t(navItemMap[item])}
                        </Button>
                    ))}
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={isToolActive ? "secondary" : "ghost"} className="w-full">
                                {t('nav_tools')}
                                <ChevronDown className="relative top-[1px] ml-1 h-3 w-3" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="w-56">
                            {toolNavItems.map((item) => (
                                <DropdownMenuItem key={item} onClick={() => handleNavClick(item)}>
                                    {t(navItemMap[item])}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="flex items-center gap-2 pt-4">
                        <Select onValueChange={handleLanguageChange} value={languageCode}>
                            <SelectTrigger className="w-auto gap-2">
                                <Languages className="h-4 w-4" />
                                <SelectValue placeholder="Language" />
                            </SelectTrigger>
                            <SelectContent>
                                {languageOptions.map(lang => (
                                    <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <ThemeToggle />
                    </div>
                </nav>
            </div>
        )}
    </header>
  );
}
