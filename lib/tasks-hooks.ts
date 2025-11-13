// Custom hooks for task management
"use client";

import useSWR from "swr";
import type { Task } from "./types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useTasks(userId: string | null, status?: string) {
  const query = new URLSearchParams();
  if (userId) query.append("userId", userId);
  if (status) query.append("status", status);

  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/api/tasks?${query.toString()}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    tasks: data || [],
    isLoading,
    error,
    mutate,
  };
}

export async function createTaskAction(
  userId: string,
  title: string,
  description: string,
  dueDate: string
) {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, title, description, dueDate }),
  });

  if (!res.ok) {
    throw new Error("Erro ao criar tarefa");
  }

  return res.json();
}

export async function updateTaskAction(taskId: string, updates: Partial<Task>) {
  const res = await fetch(`/api/tasks/${taskId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    throw new Error("Erro ao atualizar tarefa");
  }

  return res.json();
}

export async function deleteTaskAction(taskId: string) {
  const res = await fetch(`/api/tasks/${taskId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Erro ao deletar tarefa");
  }

  return res.json();
}
