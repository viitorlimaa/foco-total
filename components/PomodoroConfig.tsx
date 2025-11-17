"use client"
import { useState } from "react"
import { Play } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";



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
        <Card>
            <CardHeader>
                <CardDescription>Crie uma nova tarefa para gerenciar suas atividades</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="space-y-2 m-2">
            <label className="font-medium">Tempo de foco (minutos)</label>
            <input
                type="number"
                className="border p-2 rounded-lg"
                min={1}
                value={focus}
                onChange={(e) => setFocus(Number(e.target.value))}
            />
            </div>
            <div className="space-y-2 m-2">
            <label className="font-medium">Tempo de descanso (minutos)</label>
            <input
                type="number"
                min={1}
                className="border p-2 rounded-lg"
                value={rest}
                onChange={(e) => setRest(Number(e.target.value))}
            />
            </div>
            <div className="space-y-2 m-2">
            <label className="font-medium">Quantidade de ciclos</label>
            <input
                type="number"
                min={1}
                className="border p-2 rounded-lg"
                value={cycles}
                onChange={(e) => setCycles(Number(e.target.value))}
            />
            </div>
            
            <Button
            onClick={start}
                        className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 w-full cursor-pointer m-2" >
                Iniciar Pomodoro
            </Button>
            </CardContent>
            </Card>
        </div>
    )
}
