
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import TopNavBar from "@/components/TopNavBar";
import { useRouter } from "next/navigation";
import type { NavItem } from "@/components/JalSevakApp";
import { auth } from "@/lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";


export default function RegisterPage() {
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

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/?view=Dashboard'); // Redirect to dashboard after signup
    } catch (error) {
      console.error("Error during Google sign up:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
       <TopNavBar activeItem={activeView} setActiveItem={handleNavigation} isAppView={false} />
       <main className="flex-1 flex items-center justify-center">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input id="first-name" placeholder="Max" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input id="last-name" placeholder="Robinson" required />
                </div>
              </div>
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
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
              </div>
              <Button type="submit" className="w-full">
                Create an account
              </Button>
              <Button variant="outline" className="w-full" onClick={handleGoogleSignUp}>
                Sign up with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
