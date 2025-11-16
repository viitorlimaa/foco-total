"use client"
import { useState } from "react"
import { Play } from "lucide-react"



interface PomodoroConfigProps {
    startCustomPomodoro: (config: {
        focusMinutes: number
        breakMinutes: number
        cycles: number
    }) => void
}
export function PomodoroConfig({ startCustomPomodoro }: PomodoroConfigProps) {
    const [focus, setFocus] = useState(25)
    const [rest, setRest] = useState(5)
    const [cycles, setCycles] = useState(4)

    const start = () => {
        startCustomPomodoro({
            focusMinutes: focus,
            breakMinutes: rest,
            cycles: cycles
        })
    }

    return (
        <div className="flex flex-col gap-4">
            <label className="font-medium">Tempo de foco (minutos)</label>
            <input
                type="number"
                className="border p-2 rounded-lg"
                min={1}
                value={focus}
                onChange={(e) => setFocus(Number(e.target.value))}
            />

            <label className="font-medium">Tempo de descanso (minutos)</label>
            <input
                type="number"
                min={1}
                className="border p-2 rounded-lg"
                value={rest}
                onChange={(e) => setRest(Number(e.target.value))}
            />
            <label className="font-medium">Quantidade de ciclos</label>
            <input
                type="number"
                min={1}
                className="border p-2 rounded-lg"
                value={cycles}
                onChange={(e) => setCycles(Number(e.target.value))}
            />
            
            <button
                onClick={start}
                className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600"
            >
                Iniciar Pomodoro
            </button>
        </div>
    )
}
