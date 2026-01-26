import mongoose, { Schema } from "mongoose";
import { unique } from "next/dist/build/utils";

const userSchema = new Schema({

    firstName: {
        type: String,
        required: [true, "please Provide firstName"]
    },

    lastName: {
        type: String,
        required: [true, "please Provide lastName"]
    },

    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dd0ckmtsp/image/upload/v1769361573/userlogo_ezdimg.jpg"
    },

    email: {
        type: String,
        required: [true, "please Provide email"],
        unique: true
    },

    phoneNumber: {
        isdCode: {
            type: String,
            require: [true, "please Provide ISD Code"]
        },
        number: {
            type: String,
            require: [true, "please Provide number"]
        }
    },

    address:
    {
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
            required: [true, "please Provide county"]
        },
        pincode: {
            type: String,
            required: [true, "please Provide pincode"]
        },
    },

    password: {
        type: String,
        required: [true, "please Provide Password"]
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    //forgot Password

    forgetPasswordToken: { type: String },
    resetPasswordExpire: { type: String },


}, { timestamps: true });

const User =
    mongoose.models.User || mongoose.model("User", userSchema);

export default User