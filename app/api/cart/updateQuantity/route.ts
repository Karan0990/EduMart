import Cart from "@/models/cart/cartModel";
import Connect from "@/dbconfig/mongoDbConfig";
import { getCookieData } from "@/helper/getTokenData";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    await Connect();

    try {
        const { productId, quantity } = await request.json();
        const userId = await getCookieData(request);

        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        if (quantity < 1) {
            return NextResponse.json(
                { message: "Quantity must be at least 1" },
                { status: 400 }
            );
        }

        const cart = await Cart.findOne({ userId }).populate("items.productId");

        if (!cart) {
            return NextResponse.json(
                { message: "Cart not found" },
                { status: 404 }
            );
        }

        const item = cart.items.find(
            (i: any) => i.productId._id.toString() === productId
        );

        if (!item) {
            return NextResponse.json(
                { message: "Product not in cart" },
                { status: 404 }
            );
        }

        // Stock protection
        item.quantity = Math.min(item.productId.stock, quantity);

        await cart.save();

        return NextResponse.json({
            message: "Quantity updated",
            cart,
            success: true
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to update quantity" },
            { status: 500 }
        );
    }
}
