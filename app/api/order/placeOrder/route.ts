import Order from "@/models/order/ordrModel";
import Connect from "@/dbconfig/mongoDbConfig";
import { getCookieData } from "@/helper/getTokenData";
import { NextResponse, NextRequest } from "next/server";
import Product from "@/models/product/productModel";
import User from "@/models/user/userModel";

export async function POST(request: NextRequest) {
    try {
        await Connect()

        const body = await request.json()

        const { items, paymentMethod, transactionId } = body

        const userId = await getCookieData(request)

        if (!userId) {
            return NextResponse.json({ message: "Make Login First" })
        }

        const user = await User.findById(userId)

        if (!user) {
            return NextResponse.json({ message: "User Not Found" })
        }

        if (!user.address) {
            return NextResponse.json({ message: "Not Have Valid Address" })
        }

        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { success: false, message: "Order items are required" },
                { status: 400 }
            )
        }

        if (paymentMethod === "online" && !transactionId) {
            return NextResponse.json(
                { success: false, message: "Transaction ID required" },
                { status: 400 }
            )
        }


        let totalCost = 0
        let orderItems = []

        for (const item of items) {
            const product = await Product.findById(item.productId)

            if (!product) {
                throw new Error("Product not found")
            }

            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product.productName}`)
            }



            totalCost += product.productPrice * item.quantity



            orderItems.push({
                productId: product._id,
                quantity: item.quantity,
                price: product.productPrice,

            })

            product.stock = product.stock - item.quantity
            await product.save()
        }

        const shippingCharge = totalCost > 500 ? 0 : 50
        const tax = Math.round(totalCost * 0.05)

        let totalPrice = totalCost + shippingCharge + tax
        let deliveryDate = Date.now() + 7 * 24 * 60 * 60 * 1000


        const order = await Order.create({

            userId: userId,
            items: orderItems,
            totalAmount: totalPrice,
            shippingAddress: user.address,
            paymentMethod,
            transactionId,
            expectedDeliveryDate: deliveryDate
        })


        return NextResponse.json({
            success: true,
            order,
            message: "Order Place SuccessFully"
        })


    } catch (error: any) {
        console.log("Error in placing order:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

}