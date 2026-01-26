import { NextResponse } from "next/server"
import Order from "@/models/order/ordrModel"

export async function GET() {
    try {
        const topProducts = await Order.aggregate([

            {
                $match: {
                    status: { $ne: "cancelled" }
                }
            },


            {
                $unwind: "$items"
            },


            {
                $group: {
                    _id: "$items.productId",


                    sales: { $sum: "$items.quantity" },


                    revenue: {
                        $sum: {
                            $multiply: ["$items.price", "$items.quantity"]
                        }
                    }
                }
            },


            {
                $sort: { sales: -1 }
            },


            {
                $limit: 5
            },


            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product"
                }
            },


            {
                $unwind: "$product"
            }
        ])


        const formatted = topProducts.map((item) => ({
            name: item.product.productName,
            sales: item.sales,
            revenue: item.revenue
        }))

        return NextResponse.json({
            success: true,
            data: formatted
        })

    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to fetch top products" },
            { status: 500 }
        )
    }
}
