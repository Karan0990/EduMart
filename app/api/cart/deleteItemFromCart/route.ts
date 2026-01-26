import { NextRequest, NextResponse } from "next/server";
import Cart from "@/models/cart/cartModel";
import Connect from "@/dbconfig/mongoDbConfig";
import { getCookieData } from "@/helper/getTokenData";

export async function POST(request: NextRequest) {

    await Connect();

    try {
        const body = await request.json();
        const { productId } = body;

        const userId = await getCookieData(request);

        if (!userId) {
            return NextResponse.json(
                { message: "Make Login First" },
                { status: 401 }
            );
        }

        const cart = await Cart.findOne({ userId })

        if (cart) {

            const itemIndex = cart.items.findIndex(
                (item: any) => item.productId.toString() == productId
            )

            cart.items.pop(itemIndex)

            await cart.save();
        }

        return NextResponse.json({
            message: "Product Deleted From Cart",
            cart
        });

    } catch (error: any) {
        console.log("Unable To Delete Product From Cart", error)

        return NextResponse.json(
            { message: "Unable to delete Product" },
            error,
        );

    }

}