"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Stethoscope, AlertCircle, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRef, useState } from "react";
import { demoAccounts, mockUsers } from "@/src/constants";
import { RegisterTab } from "./organisms/RegisterTab";
import { LoginTab } from "./organisms/LoginTab";
import { useSearchParams } from "next/navigation";

interface AuthProps {
    isSuperAdmin?: boolean;
}


export default function index({ isSuperAdmin = false }: AuthProps) {
    const [activeTab, setActiveTab] = useState("login");
    const loginRef = useRef<{ quickLogin: (email: string, password: string) => void }>(null);

    const handleRegistrationSuccess = () => {
        setActiveTab('login');
    };

    const quickLogin = (email: string, password: string) => {
        setActiveTab("login");
        setTimeout(() => {
            loginRef.current?.quickLogin(email, password);
        }, 100); // small delay to ensure LoginTab is mounted
    };

    // Get title and description based on role
    const getPageContent = () => {
        if (isSuperAdmin) {
            return {
                title: "CliniTrack Admin",
                subtitle: "Super Administrator Portal",
                description: "Secure access to system administration dashboard",
                icon: Shield,
                bgGradient: "from-slate-900 via-red-900 to-slate-900"
            };
        }
        return {
            title: "CliniTrack",
            subtitle: "Medical Administration Dashboard",
            description: "Sign in to access your CliniTrack dashboard",
            icon: Stethoscope,
            bgGradient: "from-slate-900 via-blue-900 to-slate-900"
        };
    };

    const pageContent = getPageContent();
    const IconComponent = pageContent.icon;


    return (
        <div className={`min-h-screen bg-gradient-to-br ${pageContent.bgGradient} flex items-center justify-center p-4`}>
            <div className="w-full max-w-4xl">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <div className={`${isSuperAdmin ? 'bg-red-600' : 'bg-blue-600'} p-3 rounded-full`}>
                            <IconComponent className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">{pageContent.title}</h1>
                    <p className="text-slate-300">{pageContent.subtitle}</p>
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className={`grid w-full ${isSuperAdmin ? 'grid-cols-1' : 'grid-cols-3'} mb-6`}>
                        <TabsTrigger value="login">Login</TabsTrigger>
                        {!isSuperAdmin && (
                            <>
                                <TabsTrigger value="register" disabled={isSuperAdmin}>Register</TabsTrigger>
                                <TabsTrigger value="demo" disabled={isSuperAdmin}>Demo Accounts</TabsTrigger>
                            </>
                        )}
                    </TabsList>



                    <LoginTab ref={loginRef} isSuperAdmin={isSuperAdmin} pageContent={pageContent} />

                    {!isSuperAdmin && (
                        <>
                            <RegisterTab onSuccessCallback={handleRegistrationSuccess} />

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
                        </>
                    )}


                </Tabs>
            </div>
        </div>
    )
}


