"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    User,
    MapPin,
    Package,
    LogOut,
    Edit,
    KeyRound,
} from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import toast from "react-hot-toast"

/* ---------------- TYPES ---------------- */

type Address = {
    locality: string
    city: string
    state: string
    country: string
    pincode: string
}

type UserType = {
    firstName: string
    lastName: string
    email: string
    phoneNumber: {
        isdCode: string,
        number: string
    }
    address: Address
}

type OrderItem = {
    productId: string
    quantity: number
    price: number
}

type Order = {
    _id: string
    orderId: string
    items: OrderItem[]
    totalAmount: number
    status: "pending" | "processed" | "shipped" | "delivered"
    createdAt: string
}

/* ---------------- HELPERS ---------------- */

const getStatusColor = (status: Order["status"]) => {
    switch (status) {
        case "pending":
            return "bg-yellow-100 text-yellow-800"
        case "processed":
            return "bg-blue-100 text-blue-800"
        case "shipped":
            return "bg-purple-100 text-purple-800"
        case "delivered":
            return "bg-green-100 text-green-800"
        default:
            return ""
    }
}

/* ---------------- PAGE ---------------- */

export default function ProfilePage() {
    const router = useRouter()

    const [user, setUser] = useState<UserType | null>(null)
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    /* ---------------- FETCH DATA ---------------- */

    useEffect(() => {
        const fetchData = async () => {
            try {
                /* USER */
                const userRes = await axios.get("/api/user/userProfile")

                if (!userRes.data?.success) {
                    toast.error("Please login first")
                    router.push("/login")
                    return
                }

                setUser(userRes.data.user)

                /* ORDERS (non-blocking) */
                try {
                    const orderRes = await axios.get("/api/order/showOrder")
                    if (orderRes.data?.success) {
                        setOrders(orderRes.data.orders)
                    }
                } catch (err) {
                    console.warn("Orders not loaded")
                }

            } catch (error) {
                console.error(error)
                toast.error("Failed to load profile")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [router])

    /* ---------------- LOGOUT ---------------- */

    const handleLogout = async () => {
        try {
            const res = await axios.get("/api/user/userLogout")
            if (res.data.success) {
                toast.success("Logged out successfully")
                router.push("/login")
            }
        } catch {
            toast.error("Logout failed")
        }
    }

    /* ---------------- LOADING ---------------- */

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        )
    }

    if (!user) return null

    /* ---------------- UI ---------------- */

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-8 bg-muted/30">
                <div className="container mx-auto px-4 max-w-5xl">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold mb-8"
                    >
                        My Profile
                    </motion.h1>

                    {/* IMPORTANT FIX: items-start */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                        {/* LEFT */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* PERSONAL INFO */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Personal Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Name</p>
                                        <p className="font-semibold">
                                            {user.firstName} {user.lastName}
                                        </p>
                                    </div>
                                    <Separator />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <p className="font-semibold">{user.email}</p>
                                    </div>
                                    <Separator />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Phone</p>
                                        <p className="font-semibold">{user.phoneNumber.isdCode} {user.phoneNumber.number}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* ADDRESS */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        Delivery Address
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">{user.address.locality}</p>
                                    <p className="text-sm">
                                        {user.address.city}, {user.address.state}, {user.address.country}, {user.address.pincode}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* ORDERS */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="h-5 w-5" />
                                        Order History
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {orders.length === 0 && (
                                        <p className="text-sm text-muted-foreground">
                                            No orders found
                                        </p>
                                    )}

                                    {orders.map((order) => (
                                        <div
                                            key={order._id}
                                            className="border rounded-lg p-4 space-y-2"
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-semibold">
                                                        Order #{order.orderId}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Badge className={getStatusColor(order.status)}>
                                                    {order.status.toUpperCase()}
                                                </Badge>
                                            </div>

                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    {order.items.length} items
                                                </span>
                                                <span className="font-semibold">
                                                    ₹{order.totalAmount}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT (FIXED HEIGHT) */}
                        <Card className="sticky top-20 self-start">
                            <CardHeader>
                                <CardTitle>Account Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="/orders">
                                        <Package className="h-4 w-4 mr-2" />
                                        My Orders
                                    </Link>
                                </Button>

                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="/profile/edit">
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Profile
                                    </Link>
                                </Button>

                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="/profile/password">
                                        <KeyRound className="h-4 w-4 mr-2" />
                                        Change Password
                                    </Link>
                                </Button>

                                <Separator />

                                <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </Button>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
