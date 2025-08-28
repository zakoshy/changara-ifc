
'use client';
import Link from 'next/link';
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
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarRail
} from '@/components/ui/sidebar';
import { Users, User, LogOut, Calendar, BookOpen, Sparkles, Save } from 'lucide-react';
import { getPastor } from '@/actions/users';
import { useEffect, useState } from 'react';
import type { User as UserType } from '@/lib/types';
import { usePathname, useRouter } from 'next/navigation';
import { ProfileDialog } from '@/components/pastor/profile-dialog';


const UserMenu = ({ pastor }: { pastor: UserType }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
        <Avatar className="h-8 w-8">
          <AvatarImage src={pastor.imageUrl} alt="Pastor" data-ai-hint="pastor portrait"/>
          <AvatarFallback>{pastor.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56" align="end" forceMount>
      <DropdownMenuLabel className="font-normal">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{pastor.name}</p>
          <p className="text-xs leading-none text-muted-foreground">{pastor.email}</p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
       <ProfileDialog user={pastor}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
          </DropdownMenuItem>
      </ProfileDialog>
      <DropdownMenuSeparator />
       <DropdownMenuItem asChild>
        <Link href="/">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const AppLogo = () => (
    <Link href="/pastor/dashboard" className="flex items-center gap-2 text-lg font-semibold" prefetch={false}>
       <div className="bg-primary text-primary-foreground p-2 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.5a.5.5 0 0 0-1 0V5h-2a.5.5 0 0 0 0 1h2v2H9a.5.5 0 0 0 0 1h2v2H9a.5.5 0 0 0 0 1h2v2.5a.5.5 0 0 0 1 0V13h2a.5.5 0 0 0 0-1h-2v-2h2a.5.5 0 0 0 0-1h-2V6h2a.5.5 0 0 0 0-1h-2V2.5zM2.75 7.063C2.22 7.563 2 8.24 2 9v1a1 1 0 0 0 1 1h2v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V10h2a1 1 0 0 0 1-1V9c0-.76-.22-1.437-.75-1.937L12.5 2.023a.5.5 0 0 0-.5 0l-9.25 5.04zM4.688 7.5H19.31L12 3.844 4.688 7.5z"/></svg>
      </div>
      <span className="font-headline text-foreground group-data-[collapsible=icon]:hidden">
        IFC Changara
      </span>
    </Link>
);

export default function PastorDashboardLayout({ children }: { children: React.ReactNode }) {
  const [pastor, setPastor] = useState<UserType | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function fetchPastor() {
      const pastorData = await getPastor();
      setPastor(pastorData);
    }
    fetchPastor();
  }, []);
  
  const handleLogout = () => {
    // In a real app, you'd call an API to invalidate the session.
    // For this prototype, we just redirect.
    router.push('/');
  }

  const getPageTitle = () => {
    if (pathname === '/pastor/dashboard/members') return 'Member Management';
    if (pathname === '/pastor/dashboard/ai-assistant') return 'AI Assistant';
    if (pathname === '/pastor/dashboard/bible') return 'Bible Reader';
    if (pathname === '/pastor/dashboard/creations') return 'Saved Creations';
    if (pathname === '/pastor/dashboard') return 'Events & Teachings';
    return `Welcome, Pastor ${pastor ? pastor.name.split(' ')[0] : ''}`;
  }

  if (!pastor) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
          <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24"></svg>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen w-full">
        <Sidebar className="border-r bg-card" collapsible="icon">
          <SidebarRail />
          <SidebarHeader>
              <AppLogo />
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton href="/pastor/dashboard" tooltip="Dashboard" isActive={pathname === '/pastor/dashboard'}>
                  <Calendar />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/pastor/dashboard/bible" tooltip="Bible" isActive={pathname === '/pastor/dashboard/bible'}>
                  <BookOpen />
                  <span>Bible</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton href="/pastor/dashboard/members" tooltip="Members" isActive={pathname === '/pastor/dashboard/members'}>
                  <Users />
                  <span>Members</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton href="/pastor/dashboard/creations" tooltip="Saved Creations" isActive={pathname === '/pastor/dashboard/creations'}>
                  <Save />
                  <span>Creations</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/pastor/dashboard/ai-assistant" tooltip="AI Assistant" isActive={pathname === '/pastor/dashboard/ai-assistant'}>
                    <Sparkles />
                    <span>AI Assistant</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-2">
             <SidebarMenu>
                 <ProfileDialog user={pastor}>
                    <SidebarMenuButton tooltip="Profile">
                        <Avatar className="h-7 w-7">
                            <AvatarImage src={pastor.imageUrl} alt="Pastor" data-ai-hint="pastor portrait"/>
                            <AvatarFallback>{pastor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{pastor.name}</span>
                    </SidebarMenuButton>
                 </ProfileDialog>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                        <LogOut />
                        <span>Logout</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger />
            <div className="w-full flex-1">
              <h1 className="font-semibold text-lg">{getPageTitle()}</h1>
            </div>
          </header>
          <main className="flex-1 p-4 sm:px-6 sm:py-0 bg-muted/40 min-h-[calc(100vh-60px)]">
            <div className="mx-auto max-w-7xl w-full h-full">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
