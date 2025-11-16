import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const createArticle = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db.get(userId);
    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "technician")) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.insert("knowledgeBase", {
      title: args.title,
      content: args.content,
      category: args.category,
      tags: args.tags,
      authorId: userId,
      lastUpdated: Date.now(),
    });
  },
});

export const getAllArticles = query({
  args: {},
  handler: async (ctx) => {
    const articles = await ctx.db.query("knowledgeBase").order("desc").collect();
    
    // Get author details for each article
    const articlesWithAuthors = await Promise.all(
      articles.map(async (article) => {
        const author = await ctx.db.get(article.authorId);
        return {
          ...article,
          authorName: author?.name || "Unknown",
        };
      })
    );

    return articlesWithAuthors;
  },
});

export const searchArticles = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const articles = await ctx.db
      .query("knowledgeBase")
      .withSearchIndex("search_kb", (q) => q.search("title", args.searchTerm))
      .collect();

    // Get author details for each article
    const articlesWithAuthors = await Promise.all(
      articles.map(async (article) => {
        const author = await ctx.db.get(article.authorId);
        return {
          ...article,
          authorName: author?.name || "Unknown",
        };
      })
    );

    return articlesWithAuthors;
  },
});

export const updateArticle = mutation({
  args: {
    articleId: v.id("knowledgeBase"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db.get(userId);
    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "technician")) {
      throw new Error("Unauthorized");
    }

    const updateData: any = {
      lastUpdated: Date.now(),
    };

    if (args.title !== undefined) updateData.title = args.title;
    if (args.content !== undefined) updateData.content = args.content;
    if (args.category !== undefined) updateData.category = args.category;
    if (args.tags !== undefined) updateData.tags = args.tags;

    await ctx.db.patch(args.articleId, updateData);
    return args.articleId;
  },
});

export const deleteArticle = mutation({
  args: { articleId: v.id("knowledgeBase") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db.get(userId);
    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "technician")) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.articleId);
    return args.articleId;
  },
});

export const getArticlesByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const articles = await ctx.db
      .query("knowledgeBase")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .order("desc")
      .collect();

    // Get author details for each article
    const articlesWithAuthors = await Promise.all(
      articles.map(async (article) => {
        const author = await ctx.db.get(article.authorId);
        return {
          ...article,
          authorName: author?.name || "Unknown",
        };
      })
    );

    return articlesWithAuthors;
  },
});
