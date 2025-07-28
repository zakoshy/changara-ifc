import { EventCalendar } from '@/components/pastor/event-calendar';
import { getEvents } from '@/actions/events';
import { getTeachings } from '@/actions/teachings';
import { TeachingsManager } from '@/components/pastor/teachings-manager';
import { Separator } from '@/components/ui/separator';

export default async function PastorDashboardPage() {
  const allEvents = await getEvents();
  const allTeachings = await getTeachings();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = allEvents.filter(event => {
    try {
        const eventDate = new Date(event.date);
        return eventDate >= today;
    } catch (e) {
        return false;
    }
  });

  return (
    <div className="py-6 space-y-8">
      <EventCalendar events={upcomingEvents} />
      <Separator />
      <TeachingsManager teachings={allTeachings} />
    </div>
  );
}
