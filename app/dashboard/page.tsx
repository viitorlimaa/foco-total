"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TaskHeader } from "@/components/task-header";
import { CreateTaskForm } from "@/components/create-task-form";
import { TaskList } from "@/components/task-list";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!user) return null;

  const handleTaskCreated = () => setRefreshTrigger((prev) => prev + 1);

  return (
    <div className="min-h-screen bg-background">
      <TaskHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Create task form */}
          <div className="lg:col-span-1">
            <CreateTaskForm onTaskCreated={handleTaskCreated} />
          </div>

          {/* Right column: Task list */}
          <div className="lg:col-span-2">
            <TaskList
              key={refreshTrigger}
              userId={user.id}
              showFilters={true}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
