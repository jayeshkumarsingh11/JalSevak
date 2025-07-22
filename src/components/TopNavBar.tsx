
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
  isAppView?: boolean;
}

const mainNavItems: { nameKey: NavItem, isMarketingViewOnly?: boolean }[] = [
    { nameKey: "Home" },
    { nameKey: "Dashboard" },
    { nameKey: "About Us", isMarketingViewOnly: true },
    { nameKey: "Contact Us", isMarketingViewOnly: true },
];

const toolNavItems: { nameKey: NavItem }[] = [
    { nameKey: "Irrigation Planner" },
    { nameKey: "Crop Advisor" },
    { nameKey: "Soil Advisor" },
    { nameKey: "Govt. Schemes" },
];

const languageOptions = [
    { name: 'English', code: 'en' },
    { name: 'हिंदी', code: 'hi' }, // Hindi
    { name: 'தமிழ்', code: 'ta' }, // Tamil
    { name: 'తెలుగు', code: 'te' }, // Telugu
    { name: 'ಕನ್ನಡ', code: 'kn' }, // Kannada
    { name: 'ਪੰਜਾਬੀ', code: 'pa' }, // Punjabi
];

export default function TopNavBar({ activeItem, setActiveItem, isAppView = false }: TopNavBarProps) {
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

    const getFilteredNavItems = () => {
        if (isAppView) {
            return mainNavItems.filter(item => item.nameKey !== 'Home' && !item.isMarketingViewOnly);
        }
        return mainNavItems.filter(item => item.nameKey !== 'Dashboard');
    }

    const filteredNavItems = getFilteredNavItems();
    const isToolActive = toolNavItems.some(item => item.nameKey === activeItem);

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
                {filteredNavItems.map((item) => (
                    <Button 
                        key={item.nameKey}
                        variant={activeItem === item.nameKey ? "secondary" : "ghost"} 
                        onClick={() => handleNavClick(item.nameKey)}
                    >
                        {t(navItemMap[item.nameKey])}
                    </Button>
                ))}
                {isAppView && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={isToolActive ? "secondary" : "ghost"}>
                                {t('nav_tools')}
                                <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {toolNavItems.map((item) => (
                                <DropdownMenuItem key={item.nameKey} onClick={() => handleNavClick(item.nameKey)}>
                                    {t(navItemMap[item.nameKey])}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
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
                            key={item.nameKey}
                            variant={activeItem === item.nameKey ? "secondary" : "ghost"} 
                            className="w-full justify-start"
                            onClick={() => handleNavClick(item.nameKey)}
                        >
                            {t(navItemMap[item.nameKey])}
                        </Button>
                    ))}
                    {isAppView && (
                        <div className="border-t pt-2 mt-2">
                            <h3 className="px-4 py-2 text-sm font-semibold text-muted-foreground">{t('nav_tools')}</h3>
                            {toolNavItems.map((item) => (
                                <Button 
                                    key={item.nameKey}
                                    variant={activeItem === item.nameKey ? "secondary" : "ghost"} 
                                    className="w-full justify-start"
                                    onClick={() => handleNavClick(item.nameKey)}
                                >
                                    {t(navItemMap[item.nameKey])}
                                </Button>
                            ))}
                        </div>
                    )}
                     <div className="border-t pt-4 mt-2 flex items-center gap-2">
                        <ThemeToggle />
                        <Select onValueChange={handleLanguageChange} value={languageCode}>
                            <SelectTrigger className="w-full gap-2">
                                <Languages className="h-4 w-4" />
                                <SelectValue placeholder="Language" />
                            </SelectTrigger>
                            <SelectContent>
                                {languageOptions.map(lang => (
                                    <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                     </div>
                </nav>
            </div>
        )}
    </header>
    );
}
