'use client'

import type React from 'react'
import { useState, use } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Footer } from '@/components/footer'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'


const PASSWORD_REQUIREMENTS = [
    { regex: /.{8,}/, label: 'At least 8 characters' },
    { regex: /[A-Z]/, label: 'One uppercase letter' },
    { regex: /[a-z]/, label: 'One lowercase letter' },
    { regex: /[0-9]/, label: 'One number' },
    { regex: /[!@#$%^&*]/, label: 'One special character (!@#$%^&*)' },
]

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [resetSuccess, setResetSuccess] = useState(false)

    const router = useRouter();

    const getPasswordStrength = () => {
        const metRequirements = PASSWORD_REQUIREMENTS.filter((req) => req.regex.test(password)).length
        if (metRequirements <= 2) return { strength: 'weak', color: 'text-destructive' }
        if (metRequirements <= 3) return { strength: 'fair', color: 'text-yellow-500' }
        if (metRequirements <= 4) return { strength: 'good', color: 'text-blue-500' }
        return { strength: 'strong', color: 'text-green-500' }
    }

    const passwordsMatch = password && confirmPassword === password
    const allRequirementsMet = PASSWORD_REQUIREMENTS.every((req) => req.regex.test(password))
    const strength = getPasswordStrength()

    const { token } = use(params)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!allRequirementsMet || !passwordsMatch) return

        setIsLoading(true)
        try {

            console.log("Token = ", token)

            const response = await axios.post("/api/user/resetPassword", { confirmPassword, token })

            if (response?.data?.success) {
                toast.success("Password Reset Successfully")
                router.push("/login")
            }

        } catch (error: any) {
            console.log("Unable to reset Password", error)
        }
        setTimeout(() => {
            setResetSuccess(true)
            setIsLoading(false)
        }, 1500)
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <header className="border-b border-border">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-2xl font-bold text-foreground">StationeryHub</h1>
                </div>
            </header>
            <main className="flex-1 flex items-center justify-center py-12 px-4">
                {resetSuccess ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md"
                    >
                        <Card>
                            <CardContent className="pt-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="flex justify-center mb-6"
                                >
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                        <Check className="w-8 h-8 text-green-600" />
                                    </div>
                                </motion.div>

                                <div className="space-y-4 text-center">
                                    <h2 className="text-2xl font-semibold">Password Reset Successful</h2>
                                    <p className="text-muted-foreground">
                                        Your password has been successfully changed. You can now login with your new password.
                                    </p>

                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button className="w-full mt-6" onClick={() => window.location.href = '/login'}>
                                            Go to Login
                                        </Button>
                                    </motion.div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">Create New Password</CardTitle>
                                <CardDescription>Enter a strong password that you will remember</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* New Password */}
                                    <div className="space-y-2">
                                        <Label htmlFor="password">New Password</Label>
                                        <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </motion.div>
                                    </div>

                                    {/* Password Strength */}
                                    {password && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <Label className="text-sm">Password Strength</Label>
                                                <span className={`text-sm font-medium ${strength.color}`}>
                                                    {strength.strength.charAt(0).toUpperCase() + strength.strength.slice(1)}
                                                </span>
                                            </div>
                                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                                <motion.div
                                                    className={`h-full ${strength.strength === 'weak'
                                                        ? 'bg-destructive'
                                                        : strength.strength === 'fair'
                                                            ? 'bg-yellow-500'
                                                            : strength.strength === 'good'
                                                                ? 'bg-blue-500'
                                                                : 'bg-green-500'
                                                        }`}
                                                    initial={{ width: 0 }}
                                                    animate={{
                                                        width:
                                                            strength.strength === 'weak'
                                                                ? '25%'
                                                                : strength.strength === 'fair'
                                                                    ? '50%'
                                                                    : strength.strength === 'good'
                                                                        ? '75%'
                                                                        : '100%',
                                                    }}
                                                />
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Requirements Checklist */}
                                    {password && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                                            <Label className="text-sm">Password Requirements</Label>
                                            <div className="space-y-2">
                                                {PASSWORD_REQUIREMENTS.map((req, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className="flex items-center gap-2 text-sm"
                                                    >
                                                        {req.regex.test(password) ? (
                                                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                        ) : (
                                                            <X className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                                        )}
                                                        <span
                                                            className={
                                                                req.regex.test(password) ? 'text-foreground' : 'text-muted-foreground line-through'
                                                            }
                                                        >
                                                            {req.label}
                                                        </span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Confirm Password */}
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                                            <Input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </motion.div>
                                        {confirmPassword && !passwordsMatch && (
                                            <p className="text-sm text-destructive">Passwords do not match</p>
                                        )}
                                        {passwordsMatch && (
                                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-green-600">
                                                Passwords match
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={!allRequirementsMet || !passwordsMatch || isLoading}
                                        >
                                            {isLoading ? 'Resetting Password...' : 'Reset Password'}
                                        </Button>
                                    </motion.div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </main>
            <Footer />
        </div>
    )
}
