import { placeholderUsers } from '@/lib/placeholder-data';
import { columns } from '@/components/pastor/columns';
import { DataTable } from '@/components/pastor/data-table';

export default function PastorDashboardPage() {
  const members = placeholderUsers;

  return (
    <div className="py-6">
       <h1 className="text-2xl font-bold tracking-tight font-headline">Member Management</h1>
       <p className="text-muted-foreground mb-6">View and manage all registered members.</p>
      <DataTable columns={columns} data={members} />
    </div>
  );
}
