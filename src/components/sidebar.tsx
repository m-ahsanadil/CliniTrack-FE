"use client";
import {
    Calendar,
    FileText,
    Receipt,
    Settings,
    Users,
    Home,
    AlertTriangle,
    BarChart3,
    UserCheck,
    Loader2,
    WifiOff,
    UserPlus,
    User,
    HelpCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"

// Import components
import { getRoleColor, getRoleIcon } from "@/src/constants"
import { useGlobalUI } from "@/src/redux/providers/contexts/GlobalUIContext"
import Link from "next/link"
import { useParams, usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "../redux/store/reduxHook"
import { useEffect, useState } from "react"
import { useDashboardData } from "../modules/Dashboard/dashboard/api/hook/useDashboardData";
import { UserRole } from "../enum";
import { Admin, Doctor, Staff, SuperAdmin } from "../modules/Dashboard/dashboard/api/types";
import * as LucideIcons from "lucide-react"


// Function to get icon component from string
const getIconComponent = (iconName: string) => {
    // Get the icon from Lucide React dynamically
    const IconComponent = (LucideIcons as any)[iconName];

    // Return the icon component or fallback to HelpCircle
    return IconComponent || HelpCircle;
};

// Skeleton Components
const Skeleton = ({ className }: { className?: string }) => (
    <div className={`animate-pulse bg-slate-700 rounded ${className}`} />
);

const SidebarHeaderSkeleton = () => (
    <div className="flex-shrink-0 p-6 border-b border-slate-700">
        <Skeleton className="h-6 w-32 mb-2 bg-slate-600" />
        <Skeleton className="h-4 w-40 mb-3 bg-slate-700" />

        {/* Role Badge Skeleton */}
        <div className="mt-3">
            <Skeleton className="h-6 w-20 rounded-full bg-slate-600" />
        </div>

        {/* User Info Skeleton */}
        <div className="mt-3 space-y-1">
            <Skeleton className="h-3 w-24 bg-slate-700" />
            <Skeleton className="h-3 w-20 bg-slate-700" />
        </div>
    </div>
);

const SidebarNavigationSkeleton = () => (
    <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <li key={i}>
                    <div className="flex items-center p-2 rounded-md">
                        <Skeleton className="h-4 w-4 mr-3 bg-slate-600" />
                        <Skeleton className="h-4 w-24 bg-slate-600" />
                    </div>
                </li>
            ))}
        </ul>
    </nav>
);

// Error State Component
const SidebarErrorState = ({
    error,
    onRetry
}: {
    error: string;
    onRetry?: () => void;
}) => (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <WifiOff className="w-6 h-6 text-red-400" />
        </div>
        <h3 className="text-sm font-medium text-red-400 mb-2">Connection Error</h3>
        <p className="text-xs text-slate-400 mb-4 max-w-48">
            {error || "Unable to load navigation menu"}
        </p>
        {onRetry && (
            <Button
                onClick={onRetry}
                size="sm"
                variant="outline"
                className="text-xs border-slate-600 text-slate-300 hover:bg-slate-800"
            >
                Try Again
            </Button>
        )}
    </div>
);

// Empty Navigation State
const EmptyNavigationState = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mb-4">
            <Settings className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="text-sm font-medium text-slate-300 mb-2">No Menu Items</h3>
        <p className="text-xs text-slate-400 max-w-48">
            Navigation menu is not available for your current role or account setup.
        </p>
    </div>
);

// Loading Indicator for Slow Connections
const LoadingIndicator = () => (
    <div className="flex items-center justify-center p-4">
        <Loader2 className="w-4 h-4 animate-spin text-slate-400 mr-2" />
        <span className="text-xs text-slate-400">Loading menu...</span>
    </div>
);

