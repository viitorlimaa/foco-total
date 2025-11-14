"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { createTaskAction } from "@/lib/tasks-hooks"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { set } from "date-fns"

interface CreateTaskFormProps {
  onTaskCreated?: () => void
}

interface TaskFormData {
  title: string
  description: string
  dueDate: string
}

export function CreateTaskForm({ onTaskCreated }: CreateTaskFormProps) {
  const { user } = useAuth()

  const [apiError, setApiError] = useState("")
  const [success, setSucess] = useState(false)
  
  const{
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>()

  const onSubmit = async (data: TaskFormData) => {
    if (!user) return
    
    setApiError("")
    setSucess(false)

    try {
      await createTaskAction(
        user.id,
        data.title,
        data.description,
        data.dueDate
      )

      setSucess(true)
      reset()
      onTaskCreated?.()

      setTimeout(() => setSucess(false), 3000)

    } catch (err: any) {
      setApiError(err.message || "Erro ao criar tarefa")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Tarefa</CardTitle>
        <CardDescription>Crie uma nova tarefa para gerenciar suas atividades</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Exemplo: Estudar React"
              {...register("title", {
                required: "Título é obrigatório",
                minLength: { value: 3, message: "O título deve ter pelo menos 3 letras" }
              })}
            />
            {errors.title &&(
              <span className="text-xs text-red-500">{errors.title.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva sua tarefa..."
              rows={3}
              {...register("description")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Data de Vencimento</Label>
            <Input
              id="dueDate"
              type="date"
              {...register("dueDate", {
                validate: (value) => {
                if (!value) return true;
                const selectedDate = new Date(value + "T23:59:59").getTime();
                const today = new Date().getTime();
                return selectedDate > today || "A data não pode ser no passado";
                }
              })}
              
            />

            {errors.dueDate && (
              <span className="text-xs text-red-500">{errors.dueDate.message}</span>
            )}
          </div>

          {apiError && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">{apiError}</div>
          )}

          {success && (
            <div className="p-3 bg-green-500/10 text-green-600 text-sm rounded-md">Tarefa criada com sucesso!</div>
          )}

          <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
            {isSubmitting ? "Criando..." : "Criar Tarefa"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
