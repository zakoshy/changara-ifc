import { EventCalendar } from '@/components/pastor/event-calendar';
import { getEvents, getTeachings, deleteTeaching } from '@/actions/events';
import { Separator } from '@/components/ui/separator';
import { TeachingsDisplay } from '@/components/pastor/teachings-display';

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
      <TeachingsDisplay teachings={allTeachings} deleteTeachingAction={deleteTeaching} />
    </div>
  );
}
