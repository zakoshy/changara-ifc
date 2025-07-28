import { getEvents } from '@/actions/events';
import { getUserById } from '@/actions/users';
import { EventCard } from '@/components/dashboard/event-card';
import { User } from '@/lib/types';

export default async function DashboardPage() {
  const allEvents = await getEvents();
  const user = await getUserById('no-id') as User; // Cast as User because we know it returns a user or fallback

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to the beginning of the day

  const upcomingEvents = allEvents.filter(event => {
    // The date format from placeholder data might be different from the DB
    try {
        const eventDate = new Date(event.date);
        return eventDate >= today;
    } catch (e) {
        // Handle potential invalid date strings from old data
        return false;
    }
  });


  return (
    <div className="flex flex-col gap-8 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Welcome, {user.name.split(' ')[0]}!</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening at the church.</p>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} user={user} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-12 border-2 border-dashed rounded-lg bg-card">
              <h2 className="text-xl font-semibold">No Upcoming Events</h2>
              <p className="text-muted-foreground mt-2">There are no upcoming events scheduled. Please check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
}
