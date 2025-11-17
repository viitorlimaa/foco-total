import type { Metadata } from "next"
import { AuthForm } from "@/components/auth-form"
import { ThemeToggle } from "@/components/theme-toggle"

export const metadata: Metadata = {
  title: "Login - Foco Total",
  description: "Faça login em sua conta Foco Total",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-card p-4">
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Foco Total</h1>
          <p className="text-muted-foreground">Gerenciamento de Tarefas Inteligente</p>
        </div>
        <AuthForm mode="login" />
      </div>
    </div>
  )
}
