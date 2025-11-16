'use client';

import { useState } from 'react';
import type { Task } from '@/lib/types'; 
import { useUpdateTaskMutation, useDeleteTaskMutation } from '@/hooks/tasks';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from './loading-spinner'; 
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Check, Trash2, Edit } from 'lucide-react';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { EditTaskForm } from './edit-task';

export function TaskItem({ task }: { task: Task }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const updateTaskMutation = useUpdateTaskMutation();

  const deleteTaskMutation = useDeleteTaskMutation();

  const handleDelete = () => {
   
    if (!window.confirm(`Tem certeza que deseja deletar a tarefa: "${task.title}"?`)) {
      return;
    }

    
    deleteTaskMutation.mutate(task.id, {
      onSuccess: () => {
        toast({ title: 'Tarefa deletada!', variant: 'destructive' });
      },
      onError: (err) => {
        toast({ title: 'Erro ao deletar', description: err.message, variant: 'destructive' });
      },
    });
  };

  const handleToggleStatus = () => {
    updateTaskMutation.mutate(
      {
        id: task.id,
        status: task.status === 'pending' ? 'completed' : 'pending',
      },
      {
        onSuccess: () => {
          toast({ title: 'Status da tarefa atualizado!' });
        },
        onError: (err) => {
          toast({ title: 'Erro ao atualizar status', description: err.message, variant: 'destructive' });
        },
      }
    );
  };


  const isProcessing = updateTaskMutation.isPending || deleteTaskMutation.isPending;

  return (
    <div>
      {isProcessing ? (
        <LoadingSpinner />
      ) : (
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
                    onClick={handleToggleStatus}
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
                      {
                        (() => {
                          const d = new Date(task.dueDate);
                          d.setDate(d.getDate() + 1);
                          return d.toLocaleDateString("pt-BR");
                        })()
                      }
                    </span>
                  )}
                  <span>
                    Criada em:{" "}
                    {new Date(task.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>

              <div>

                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setOpen(true)}
                    >
                      <Edit color='#0f64c5'/>
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Tarefa</DialogTitle>
                    </DialogHeader>

                    <EditTaskForm
                      task={task}
                      onClose={() => setOpen(false)}
                    />
                  </DialogContent>
                </Dialog>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="text-destructive hover:bg-destructive/10 cursor-pointer"
                  aria-label="Deletar tarefa"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}