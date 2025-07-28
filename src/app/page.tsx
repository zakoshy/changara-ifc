import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Church, Calendar, HandHeart, Users, ArrowRight } from 'lucide-react';

const LandingHeader = () => (
  <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
      <Link href="/" className="flex items-center gap-2 font-bold">
        <Church className="h-6 w-6 text-primary" />
        <span className="font-headline">Changara Connect</span>
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

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <Card className="text-center bg-card/80 backdrop-blur-sm">
    <CardHeader>
      <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
        {icon}
      </div>
      <CardTitle className="font-headline pt-4">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <main className="flex-1">
        <section className="relative py-20 md:py-32">
            <div 
              aria-hidden="true" 
              className="absolute inset-0 top-0 w-full h-full bg-background"
              style={{
                backgroundImage: 'radial-gradient(circle at top, hsl(var(--primary) / 0.1), transparent 40%)',
              }}
            ></div>
          <div className="container relative text-center">
            <div className="mx-auto max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl font-headline">
                Welcome to IFC changara
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Stay connected with our church community. Access event schedules, give online, and receive important updates, all in one place.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button size="lg" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
                <Button size="lg" variant="ghost" asChild>
                  <Link href="/pastor/login">Pastor's Area <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
            <div className="mt-16 flow-root sm:mt-24">
              <div className="-m-2 rounded-xl bg-muted/20 p-2 ring-1 ring-inset ring-primary/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <Image
                  src="https://placehold.co/1200x600.png"
                  alt="App screenshot"
                  width={1200}
                  height={600}
                  data-ai-hint="church community"
                  className="rounded-md shadow-2xl ring-1 ring-foreground/10"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 md:py-32 bg-secondary/50">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Everything you need to stay involved</h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Our platform provides powerful features to enrich your spiritual journey and community engagement.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                <FeatureCard 
                  icon={<Calendar className="h-8 w-8" />}
                  title="Upcoming Events"
                  description="Never miss a service or community event with our up-to-date calendar."
                />
                <FeatureCard 
                  icon={<HandHeart className="h-8 w-8" />}
                  title="Online Giving"
                  description="Easily give your tithes and offerings from anywhere, at any time. Secure and simple."
                />
                <FeatureCard 
                  icon={<Users className="h-8 w-8" />}
                  title="Community Hub"
                  description="Connect with fellow members and stay informed with church-wide announcements."
                />
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-background">
        <div className="container py-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} IFC Changara. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
