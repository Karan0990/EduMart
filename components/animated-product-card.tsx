"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import type { Product } from "@/lib/types"
import { motion } from "framer-motion"
import axios from "axios"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"


interface AnimatedProductCardProps {
    product: Product
    index?: number
}

export function AnimatedProductCard({ product, index = 0 }: AnimatedProductCardProps) {
    const router = useRouter();

    const [isLoggedIn, setLoggedIn] = useState(false)
    const [addedToCart, setAddedToCart] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function checkLoginUserAndCart() {
            try {
                const response = await axios.get("/api/user/userProfile")
                setLoggedIn(Boolean(response.data.isLoggedIn))

                const cartRes = await axios.get("/api/cart/showCart")

                const existsInCart = cartRes.data.cart?.items?.some(
                    (item: any) => item.productId._id === product._id
                )

                setAddedToCart(Boolean(existsInCart))

            } catch (error) {
                setLoggedIn(false)
            }
        }
        checkLoginUserAndCart()
    }, [])

    const makeLogin = () => {
        router.push("/login")
    }

    const addItemToCart = async () => {
        try {
            setLoading(true)

            const response = await axios.post("/api/cart/addItemToCart", {
                productId: product._id
            })

            if (response.data.success === true) {
                setAddedToCart(true)
                toast.success("Product added to cart")
            }
        } catch (error) {
            toast.error("Unable to add Product to Cart")
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
        >
            <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/product/${product._id}`}>
                    <div className="aspect-square relative overflow-hidden bg-muted">
                        <Image
                            src={product.coverImage || "/placeholder.svg"}
                            alt={product.productName}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.stock < 20 && (
                            <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
                                Low Stock
                            </Badge>
                        )}
                    </div>
                </Link>

                <CardContent className="p-4">
                    <Link href={`/product/${product._id}`}>
                        <h3 className="font-semibold text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                            {product.productName}
                        </h3>
                    </Link>
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">
                            ₹{product.productPrice}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {product.stock > 0
                                ? `${product.stock} in stock`
                                : "Out of stock"}
                        </span>
                    </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                    <motion.div whileTap={{ scale: 0.95 }} className="w-full">
                        {isLoggedIn ? (
                            addedToCart ? (
                                <Button
                                    className="w-full"
                                    variant="secondary"
                                    onClick={() => router.push("/cart")}
                                >
                                    Visit Cart
                                </Button>
                            ) : (
                                <Button
                                    className="w-full"
                                    disabled={product.stock === 0 || loading}
                                    onClick={addItemToCart}
                                >
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    {loading ? "Adding..." : "Add to Cart"}
                                </Button>
                            )
                        ) : (
                            <Button className="w-full" onClick={makeLogin}>
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Add to Cart
                            </Button>
                        )}
                    </motion.div>
                </CardFooter>
            </Card>
        </motion.div>
    )
}
