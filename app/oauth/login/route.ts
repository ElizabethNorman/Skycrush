import {
    NextRequest,
    NextResponse
} from "next/server";

import {
    getOAuthClient,
    SCOPE
} from "@/lib/auth/client";

type LoginRequestBody = {
    handle?: unknown;
};

export async function POST(
    request: NextRequest
) {
    try {
        const body =
            await request.json() as LoginRequestBody;

        if (
            typeof body.handle !== "string" ||
            !body.handle.trim()
        ) {
            return NextResponse.json(
                {
                    error:
                        "A Bluesky handle is required."
                },
                {
                    status: 400
                }
            );
        }

        const cleanedHandle = body.handle
            .trim()
            .replace(/^@/, "");

        const client = await getOAuthClient();

        /*
         * Resolves the handle, discovers the user's
         * authorization server, and creates the OAuth URL.
         */
        const authorizationUrl =
            await client.authorize(
                cleanedHandle,
                {
                    scope: SCOPE
                }
            );

        return NextResponse.json({
            redirectUrl:
                authorizationUrl.toString()
        });
    } catch (error) {
        console.error(
            "OAuth login error:",
            error
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Login failed."
            },
            {
                status: 500
            }
        );
    }
}