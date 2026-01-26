import Order from "@/models/order/ordrModel";
import { getCookieData } from "@/helper/getTokenData";
import Connect from "@/dbconfig/mongoDbConfig";
import { NextRequest, NextResponse } from "next/server";
import "@/models/product/productModel"

export async function GET(request: NextRequest) {
    try {
        await Connect();

        const userId = await getCookieData(request);

        if (!userId) {
            return NextResponse.json(
                { message: "Please login first", success: false },
                { status: 401 }
            );
        }

        const orders = await Order.find({ userId })
            .populate("items.productId", "productName coverImage")
            .sort({ createdAt: -1 })


        if (!orders || orders.length === 0) {
            return NextResponse.json(
                { message: "No order history found", success: false },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { orders, success: true },
            { status: 200 }
        );

    } catch (error) {
        console.error("Unable to find orders:", error);
        return NextResponse.json(
            { message: "Internal server error", success: false },
            { status: 500 }
        );
    }
}
