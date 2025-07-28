'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { User } from '@/lib/types';
import { CellAction } from './cell-action';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'joinedAt',
    header: 'Joined Date',
    cell: ({ row }) => {
        const date = new Date(row.original.joinedAt);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        return <span>{formattedDate}</span>;
    }
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
        const role = row.original.role;
        return <Badge variant={role === 'pastor' ? 'default' : 'secondary'} className="capitalize">{role}</Badge>
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
