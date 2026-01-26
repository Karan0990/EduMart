import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({

    orderId: { type: String, required: true, unique: true, default: () => `ORDR-${Date.now()}` },

    userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    items: [
        {
            productId: { type: mongoose.Types.ObjectId, required: true, ref: "Product" },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        },
    ],
    totalAmount: { type: Number, required: true },

    shippingAddress: {
        city: {
            type: String,
            required: [true, "please Provide city"]
        },

        locality: {
            type: String,
            required: [true, "please Provide locality"]
        },

        state: {
            type: String,
            required: [true, "please Provide State"]
        },
        country: {
            type: String,
            required: [true, "please Provide country"]
        },
        pincode: {
            type: String,
            required: [true, "please Provide pincode"]
        }


    },

    paymentMethod: { type: String, required: true, enum: ["cod", "online"] },
    status: { type: String, required: true, enum: ["pending", "processed", "shipped", "delivered", "cancelled"], default: "pending" },
    invoiceUrl: { type: String },
    invoicefileName: { type: String },
    invoiceNotes: { type: String },
    trackingId: { type: String },
    deliveryContact: { type: String },

    createdAt: { type: Date, default: Date.now },
    expectedDeliveryDate: { type: Date },

    transactionId: { type: String }


}, { timestamps: true });
const Order =
    mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order