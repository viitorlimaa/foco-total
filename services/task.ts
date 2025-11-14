import type { Task, TaskPayload } from "@/lib/types";
import axios from "axios";

export const getTasks = () => 
    axios.get<Task[]>("/api/tasks/");

export const createTask =  (taskInput: TaskPayload) => 
    axios.post<Task>('/api/tasks', taskInput);

export const updateTask = (task : Partial<Task>) => 
    axios.patch<Task>(`/api/tasks/${task.id}`, task);

export const deleteTask = (taskId: string) => 
  axios.delete<any>(`/api/tasks/${taskId}`);