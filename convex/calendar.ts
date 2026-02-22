import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getEntries = query({
  args: {
    month: v.optional(v.number()),
    year: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("calendarEntries").order("asc").collect();
    if (args.month === undefined || args.year === undefined) return all;
    return all.filter((e) => {
      const d = new Date(e.scheduledAt);
      return d.getMonth() === args.month && d.getFullYear() === args.year;
    });
  },
});

export const getEntriesForDate = query({
  args: { date: v.string() }, // YYYY-MM-DD
  handler: async (ctx, args) => {
    const all = await ctx.db.query("calendarEntries").order("asc").collect();
    return all.filter((e) => {
      const d = new Date(e.scheduledAt);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      return dateStr === args.date;
    });
  },
});

export const getUpcoming = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const now = Date.now();
    const all = await ctx.db.query("calendarEntries").order("asc").collect();
    const upcoming = all.filter((e) => e.scheduledAt >= now && e.status === "upcoming");
    return upcoming.slice(0, args.limit ?? 10);
  },
});

export const createEntry = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal("cron"), v.literal("task"), v.literal("reminder"), v.literal("completed")),
    scheduledAt: v.number(),
    status: v.optional(v.union(v.literal("upcoming"), v.literal("completed"), v.literal("cancelled"))),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("calendarEntries", {
      title: args.title,
      description: args.description,
      type: args.type,
      scheduledAt: args.scheduledAt,
      status: args.status ?? "upcoming",
    });
  },
});

export const updateEntry = mutation({
  args: {
    id: v.id("calendarEntries"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.optional(v.union(v.literal("cron"), v.literal("task"), v.literal("reminder"), v.literal("completed"))),
    scheduledAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    status: v.optional(v.union(v.literal("upcoming"), v.literal("completed"), v.literal("cancelled"))),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const filtered = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== undefined)
    );
    return await ctx.db.patch(id, filtered);
  },
});

export const getCalendarDots = query({
  args: { month: v.number(), year: v.number() },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("calendarEntries").collect();
    const dots: Record<string, number> = {};
    all.forEach((e) => {
      const d = new Date(e.scheduledAt);
      if (d.getMonth() === args.month && d.getFullYear() === args.year) {
        const key = String(d.getDate());
        dots[key] = (dots[key] ?? 0) + 1;
      }
    });
    return dots;
  },
});
