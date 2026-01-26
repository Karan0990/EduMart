"use client"

import type React from "react"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingCart, TrendingUp, Menu, X, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navItems = [
    {
        name: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        name: "Orders",
        href: "/admin/orders",
        icon: ShoppingCart,
    },
    {
        name: "Products",
        href: "/admin/products",
        icon: Package,
    },
    {
        name: "Analytics",
        href: "/admin/analytics",
        icon: TrendingUp,
    },
    {
        name: "Users",
        href: "/admin/users",
        icon: Users,
    },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const isLoginPage = pathname === "/admin/login"

    if (isLoginPage) {
        return <>{children}</>
    }

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Mobile Header */}
            <div className="sticky top-0 z-50 flex items-center justify-between border-b bg-card px-4 py-3 lg:hidden">
                <h1 className="text-lg font-bold text-primary">Admin Portal</h1>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </div>

            {/* Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="border-b p-6">
                        <Link href="/admin" className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <Package className="h-5 w-5" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-foreground">StationeryHub</h1>
                                <p className="text-xs text-muted-foreground">Admin Portal</p>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 p-4">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            const Icon = item.icon

                            return (
                                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} className="relative block">
                                    <motion.div
                                        whileHover={{ x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${isActive
                                                ? "bg-primary text-primary-foreground"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span className="font-medium">{item.name}</span>
                                    </motion.div>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="border-t p-4">
                        <Link href="/" className="block">
                            <motion.div
                                whileHover={{ x: 4 }}
                                className="flex items-center gap-3 rounded-lg px-4 py-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    />
                                </svg>
                                <span className="font-medium">Back to Store</span>
                            </motion.div>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:pl-64">
                <div className="p-6">{children}</div>
            </main>
        </div>
    )
}
