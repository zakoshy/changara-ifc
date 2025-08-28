import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, HandHeart, Users, ArrowRight, Banknote, Landmark, Smartphone } from 'lucide-react';
import { DailyQuote } from '@/components/landing/daily-quote';
import { TeamSection } from '@/components/landing/team-section';

const LandingHeader = () => (
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
    <div className="flex flex-col min-h-screen bg-secondary/20">
      <LandingHeader />
      <main className="flex-1">
        <section className="relative h-[70vh] flex items-center justify-center text-white">
          <Image
            src="https://images.pexels.com/photos/5199797/pexels-photo-5199797.jpeg"
            alt="Church bible"
            fill
            className="object-cover absolute inset-0 z-0"
            data-ai-hint="church community"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 z-10"></div>
          <div className="container relative z-20 text-center">
            <div className="mx-auto max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl font-headline">
                Welcome to IFC Changara
              </h1>
              <p className="mt-6 text-lg leading-8 text-neutral-200">
                Stay connected with our church community. Access event schedules, give online, and receive important updates, all in one place.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button size="lg" asChild>
                  <Link href="/signup">Join Our Community</Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent text-white hover:bg-white hover:text-primary" asChild>
                  <Link href="/pastor/login">Pastor's Area <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="mission" className="py-20 md:py-24 bg-background">
            <div className="container grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Our Mission & Vision</h2>
                    <p className="text-muted-foreground text-lg">To raise a generation of believers who are rooted in the Word, empowered by the Spirit, and committed to transforming our community for Christ.</p>
                    <p className="text-muted-foreground">Our vision is to be a beacon of hope and a center for spiritual growth, where people from all walks of life can experience God's love, find their purpose, and be equipped to make a difference in the world.</p>
                </div>
                 <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl">
                     <Image src="https://images.pexels.com/photos/236339/pexels-photo-236339.jpeg" alt="Hope" fill className="object-cover" data-ai-hint="hope light"/>
                </div>
            </div>
        </section>
        
        <DailyQuote />

        <TeamSection />

        <section id="features" className="py-20 md:py-24 bg-background">
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

        <section id="giving" className="py-20 md:py-24 bg-secondary/50">
            <div className="container text-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Support Our Ministry</h2>
                <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                    Your generous giving enables us to continue our work in the community and spread the Gospel. Thank you for your partnership.
                </p>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12 text-left">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3"><Smartphone/> M-Pesa</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="font-semibold">Paybill Number: <span className="font-mono text-primary">123456</span></p>
                            <p className="font-semibold">Account Number: <span className="font-mono text-primary">Tithe or Offering</span></p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                             <CardTitle className="flex items-center gap-3"><Landmark/> Bank Deposit</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="font-semibold">Bank Name: <span className="font-mono text-primary">KCB Bank</span></p>
                            <p className="font-semibold">Account Number: <span className="font-mono text-primary">1234567890</span></p>
                            <p className="font-semibold">Account Name: <span className="font-mono text-primary">IFC Changara</span></p>
                        </CardContent>
                    </Card>
                </div>
                 <Button size="lg" asChild className="mt-10">
                  <Link href="/login">Give Online <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </div>
        </section>

      </main>
      <footer className="bg-background border-t">
        <div className="container py-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} IFC Changara. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
