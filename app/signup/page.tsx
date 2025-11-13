import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "Criar Conta - Foco Total",
  description: "Crie sua conta Foco Total",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-card p-4">
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Foco Total
          </h1>
          <p className="text-muted-foreground">
            Comece a gerenciar suas tarefas
          </p>
        </div>
        <AuthForm mode="signup" />
      </div>
    </div>
  );
}
