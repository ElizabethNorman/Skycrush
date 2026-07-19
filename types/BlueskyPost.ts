export type BlueskyPostRecord = {
    $type: "app.bsky.feed.post";
    text: string;
    createdAt: string;

    reply?: {
        root: {
            uri: string;
            cid: string;
        };
        parent: {
            uri: string;
            cid: string;
        };
    };
};

export type BlueskyPostListItem = {
    uri: string;
    cid: string;
    value: BlueskyPostRecord;
};

export type BlueskyPostListResponse = {
    records: BlueskyPostListItem[];
    cursor?: string;
};