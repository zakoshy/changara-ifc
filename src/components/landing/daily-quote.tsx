import { generateDailyQuote } from "@/ai/flows/daily-quote-flow";
import { Lightbulb, BookOpen } from "lucide-react";
import Link from 'next/link';

export async function DailyQuote() {
    const { quote, verse } = await generateDailyQuote();

    return (
        <section className="bg-primary/5 py-20 md:py-24">
            <div className="container text-center max-w-3xl mx-auto">
                 <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                    <Lightbulb className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Daily Inspiration</h2>
                <blockquote className="mt-6 border-l-4 border-primary pl-6 italic text-muted-foreground text-xl">
                    "{quote}"
                </blockquote>
                <p className="mt-4">
                    <Link href={`/pastor/dashboard/bible?passage=${encodeURIComponent(verse)}`} className="text-primary font-semibold hover:underline inline-flex items-center gap-2">
                        <BookOpen className="h-4 w-4"/> {verse}
                    </Link>
                </p>
            </div>
        </section>
    );
}
