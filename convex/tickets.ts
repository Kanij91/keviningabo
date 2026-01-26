import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const createTicket = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical")
    ),
    category: v.union(
      v.literal("hardware"),
      v.literal("software"),
      v.literal("network"),
      v.literal("account"),
      v.literal("other")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    // Ensure the user has an email before using it as a required string
    if (!user.email) {
      throw new Error("User has no email; cannot create ticket");
    }

    return await ctx.db.insert("tickets", {
      title: args.title,
      description: args.description,
      priority: args.priority,
      category: args.category,
      status: "new",

      // ALWAYS take requester from logged-in user
      requesterName: user.name ?? "Unknown",
      requesterEmail: user.email,

      assignedTechnician: undefined,
      lastUpdated: Date.now(),
    });
  },
});

export const getAllTickets = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db.get(userId);
    if (
      !currentUser ||
      (currentUser.role !== "admin" && currentUser.role !== "technician")
    ) {
      throw new Error("Unauthorized");
    }

    const tickets = await ctx.db.query("tickets").order("desc").collect();

    // Get assigned technician details for each ticket
    const ticketsWithTechnicians = await Promise.all(
      tickets.map(async (ticket) => {
        let assignedTechnicianName: string | null = null;
        if (ticket.assignedTechnician) {
          const technician = await ctx.db.get(ticket.assignedTechnician);
          assignedTechnicianName = technician?.name || null;
        }
        return {
          ...ticket,
          assignedTechnicianName,
        };
      })
    );

    return ticketsWithTechnicians;
  },
});

export const getMyTickets = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db.get(userId);
    if (!currentUser) {
      throw new Error("User not found");
    }

    if (currentUser.role === "end-user") {  
      if (!currentUser.email) {
        throw new Error("User has no email; cannot fetch their tickets");
      }

      // End users see only their submitted tickets
      return await ctx.db
        .query("tickets")
        .withIndex("by_requester_email", (q) =>
          q.eq("requesterEmail", currentUser.email as string)
        )
        .order("desc")
        .collect();
    } else {
      // Technicians and admins see tickets assigned to them
      return await ctx.db
        .query("tickets")
        .withIndex("by_assigned_technician", (q) =>
          q.eq("assignedTechnician", userId)
        )
        .order("desc")
        .collect();
    }
  },
});

export const getTicketsByRequesterEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tickets")
      .withIndex("by_requester_email", (q) =>
        q.eq("requesterEmail", args.email)
      )
      .order("desc")
      .collect();
  },
});

export const updateTicket = mutation({
  args: {
    ticketId: v.id("tickets"),
    status: v.optional(
      v.union(
        v.literal("new"),
        v.literal("assigned"),
        v.literal("in-progress"),
        v.literal("on-hold"),
        v.literal("resolved"),
        v.literal("closed")
      )
    ),
    assignedTechnician: v.optional(v.id("users")),
    resolutionNotes: v.optional(v.string()),
    priority: v.optional(
      v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high"),
        v.literal("critical")
      )
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db.get(userId);
    if (
      !currentUser ||
      (currentUser.role !== "admin" && currentUser.role !== "technician")
    ) {
      throw new Error("Unauthorized");
    }

    const updateData: any = {
      lastUpdated: Date.now(),
    };

    if (args.status !== undefined) updateData.status = args.status;
    if (args.assignedTechnician !== undefined)
      updateData.assignedTechnician = args.assignedTechnician;
    if (args.resolutionNotes !== undefined)
      updateData.resolutionNotes = args.resolutionNotes;
    if (args.priority !== undefined) updateData.priority = args.priority;

    await ctx.db.patch(args.ticketId, updateData);
    return args.ticketId;
  },
});

export const searchTickets = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db.get(userId);
    if (
      !currentUser ||
      (currentUser.role !== "admin" && currentUser.role !== "technician")
    ) {
      throw new Error("Unauthorized");
    }

    return await ctx.db
      .query("tickets")
      .withSearchIndex("search_tickets", (q) =>
        q.search("title", args.searchTerm)
      )
      .collect();
  },
});

export const getTicketStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db.get(userId);
    if (
      !currentUser ||
      (currentUser.role !== "admin" && currentUser.role !== "technician")
    ) {
      throw new Error("Unauthorized");
    }

    const allTickets = await ctx.db.query("tickets").collect();

    const stats = {
      total: allTickets.length,
      new: allTickets.filter((t) => t.status === "new").length,
      assigned: allTickets.filter((t) => t.status === "assigned").length,
      inProgress: allTickets.filter((t) => t.status === "in-progress").length,
      resolved: allTickets.filter((t) => t.status === "resolved").length,
      closed: allTickets.filter((t) => t.status === "closed").length,
      byCategory: {
        hardware: allTickets.filter((t) => t.category === "hardware").length,
        software: allTickets.filter((t) => t.category === "software").length,
        network: allTickets.filter((t) => t.category === "network").length,
        account: allTickets.filter((t) => t.category === "account").length,
        other: allTickets.filter((t) => t.category === "other").length,
      },
      byPriority: {
        low: allTickets.filter((t) => t.priority === "low").length,
        medium: allTickets.filter((t) => t.priority === "medium").length,
        high: allTickets.filter((t) => t.priority === "high").length,
        critical: allTickets.filter((t) => t.priority === "critical").length,
      },
    };

    return stats;
  },
});