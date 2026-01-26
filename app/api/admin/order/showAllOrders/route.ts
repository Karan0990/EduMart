import Order from "@/models/order/ordrModel"
import { getCookieData } from "@/helper/getTokenData"
import { NextRequest, NextResponse } from "next/server"
import User from "@/models/user/userModel"
import "@/models/product/productModel"

export async function GET(request: NextRequest) {
    try {
        const userId = await getCookieData(request)

        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        const user = await User.findById(userId)

        if (!user) {
            return NextResponse.json(
                { message: "Invalid user" },
                { status: 401 }
            )
        }

        if (user.role !== "admin") {
            return NextResponse.json(
                { message: "Only admin can access this route" },
                { status: 403 }
            )
        }

        const orders = await Order.find({})
            .populate("userId")
            .populate("items.productId")

        if (orders.length === 0) {
            return NextResponse.json(
                { message: "No orders available", orders: [] },
                { status: 200 }
            )
        }

        return NextResponse.json({
            success: true,
            orders
        })

    } catch (error: any) {
        console.error("Unable to get orders by admin", error)
        return NextResponse.json(
            { message: "Server error", error },
            { status: 500 }
        )
    }
}
