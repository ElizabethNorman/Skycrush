export type ResultPerson = {
    did: string;
    name: string;
    handle: string;
    avatar: string;
    count: number;
};

type ResultsCardProps = {
    title: string;
    people: ResultPerson[];
};

export default function ResultsCard({
    title,
    people
}: ResultsCardProps) {
    return (
        <section className="w-full max-w-md border-2 border-neutral-900 bg-[#f8f3ee] text-neutral-900">
            <header className="border-b-2 border-neutral-900 px-5 py-3">
                <h2 className="font-serif text-2xl tracking-tight">
                    {title}
                </h2>
            </header>

            <ol>
                {people.map((person, index) => (
                    <li
                        key={person.did}
                        className="
            grid grid-cols-[2rem_3rem_1fr_auto]
            items-center gap-3
            border-b border-neutral-300
            px-5 py-4
            last:border-b-0
        "
                    >
                        <span className="font-mono text-sm text-neutral-500">
                            {String(index + 1).padStart(2, "0")}
                        </span>

                        {person.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <a href={`https://bsky.app/profile/${person.handle}`}
    target="_blank"
    rel="noopener noreferrer"
                            >
                                <img
                                    src={person.avatar}
                                    alt=""
                                    className="
                    h-11 w-11
                    rounded-full
                    border border-neutral-900
                    object-cover
                "
                                />
                            </a>

                        ) : (
                            <div
                                className="
                    flex h-11 w-11
                    items-center justify-center
                    rounded-full
                    border border-neutral-900
                    bg-neutral-200
                    font-serif
                "
                                aria-hidden="true"
                            >
                                {person.name.charAt(0).toUpperCase()}
                            </div>
                        )}

                        <div className="min-w-0">
                            <p className="truncate font-medium">
                                {person.name}
                            </p>

                            <p className="truncate font-mono text-xs text-neutral-500">
                                @{person.handle}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="font-serif text-xl">
                                {person.count}
                            </p>

                            <p className="font-mono text-[10px] uppercase tracking-wide text-neutral-500">
                                likes
                            </p>
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
}