"use client"
import { useAuth } from "@/hooks/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { TaskHeader } from "@/components/task-header"
import { CreateTaskForm } from "@/components/create-task-form"
import { TaskList } from "@/components/task-list"

export default function DashboardPage() {
  const { user,  isLoading } = useAuth()
  const router = useRouter()

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

  return (
    <div className="min-h-screen bg-background">
      <TaskHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <CreateTaskForm />
          </div>

          <div className="lg:col-span-2">
            <TaskList />
          </div>
        </div>
      </main>
    </div>
  )
}
