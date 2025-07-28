import { getEvents, getTeachings } from '@/actions/events';
import { getUserById } from '@/actions/users';
import { FeedCard } from '@/components/dashboard/feed-card';
import { User, Event, Teaching, FeedItem } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

export default async function DashboardPage() {
  const allEvents = await getEvents();
  const allTeachings = await getTeachings();
  const user = (await getUserById('no-id')) as User; // Cast as User because we know it returns a user or fallback

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
    .map((item) => ({ ...item, type: 'event', sortDate: new Date(item.date) }));

  const recentTeachings = allTeachings.map((item) => ({
    ...item,
    type: 'teaching',
    sortDate: new Date(item.createdAt),
  }));

  const combinedFeed = [...upcomingEvents, ...recentTeachings].sort(
    (a, b) => b.sortDate.getTime() - a.sortDate.getTime()
  ) as FeedItem[];

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

      <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
          Latest Updates &amp; Events
        </h2>
        {combinedFeed.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {combinedFeed.map((item) => (
              <FeedCard key={`${item.type}-${item.id}`} item={item} user={user} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-12 border-2 border-dashed rounded-lg bg-card">
            <h2 className="text-xl font-semibold">No Recent Activity</h2>
            <p className="text-muted-foreground mt-2">
              There are no upcoming events or recent teachings. Please check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
