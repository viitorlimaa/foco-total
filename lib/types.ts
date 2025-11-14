// lib/types.ts
export interface User {
  id: string;
  email: string;
  name: string;
  password?: string; // só retorna quando necessário
  createdAt: Date;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  status: "pending" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}
