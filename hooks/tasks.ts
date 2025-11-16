"use client";
import { useQuery, useMutation } from '@tanstack/react-query';
import { createTask, deleteTask, getTasks, updateTask } from '@/services/task';
import { queryClient } from '@/utils/QueryClient';

export const QueryKeys = {
  all: ["tasks"] as const,
  item: (task_id: string) => [...QueryKeys.all, task_id] as const,
};

export const useGetTasks = () => {
  return useQuery({
    queryKey: QueryKeys.all,
    queryFn: async () => (await getTasks()).data,
  });
};

export const useCreateTaskMutation = () => {
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: QueryKeys.all});
    },
  });
};

export const useUpdateTaskMutation = () => {
  return useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.all });
    },
  });
};

export const useDeleteTaskMutation = () => {
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.all });
    },
  });
};