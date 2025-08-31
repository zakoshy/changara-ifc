
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
  SidebarRail
} from '@/components/ui/sidebar';
import { Users, User, LogOut, Calendar, BookOpen, Sparkles, Save, PanelLeft } from 'lucide-react';
import { getPastor } from '@/actions/users';
import { useEffect, useState } from 'react';
import type { User as UserType } from '@/lib/types';
import { usePathname, useRouter } from 'next/navigation';
import { ProfileDialog } from '@/components/pastor/profile-dialog';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';


const UserMenu = ({ pastor }: { pastor: UserType }) => {
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
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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

const sidebarNavItems = [
    { href: "/pastor/dashboard", icon: <Calendar />, label: "Dashboard", tooltip: "Dashboard" },
    { href: "/pastor/dashboard/bible", icon: <BookOpen />, label: "Bible", tooltip: "Bible" },
    { href: "/pastor/dashboard/members", icon: <Users />, label: "Members", tooltip: "Members" },
    { href: "/pastor/dashboard/creations", icon: <Save />, label: "Creations", tooltip: "Saved Creations" },
    { href: "/pastor/dashboard/ai-assistant", icon: <Sparkles />, label: "AI Assistant", tooltip: "AI Assistant" },
];

export default function PastorDashboardLayout({ children }: { children: React.ReactNode }) {
  const [pastor, setPastor] = useState<UserType | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function fetchPastor() {
      const pastorData = await getPastor();
      if (pastorData) {
        setPastor(pastorData);
      } else {
        router.push('/pastor/login');
      }
    }
    fetchPastor();
  }, [router]);
  
  const handleLogout = () => {
    router.push('/');
  }

  if (!pastor) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
          <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen w-full">
        <Sidebar className="border-r bg-background" collapsible="icon">
          <SidebarRail />
          <SidebarHeader>
              <AppLogo />
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              {sidebarNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <SidebarMenuButton asChild tooltip={item.tooltip} isActive={pathname === item.href}>
                        <a>
                            {item.icon}
                            <span>{item.label}</span>
                        </a>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
           <SidebarFooter className="p-2">
             <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                        <LogOut />
                        <span>Logout</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
           <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs">
                 <nav className="grid gap-6 text-lg font-medium">
                    <AppLogo/>
                    {sidebarNavItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-4 px-2.5 ${pathname === item.href ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                          {item.icon}
                          {item.label}
                      </Link>
                    ))}
                  </nav>
              </SheetContent>
            </Sheet>
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-auto">
              {sidebarNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${pathname === item.href ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="relative ml-auto flex-1 md:grow-0">
               {/* This space can be used for a search bar if needed in the future */}
            </div>
            {pastor && <UserMenu pastor={pastor} />}
          </header>
          <main className="flex flex-1 flex-col p-4 sm:px-6 sm:py-0 bg-muted/40 min-h-[calc(100vh-60px)]">
            <div className="mx-auto max-w-7xl w-full h-full flex-1">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
