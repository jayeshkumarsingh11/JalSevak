
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {

    const footerNavLinks = [
        { name: "Home", href: "/" },
        { name: "Dashboard", href: "/?view=Dashboard" },
        { name: "About Us", href: "/?view=About Us" },
        { name: "Contact Us", href: "/?view=Contact Us" },
    ];

    const footerToolLinks = [
        { name: "Irrigation Planner", href: "/?view=Irrigation Planner" },
        { name: "Crop Advisor", href: "/?view=Crop Advisor" },
        { name: "Soil Advisor", href: "/?view=Soil Advisor" },
        { name: "Govt. Schemes", href: "/?view=Govt. Schemes" },
    ];

    return (
        <footer className="bg-muted/40 border-t">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div className="md:col-span-1 space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-headline font-semibold text-primary">Samriddh Kheti</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Welcome to Samriddh Kheti, your smart farming assistant designed to revolutionize agricultural practices in India by empowering farmers with data-driven insights. Our mission is to optimize resource usage, improve crop yields, and enhance the livelihoods of farmers for a prosperous, sustainable, and food-secure nation.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="font-headline text-lg font-semibold">Quick Links</h3>
                        <ul className="space-y-2">
                            {footerNavLinks.map(link => (
                                <li key={link.name}>
                                    <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Tools Links */}
                    <div className="space-y-4">
                        <h3 className="font-headline text-lg font-semibold">Tools</h3>
                        <ul className="space-y-2">
                            {footerToolLinks.map(link => (
                                <li key={link.name}>
                                    <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter & Socials */}
                    <div className="space-y-4">
                        <h3 className="font-headline text-lg font-semibold">Subscribe to our Newsletter</h3>
                        <p className="text-sm text-muted-foreground">Get the latest updates on agricultural tech and government schemes.</p>
                        <div className="flex w-full max-w-sm items-center space-x-2">
                            <Input type="email" placeholder="Enter your email address" />
                            <Button type="submit">Subscribe</Button>
                        </div>
                        
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
                    <p>© 2025 Team Seedsorrowers. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}
