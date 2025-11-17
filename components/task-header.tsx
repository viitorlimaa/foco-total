"use client"

import { useAuth } from "@/hooks/auth"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"

export function TaskHeader() {
  const { user, logoutMutation } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.push("/login")
      },
    })
  }

  return (
    <header className="bg-blue-800 text-white shadow-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-2xl font-bold">
          Foco Total
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Bem-vindo, {user?.name}</span>
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="cursor-pointer transition-colors bg-transparent"
          >
            Sair
          </Button>
        </div>
      </div>
    </header>
  )
}
