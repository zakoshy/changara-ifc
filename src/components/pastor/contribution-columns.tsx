"use client";

import { ColumnDef } from '@tanstack/react-table';
import type { Contribution } from '@/lib/types';
import { Checkbox } from '../ui/checkbox';

export const columns: ColumnDef<Contribution>[] = [
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
    accessorKey: 'mpesaRef',
    header: 'M-Pesa Reference',
  },
  {
    accessorKey: 'userName',
    header: 'Member Name',
  },
  {
    accessorKey: 'userEmail',
    header: 'Member Email',
  },
  {
    accessorKey: 'date',
    header: 'Contribution Date',
    cell: ({ row }) => {
        const date = new Date(row.original.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        return <span>{formattedDate}</span>;
    }
  },
];
