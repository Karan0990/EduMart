"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { CartItem } from "@/lib/types"
import { motion } from "framer-motion"
import axios from "axios"
import { toast } from "react-hot-toast"

export default function CartPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [cartItems, setCartItems] = useState<CartItem[]>([])

    useEffect(() => {
        async function getData() {
            try {
                const response = await axios.get("/api/cart/showCart", {
                    withCredentials: true
                })
                if (response.data.success) {
                    setCartItems(response.data.cart.items)
                }
            } catch (error) {
                console.log("Unable to get cart", error)
            } finally {
                setLoading(false)
            }
        }
        getData()
    }, [])

    const updateQuantityInBackend = async (
        productId: string,
        quantity: number
    ) => {
        await axios.put("/api/cart/updateQuantity", {
            productId,
            quantity,
        })
    }

    const updateQuantity = async (
        productId: string,
        newQuantity: number
    ) => {
        const item = cartItems.find(
            item => item.productId._id === productId
        )

        if (!item) return

        const safeQuantity = Math.max(
            1,
            Math.min(item.productId.stock, newQuantity)
        )
        setCartItems(items =>
            items.map(item =>
                item.productId._id === productId
                    ? { ...item, quantity: safeQuantity }
                    : item
            )
        )

        try {
            await updateQuantityInBackend(productId, safeQuantity)
            console.log("Quantity updated")
        } catch (error) {
            toast.error("Failed to update quantity")
            console.error(error)
        }
    }

    const removeItem = async (productId: string) => {
        try {
            await axios.post("/api/cart/deleteItemFromCart", {
                productId
            })
            toast.success("Item removed from cart")

            setCartItems(items =>
                items.filter(item => item.productId._id !== productId)
            )
        } catch (error) {
            console.log("Unable to remove item", error)
            toast.error("Unable to remove item")
        }
    }

    const subtotal = cartItems.reduce(
        (sum, item) =>
            sum + item.productId.productPrice * item.quantity,
        0
    )

    const shipping = subtotal > 500 ? 0 : 50
    const total = subtotal + shipping

    if (!loading && cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 container mx-auto px-4 py-16 text-center">
                    <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
                    <h1 className="text-2xl font-bold mb-2">
                        Your Cart is Empty
                    </h1>
                    <Link href="/shop">
                        <Button size="lg">Start Shopping</Button>
                    </Link>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 py-8">
                <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map(item => (
                            <motion.div key={item.productId._id}>
                                <Card>
                                    <CardContent className="p-4 flex gap-4">
                                        <div className="relative h-24 w-24">
                                            <Image
                                                src={item.productId.coverImage}
                                                alt={item.productId.productName}
                                                fill
                                                className="object-cover rounded"
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <Link href={`/product/${item.productId._id}`}>
                                                <h3 className="font-semibold">
                                                    {item.productId.productName}
                                                </h3>
                                            </Link>
                                            <p className="text-sm text-muted-foreground">
                                                ₹{item.productId.productPrice}
                                            </p>

                                            <div className="flex items-center gap-2 mt-2">
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.productId._id,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                >
                                                    <Minus size={14} />
                                                </Button>

                                                <span>{item.quantity}</span>

                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.productId._id,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                >
                                                    <Plus size={14} />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end justify-between">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    removeItem(item.productId._id)
                                                }
                                            >
                                                <Trash2 />
                                            </Button>
                                            <span className="font-bold">
                                                ₹{item.productId.productPrice * item.quantity}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <Card className="h-fit sticky top-20">
                        <CardContent className="p-6 space-y-4">
                            <h2 className="text-xl font-bold">
                                Order Summary
                            </h2>
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{subtotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>
                                    {shipping === 0 ? "Free" : `₹${shipping}`}
                                </span>
                            </div>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>
                            <Button onClick={() => router.push("/checkout")}>
                                Proceed to Checkout
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    )
}
