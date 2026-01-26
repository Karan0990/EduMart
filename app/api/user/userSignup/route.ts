import User from "@/models/user/userModel";
import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbconfig/mongoDbConfig";
import bcrypt from "bcryptjs";

Connect();

export async function POST(request: NextRequest) {
    try {

        const body = await request.json();

        const {
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            address
        } = body;

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            firstName,
            lastName,
            phoneNumber: {
                isdCode: phoneNumber.isdCode,
                number: phoneNumber.number
            },
            email,
            password: hashedPassword,
            address: {
                city: address.city,
                locality: address.locality,
                state: address.state,
                country: address.country,
                pincode: address.pincode
            },
        });

        return NextResponse.json(
            { success: true, user: newUser },
            { status: 201 }
        );
    } catch (error) {
        console.error("SIGNUP ERROR:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
