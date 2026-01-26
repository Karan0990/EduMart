"use client"

import type React from "react"

import Link from "next/link"
import { ShoppingCart, Menu, X, User, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image";
import axios from "axios"

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [searchFocused, setSearchFocused] = useState(false)
    const [isloggedIn, setIsloggedIn] = useState(false)
    const [cartitemscount, setCartitemscount] = useState(0)
    const router = useRouter()

    useEffect(() => {

        async function getData() {
            try {

                const UserResponse = await axios.get("/api/user/userProfile");
                if (UserResponse?.data?.success) {
                    setIsloggedIn(true)

                    try {

                        const cartResponse = await axios.get("/api/cart/showCart");
                        if (cartResponse?.data?.success) {
                            setCartitemscount(cartResponse.data.cart.items.length)
                        }

                    } catch (error: any) {
                        console.log("Error fetching cart data:", error.message);
                    }

                } else {
                    setIsloggedIn(false)
                }

            } catch (error: any) {
                console.log("Error fetching user data:", error.message);
            }

        }

        getData()

    }, [])

    console.log("Cart Items Count in Navbar:", cartitemscount);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/shop?search=${encodeURIComponent(searchQuery)}`)
            setSearchQuery("")
        }
    }

    return (
        <nav className="sticky top-0 z-50 bg-background border-b border-border">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 gap-4">
                    {/* Logo */}
                    <Link href="/" className="text-xl font-semibold text-foreground whitespace-nowrap">
                        <Image
                            src="/logo.png"
                            alt="EduMart Logo"
                            width={120}
                            height={100}
                            priority
                            className="object-contain"
                        />
                    </Link>

                    <motion.form
                        onSubmit={handleSearch}
                        className="hidden md:flex items-center flex-1 max-w-md mx-4"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                className={`w-full px-4 py-2 pl-10 rounded-lg border transition-all duration-200 ${searchFocused ? "border-primary ring-2 ring-primary/20" : "border-border"
                                    } bg-background text-foreground placeholder:text-muted-foreground focus:outline-none`}
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                    </motion.form>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                            Home
                        </Link>
                        <Link href="/shop" className="text-sm font-medium hover:text-primary transition-colors">
                            Shop
                        </Link>
                    </div>

                    {/* Icons */}
                    {isloggedIn ? (

                        <div className="flex items-center gap-2">
                            <Link href="/profile">
                                <Button variant="ghost" size="icon">
                                    <User className="h-5 w-5" />
                                </Button>
                            </Link>

                            <Link href="/cart">
                                <Button variant="ghost" size="icon" className="relative">
                                    <ShoppingCart className="h-5 w-5" />

                                    {cartitemscount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {cartitemscount}
                                        </span>
                                    )}
                                </Button>
                            </Link>
                        </div>
                    ) : (

                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="outline">Login</Button>
                            </Link>

                            <Link href="/signup">
                                <Button>Sign Up</Button>
                            </Link>
                        </div>
                    )}




                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="md:hidden pb-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <form onSubmit={handleSearch} className="mb-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2 pl-10 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                        </form>

                        <div className="flex flex-col gap-4">
                            <Link
                                href="/"
                                className="text-sm font-medium hover:text-primary transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href="/shop"
                                className="text-sm font-medium hover:text-primary transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Shop
                            </Link>
                            <Link
                                href="/categories"
                                className="text-sm font-medium hover:text-primary transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Categories
                            </Link>
                            <Link
                                href="/cart"
                                className="text-sm font-medium hover:text-primary transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Cart
                            </Link>
                            <Link
                                href="/profile"
                                className="text-sm font-medium hover:text-primary transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Profile
                            </Link>
                            <Link
                                href="/login"
                                className="text-sm font-medium hover:text-primary transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Login
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}