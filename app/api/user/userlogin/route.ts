import User from "@/models/user/userModel";
import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbconfig/mongoDbConfig";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

Connect();

export async function POST(request: NextRequest) {
    try {

        const body = await request.json();

        const { email, password, rememberMe } = body as {
            email: string;
            password: string;
            rememberMe: boolean
        };

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });


        if (!existingUser) {
            return NextResponse.json(
                { message: "User does not exist" },
                { status: 404 }
            );
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isPasswordCorrect) {
            return NextResponse.json(
                { message: "Enter correct password" },
                { status: 401 }
            );
        }

        const token = jwt.sign(
            {
                _id: existingUser._id,
                userName: `${existingUser.firstName} ${existingUser.lastName}`,
                email: existingUser.email,
                role: existingUser.role
            },
            process.env.TOKEN_SECRET!,

            { expiresIn: rememberMe ? "30d" : "1d", }

        );

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: rememberMe
                ? 30 * 24 * 60 * 60
                : 24 * 60 * 60,
        })



        return response;
    } catch {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
