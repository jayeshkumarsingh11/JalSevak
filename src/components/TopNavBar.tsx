
"use client";

import * as React from "react";
import { ChevronDown, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { NavItem } from "./JalSevakApp";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface TopNavBarProps {
  activeItem: NavItem;
  setActiveItem: (item: NavItem) => void;
}

const navItems: { name: NavItem, dropdown: string[] }[] = [
    { name: "Dashboard", dropdown: ["Overview", "Analytics"] },
    { name: "Irrigation Planner", dropdown: ["New Schedule", "History"] },
    { name: "Crop Advisor", dropdown: ["Get Suggestion", "My Crops"] },
    { name: "Soil Advisor", dropdown: ["Check Health", "Improvements"] },
    { name: "Govt. Schemes", dropdown: ["Find Schemes", "My Applications"] },
];


export default function TopNavBar({ activeItem, setActiveItem }: TopNavBarProps) {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
    <header className="bg-background border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-4">
                <a href="#" className="flex items-center gap-2 font-headline text-xl font-semibold text-primary">
                    <Leaf className="h-7 w-7" />
                    <span>JalSevak</span>
                </a>
            </div>
            
            <nav className="hidden md:flex items-center gap-1 bg-primary/20 p-1 rounded-lg">
                {navItems.map((item) => (
                    <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant={activeItem === item.name ? "primary" : "ghost"} 
                            className="px-4 py-2 text-sm font-medium"
                            onClick={() => setActiveItem(item.name)}
                        >
                            {item.name}
                            <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {item.dropdown.map(subItem => (
                            <DropdownMenuItem key={subItem}>{subItem}</DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                    </DropdownMenu>
                ))}
            </nav>

            <div className="hidden md:flex items-center gap-4">
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
                    {navItems.map((item) => (
                         <Button 
                            key={item.name}
                            variant={activeItem === item.name ? "primary" : "ghost"} 
                            className="w-full justify-start"
                            onClick={() => {
                                setActiveItem(item.name);
                                setIsMenuOpen(false);
                            }}
                        >
                            {item.name}
                        </Button>
                    ))}
                     <div className="border-t pt-4 flex items-center justify-between">
                        <ThemeToggle />
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

