import Order from "@/models/order/ordrModel";
import { getCookieData } from "@/helper/getTokenData";
import { NextRequest, NextResponse } from "next/server";
import "@/models/user/userModel"
import "@/models/product/productModel"

export async function POST(request: NextRequest) {

    try {

        const body = await request.json()
        const { id } = body

        const userId = await getCookieData(request)

        if (!userId) {
            return NextResponse.json({ message: "Make Login First" })
        }

        const order = await Order.findOne({ _id: id }).populate("userId").populate("items.productId")

        if (!order) {
            return NextResponse.json({ message: "No Order Found" })
        }

        return NextResponse.json({
            order, success: true
        })


    } catch (error: any) {
        console.log("Unable to find Order", error)
        return NextResponse.json({
            message: "Unable to get order", error
        })
    }
}

