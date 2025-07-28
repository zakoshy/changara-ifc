import { EventCalendar } from '@/components/pastor/event-calendar';
import { getEvents, getTeachings } from '@/actions/events';

export default async function PastorDashboardPage() {
  const allEvents = await getEvents();
  const allTeachings = await getTeachings();
  
  return (
    <div className="py-6 space-y-8">
      <EventCalendar events={allEvents} teachings={allTeachings} />
    </div>
  );
}
