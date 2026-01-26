"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, User, Save, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ISD_CODES, COUNTRIES, INDIAN_STATES } from "@/lib/types"
import axios from "axios"
import toast from "react-hot-toast"

type User = {
    firstName: string
    lastName: string
    phoneNumber: {
        isdCode: string
        number: string
    }
    email: string
    address: {
        locality: string,
        city: string,
        state: string,
        pincode: string,
        country: string,
    }
}

export default function EditProfilePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        isdCode: "",
        number: "",
        locality: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
    })

    useEffect(() => {
        async function getData() {
            try {

                const response = await axios.get("/api/user/userProfile")

                if (response?.data?.success) {

                    setFormData({
                        firstName: response?.data?.user?.firstName || "",
                        lastName: response?.data?.user?.lastName || "",
                        email: response?.data?.user?.email || "",
                        isdCode: response?.data?.user?.phoneNumber.isdCode || "+91",
                        number: response?.data?.user?.phoneNumber.number || "",
                        locality: response?.data?.user?.address.locality || "",
                        city: response?.data?.user?.address.city || "",
                        state: response?.data?.user?.address.state || "",
                        pincode: response?.data?.user?.address.pincode || "",
                        country: response?.data?.user?.address.country || "India",
                    })

                }

            } catch (error: any) {
                console.log("Error in fetching profile", error)
            }

        }
        getData();
    }, [])

    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }))
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
        if (!formData.email.trim()) newErrors.email = "Email is required"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format"
        if (!formData.number.trim()) newErrors.phone = "Phone number is required"
        else if (!/^[\d\s-]{10,}$/.test(formData.number)) newErrors.number = "Invalid phone number"
        if (!formData.locality.trim()) newErrors.locality = "Locality is required"
        if (!formData.city.trim()) newErrors.city = "City is required"
        if (!formData.state.trim()) newErrors.state = "State is required"
        if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required"
        else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Pincode must be 6 digits"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setLoading(true)

        const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: {
                isdCode: formData.isdCode,
                number: formData.number,
            },
            email: formData.email,
            address: {
                locality: formData.locality,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                country: formData.country,
            }
        }


        try {

            const response = await axios.post("/api/user/editProfile", payload)

            if (response?.data?.success) {
                toast.success("Profile Updated Successfully")
                setLoading(false)
                router.push("/profile")
            }

        } catch (error: any) {
            console.log("Unable to Edit Profile", error)
            toast.error("Unable to edit Profile")
        }

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-8 bg-muted/30">
                <div className="container mx-auto px-4 max-w-3xl">
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
                        <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
                        <p className="text-muted-foreground">Update your personal information and delivery address</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Personal Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Personal Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">
                                                First Name <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="firstName"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                className={errors.firstName ? "border-destructive" : ""}
                                            />
                                            {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">
                                                Last Name <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="lastName"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                className={errors.lastName ? "border-destructive" : ""}
                                            />
                                            {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">
                                            Email <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={errors.email ? "border-destructive" : ""}
                                        />
                                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                    </div>

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
                                                value={formData.number}
                                                onChange={handleChange}
                                                className={`flex-1 ${errors.number ? "border-destructive" : ""}`}
                                            />
                                        </div>
                                        {errors.number && <p className="text-sm text-destructive">{errors.number}</p>}
                                    </div>

                                    {/* Address Details */}
                                    <div className="pt-4 border-t">
                                        <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>

                                        <div className="space-y-4">
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
                                                {errors.locality && <p className="text-sm text-destructive">{errors.locality}</p>}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="country">
                                                        Country <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {COUNTRIES.map((country) => (
                                                                <SelectItem key={country.code} value={country.name}>
                                                                    {country.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="city">
                                                        City <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Input
                                                        id="city"
                                                        name="city"
                                                        value={formData.city}
                                                        onChange={handleChange}
                                                        className={errors.city ? "border-destructive" : ""}
                                                    />
                                                    {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="state">
                                                        State/Province <span className="text-destructive">*</span>
                                                    </Label>
                                                    {formData.country === "India" ? (
                                                        <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                                                            <SelectTrigger>
                                                                <SelectValue />
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
                                                            id="state"
                                                            name="state"
                                                            placeholder="State/Province"
                                                            value={formData.state}
                                                            onChange={handleChange}
                                                            className={errors.state ? "border-destructive" : ""}
                                                        />
                                                    )}
                                                    {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
                                                </div>


                                                <div className="space-y-2">
                                                    <Label htmlFor="pincode">
                                                        Pincode <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Input
                                                        id="pincode"
                                                        name="pincode"
                                                        placeholder="123456"
                                                        value={formData.pincode}
                                                        onChange={handleChange}
                                                        className={errors.pincode ? "border-destructive" : ""}
                                                        maxLength={6}
                                                    />
                                                    {errors.pincode && <p className="text-sm text-destructive">{errors.pincode}</p>}
                                                </div>
                                            </div>


                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-4">
                                        <Button type="submit" disabled={loading} className="flex-1">
                                            {loading ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Saving Changes...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4 mr-2" />
                                                    Save Changes
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