export default function sidebar() {
    const pathname = usePathname();
    const router = useRouter()
    const params = useParams()
    const { user } = useAppSelector(state => state.auth);
    const { data: dashboardData, loading, error: dashboardError } = useDashboardData(user?.role as UserRole.ADMIN | UserRole.STAFF | UserRole.DOCTOR | UserRole.SUPER_ADMIN);
    const { isSidebarOpen } = useGlobalUI();
    const [routeVerification, setRouteVerification] = useState({
        isValid: true,
        message: ""
    })

    const [showSlowLoadingIndicator, setShowSlowLoadingIndicator] = useState(false);

    // Show loading indicator after 2 seconds of loading
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (loading) {
            timer = setTimeout(() => {
                setShowSlowLoadingIndicator(true);
            }, 2000);
        } else {
            setShowSlowLoadingIndicator(false);
        }
        return () => clearTimeout(timer);
    }, [loading]);

    // Verify route access based on user ID and role
    const verifyRouteAccess = () => {
        if (!user?.role) {
            setRouteVerification({
                isValid: false,
                message: "User authentication required"
            })
            return false
        }

        const urlRole = params?.role


        // Verify role matches
        if (urlRole && urlRole !== user.role) {
            setRouteVerification({
                isValid: false,
                message: "Access denied: Role mismatch"
            })
            return false
        }

        setRouteVerification({
            isValid: true,
            message: ""
        })
        return true
    }

    // Run verification when user data or route changes
    useEffect(() => {
        verifyRouteAccess()
    }, [user?.role, pathname, params])

    const handleRetry = () => {
        router.refresh();
    };

    const dashboardMenu = (() => {
        switch (user?.role) {
            case UserRole.SUPER_ADMIN:
                return (dashboardData as SuperAdmin)?.superadmin?.menu;
            case UserRole.ADMIN:
                return (dashboardData as Admin)?.admin?.menu;
            case UserRole.STAFF:
                return (dashboardData as Staff)?.admin?.menu;
            case UserRole.DOCTOR:
                return (dashboardData as Doctor)?.admin?.menu;
            default:
                return [];
        }
    })();


    const sidebarItems = (dashboardMenu ?? []).map((menuItem) => {
        const Icon = getIconComponent(menuItem.icon);

        return {
            label: menuItem.label,
            icon: Icon,
            href: `/${user?.role}/${menuItem.path}`,
        };
    });

    if (loading) {
        return (
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-700 transition-transform duration-300 z-40 flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <SidebarHeaderSkeleton />
                {showSlowLoadingIndicator && <LoadingIndicator />}
                <SidebarNavigationSkeleton />
            </div>
        );
    }

    return (
        <div
            className={`fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-700 transition-transform duration-300 z-40 flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
            {/* Header - Fixed */}
            <div className="flex-shrink-0 p-6 border-b border-slate-700">
                <h1 className="text-xl font-bold text-white">CliniTrack</h1>
                <p className="text-sm text-slate-400">Medical Dashboard</p>

                {/* User Role Badge */}
                <div className="mt-3">
                    <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user?.role)}`}
                    >
                        {(() => {
                            const IconComponent = getRoleIcon(user?.role)
                            return <IconComponent className="w-3 h-3 mr-1" />
                        })()}
                        {user?.role?.toUpperCase()}
                    </div>
                </div>
                {/* Route Verification Status */}
                {!routeVerification.isValid && (
                    <div className="mt-3 p-2 bg-red-900/20 border border-red-700 rounded-md">
                        <div className="flex items-center text-red-400 text-xs">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {routeVerification.message}
                        </div>
                    </div>
                )}
                {/* User Info Display */}
                {/* <div className="mt-3 text-xs text-slate-400">
                    <div>ID: {user?.id}</div>
                    <div>Role: {user?.role}</div>
                </div> */}
            </div>

            {dashboardError ? (
                <SidebarErrorState
                    error={dashboardError}
                    onRetry={handleRetry}
                />
            ) : sidebarItems.length === 0 ? (
                <EmptyNavigationState />
            ) : (

                // {/* Navigation - Scrollable */ }
                < nav className="flex-1 overflow-y-auto p-4">
                    <ul className="space-y-2">
                        {sidebarItems.map((item, index) => {
                            if (!item?.icon || !item?.href) return null; // skip if not mapped
                            const isActive = pathname?.startsWith(item.href);

                            return (
                                <li key={index}>
                                    <Link href={item.href} passHref>
                                        <Button
                                            variant={isActive ? "secondary" : "ghost"}
                                            className="w-full justify-start text-white hover:bg-slate-800"
                                        >
                                            <item.icon className="mr-3 h-4 w-4" />
                                            {item.label}
                                        </Button>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                </nav>
            )
            }

        </div >
    )
}
