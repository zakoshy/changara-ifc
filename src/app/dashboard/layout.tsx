
'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut } from 'lucide-react';
import { ProfileDialog } from '@/components/dashboard/profile-dialog';
import { getUserById } from '@/actions/users';
import type { User as UserType } from '@/lib/types';
import { useRouter } from 'next/navigation';


const UserMenu = ({ user }: { user: UserType }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('currentUserEmail');
    router.push('/');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.imageUrl} alt={user.name} data-ai-hint="user profile" />
            <AvatarFallback>{user.name ? user.name.charAt(0) : 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
         <ProfileDialog user={user}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
            </DropdownMenuItem>
        </ProfileDialog>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const AppLogo = () => (
    <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold" prefetch={false}>
       <div className="bg-primary text-primary-foreground p-2 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.5a.5.5 0 0 0-1 0V5h-2a.5.5 0 0 0 0 1h2v2H9a.5.5 0 0 0 0 1h2v2H9a.5.5 0 0 0 0 1h2v2.5a.5.5 0 0 0 1 0V13h2a.5.5 0 0 0 0-1h-2v-2h2a.5.5 0 0 0 0-1h-2V6h2a.5.5 0 0 0 0-1h-2V2.5zM2.75 7.063C2.22 7.563 2 8.24 2 9v1a1 1 0 0 0 1 1h2v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V10h2a1 1 0 0 0 1-1V9c0-.76-.22-1.437-.75-1.937L12.5 2.023a.5.5 0 0 0-.5 0l-9.25 5.04zM4.688 7.5H19.31L12 3.844 4.688 7.5z"/></svg>
      </div>
      <span className="font-headline text-primary">
        IFC Changara
      </span>
    </Link>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const router = useRouter();

  useEffect(() => {
    // This function runs on the client after the component mounts
    async function fetchUser() {
      const userEmail = localStorage.getItem('currentUserEmail');
      if (!userEmail) {
        router.push('/login');
        return;
      }

      try {
        const userData = await getUserById(userEmail); 
        if (userData) {
          setUser(userData);
        } else {
          // If no user is found, the session is invalid.
          localStorage.removeItem('currentUserEmail');
          router.push('/login');
        }
      } catch (error) {
        console.error("Failed to fetch user data, redirecting to login.", error);
        localStorage.removeItem('currentUserEmail');
        router.push('/login');
      }
    }
    fetchUser();
  }, [router]);

  if (!user) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
             <div className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
                <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading user data...
            </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen w-full flex flex-col bg-muted/40">
          <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <AppLogo />
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link href="/dashboard" className="text-foreground font-semibold transition-colors hover:text-foreground">
                    Dashboard
                </Link>
            </nav>
            <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
                {user && <UserMenu user={user} />}
            </div>
          </header>
          <main className="flex-1 p-4 sm:px-6">
            <div className="mx-auto max-w-7xl w-full">
                {React.cloneElement(children as React.ReactElement, { user })}
            </div>
          </main>
      </div>
  );
}
