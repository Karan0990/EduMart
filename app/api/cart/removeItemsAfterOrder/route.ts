import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/order/ordrModel";
import User from "@/models/user/userModel";
import { getCookieData } from "@/helper/getTokenData";
import Cart from "@/models/cart/cartModel";
import Connect from "@/dbconfig/mongoDbConfig";


export async function GET(request: NextRequest) {

    try {
        await Connect();

        const userId = await getCookieData(request);

        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        console.log("User ID from cookie:", userId);

        const cartitemsToRemove = await Cart.findOne({ userId: userId });
        if (!cartitemsToRemove) {
            return NextResponse.json(
                { success: false, message: "No cart items found for the user" },
                { status: 404 }
            );
        }

        await Cart.deleteOne({ userId: userId });

        return NextResponse.json(
            {
                success: true,
                message: "Cart items removed successfully after order placement",
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.log("Error in removing cart items after order:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }

}