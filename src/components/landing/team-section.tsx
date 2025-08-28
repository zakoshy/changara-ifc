import { getPastor } from "@/actions/users";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

export async function TeamSection() {
    const pastor = await getPastor();

    return (
        <section id="team" className="py-20 md:py-24 bg-secondary/50">
            <div className="container text-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Meet Our Pastor</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Our church is led by a dedicated team committed to serving God and our community.
                </p>
                <div className="mt-12 flex justify-center">
                    {pastor ? (
                        <div className="flex flex-col items-center gap-4">
                            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                                <AvatarImage src={pastor.imageUrl} alt={pastor.name} data-ai-hint="pastor portrait"/>
                                <AvatarFallback className="text-4xl">{pastor.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="text-center">
                                <h3 className="text-xl font-bold font-headline">{pastor.name}</h3>
                                <p className="text-primary">Senior Pastor</p>
                            </div>
                        </div>
                    ): (
                        <p className="text-muted-foreground">Pastor information is not available at the moment.</p>
                    )}
                </div>
            </div>
        </section>
    );
}
