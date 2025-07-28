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
} from '@/components/ui/sidebar';
import { Users, User, LogOut } from 'lucide-react';

const UserMenu = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://placehold.co/40x40.png" alt="Pastor" data-ai-hint="pastor portrait"/>
          <AvatarFallback>P</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56" align="end" forceMount>
      <DropdownMenuLabel className="font-normal">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">Pastor</p>
          <p className="text-xs leading-none text-muted-foreground">pastor@example.com</p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <User className="mr-2 h-4 w-4" />
        <span>Profile</span>
      </DropdownMenuItem>
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
      <span className="font-headline text-foreground group-data-[collapsible=icon]:hidden">
        IFC Changara
      </span>
    </Link>
);

export default function PastorDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full">
        <Sidebar className="border-r bg-card" collapsible="icon">
          <SidebarHeader>
              <AppLogo />
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton href="/pastor/dashboard" tooltip="Members" isActive>
                  <Users />
                  <span>Members</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            {/* Can add items here later */}
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger className="md:hidden"/>
            <div className="w-full flex-1">
              <h1 className="font-semibold text-lg">Pastor Dashboard</h1>
            </div>
            <UserMenu />
          </header>
          <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8 bg-muted/40">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
