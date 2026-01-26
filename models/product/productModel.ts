import mongoose from "mongoose";
import { unique } from "next/dist/build/utils";


const productSchema = new mongoose.Schema({

    productName: {
        type: String,
        required: [true, "Please Provide Product Name"],
    },

    brandName: {
        type: String,
        required: [true, "Please Provide Brand Name"],
    },

    productPrice: {
        type: Number,
        required: [true, "Please Provide Price"]
    },

    shortDiscription: {
        type: String,
        required: [true, "Please Provide Discription"]
    },

    longDiscription: {
        type: String,
        required: [true, "Please Provide Discription"]
    },
    stock: {
        type: Number,
        required: [true, "Please Provide Stock"]
    },
    category: {
        type: String,
        required: [true, "Please Provide Category"]
    },

    coverImage: {
        type: String,
        required: [true, "Please Provide CoverImage"]
    },

    otherImages: {
        type: [String],
        validate: {
            validator: (v: string[]) => v.length > 0,
            message: "Please provide at least one additional image"
        }
    },
    avgRating: {
        type: Number,
        default: 0,
    },

    totalRatings: {
        type: Number,
        default: 0,
    },


}, { timestamps: true })


const Product =
    mongoose.models.Product || mongoose.model("Product", productSchema)
export default Product