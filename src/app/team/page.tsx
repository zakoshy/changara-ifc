
import { getTeamMembers } from "@/actions/team";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { ArrowRight } from "lucide-react";

const TeamPageHeader = () => (
  <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
      <Link href="/" className="flex items-center gap-2 font-bold">
        <span className="font-headline">IFC Changara</span>
      </Link>
      <nav className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Sign Up <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </nav>
    </div>
  </header>
);

export default async function TeamPage() {
    const teamMembers = await getTeamMembers();

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <TeamPageHeader />
            <main className="flex-1">
                <section className="py-20 md:py-24">
                    <div className="container">
                        <div className="text-center mb-12">
                             <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">Our Leadership Team</h1>
                             <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                                Meet the dedicated individuals serving our church and community with passion and commitment.
                            </p>
                        </div>
                        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center">
                            {teamMembers.length > 0 ? (
                                teamMembers.map(member => (
                                    <div key={member.id} className="flex flex-col items-center gap-4 text-center">
                                        <Avatar className="h-36 w-36 border-4 border-background shadow-lg">
                                            <AvatarImage src={member.imageUrl} alt={member.name} data-ai-hint="team member portrait"/>
                                            <AvatarFallback className="text-5xl">{member.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="text-xl font-bold font-headline">{member.name}</h3>
                                            <p className="text-primary">{member.position}</p>
                                        </div>
                                    </div>
                                ))
                            ): (
                                <p className="text-muted-foreground col-span-full text-center">The church leadership team has not been set up yet.</p>
                            )}
                        </div>
                    </div>
                </section>
            </main>
            <footer className="bg-muted/40 border-t">
                <div className="container py-6 text-center text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} IFC Changara. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
