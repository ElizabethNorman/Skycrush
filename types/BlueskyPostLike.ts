export type BlueskyLikeActor = {
    did: string;
    handle: string;
    displayName?: string;
    avatar?: string;
};

export type BlueskyPostLike = {
    actor: BlueskyLikeActor;
    createdAt: string;
    indexedAt: string;
};

export type BlueskyPostLikesResponse = {
    uri: string;
    cid?: string;
    likes: BlueskyPostLike[];
    cursor?: string;
};


export type LikesReceivedProgress = {
    processedPosts: number;
    totalPosts: number;
    likesFound: number;
    failedPosts: number;
};
