import mongoose from "mongoose";
import { Schema } from "mongoose";

const ratingSchema = new Schema({

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },

    review: {
        type: String,
        trim: true,
        maxlength: 500,
    }


}, { timestamps: true })

ratingSchema.index({ productId: 1, userId: 1 }, { unique: true });


const Rating = mongoose.models.Rating || mongoose.model("Rating", ratingSchema)

export default Rating