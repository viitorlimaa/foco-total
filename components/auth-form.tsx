// components/AuthForm.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
  // Em signup o name será obrigatório — validação do front-end:
  name: z.string().min(1, "Nome obrigatório").optional(),
});

type FormData = z.infer<typeof schema>;

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const { login, signup } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError("");

    try {
      if (mode === "login") {
        await login(data.email, data.password);
      } else {
        // forçar validação do name aqui (no schema está optional para permitir render em login)
        if (!data.name) {
          setError("Nome obrigatório");
          return;
        }
        await signup(data.email, data.password, data.name);
      }

      router.push("/dashboard");
    } catch (err: any) {
      const message = err?.response?.data?.error ?? err?.message ?? "Erro desconhecido";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{mode === "login" ? "Entrar" : "Criar Conta"}</CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Faça login para acessar suas tarefas"
            : "Crie uma nova conta para começar"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" type="text" {...register("name")} />
              {formState.errors.name && (
                <span className="text-destructive text-sm">
                  {formState.errors.name.message}
                </span>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {formState.errors.email && (
              <span className="text-destructive text-sm">
                {formState.errors.email.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" {...register("password")} />
            {formState.errors.password && (
              <span className="text-destructive text-sm">
                {formState.errors.password.message}
              </span>
            )}
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processando..." : mode === "login" ? "Entrar" : "Criar Conta"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
