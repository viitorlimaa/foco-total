"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Task } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateTaskMutation } from "@/hooks/tasks";
import { toast } from "@/hooks/use-toast";

interface EditTaskFormProps {
  task: Task;
  onClose: () => void;
}

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
}

export function EditTaskForm({ task, onClose }: EditTaskFormProps) {
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

  const updateTaskMutation = useUpdateTaskMutation();

  const onSubmit = async (data: TaskFormData) => {
    updateTaskMutation.mutate(
      {
        id: task.id,
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err) => {
          toast({
              title: 'Erro ao editar tarefa',
              description: err.message,
              variant: "destructive",
            });
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-2">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          {...register("title", {
            required: "Título é obrigatório",
            minLength: { value: 3, message: "O título deve ter pelo menos 3 letras" }
          })}
        />
        {errors.title && (
          <p className="text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          rows={3}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Data de vencimento</Label>
        <Input
          id="dueDate"
          type="date"
          {...register("dueDate", {
            validate: (value) => {
            if (!value) return true;
            const selectedDate = new Date(value + "T23:59:59").getTime();
            const today = new Date().getTime();
            return selectedDate > today || "A data não pode ser no passado";
            }
          })}
        />
        {errors.dueDate && (
          <p className="text-xs text-red-500">{errors.dueDate.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={updateTaskMutation.isPending}>
        {updateTaskMutation.isPending ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </form>
  );
}
