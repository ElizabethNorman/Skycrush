import {
    NodeOAuthClient,
    buildAtprotoLoopbackClientMetadata
} from "@atproto/oauth-client-node";

import type {
    NodeSavedSession,
    NodeSavedState,
    OAuthClientMetadataInput
} from "@atproto/oauth-client-node";

export const SCOPE = "atproto";

const globalAuth =
    globalThis as unknown as {
        stateStore: Map<string, NodeSavedState>;
        sessionStore: Map<string, NodeSavedSession>;
    };

globalAuth.stateStore ??= new Map();
globalAuth.sessionStore ??= new Map();

let client: NodeOAuthClient | null = null;

function getPublicUrl(): string {
    return (
        process.env.PUBLIC_URL ??
        "http://127.0.0.1:3000"
    ).replace(/\/$/, "");
}

function isProductionUrl(publicUrl: string): boolean {
    return publicUrl.startsWith("https://");
}

function getProductionMetadata(
    publicUrl: string
): OAuthClientMetadataInput {
    return {
        client_id:
            `${publicUrl}/oauth-client-metadata.json`,

        client_name: "Skycrush",

        client_uri: publicUrl,

        redirect_uris: [
            `${publicUrl}/oauth/callback`
        ],

        grant_types: [
            "authorization_code"
        ],

        response_types: ["code"],

        application_type: "web",

        scope: SCOPE,

        token_endpoint_auth_method: "none",

        dpop_bound_access_tokens: true
    };
}

export async function getOAuthClient():
    Promise<NodeOAuthClient> {
    if (client) {
        return client;
    }

    const publicUrl = getPublicUrl();
    const production =
        isProductionUrl(publicUrl);

    client = new NodeOAuthClient({
        clientMetadata: production
            ? getProductionMetadata(publicUrl)
            : buildAtprotoLoopbackClientMetadata({
                  scope: SCOPE,
                  redirect_uris: [
                      `${publicUrl}/oauth/callback`
                  ]
              }),

        stateStore: {
            async get(key: string) {
                return globalAuth.stateStore.get(key);
            },

            async set(
                key: string,
                value: NodeSavedState
            ) {
                globalAuth.stateStore.set(
                    key,
                    value
                );
            },

            async del(key: string) {
                globalAuth.stateStore.delete(key);
            }
        },

        sessionStore: {
            async get(key: string) {
                return globalAuth.sessionStore.get(key);
            },

            async set(
                key: string,
                value: NodeSavedSession
            ) {
                globalAuth.sessionStore.set(
                    key,
                    value
                );
            },

            async del(key: string) {
                globalAuth.sessionStore.delete(key);
            }
        }
    });

    return client;
}