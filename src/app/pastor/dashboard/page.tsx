import { placeholderUsers, placeholderContributions } from '@/lib/placeholder-data';
import { columns as memberColumns } from '@/components/pastor/columns';
import { columns as contributionColumns } from '@/components/pastor/contribution-columns';
import { DataTable } from '@/components/pastor/data-table';
import { EventIdeaGenerator } from '@/components/pastor/event-idea-generator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventCalendar } from '@/components/pastor/event-calendar';
import { getEvents } from '@/actions/events';

export default async function PastorDashboardPage() {
  // In a real app, fetch from DB
  const members = [...placeholderUsers].sort((a, b) => a.name.localeCompare(b.name)); 
  const contributions = placeholderContributions; 
  const events = await getEvents();

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
            <DataTable columns={memberColumns} data={members} />
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
