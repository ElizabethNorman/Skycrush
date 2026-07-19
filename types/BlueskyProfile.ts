export type BlueskyProfile = {
    did: string;
    handle: string;
    displayName?: string;
    description?: string;
    avatar?: string;
    followersCount?: number;
    followsCount?: number;
    postsCount?: number;
};


export type BlueskyProfilesResponse = {
    profiles: BlueskyProfile[];
};