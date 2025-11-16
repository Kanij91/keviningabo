import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export const applicationTables = {
  // Users table with role-based access
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
role: v.optional(
  v.union(
    v.literal("admin"),
    v.literal("technician"),
    v.literal("end-user")
  )
),

    department: v.optional(v.string()),
  }).index("by_email", ["email"]),

  // Tickets (Incidents) table
  tickets: defineTable({
    title: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("new"),
      v.literal("assigned"),
      v.literal("in-progress"),
      v.literal("on-hold"),
      v.literal("resolved"),
      v.literal("closed")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical")
    ),
    requesterName: v.string(),
    requesterEmail: v.string(),
    assignedTechnician: v.optional(v.id("users")),
    category: v.union(
      v.literal("hardware"),
      v.literal("software"),
      v.literal("network"),
      v.literal("account"),
      v.literal("other")
    ),
    resolutionNotes: v.optional(v.string()),
    lastUpdated: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_priority", ["priority"])
    .index("by_requester_email", ["requesterEmail"])
    .index("by_assigned_technician", ["assignedTechnician"])
    .index("by_category", ["category"])
    .searchIndex("search_tickets", {
      searchField: "title",
      filterFields: ["status", "priority", "category"],
    }),

  // Knowledge Base Articles
  knowledgeBase: defineTable({
    title: v.string(),
    content: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    authorId: v.id("users"),
    lastUpdated: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_author", ["authorId"])
    .searchIndex("search_kb", {
      searchField: "title",
      filterFields: ["category"],
    }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
