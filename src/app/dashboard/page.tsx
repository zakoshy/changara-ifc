import { placeholderEvents } from '@/lib/placeholder-data';
import { EventCard } from '@/components/dashboard/event-card';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-headline">Upcoming Events</h1>
          <p className="text-muted-foreground">Stay up-to-date with all our church activities.</p>
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
