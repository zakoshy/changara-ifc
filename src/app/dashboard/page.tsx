import { getEvents } from '@/actions/events';
import { EventCard } from '@/components/dashboard/event-card';

export default async function DashboardPage() {
  const events = await getEvents();

  return (
    <div className="flex flex-col gap-4 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-headline">Upcoming Events</h1>
          <p className="text-muted-foreground">Stay up-to-date with all our church activities.</p>
        </div>
      </div>

      {events.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-12 border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold">No Upcoming Events</h2>
            <p className="text-muted-foreground mt-2">Check back later for more events. The pastor is planning great things!</p>
        </div>
      )}
    </div>
  );
}
