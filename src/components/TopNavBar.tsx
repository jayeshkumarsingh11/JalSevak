
"use client";

import Image from "next/image";
import * as React from "react";
import { Button } from "@/components/ui/button";
import type { NavItem } from "./SamriddhKhetiApp";
import { ThemeToggle } from "./ThemeToggle";
import image from "@/components/images/logo.png"
import { useLanguage } from "@/contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Languages } from "lucide-react";

interface TopNavBarProps {
  activeItem: NavItem;
  setActiveItem: (item: NavItem) => void;
  isAppView?: boolean;
}

const navItems: { nameKey: NavItem, isAppViewOnly?: boolean, isMarketingViewOnly?: boolean }[] = [
    { nameKey: "Home" },
    { nameKey: "Dashboard" },
    { nameKey: "About Us", isMarketingViewOnly: true },
    { nameKey: "Contact Us", isMarketingViewOnly: true },
    { nameKey: "Irrigation Planner", isAppViewOnly: true },
    { nameKey: "Crop Advisor", isAppViewOnly: true },
    { nameKey: "Soil Advisor", isAppViewOnly: true },
    { nameKey: "Govt. Schemes", isAppViewOnly: true },
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
    const { language, setLanguage, t } = useLanguage();

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

    const filteredNavItems = isAppView 
        ? navItems.filter(item => item.nameKey !== 'Home' && !item.isMarketingViewOnly) 
        : navItems.filter(item => !item.isAppViewOnly);
    
    const navItemMap: Record<NavItem, string> = {
        "Home": "nav_home",
        "Dashboard": "nav_dashboard",
        "Irrigation Planner": "nav_irrigation_planner",
        "Crop Advisor": "nav_crop_advisor",
        "Soil Advisor": "nav_soil_advisor",
        "Govt. Schemes": "nav_govt_schemes",
        "About Us": "nav_about_us",
        "Contact Us": "nav_contact_us",
    }

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
            </nav>

            <div className="hidden md:flex items-center gap-2">
                 <Select onValueChange={handleLanguageChange} defaultValue="en">
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
                     <div className="border-t pt-4 mt-2 flex items-center gap-2">
                        <ThemeToggle />
                        <Select onValueChange={handleLanguageChange} defaultValue="en">
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
