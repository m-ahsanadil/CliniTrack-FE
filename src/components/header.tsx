import {
    Bell,
    Menu,
    Search,
    LogOut,
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



export default function Header() {
    const router = useRouter()
    // const params = useParams();
    const pathname = usePathname()
    const dispatch = useAppDispatch();
    // const dashboardId = params.dashboardId;
    // const role = params.role;

    const { user } = useAppSelector(state => state.auth);

    const currentPage = pathname.split("/").pop() || "dashboard"
    const { isSidebarOpen, setIsSidebarOpen, setReportsModalOpen, setSearchTerm, searchTerm } = useGlobalUI();
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
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        }

        // Redirect to login
        router.push('/');
    };

    return (
        // {/* Header */ }
        <header className="flex items-center justify-between p-4 bg-white border-b border-slate-200 shadow-sm" >
            <div className="flex items-center space-x-4">
                <Button
                    variant="ghost"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="text-slate-600 hover:text-slate-900"
                >
                    <Menu className="h-6 w-6" />
                </Button>
                <div>
                    <h1 className="text-lg font-semibold text-slate-900 capitalize">
                        {currentPage
                            .replace(/([A-Z])/g, " $1")
                            .replace(/-/g, " ") // handle kebab-case routes
                            .replace(/\b\w/g, (char) => char.toUpperCase())}
                    </h1>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <RoleGuard allowedRoles={["admin"]}>
                    {currentPage === "dashboard" && (
                        <Button
                            onClick={() => setReportsModalOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            Generate Report
                        </Button>
                    )}
                </RoleGuard>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-10 w-64 border-slate-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                    <Bell className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.password || "/placeholder-user.jpg"} />
                                <AvatarFallback className="bg-blue-600 text-white">
                                    {user?.username
                                        ?.split(" ")
                                        .map((n) => n[0])
                                        .join("") || "U"}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <div className="px-2 py-1.5">
                            <p className="text-sm font-medium">{user?.username}</p>
                            <p className="text-xs text-slate-500">{user?.email}</p>
                            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={goToSettings}>Profile Settings</DropdownMenuItem>
                        <DropdownMenuItem onClick={goToBilling}>Billing</DropdownMenuItem>
                        <DropdownMenuItem onClick={goToSupport}>Support</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}
                            className="text-red-600">
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>

                </DropdownMenu>
            </div>
        </header>

    )
}
