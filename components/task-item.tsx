'use client';

import { useState } from 'react';
import type { Task } from '@/lib/types'; 
import { useUpdateTaskMutation, useDeleteTaskMutation } from '@/lib/tasks-hooks';
import { useToast } from '@/hooks/use-toast';
import { StatusBadge } from './status-badge';
import { LoadingSpinner } from './loading-spinner'; 

export function TaskItem({ task }: { task: Task }) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);

  const updateTaskMutation = useUpdateTaskMutation();

  const handleSave = () => {
    updateTaskMutation.mutate(
      {
        // Integrar react-hook-form, então passar os valores corretos aqui
      },
      {
        onSuccess: () => {
          toast({ title: 'Tarefa atualizada!' });
          setIsEditing(false);
        },
        onError: (err) => {
          toast({ title: 'Erro ao atualizar', description: err.message, variant: 'destructive' });
        },
      }
    );
  };

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


  const isProcessing = updateTaskMutation.isPending || deleteTaskMutation.isPending;

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow rounded-lg">
      {isProcessing ? (
        <LoadingSpinner />
      ) : isEditing ? (
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          onBlur={handleSave} 
          autoFocus
          className="flex-grow p-1 border rounded"
        />
      ) : (
        // --- Modo de Visualização ---
        <div className="flex-grow">
          <span className="font-medium">{task.title}</span>
      
        </div>
      )}

      <div className="flex items-center gap-3 ml-4">
        <StatusBadge status={task.status} />
        
        {isEditing ? (
          <>
            <button onClick={handleSave} className="text-green-600">Salvar</button>
            <button onClick={() => setIsEditing(false)} className="text-gray-500">Cancelar</button>
          </>
        ) : (
          <>
            <button 
              onClick={() => setIsEditing(true)} 
              disabled={isProcessing}
              className="text-blue-600 disabled:text-gray-400"
            >
              Editar
            </button>
            <button 
              onClick={handleDelete} 
              disabled={isProcessing}
              className="text-red-600 disabled:text-gray-400"
            >
              Deletar
            </button>
          </>
        )}
      </div>
    </div>
  );
}