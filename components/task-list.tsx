'use client';

import { useGetTasks } from '@/hooks/tasks';
import { LoadingSpinner } from './loading-spinner';
import { EmptyState } from './empty-state';
import { TaskItem } from './task-item'; 
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Task } from '@/lib/types';
import { Card, CardContent } from './ui/card';
import { SearchInput } from './ui/textinput';

type FilterType = "all" | "pending" | "completed";

export function TaskList() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const showFilters = true;

  const {
    data: tasks,
    isLoading,
    isError,
    error,
  } = useGetTasks();

  useEffect(() => {
    if (!tasks) return;

    let filtered = tasks;

    if (search.length >= 3) {
      const s = search.toLowerCase();
      filtered = filtered.filter((task: Task) =>
        task.title.toLowerCase().includes(s)
      );
    }

    if (filter !== "all") {
      filtered = filtered.filter((task: Task) => task.status === filter);
    }

    setFilteredTasks(filtered);
  }, [tasks, search, filter]);

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

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex gap-2 justify-center items-end flex-wrap sm:flex-nowrap">
          <SearchInput
            onChange={setSearch}
            value={search}
            placeholder="Buscar tarefas..."
          />
          {(["all", "pending", "completed"] as const).map((type) => (
            <Button
              key={type}
              variant={filter === type ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(type)}
              className="cursor-pointer"
            >
              {type === "all"
                ? `Todas (${tasks.filter((t: Task) => t.title.toLowerCase().includes(search.toLowerCase())).length})`
                : type === "pending"
                ? `Pendentes (${
                    tasks.filter((t: Task) => t.status === "pending" && t.title.toLowerCase().includes(search.toLowerCase())).length
                  })`
                : `Concluídas (${
                    tasks.filter((t: Task) => t.status === "completed" && t.title.toLowerCase().includes(search.toLowerCase())).length
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