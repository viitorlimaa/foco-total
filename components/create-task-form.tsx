'use client';
import { useAuth } from "@/hooks/auth";
import { useCreateTaskMutation } from "@/hooks/tasks";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { TaskPayload } from "@/lib/types";


export function CreateTaskForm() {
  const { user } = useAuth();
  const { toast } = useToast();

  const{
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskPayload>({
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
    },
  });
 
  
  const createTaskMutation = useCreateTaskMutation();

  const onSubmit = (values: TaskPayload) => {
      if (!user) return;

      createTaskMutation.mutate(
        {
          ...values,
        },
        {
          onSuccess: () => {
            reset();
            toast({ title: 'Sucesso!', description: 'Tarefa criada.' });
          },
          onError: (error) => {
            toast({
              title: 'Erro ao criar tarefa',
              description: error.message,
              variant: "destructive",
            });
          },
        }
      );
    };
    return (
    <Card>
      <CardHeader>
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

          <Button type="submit" className="w-full cursor-pointer" disabled={createTaskMutation.isPending}>
            {createTaskMutation.isPending ? "Criando..." : "Criar Tarefa"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}