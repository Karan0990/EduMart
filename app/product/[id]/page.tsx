"use client"

import { use, useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { ShoppingCart, Plus, Minus, Check, X } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import axios from "axios"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { RatingDisplay, StarRating } from "@/components/star-rating"
import { ReviewList } from "@/components/review-list"
import { ReviewForm } from "@/components/review-form"


export default function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = use(params)
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [product, setProduct] = useState<any>(null)
    const [quantity, setQuantity] = useState(1)
    const [selectedImage, setSelectedImage] = useState(0)
    const [addedToCart, setAddedToCart] = useState(false)


    useEffect(() => {
        async function getData() {
            try {
                const res = await axios.get(`/api/product/productDetails/${id}`)
                if (res.data.success) {
                    setProduct(res.data.product)
                }

                const cartRes = await axios.get("/api/cart/showCart")

                const existsInCart = cartRes.data.cart?.items?.some(
                    (item: any) => item.productId._id === id
                )

                setAddedToCart(Boolean(existsInCart))


            } catch (error) {
                console.error("Unable to find product", error)
            } finally {
                setLoading(false)
            }
        }

        getData()
    }, [id])

    const productAddToCart = async () => {

        try {
            const response = await axios.post("/api/cart/addItemToCart", {
                productId: product._id
            })

            if (response.data.success) {
                setAddedToCart(true)
                toast.success("Product added to cart")
            } else {
                toast.error("Failed to add product to cart")
            }

        } catch (error: any) {
            console.log("Error adding to cart", error)
        }

    }


    if (!loading && !product) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 container mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                    <Link href="/shop">
                        <Button>Back to Shop</Button>
                    </Link>
                </main>
                <Footer />
            </div>
        )
    }


    const images = [
        product?.coverImage,
        ...(product?.otherImages || []),
    ]

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-8">
                <div className="container mx-auto px-4">
                    {!loading && (
                        <div className="mb-6 text-sm text-muted-foreground">
                            <Link href="/" className="hover:text-primary">Home</Link> /{" "}
                            <Link href="/shop" className="hover:text-primary">Shop</Link> /{" "}
                            <span>{product.productName}</span>
                        </div>
                    )}

                    {loading ? (
                        <Skeleton className="h-[400px] w-full" />
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* ================= IMAGES ================= */}
                            <div className="space-y-4">
                                <div className="aspect-square relative rounded-lg bg-muted p-4">
                                    <Image
                                        src={images[selectedImage]}
                                        alt={product.productName}
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                {images.length > 1 && (
                                    <div
                                        className="grid gap-4"
                                        style={{
                                            gridTemplateColumns: "repeat(auto-fit, minmax(70px, 1fr))",
                                        }}
                                    >
                                        {images.map((img, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedImage(index)}
                                                className={`aspect-square relative rounded-lg border-2 p-2 ${selectedImage === index
                                                    ? "border-primary"
                                                    : "border-transparent"
                                                    }`}
                                            >
                                                <Image
                                                    src={img}
                                                    alt={`${product.productName}-${index}`}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* ================= DETAILS ================= */}
                            <div className="flex flex-col space-y-6">
                                {/* Title & Brand */}
                                <div>
                                    <h1 className="text-3xl font-bold">{product.productName}</h1>
                                    <p className="text-muted-foreground mt-1">
                                        Brand: {product.brandName}
                                    </p>
                                </div>

                                {/* Rating */}
                                {product.avgRating > 0 && product.totalRatings > 0 && (
                                    <RatingDisplay
                                        rating={product.avgRating}
                                        count={product.totalRatings}
                                    />
                                )}


                                {/* Price & Stock */}
                                <div className="flex items-center gap-4 flex-wrap">
                                    <span className="text-3xl font-bold text-primary">
                                        ₹{product.productPrice}
                                    </span>

                                    {product.stock > 0 ? (
                                        <Badge className="bg-green-100 text-green-800">
                                            <Check className="h-3 w-3 mr-1" />
                                            In Stock
                                        </Badge>
                                    ) : (
                                        <Badge variant="destructive">
                                            <X className="h-3 w-3 mr-1" />
                                            Out of Stock
                                        </Badge>
                                    )}
                                </div>

                                {/* Cart Button (FIXED OVERLAP) */}
                                <div className="pt-2">
                                    {addedToCart ? (
                                        <Button
                                            size="lg"
                                            className="w-full sm:w-auto"
                                            onClick={() => router.push("/cart")}
                                            disabled={product.stock === 0}
                                        >
                                            <ShoppingCart className="mr-2 h-5 w-5" />
                                            Visit Cart To Buy
                                        </Button>
                                    ) : (
                                        <Button
                                            size="lg"
                                            className="w-full sm:w-auto"
                                            onClick={productAddToCart}
                                            disabled={product.stock === 0}
                                        >
                                            <ShoppingCart className="mr-2 h-5 w-5" />
                                            Add to Cart
                                        </Button>
                                    )}
                                </div>

                                {/* Meta Info */}
                                <div className="pt-4 border-t text-sm space-y-1">
                                    <p>
                                        <span className="text-muted-foreground">Category:</span>{" "}
                                        {product.category}
                                    </p>
                                    <p>
                                        <span className="text-muted-foreground">SKU:</span>{" "}
                                        {product._id}
                                    </p>
                                </div>

                                {/* Description */}
                                <p className="text-muted-foreground leading-relaxed">
                                    {product.longDiscription}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* ================= REVIEWS ================= */}
            {!loading && product && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-16 pt-16 border-t border-border container mx-auto px-4"
                >
                    <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                            <ReviewForm productId={product._id} userHasReviewed={false} />
                        </div>

                        <div className="lg:col-span-2">
                            {product.totalRatings > 0 ? (
                                <>
                                    <h3 className="text-lg font-semibold mb-4">
                                        {product.totalRatings} Reviews
                                    </h3>
                                    <ReviewList productId={product._id} />
                                </>
                            ) : (
                                <div className="text-center py-8 bg-muted/30 rounded-lg">
                                    <p className="text-muted-foreground">
                                        No reviews yet. Be the first to review this product!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}

            <Footer />
        </div>
    );

}
