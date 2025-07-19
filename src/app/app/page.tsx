"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import JalSevakApp from "@/components/JalSevakApp";
import { useToast } from '@/hooks/use-toast';

export default function AppPage() {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const user = localStorage.getItem("jal-sevak-user");
    if (!user) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Please log in to access the application.",
      });
      router.replace("/login");
    }
  }, [router, toast]);

  // Render a loading state or null while checking for user
  if (typeof window !== 'undefined' && !localStorage.getItem("jal-sevak-user")) {
    return null;
  }

  return <JalSevakApp />;
}
