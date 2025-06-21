"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Stethoscope, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormEvent, useState } from "react";
import { useAuth } from "@/src/redux/providers/contexts/auth-context";
import { loginApi, registerApi } from "./api/api";
import { demoAccounts } from "@/src/constants";
import { useAppDispatch } from "@/src/redux/store/reduxHook";
import { useRouter } from "next/navigation";
import { setCredentials } from "./api/slice";
import { LoginApiResponse } from "./api/types";

export default function index() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isLoading } = useAuth()
    const [activeTab, setActiveTab] = useState("login");
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    })

    const [registerData, setRegisterData] = useState({
        username: "",
        email: "",
        password: "",
        role: "",
    })


    const handleLogin = async (e: FormEvent) => {
        e.preventDefault()
        setError("")

        if (!loginData.email || !loginData.password) {
            setError("Please fill in all fields")
            return
        }

        try {
            // Pass both email and password as an object
            const response: LoginApiResponse = await loginApi.login({
                usernameOrEmail: loginData.email,
                password: loginData.password
            })

            if (response.success) {
                dispatch(setCredentials({
                    token: response.token,
                    user: response.user
                }));
                router.push("/dashboard")
            }
        } catch (error) {
            console.log('Login error:', error)
            setError("Invalid email or password")
        }

    }

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault()
        setError("")

        if (!registerData.email || !registerData.password || !registerData.username || !registerData.role) {
            setError("Please fill in all fields")
            return
        }

        try {
            // Pass both email and password as an object
            const response = await registerApi.register({
                username: registerData.username,
                email: registerData.email,
                password: registerData.password,
                role: registerData.role as "doctor" | "staff" | "admin"
            })

            if (response.success) {
                // After successful registration, switch to login tab
                setActiveTab("login");
            }

        } catch (error) {
            console.log('Register error:', error)
            setError("Invalid fields")
        }

    }

    const quickLogin = (email: string, password: string) => {
        setLoginData({ email, password })
    }

    const sanitize = (text: string) =>
        text.toLowerCase().replace(/[^a-z0-9]/g, "");



    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-blue-600 p-3 rounded-full">
                            <Stethoscope className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">CliniTrack</h1>
                    <p className="text-slate-300">Medical Administration Dashboard</p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Register</TabsTrigger>
                        <TabsTrigger value="demo">Demo Accounts</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                        <Card className="bg-white/95 backdrop-blur border-0 shadow-2xl">
                            <CardHeader className="text-center">
                                <CardTitle className="text-2xl text-slate-800">Welcome Back</CardTitle>
                                <CardDescription>Sign in to access your CliniTrack dashboard</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-slate-700">
                                            Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            value={loginData.email}
                                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                            className="h-12"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-slate-700">
                                            Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter your password"
                                                value={loginData.password}
                                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                                className="h-12 pr-12"
                                                disabled={isLoading}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4 text-slate-500" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-slate-500" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    {error && (
                                        <Alert variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Signing In..." : "Sign In"}
                                    </Button>
                                </form>

                                <div className="mt-6 pt-6 border-t border-slate-200">
                                    <p className="text-sm text-slate-600 text-center">
                                        For demo purposes, use the accounts in the "Demo Accounts" tab
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="register">
                        <Card className="bg-white/95 backdrop-blur border-0 shadow-2xl">
                            <CardHeader className="text-center">
                                <CardTitle className="text-2xl text-slate-800">Create Account</CardTitle>
                                <CardDescription>Register to access CliniTrack</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleRegister}
                                    className="space-y-4"
                                >
                                    {/* Role Selector */}
                                    <div className="space-y-2">
                                        <Label htmlFor="role" className="text-slate-700">Role</Label>
                                        <select
                                            id="role"
                                            value={registerData.role}
                                            onChange={(e) => {
                                                const role = e.target.value;
                                                setRegisterData((prev) => ({
                                                    ...prev,
                                                    role,
                                                    email: prev.username
                                                        ? `${sanitize(prev.username)}.${role}@clinitrack.com`
                                                        : "",
                                                }));
                                            }}
                                            className="h-12 w-full rounded-md border border-slate-300 bg-white px-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Role</option>
                                            <option value="doctor">Doctor</option>
                                            <option value="staff">Staff</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>


                                    {/* Username */}
                                    <div className="space-y-2">
                                        <Label htmlFor="username" className="text-slate-700">Username</Label>
                                        <Input
                                            id="username"
                                            placeholder="Enter username"
                                            value={registerData.username}
                                            onChange={(e) => {
                                                const username = e.target.value;
                                                setRegisterData((prev) => ({
                                                    ...prev,
                                                    username,
                                                    email: prev.role
                                                        ? `${sanitize(username)}.${prev.role}@clinitrack.com`
                                                        : "",
                                                }));
                                            }}

                                            className="h-12"
                                        />
                                    </div>

                                    {/* Auto-generated Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-slate-700">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Auto-generated email"
                                            value={registerData.email}
                                            disabled
                                            readOnly
                                            className="h-12 bg-gray-100 text-slate-700 placeholder:text-slate-400 cursor-not-allowed"
                                        />
                                    </div>


                                    {/* Password */}
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-slate-700">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Enter password"
                                            value={registerData.password}
                                            onChange={(e) =>
                                                setRegisterData({ ...registerData, password: e.target.value })
                                            }
                                            className="h-12"
                                        />
                                    </div>

                                    {/* Submit */}
                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        Register
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>



                    <TabsContent value="demo">
                        <Card className="bg-white/95 backdrop-blur border-0 shadow-2xl">
                            <CardHeader className="text-center">
                                <CardTitle className="text-2xl text-slate-800">Demo Accounts</CardTitle>
                                <CardDescription>Click on any account below to auto-fill login credentials</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                    {demoAccounts.map((account) => {
                                        const IconComponent = account.icon
                                        return (
                                            <div
                                                key={account.role}
                                                className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                                                onClick={() => quickLogin(account.email, account.password)}
                                            >
                                                <div className="flex items-start space-x-4">
                                                    <div className={`p-2 rounded-full ${account.color}`}>
                                                        <IconComponent className="h-5 w-5 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <h3 className="font-semibold text-slate-800">{account.name}</h3>
                                                            <Badge variant="secondary" className="capitalize">
                                                                {account.role}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-slate-600 mb-2">{account.description}</p>
                                                        <div className="text-xs text-slate-500">
                                                            <p>Email: {account.email}</p>
                                                            <p>Password: {account.password}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <div className="flex items-start space-x-2">
                                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-blue-800 mb-1">Demo Mode</h4>
                                            <p className="text-sm text-blue-700">
                                                This is a demonstration version. All data is simulated and will reset when you refresh the page.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div >
    )
}
