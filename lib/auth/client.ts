import {
    NodeOAuthClient,
    buildAtprotoLoopbackClientMetadata
} from "@atproto/oauth-client-node";

import type {
    NodeSavedSession,
    NodeSavedState
} from "@atproto/oauth-client-node";

export const SCOPE = "atproto";

type GlobalAuthStorage = {
    stateStore?: Map<string, NodeSavedState>;
    sessionStore?: Map<string, NodeSavedSession>;
};

const globalAuth =
    globalThis as typeof globalThis & GlobalAuthStorage;

/*
 * These Maps survive Next.js hot reloads during development.
 *
 * stateStore:
 * Temporary OAuth transaction data used between login and callback.
 *
 * sessionStore:
 * OAuth tokens and session information, keyed by the user's DID.
 */
globalAuth.stateStore ??=
    new Map<string, NodeSavedState>();

globalAuth.sessionStore ??=
    new Map<string, NodeSavedSession>();

let oauthClient: NodeOAuthClient | null = null;

export async function getOAuthClient():
Promise<NodeOAuthClient> {
    if (oauthClient) {
        return oauthClient;
    }

    oauthClient = new NodeOAuthClient({
        clientMetadata:
            buildAtprotoLoopbackClientMetadata({
                scope: SCOPE,
                redirect_uris: [
                    "http://127.0.0.1:3000/oauth/callback"
                ]
            }),

        stateStore: {
            async get(key: string) {
                return globalAuth.stateStore?.get(key);
            },

            async set(
                key: string,
                value: NodeSavedState
            ) {
                globalAuth.stateStore?.set(
                    key,
                    value
                );
            },

            async del(key: string) {
                globalAuth.stateStore?.delete(key);
            }
        },

        sessionStore: {
            async get(key: string) {
                return globalAuth.sessionStore?.get(
                    key
                );
            },

            async set(
                key: string,
                value: NodeSavedSession
            ) {
                globalAuth.sessionStore?.set(
                    key,
                    value
                );
            },

            async del(key: string) {
                globalAuth.sessionStore?.delete(
                    key
                );
            }
        }
    });

    return oauthClient;
}