import { getUsers } from "@/actions/users";
import { columns } from "@/components/pastor/columns";
import { DataTable } from "@/components/pastor/data-table";

export default async function MembersPage() {
  const users = await getUsers();
  const members = users.filter(user => user.role === 'member');

  return (
    <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline">Member Management</h2>
        <p className="text-muted-foreground mb-4">View and manage all registered church members.</p>
        <DataTable columns={columns} data={members} filterColumn="name" filterPlaceholder="Filter by member name..."/>
    </div>
  );
}
