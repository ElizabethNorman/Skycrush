"use client";

import { useState } from "react";

import type { BlueskyProfile } from "@/types/BlueskyProfile";
import type { CrushResult } from "@/types/CrushResult";

import ResultsCard, {
    type ResultPerson
} from "./ResultsCard";

type ResultsCarouselProps = {
    profile: BlueskyProfile;
    likesGivenRankings: CrushResult[];
    likesReceivedRankings: CrushResult[];
    mutualRankings: CrushResult[];
    onSignOut: () => void;
};

export default function ResultsCarousel({
    profile,
    likesGivenRankings,
    likesReceivedRankings,
    mutualRankings,
    onSignOut
}: ResultsCarouselProps) {
    const [currentIndex, setCurrentIndex] =
        useState(0);

    const peopleYouLike: ResultPerson[] =
        likesGivenRankings.map((result) => ({
            did: result.did,
            name:
                result.displayName ||
                result.handle,
            handle: result.handle,
            avatar: result.avatar,
            count: result.count
        }));

    const peopleWhoLikeYou: ResultPerson[] =
        likesReceivedRankings.map((result) => ({
            did: result.did,
            name:
                result.displayName ||
                result.handle,
            handle: result.handle,
            avatar: result.avatar,
            count: result.count
        }));

    const mutualPeople: ResultPerson[] =
        mutualRankings.map((result) => ({
            did: result.did,
            name:
                result.displayName ||
                result.handle,
            handle: result.handle,
            avatar: result.avatar,
            count: result.count
        }));

    const cards = [
        {
            title: "Who You Like Most",
            people: peopleYouLike
        },
        {
            title: "Who Likes You Most",
            people: peopleWhoLikeYou
        },
        {
            title: "Your Mutual Crushes",
            people: mutualPeople

        }
    ];

    const currentCard = cards[currentIndex];

    function showPreviousCard() {
        setCurrentIndex((index) =>
            index === 0
                ? cards.length - 1
                : index - 1
        );
    }

    function showNextCard() {
        setCurrentIndex((index) =>
            index === cards.length - 1
                ? 0
                : index + 1
        );
    }

    return (
        <section className="flex w-full flex-col items-center">

            <div className="mb-5 flex flex-row gap-3
             items-center ">
                {profile.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={profile.avatar}
                        alt={`${profile.displayName || profile.handle}'s profile picture`}
                        className="
                    h-12 w-
                    rounded-full
                    border-4 border-neutral-900
                    object-cover
                    shadow-[5px_5px_0_0_#171717]
                "
                    />
                ) : (
                    <div
                        className="
                    flex h-24 w-24
                    items-center justify-center
                    rounded-full
                    border-4 border-neutral-900
                    bg-[#f8f3ee]
                    font-serif text-4xl
                    text-neutral-900
                    shadow-[5px_5px_0_0_#171717]
                "
                    >
                        {(profile.displayName || profile.handle)
                            .charAt(0)
                            .toUpperCase()}
                    </div>
                )}

                <p className="mt-1 font-serif text-4xl text-white tracking-tight">
                    {profile.displayName || profile.handle}
                </p>

                <p className="mt-1 font-mono text-sm uppercase tracking-[0.15em] text-white/70">
                    @{profile.handle}
                </p>

                <button
                    type="button"
                    onClick={onSignOut}
                    className="
                mt-1
                border-b border-white/50
                font-mono text-xs uppercase tracking-[0.15em]
                text-white
                transition-opacity
                hover:opacity-60
            "
                >
                    Sign out
                </button>
            </div>



            <div className="flex w-full items-center justify-center gap-4 px-4">
                <button
                    type="button"
                    onClick={showPreviousCard}
                    aria-label="Show previous results"
                    className="
                        flex h-12 w-12 shrink-0
                        items-center justify-center
                        border-2 border-neutral-900
                        bg-[#f8f3ee]
                        font-serif text-3xl
                        text-neutral-900
                        shadow-[3px_3px_0_0_#171717]
                        transition
                        hover:-translate-x-0.5
                        hover:-translate-y-0.5
                        hover:shadow-[5px_5px_0_0_#171717]
                        active:translate-x-1
                        active:translate-y-1
                        active:shadow-none
                    "
                >
                    ←
                </button>

                <ResultsCard
                    title={currentCard.title}
                    people={currentCard.people}
                />

                <button
                    type="button"
                    onClick={showNextCard}
                    aria-label="Show next results"
                    className="
                        flex h-12 w-12 shrink-0
                        items-center justify-center
                        border-2 border-neutral-900
                        bg-[#f8f3ee]
                        font-serif text-3xl
                        text-neutral-900
                        shadow-[3px_3px_0_0_#171717]
                        transition
                        hover:-translate-x-0.5
                        hover:-translate-y-0.5
                        hover:shadow-[5px_5px_0_0_#171717]
                        active:translate-x-1
                        active:translate-y-1
                        active:shadow-none
                    "
                >
                    →
                </button>
            </div>

            <div className="mt-5 flex justify-center gap-2">
                {cards.map((card, index) => (
                    <button
                        key={card.title}
                        type="button"
                        onClick={() =>
                            setCurrentIndex(index)
                        }
                        aria-label={`Show ${card.title}`}
                        aria-current={
                            index === currentIndex
                                ? "true"
                                : undefined
                        }
                        className={`
                            h-3 w-3
                            border border-neutral-900
                            ${index === currentIndex
                                ? "bg-neutral-900"
                                : "bg-[#f8f3ee]"
                            }
                        `}
                    />
                ))}
            </div>
        </section>
    );
}