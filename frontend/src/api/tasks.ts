import type { Task } from "@/types/task"

export async function getTasks(): Promise<Task[]> {
  const res = await fetch("/api/tasks", { credentials: "include" })
  if (!res.ok) throw new Error("Failed to load tasks.")
  return res.json()
}

export async function createTask(
  name: string,
  deadline: string,
  description: string
): Promise<Task> {
  const res = await fetch("/api/tasks", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, deadline, description }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Failed to create task.")
  return data
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || "Failed to delete task.")
  }
}
