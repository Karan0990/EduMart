import { NextResponse, NextRequest } from "next/server";
import Connect from "@/dbconfig/mongoDbConfig";
import Order from "@/models/order/ordrModel";
import "@/models/user/userModel";
import "@/models/product/productModel";

export async function POST(request: NextRequest) {

    try {
        await Connect();

        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({
                message: "Order ID is required",
                success: false
            });
        }

        const order = await Order.findOne({ _id: id }).populate("items.productId").populate("userId");
        if (!order) {
            return NextResponse.json({
                message: "Order not found",
                success: false
            });
        }



        return NextResponse.json({
            message: "Order fetched successfully",
            success: true,
            order
        });

    } catch (error: any) {
        console.error("Error in fetching order by ID:", error);
        return NextResponse.json({
            message: "unable to fetch order",
            success: false,
            error: error.message
        })
    }


}
