import { EventCalendar } from '@/components/pastor/event-calendar';
import { getEvents, getTeachings, deleteTeaching } from '@/actions/events';
import { Separator } from '@/components/ui/separator';
import { TeachingsDisplay } from '@/components/pastor/teachings-display';

export default async function PastorDashboardPage() {
  const allEvents = await getEvents();
  const allTeachings = await getTeachings();
  
  return (
    <div className="py-6 space-y-8">
      <EventCalendar events={allEvents} teachings={allTeachings} />
      <Separator />
      <TeachingsDisplay teachings={allTeachings} deleteTeachingAction={deleteTeaching} />
    </div>
  );
}
