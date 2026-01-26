"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ChevronRight, Filter } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import axios from "axios"

type OrderItem = {
    productId: {
        _id: string
        productName: string
        coverImage: string
    }
    quantity: number
    price: number
}

type Order = {
    _id: string
    orderId: string
    items: OrderItem[]
    totalAmount: number
    status: "pending" | "processed" | "shipped" | "delivered" | "cancelled"
    createdAt: string
    expectedDeliveryDate?: string
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [filter, setFilter] = useState<string>("all")

    useEffect(() => {
        async function getData() {
            const response = await axios.get("/api/order/showOrder")
            if (response?.data?.success) {
                setOrders(response.data.orders)
            }
        }
        getData()
    }, [])

    const filteredOrders = orders.filter((order) => {
        if (filter === "all") return true
        return order.status === filter
    })

    const getStatusColor = (status: Order["status"]) => {
        switch (status) {
            case "delivered":
                return "bg-green-100 text-green-800"
            case "shipped":
                return "bg-blue-100 text-blue-800"
            case "processed":
                return "bg-yellow-100 text-yellow-800"
            case "pending":
                return "bg-gray-100 text-gray-800"
            case "cancelled":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-8 bg-muted/30">
                <div className="container mx-auto px-4 max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
                        <p className="text-muted-foreground">
                            View and track your order history
                        </p>
                    </motion.div>

                    {/* FILTERS */}
                    <Card className="mb-6">
                        <CardContent className="p-4 flex flex-wrap items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            {["all", "pending", "processed", "shipped", "delivered"].map((s) => (
                                <Button
                                    key={s}
                                    size="sm"
                                    variant={filter === s ? "default" : "outline"}
                                    onClick={() => setFilter(s)}
                                >
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </Button>
                            ))}
                        </CardContent>
                    </Card>

                    {/* ORDERS */}
                    <div className="space-y-4">
                        {filteredOrders.length === 0 ? (
                            <Card>
                                <CardContent className="py-16 text-center">
                                    <Package className="h-14 w-14 mx-auto text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">No orders found</p>
                                </CardContent>
                            </Card>
                        ) : (
                            filteredOrders.map((order, index) => (
                                <motion.div
                                    key={order._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card>
                                        <CardContent className="p-6 space-y-4">
                                            {/* IMAGE + PRODUCT NAME */}
                                            <div className="flex gap-4 items-start">
                                                <div className="relative w-16 h-16 rounded-md border bg-muted overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={
                                                            order.items[0]?.productId?.coverImage ||
                                                            "/placeholder.svg"
                                                        }
                                                        alt={order.items[0]?.productId?.productName || "Product"}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>

                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg">
                                                        {order.items[0]?.productId?.productName}
                                                        {order.items.length > 1 && (
                                                            <span className="text-sm text-muted-foreground">
                                                                {" "}+{order.items.length - 1} more
                                                            </span>
                                                        )}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Order #{order.orderId} •{" "}
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>

                                                    {order.expectedDeliveryDate && (
                                                        <p className="text-sm text-muted-foreground">
                                                            Expected Delivery:{" "}
                                                            <span className="font-medium text-foreground">
                                                                {new Date(order.expectedDeliveryDate).toLocaleDateString()}
                                                            </span>
                                                        </p>
                                                    )}

                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <Badge className={getStatusColor(order.status)}>
                                                    {order.status.toUpperCase()}
                                                </Badge>

                                                <p className="text-xl font-bold">
                                                    ₹{order.totalAmount}
                                                </p>
                                            </div>

                                            <div className="flex justify-end border-t pt-4">
                                                <Button asChild variant="outline">
                                                    <Link href={`/orders/${order._id}`}>
                                                        View Details
                                                        <ChevronRight className="h-4 w-4 ml-1" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
