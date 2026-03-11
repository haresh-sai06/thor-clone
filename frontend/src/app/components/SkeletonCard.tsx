interface SkeletonCardProps {
    variant?: "card" | "list-item" | "stat" | "message";
    count?: number;
}

function SkeletonItem({ variant = "card" }: { variant: string }) {
    if (variant === "stat") {
        return (
            <div className="rounded-xl p-5 border border-zinc-800 bg-zinc-900">
                <div className="skeleton h-8 w-20 mb-2" />
                <div className="skeleton h-4 w-24" />
            </div>
        );
    }

    if (variant === "list-item") {
        return (
            <div className="flex items-center gap-3 p-3">
                <div className="skeleton w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-3 w-1/2" />
                </div>
            </div>
        );
    }

    if (variant === "message") {
        return (
            <div className="flex gap-3 p-3">
                <div className="skeleton w-8 h-8 rounded-full flex-shrink-0" />
                <div className="space-y-2 flex-1">
                    <div className="skeleton h-4 w-2/3 rounded-2xl" />
                    <div className="skeleton h-4 w-1/2 rounded-2xl" />
                </div>
            </div>
        );
    }

    // Default: card
    return (
        <div className="rounded-2xl p-4 border border-zinc-800 bg-zinc-900 space-y-3">
            <div className="skeleton h-5 w-1/2" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-3 w-1/3 mt-4" />
        </div>
    );
}

export default function SkeletonCard({ variant = "card", count = 1 }: SkeletonCardProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonItem key={i} variant={variant} />
            ))}
        </>
    );
}
