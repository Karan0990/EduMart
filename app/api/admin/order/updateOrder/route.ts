import { NextRequest, NextResponse } from "next/server";
import { getCookieData } from "@/helper/getTokenData";
import User from "@/models/user/userModel";
import Order from "@/models/order/ordrModel";
import Connect from "@/dbconfig/mongoDbConfig";

export async function POST(request: NextRequest) {

    try {
        await Connect();
        const userId = await getCookieData(request)

        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        const user = await User.findById(userId)

        if (!user) {
            return NextResponse.json(
                { message: "Invalid user" },
                { status: 401 }
            )
        }

        if (user.role !== "admin") {
            return NextResponse.json(
                { message: "Only admin can access this route" },
                { status: 403 }
            )

        }

        const { orderId, status, estimatedDelivery, trackingNumber, deliveryContact, invoiceUrl, invoiceFile, invoiceNotes } = await request.json()

        const order = await Order.findOne({ _id: orderId })

        console.log(status, estimatedDelivery, trackingNumber, deliveryContact, invoiceUrl);

        if (!order) {
            return NextResponse.json(
                { message: "Order not found" },
                { status: 404 }
            )
        }

        if (status) {
            const allowedStatus = ["pending", "processed", "shipped", "delivered", "cancelled"]
            if (!allowedStatus.includes(status)) {
                return NextResponse.json(
                    { message: "Invalid status value" },
                    { status: 400 }
                )
            }
            order.status = status
        }

        if (estimatedDelivery) {
            const parsedDate = new Date(estimatedDelivery);
            console.log("Parsed Date:", parsedDate);
            if (isNaN(parsedDate.getTime())) {
                return NextResponse.json({ message: "Invalid date format" }, { status: 400 });
            }
            order.expectedDeliveryDate = parsedDate
            console.log("Updated expectedDeliveryDate:", order.expectedDeliveryDate);
        }

        if (trackingNumber) {
            order.trackingId = trackingNumber
        }


        if (deliveryContact) {
            if (deliveryContact.length == 10) {
                order.deliveryContact = deliveryContact
            }
        }

        if (invoiceUrl) {
            order.invoiceUrl = invoiceUrl
            order.invoicefileName = invoiceFile || ""
            order.invoiceNotes = invoiceNotes || ""
        }


        await order.save()

        return NextResponse.json({ success: true, message: "Order updated successfully", order }, { status: 200 });

    } catch (error: any) {
        console.error("Error updating order status:", error);
        return NextResponse.json({ message: "Unable to update order status" }, { status: 500 });
    }

}