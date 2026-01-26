"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import axios from "axios"

export default function AdminDashboard() {
    const [orders, setOrders] = useState<any[]>([])

    useEffect(() => {
        async function getData() {
            const response = await axios.get("/api/admin/order/showAllOrders")
            if (response?.data?.success) {
                setOrders(response.data.orders)
            }
        }
        getData()
    }, [])

    // 📊 Stats
    const totalOrders = orders.length

    const totalRevenue = orders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
    )

    const pendingOrders = orders.filter(
        (o) => o.status === "pending" || o.status === "processed"
    ).length

    const stats = [
        {
            name: "Total Revenue",
            value: `₹${totalRevenue.toLocaleString()}`,
            icon: TrendingUp,
            color: "text-green-600",
            bgColor: "bg-green-100 dark:bg-green-900/20",
        },
        {
            name: "Total Orders",
            value: totalOrders,
            icon: ShoppingCart,
            color: "text-blue-600",
            bgColor: "bg-blue-100 dark:bg-blue-900/20",
        },
        {
            name: "Pending Orders",
            value: pendingOrders,
            icon: Users,
            color: "text-orange-600",
            bgColor: "bg-orange-100 dark:bg-orange-900/20",
        },
        {
            name: "Total Products",
            value: "—",
            icon: Package,
            color: "text-purple-600",
            bgColor: "bg-purple-100 dark:bg-purple-900/20",
        },
    ]

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            case "processed":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            case "shipped":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
            case "delivered":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
        }
    }


    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back! Here's your store overview.
                </p>
            </div>

            {/* Stats */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.name} className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">{stat.name}</p>
                                    <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                                </div>
                                <div className={`rounded-full p-3 ${stat.bgColor}`}>
                                    <Icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>

            {/* Recent Orders */}
            <Card className="p-6">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">Recent Orders</h2>
                        <p className="text-sm text-muted-foreground">
                            Manage and track your orders
                        </p>
                    </div>
                    <Link href="/admin/orders">
                        <Button>View All</Button>
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b text-left">
                                <th className="pb-3 text-sm">Order ID</th>
                                <th className="pb-3 text-sm">Address</th>
                                <th className="pb-3 text-sm">Date</th>
                                <th className="pb-3 text-sm">Total</th>
                                <th className="pb-3 text-sm">Status</th>
                                <th className="pb-3 text-sm">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.slice(0, 5).map((order) => (
                                <tr key={order._id} className="border-b">
                                    <td className="py-4 font-medium">{order.orderId}</td>

                                    <td className="py-4">
                                        {order.shippingAddress.locality},{" "}
                                        {order.shippingAddress.city}
                                    </td>

                                    <td className="py-4 text-muted-foreground">
                                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                                    </td>

                                    <td className="py-4 font-medium">
                                        ₹{order.totalAmount.toLocaleString()}
                                    </td>

                                    <td className="py-4">
                                        <Badge className={getStatusColor(order.status)}>
                                            {order.status}
                                        </Badge>
                                    </td>

                                    <td className="py-4">
                                        <Link href={`/admin/orders/${order._id}`}>
                                            <Button size="sm" variant="ghost">
                                                View
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
