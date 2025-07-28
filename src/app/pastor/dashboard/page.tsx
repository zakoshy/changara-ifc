import { DataTable } from '@/components/pastor/data-table';
import { EventIdeaGenerator } from '@/components/pastor/event-idea-generator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventCalendar } from '@/components/pastor/event-calendar';
import { getEvents } from '@/actions/events';
import { getUsers } from '@/actions/users';
import { getContributions } from '@/actions/contributions';
import { columns as memberColumns } from '@/components/pastor/columns';
import { columns as contributionColumns } from '@/components/pastor/contribution-columns';


export default async function PastorDashboardPage() {
  const members = await getUsers();
  const contributions = await getContributions();
  const events = await getEvents();
  
  const sortedMembers = [...members].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="py-6">
      <Tabs defaultValue="events">
        <TabsList className="mb-6">
          <TabsTrigger value="events">Event Management</TabsTrigger>
          <TabsTrigger value="members">Member Management</TabsTrigger>
          <TabsTrigger value="contributions">Contributions</TabsTrigger>
          <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
            <EventCalendar events={events} />
        </TabsContent>

        <TabsContent value="members">
            <h1 className="text-2xl font-bold tracking-tight font-headline">Member Management</h1>
            <p className="text-muted-foreground mb-6">View and manage all registered members.</p>
            <DataTable columns={memberColumns} data={sortedMembers} />
        </TabsContent>

        <TabsContent value="contributions">
            <h1 className="text-2xl font-bold tracking-tight font-headline">Contribution Records</h1>
            <p className="text-muted-foreground mb-6">View all incoming contributions.</p>
            <DataTable columns={contributionColumns} data={contributions} filterColumn='mpesaRef' filterPlaceholder='Filter by M-Pesa Reference...' />
        </TabsContent>

        <TabsContent value="ai-assistant">
            <h1 className="text-2xl font-bold tracking-tight font-headline">AI Event Assistant</h1>
            <p className="text-muted-foreground mb-6">Generate creative event ideas for your church.</p>
            <EventIdeaGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
