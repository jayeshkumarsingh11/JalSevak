"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

interface AppHeaderProps {
  title: string;
}

interface User {
  name: string;
  email: string;
}

export default function AppHeader({ title }: AppHeaderProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("jal-sevak-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('');
  };

  const handleLogout = () => {
    localStorage.removeItem("jal-sevak-user");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <SidebarTrigger className="md:hidden" />
      <h1 className="text-xl md:text-2xl font-headline font-semibold">{title}</h1>
      <div className="ml-auto flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
        <Avatar>
          <AvatarImage src="https://placehold.co/40x40.png" alt="@farmer" data-ai-hint="farmer portrait" />
          <AvatarFallback>{user ? getInitials(user.name) : 'FP'}</AvatarFallback>
        </Avatar>
        <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full" aria-label="Log out">
            <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
