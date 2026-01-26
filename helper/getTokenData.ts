import jwt from "jsonwebtoken"
import { NextRequest } from "next/server"

export async function getCookieData(request: NextRequest) {
    const token = request.cookies.get("token")?.value

    if (!token) {
        return null
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.TOKEN_SECRET!
        ) as { _id: string; role?: string; tokenVersion: number }

        return decoded._id
    } catch (error) {
        return null
    }
}
