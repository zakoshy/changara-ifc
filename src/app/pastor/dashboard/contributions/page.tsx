import { getContributions } from "@/actions/contributions";
import { columns } from "@/components/pastor/contribution-columns";
import { DataTable } from "@/components/pastor/data-table";

export default async function ContributionsPage() {
  const contributions = await getContributions();

  return (
    <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline">Contribution Records</h2>
        <p className="text-muted-foreground mb-4">View all recorded tithes and offerings.</p>
        <DataTable columns={columns} data={contributions} filterColumn="userName" filterPlaceholder="Filter by member name..."/>
    </div>
  );
}
