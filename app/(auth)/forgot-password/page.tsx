'use client'

import type React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [emailSent, setEmailSent] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        setTimeout(() => {
            setEmailSent(true)
            setIsLoading(false)
        }, 1500)

        try {
            const response = await axios.post('/api/user/forgotPassword', { email })

            if (response?.data?.success) {
                toast.success(response.data.message)
            } else {
                toast.error('Invalid Entered Email')
            }

        } catch (error: any) {
            console.log('Error sending reset email:', error)
        }

    }

    const handleReset = () => {
        setEmail('')
        setEmailSent(false)
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
                            <CardTitle className="text-2xl">Reset Password</CardTitle>
                            <CardDescription>
                                {emailSent
                                    ? 'Check your email for reset instructions'
                                    : 'Enter your email address and we will send you a link to reset your password'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!emailSent ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
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
                                        <p className="text-sm text-muted-foreground">
                                            We will send a password reset link to this email address
                                        </p>
                                    </div>

                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button type="submit" className="w-full" disabled={isLoading}>
                                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                                        </Button>
                                    </motion.div>

                                    <div className="text-center text-sm">
                                        <Link href="/login" className="text-primary hover:underline font-medium inline-flex items-center gap-1">
                                            <ArrowLeft className="w-4 h-4" />
                                            Back to Login
                                        </Link>
                                    </div>
                                </form>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    <div className="flex justify-center">
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 0.6 }}
                                            className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"
                                        >
                                            <Mail className="w-8 h-8 text-primary" />
                                        </motion.div>
                                    </div>

                                    <div className="space-y-2 text-center">
                                        <h3 className="font-semibold text-foreground">Check your email</h3>
                                        <p className="text-sm text-muted-foreground">
                                            We have sent a password reset link to
                                            <br />
                                            <span className="font-medium text-foreground">{email}</span>
                                        </p>
                                    </div>

                                    <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 space-y-2">
                                        <p className="text-sm font-medium text-foreground">What happens next?</p>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li className="flex gap-2">
                                                <span className="text-accent font-bold">•</span>
                                                <span>Click the link in your email</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <span className="text-accent font-bold">•</span>
                                                <span>Enter your new password</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <span className="text-accent font-bold">•</span>
                                                <span>You will be logged in automatically</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <p className="text-xs text-muted-foreground text-center">
                                        Didn't receive an email? Check your spam folder or{' '}
                                        <button
                                            type="button"
                                            onClick={handleReset}
                                            className="text-primary hover:underline font-medium"
                                        >
                                            try another email
                                        </button>
                                    </p>

                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button
                                            variant="outline"
                                            className="w-full bg-transparent"
                                            onClick={() => {
                                                router.push("/login")
                                            }}
                                        >
                                            Back to Login
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </main>
            <Footer />
        </div>
    )
}
