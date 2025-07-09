import React from 'react';
import { MoreVertical, Eye, Edit2, Trash2, Settings, Download, Share, Copy, X, Calendar, Clock, CheckCircle, XCircle, AlertCircle, UserMinus, UserPlus, Lock, Unlock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

export interface ActionItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  separator?: boolean; // Add separator after this item
}

interface ActionDropdownProps {
  actions: ActionItem[];
  triggerClassName?: string;
  contentAlign?: 'start' | 'center' | 'end';
  size?: 'sm' | 'md' | 'lg';
}

export const ActionDropdown: React.FC<ActionDropdownProps> = ({
  actions,
  triggerClassName = "",
  contentAlign = "end",
  size = "md"
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-6 w-6 p-0';
      case 'lg':
        return 'h-10 w-10 p-0';
      default:
        return 'h-8 w-8 p-0';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-3 w-3';
      case 'lg':
        return 'h-5 w-5';
      default:
        return 'h-4 w-4';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={`text-gray-700 hover:text-gray-900 ${getSizeClasses()} ${triggerClassName}`}
        >
          <MoreVertical className={getIconSize()} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={contentAlign} className="w-48">
        {actions.map((action, index) => (
          <React.Fragment key={action.id}>
            <DropdownMenuItem
              onClick={action.onClick}
              disabled={action.disabled}
              className={`cursor-pointer ${action.className || ''}`}
            >
              {action.icon}
              <span className="ml-2">{action.label}</span>
            </DropdownMenuItem>
            {action.separator && index < actions.length - 1 && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Pre-defined action creators for common actions
export const createViewAction = (onClick: () => void): ActionItem => ({
  id: 'view',
  label: 'View Details',
  icon: <Eye className="h-4 w-4" />,
  onClick
});

export const createEditAction = (onClick: () => void): ActionItem => ({
  id: 'edit',
  label: 'Edit',
  icon: <Edit2 className="h-4 w-4" />,
  onClick
});

export const createDeleteAction = (onClick: () => void): ActionItem => ({
  id: 'delete',
  label: 'Delete',
  icon: <Trash2 className="h-4 w-4" />,
  onClick,
  className: 'text-red-600 hover:text-red-700 focus:text-red-700',
  separator: true
});

export const createDownloadAction = (onClick: () => void): ActionItem => ({
  id: 'download',
  label: 'Download',
  icon: <Download className="h-4 w-4" />,
  onClick
});

export const createShareAction = (onClick: () => void): ActionItem => ({
  id: 'share',
  label: 'Share',
  icon: <Share className="h-4 w-4" />,
  onClick
});

export const createCopyAction = (onClick: () => void): ActionItem => ({
  id: 'copy',
  label: 'Copy',
  icon: <Copy className="h-4 w-4" />,
  onClick
});

export const createSettingsAction = (onClick: () => void): ActionItem => ({
  id: 'settings',
  label: 'Settings',
  icon: <Settings className="h-4 w-4" />,
  onClick
});

// Additional common actions
export const createCancelAction = (onClick: () => void): ActionItem => ({
  id: 'cancel',
  label: 'Cancel',
  icon: <X className="h-4 w-4" />,
  onClick,
  className: 'text-red-600 hover:text-red-700 focus:text-red-700'
});

export const createRescheduleAction = (onClick: () => void): ActionItem => ({
  id: 'reschedule',
  label: 'Reschedule',
  icon: <Calendar className="h-4 w-4" />,
  onClick,
  className: 'text-blue-600 hover:text-blue-700 focus:text-blue-700'
});

export const createApproveAction = (onClick: () => void): ActionItem => ({
  id: 'approve',
  label: 'Approve',
  icon: <CheckCircle className="h-4 w-4" />,
  onClick,
  className: 'text-green-600 hover:text-green-700 focus:text-green-700'
});

export const createRejectAction = (onClick: () => void): ActionItem => ({
  id: 'reject',
  label: 'Reject',
  icon: <XCircle className="h-4 w-4" />,
  onClick,
  className: 'text-red-600 hover:text-red-700 focus:text-red-700'
});

export const createSuspendAction = (onClick: () => void): ActionItem => ({
  id: 'suspend',
  label: 'Suspend',
  icon: <Lock className="h-4 w-4" />,
  onClick,
  className: 'text-orange-600 hover:text-orange-700 focus:text-orange-700'
});

export const createActivateAction = (onClick: () => void): ActionItem => ({
  id: 'activate',
  label: 'Activate',
  icon: <Unlock className="h-4 w-4" />,
  onClick,
  className: 'text-green-600 hover:text-green-700 focus:text-green-700'
});

export const createAssignAction = (onClick: () => void): ActionItem => ({
  id: 'assign',
  label: 'Assign',
  icon: <UserPlus className="h-4 w-4" />,
  onClick,
  className: 'text-blue-600 hover:text-blue-700 focus:text-blue-700'
});

export const createUnassignAction = (onClick: () => void): ActionItem => ({
  id: 'unassign',
  label: 'Unassign',
  icon: <UserMinus className="h-4 w-4" />,
  onClick,
  className: 'text-orange-600 hover:text-orange-700 focus:text-orange-700'
});

export const createCompleteAction = (onClick: () => void): ActionItem => ({
  id: 'complete',
  label: 'Mark Complete',
  icon: <CheckCircle className="h-4 w-4" />,
  onClick,
  className: 'text-green-600 hover:text-green-700 focus:text-green-700'
});

export const createPendingAction = (onClick: () => void): ActionItem => ({
  id: 'pending',
  label: 'Mark Pending',
  icon: <Clock className="h-4 w-4" />,
  onClick,
  className: 'text-yellow-600 hover:text-yellow-700 focus:text-yellow-700'
});

export const createAlertAction = (onClick: () => void): ActionItem => ({
  id: 'alert',
  label: 'Send Alert',
  icon: <AlertCircle className="h-4 w-4" />,
  onClick,
  className: 'text-red-600 hover:text-red-700 focus:text-red-700'
});

// Common action combinations
export const createStandardActions = (
  onView: () => void,
  onEdit: () => void,
  onDelete: () => void
): ActionItem[] => [
  createViewAction(onView),
  createEditAction(onEdit),
  { ...createDeleteAction(onDelete), separator: true }
];

export const createManagementActions = (
  onView: () => void,
  onEdit: () => void,
  onDownload: () => void,
  onDelete: () => void
): ActionItem[] => [
  createViewAction(onView),
  createEditAction(onEdit),
  createDownloadAction(onDownload),
  { ...createDeleteAction(onDelete), separator: true }
];

// New specialized action combinations
export const createAppointmentActions = (
  onView: () => void,
  onEdit: () => void,
  onReschedule: () => void,
  onCancel: () => void
): ActionItem[] => [
  createViewAction(onView),
  createEditAction(onEdit),
  { ...createRescheduleAction(onReschedule), separator: true },
  createCancelAction(onCancel)
];

export const createApprovalActions = (
  onView: () => void,
  onApprove: () => void,
  onReject: () => void
): ActionItem[] => [
  createViewAction(onView),
  { ...createApproveAction(onApprove), separator: true },
  createRejectAction(onReject)
];

export const createUserManagementActions = (
  onView: () => void,
  onEdit: () => void,
  onSuspend: () => void,
  onDelete: () => void
): ActionItem[] => [
  createViewAction(onView),
  createEditAction(onEdit),
  { ...createSuspendAction(onSuspend), separator: true },
  createDeleteAction(onDelete)
];

export const createTaskActions = (
  onView: () => void,
  onEdit: () => void,
  onComplete: () => void,
  onAssign: () => void
): ActionItem[] => [
  createViewAction(onView),
  createEditAction(onEdit),
  { ...createCompleteAction(onComplete), separator: true },
  createAssignAction(onAssign)
];

// Usage Examples:

/*
// Basic usage with custom actions
const actions: ActionItem[] = [
  createViewAction(() => handleView(item.id)),
  createEditAction(() => handleEdit(item.id)),
  createRescheduleAction(() => handleReschedule(item.id)),
  createCancelAction(() => handleCancel(item.id)),
  { ...createDeleteAction(() => handleDelete(item.id)), separator: true }
];

<ActionDropdown actions={actions} />

// Using pre-defined appointment actions
const appointmentActions = createAppointmentActions(
  () => handleView(appointment.id),
  () => handleEdit(appointment.id),
  () => handleReschedule(appointment.id),
  () => handleCancel(appointment.id)
);

<ActionDropdown actions={appointmentActions} />

// Using approval actions
const approvalActions = createApprovalActions(
  () => handleView(request.id),
  () => handleApprove(request.id),
  () => handleReject(request.id)
);

<ActionDropdown actions={approvalActions} />

// Mixed custom actions
const mixedActions: ActionItem[] = [
  createViewAction(() => handleView(item.id)),
  createEditAction(() => handleEdit(item.id)),
  { ...createRescheduleAction(() => handleReschedule(item.id)), separator: true },
  createSuspendAction(() => handleSuspend(item.id)),
  createDeleteAction(() => handleDelete(item.id))
];

<ActionDropdown actions={mixedActions} />

// Conditional actions based on status
const getConditionalActions = (status: string) => {
  const baseActions = [
    createViewAction(() => handleView(item.id)),
    createEditAction(() => handleEdit(item.id))
  ];

  if (status === 'pending') {
    return [
      ...baseActions,
      { ...createApproveAction(() => handleApprove(item.id)), separator: true },
      createRejectAction(() => handleReject(item.id))
    ];
  } else if (status === 'scheduled') {
    return [
      ...baseActions,
      { ...createRescheduleAction(() => handleReschedule(item.id)), separator: true },
      createCancelAction(() => handleCancel(item.id))
    ];
  } else {
    return [
      ...baseActions,
      { ...createDeleteAction(() => handleDelete(item.id)), separator: true }
    ];
  }
};

<ActionDropdown actions={getConditionalActions(item.status)} />

// With custom styling and size
<ActionDropdown 
  actions={actions} 
  size="lg"
  contentAlign="start"
  triggerClassName="border border-gray-300"
/>
*/