import type { BlueskyProfile } from "@/types/BlueskyProfile";

import type {

    BlueskyProfilesResponse
} from "@/types/BlueskyProfile";

import type {
    BlueskyPostListItem,
    BlueskyPostListResponse
} from "@/types/BlueskyPost";

import type {
    BlueskyPostLike,
    BlueskyPostLikesResponse,
    LikesReceivedProgress
} from "@/types/BlueskyPostLike";

import type { CrushResult, InteractionCountResult, MutualCountResult } from "@/types/CrushResult";


const BLUESKY_API = "https://public.api.bsky.app/xrpc";

export async function getProfile(
    handle: string
): Promise<BlueskyProfile> {
    const cleanedHandle = handle
        .trim()
        .replace(/^@/, "");

    const url = new URL(
        `${BLUESKY_API}/app.bsky.actor.getProfile`
    );

    url.searchParams.set("actor", cleanedHandle);

    const response = await fetch(url);

    if (!response.ok) {
        if (response.status === 400 || response.status === 404) {
            throw new Error(
                `Could not find a Bluesky account for "${cleanedHandle}".`
            );
        }

        throw new Error(
            `Bluesky request failed with status ${response.status}.`
        );
    }

    const profile: BlueskyProfile = await response.json();

    return profile;
}

function getRepoFromAtUri(uri: string): string {
    const parts = uri.split("/");

    if (
        parts.length < 5 ||
        parts[0] !== "at:" ||
        !parts[2]
    ) {
        throw new Error(`Invalid AT URI: ${uri}`);
    }

    return parts[2];
}

import type {
    BlueskyLikeListItem,
    BlueskyLikeListResponse
} from "@/types/BlueskyLike";

const BLUESKY_ENTRYWAY = "https://bsky.social/xrpc";

export async function getAllLikes(
    repo: string,
    onProgress?: (count: number) => void
): Promise<BlueskyLikeListItem[]> {
    const allLikes: BlueskyLikeListItem[] = [];

    let cursor: string | undefined;

    do {
        const url = new URL(
            `${BLUESKY_ENTRYWAY}/com.atproto.repo.listRecords`
        );

        url.searchParams.set("repo", repo);
        url.searchParams.set(
            "collection",
            "app.bsky.feed.like"
        );
        url.searchParams.set("limit", "100");

        if (cursor) {
            url.searchParams.set("cursor", cursor);
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `Could not retrieve likes: ${response.status}`
            );
        }

        const data: BlueskyLikeListResponse =
            await response.json();

        allLikes.push(...data.records);

        onProgress?.(allLikes.length);

        cursor = data.cursor;
    } while (cursor);

    return allLikes;
}


export function countLikesByAuthor(
    likes: BlueskyLikeListItem[],
    ownDid: string
): InteractionCountResult[] {
    const counts = new Map<string, number>();

    for (const like of likes) {
        const authorDid = getRepoFromAtUri(
            like.value.subject.uri
        );

        if (authorDid === ownDid) {
            continue;
        }

        counts.set(
            authorDid,
            (counts.get(authorDid) ?? 0) + 1
        );
    }

    return Array.from(counts.entries())
        .map(([did, count]) => ({
            did,
            count
        }))
        .sort(
            (first, second) =>
                second.count - first.count
        );
}


