"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card">
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center gap-8 text-center">
        <div>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Foco Total
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Gerenciamento de Tarefas Inteligente e Eficiente
          </p>
          <p className="text-base text-muted-foreground max-w-2xl">
            Organize suas tarefas, acompanhe o progresso e alcance seus
            objetivos com o Foco Total. Uma ferramenta simples, poderosa e
            intuitiva para aumentar sua produtividade.
          </p>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/login">
            <Button size="lg" className="cursor-pointer">
              Entrar
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              size="lg"
              variant="outline"
              className="cursor-pointer bg-transparent"
            >
              Criar Conta
            </Button>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="p-6 rounded-lg bg-card border border-border">
            <h3 className="font-semibold text-lg mb-2">Simples e Intuitivo</h3>
            <p className="text-sm text-muted-foreground">
              Interface limpa e fácil de usar, sem complicações.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border">
            <h3 className="font-semibold text-lg mb-2">Tarefas Organizadas</h3>
            <p className="text-sm text-muted-foreground">
              Crie, organize e acompanhe suas tarefas em um único lugar.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border">
            <h3 className="font-semibold text-lg mb-2">Sempre Sincronizado</h3>
            <p className="text-sm text-muted-foreground">
              Seus dados estão sempre sincronizados e seguros.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
