import { cookies } from "next/headers";

import type {
    OAuthSession
} from "@atproto/oauth-client-node";

import { getOAuthClient } from "./client";

const DID_COOKIE_NAME = "did";

export async function getDid():
Promise<string | null> {
    const cookieStore = await cookies();

    return (
        cookieStore.get(DID_COOKIE_NAME)?.value ??
        null
    );
}

export async function getSession():
Promise<OAuthSession | null> {
    const did = await getDid();

    if (!did) {
        return null;
    }

    try {
        const client = await getOAuthClient();

        return await client.restore(did);
    } catch (error) {
        console.error(
            "Could not restore OAuth session:",
            error
        );

        return null;
    }
}