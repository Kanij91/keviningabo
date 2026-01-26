import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface CreateTicketProps {
  onSuccess?: () => void;
}

export function CreateTicket({ onSuccess }: CreateTicketProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [category, setCategory] = useState<
    "hardware" | "software" | "network" | "account" | "other"
  >("software");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUser = useQuery(api.users.getCurrentUser);
  const createTicket = useMutation(api.tickets.createTicket);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await createTicket({
        title: title.trim(),
        description: description.trim(),
        priority,
        category,
      });

      toast.success("Ticket created successfully!");

      setTitle("");
      setDescription("");
      setPriority("medium");
      setCategory("software");

      onSuccess?.();
    } catch (error) {
      toast.error("Failed to create ticket");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold text-secondary-900 mb-6">Create New Ticket</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-secondary-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            placeholder="Brief description of the issue"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-secondary-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="form-textarea"
            placeholder="Detailed description of the issue"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="priority" className="block text-sm font-semibold text-secondary-700 mb-2">
              Priority *
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as "low" | "medium" | "high" | "critical")
              }
              className="form-select"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-secondary-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value as "hardware" | "software" | "network" | "account" | "other"
                )
              }
              className="form-select"
            >
              <option value="hardware">Hardware</option>
              <option value="software">Software</option>
              <option value="network">Network</option>
              <option value="account">Account</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-border">
          <button
            type="reset"
            className="btn-secondary"
          >
            Clear
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? "Creating..." : "Create Ticket"}
          </button>
        </div>
      </form>
    </div>
  );
}
