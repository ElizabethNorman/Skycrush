"use client";

import { useEffect } from "react";

type AboutModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function AboutModal({
    isOpen,
    onClose
}: AboutModalProps) {
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="
                fixed inset-0 z-50
                flex items-center justify-center
                bg-black/50 px-4
            "
            onClick={onClose}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="about-title"
                className="
                    w-full max-w-lg
                    border-2 border-neutral-900
                    bg-[#f8f3ee]
                    text-neutral-900
                "
                onClick={(event) => event.stopPropagation()}
            >
                <header className="flex items-center justify-between border-b-2 border-neutral-900 px-5 py-3">
                    <h2
                        id="about-title"
                        className="font-serif text-2xl tracking-tight"
                    >
                        About Skycrush
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close about window"
                        className="
                            font-mono text-xl leading-none
                            transition-opacity
                            hover:opacity-50
                        "
                    >
                        ×
                    </button>
                </header>

                <div className="space-y-5 px-6 py-7 leading-7">
                    <p>
                        Skycrush looks at your public Bluesky interactions and
                        ranks the people you engage with most.
                    </p>

                    <p>
                        It considers activity such as likes, reposts, and
                        replies. This is just for fun!
                    </p>

                    <div className="border-y border-neutral-400 py-4">
                        <p className="font-medium">
                            Your account stays under your control.
                        </p>

                        <p className="mt-1 text-sm text-neutral-600">
                            Skycrush does not receive your Bluesky password.
                            Authentication happens through Bluesky, and the app
                            only requests the access needed to calculate your
                            results.
                        </p>
                    </div>

                    <p className="font-mono text-xs text-neutral-500">
                        Built with React and the AT Protocol. <u><b><a href="https://lizard.beer" target="_blank">Made by Lizard.</a></b></u>
                    </p>
                </div>
            </section>
        </div>
    );
}