"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Header as HeaderType } from "@/types/blocks/header";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";
import LocaleToggle from "@/components/locale/toggle";
import SignToggle from "@/components/sign/toggle";
import ThemeToggle from "@/components/theme/toggle";
import { useRouter } from "next/navigation";

export default function Header({ header }: { header: HeaderType }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  if (header.disabled) {
    return null;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navigationItems = [
    { title: "Home", href: "/", icon: "RiHomeLine" },
    { title: "Tools", href: "/tools", icon: "RiToolsLine" },
    { title: "Blog", href: "/blog", icon: "RiBookOpenLine" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              {header.brand?.logo?.src && (
                <img
                  src={header.brand.logo.src}
                  alt={header.brand.logo.alt || header.brand.title}
                  className="w-8 h-8"
                />
              )}
              <div className="text-2xl font-bold text-blue-700">
                {header.brand?.title || "Gemini CLI Hub"}
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium transition-colors duration-200"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Box */}
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 text-sm border-none rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
              >
                <Icon name="RiSearchLine" className="h-4 w-4" />
              </button>
            </form>

            {/* Theme & Locale Toggles */}
            {header.show_locale && <LocaleToggle />}
            {header.show_theme && <ThemeToggle />}

            {/* Auth Buttons */}
            <Button 
              variant="ghost" 
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 rounded-full"
            >
              Login
            </Button>
            <Button 
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-sm"
            >
              Sign Up
            </Button>
            {header.show_sign && <SignToggle />}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Icon name={isMenuOpen ? "RiCloseLine" : "RiMenuLine"} className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:w-96">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <Link href="/" className="flex items-center gap-2">
                      {header.brand?.logo?.src && (
                        <img
                          src={header.brand.logo.src}
                          alt={header.brand.logo.alt || header.brand.title}
                          className="w-8 h-8"
                        />
                      )}
                      <span className="text-xl font-bold text-blue-700">
                        {header.brand?.title || "Gemini CLI Hub"}
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-4">
                  {/* Mobile Navigation */}
                  <nav className="space-y-2">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon name={item.icon} className="h-5 w-5" />
                        {item.title}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Search */}
                  <div className="pt-4 border-t border-gray-200">
                    <form onSubmit={handleSearch} className="relative mb-4">
                      <Input
                        type="text"
                        placeholder="Search content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm border-none rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                      />
                      <button
                        type="submit"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        <Icon name="RiSearchLine" className="h-4 w-4" />
                      </button>
                    </form>
                    
                    {/* Mobile Auth Buttons */}
                    <div className="flex space-x-3">
                      <Button 
                        variant="outline" 
                        className="flex-1 text-blue-600 border-blue-600 hover:bg-blue-50 rounded-full"
                      >
                        Login
                      </Button>
                      <Button 
                        className="flex-1 text-white bg-blue-600 hover:bg-blue-700 rounded-full"
                      >
                        Sign Up
                      </Button>
                    </div>
                  </div>

                  {/* Mobile Toggles */}
                  <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Settings</span>
                    <div className="flex items-center space-x-3">
                      {header.show_locale && <LocaleToggle />}
                      {header.show_theme && <ThemeToggle />}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
