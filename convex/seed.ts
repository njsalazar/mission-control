import { mutation } from "./_generated/server";

export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const day = 86400000;

    // Seed tasks
    await ctx.db.insert("tasks", {
      title: "Set up Mission Control",
      description: "Build and configure the Mission Control dashboard",
      status: "done",
      assignee: "fox",
      createdAt: now - day * 2,
      updatedAt: now - day,
    });
    await ctx.db.insert("tasks", {
      title: "Install recommended Mac apps",
      description: "Rectangle, Alfred, AppCleaner, IINA",
      status: "in_progress",
      assignee: "nick",
      createdAt: now - day,
      updatedAt: now,
    });
    await ctx.db.insert("tasks", {
      title: "Configure Telegram bot",
      description: "Pair MissToast_Bot with OpenClaw",
      status: "done",
      assignee: "fox",
      createdAt: now - day,
      updatedAt: now,
    });
    await ctx.db.insert("tasks", {
      title: "Set up GitHub integration",
      description: "Connect gh CLI for PR and issue tracking",
      status: "backlog",
      assignee: "fox",
      createdAt: now,
      updatedAt: now,
    });

    // Seed calendar entries
    await ctx.db.insert("calendarEntries", {
      title: "Daily memory maintenance",
      description: "Review and update memory files",
      type: "cron",
      scheduledAt: now + day,
      status: "upcoming",
    });
    await ctx.db.insert("calendarEntries", {
      title: "Initial setup session",
      description: "First contact with Nick, bootstrapped identity as Fox",
      type: "completed",
      scheduledAt: now - day * 2,
      completedAt: now - day * 2,
      status: "completed",
    });
    await ctx.db.insert("calendarEntries", {
      title: "Telegram pairing",
      description: "Paired MissToast_Bot with Nick's Telegram account",
      type: "completed",
      scheduledAt: now - day,
      completedAt: now - day,
      status: "completed",
    });
    await ctx.db.insert("calendarEntries", {
      title: "Mission Control build",
      description: "Built this dashboard — Tasks + Calendar",
      type: "completed",
      scheduledAt: now,
      completedAt: now,
      status: "completed",
    });

    return "Seeded!";
  },
});
