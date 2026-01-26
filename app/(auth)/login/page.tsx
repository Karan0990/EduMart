"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useRouter } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"

export default function LoginPage() {

    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {

            const response = await axios.post("/api/user/userlogin", { email, password, rememberMe })
            if (response.data.success == true) {
                console.log("Login Successful", response.data)
                toast.success("Login Successful")
                router.push(`/`)
            }

        } catch (error: any) {
            console.log("Unable To Make Login", error)
            toast.error("Unable To Make Login")
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 flex items-center justify-center py-12 px-4 bg-muted/30">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Welcome Back</CardTitle>
                            <CardDescription>Login to your account to continue shopping</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <motion.div whileFocus={{ scale: 1.01 }}>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </motion.div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <motion.div whileFocus={{ scale: 1.01 }}>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </motion.div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked === true)} />
                                        <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                                            Remember me
                                        </Label>
                                    </div>
                                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button type="submit" className="w-full">
                                        Login
                                    </Button>
                                </motion.div>
                            </form>
                            <div className="mt-6 text-center text-sm">
                                {"Don't have an account? "}
                                <Link href="/signup" className="text-primary hover:underline font-medium">
                                    Sign up
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </main>
            <Footer />
        </div>
    )
}
