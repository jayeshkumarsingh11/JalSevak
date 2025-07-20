"use client"

import * as React from "react"
import { Languages } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/LanguageContext"
import { Loader2 } from "lucide-react"

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' }, // Hindi
  { code: 'bn', name: 'বাংলা' }, // Bengali
  { code: 'te', name: 'తెలుగు' }, // Telugu
  { code: 'mr', name: 'मराठी' }, // Marathi
  { code: 'ta', name: 'தமிழ்' }, // Tamil
  { code: 'gu', name: 'ગુજરાતી' }, // Gujarati
  { code: 'kn', name: 'ಕನ್ನಡ' }, // Kannada
  { code: 'pa', name: 'ਪੰਜਾਬੀ' }, // Punjabi
];

export function LanguageToggle() {
  const { setLanguage, loading } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {loading ? (
            <Loader2 className="h-[1.2rem] w-[1.2rem] animate-spin" />
          ) : (
            <Languages className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem key={lang.code} onClick={() => setLanguage(lang.name)}>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
