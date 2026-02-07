import { Id } from "../../convex/_generated/dataModel";

export interface Ticket {
  _id: Id<"tickets">;
  _creationTime: number;
  title: string;
  description: string;
  status: "new" | "assigned" | "in-progress" | "on-hold" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  category: "hardware" | "software" | "network" | "account" | "other";
  requesterName: string;
  requesterEmail: string;
  assignedTechnician?: Id<"users">;
  assignedTechnicianName?: string; // This field might come from a join or custom query
  resolutionNotes?: string;
  lastUpdated: number;
}
