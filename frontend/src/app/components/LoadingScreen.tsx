import { Zap } from "lucide-react";

interface LoadingScreenProps {
    message?: string;
}

export default function LoadingScreen({ message = "Securing connection..." }: LoadingScreenProps) {
    return (
        <div className="fixed inset-0 z-[9998] bg-black flex flex-col items-center justify-center">
            {/* THOR Wordmark */}
            <div className="flex items-center gap-2 mb-8">
                <Zap className="w-6 h-6 text-yellow-400" fill="currentColor" />
                <span className="text-2xl font-black text-white tracking-tight">THOR</span>
            </div>

            {/* Equalizer Bars */}
            <div className="flex items-end gap-1.5 h-8">
                <div className="thor-bar" />
                <div className="thor-bar" />
                <div className="thor-bar" />
            </div>

            {/* Status Text */}
            <p className="text-zinc-500 text-sm mt-6 tracking-widest uppercase">
                {message}
            </p>
        </div>
    );
}
