import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
    getOAuthClient
} from "@/lib/auth/client";

const DID_COOKIE_NAME = "did";

export async function POST() {
    const cookieStore = await cookies();

    try {
        const did =
            cookieStore.get(
                DID_COOKIE_NAME
            )?.value;

        if (did) {
            const client =
                await getOAuthClient();

            await client.revoke(did);
        }

        cookieStore.delete(
            DID_COOKIE_NAME
        );

        return NextResponse.json({
            success: true
        });
    } catch (error) {
        console.error(
            "OAuth logout error:",
            error
        );

        /*
         * Even if revocation fails, remove the local
         * cookie so the browser is logged out locally.
         */
        cookieStore.delete(
            DID_COOKIE_NAME
        );

        return NextResponse.json({
            success: true
        });
    }
}