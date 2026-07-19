export type BlueskyLikeRecord = {
    $type: "app.bsky.feed.like";
    subject: {
        uri: string;
        cid: string;
    };
    createdAt: string;
};

export type BlueskyLikeListItem = {
    uri: string;
    cid: string;
    value: BlueskyLikeRecord;
};

export type BlueskyLikeListResponse = {
    records: BlueskyLikeListItem[];
    cursor?: string;
};