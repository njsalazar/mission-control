"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useState } from "react";

type Status = "backlog" | "in_progress" | "done";
type Assignee = "nick" | "fox";

const COLUMNS: { id: Status; label: string }[] = [
  { id: "backlog", label: "Backlog" },
  { id: "in_progress", label: "In Progress" },
  { id: "done", label: "Done" },
];

const STATUS_COLORS: Record<Status, string> = {
  backlog: "border-zinc-700",
  in_progress: "border-violet-500",
  done: "border-emerald-600",
};

const STATUS_HEADER: Record<Status, string> = {
  backlog: "text-zinc-400",
  in_progress: "text-violet-400",
  done: "text-emerald-400",
};

export default function TasksPage() {
  const tasks = useQuery(api.tasks.getTasks);
  const updateStatus = useMutation(api.tasks.updateTask);
  const createTask = useMutation(api.tasks.createTask);
  const deleteTask = useMutation(api.tasks.deleteTask);

  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newAssignee, setNewAssignee] = useState<Assignee>("nick");
  const [newStatus, setNewStatus] = useState<Status>("backlog");

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const taskId = result.draggableId as Id<"tasks">;
    const newSt = result.destination.droppableId as Status;
    await updateStatus({ id: taskId, status: newSt });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await createTask({
      title: newTitle.trim(),
      description: newDesc.trim() || undefined,
      assignee: newAssignee,
      status: newStatus,
    });
    setNewTitle(""); setNewDesc(""); setShowAdd(false);
  };

  if (!tasks) return (
    <div className="flex items-center justify-center h-64 text-zinc-500">Loading tasks…</div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">Tasks Board</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Add Task
        </button>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <form
            onSubmit={handleAdd}
            className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-md shadow-2xl"
          >
            <h2 className="text-lg font-semibold mb-4">New Task</h2>
            <input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Task title"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:border-violet-500"
            />
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Description (optional)"
              rows={2}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:border-violet-500 resize-none"
            />
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <label className="text-xs text-zinc-500 mb-1 block">Assignee</label>
                <select
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value as Assignee)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none"
                >
                  <option value="nick">👤 Nick</option>
                  <option value="fox">🦊 Fox</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs text-zinc-500 mb-1 block">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as Status)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none"
                >
                  <option value="backlog">Backlog</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);
            return (
              <div key={col.id} className={`bg-zinc-900 rounded-xl border ${STATUS_COLORS[col.id]} p-4`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`font-semibold text-sm uppercase tracking-wider ${STATUS_HEADER[col.id]}`}>
                    {col.label}
                  </h2>
                  <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
                    {colTasks.length}
                  </span>
                </div>
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[120px] rounded-lg transition-colors ${snapshot.isDraggingOver ? "bg-zinc-800/50" : ""}`}
                    >
                      {colTasks.map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-zinc-800 rounded-lg p-3 mb-2 border border-zinc-700 group ${snapshot.isDragging ? "shadow-2xl ring-1 ring-violet-500" : ""}`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-medium text-zinc-100 leading-snug">{task.title}</p>
                                <button
                                  onClick={() => deleteTask({ id: task._id })}
                                  className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 text-xs transition-opacity shrink-0"
                                >
                                  ✕
                                </button>
                              </div>
                              {task.description && (
                                <p className="text-xs text-zinc-500 mt-1">{task.description}</p>
                              )}
                              <div className="mt-2 text-xs text-zinc-500">
                                {task.assignee === "nick" ? "👤 Nick" : "🦊 Fox"}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
