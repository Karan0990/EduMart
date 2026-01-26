import { NextResponse } from "next/server"
import Order from "@/models/order/ordrModel"

export async function GET() {
    try {
        const revenue = await Order.aggregate([
            {
                $match: {
                    status: { $ne: "Cancelled" }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    revenue: { $sum: "$totalAmount" }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ])

        const monthMap = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ]

        const formatted = revenue.map((item) => ({
            month: monthMap[item._id - 1],
            revenue: item.revenue
        }))

        return NextResponse.json({
            success: true,
            data: formatted
        })

    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to fetch revenue" },
            { status: 500 }
        )
    }
}
