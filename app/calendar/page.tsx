"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

type EntryType = "cron" | "task" | "reminder" | "completed";
type EntryStatus = "upcoming" | "completed" | "cancelled";

const TYPE_COLORS: Record<EntryType, string> = {
  cron: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  task: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  reminder: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  completed: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

const TYPE_LABELS: Record<EntryType, string> = {
  cron: "⚙️ Cron",
  task: "📋 Task",
  reminder: "🔔 Reminder",
  completed: "✅ Done",
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function CalendarPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const dots = useQuery(api.calendar.getCalendarDots, { month, year });
  const upcoming = useQuery(api.calendar.getUpcoming, { limit: 8 });
  const selectedEntries = useQuery(
    api.calendar.getEntriesForDate,
    selectedDate ? { date: selectedDate } : "skip"
  );
  const createEntry = useMutation(api.calendar.createEntry);

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState<EntryType>("task");
  const [newDate, setNewDate] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
  );
  const [newTime, setNewTime] = useState("09:00");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const scheduledAt = new Date(`${newDate}T${newTime}`).getTime();
    await createEntry({
      title: newTitle.trim(),
      description: newDesc.trim() || undefined,
      type: newType,
      scheduledAt,
      status: newType === "completed" ? "completed" : "upcoming",
    });
    setNewTitle(""); setNewDesc(""); setShowAdd(false);
  };

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const toDateStr = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">Fox&apos;s Calendar</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Add Entry
        </button>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <form
            onSubmit={handleAdd}
            className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-md shadow-2xl"
          >
            <h2 className="text-lg font-semibold mb-4">New Calendar Entry</h2>
            <input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Entry title"
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
                <label className="text-xs text-zinc-500 mb-1 block">Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as EntryType)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none"
                >
                  <option value="cron">⚙️ Cron Job</option>
                  <option value="task">📋 Task</option>
                  <option value="reminder">🔔 Reminder</option>
                  <option value="completed">✅ Completed</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs text-zinc-500 mb-1 block">Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Time</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200">Cancel</button>
              <button type="submit" className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-medium">Add Entry</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="text-zinc-400 hover:text-zinc-100 px-2 py-1 rounded hover:bg-zinc-800">‹</button>
            <span className="font-semibold text-zinc-100">{MONTHS[month]} {year}</span>
            <button onClick={nextMonth} className="text-zinc-400 hover:text-zinc-100 px-2 py-1 rounded hover:bg-zinc-800">›</button>
          </div>
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs text-zinc-500 font-medium py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = toDateStr(day);
              const count = dots?.[String(day)] ?? 0;
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={`relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-colors
                    ${isSelected ? "bg-violet-600 text-white" : isToday ? "bg-zinc-800 text-violet-400 font-bold" : "hover:bg-zinc-800 text-zinc-300"}`}
                >
                  {day}
                  {count > 0 && (
                    <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-violet-400"}`} />
                  )}
                </button>
              );
            })}
          </div>

          {selectedDate && selectedEntries !== undefined && (
            <div className="mt-5 border-t border-zinc-800 pt-4">
              <h3 className="text-sm font-medium text-zinc-400 mb-3">{selectedDate}</h3>
              {selectedEntries.length === 0 ? (
                <p className="text-sm text-zinc-600">Nothing scheduled.</p>
              ) : (
                selectedEntries.map((e) => (
                  <div key={e._id} className="flex items-start gap-3 mb-3">
                    <span className={`text-xs px-2 py-0.5 rounded border ${TYPE_COLORS[e.type]}`}>
                      {TYPE_LABELS[e.type]}
                    </span>
                    <div>
                      <p className="text-sm text-zinc-100">{e.title}</p>
                      {e.description && <p className="text-xs text-zinc-500">{e.description}</p>}
                      <p className="text-xs text-zinc-600 mt-0.5">
                        {new Date(e.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Upcoming */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="font-semibold text-zinc-100 mb-4 text-sm uppercase tracking-wider text-violet-400">Upcoming</h2>
          {!upcoming ? (
            <p className="text-sm text-zinc-600">Loading…</p>
          ) : upcoming.length === 0 ? (
            <p className="text-sm text-zinc-600">Nothing scheduled yet.</p>
          ) : (
            upcoming.map((e) => (
              <div key={e._id} className="mb-4 pb-4 border-b border-zinc-800 last:border-0 last:mb-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded border ${TYPE_COLORS[e.type]}`}>
                    {TYPE_LABELS[e.type]}
                  </span>
                </div>
                <p className="text-sm text-zinc-100">{e.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {new Date(e.scheduledAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                  {" · "}
                  {new Date(e.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
