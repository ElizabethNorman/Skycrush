export type InteractionCountResult = {
    did: string;
    count: number;
};

export type CrushResult = {
    did: string;
    handle: string;
    displayName: string;
    avatar: string;
    count: number;
};


export type MutualCountResult = {
    did: string;
    count: number;
    likesGiven: number;
    likesReceived: number;
};

