import { NextRequest, NextResponse } from "next/server"
import { getCookieData } from "@/helper/getTokenData"
import Cart from "@/models/cart/cartModel"
import "@/models/product/productModel"
import Connect from "@/dbconfig/mongoDbConfig"

export async function GET(request: NextRequest) {
    try {
        await Connect()

        const userId = await getCookieData(request)
        console.log("User ID from cookie:", userId)

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized. Please login first."
                },
                { status: 401 }
            )
        }

        const cart = await Cart.findOne({ userId })
            .populate("items.productId")


        if (!cart) {
            return NextResponse.json({
                success: true,
                cart: { items: [] },
                message: "Cart is empty"
            })
        }

        return NextResponse.json({
            success: true,
            cart,
            message: "Cart fetched successfully"
        })

    } catch (error) {
        console.error("Unable to find Cart", error)
        return NextResponse.json(
            {
                success: false,
                message: "Unable to find Cart"
            },
            { status: 500 }
        )
    }
}
