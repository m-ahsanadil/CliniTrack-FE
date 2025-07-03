import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const EmptyState = ({ 
    icon: Icon, 
    title, 
    description, 
    actionText, 
    onAction 
}: {
    icon: React.ComponentType<any>;
    title: string;
    description: string;
    actionText?: string;
    onAction?: () => void;
}) => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Icon className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-4 max-w-sm">{description}</p>
        {actionText && onAction && (
            <Button 
                onClick={onAction} 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
            >
                <Plus className="w-4 h-4 mr-2" />
                {actionText}
            </Button>
        )}
    </div>
);