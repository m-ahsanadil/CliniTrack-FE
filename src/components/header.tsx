import {
    Bell,
    Menu,
    Search,
    LogOut,
    FileText,
    User,
    CreditCard,
    HelpCircle,
    Loader2,
    Camera,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useParams, usePathname, useRouter } from 'next/navigation'

// Import components
import { RoleGuard } from "@/components/role-guard"
import { useGlobalUI } from "@/src/redux/providers/contexts/GlobalUIContext"
import { useAppDispatch, useAppSelector } from "../redux/store/reduxHook"
import { logout } from "../modules/Authentication/auth/api/slice"
import { persistor } from "../redux/store/store"
import { PURGE } from "redux-persist"
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react"
import { profileApi } from "../modules/Authentication/profile/api/api"



export default function Header() {
    const router = useRouter()
    // const fileInputRef = useRef<HTMLInputElement | null>(null);
    const previousUrlRef = useRef<string | null>(null);
    const pathname = usePathname()
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const { isSidebarOpen, setIsSidebarOpen, setReportsModalOpen, setSearchTerm, searchTerm } = useGlobalUI();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [uploading, setUploading] = useState<boolean>(false);

    const currentPage = pathname.split("/").pop() || "dashboard"

    const handleChangePhotoClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';

        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                handlePhotoUpload(file);
            }
            document.body.removeChild(input);
        };

        document.body.appendChild(input);
        input.click();
    };

    const goToSettings = () => {
        router.push(`/${user?.id}/${user?.role}/settings`)
    }

    const goToBilling = () => {
        router.push(`/${user?.id}/${user?.role}/billing`)
    }


    const goToSupport = () => {
        router.push("/support")
    }

    const handleLogout = async () => {
        // Method 1: Dispatch logout action first, then purge
        dispatch(logout());

        // Clear persisted state
        await persistor.purge();

        // Clear any additional localStorage items
        if (typeof window !== 'undefined') {
            // localStorage.removeItem('token');
        }

        // Redirect to login
        router.push('/');
    };
    const fetchPhoto = useCallback(async () => {
        if (!user?.id) return;

        setLoading(true);
        try {
            const blob = await profileApi.get_photo(user.id);
            const url = URL.createObjectURL(blob);
            if (previousUrlRef.current) {
                URL.revokeObjectURL(previousUrlRef.current);
            }
            previousUrlRef.current = url;
            setImageUrl(url);
        } catch (err) {
            console.log("❌ Failed to fetch photo:", err);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    const handlePhotoUpload = useCallback(async (file: File) => {
        const formData = new FormData();
        formData.append("photo", file);

        try {
            setUploading(true);
            await profileApi.upload_photo(formData);
            await fetchPhoto();
        } catch (err: any) {
            console.log("❌ Upload failed:", err.message);
        } finally {
            setUploading(false);
        }
    }, [fetchPhoto]);

    useEffect(() => {
        fetchPhoto();
    }, [fetchPhoto]);

    return (
        <header className="bg-white border-b border-slate-200 shadow-sm">
            {/* Main Header Row */}
            <div className="flex items-center justify-between px-4 py-3">
                {/* Left Section: Menu + Title */}
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-slate-600 hover:text-slate-900 p-2"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <h1 className="text-base md:text-lg font-semibold text-slate-900 capitalize truncate">
                        {currentPage
                            .replace(/([A-Z])/g, " $1")
                            .replace(/-/g, " ")
                            .replace(/\b\w/g, (char) => char.toUpperCase())}
                    </h1>
                </div>

                {/* Right Section: Action Icons */}
                <div className="flex items-center space-x-1">
                    {/* Generate Report - Icon on mobile, button on desktop */}
                    <RoleGuard allowedRoles={["admin"]}>
                        {currentPage === "dashboard" && (
                            <>
                                {/* Mobile: Icon Button */}
                                <Button
                                    size="sm"
                                    onClick={() => setReportsModalOpen(true)}
                                    className="md:hidden bg-indigo-600 hover:bg-indigo-700 text-white p-2"
                                >
                                    <FileText className="h-4 w-4" />
                                </Button>

                                {/* Desktop: Text Button */}
                                <Button
                                    onClick={() => setReportsModalOpen(true)}
                                    className="hidden md:flex bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2"
                                >
                                    <FileText className="h-4 w-4 mr-2" />
                                    Generate Report
                                </Button>
                            </>
                        )}
                    </RoleGuard>

                    {/* Search Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-600 hover:text-slate-900 p-2"
                        onClick={() => {
                            // Toggle search bar or open search modal
                            console.log('Toggle search');
                        }}
                    >
                        <Search className="h-4 w-4" />
                    </Button>

                    {/* Notifications */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-600 hover:text-slate-900 p-2 relative"
                    >
                        <Bell className="h-4 w-4" />
                        {/* Notification badge */}
                        <span className="absolute -top-1 right-0.5 h-3 w-3 bg-red-500 rounded-full"></span>
                    </Button>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-1 rounded-full">
                                <Avatar className="h-7 w-7">
                                    {(loading || uploading) ? (
                                        <AvatarFallback className="bg-slate-200">
                                            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                                        </AvatarFallback>
                                    ) : (
                                        imageUrl ? (
                                            <AvatarImage
                                                src={imageUrl || "/placeholder-user.jpg"}
                                                alt={`${user?.fullName || user?.username || 'User'}'s profile photo`}
                                                className="object-cover"
                                                onLoad={(e) => (e.currentTarget.style.opacity = "1")}
                                            />
                                        ) : (
                                            <AvatarFallback className="bg-blue-600 text-white text-xs">
                                                {user?.username?.split(" ").map(n => n[0]).join("") || "U"}
                                            </AvatarFallback>
                                        )
                                    )}
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <div className="px-3 py-2">
                                <p className="text-sm font-medium truncate">{user?.fullName}</p>
                                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 capitalize mt-1">
                                    {user?.role}
                                </span>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleChangePhotoClick}
                            >
                                <Camera className="mr-2 h-4 w-4" />
                                Change Photo
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={goToSettings}>
                                <User className="mr-2 h-4 w-4" />
                                Profile Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={goToBilling}>
                                <CreditCard className="mr-2 h-4 w-4" />
                                Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={goToSupport}>
                                <HelpCircle className="mr-2 h-4 w-4" />
                                Support
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Desktop Search Bar - Full Width */}
            <div className="hidden md:block px-4 pb-3">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                        type="search"
                        placeholder="Search anything..."
                        className="pl-10 w-full border-slate-300 bg-slate-50 focus:bg-white text-slate-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Mobile Search Bar - Expandable (hidden by default) */}
            <div className="md:hidden px-4 pb-3 border-t border-slate-100 bg-slate-50" style={{ display: 'none' }} id="mobile-search">
                <div className="relative pt-3 flex">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black h-4 w-4" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-10 w-full text-slate-500 border-slate-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            
        </header >
    )
}
