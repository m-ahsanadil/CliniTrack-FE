import { Bell, Calendar, ChevronDown, FileText, Home, Menu, Receipt, Search, Settings, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-700">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">CT</span>
              </div>
              <span className="font-semibold text-lg hidden sm:block">CliniTrack</span>
            </div>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search..."
                className="pl-10 bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 bg-red-500 text-xs">2</Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-slate-800 border-slate-700">
                <div className="p-3 border-b border-slate-700">
                  <h4 className="font-medium">Notifications (258)</h4>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <DropdownMenuItem className="p-3 hover:bg-slate-700">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Receipt className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Your order is placed</p>
                        <p className="text-xs text-slate-400">Dummy text of the printing and typesetting industry.</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-3 hover:bg-slate-700">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Bell className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New Message received</p>
                        <p className="text-xs text-slate-400">You have 87 unread messages</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </div>
                <div className="p-3 border-t border-slate-700">
                  <Button variant="ghost" className="w-full text-blue-400 hover:text-blue-300">
                    View all
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>AA</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                <DropdownMenuItem className="hover:bg-slate-700">
                  <Users className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-slate-700">
                  <Settings className="mr-2 h-4 w-4" />
                  Clinic Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem className="hover:bg-slate-700">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 bottom-0 w-64 bg-slate-800 border-r border-slate-700 overflow-y-auto">
          {/* User Profile */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg?height=48&width=48" />
                <AvatarFallback>AA</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">Mr. Ahsan Adil</h3>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-slate-400">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4">
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Main</h4>
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start bg-blue-600 text-white hover:bg-blue-700">
                    <Home className="mr-3 h-4 w-4" />
                    Dashboard
                    <Badge className="ml-auto bg-red-500">9+</Badge>
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Clinic</h4>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <Users className="mr-3 h-4 w-4" />
                    Patients
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <Calendar className="mr-3 h-4 w-4" />
                    Appointments
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <FileText className="mr-3 h-4 w-4" />
                    Medical Records
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <Receipt className="mr-3 h-4 w-4" />
                    Billing & Invoices
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    Clinic Settings
                  </Button>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold flex items-center">
                  <Home className="mr-2 h-6 w-6" />
                  Dashboard
                </h1>
                <nav className="flex items-center space-x-2 text-sm text-slate-400 mt-1">
                  <span>CliniTrack</span>
                  <span>/</span>
                  <span>Dashboard</span>
                </nav>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">Create Report</Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Total Sales</p>
                    <p className="text-3xl font-bold">40k</p>
                    <p className="text-sm text-green-400 flex items-center mt-1">
                      <span className="mr-1">↗</span>
                      14.5% Up From Last Week
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Receipt className="h-6 w-6 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Total Revenue</p>
                    <p className="text-3xl font-bold">$9090</p>
                    <p className="text-sm text-green-400 flex items-center mt-1">
                      <span className="mr-1">↗</span>
                      14.5% Up from yesterday
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Average Product Price</p>
                    <p className="text-3xl font-bold">$1280.00</p>
                    <p className="text-sm text-green-400 flex items-center mt-1">
                      <span className="mr-1">↗</span>
                      35.5% Last 100 Subscriptions
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-pink-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* World Wide Customers */}
          <Card className="bg-slate-800 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle>World Wide Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <img src="/placeholder.svg?height=30&width=45" alt="US Flag" className="w-8 h-6" />
                    <div>
                      <h5 className="font-medium">Our most customers in America</h5>
                      <Badge variant="secondary">March 2019</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mb-6">
                    But who has any right to find fault with a man who chooses to enjoy a pleasure that has no.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-400 mb-2">Domestic Customers</p>
                      <div className="flex items-center space-x-2">
                        <img src="/placeholder.svg?height=20&width=30" alt="US Flag" className="w-6 h-4" />
                        <span className="text-xl font-bold">2.8k</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1 mt-2">
                        <div className="bg-green-500 h-1 rounded-full" style={{ width: "75%" }}></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-2">International Customers</p>
                      <div className="flex items-center space-x-2">
                        <Settings className="w-6 h-4 text-slate-400" />
                        <span className="text-xl font-bold">1.9k</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1 mt-2">
                        <div className="bg-yellow-500 h-1 rounded-full" style={{ width: "55%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700 rounded-lg p-4 flex items-center justify-center">
                  <div className="text-center">
                    <Settings className="h-16 w-16 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-400">World Map Placeholder</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order List */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Order List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead>Product</TableHead>
                    <TableHead>Pro Name</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Order Date/Time</TableHead>
                    <TableHead>Pcs.</TableHead>
                    <TableHead>Amount ($)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-slate-700">
                    <TableCell>
                      <img src="/placeholder.svg?height=40&width=40" alt="Product" className="w-10 h-10 rounded" />
                    </TableCell>
                    <TableCell>Bag</TableCell>
                    <TableCell>
                      <img src="/placeholder.svg?height=20&width=30" alt="US Flag" className="w-6 h-4" />
                    </TableCell>
                    <TableCell>3/03/2019 4:29 PM</TableCell>
                    <TableCell>200</TableCell>
                    <TableCell>$750</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500/20 text-green-400">Shipped</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-slate-700">
                    <TableCell>
                      <img src="/placeholder.svg?height=40&width=40" alt="Product" className="w-10 h-10 rounded" />
                    </TableCell>
                    <TableCell>Watch</TableCell>
                    <TableCell>
                      <img src="/placeholder.svg?height=20&width=30" alt="French Flag" className="w-6 h-4" />
                    </TableCell>
                    <TableCell>13/03/2019 1:09 PM</TableCell>
                    <TableCell>180</TableCell>
                    <TableCell>$970</TableCell>
                    <TableCell>
                      <Badge className="bg-red-500/20 text-red-400">Delivered</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-slate-700">
                    <TableCell>
                      <img src="/placeholder.svg?height=40&width=40" alt="Product" className="w-10 h-10 rounded" />
                    </TableCell>
                    <TableCell>Headphone</TableCell>
                    <TableCell>
                      <img src="/placeholder.svg?height=20&width=30" alt="Spain Flag" className="w-6 h-4" />
                    </TableCell>
                    <TableCell>22/03/2019 12:09 PM</TableCell>
                    <TableCell>30</TableCell>
                    <TableCell>$2800</TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-500/20 text-yellow-400">Pending</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
