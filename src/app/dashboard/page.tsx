
import { getEvents, getTeachings } from '@/actions/events';
import { FeedCard } from '@/components/dashboard/feed-card';
import { User, Event, FeedItem, Teaching } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GiveDialog } from '@/components/dashboard/give-dialog';

export default async function DashboardPage({ user }: { user: User }) {
  // Fetch events and teachings on the server
  const allEvents = await getEvents();
  const allTeachings = await getTeachings();
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to the beginning of the day

  const upcomingEvents = allEvents
      .filter((event) => {
      try {
          const eventDate = new Date(event.date);
          return eventDate >= today;
      } catch (e) {
          return false;
      }
      })
      .map((item) => ({ ...item, type: 'event', sortDate: new Date(item.date) })) as FeedItem[];
      
  const eventTeachingIds = new Set(allEvents.map(e => e.teachingId).filter(Boolean));
  const recentTeachings = allTeachings
    .filter(teaching => !eventTeachingIds.has(teaching.id)) // Filter out teachings already linked to an event
    .map((item) => ({ ...item, type: 'teaching', sortDate: new Date(item.createdAt) }))
    .sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime())
    .slice(0, 6) as FeedItem[]; // Show latest 6 standalone teachings


  return (
    <div className="flex flex-col gap-8 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Welcome, {user.name.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening at the church.
          </p>
        </div>
      </div>
      
      <Separator />

      <section id="giving">
        <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">Support Our Ministry</h2>
         <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Your generous giving enables us to continue our work in the community and spread the Gospel. Thank you for your partnership.
        </p>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mt-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><Smartphone/> M-Pesa Paybill</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="font-semibold">Paybill Number: <span className="font-mono text-primary">247247</span></p>
                    <p className="font-semibold">Account Number: <span className="font-mono text-primary">811335</span></p>
                </CardContent>
            </Card>
              <Card>
                <CardHeader>
                      <CardTitle className="flex items-center gap-3"><Phone/> Lipa na M-Pesa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="font-semibold">Send money directly to our treasurer:</p>
                    <p className="font-semibold">Number: <span className="font-mono text-primary">0710660051</span></p>
                </CardContent>
            </Card>
        </div>
          <GiveDialog title="Give Online" user={user}>
            <Button size="lg" className="mt-6">Give Online Securely</Button>
          </GiveDialog>
      </section>

      <Separator />


      <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
          Upcoming Events
        </h2>
        {upcomingEvents.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((item) => (
              <FeedCard key={`${item.type}-${item.id}`} item={item} user={user} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-12 border-2 border-dashed rounded-lg bg-card">
            <h2 className="text-xl font-semibold">No Upcoming Events</h2>
            <p className="text-muted-foreground mt-2">
              There are no upcoming events scheduled. Please check back later!
            </p>
          </div>
        )}
      </div>

      <Separator />

       <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
          Recent Teachings
        </h2>
        {recentTeachings.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentTeachings.map((item) => (
              <FeedCard key={`${item.type}-${item.id}`} item={item} user={user} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-12 border-2 border-dashed rounded-lg bg-card">
            <h2 className="text-xl font-semibold">No Recent Teachings</h2>
            <p className="text-muted-foreground mt-2">
              The pastor hasn't uploaded any new teachings yet. Please check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
