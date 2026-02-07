import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { Ticket } from "../lib/types";

export function TicketList() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const currentUser = useQuery(api.users.getCurrentUser);

  const isEndUser = currentUser?.role === "end-user";

  const myTickets = useQuery(
    api.tickets.getMyTickets,
    currentUser ? {} : "skip"
  );

  const allTickets = useQuery(
    api.tickets.getAllTickets,
    !isEndUser ? {} : "skip"
  );

  const technicians = useQuery(
    api.users.getAllTechnicians,
    !isEndUser ? {} : "skip"
  );

  const updateTicket = useMutation(api.tickets.updateTicket);

  
  const tickets = isEndUser ? myTickets : allTickets;

  const filteredTickets = useMemo(() => {
    return tickets?.filter((ticket) => {
      const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    }) || [];
  }, [tickets, searchTerm, statusFilter, priorityFilter]);

  const handleUpdateTicket = async (ticketId: Id<"tickets">, updates: any) => {
    try {
      await updateTicket({ ticketId, ...updates });
      toast.success("Ticket updated successfully");
      setSelectedTicket(null);
    } catch (error) {
      toast.error("Failed to update ticket");
      console.error(error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "text-red-800 bg-red-50 border-red-200";
      case "high": return "text-orange-800 bg-orange-50 border-orange-200";
      case "medium": return "text-amber-800 bg-amber-50 border-amber-200";
      case "low": return "text-emerald-800 bg-emerald-50 border-emerald-200";
      default: return "text-secondary-600 bg-secondary-100 border-secondary-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "text-primary bg-primary-50 border-primary-200";
      case "assigned": return "text-purple-800 bg-purple-50 border-purple-200";
      case "in-progress": return "text-amber-800 bg-amber-50 border-amber-200";
      case "on-hold": return "text-orange-800 bg-orange-50 border-orange-200";
      case "resolved": return "text-emerald-800 bg-emerald-50 border-emerald-200";
      case "closed": return "text-secondary-600 bg-secondary-100 border-secondary-200";
      default: return "text-secondary-600 bg-secondary-100 border-secondary-200";
    }
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="card">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-6">
          {isEndUser ? "My Tickets" : "All Tickets"}
        </h2>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-secondary-700 mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tickets..."
              className="form-input"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-secondary-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="on-hold">On Hold</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-secondary-700 mb-2">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="form-select"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                  Requester
                </th>
                {!isEndUser && (
                  <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                    Assigned To
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-background-secondary divide-y divide-border">
              {filteredTickets.map((ticket) => (
                <tr key={ticket._id} className="hover:bg-secondary-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-secondary-900">{ticket.title}</div>
                    <div className="text-sm text-secondary-600 truncate max-w-xs">
                      {ticket.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge-status ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge-status ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 capitalize font-medium">
                    {ticket.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-secondary-900 font-medium">{ticket.requesterName}</div>
                    <div className="text-sm text-secondary-600">{ticket.requesterEmail}</div>
                  </td>
                  {!isEndUser && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 font-medium">
                      {ticket.assignedTechnicianName || "Unassigned"}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                    {new Date(ticket._creationTime).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                    <button
                      onClick={() => setSelectedTicket(ticket)}
                      className="text-primary hover:text-primary-hover transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTickets.length === 0 && (
          <div className="text-center py-8">
            <p className="text-secondary-600">No tickets found.</p>
          </div>
        )}
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-2xl w-full max-h-screen overflow-y-auto shadow-lg">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold text-secondary-900">Ticket Details</h3>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-secondary-400 hover:text-secondary-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-1">Title</label>
                  <p className="text-secondary-900">{selectedTicket.title}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-1">Description</label>
                  <p className="text-secondary-900 whitespace-pre-wrap bg-secondary-50 p-3 rounded-container">{selectedTicket.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-2">Status</label>
                    {!isEndUser ? (
                      <select
                        value={selectedTicket.status}
                        onChange={(e) => handleUpdateTicket(selectedTicket._id, { status: e.target.value })}
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
                      <p className="text-secondary-900 capitalize font-medium">{selectedTicket.status.replace("-", " ")}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-2">Priority</label>
                    {!isEndUser ? (
                      <select
                        value={selectedTicket.priority}
                        onChange={(e) => handleUpdateTicket(selectedTicket._id, { priority: e.target.value })}
                        className="form-select"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    ) : (
                      <p className="text-secondary-900 capitalize font-medium">{selectedTicket.priority}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-1">Category</label>
                    <p className="text-secondary-900 capitalize font-medium">{selectedTicket.category}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-1">Requester</label>
                    <p className="text-secondary-900 font-medium">{selectedTicket.requesterName}</p>
                    <p className="text-sm text-secondary-600">{selectedTicket.requesterEmail}</p>
                  </div>
                </div>

                {!isEndUser && (
                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-2">Assign Technician</label>
                    <select
                      value={selectedTicket.assignedTechnician || ""}
                      onChange={(e) => handleUpdateTicket(selectedTicket._id, { 
                        assignedTechnician: e.target.value || undefined,
                        status: e.target.value ? "assigned" : selectedTicket.status
                      })}
                      className="form-select"
                    >
                      <option value="">Unassigned</option>
                      {technicians?.map((tech) => (
                        <option key={tech._id} value={tech._id}>
                          {tech.name} ({tech.role})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {!isEndUser && (
                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-2">Resolution Notes</label>
                    <textarea
                      value={selectedTicket.resolutionNotes || ""}
                      onChange={(e) => handleUpdateTicket(selectedTicket._id, { resolutionNotes: e.target.value })}
                      rows={4}
                      className="form-textarea"
                      placeholder="Add resolution notes..."
                    />
                  </div>
                )}

                {isEndUser && selectedTicket.resolutionNotes && (
                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-1">Resolution Notes</label>
                    <p className="text-secondary-900 whitespace-pre-wrap bg-secondary-50 p-3 rounded-container">{selectedTicket.resolutionNotes}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm text-secondary-600 pt-4 border-t border-border">
                  <div>
                    <label className="block font-semibold text-secondary-700 mb-1">Created</label>
                    <p>{new Date(selectedTicket._creationTime).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block font-semibold text-secondary-700 mb-1">Last Updated</label>
                    <p>{new Date(selectedTicket.lastUpdated).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
