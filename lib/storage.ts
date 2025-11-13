// localStorage utilities for data persistence
import type { User, Task } from "./types"

const USERS_KEY = "foco-total-users"
const TASKS_KEY = "foco-total-tasks"
const AUTH_KEY = "foco-total-auth"

// Hash password (basic - for demo only)
function hashPassword(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

export function initializeStorage() {
  if (typeof window === "undefined") return

  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify([]))
  }
  if (!localStorage.getItem(TASKS_KEY)) {
    localStorage.setItem(TASKS_KEY, JSON.stringify([]))
  }
}

export function getAllUsers(): User[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(USERS_KEY)
  return data ? JSON.parse(data) : []
}

export function getUserByEmail(email: string): User | null {
  const users = getAllUsers()
  return users.find((u) => u.email === email) || null
}

export function createUser(email: string, password: string, name: string): User {
  const users = getAllUsers()

  const newUser: User = {
    id: `user-${Date.now()}`,
    email,
    name,
    createdAt: new Date().toISOString(),
  }

  users.push({ ...newUser, password: hashPassword(password) })
  localStorage.setItem(USERS_KEY, JSON.stringify(users))

  return newUser
}

export function verifyPassword(email: string, password: string): boolean {
  if (typeof window === "undefined") return false
  const users = getAllUsers()
  const user = users.find((u) => u.email === email)
  return user ? (user as any).password === hashPassword(password) : false
}

export function getCurrentAuth(): User | null {
  if (typeof window === "undefined") return null
  const auth = localStorage.getItem(AUTH_KEY)
  return auth ? JSON.parse(auth) : null
}

export function setCurrentAuth(user: User | null): void {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(AUTH_KEY)
  }
}

export function getAllTasks(): Task[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(TASKS_KEY)
  return data ? JSON.parse(data) : []
}

export function getUserTasks(userId: string): Task[] {
  return getAllTasks().filter((task) => task.userId === userId)
}

export function createTask(userId: string, title: string, description: string, dueDate: string): Task {
  const tasks = getAllTasks()

  const newTask: Task = {
    id: `task-${Date.now()}`,
    userId,
    title,
    description,
    dueDate,
    status: "pending",
    createdAt: new Date().toISOString(),
  }

  tasks.push(newTask)
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))

  return newTask
}

export function updateTask(taskId: string, updates: Partial<Task>): Task | null {
  const tasks = getAllTasks()
  const index = tasks.findIndex((t) => t.id === taskId)

  if (index === -1) return null

  tasks[index] = { ...tasks[index], ...updates }
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))

  return tasks[index]
}

export function deleteTask(taskId: string): boolean {
  const tasks = getAllTasks()
  const filtered = tasks.filter((t) => t.id !== taskId)

  if (filtered.length === tasks.length) return false

  localStorage.setItem(TASKS_KEY, JSON.stringify(filtered))
  return true
}