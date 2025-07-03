import React, { useImperativeHandle, forwardRef } from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLogin } from '../auth/api/hooks/uselogin';
import { useGlobalUI } from '@/src/redux/providers/contexts/GlobalUIContext';

interface LoginTabHandle {
    quickLogin: (email: string, password: string) => void;
}


export const LoginTab = forwardRef<LoginTabHandle>((_props, ref) => {
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

    return (
        <TabsContent value="login">
            <Card className="bg-white/95 backdrop-blur border-0 shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-slate-800">Welcome Back</CardTitle>
                    <CardDescription>Sign in to access your CliniTrack dashboard</CardDescription>
                </CardHeader>
                <CardContent>
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
                                placeholder="Enter your email"
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
                                    placeholder="Enter your password"
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
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loginLoading || formik.isSubmitting}
                        >
                            {loginLoading ? "Signing In..." : "Sign In"}
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
    )
});

LoginTab.displayName = 'LoginTab';