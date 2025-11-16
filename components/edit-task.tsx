"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Task } from "@/lib/types";
import { updateTaskAction } from "@/lib/tasks-hooks";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EditTaskFormProps {
  task: Task;
  onClose: () => void;
  onUpdated: () => void;
}

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string; // input date precisa ser string
}

export function EditTaskForm({ task, onClose, onUpdated }: EditTaskFormProps) {
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    defaultValues: {
      title: task.title,
      description: task.description ?? "",
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : "",
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    setApiError("");

    try {
      await updateTaskAction(task.id, {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      });

      onUpdated();
      onClose();
    } catch (error: any) {
      setApiError(error.message || "Erro ao atualizar");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-2">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          {...register("title", {
            required: "Título é obrigatório",
            minLength: { value: 3, message: "Mínimo de 3 caracteres" },
          })}
        />
        {errors.title && (
          <p className="text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" rows={3} {...register("description")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Data de vencimento</Label>
        <Input id="dueDate" type="date" {...register("dueDate")} />
        {errors.dueDate && (
          <p className="text-xs text-red-500">{errors.dueDate.message}</p>
        )}
      </div>

      {apiError && (
        <p className="text-red-500 text-sm p-2 bg-red-100 rounded">
          {apiError}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </form>
  );
}