export async function getProfiles(
    actors: string[]
): Promise<BlueskyProfile[]> {
    if (actors.length === 0) {
        return [];
    }

    const url = new URL(
        `${BLUESKY_API}/app.bsky.actor.getProfiles`
    );

    for (const actor of actors) {
        url.searchParams.append("actors", actor);
    }

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Could not retrieve profiles: ${response.status}`
        );
    }

    const data: BlueskyProfilesResponse =
        await response.json();

    return data.profiles;
}



export async function hydrateRankings(
    rankings: InteractionCountResult[],
    limit = 10
): Promise<CrushResult[]> {
    const topRankings = rankings.slice(0, limit);

    const profiles = await getProfiles(
        topRankings.map((ranking) => ranking.did)
    );

    const profileLookup = new Map(
        profiles.map((profile) => [
            profile.did,
            profile
        ])
    );

    return topRankings
        .map((ranking) => {
            const profile = profileLookup.get(ranking.did);

            if (!profile) {
                return null;
            }

            return {
                did: ranking.did,
                handle: profile.handle,
                displayName: profile.displayName ?? profile.handle,
                avatar: profile.avatar ?? "",
                count: ranking.count
            };
        })
        .filter(
            (result): result is CrushResult =>
                result !== null
        );
}

export async function getAllPosts(
    repo: string,
    onProgress?: (count: number) => void
): Promise<BlueskyPostListItem[]> {
    const allPosts: BlueskyPostListItem[] = [];

    let cursor: string | undefined;

    do {
        const url = new URL(
            `${BLUESKY_ENTRYWAY}/com.atproto.repo.listRecords`
        );

        url.searchParams.set("repo", repo);
        url.searchParams.set(
            "collection",
            "app.bsky.feed.post"
        );
        url.searchParams.set("limit", "100");

        if (cursor) {
            url.searchParams.set("cursor", cursor);
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `Could not retrieve posts: ${response.status}`
            );
        }

        const data: BlueskyPostListResponse =
            await response.json();

        allPosts.push(...data.records);

        onProgress?.(allPosts.length);

        cursor = data.cursor;
    } while (cursor);

    return allPosts;
}

export async function getAllLikesForPost(
    postUri: string,
    postCid?: string
): Promise<BlueskyPostLike[]> {
    const allLikes: BlueskyPostLike[] = [];

    let cursor: string | undefined;

    do {
        const url = new URL(
            `${BLUESKY_API}/app.bsky.feed.getLikes`
        );

        url.searchParams.set("uri", postUri);
        url.searchParams.set("limit", "100");

        if (postCid) {
            url.searchParams.set("cid", postCid);
        }

        if (cursor) {
            url.searchParams.set("cursor", cursor);
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `Could not retrieve likes for post: ${response.status}`
            );
        }

        const data: BlueskyPostLikesResponse =
            await response.json();

        allLikes.push(...data.likes);

        cursor = data.cursor;
    } while (cursor);

    return allLikes;
}

export async function countLikesReceived(
    posts: BlueskyPostListItem[],
    ownDid: string,
    onProgress?: (
        progress: LikesReceivedProgress
    ) => void,
    concurrency = 5
): Promise<InteractionCountResult[]> {
    const counts = new Map<string, number>();

    let nextPostIndex = 0;
    let processedPosts = 0;
    let likesFound = 0;
    let failedPosts = 0;

    async function worker(): Promise<void> {
        while (true) {
            const currentIndex = nextPostIndex;
            nextPostIndex += 1;

            if (currentIndex >= posts.length) {
                return;
            }

            const post = posts[currentIndex];

            try {
                const likes = await getAllLikesForPost(
                    post.uri,
                    post.cid
                );

                likesFound += likes.length;

                for (const like of likes) {
                    const likerDid = like.actor.did;

                    if (likerDid === ownDid) {
                        continue;
                    }

                    counts.set(
                        likerDid,
                        (counts.get(likerDid) ?? 0) + 1
                    );
                }
            } catch (error) {
                failedPosts += 1;

                console.warn(
                    `Could not process likes for ${post.uri}`,
                    error
                );
            } finally {
                processedPosts += 1;

                onProgress?.({
                    processedPosts,
                    totalPosts: posts.length,
                    likesFound,
                    failedPosts
                });
            }
        }
    }

    const workerCount = Math.min(
        concurrency,
        posts.length
    );

    await Promise.all(
        Array.from(
            { length: workerCount },
            () => worker()
        )
    );

    return Array.from(counts.entries())
        .map(([did, count]) => ({
            did,
            count
        }))
        .sort(
            (first, second) =>
                second.count - first.count
        );
}

export function calculateMutualRankings(
    likesGiven: InteractionCountResult[],
    likesReceived: InteractionCountResult[]
): MutualCountResult[] {
    const receivedLookup = new Map(
        likesReceived.map((result) => [
            result.did,
            result.count
        ])
    );

    const mutualRankings: MutualCountResult[] = [];

    for (const givenResult of likesGiven) {
        const receivedCount =
            receivedLookup.get(givenResult.did);

        if (receivedCount === undefined) {
            continue;
        }

        mutualRankings.push({
            did: givenResult.did,
            likesGiven: givenResult.count,
            likesReceived: receivedCount,

            // Balanced mutual interest scores higher than
            // heavily one-sided interaction.
            count: Math.min(
                givenResult.count,
                receivedCount
            )
        });
    }

    return mutualRankings.sort(
        (first, second) => {
            if (second.count !== first.count) {
                return second.count - first.count;
            }

            const firstTotal =
                first.likesGiven +
                first.likesReceived;

            const secondTotal =
                second.likesGiven +
                second.likesReceived;

            return secondTotal - firstTotal;
        }
    );
}