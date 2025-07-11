// components/TableRowActions.tsx
"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Eye, Edit2, Trash2, CalendarClock, XCircle } from "lucide-react";
import { UserRole } from "@/src/enum";
import { RoleGuard } from "@/components/role-guard";

interface TableRowActionsProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onReschedule?: () => void;
  onCancel?: () => void;
}

export function TableRowActions({ onView, onEdit, onDelete, onCancel, onReschedule }: TableRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="bg-transparent">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-700">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 bg-slate-700">
        {/* Everyone can view */}
        <DropdownMenuItem onClick={onView}>
          <Eye className="mr-2 h-4 w-4" />
          View
        </DropdownMenuItem>

        <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.DOCTOR, UserRole.SUPER_ADMIN]}>
          <DropdownMenuItem onClick={onEdit}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        </RoleGuard>

        {onReschedule && (
          <RoleGuard allowedRoles={[UserRole.DOCTOR, UserRole.ADMIN]}>
            <DropdownMenuItem onClick={onReschedule}>
              <CalendarClock className="mr-2 h-4 w-4" />
              Reschedule
            </DropdownMenuItem>
          </RoleGuard>
        )}

        {onCancel && (
          <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
            <DropdownMenuItem onClick={onCancel} className="text-red-500">
              <XCircle className="mr-2 h-4 w-4" />
              Cancel
            </DropdownMenuItem>
          </RoleGuard>
        )}

        <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
          <DropdownMenuItem onClick={onDelete} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </RoleGuard>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
