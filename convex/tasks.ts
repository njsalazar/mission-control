import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getTasks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").order("desc").collect();
  },
});

export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    status: v.optional(v.union(v.literal("backlog"), v.literal("in_progress"), v.literal("done"))),
    assignee: v.optional(v.union(v.literal("nick"), v.literal("fox"))),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      status: args.status ?? "backlog",
      assignee: args.assignee ?? "nick",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateTask = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.union(v.literal("backlog"), v.literal("in_progress"), v.literal("done"))),
    assignee: v.optional(v.union(v.literal("nick"), v.literal("fox"))),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const filtered = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== undefined)
    );
    return await ctx.db.patch(id, { ...filtered, updatedAt: Date.now() });
  },
});

export const deleteTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
