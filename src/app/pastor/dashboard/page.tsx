
import { getEvents, getTeachings } from '@/actions/events';
import { EventCalendar } from '@/components/pastor/event-calendar';

export default async function PastorDashboardPage() {
  const allEvents = await getEvents();
  const allTeachings = await getTeachings();
  
  return (
    <div className="py-6">
      <EventCalendar events={allEvents} teachings={allTeachings} />
    </div>
  );
}
