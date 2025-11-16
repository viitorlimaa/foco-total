"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

interface AuthFormProps {
  mode: "login" | "signup";
}

interface FormData {
  email: string;
  password: string;
  name?: string;
}

export function AuthForm({ mode }: AuthFormProps) {
  const [globalError, setGlobalError] = useState("");

  const { login, signup } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setGlobalError("");

    try {
      if (mode === "login") {
        await login(data.email, data.password);
      } else {
        await signup(data.email, data.password, data.name || "");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setGlobalError(err.message || "Erro ao processar solicitação");
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
              <Input
                id="name"
                placeholder="Seu nome"
                {...register("name", {
                  required: mode === "signup" ? "O nome é obrigatório" : false,
                })}
              />
              {errors.name && (
                <span className="text-xs text-red-500">
                  {errors.name.message}
                </span>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register("email", {
                required: "O email é obrigatório",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email inválido",
                },
              })}
            />
            {errors.email && (
              <span className="text-xs text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password", {
                required: "A senha é obrigatória",
                minLength: {
                  value: 6,
                  message: "A senha deve ter no mínimo 6 caracteres",
                },
              })}
            />
            {errors.password && (
              <span className="text-xs text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>

          {globalError && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
              {globalError}
            </div>
          )}

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Processando..."
              : mode === "login"
              ? "Entrar"
              : "Criar Conta"}
          </Button>

          <div className="text-sm text-center text-muted-foreground">
            {mode === "login" ? (
              <>
                Não tem conta?{" "}
                <a
                  href="/signup"
                  className="text-primary hover:underline cursor-pointer"
                >
                  Criar conta
                </a>
              </>
            ) : (
              <>
                Já tem conta?{" "}
                <a
                  href="/login"
                  className="text-primary hover:underline cursor-pointer"
                >
                  Entrar
                </a>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
