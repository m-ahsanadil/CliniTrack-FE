"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Stethoscope, AlertCircle, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react";
import { RegisterTab } from "./organisms/RegisterTab";
import { LoginTab } from "./organisms/LoginTab";

interface AuthProps {
    isSuperAdmin?: boolean;
}


export default function index({ isSuperAdmin = false }: AuthProps) {
    const [activeTab, setActiveTab] = useState("login");

    const handleRegistrationSuccess = () => {
        setActiveTab('login');
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
                    {/* <TabsList className={`grid w-full ${isSuperAdmin ? 'grid-cols-1' : 'grid-cols-3'} mb-6`}>
                        <TabsTrigger value="login">Login</TabsTrigger>
                        {!isSuperAdmin && (
                            <>
                                <TabsTrigger value="register" disabled={isSuperAdmin}>Register</TabsTrigger>
                            </>
                        )}
                    </TabsList> */}

                    <TabsList className={`grid grid-cols-1 mb-6`}>
                        <TabsTrigger value="login">Login</TabsTrigger>
                    </TabsList>


                    <LoginTab isSuperAdmin={isSuperAdmin} pageContent={pageContent} />

                    {!isSuperAdmin && (
                        <RegisterTab onSuccessCallback={handleRegistrationSuccess} />
                    )}
                </Tabs>
            </div>
        </div>
    )
}


