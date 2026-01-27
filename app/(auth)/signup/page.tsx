"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import axios from "axios"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ISD_CODES, COUNTRIES, INDIAN_STATES } from "@/lib/types"

export default function SignupPage() {

    const router = useRouter()
    const [errors, setErrors] = useState<Record<string, string>>({})


    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        isdCode: "+91",
        number: "",
        email: "",
        password: "",
        locality: "",
        city: "",
        state: "",
        country: "",
        pincode: "",

    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()


        const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: {
                isdCode: formData.isdCode,
                number: formData.number,
            },
            password: formData.password,
            address: {
                locality: formData.locality,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                pincode: formData.pincode,
            },
        }

        try {
            const response = await axios.post("/api/user/userSignup", payload)
            if (response.data.success == true) {
                console.log("Success Message", response.data)
                toast.success("SignUp Successful")
                router.push("/login")
            }
        } catch (error: any) {
            console.log("Unable to Make SignUp")
            toast.error("Signup failed. Please try again.");
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
                    className="w-full max-w-2xl"
                >
                    <Card className="shadow-lg">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-bold">
                                Create an Account
                            </CardTitle>
                            <CardDescription>
                                Sign up to start shopping with us
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-5">

                                {/* Name */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            placeholder="John"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            placeholder="Doe"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <Label>Phone Number <span className="text-destructive">*</span></Label>
                                    <div className="flex gap-2">
                                        <Select value={formData.isdCode} onValueChange={(value) => setFormData({ ...formData, isdCode: value })}>
                                            <SelectTrigger className="w-[140px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ISD_CODES.map((item) => (
                                                    <SelectItem key={item.code} value={item.code}>
                                                        {item.flag} {item.code}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Input
                                            id="number"
                                            name="number"
                                            type="tel"
                                            placeholder="9876543210"
                                            maxLength={formData.isdCode === "+91" ? 10 : undefined}
                                            value={formData.number}
                                            onChange={handleChange}
                                            className={`flex-1 ${errors.number ? "border-destructive" : ""}`}
                                        />
                                    </div>
                                    {errors.number && <p className="text-sm text-destructive">{errors.number}</p>}
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* Address */}
                                <div className="space-y-2">
                                    <Label htmlFor="locality">
                                        Locality / Street Address <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="locality"
                                        name="locality"
                                        value={formData.locality}
                                        onChange={handleChange}
                                        className={errors.locality ? "border-destructive" : ""}
                                    />
                                    {errors.locality && (
                                        <p className="text-sm text-destructive">
                                            {errors.locality}
                                        </p>
                                    )}
                                </div>

                                {/* Country & City */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>
                                            Country <span className="text-destructive">*</span>
                                        </Label>
                                        <Select
                                            value={formData.country}
                                            onValueChange={(value) =>
                                                setFormData({ ...formData, country: value })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select country" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {COUNTRIES.map((country) => (
                                                    <SelectItem
                                                        key={country.code}
                                                        value={country.name}
                                                    >
                                                        {country.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>
                                            City <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className={errors.city ? "border-destructive" : ""}
                                        />
                                        {errors.city && (
                                            <p className="text-sm text-destructive">
                                                {errors.city}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* State, County, Pincode */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>
                                            State <span className="text-destructive">*</span>
                                        </Label>
                                        {formData.country === "India" ? (
                                            <Select
                                                value={formData.state}
                                                onValueChange={(value) =>
                                                    setFormData({ ...formData, state: value })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select state" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {INDIAN_STATES.map((state) => (
                                                        <SelectItem key={state} value={state}>
                                                            {state}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <Input
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                            />
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>
                                            Pincode <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            name="pincode"
                                            maxLength={6}
                                            value={formData.pincode}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* Submit */}
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button type="submit" className="w-full">
                                        Sign Up
                                    </Button>
                                </motion.div>
                            </form>

                            {/* Login Link */}
                            <div className="mt-6 text-center text-sm">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="text-primary font-medium hover:underline"
                                >
                                    Login
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </main>

            <Footer />
        </div>
    );

}
