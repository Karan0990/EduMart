"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import axios from "axios"
import { Card } from "@/components/ui/card"
// import { orders, products } from "@/lib/mock-data"
import { TrendingUp, ShoppingBag, DollarSign, Package } from "lucide-react"
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts"

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
    }
    paymentMethod: string
    status: "pending" | "processed" | "shipped" | "delivered" | "cancelled"
    createdAt: string
}

export default function AdminAnalyticsPage() {

    const [orders, setOrders] = useState<Order[]>([])
    const [monthlyRevenue, setMonthlyRevenue] = useState<{ month: string; revenue: number }[]>([])
    const [categoryRevenue, setCategoryRevenue] = useState<{ category: string; value: number; revenue: number }[]>([])
    const [topProducts, setTopProducts] = useState<{ name: string; sales: number }[]>([])

    useEffect(() => {
        async function getData() {
            const response = await axios.get("/api/admin/order/showAllOrders")
            const revenueResponse = await axios.get("/api/admin/revenue/monthRevenue")
            const categoryResponse = await axios.get("/api/admin/revenue/categoryRevenue")
            const topProductsResponse = await axios.get("/api/admin/revenue/topProduct")
            if (revenueResponse?.data?.success) {
                setMonthlyRevenue(revenueResponse.data.data)
            }
            if (categoryResponse?.data?.success) {
                setCategoryRevenue(categoryResponse.data.data)
            }
            if (response?.data?.success) {
                setOrders(response.data.orders)
            }
            if (topProductsResponse?.data?.success) {
                setTopProducts(topProductsResponse.data.data)
            }
        }
        getData()
    }, [])
    const totalRevenue = orders.filter((o) => o.status !== "cancelled").reduce((sum, order) => sum + order.totalAmount, 0)

    // const monthlyRevenue = [
    //     { month: "Jan", revenue: 45000 },
    //     { month: "Feb", revenue: 52000 },
    //     { month: "Mar", revenue: 48000 },
    //     { month: "Apr", revenue: 61000 },
    //     { month: "May", revenue: 55000 },
    //     { month: "Jun", revenue: 67000 },
    // ]

    // const categoryRevenue = [
    //     { name: "Pens", value: 35, revenue: 45000 },
    //     { name: "Notebooks", value: 30, revenue: 38000 },
    //     { name: "Files", value: 20, revenue: 25000 },
    //     { name: "Art Supplies", value: 15, revenue: 19000 },
    // ]

    // const topProducts = products.slice(0, 5).map((p: { productName: any }) => ({
    //     name: p.productName,
    //     sales: Math.floor(Math.random() * 100) + 20,
    // }))


    const validOrders = orders.filter(o => o.status !== "cancelled")
    const totalOrders = validOrders.length


    const latestMonthRevenue =
        monthlyRevenue.length > 0
            ? monthlyRevenue[monthlyRevenue.length - 1].revenue
            : 0


    const totalProductsSold = topProducts.reduce(
        (sum, p) => sum + p.sales,
        0
    )


    const avgOrderValue =
        totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0


    const COLORS = [
        "oklch(0.55 0.08 180)",
        "oklch(0.35 0.08 240)",
        "oklch(0.646 0.222 41.116)",
        "oklch(0.769 0.188 70.08)",
    ]

    const stats = [
        {
            name: "Total Revenue",
            value: `₹${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: "text-green-600",
            bgColor: "bg-green-100 dark:bg-green-900/20",
        },
        {
            name: "Monthly Sales",
            value: `₹${latestMonthRevenue.toLocaleString()}`,
            icon: TrendingUp,
            color: "text-blue-600",
            bgColor: "bg-blue-100 dark:bg-blue-900/20",
        },
        {
            name: "Products Sold",
            value: totalProductsSold.toLocaleString(),
            icon: ShoppingBag,
            color: "text-purple-600",
            bgColor: "bg-purple-100 dark:bg-purple-900/20",
        },
        {
            name: "Avg. Order Value",
            value: `₹${avgOrderValue.toLocaleString()}`,
            icon: Package,
            color: "text-orange-600",
            bgColor: "bg-orange-100 dark:bg-orange-900/20",
        },
    ]


    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
                <p className="text-muted-foreground">Track your business performance</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <motion.div key={stat.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Card className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                                        <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
                                        {/* <p className="mt-1 text-sm text-green-600">{stat.change} from last month</p> */}
                                    </div>
                                    <div className={`rounded-full p-3 ${stat.bgColor}`}>
                                        <Icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )
                })}
            </div>

            {/* Charts Row 1 */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Monthly Revenue */}
                <Card className="p-6">
                    <h2 className="mb-6 text-xl font-bold text-foreground">Monthly Revenue</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyRevenue}>
                            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 240)" />
                            <XAxis dataKey="month" stroke="oklch(0.5 0.02 240)" />
                            <YAxis stroke="oklch(0.5 0.02 240)" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "oklch(1 0 0)",
                                    border: "1px solid oklch(0.92 0.01 240)",
                                    borderRadius: "8px",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="oklch(0.35 0.08 240)"
                                strokeWidth={2}
                                dot={{ fill: "oklch(0.35 0.08 240)", r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>

                {/* Category Distribution */}
                <Card className="p-6">
                    <h2 className="mb-6 text-xl font-bold text-foreground">Revenue by Category</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryRevenue}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="revenue"
                                nameKey="category"
                            >
                                {categoryRevenue.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "oklch(1 0 0)",
                                    border: "1px solid oklch(0.92 0.01 240)",
                                    borderRadius: "8px",
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Top Products */}
                <Card className="p-6">
                    <h2 className="mb-6 text-xl font-bold text-foreground">Top Selling Products</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={topProducts}>
                            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 240)" />
                            <XAxis dataKey="name" stroke="oklch(0.5 0.02 240)" angle={-45} textAnchor="end" height={100} />
                            <YAxis stroke="oklch(0.5 0.02 240)" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "oklch(1 0 0)",
                                    border: "1px solid oklch(0.92 0.01 240)",
                                    borderRadius: "8px",
                                }}
                            />
                            <Bar dataKey="sales" fill="oklch(0.55 0.08 180)" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                {/* Revenue Summary */}
                <Card className="p-6">
                    <h2 className="mb-6 text-xl font-bold text-foreground">Revenue Summary</h2>
                    <div className="space-y-4">
                        {categoryRevenue.map((category, index) => (
                            <div key={category.category} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-4 w-4 rounded" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                        <span className="font-medium text-foreground">{category.category}</span>
                                    </div>
                                    <span className="font-semibold text-foreground">₹{category.revenue.toLocaleString()}</span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full transition-all"
                                        style={{
                                            width: `${category.value}%`,
                                            backgroundColor: COLORS[index % COLORS.length],
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}
