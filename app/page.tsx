"use client";

import { useEffect, useState, useRef } from "react";
import Title from "./Components/Title";
import SignIn from "./Components/SignIn";
import ResultsCarousel from "./Components/ResultsCarousel";
import LoadingScreen from "./Components/LoadingScreen";
import AboutButton from "./Components/AboutButton";
import type { BlueskyProfile } from "@/types/BlueskyProfile";
import type { CrushResult } from "@/types/CrushResult";
import {
  calculateMutualRankings,
  countLikesByAuthor,
  countLikesReceived,
  getAllLikes,
  getAllPosts,
  getProfile,
  hydrateRankings
} from "@/lib/bluesky";

export default function Home() {
  const [profile, setProfile] =
    useState<BlueskyProfile | null>(null);

  const hasRestoredSession = useRef(false);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [likesGivenRankings, setLikesGivenRankings] =
    useState<CrushResult[]>([]);

  const [
    likesReceivedRankings,
    setLikesReceivedRankings
  ] = useState<CrushResult[]>([]);

  const [loadingMessage, setLoadingMessage] =
    useState("Loading profile...");
  const [recordCount, setRecordCount] =
    useState<number | undefined>();

  const [
    mutualRankings,
    setMutualRankings
  ] = useState<CrushResult[]>([]);



  

  async function handleSignIn(actor: string) {
    setIsLoading(true);
    setError(null);
    setRecordCount(undefined);
    setLikesGivenRankings([]);
    setLikesReceivedRankings([]);

    try {
      setLoadingMessage("Finding your profile...");

      const profileResult =
        await getProfile(actor);

      // Card one: people whose posts this user likes.
      setLoadingMessage(
        "Collecting likes you have given..."
      );
      setRecordCount(0);

      const likes = await getAllLikes(
        profileResult.did,
        (count) => {
          setRecordCount(count);
        }
      );

      setLoadingMessage(
        "Counting people you like most..."
      );

      const givenCounts = countLikesByAuthor(
        likes,
        profileResult.did
      );

      const givenRankings =
        await hydrateRankings(
          givenCounts,
          10
        );

      // Card two: people who like this user's posts.
      setLoadingMessage(
        "Finding your posts..."
      );
      setRecordCount(0);

      const posts = await getAllPosts(
        profileResult.did,
        (count) => {
          setRecordCount(count);
        }
      );

      setLoadingMessage(
        `Checking likes across ${posts.length.toLocaleString()} posts...`
      );
      setRecordCount(0);

      const receivedCounts =
        await countLikesReceived(
          posts,
          profileResult.did,
          (progress) => {
            setRecordCount(
              progress.likesFound
            );

            setLoadingMessage(
              `Checked ${progress.processedPosts.toLocaleString()} of ${progress.totalPosts.toLocaleString()} posts...`
            );
          }
        );

      setLoadingMessage(
        "Loading your admirers..."
      );

      console.log("Given counts:", givenCounts);
      const receivedRankings =
        await hydrateRankings(
          receivedCounts,
          10
        );

      setLoadingMessage(
        "Finding your mutual crushes..."
      );

      const mutualCounts =
        calculateMutualRankings(
          givenCounts,
          receivedCounts
        );

      const mutualRankings =
        await hydrateRankings(
          mutualCounts,
          10
        );

      setMutualRankings(mutualRankings);

      setProfile(profileResult);
      setLikesGivenRankings(givenRankings);
      setLikesReceivedRankings(
        receivedRankings
      );
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Something went wrong."
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignOut() {
    try {
        await fetch("/oauth/logout", {
            method: "POST"
        });
    } finally {
        setProfile(null);
        setLikesGivenRankings([]);
        setLikesReceivedRankings([]);
        setMutualRankings([]);
        setRecordCount(undefined);
        setError(null);
    }
}

  useEffect(() => {
    async function restoreOAuthSession() {
        try {
            const response = await fetch(
                "/api/me",
                {
                    cache: "no-store"
                }
            );

            if (response.status === 401) {
                return;
            }

            if (!response.ok) {
                throw new Error(
                    "Could not restore the Bluesky session."
                );
            }

            const data: {
                authenticated: boolean;
                did?: string;
            } = await response.json();

            if (
                data.authenticated &&
                data.did
            ) {
                await handleSignIn(data.did);
            }
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Could not restore the Bluesky session."
            );
        }
    }

    void restoreOAuthSession();
}, []);

useEffect(() => {
    if (hasRestoredSession.current) {
        return;
    }

    hasRestoredSession.current = true;

    async function restoreOAuthSession() {
        try {
            const response = await fetch(
                "/api/me",
                {
                    cache: "no-store"
                }
            );

            if (response.status === 401) {
                return;
            }

            if (!response.ok) {
                throw new Error(
                    "Could not restore the Bluesky session."
                );
            }

            const data: {
                authenticated: boolean;
                did?: string;
            } = await response.json();

            if (
                data.authenticated &&
                data.did
            ) {
                await handleSignIn(data.did);
            }
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Could not restore the Bluesky session."
            );
        }
    }

    void restoreOAuthSession();
}, []);

  return (
    <main className="flex min-h-screen items-center justify-center">
     
      {isLoading ? (
        <LoadingScreen message={loadingMessage} recordCount={recordCount} />
      ) : profile ? (
        <ResultsCarousel
          profile={profile}
          likesGivenRankings={
            likesGivenRankings
          }
          likesReceivedRankings={
            likesReceivedRankings
          }
          mutualRankings={mutualRankings}
          onSignOut={handleSignOut}
        />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center">
          <Title />



          {error && (
            <p
              role="alert"
              className="mt-5 max-w-md text-center font-mono text-sm text-red-800"
            >
              {error}
            </p>
          )}
          <AboutButton></AboutButton>
        </div>
      )}
    </main>
  );
}