export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}


export interface TaskPayload {
  title: string
  description?: string
  dueDate: string
  status: "pending" | "completed"
}

export interface Task extends TaskPayload {
  id: string
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
}
