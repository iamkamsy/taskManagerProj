import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getTasks, createTask, deleteTask } from "@/api/tasks"
import type { Task } from "@/types/task"

function sortByDeadline(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => a.deadline.localeCompare(b.deadline))
}

function formatDeadline(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number)
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

const EMPTY_FORM = { name: "", deadline: "", description: "" }

export default function TasksPage() {
  const { user, logout } = useAuth()

  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState("")

  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState("")

  // Load tasks on mount
  useEffect(() => {
    getTasks()
      .then((data) => setTasks(sortByDeadline(data)))
      .catch(() => setFetchError("Could not load tasks. Please refresh."))
      .finally(() => setLoading(false))
  }, [])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setFormError("")
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const { name, deadline, description } = form
    if (!name.trim() || !deadline || !description.trim()) {
      setFormError("All fields are required.")
      return
    }
    setSubmitting(true)
    setFormError("")
    try {
      const task = await createTask(name.trim(), deadline, description.trim())
      setTasks((prev) => sortByDeadline([...prev, task]))
      setForm(EMPTY_FORM)
      setShowForm(false)
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    setDeleteError("")
    try {
      await deleteTask(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } catch {
      setDeleteError("Could not delete that task. Please try again.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">My Tasks</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.username}
            </span>
            <Button variant="outline" size="sm" onClick={logout}>
              Log Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Add task button / form toggle */}
        {!showForm ? (
          <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
            + Add Task
          </Button>
        ) : (
          <form
            onSubmit={handleCreate}
            className="border border-border rounded-lg p-5 space-y-4 bg-card shadow-sm"
          >
            <h2 className="text-sm font-semibold text-foreground">New Task</h2>

            <div className="space-y-1.5">
              <Label htmlFor="name">Task name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Finish report"
                autoFocus
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="What needs to be done?"
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none transition-colors"
              />
            </div>

            {formError && (
              <p className="text-sm text-destructive">{formError}</p>
            )}

            <div className="flex gap-2 pt-1">
              <Button type="submit" disabled={submitting} size="sm">
                {submitting ? "Saving…" : "Save Task"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowForm(false)
                  setForm(EMPTY_FORM)
                  setFormError("")
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Task list */}
        {loading && (
          <p className="text-sm text-muted-foreground">Loading tasks…</p>
        )}

        {fetchError && (
          <p className="text-sm text-destructive">{fetchError}</p>
        )}

        {!loading && !fetchError && tasks.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No tasks yet. Add one above.
          </p>
        )}

        {deleteError && (
          <p className="text-sm text-destructive">{deleteError}</p>
        )}

        {!loading && tasks.length > 0 && (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="border border-border rounded-lg p-4 bg-card shadow-sm flex items-start justify-between gap-4"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="font-medium text-foreground line-clamp-2">
                    {task.name}
                  </p>
                  <p className="text-xs font-medium text-primary">
                    Due {formatDeadline(task.deadline)}
                  </p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {task.description}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 self-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  disabled={deletingId === task.id}
                  onClick={() => handleDelete(task.id)}
                  aria-label="Delete task"
                >
                  {deletingId === task.id ? "…" : "×"}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
