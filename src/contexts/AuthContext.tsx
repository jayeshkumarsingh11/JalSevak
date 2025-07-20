
"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  // Display a loading skeleton or splash screen while checking auth state
  if (loading) {
    return (
        <div className="flex flex-col h-screen">
            <header className="bg-background border-b shadow-sm sticky top-0 z-40">
                 <div className="container mx-auto flex h-16 items-center justify-between px-4">
                     <Skeleton className="h-8 w-32" />
                     <div className="hidden md:flex items-center gap-2">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-24" />
                     </div>
                     <Skeleton className="h-10 w-10 rounded-full" />
                 </div>
            </header>
            <main className="flex-1 p-6">
                <Skeleton className="h-full w-full" />
            </main>
        </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
