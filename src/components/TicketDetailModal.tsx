import { useState, useEffect, ChangeEvent } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { Ticket } from "../lib/types";

interface Technician {
  _id: Id<"users">;
  name?: string;
  role?: string;
}

interface TicketDetailModalProps {
  ticket: Ticket;
  technicians?: Technician[];
  isEndUser: boolean;
  onClose: () => void;
  onUpdate: (ticketId: Id<"tickets">, updates: any) => Promise<void>;
}

export function TicketDetailModal({
  ticket,
  technicians,
  isEndUser,
  onClose,
  onUpdate
}: TicketDetailModalProps) {
  const [status, setStatus] = useState(ticket.status);
  const [priority, setPriority] = useState(ticket.priority);
  const [assignedTechnician, setAssignedTechnician] = useState<string>(ticket.assignedTechnician || "");
  const [resolutionNotes, setResolutionNotes] = useState(ticket.resolutionNotes || "");

  // Reset state when ticket changes
  useEffect(() => {
    setStatus(ticket.status);
    setPriority(ticket.priority);
    setAssignedTechnician(ticket.assignedTechnician || "");
    setResolutionNotes(ticket.resolutionNotes || "");
  }, [ticket]);

  const handleUpdate = async () => {
    const updates: any = {};
    if (status !== ticket.status) updates.status = status;
    if (priority !== ticket.priority) updates.priority = priority;

    // Only include assignedTechnician if it changed
    // If assignedTechnician is empty string, we might want to send undefined or handle unassign logic
    // But based on original code: assignedTechnician: e.target.value || undefined
    const newTech = assignedTechnician || undefined;
    if (newTech !== ticket.assignedTechnician) {
      updates.assignedTechnician = newTech;
    }

    if (resolutionNotes !== ticket.resolutionNotes) updates.resolutionNotes = resolutionNotes;

    try {
      await onUpdate(ticket._id, updates);
      onClose();
    } catch (error) {
      // Error is handled in the parent component (toast displayed)
      // We catch it here to prevent the modal from closing and to avoid unhandled promise rejection
    }
  };

  const handleTechnicianChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newTechId = e.target.value;
    setAssignedTechnician(newTechId);
    if (newTechId && status !== "assigned" && status !== "resolved" && status !== "closed") {
      setStatus("assigned");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="card max-w-2xl w-full max-h-screen overflow-y-auto shadow-lg flex flex-col">
        <div className="p-6 pb-0">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-semibold text-secondary-900">Ticket Details</h3>
            <button
              onClick={onClose}
              className="text-secondary-400 hover:text-secondary-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 pt-0 overflow-y-auto flex-1">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-secondary-700 mb-1">Title</label>
              <p className="text-secondary-900">{ticket.title}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-secondary-700 mb-1">Description</label>
              <p className="text-secondary-900 whitespace-pre-wrap bg-secondary-50 p-3 rounded-container">{ticket.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">Status</label>
                {!isEndUser ? (
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="form-select"
                  >
                    <option value="new">New</option>
                    <option value="assigned">Assigned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="on-hold">On Hold</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                ) : (
                  <p className="text-secondary-900 capitalize font-medium">{status.replace("-", " ")}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">Priority</label>
                {!isEndUser ? (
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="form-select"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                ) : (
                  <p className="text-secondary-900 capitalize font-medium">{priority}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-1">Category</label>
                <p className="text-secondary-900 capitalize font-medium">{ticket.category}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-1">Requester</label>
                <p className="text-secondary-900 font-medium">{ticket.requesterName}</p>
                <p className="text-sm text-secondary-600">{ticket.requesterEmail}</p>
              </div>
            </div>

            {!isEndUser && (
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">Assign Technician</label>
                <select
                  value={assignedTechnician}
                  onChange={handleTechnicianChange}
                  className="form-select"
                >
                  <option value="">Unassigned</option>
                  {technicians?.map((tech) => (
                    <option key={tech._id} value={tech._id}>
                      {tech.name || "Unknown"} ({tech.role || "Unknown"})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {!isEndUser && (
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">Resolution Notes</label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  rows={4}
                  className="form-textarea"
                  placeholder="Add resolution notes..."
                />
              </div>
            )}

            {isEndUser && ticket.resolutionNotes && (
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-1">Resolution Notes</label>
                <p className="text-secondary-900 whitespace-pre-wrap bg-secondary-50 p-3 rounded-container">{ticket.resolutionNotes}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm text-secondary-600 pt-4 border-t border-border">
              <div>
                <label className="block font-semibold text-secondary-700 mb-1">Created</label>
                <p>{new Date(ticket._creationTime).toLocaleString()}</p>
              </div>
              <div>
                <label className="block font-semibold text-secondary-700 mb-1">Last Updated</label>
                <p>{new Date(ticket.lastUpdated).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border bg-gray-50 flex justify-end gap-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-secondary-700 bg-white border border-secondary-300 rounded-md hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          {!isEndUser && (
            <button
              onClick={handleUpdate}
              className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Update Ticket
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
