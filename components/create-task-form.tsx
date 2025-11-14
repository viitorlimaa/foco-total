"use client";

import type React from "react";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { createTaskAction } from "@/lib/tasks-hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CreateTaskFormProps {
  onTaskCreated?: () => void;
}

export function CreateTaskForm({ onTaskCreated }: CreateTaskFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Validação específica para a data
    if (name === "dueDate") {
      // se estiver vazio → limpa campo
      if (!value) {
        setFormData((prev) => ({ ...prev, dueDate: "" }));
        return;
      }

      // testa validade do formato
      const parsed = new Date(value);

      if (isNaN(parsed.getTime())) {
        // evita datas inválidas digitadas manualmente
        setError("Insira uma data válida (AAAA-MM-DD)");
        return;
      }

      // Ano razoável (108 anos para frente e para trás)
      const year = parsed.getUTCFullYear();
      if (year < 1900 || year > 2100) {
        setError("Ano deve estar entre 1900 e 2100");
        return;
      }

      // Se passou em tudo: aceita a data
      setError("");
      setFormData((prev) => ({ ...prev, dueDate: value }));
      return;
    }

    // Para os demais campos
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      await createTaskAction(
        user.id,
        formData.title,
        formData.description,
        formData.dueDate
      );

      setFormData({ title: "", description: "", dueDate: "" });
      setSuccess(true);
      onTaskCreated?.();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Erro ao criar tarefa");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Tarefa</CardTitle>
        <CardDescription>
          Crie uma nova tarefa para gerenciar suas atividades
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              name="title"
              placeholder="Exemplo: Estudar React"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Descreva sua tarefa..."
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Data de Vencimento</Label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              max="2100-12-31"
              min="1900-01-01"
            />
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-500/10 text-green-600 text-sm rounded-md">
              Tarefa criada com sucesso!
            </div>
          )}

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Criando..." : "Criar Tarefa"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
