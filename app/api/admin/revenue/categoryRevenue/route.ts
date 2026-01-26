import { NextResponse } from "next/server"
import Order from "@/models/order/ordrModel"

export async function GET() {
    try {
        const data = await Order.aggregate([

            {
                $match: {
                    status: { $ne: "cancelled" }
                }
            },

            {
                $unwind: "$items"
            },

            {
                $lookup: {
                    from: "products",
                    localField: "items.productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $unwind: "$product"
            },


            {
                $group: {
                    _id: "$product.category",

                    revenue: {
                        $sum: {
                            $multiply: ["$items.price", "$items.quantity"]
                        }
                    },

                    orders: { $sum: 1 }
                }
            },

            {
                $sort: { revenue: -1 }
            }
        ])

        const formatted = data.map((item) => ({
            category: item._id,
            revenue: item.revenue,
            orders: item.orders
        }))

        return NextResponse.json({
            success: true,
            data: formatted
        })

    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to fetch category analytics" },
            { status: 500 }
        )
    }
}
