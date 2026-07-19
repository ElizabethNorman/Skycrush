import {
    NextRequest,
    NextResponse
} from "next/server";

import {
    getOAuthClient
} from "@/lib/auth/client";

const PUBLIC_URL =
    process.env.PUBLIC_URL ??
    "https://skycrush.lizard.beer";

const DID_COOKIE_NAME = "did";

export async function GET(
    request: NextRequest
) {
    try {
        const client = await getOAuthClient();

        /*
         * Exchanges the returned authorization code
         * for an OAuth session.
         */
        const { session } =
            await client.callback(
                request.nextUrl.searchParams
            );

        const response = NextResponse.redirect(
            new URL("/", PUBLIC_URL)
        );

        response.cookies.set(
            DID_COOKIE_NAME,
            session.did,
            {
                httpOnly: true,
                secure:
                    process.env.NODE_ENV ===
                    "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7,
                path: "/"
            }
        );

        return response;
    } catch (error) {
        console.error(
            "OAuth callback error:",
            error
        );

        return NextResponse.redirect(
            new URL(
                "/?error=login_failed",
                PUBLIC_URL
            )
        );
    }
}