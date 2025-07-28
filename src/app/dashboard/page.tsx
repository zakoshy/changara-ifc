import { Button } from '@/components/ui/button';
import { placeholderEvents } from '@/lib/placeholder-data';
import { EventCard } from '@/components/dashboard/event-card';
import { GiveDialog } from '@/components/dashboard/give-dialog';
import { HandHeart, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-headline">Upcoming Events</h1>
          <p className="text-muted-foreground">Stay up-to-date with all our church activities.</p>
        </div>
        <div className="flex gap-2">
            <GiveDialog title="Give Tithes">
                <Button variant="outline"><Sparkles className="mr-2 h-4 w-4"/>Tithes</Button>
            </GiveDialog>
            <GiveDialog title="Give Offering">
                <Button><HandHeart className="mr-2 h-4 w-4"/>Offerings</Button>
            </GiveDialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {placeholderEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
