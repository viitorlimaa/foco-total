"use client";

import type { Task } from "@/lib/types";
import {
  useTasks,
  updateTaskAction,
  deleteTaskAction,
} from "@/lib/tasks-hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Trash2, Check } from "lucide-react";

interface TaskListProps {
  userId: string;
  status?: "pending" | "completed" | "all";
  showFilters?: boolean;
}

type FilterType = "all" | "pending" | "completed";

export function TaskList({
  userId,
  status,
  showFilters = true,
}: TaskListProps) {
  const { tasks: tasksData, isLoading, mutate } = useTasks(userId, status);

  // Garante que tasks seja sempre um array
  const tasks: Task[] = Array.isArray(tasksData) ? tasksData : [];

  const [filter, setFilter] = useState<FilterType>("all");

  const filteredTasks: Task[] =
    filter === "all" ? tasks : tasks.filter((t: Task) => t.status === filter);

  const handleToggleStatus = async (task: Task): Promise<void> => {
    try {
      await updateTaskAction(task.id, {
        status: task.status === "pending" ? "completed" : "pending",
      });
      mutate();
    } catch (error: unknown) {
      console.error(
        "Erro ao atualizar tarefa:",
        error instanceof Error ? error.message : error
      );
    }
  };

  const handleDelete = async (taskId: string): Promise<void> => {
    const confirmed = window.confirm(
      "Tem certeza que deseja deletar esta tarefa?"
    );
    if (!confirmed) return;

    try {
      await deleteTaskAction(taskId);
      mutate();
    } catch (error: unknown) {
      console.error(
        "Erro ao deletar tarefa:",
        error instanceof Error ? error.message : error
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-muted-foreground">Carregando tarefas...</div>
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center text-muted-foreground">
            <p>Nenhuma tarefa encontrada</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex gap-2">
          {(["all", "pending", "completed"] as const).map((type) => (
            <Button
              key={type}
              variant={filter === type ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(type)}
            >
              {type === "all"
                ? `Todas (${tasks.length})`
                : type === "pending"
                ? `Pendentes (${
                    tasks.filter((t) => t.status === "pending").length
                  })`
                : `Concluídas (${
                    tasks.filter((t) => t.status === "completed").length
                  })`}
            </Button>
          ))}
        </div>
      )}

      <div className="grid gap-3">
        {filteredTasks.map((task: Task) => (
          <Card
            key={task.id}
            className={task.status === "completed" ? "opacity-60" : ""}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(task)}
                      className="h-6 w-6 p-0 cursor-pointer"
                      aria-label="Alterar status"
                    >
                      {task.status === "completed" ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <div className="h-4 w-4 border-2 border-muted-foreground rounded" />
                      )}
                    </Button>
                    <h3
                      className={`font-semibold text-lg ${
                        task.status === "completed"
                          ? "line-through text-muted-foreground"
                          : ""
                      }`}
                    >
                      {task.title}
                    </h3>
                    <Badge
                      variant={
                        task.status === "completed" ? "secondary" : "default"
                      }
                    >
                      {task.status === "pending" ? "Pendente" : "Concluída"}
                    </Badge>
                  </div>

                  {task.description && (
                    <p className="text-sm text-muted-foreground ml-9">
                      {task.description}
                    </p>
                  )}

                  <div className="flex gap-4 ml-9 text-xs text-muted-foreground">
                    {task.dueDate && (
                      <span>
                        Vencimento:{" "}
                        {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                      </span>
                    )}
                    <span>
                      Criada em:{" "}
                      {new Date(task.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(task.id)}
                  className="text-destructive hover:bg-destructive/10 cursor-pointer"
                  aria-label="Deletar tarefa"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
