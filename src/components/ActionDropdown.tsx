import React from 'react';
import { MoreVertical, Eye, Edit2, Trash2, Settings, Download, Share, Copy } from 'lucide-react';
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

// Usage Examples:

/*
// Basic usage with custom actions
const actions: ActionItem[] = [
  {
    id: 'view',
    label: 'View Details',
    icon: <Eye className="h-4 w-4" />,
    onClick: () => handleView(item.id)
  },
  {
    id: 'edit',
    label: 'Edit',
    icon: <Edit2 className="h-4 w-4" />,
    onClick: () => handleEdit(item.id)
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: <Trash2 className="h-4 w-4" />,
    onClick: () => handleDelete(item.id),
    className: 'text-red-600',
    separator: true
  }
];

<ActionDropdown actions={actions} />

// Using pre-defined action creators
const standardActions = createStandardActions(
  () => handleView(item.id),
  () => handleEdit(item.id),
  () => handleDelete(item.id)
);

<ActionDropdown actions={standardActions} />

// With custom styling and size
<ActionDropdown 
  actions={actions} 
  size="lg"
  contentAlign="start"
  triggerClassName="border border-gray-300"
/>
*/