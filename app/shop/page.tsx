"use client"

import { useState, useMemo, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AnimatedProductCard } from "@/components/animated-product-card"
import { SkeletonCard } from "@/components/skeleton-card"
import { Product } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"
import { motion } from "framer-motion"
import axios from "axios"
import { useSearchParams, useRouter } from "next/navigation"

export default function ShopPage() {

    const searchParams = useSearchParams()
    const router = useRouter()

    const navbarSearchQuery = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""

    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 })
    const [inputValue, setInputValue] = useState("")

    // Sync local search with URL
    useEffect(() => {
        if (navbarSearchQuery) {
            setSearchQuery(navbarSearchQuery)
            setInputValue(navbarSearchQuery)
        } else if (category) {
            setSearchQuery(category)
            setInputValue(category)
        } else {
            setSearchQuery("")
            setInputValue("")
        }
    }, [navbarSearchQuery, category])

    // Fetch products based on URL params
    useEffect(() => {
        async function getData() {
            try {
                setLoading(true)

                let response

                if (navbarSearchQuery) {
                    response = await axios.get("/api/product/searchProducts", {
                        params: { search: navbarSearchQuery }
                    })
                } else if (category) {
                    response = await axios.get("/api/product/categoryProducts", {
                        params: { category }
                    })
                } else {
                    response = await axios.get("/api/product/showAllProducts")
                }

                if (response?.data?.success) {
                    setProducts(response.data.products)
                }

            } catch (error: any) {
                console.error("Error fetching products:", error.message)
            } finally {
                setLoading(false)
            }
        }

        getData()
    }, [navbarSearchQuery, category])

    // Frontend filtering (price + fallback search)
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {

            const query = searchQuery.toLowerCase().trim()

            const matchesSearch =
                query === "" ||
                product.productName?.toLowerCase().includes(query) ||
                product.brandName?.toLowerCase().includes(query) ||
                product.category?.toLowerCase().includes(query)

            const price = Number(product.productPrice)

            const matchesPrice =
                !isNaN(price) &&
                price >= priceRange.min &&
                price <= priceRange.max

            return matchesSearch && matchesPrice
        })
    }, [products, searchQuery, priceRange])

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-8">
                <div className="container mx-auto px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold mb-8"
                    >
                        Shop All Products
                    </motion.h1>

                    <div className="flex flex-col lg:flex-row gap-8">

                        <aside className="w-full lg:w-64 space-y-6">
                            <div>
                                <Label htmlFor="search" className="mb-2 block">
                                    Search Products
                                </Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="search"
                                        type="text"
                                        placeholder="Search..."
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                const value = inputValue.trim()
                                                if (value) {
                                                    router.push(`?search=${encodeURIComponent(value)}`)
                                                } else {
                                                    router.push("/")
                                                }
                                            }
                                        }}
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="mb-3 block font-semibold">Price Range</Label>
                                <div className="space-y-3">
                                    <Input
                                        type="number"
                                        value={priceRange.min}
                                        onChange={(e) =>
                                            setPriceRange({ ...priceRange, min: Number(e.target.value) })
                                        }
                                    />
                                    <Input
                                        type="number"
                                        value={priceRange.max}
                                        onChange={(e) =>
                                            setPriceRange({ ...priceRange, max: Number(e.target.value) })
                                        }
                                    />
                                </div>
                            </div>
                        </aside>

                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-4">
                                Showing {filteredProducts.length} of {products.length} products
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {loading
                                    ? Array.from({ length: 9 }).map((_, i) => (
                                        <SkeletonCard key={i} />
                                    ))
                                    : filteredProducts.map((product, index) => (
                                        <AnimatedProductCard
                                            key={product._id}
                                            product={product}
                                            index={index}
                                        />
                                    ))}
                            </div>

                            {!loading && filteredProducts.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground">
                                        No products found matching your criteria.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
