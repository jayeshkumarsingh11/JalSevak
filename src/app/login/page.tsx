
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import TopNavBar from "@/components/TopNavBar";
import { useRouter } from "next/navigation";
import type { NavItem } from "@/components/JalSevakApp";

export default function LoginPage() {
  const [activeView, setActiveView] = useState<NavItem>('Home');
  const router = useRouter();
  
  const handleNavigation = (item: NavItem) => {
    setActiveView(item);
    if(item === 'Home') {
      router.push('/');
    } else {
      router.push(`/#${item.toLowerCase().replace(' ', '-')}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopNavBar activeItem={activeView} setActiveItem={handleNavigation} isAppView={false} />
      <main className="flex-1 flex items-center justify-center">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="ml-auto inline-block text-sm underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
