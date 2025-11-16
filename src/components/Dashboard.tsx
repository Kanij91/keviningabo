import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { TicketList } from "./TicketList";
import { CreateTicket } from "./CreateTicket";
import { KnowledgeBase } from "./KnowledgeBase";
import { UserManagement } from "./UserManagement";
import { Stats } from "./Stats";

type View = "dashboard" | "tickets" | "create-ticket" | "knowledge-base" | "users" | "stats";

export function Dashboard() {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const currentUser = useQuery(api.users.getCurrentUser);
  const myTickets = useQuery(api.tickets.getMyTickets);
  const ticketStats = useQuery(api.tickets.getTicketStats);

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isAdmin = currentUser.role === "admin";
  const isTechnician = currentUser.role === "technician" || isAdmin;
  const isEndUser = currentUser.role === "end-user";

  const renderContent = () => {
    switch (currentView) {
      case "tickets":
        return <TicketList />;
      case "create-ticket":
        return <CreateTicket onSuccess={() => setCurrentView("tickets")} />;
      case "knowledge-base":
        return <KnowledgeBase />;
      case "users":
        return isAdmin ? <UserManagement /> : <div>Unauthorized</div>;
      case "stats":
        return isAdmin ? <Stats /> : <div>Unauthorized</div>;
      default:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome, {currentUser.name}!
              </h2>
              <p className="text-gray-600 mb-4">
                Role: <span className="font-medium capitalize">{currentUser.role}</span>
                {currentUser.department && (
                  <span> | Department: <span className="font-medium">{currentUser.department}</span></span>
                )}
              </p>
            </div>

            {/* Quick Stats */}
            {(isTechnician || isAdmin) && ticketStats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold text-gray-900">New Tickets</h3>
                  <p className="text-3xl font-bold text-red-600">{ticketStats.new}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold text-gray-900">In Progress</h3>
                  <p className="text-3xl font-bold text-yellow-600">{ticketStats.inProgress}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold text-gray-900">Resolved</h3>
                  <p className="text-3xl font-bold text-green-600">{ticketStats.resolved}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold text-gray-900">Total</h3>
                  <p className="text-3xl font-bold text-blue-600">{ticketStats.total}</p>
                </div>
              </div>
            )}

            {/* My Tickets */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {isEndUser ? "My Submitted Tickets" : "My Assigned Tickets"}
              </h3>
              {myTickets && myTickets.length > 0 ? (
                <div className="space-y-3">
                  {myTickets.slice(0, 5).map((ticket) => (
                    <div key={ticket._id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{ticket.title}</h4>
                          <p className="text-sm text-gray-600">
                            Status: <span className="capitalize">{ticket.status}</span> | 
                            Priority: <span className="capitalize">{ticket.priority}</span>
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(ticket._creationTime).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {myTickets.length > 5 && (
                    <button
                      onClick={() => setCurrentView("tickets")}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View all tickets →
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">No tickets found.</p>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            <button
              onClick={() => setCurrentView("dashboard")}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                currentView === "dashboard"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Dashboard
            </button>
            
            <button
              onClick={() => setCurrentView("tickets")}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                currentView === "tickets"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {isEndUser ? "My Tickets" : "All Tickets"}
            </button>

            <button
              onClick={() => setCurrentView("create-ticket")}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                currentView === "create-ticket"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Create Ticket
            </button>

            <button
              onClick={() => setCurrentView("knowledge-base")}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                currentView === "knowledge-base"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Knowledge Base
            </button>

            {isAdmin && (
              <>
                <button
                  onClick={() => setCurrentView("users")}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    currentView === "users"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  User Management
                </button>

                <button
                  onClick={() => setCurrentView("stats")}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    currentView === "stats"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Reports & Stats
                </button>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {renderContent()}
      </div>
    </div>
  );
}
