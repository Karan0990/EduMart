"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { motion } from "framer-motion"
import { MapPin, Package, CreditCard } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

type OrderItem = {
    id: string
    productName: string
    brandName: string
    image: string
    price: number
    quantity: number
}

type UserAddress = {
    firstName: string
    lastName: string
    phoneNumber: {
        isdCode: string,
        number: string
    }
    address: {
        city: string
        locality: string
        state: string
        pincode: string,
        country: string
    }
}

export default function CheckoutPage() {
    const router = useRouter()
    const [orderItems, setOrderItems] = useState<OrderItem[]>([])
    const [userAddress, setUserAddress] = useState<UserAddress | null>(null)
    const [paymentMethod, setPaymentMethod] = useState<string>("")

    useEffect(() => {
        async function getData() {
            try {

                const userResponse = await axios.get("/api/user/userProfile")
                if (userResponse?.data?.success) {
                    setUserAddress(userResponse.data.user)
                }


                const cartResponse = await axios.get("/api/cart/showCart")
                if (cartResponse?.data?.success) {
                    setOrderItems(
                        cartResponse.data.cart.items.map((item: any) => ({
                            id: item.productId._id,
                            productName: item.productId.productName,
                            brandName: item.productId.brandName,
                            image:
                                item.productId.coverImage ||
                                item.productId.otherImages?.[0],
                            price: Number(item.productId.productPrice),
                            quantity: item.quantity,
                        }))
                    )
                }

            } catch (error: any) {
                console.log("Error loading checkout data:", error.message)
            }
        }

        getData()
    }, [])

    const subtotal = orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    )

    const shipping = subtotal > 500 ? 0 : 50
    const tax = Math.round(subtotal * 0.05)
    const total = subtotal + shipping + tax

    const placeCashOrder = async () => {
        try {
            if (!paymentMethod) {
                toast.error("Please select a payment method")
                return
            }

            const response = await axios.post("/api/order/placeOrder", {
                items: orderItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
                paymentMethod,
            })

            if (!response.data.success) {
                toast.error(response.data.message || "Order failed")
                return
            }

            try {
                await axios.get("/api/cart/removeItemsAfterOrder")
            } catch (error: any) {
                console.error(
                    "Remove cart error:",
                    error?.response?.status,
                    error?.response?.data
                )

                toast.error(
                    error?.response?.data?.message || "Failed to clear cart"
                )

                return // IMPORTANT: stop execution
            }

            toast.success("Order placed successfully 🎉")
            router.push("/orders")

        } catch (error: any) {
            console.error("Cash order error:", error)
            toast.error(error?.response?.data?.message || "Unable to place order")
        }
    }

    console.log(total)
    const placeOnlineOrder = async () => {
        try {
            // 1️⃣ Create Razorpay order (backend)
            const response = await axios.post(
                "/api/order/createOrder",
                { amount: total }
            );

            // 2️⃣ Razorpay options
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
                amount: response.data.order.amount,
                currency: "INR",
                name: "EduMart",
                image: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1769276733/logo_nbhjq5.png`,
                description: "Order Payment",
                order_id: response.data.order.id,

                handler: async function (response: any) {
                    try {
                        const verifyRes = await axios.post("/api/order/verifyOrder", response)

                        if (!verifyRes.data.success) {
                            toast.error("Payment verification failed")
                            return
                        }

                        const placeOrderRes = await axios.post("/api/order/placeOrder", {
                            items: orderItems.map(item => ({
                                productId: item.id,
                                quantity: item.quantity,
                            })),
                            paymentMethod: "online",
                            transactionId: verifyRes.data.paymentId,
                        })

                        if (!placeOrderRes.data.success) {
                            toast.error("Order placement failed")
                            return
                        }

                        await axios.get("/api/cart/removeItemsAfterOrder")
                        toast.success("Order placed successfully 🎉")
                        router.push("/orders")

                    } catch (err) {
                        console.error("Online order error:", err)
                        toast.error("Order placement failed")
                    }
                },


                prefill: {
                    name: `${userAddress?.firstName} ${userAddress?.lastName}`,
                    contact: `${userAddress?.phoneNumber?.isdCode} ${userAddress?.phoneNumber?.number}`,
                },

                theme: {
                    color: "#3399cc",
                },
            };

            // 3️⃣ Open Razorpay popup
            const rzp = new (window as any).Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Razorpay error", error);
            alert("Unable to initiate payment");
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-8 bg-muted/30">
                <div className="container mx-auto px-4 max-w-6xl">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold mb-8"
                    >
                        Checkout
                    </motion.h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LEFT */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Delivery Address */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        Delivery Address
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {userAddress ? (
                                        <>
                                            <p className="font-semibold">
                                                {userAddress.firstName} {userAddress.lastName}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {userAddress.phoneNumber.isdCode} {userAddress.phoneNumber.number}
                                            </p>
                                            <p className="text-sm">
                                                {userAddress.address.locality}
                                            </p>
                                            <p className="text-sm">
                                                {userAddress.address.city}, {userAddress.address.state}, {userAddress.address.country}, {userAddress.address.pincode}
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            Loading address...
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Order Items */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="h-5 w-5" />
                                        Order Items ({orderItems.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {orderItems.map((item) => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted">
                                                <Image
                                                    src={item.image || "/placeholder.svg"}
                                                    alt={item.productName}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold">
                                                    {item.productName}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Brand: {item.brandName}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Quantity: {item.quantity}
                                                </p>
                                                <p className="font-semibold">
                                                    ₹{item.price * item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Payment */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5" />
                                        Payment Method
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* COD */}
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            className="h-4 w-4"
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <div>
                                            <p className="font-medium">Cash on Delivery (COD)</p>
                                            <p className="text-sm text-muted-foreground">
                                                Pay when the product is delivered
                                            </p>
                                        </div>
                                    </label>

                                    {/* Online */}
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="online"
                                            className="h-4 w-4"
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <div>
                                            <p className="font-medium">Online Payment</p>
                                            <p className="text-sm text-muted-foreground">
                                                UPI, Debit Card, Credit Card, Net Banking
                                            </p>
                                        </div>
                                    </label>
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT */}
                        <Card className="sticky top-20">
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Tax (5%)</span>
                                    <span>₹{tax}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>₹{total}</span>
                                </div>

                                {
                                    paymentMethod == "" &&
                                    (<Button size="lg" className="w-full bg-gray-500 cursor-not-allowed" disabled>
                                        Place Order
                                    </Button>)
                                }
                                {
                                    paymentMethod == "cod" && (<Button size="lg" className="w-full" onClick={placeCashOrder}>
                                        Place Order
                                    </Button>)
                                }

                                {
                                    paymentMethod == "online" && (<Button size="lg" className="w-full" onClick={placeOnlineOrder}>
                                        Place Order
                                    </Button>)
                                }
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
