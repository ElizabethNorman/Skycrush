import {
    NextRequest,
    NextResponse
} from "next/server";

import {
    getOAuthClient
} from "@/lib/auth/client";

const DID_COOKIE_NAME = "did";

export async function GET(
    request: NextRequest
) {
    const publicUrl =
        process.env.PUBLIC_URL ??
        "http://127.0.0.1:3000";

    try {
        const client =
            await getOAuthClient();

        const { session } =
            await client.callback(
                request.nextUrl.searchParams
            );

        const response =
            NextResponse.redirect(
                new URL("/", publicUrl)
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
                path: "/"
            }
        );

        return response;
    } catch (error) {
        console.error(
            "OAuth callback failed:",
            error
        );

        return NextResponse.redirect(
            new URL(
                "/?error=oauth_callback_failed",
                publicUrl
            )
        );
    }
}