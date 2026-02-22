import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal("backlog"), v.literal("in_progress"), v.literal("done")),
    assignee: v.union(v.literal("nick"), v.literal("fox")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  calendarEntries: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(
      v.literal("cron"),
      v.literal("task"),
      v.literal("reminder"),
      v.literal("completed")
    ),
    scheduledAt: v.number(),
    completedAt: v.optional(v.number()),
    status: v.union(
      v.literal("upcoming"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
  }),
});
