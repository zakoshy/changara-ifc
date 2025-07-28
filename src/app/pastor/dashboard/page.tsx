import { placeholderUsers } from '@/lib/placeholder-data';
import { columns } from '@/components/pastor/columns';
import { DataTable } from '@/components/pastor/data-table';
import { EventIdeaGenerator } from '@/components/pastor/event-idea-generator';
import { Separator } from '@/components/ui/separator';

export default function PastorDashboardPage() {
  const members = placeholderUsers;

  return (
    <div className="py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">AI Event Assistant</h1>
        <p className="text-muted-foreground mb-6">Generate creative event ideas for your church.</p>
        <EventIdeaGenerator />
      </div>
      <Separator />
      <div>
       <h1 className="text-2xl font-bold tracking-tight font-headline">Member Management</h1>
       <p className="text-muted-foreground mb-6">View and manage all registered members.</p>
       <DataTable columns={columns} data={members} />
      </div>
    </div>
  );
}
