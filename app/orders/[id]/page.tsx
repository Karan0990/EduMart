"use client"

import { use, useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Truck, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import axios from "axios"
import { toast } from "react-hot-toast"

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
    shippingAddress: {
        locality: string
        city: string
        state: string
        country: string
        pincode: string
    }
    paymentMethod: "cod" | "online"
    status: "pending" | "processed" | "shipped" | "delivered" | "cancelled"
    transactionId?: string
    invoiceUrl?: string
    trackingId?: string
    deliveryContact?: string
    createdAt: string
    expectedDeliveryDate?: string   // ✅ ADDED
}

export default function OrderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = use(params)
    const stepOrder = ["pending", "processed", "shipped", "delivered", "cancelled"]
    const [order, setOrder] = useState<Order>()

    useEffect(() => {
        async function getData() {
            const res = await axios.post("/api/order/orderDetails", { id })
            if (res?.data?.success) {
                setOrder(res.data.order)
            }
        }
        getData()
    }, [id])

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin h-10 w-10 border-b-2 border-primary rounded-full" />
            </div>
        )
    }

    const statusStep = {
        pending: 25,
        processed: 50,
        shipped: 75,
        delivered: 100,
        cancelled: 0,
    }[order.status]

    const statusColor = {
        pending: "bg-gray-100 text-gray-800",
        processed: "bg-yellow-100 text-yellow-800",
        shipped: "bg-blue-100 text-blue-800",
        delivered: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
    }[order.status]



    async function handleDownloadInvoice() {
        if (!order?.invoiceUrl) {
            toast.error("Invoice not available yet");
            return;
        }

        window.open(order.invoiceUrl, "_blank");
    }


    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-8 bg-muted/30">
                <div className="container mx-auto max-w-5xl px-4">
                    {/* Back */}
                    <Button variant="ghost" asChild className="mb-6">
                        <Link href="/orders">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Orders
                        </Link>
                    </Button>

                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Order #{order.orderId}
                            </h1>
                            <p className="text-muted-foreground">
                                Placed on{" "}
                                {new Date(order.createdAt).toLocaleDateString()}
                            </p>

                            {order.expectedDeliveryDate && (
                                <p className="text-sm mt-1">
                                    Expected Delivery:{" "}
                                    <span className="font-medium">
                                        {new Date(
                                            order.expectedDeliveryDate
                                        ).toLocaleDateString()}
                                    </span>
                                </p>
                            )}
                        </div>

                        <Badge className={statusColor}>
                            {order.status.toUpperCase()}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* LEFT */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Tracking */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex gap-2 items-center">
                                        <Truck className="h-5 w-5" />
                                        Order Tracking
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
                                        <motion.div
                                            className="h-full bg-primary"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${statusStep}%` }}
                                        />
                                    </div>

                                    {stepOrder.map((step, index) => {
                                        const active =
                                            stepOrder.indexOf(order.status) >=
                                            index
                                        return (
                                            <div
                                                key={step}
                                                className="flex gap-2 items-center mb-2"
                                            >
                                                <CheckCircle2
                                                    className={
                                                        active
                                                            ? "text-primary-600"
                                                            : "text-muted-foreground"
                                                    }
                                                />
                                                <span className="capitalize">
                                                    {step}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </CardContent>
                            </Card>

                            {/* Items */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Items</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {order.items.map((item) => (
                                        <div
                                            key={item.productId._id}
                                            className="flex gap-4 border-b pb-4"
                                        >
                                            <div className="relative h-20 w-20">
                                                <Image
                                                    src={
                                                        item.productId
                                                            .coverImage ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={
                                                        item.productId
                                                            .productName
                                                    }
                                                    fill
                                                    className="object-cover rounded"
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <h4 className="font-semibold">
                                                    {
                                                        item.productId
                                                            .productName
                                                    }
                                                </h4>
                                                <p className="text-sm">
                                                    Qty: {item.quantity}
                                                </p>
                                                <p className="text-sm">
                                                    ₹{item.price}
                                                </p>
                                            </div>

                                            <p className="font-bold">
                                                ₹
                                                {item.price *
                                                    item.quantity}
                                            </p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT */}
                        <div className="space-y-6">
                            {/* Summary */}
                            <Card className="rounded-2xl shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg font-semibold">
                                        Order Summary
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* Total Amount */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Total Amount
                                        </span>
                                        <span className="text-xl font-bold text-primary">
                                            ₹{order.totalAmount}
                                        </span>
                                    </div>

                                    <div className="h-px bg-border" />

                                    {/* Payment Method */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Payment Method
                                        </span>
                                        <span className="text-sm font-medium uppercase">
                                            {order.paymentMethod}
                                        </span>
                                    </div>

                                    {/* Expected Delivery */}
                                    {order.expectedDeliveryDate && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                Expected Delivery
                                            </span>
                                            <span className="text-sm font-medium">
                                                {new Date(order.expectedDeliveryDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}

                                    <div className="h-px bg-border" />

                                    {/* Tracking Info */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                Tracking ID
                                            </span>
                                            <span className="text-sm font-semibold">
                                                {order.trackingId || "Not Assigned"}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                Delivery Partner
                                            </span>
                                            <span className="text-sm font-medium">
                                                {order.deliveryContact || "To be assigned"}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>


                            {/* Address */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex gap-2 items-center">
                                        <MapPin className="h-5 w-5" />
                                        Shipping Address
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm">
                                    <p>{order.shippingAddress.locality}</p>
                                    <p>
                                        {order.shippingAddress.city},{" "}
                                        {order.shippingAddress.state},{" "} {order.shippingAddress.country},{" "}{order.shippingAddress.pincode}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Invoice Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={handleDownloadInvoice}
                                    >
                                        Download Invoice
                                    </Button>

                                </CardContent>
                            </Card>


                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
