import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken";

export function proxy(request: NextRequest) {
    const token = request.cookies.get("token")?.value || "";

    if (!token && request.nextUrl.pathname.startsWith("/profile")) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    if (!token && request.nextUrl.pathname.startsWith("/cart")) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    if (!token && request.nextUrl.pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    if (!token && request.nextUrl.pathname.startsWith("/checkout")) {
        return NextResponse.redirect(new URL("/login", request.url))
    }
    if (!token && request.nextUrl.pathname.startsWith("/orders")) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    const path = request.nextUrl.pathname

    if (path.startsWith("/admin")) {
        const token = request.cookies.get("token")?.value;

        // No token → pretend route does not exist
        if (!token) {
            return NextResponse.rewrite(new URL("/404", request.url));
        }

        try {
            const decoded = jwt.verify(
                token,
                process.env.TOKEN_SECRET!
            ) as { role: string };

            // If NOT admin → 404
            if (decoded.role !== "admin") {
                return NextResponse.rewrite(new URL("/404", request.url));
            }

            // Admin → allow access
            return NextResponse.next();
        } catch {
            // Invalid / expired token → 404
            return NextResponse.rewrite(new URL("/404", request.url));
        }
    }


    const isPublic = path == "/login" || path == "/signup"

    if (isPublic && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (!isPublic && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();

}

export const config = {
    matcher: ["/login", "/signup", "/profile", "/profile/:path*", "/cart/:path*", "/admin/:path*", "/checkout", "/checkout/:path*", "/orders", "/orders/:path*"],
}

