// "use client";

// type SignInModalProps = {
//     isOpen: boolean;
//     onClose: () => void;
// };

// export default function SignInModal({
//     isOpen,
//     onClose
// }: SignInModalProps) {
//     if (!isOpen) {
//         return null;
//     }

//     return (
//         <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">
//             <div className="bg-white p-10 text-black">
//                 <p>The modal is working.</p>

//                 <button
//                     type="button"
//                     onClick={onClose}
//                     className="mt-4 border border-black px-4 py-2"
//                 >
//                     Close
//                 </button>
//             </div>
//         </div>
//     );
// }

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type SignInModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

type OAuthLoginResponse = {
    redirectUrl?: string;
    error?: string;
};

export default function SignInModal({
    isOpen,
    onClose
}: SignInModalProps) {
    const [handle, setHandle] = useState("");
    const [isSubmitting, setIsSubmitting] =
        useState(false);
    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener(
                "keydown",
                handleKeyDown
            );
        }

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [isOpen, onClose]);

    async function handleOAuthSignIn(
        handle: string
    ): Promise<void> {
        const cleanedHandle = handle
            .trim()
            .replace(/^@/, "");

        if (!cleanedHandle) {
            setError(
                "Enter your Bluesky handle."
            );

            return;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            const response = await fetch(
                "/oauth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        handle: cleanedHandle
                    })
                }
            );

            const data =
                await response.json() as OAuthLoginResponse;

            if (!response.ok) {
                throw new Error(
                    data.error ??
                    "Could not begin sign-in."
                );
            }

            if (!data.redirectUrl) {
                throw new Error(
                    "The login route did not return a redirect URL."
                );
            }

            window.location.assign(
                data.redirectUrl
            );
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Could not begin sign-in."
            );

            setIsSubmitting(false);
        }
    }

    function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ): void {
        event.preventDefault();

        void handleOAuthSignIn(handle);
    }

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={onClose}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="sign-in-title"
                className="w-full max-w-md border-2 border-neutral-900 bg-[#f8f3ee] text-neutral-900"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >
                <header className="flex items-center justify-between border-b-2 border-neutral-900 px-5 py-3">
                    <h2
                        id="sign-in-title"
                        className="font-serif text-2xl tracking-tight"
                    >
                        Sign in
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        aria-label="Close sign-in window"
                        className="font-mono text-xl leading-none transition-opacity hover:opacity-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        ×
                    </button>
                </header>

                <div className="space-y-6 px-6 py-7">
                    <div>
                        <p className="text-lg font-medium">
                            Connect your Bluesky account
                        </p>

                        <p className="mt-2 text-sm leading-6 text-neutral-600">
                            Enter your Bluesky handle to
                            securely sign in and generate
                            your Skycrush results.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        <div>
                            <label
                                htmlFor="bluesky-handle"
                                className="mb-2 block text-sm font-medium"
                            >
                                Bluesky handle
                            </label>

                            <input
                                id="bluesky-handle"
                                type="text"
                                value={handle}
                                onChange={(event) => {
                                    setHandle(
                                        event.target.value
                                    );

                                    if (error) {
                                        setError(null);
                                    }
                                }}
                                placeholder="lizard.beer"
                                autoFocus
                                required
                                disabled={isSubmitting}
                                aria-invalid={
                                    error
                                        ? true
                                        : undefined
                                }
                                aria-describedby={
                                    error
                                        ? "sign-in-error"
                                        : undefined
                                }
                                className="
                                    w-full
                                    border-2 border-neutral-900
                                    bg-white
                                    px-4 py-3
                                    outline-none
                                    transition
                                    focus:bg-pink-50
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            />
                        </div>

                        {error && (
                            <p
                                id="sign-in-error"
                                role="alert"
                                className="text-sm font-medium text-red-700"
                            >
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                !handle.trim()
                            }
                            className="
                                flex w-full items-center justify-center gap-3
                                border-2 border-neutral-900
                                bg-white
                                px-5 py-3
                                font-semibold
                                shadow-[4px_4px_0_0_#171717]
                                transition
                                hover:-translate-x-0.5
                                hover:-translate-y-0.5
                                hover:shadow-[6px_6px_0_0_#171717]
                                active:translate-x-1
                                active:translate-y-1
                                active:shadow-none
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                                disabled:hover:translate-x-0
                                disabled:hover:translate-y-0
                                disabled:hover:shadow-[4px_4px_0_0_#171717]
                            "
                        >
                            <Image
                                src="/bluesky.svg"
                                alt=""
                                width={22}
                                height={22}
                            />

                            <span>
                                {isSubmitting
                                    ? "Connecting..."
                                    : "Continue with Bluesky"}
                            </span>
                        </button>
                    </form>

                    <p className="text-center font-mono text-xs text-neutral-500">
                        You will be redirected to
                        Bluesky to authorize Skycrush.
                    </p>
                </div>
            </section>
        </div>
    );
}