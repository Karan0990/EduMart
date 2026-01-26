"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState, Suspense, useEffect } from "react"
import { Search, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"

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
        case "cancelled":
            return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
}

type OrderItem = {
    productId: string
    quantity: number
    price: number
}

type Order = {
    _id: string
    orderId: string
    userId: string
    items: OrderItem[]
    totalAmount: number
    shippingAddress: {
        city: string
        locality: string
        state: string
        country: string
        pincode: string
    }
    paymentMethod: string
    status: "pending" | "processed" | "shipped" | "delivered" | "cancelled"
    createdAt: string
}

function OrdersContent() {
    const [orders, setOrders] = useState<Order[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    useEffect(() => {
        async function getData() {
            const response = await axios.get("/api/admin/order/showAllOrders")
            if (response?.data?.success) {
                setOrders(response.data.orders)
            }
        }
        getData()
    }, [])

    const query = searchQuery.toLowerCase()

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.orderId.toLowerCase().includes(query) ||
            order.shippingAddress.city.toLowerCase().includes(query) ||
            order.shippingAddress.state.toLowerCase().includes(query) ||
            order.shippingAddress.country.toLowerCase().includes(query) ||
            order.shippingAddress.pincode.toLowerCase().includes(query)

        const matchesStatus =
            statusFilter === "all" || order.status === statusFilter

        return matchesSearch && matchesStatus
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Orders</h1>
                <p className="text-muted-foreground">Manage all customer orders</p>
            </div>

            <Card className="p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative flex-1 md:max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by order ID or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Orders</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processed">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Card>

            <Card className="p-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b text-left">
                                <th className="pb-3 text-sm font-semibold text-muted-foreground">Order ID</th>
                                <th className="pb-3 text-sm font-semibold text-muted-foreground">Location</th>
                                <th className="pb-3 text-sm font-semibold text-muted-foreground">Date</th>
                                <th className="pb-3 text-sm font-semibold text-muted-foreground">Items</th>
                                <th className="pb-3 text-sm font-semibold text-muted-foreground">Total</th>
                                <th className="pb-3 text-sm font-semibold text-muted-foreground">Status</th>
                                <th className="pb-3 text-sm font-semibold text-muted-foreground">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredOrders.map((order) => (
                                <motion.tr
                                    key={order._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                                    className="border-b transition-colors"
                                >
                                    <td className="py-4 text-sm font-medium">{order.orderId}</td>

                                    <td className="py-4 text-sm">
                                        {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.country}, {order.shippingAddress.pincode}
                                    </td>

                                    <td className="py-4 text-sm text-muted-foreground">
                                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                                    </td>

                                    <td className="py-4 text-sm text-muted-foreground">
                                        {order.items.length} items
                                    </td>

                                    <td className="py-4 text-sm font-medium">
                                        ₹{order.totalAmount.toLocaleString()}
                                    </td>

                                    <td className="py-4">
                                        <Badge className={getStatusColor(order.status)}>
                                            {order.status}
                                        </Badge>
                                    </td>

                                    <td className="py-4">
                                        <Link href={`/admin/orders/${order._id}`}>
                                            <Button variant="outline" size="sm">
                                                Manage
                                            </Button>
                                        </Link>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredOrders.length === 0 && (
                        <div className="py-12 text-center text-muted-foreground">
                            No orders found
                        </div>
                    )}
                </div>
            </Card>
        </div>
    )
}

export default function AdminOrdersPage() {
    return (
        <Suspense fallback={null}>
            <OrdersContent />
        </Suspense>
    )
}
