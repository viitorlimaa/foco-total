"use client"
import { useAuth } from "@/hooks/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { TaskHeader } from "@/components/task-header"
import { CreateTaskForm } from "@/components/create-task-form"
import { TaskList } from "@/components/task-list"
import { toast } from "sonner"
import { PomodoroConfig } from "@/components/PomodoroConfig"  
import { PomodoroBar } from "@/components/PomodoroBar"  
import { ChevronDown, ChevronUp } from "lucide-react"

export default function DashboardPage() {
  const { user,  isLoading } = useAuth()
  const router = useRouter()
  
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [open, setOpen] = useState<"task" | "pomodoro" | null>(null);
  const [pomodoro, setPomodoro] = useState({
    running: false,
    paused: false,
    mode: "idle", // idle | focus | break | finished
    remaining: 0,
    total: 0,
    focusMinutes: 25,
    breakMinutes: 5,
    cycles: 1,
    currentCycle: 1,
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }
  const handleTaskCreated = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const startCustomPomodoro = ({
    focusMinutes,
    breakMinutes,
    cycles,
  }: {
    focusMinutes: number
    breakMinutes: number
    cycles: number
  }) => {
    setPomodoro({
      running: true,
      paused: false,
      mode: "focus",
      remaining: focusMinutes * 60,
      total: focusMinutes * 60,
      focusMinutes,
      breakMinutes,
      cycles,
      currentCycle: 1,
    });

    toast("Pomodoro iniciado! 🔥", {
      description: `Foco de ${focusMinutes} minutos.`,
      action: {
        label: "Ok",
        onClick: () => console.log("Ok clicked"),
      },
    })
  }

  useEffect(() => {
    if (!pomodoro.running || pomodoro.paused) return;

    const interval = setInterval(() => {
      setPomodoro(prev => {
        if (prev.remaining <= 1) {

          if (prev.mode === "focus") {
            toast("Foco concluído!", {
              description: "☕ Descanso agora.",
              action: {
                label: "Ok",
                onClick: () => console.log("Ok clicked"),
              },
            })
            return {
              ...prev,
              mode: "break",
              remaining: prev.breakMinutes * 60,
              total: prev.breakMinutes * 60,
            };
          }

          if (prev.mode === "break") {
            if (prev.currentCycle >= prev.cycles) {
              toast("Pomodoro finalizado! 🎉", {
                description: "Parabéns!",
                action: {
                  label: "Ok",
                  onClick: () => console.log("Ok clicked"),
                },
              })
              return { ...prev, running: false, mode: "finished" };
            }

            toast("Descanso finalizado! 🔥", {
              description: `Iniciando ciclo ${prev.currentCycle + 1}.`,
              action: {
                label: "Ok",
                onClick: () => console.log("Ok clicked"),
              },
            })
            

            return {
              ...prev,
              mode: "focus",
              remaining: prev.focusMinutes * 60,
              total: prev.focusMinutes * 60,
              currentCycle: prev.currentCycle + 1,
            };
          }
        }

        return { ...prev, remaining: prev.remaining - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [pomodoro.running, pomodoro.paused, pomodoro.mode]);

  const pausePomodoro = () =>
    setPomodoro(prev => ({ ...prev, paused: !prev.paused }))

  const cancelPomodoro = () =>
    setPomodoro(prev => ({ ...prev, running: false }))

  return (
    <div className="min-h-screen bg-background">
      <TaskHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex flex-col gap-4">
            {/* DROPDOWN - NOVA TAREFA */}
            <div className="border rounded-xl  shadow-sm p-4">
              <button
                onClick={() => setOpen(open === "task" ? null : "task")}
                className="flex w-full justify-between items-center text-lg font-semibold"
              >
                Nova Tarefa
                {open === "task" ? <ChevronUp /> : <ChevronDown />}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${open === "task" ? "max-h-[1500px] mt-4" : "max-h-0"
                  }`}
              >
                <CreateTaskForm />
              </div>
            </div>
            {/* DROPDOWN - POMODORO */}
            <div className="border rounded-xl  shadow-sm p-4">
              <button
                onClick={() => setOpen(open === "pomodoro" ? null : "pomodoro")}
                className="flex w-full justify-between items-center text-lg font-semibold"
              >
                Pomodoro
                {open === "pomodoro" ? <ChevronUp /> : <ChevronDown />}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${open === "pomodoro" ? "max-h-[500px] mt-4" : "max-h-0"
                  }`}
              >
                <PomodoroConfig startCustomPomodoro={startCustomPomodoro} />
              </div>
            </div>

          </div>

          <div className="lg:col-span-2">
            {/* BARRA POMODORO */}
            {pomodoro.running && (
              <PomodoroBar
                running={pomodoro.running}
                paused={pomodoro.paused}
                remaining={pomodoro.remaining}
                total={pomodoro.total}
                onPause={pausePomodoro}
                onCancel={cancelPomodoro}
              />
            )}
            <TaskList />
          </div>
        </div>
      </main>
    </div>
  )
}
