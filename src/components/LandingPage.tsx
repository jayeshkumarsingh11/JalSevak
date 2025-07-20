"use client";

import { useState } from "react";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Leaf,
  Search,
  ShoppingCart,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { name: "Home", href: "#", active: true },
    { name: "About Us", href: "#" },
    { name: "Problem", href: "#" },
    { name: "Solution", href: "#" },
    { name: "Crop Advisor", href: "#" },
    { name: "Technologies", href: "#" },
    { name: "Contact", href: "#" },
  ];

  return (
    <div className="bg-jalvaani-light-green min-h-screen">
      <header className="relative z-20">
        {/* Top Information Bar */}
        <div className="bg-white text-gray-600 text-sm py-2">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <MapPin size={16} />
                <span>San Francisco</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail size={16} />
                <span>info@jalvaani.com</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone size={16} />
                <span>(704) 555-0127</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock size={16} />
                <span>Mon - Sat: 9am - 6pm</span>
              </div>
            </div>
            <div className="text-gray-600">Natural organic farm.</div>
            <div className="flex items-center space-x-4">
              <button className="text-sm">EN</button>
              <div className="flex space-x-3">
                <a href="#" className="hover:text-jalvaani-green"><Facebook size={16} /></a>
                <a href="#" className="hover:text-jalvaani-green"><Twitter size={16} /></a>
                <a href="#" className="hover:text-jalvaani-green"><Instagram size={16} /></a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <nav className="container mx-auto px-4 py-3">
          <div className="bg-white rounded-full flex justify-between items-center shadow-md">
            {/* Logo Section */}
            <div className="flex items-center bg-jalvaani-green text-white rounded-full px-6 py-2">
              <Leaf size={32} className="mr-2" />
              <span className="text-2xl font-bold font-headline">JalVaani</span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    link.active
                      ? "bg-jalvaani-yellow text-jalvaani-green"
                      : "text-gray-700 hover:text-jalvaani-green"
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Right Section */}
            <div className="hidden md:flex items-center space-x-4 px-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-gray-100 rounded-full pl-4 pr-10 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-jalvaani-green"
                />
                <Search
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
              </div>
              <button className="relative">
                <ShoppingCart size={24} />
                <span className="absolute -top-1 -right-1 bg-jalvaani-yellow text-jalvaani-green text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  2
                </span>
              </button>
              <button className="flex items-center bg-jalvaani-green text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-90">
                Get Started <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden pr-4">
                <button onClick={toggleMobileMenu}>
                    <Menu size={28} className="text-jalvaani-green" />
                </button>
            </div>
          </div>
        </nav>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
            <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMobileMenu}>
                <div 
                    className="fixed top-0 left-0 h-full w-3/4 max-w-sm bg-white shadow-lg p-6 z-50 transform transition-transform duration-300 ease-in-out"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center text-jalvaani-green">
                           <Leaf size={28} className="mr-2" />
                           <span className="text-2xl font-bold font-headline">JalVaani</span>
                        </div>
                        <button onClick={toggleMobileMenu}>
                            <X size={28} className="text-jalvaani-green"/>
                        </button>
                    </div>
                    <nav className="flex flex-col space-y-4">
                         {navLinks.map((link) => (
                            <a
                              key={link.name}
                              href={link.href}
                              className={`px-4 py-3 rounded-full text-lg font-medium transition-colors ${
                                link.active
                                  ? "bg-jalvaani-yellow text-jalvaani-green"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {link.name}
                            </a>
                          ))}
                    </nav>
                    <div className="mt-8 pt-6 border-t">
                        <button className="w-full flex items-center justify-center bg-jalvaani-green text-white px-4 py-3 rounded-full text-lg font-medium hover:bg-opacity-90">
                            Get Started <ChevronRight size={20} className="ml-1" />
                        </button>
                    </div>
                </div>
            </div>
        )}

      </header>
      
      <main className="container mx-auto px-4 py-16 text-center hero-bg rounded-lg mt-[-5rem] pt-32 pb-20">
            <div className="bg-white bg-opacity-75 p-8 rounded-lg inline-block">
                <h1 className="text-5xl md:text-7xl font-bold text-jalvaani-green font-headline">JalVaani</h1>
                <p className="text-xl md:text-2xl text-gray-700 mt-4">Smart Irrigation for a Sustainable Future</p>
            </div>
        </main>
    </div>
  );
}
