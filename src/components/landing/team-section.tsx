
import { getTeamMembers } from "@/actions/team";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import Link from 'next/link';
import { ArrowRight } from "lucide-react";

export async function TeamSection() {
    const allTeamMembers = await getTeamMembers();
    const displayedMembers = allTeamMembers.slice(0, 6);

    return (
        <section id="team" className="py-20 md:py-24 bg-secondary/50">
            <div className="container text-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Meet Our Team</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Our church is led by a dedicated team committed to serving God and our community.
                </p>
                <div className="mt-12 grid gap-8 sm:grid-cols-2 md:grid-cols-3 justify-center">
                    {displayedMembers.length > 0 ? (
                        displayedMembers.map(member => (
                            <div key={member.id} className="flex flex-col items-center gap-4">
                                <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                                    <AvatarImage src={member.imageUrl} alt={member.name} data-ai-hint="team member portrait"/>
                                    <AvatarFallback className="text-4xl">{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="text-center">
                                    <h3 className="text-xl font-bold font-headline">{member.name}</h3>
                                    <p className="text-primary">{member.position}</p>
                                </div>
                            </div>
                        ))
                    ): (
                        <p className="text-muted-foreground col-span-full">The church leadership team has not been set up yet.</p>
                    )}
                </div>
                 {allTeamMembers.length > 6 && (
                    <div className="mt-12">
                        <Button asChild>
                            <Link href="/team">
                                See All Members <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
