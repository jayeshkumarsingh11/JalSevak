
"use client";

import * as React from "react";
import Link from "next/link";
import { Leaf, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NavItem } from "./JalSevakApp";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


interface TopNavBarProps {
  activeItem: NavItem;
  setActiveItem: (item: NavItem) => void;
  isAppView?: boolean;
}

const navItems: { name: NavItem, key: string, isAppViewOnly?: boolean, isMarketingViewOnly?: boolean }[] = [
    { name: "Home", key: "nav_home" },
    { name: "Dashboard", key: "nav_dashboard" },
    { name: "About Us", key: "nav_about_us", isMarketingViewOnly: true },
    { name: "Contact Us", key: "nav_contact_us", isMarketingViewOnly: true },
    { name: "Irrigation Planner", key: "nav_irrigation_planner", isAppViewOnly: true },
    { name: "Crop Advisor", key: "nav_crop_advisor", isAppViewOnly: true },
    { name: "Soil Advisor", key: "nav_soil_advisor", isAppViewOnly: true },
    { name: "Govt. Schemes", key: "nav_govt_schemes", isAppViewOnly: true },
];

export default function TopNavBar({ activeItem, setActiveItem, isAppView = false }: TopNavBarProps) {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

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
    
    const handleLogout = async () => {
      await auth.signOut();
      setActiveItem("Home");
    };

    const filteredNavItems = isAppView 
        ? navItems.filter(item => item.name !== 'Home' && !item.isMarketingViewOnly) 
        : navItems.filter(item => !item.isAppViewOnly);
    
    return (
    <header className="bg-background/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-4">
                <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick("Home"); }} className="flex items-center gap-2 font-headline text-xl font-semibold text-primary">
                    <Leaf className="h-7 w-7" />
                    <span>JalSevak</span>
                </a>
            </div>
            
            <nav className="hidden md:flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
                {filteredNavItems.map((item) => {
                     // Only render Dashboard button if user is logged in
                    if (item.name === 'Dashboard' && !user) {
                        return null;
                    }
                    return (
                         <Button 
                            key={item.name}
                            variant={activeItem === item.name ? "default" : "ghost"} 
                            className="px-4 py-2 text-sm font-medium transition-colors duration-200"
                            onClick={() => handleNavClick(item.name)}
                        >
                            {t(item.key)}
                        </Button>
                    )
                })}
            </nav>

            <div className="hidden md:flex items-center gap-2">
                <LanguageToggle />
                {user ? (
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                           <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                          <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.displayName}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                    <Button asChild>
                        <Link href="/login">{t('nav_login')}</Link>
                    </Button>
                )}
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
                    {filteredNavItems.map((item) => {
                        // Only render Dashboard button if user is logged in
                        if (item.name === 'Dashboard' && !user) {
                            return null;
                        }
                        return (
                             <Button 
                                key={item.name}
                                variant={activeItem === item.name ? "default" : "ghost"} 
                                className="w-full justify-start"
                                onClick={() => handleNavClick(item.name)}
                            >
                                {t(item.key)}
                            </Button>
                        )
                    })}
                     <div className="border-t pt-4 mt-2 flex flex-col gap-2">
                        {user ? (
                           <Button onClick={handleLogout} className="w-full justify-start">
                             <LogOut className="mr-2 h-4 w-4" />
                             <span>Log out</span>
                           </Button>
                        ) : (
                           <Button asChild>
                                <Link href="/login" className="w-full justify-start">{t('nav_login')}</Link>
                           </Button>
                        )}
                        <div className="mt-2">
                            <LanguageToggle />
                        </div>
                     </div>
                </nav>
            </div>
        )}
    </header>
    );
}
