import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"

export default function TasksPage() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">My Tasks</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Hi, {user?.username}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              Log Out
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">Tasks coming in Phase 3 & 4.</p>
      </div>
    </div>
  )
}
