// "use client";

// import { useState } from "react";
// import SignInModal from "./SignInModal";

// export default function SignIn() {
//     const [isModalOpen, setIsModalOpen] =
//         useState(false);

//     return (
//         <div className="relative z-50">
//             <p>
//                 Modal state:{" "}
//                 {isModalOpen ? "open" : "closed"}
//             </p>

//             <button
//                 type="button"
//                 onClick={() => {
//                     setIsModalOpen(true);
//                 }}
//                 className="border-2 border-black bg-white px-6 py-3 text-black"
//             >
//                 Open sign-in
//             </button>

//             <SignInModal
//                 isOpen={isModalOpen}
//                 onClose={() =>
//                     setIsModalOpen(false)
//                 }
//             />
//         </div>
//     );
// }
"use client";

import Image from "next/image";
import { useState } from "react";
import SignInModal from "./SignInModal";

export default function SignIn() {
    const [isModalOpen, setIsModalOpen] =
        useState(false);

    return (
        <>
            <div className="flex justify-center">
                <button
                    type="button"
                    onClick={() => {
                        console.log("Opening modal");
                        setIsModalOpen(true);
                    }}
                    className="
                        mt-1
                        inline-flex items-center gap-3
                        rounded-full
                        border border-gray-300
                        bg-gray-200
                        px-6 py-2
                        text-base font-semibold text-gray-800
                        shadow-sm
                        transition-all duration-200
                        hover:-translate-y-0.5
                        hover:bg-gray-300
                        hover:shadow-md
                        active:translate-y-0
                    "
                >
                    <Image
                        src="/bluesky.svg"
                        alt=""
                        width={22}
                        height={22}
                    />

                    <span>
                        Sign in with Bluesky
                    </span>
                </button>
            </div>

            <SignInModal
                isOpen={isModalOpen}
                onClose={() => {
                    console.log("Closing modal");
                    setIsModalOpen(false);
                }}
            />
        </>
    );
}

// "use client";

// import Image from "next/image";
// import { useState } from "react";
// import SignInModal from "./SignInModal";

// type SignInProps = {
//     onSignIn: (handle: string) => void;
// };

// export default function SignIn({ onSignIn }: SignInProps) {
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     function handleSignIn(handle: string) {
        
//         onSignIn(handle);
//         setIsModalOpen(false);
//     }

//     return (
//         <div className="flex justify-center ">
//             <button
//                 type="button"
//                 onClick={() => setIsModalOpen(true)}
//                 className="
//                     inline-flex items-center gap-3
//                     rounded-full
//                     border border-gray-300
//                     bg-gray-200
//                     px-6 py-2 mt-1
//                     text-base font-semibold text-gray-800
//                     shadow-sm
//                     transition-all duration-200
//                     hover:-translate-y-0.5
//                     hover:shadow-md
//                     hover:bg-gray-300
//                     active:translate-y-0
//                 "
//             >
//                 <Image
//                     src="/bluesky.svg"
//                     alt=""
//                     width={22}
//                     height={22}
//                 />

//                 <span>Sign in with Bluesky</span>
//             </button>
//             <SignInModal
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}

//             />
//         </div>
//     );
// }