import { mutation, query} from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

export const createUserProfile = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    department: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("You must be logged in to create a profile.");
    }
    // Get the Convex Auth user by ID
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("Auth user not found.");
    }

    // Update that user with profile fields
    await ctx.db.patch(userId, {
      email: args.email,
      name: args.name ?? user.name ?? "New User",
      role: "end-user",
      department: args.department ?? "",
    });

    return userId;
  },
});


export const getAllTechnicians = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db.get(userId);
    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "technician")) {
      throw new Error("Unauthorized");
    }

    return await ctx.db
      .query("users")
      .filter((q) => q.or(q.eq(q.field("role"), "technician"), q.eq(q.field("role"), "admin")))
      .collect();
  },
});

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db.get(userId);
    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("Unauthorized - Admin access required");
    }

    return await ctx.db.query("users").collect();
  },
});

export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("technician"), v.literal("end-user")),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db.get(currentUserId);
    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("Unauthorized - Admin access required");
    }

    await ctx.db.patch(args.userId, { role: args.role });
    return args.userId;
  },
});
