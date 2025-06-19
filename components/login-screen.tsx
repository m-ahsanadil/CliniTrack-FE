"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { Eye, EyeOff, Stethoscope, Shield, Users, AlertCircle } from "lucide-react"

export default function LoginScreen() {
  const { login, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    const success = await login(formData.email, formData.password)
    if (!success) {
      setError("Invalid email or password")
    }
  }

  const quickLogin = (email: string, password: string) => {
    setFormData({ email, password })
  }

  const demoAccounts = [
    {
      role: "admin",
      email: "admin@clinitrack.com",
      password: "admin123",
      name: "Dr. Sarah Wilson",
      icon: Shield,
      color: "bg-red-500",
      description: "Full system access, user management, reports",
    },
    {
      role: "doctor",
      email: "doctor@clinitrack.com",
      password: "doctor123",
      name: "Dr. Michael Chen",
      icon: Stethoscope,
      color: "bg-blue-500",
      description: "Patient records, appointments, medical notes",
    },
    {
      role: "staff",
      email: "staff@clinitrack.com",
      password: "staff123",
      name: "Jennifer Martinez",
      icon: Users,
      color: "bg-green-500",
      description: "Appointments, patient check-in, basic records",
    },
  ]

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

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="demo">Demo Accounts</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="bg-white/95 backdrop-blur border-0 shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-slate-800">Welcome Back</CardTitle>
                <CardDescription>Sign in to access your CliniTrack dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
    </div>
  )
}
