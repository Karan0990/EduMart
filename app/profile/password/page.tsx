"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, KeyRound, Save, Loader2, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import axios from "axios"

export default function ChangePasswordPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    })

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }))
        }
    }

    const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
    }

    // Password strength checker
    const getPasswordStrength = (password: string) => {
        if (!password) return { strength: 0, label: "", color: "" }

        let strength = 0
        if (password.length >= 8) strength++
        if (password.length >= 12) strength++
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
        if (/\d/.test(password)) strength++
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++

        if (strength <= 2) return { strength, label: "Weak", color: "bg-red-500 text-red-500 border-red-500", width: "33%" }
        if (strength <= 3)
            return { strength, label: "Medium", color: "bg-yellow-500 text-yellow-500 border-yellow-500", width: "66%" }
        return { strength, label: "Strong", color: "bg-green-500 text-green-500 border-green-500", width: "100%" }
    }

    const passwordStrength = getPasswordStrength(formData.newPassword)

    // Password requirements
    const requirements = [
        { label: "At least 8 characters", met: formData.newPassword.length >= 8 },
        {
            label: "Contains uppercase & lowercase",
            met: /[a-z]/.test(formData.newPassword) && /[A-Z]/.test(formData.newPassword),
        },
        { label: "Contains number", met: /\d/.test(formData.newPassword) },
        { label: "Contains special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) },
    ]

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.currentPassword) newErrors.currentPassword = "Current password is required"
        if (!formData.newPassword) newErrors.newPassword = "New password is required"
        else if (formData.newPassword.length < 8) newErrors.newPassword = "Password must be at least 8 characters"
        else if (passwordStrength.strength < 3) newErrors.newPassword = "Password is too weak"
        if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password"
        else if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setLoading(true)

        const payload = {
            oldPassword: formData.currentPassword,
            password: formData.newPassword,
            confirmPassword: formData.confirmPassword
        }

        try {

            const response = await axios.post("/api/user/resetPasswordFromProfile", payload)
            if (response?.data?.success) {
                toast.success("Passowrd Updated SuccessFully")
                setLoading(false)
                router.push("/profile")
            }

        } catch (error: any) {
            console.log("Unable to change Password", error)
            toast.error("Unable to change Password")
        }


    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-8 bg-muted/30">
                <div className="container mx-auto px-4 max-w-2xl">
                    {/* Back Button */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <Button variant="ghost" asChild className="mb-6">
                            <Link href="/profile">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Profile
                            </Link>
                        </Button>
                    </motion.div>

                    {/* Page Header */}
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Change Password</h1>
                        <p className="text-muted-foreground">Update your password to keep your account secure</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <KeyRound className="h-5 w-5" />
                                    Password Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Current Password */}
                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword">
                                            Current Password <span className="text-destructive">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="currentPassword"
                                                name="currentPassword"
                                                type={showPasswords.current ? "text" : "password"}
                                                value={formData.currentPassword}
                                                onChange={handleChange}
                                                className={errors.currentPassword ? "border-destructive pr-10" : "pr-10"}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => togglePasswordVisibility("current")}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {errors.currentPassword && <p className="text-sm text-destructive">{errors.currentPassword}</p>}
                                    </div>

                                    {/* New Password */}
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">
                                            New Password <span className="text-destructive">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="newPassword"
                                                name="newPassword"
                                                type={showPasswords.new ? "text" : "password"}
                                                value={formData.newPassword}
                                                onChange={handleChange}
                                                className={errors.newPassword ? "border-destructive pr-10" : "pr-10"}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => togglePasswordVisibility("new")}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword}</p>}

                                        {/* Password Strength Indicator */}
                                        {formData.newPassword && (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                                        <motion.div
                                                            className={`h-full ${passwordStrength.color.split(" ")[0]}`}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: passwordStrength.width }}
                                                            transition={{ duration: 0.3 }}
                                                        />
                                                    </div>
                                                    <span className={`text-xs font-medium ${passwordStrength.color.split(" ")[1]}`}>
                                                        {passwordStrength.label}
                                                    </span>
                                                </div>

                                                {/* Password Requirements */}
                                                <div className="space-y-1 pt-2">
                                                    {requirements.map((req, index) => (
                                                        <div key={index} className="flex items-center gap-2 text-xs">
                                                            {req.met ? (
                                                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                                                            ) : (
                                                                <XCircle className="h-3 w-3 text-muted-foreground" />
                                                            )}
                                                            <span className={req.met ? "text-green-600" : "text-muted-foreground"}>{req.label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">
                                            Confirm New Password <span className="text-destructive">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type={showPasswords.confirm ? "text" : "password"}
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className={errors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => togglePasswordVisibility("confirm")}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                                        {formData.confirmPassword &&
                                            formData.newPassword === formData.confirmPassword &&
                                            !errors.confirmPassword && (
                                                <p className="text-sm text-green-600 flex items-center gap-1">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Passwords match
                                                </p>
                                            )}
                                    </div>

                                    {/* Security Notice */}
                                    <div className="bg-muted/50 border rounded-lg p-4">
                                        <h4 className="font-medium mb-2 text-sm">Password Security Tips</h4>
                                        <ul className="text-xs text-muted-foreground space-y-1">
                                            <li>• Use a unique password for this account</li>
                                            <li>• Avoid using personal information</li>
                                            <li>• Consider using a password manager</li>
                                            <li>• Never share your password with anyone</li>
                                        </ul>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-4">
                                        <Button type="submit" disabled={loading} className="flex-1">
                                            {loading ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Updating Password...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4 mr-2" />
                                                    Update Password
                                                </>
                                            )}
                                        </Button>
                                        <Button type="button" variant="outline" onClick={() => router.push("/profile")} disabled={loading}>
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
