"use client"

import { Pause, Play, X } from "lucide-react"

interface PomodoroBarProps {
    running: boolean
    paused: boolean
    remaining: number
    total: number
    onPause: () => void
    onCancel: () => void
}

export function PomodoroBar({
    running,
    paused,
    remaining,
    total,
    onPause,
    onCancel
}: PomodoroBarProps) {

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0")
        const s = Math.floor(seconds % 60).toString().padStart(2, "0")
        return `${m}:${s}`
    }

    const progress = (remaining / total) * 100

    return (
        <div className="w-full bg-orange-500 text-white p-4 rounded-lg shadow-md flex justify-between items-center mb-4">
            {/* Tempo */}
            <div className="text-xl font-semibold tracking-wider">
                {formatTime(remaining)}
            </div>

            {/* Barra de progresso */}
            <div className="flex-1 mx-4">
                <div className="w-full h-3 bg-orange-300/50 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white/80 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Ações */}
            <div className="flex gap-3">
                {/* Pause / Play */}
                <button
                    onClick={onPause}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
                >
                    {paused ? <Play size={20} /> : <Pause size={20} />}
                </button>

                {/* Cancel */}
                <button
                    onClick={onCancel}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    )
}
