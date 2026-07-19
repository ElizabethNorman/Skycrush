"use client";

import { useState } from "react";
import AboutModal from "./AboutModal";

export default function AboutButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="
                    fixed bottom-5 left-1/2 -translate-x-1/2
                    border-b border-white/70
                    text-sm text-white/80
                    transition
                    hover:text-white
                "
            >
                About Skycrush
            </button>

            <AboutModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}