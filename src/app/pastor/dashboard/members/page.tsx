import { getUsers } from "@/actions/users";
import { columns } from "@/components/pastor/columns";
import { DataTable } from "@/components/pastor/data-table";
import { TeamManagementDialog } from "@/components/pastor/team-management-dialog";
import { getTeamMembers } from "@/actions/team";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export default async function MembersPage() {
  const allUsers = await getUsers();
  const teamMembers = await getTeamMembers();

  return (
    <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight font-headline">Member Management</h2>
            <p className="text-muted-foreground">View and manage all registered church members.</p>
          </div>
           <TeamManagementDialog teamMembers={teamMembers}>
              <Button>
                <Users className="mr-2 h-4 w-4" />
                Manage Team
              </Button>
          </TeamManagementDialog>
        </div>
        <DataTable columns={columns} data={allUsers} filterColumn="name" filterPlaceholder="Filter by user name..."/>
    </div>
  );
}
