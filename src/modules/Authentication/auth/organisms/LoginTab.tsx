import React, { useImperativeHandle, forwardRef } from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Eye, EyeOff, AlertCircle, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLogin } from '../api/hooks/uselogin';
import { useGlobalUI } from '@/src/redux/providers/contexts/GlobalUIContext';

interface LoginTabHandle {
    quickLogin: (email: string, password: string) => void;
}

interface LoginTabProps {
    isSuperAdmin?: boolean;
    pageContent?: {
        title: string;
        subtitle: string;
        description: string;
        icon: any;
        bgGradient: string;
    };
}



export const LoginTab = forwardRef<LoginTabHandle, LoginTabProps>(({ isSuperAdmin = false, pageContent }, ref) => {
    const { formik, loginLoading, loginError, isNavigating } = useLogin();
    const {
        toggleLoginPasswordVisibility,
        showLoginPassword,
    } = useGlobalUI();

    useImperativeHandle(ref, () => ({
        quickLogin: (email: string, password: string) => {
            formik.setValues({ email, password });
            setTimeout(() => {
                formik.submitForm();
            }, 0); // ensure values are set before submit
        },
    }));

    const getLoginContent = () => {
        if (isSuperAdmin) {
            return {
                title: "Super Administrator Access",
                description: "Secure login for system administrators only",
                footerText: "This is a restricted access portal for super administrators only.",
                cardStyle: "bg-white/95 backdrop-blur border-0 shadow-2xl border-red-200",
                buttonStyle: "w-full h-12 bg-red-600 hover:bg-red-700 text-white",
                alertStyle: "bg-red-50 border-red-200"
            };
        }
        return {
            title: "Welcome Back",
            description: pageContent?.description || "Sign in to access your CliniTrack dashboard",
            footerText: "For demo purposes, use the accounts in the \"Demo Accounts\" tab",
            cardStyle: "bg-white/95 backdrop-blur border-0 shadow-2xl",
            buttonStyle: "w-full h-12 bg-blue-600 hover:bg-blue-700 text-white",
            alertStyle: "bg-blue-50 border-blue-200"
        };
    };

    const loginContent = getLoginContent();
    return (
        <TabsContent value="login">
            <Card className={loginContent.cardStyle}>
                <CardHeader className="text-center">
                    {isSuperAdmin && (
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-red-600 p-2 rounded-full">
                                <ShieldCheck className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    )}
                    <CardTitle className="text-2xl text-slate-800">{loginContent.title}</CardTitle>
                    <CardDescription>{loginContent.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    {isSuperAdmin && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                <p className="text-sm text-red-700 font-medium">
                                    Restricted Access Zone
                                </p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="text"
                                name="email"
                                value={formik.values.email}
                                placeholder={isSuperAdmin ? "Enter admin email" : "Enter your email"}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="h-12"
                                disabled={loginLoading}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-sm text-red-600">{formik.errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-700">
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showLoginPassword ? "text" : "password"}
                                    placeholder={isSuperAdmin ? "Enter admin password" : "Enter your password"}
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="h-12 pr-12"
                                    disabled={loginLoading}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                                    onClick={toggleLoginPasswordVisibility}
                                >
                                    {showLoginPassword ? (
                                        <EyeOff className="h-4 w-4 text-slate-500" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-slate-500" />
                                    )}
                                </Button>
                            </div>
                            {formik.touched.password && formik.errors.password && (
                                <p className="text-sm text-red-600">{formik.errors.password}</p>
                            )}
                        </div>

                        {loginError && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{loginError}</AlertDescription>
                            </Alert>
                        )}

                        {isNavigating && (
                            <Alert>
                                <AlertDescription>Redirecting to dashboard...</AlertDescription>
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            className={loginContent.buttonStyle}
                            disabled={loginLoading || formik.isSubmitting}
                        >
                            {loginLoading ?
                                (isSuperAdmin ? "Authenticating..." : "Signing In...") :
                                (isSuperAdmin ? "Access Admin Portal" : "Sign In")
                            }
                        </Button>
                    </form>

                    {!isSuperAdmin && (
                        <div className="mt-6 pt-6 border-t border-slate-200">
                            <p className="text-sm text-slate-600 text-center">
                                {loginContent.footerText}
                            </p>
                        </div>
                    )}

                    {isSuperAdmin && (
                        <div className="mt-6 pt-6 border-t border-slate-200">
                            <p className="text-sm text-slate-600 text-center">
                                {loginContent.footerText}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
    )
});

LoginTab.displayName = 'LoginTab';