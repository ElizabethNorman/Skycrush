"use client";

import SignIn from "./SignIn";

export default function Title() {
    return (
        <section
            className="
                w-full max-w-md
                border-2 border-neutral-900
                bg-[#f8f3ee]
                text-neutral-900
                shadow-[8px_8px_0_0_#171717]
            "
        >
            <header className="border-b-2 border-neutral-900 px-6 py-5 text-center">
               

                <h1 className="font-serif text-5xl tracking-tight">
                    Skycrush ♡♡♡
                </h1>
            </header>

            <div className="space-y-6 px-7 py-8">
                <div>
                    <h2 className="font-serif text-3xl leading-tight">
                        find out who your Bluesky crushes are
                    </h2>

                    <p className="mt-4 leading-7 text-neutral-700">
                        omg who do u likeeeeeeeeeeee???? who likes u!?? are the rumors true? sign in and find out!
                    </p>
                </div>

                <div className="border-y-2 border-neutral-900 py-5">
                    <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
                        Your report includes
                    </p>

                    <ul className="space-y-2 text-sm">
                        <li className="flex gap-3">
                            <span aria-hidden="true">♥</span>
                            <span>Who you like most</span>
                        </li>

                        <li className="flex gap-3">
                            <span aria-hidden="true">♥</span>
                            <span>Who likes you most</span>
                        </li>

                        <li className="flex gap-3">
                            <span aria-hidden="true">♥</span>
                            <span>Your mutual crushes</span>
                        </li>
                    </ul>
                </div>

                <div>
                    <p className="mb-5 text-center font-mono text-xs text-neutral-500">
                        Made by{" "}
                        <a
                            href="https://bsky.app/profile/lizard.beer"
                            target="_blank"
                            rel="noreferrer"
                            className="font-bold text-neutral-900 underline decoration-2 underline-offset-4 hover:opacity-60"
                        >
                            Lizard
                        </a>
                    </p>

                    <SignIn />
                </div>
            </div>
        </section>
    );
}