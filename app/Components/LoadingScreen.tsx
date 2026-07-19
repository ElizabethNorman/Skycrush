"use client";

import Image from "next/image";

type LoadingScreenProps = {
    message: string;
    recordCount?: number;
};

export default function LoadingScreen({
    message,
    recordCount
}: LoadingScreenProps) {
    const isLargeAccount =
        recordCount !== undefined && recordCount >= 1000;

    const isVeryLargeAccount =
        recordCount !== undefined && recordCount >= 5000;

    return (
        <section className="flex min-h-105 w-full items-center justify-center px-4">
            <div className="w-full max-w-md border-2 border-neutral-900 bg-[#f8f3ee] text-neutral-900">
                <header className="border-b-2 border-neutral-900 px-5 py-3">
                    <h2 className="font-serif text-2xl tracking-tight">
                        Calculating Skycrush
                    </h2>
                </header>

                <div className="flex flex-col items-center px-8 py-12 text-center">
                    <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
                        <div className="absolute inset-0 animate-ping border border-neutral-900/30" />

                        <Image
                            src="/bluesky.svg"
                            alt=""
                            width={58}
                            height={58}
                            className="relative animate-pulse"
                        />
                    </div>

                    <p className="min-h-7 font-medium">
                        {message}
                    </p>

                    {recordCount !== undefined && (
                        <p className="mt-2 font-mono text-sm text-neutral-600">
                            {recordCount.toLocaleString()} interactions found.
                        </p>
                    )}

                    <div className="mt-7 h-2 w-full overflow-hidden border border-neutral-900 bg-white">
                        <div className="h-full w-1/3 animate-[loading_2s_ease-in-out_infinite] bg-neutral-900" />
                    </div>

                    <p className="mt-4 min-h-8 font-mono text-xs text-neutral-500">
                        {isVeryLargeAccount
                            ? "That is a substantial archive. This may take a while."
                            : isLargeAccount
                                ? "You have been busy. This may take a few moments."
                                : "This may take a moment."}
                    </p>
                </div>
            </div>
        </section>
    );
}