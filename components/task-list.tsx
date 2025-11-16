'use client';

import { useGetTasks } from '@/hooks/tasks';
import { LoadingSpinner } from './loading-spinner';
import { EmptyState } from './empty-state';
import { TaskItem } from './task-item'; 
import { useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Task } from '@/lib/types';
import { Card, CardContent } from './ui/card';

type FilterType = "all" | "pending" | "completed";

export function TaskList() {
  const [filter, setFilter] = useState<FilterType>("all");
  const showFilters = true;

  const {
    data: tasks,
    isLoading,
    isError,
    error,
  } = useGetTasks();
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    console.error("Erro ao carregar tarefas:", error);
    return (
      <div className="text-red-500">
        Ops! Erro ao carregar tarefas: {error.message}
      </div>
    );
  }

  

  if (!tasks || tasks.length === 0) {
    return (
      <EmptyState
        title="Nenhuma tarefa encontrada"
        description="Comece criando sua primeira tarefa."
      />
    );
  }
  const filteredTasks = filter === "all" ? tasks : tasks?.filter((t: Task) => t.status === filter)

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
              className="cursor-pointer"
            >
              {type === "all"
                ? `Todas (${tasks.length})`
                : type === "pending"
                ? `Pendentes (${
                    tasks.filter((t: Task) => t.status === "pending").length
                  })`
                : `Concluídas (${
                    tasks.filter((t: Task) => t.status === "completed").length
                  })`}
            </Button>
          ))}
        </div>
      )}

      {filteredTasks.length === 0 && filter !== "all" ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center text-muted-foreground">
              <p>Nenhuma tarefa encontrada</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filteredTasks.map((task: Task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}