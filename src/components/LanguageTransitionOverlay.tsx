
"use client";

import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageTransitionOverlayProps {
  loading: boolean;
}

export default function LanguageTransitionOverlay({ loading }: LanguageTransitionOverlayProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-300",
        loading ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <Languages className="h-16 w-16 animate-pulse text-primary" />
    </div>
  );
}
