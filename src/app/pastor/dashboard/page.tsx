import { getEvents, getTeachings, deleteTeaching } from '@/actions/events';
import { EventCalendar } from '@/components/pastor/event-calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MembersPage from './members/page';
import ContributionsPage from './contributions/page';
import AiAssistantPage from './ai-assistant/page';


export default async function PastorDashboardPage() {
  const allEvents = await getEvents();
  const allTeachings = await getTeachings();
  
  return (
    <div className="py-6 space-y-8">
       <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="events">Events & Teachings</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="contributions">Contributions</TabsTrigger>
          <TabsTrigger value="ai">AI Assistant</TabsTrigger>
        </TabsList>
        <TabsContent value="events" className="mt-6">
            <EventCalendar events={allEvents} teachings={allTeachings} />
        </TabsContent>
        <TabsContent value="members" className="mt-6">
            <MembersPage />
        </TabsContent>
        <TabsContent value="contributions" className="mt-6">
            <ContributionsPage />
        </TabsContent>
         <TabsContent value="ai" className="mt-6">
            <AiAssistantPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
