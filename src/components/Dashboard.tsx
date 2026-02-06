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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const currentUser = useQuery(api.users.getCurrentUser);
  const myTickets = currentUser ? useQuery(api.tickets.getMyTickets) : null;
  const ticketStats =
  currentUser && (currentUser.role === "admin" || currentUser.role === "technician")
    ? useQuery(api.tickets.getTicketStats)
    : null;

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isAdmin = currentUser.role === "admin";
  const isTechnician = currentUser.role === "technician" || isAdmin;
  const isEndUser = currentUser.role === "end-user";

  const handleNavClick = (view: View) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
  };

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
          <div className="space-y-section">
            <div className="card">
              <h2 className="mb-4">Welcome, {currentUser.name}!</h2>
              <p className="text-secondary-600 mb-4">
                Role: <span className="font-semibold capitalize">{currentUser.role}</span>
                {currentUser.department && (
                  <span> | Department: <span className="font-semibold">{currentUser.department}</span></span>
                )}
              </p>
            </div>

            {/* Quick Stats */}
            {(isTechnician || isAdmin) && ticketStats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card">
                  <h3 className="text-sm font-semibold text-secondary-700 mb-2">New Tickets</h3>
                  <p className="text-3xl font-bold text-primary">{ticketStats.new}</p>
                </div>
                <div className="card">
                  <h3 className="text-sm font-semibold text-secondary-700 mb-2">In Progress</h3>
                  <p className="text-3xl font-bold text-amber-800">{ticketStats.inProgress}</p>
                </div>
                <div className="card">
                  <h3 className="text-sm font-semibold text-secondary-700 mb-2">Resolved Tickets</h3>
                  <p className="text-3xl font-bold text-emerald-800">{ticketStats.resolved}</p>
                </div>
                <div className="card">
                  <h3 className="text-sm font-semibold text-secondary-700 mb-2">Total Tickets</h3>
                  <p className="text-3xl font-bold text-primary">{ticketStats.total}</p>
                </div>
              </div>
            )}

            {/* My Tickets */}
            <div className="card">
              <h3 className="mb-4">{isEndUser ? "My Submitted Tickets" : "My Assigned Tickets"}</h3>
              {myTickets && myTickets.length > 0 ? (
                <div className="space-y-3">
                  {myTickets.slice(0, 5).map((ticket) => (
                    <div key={ticket._id} className="border-l-4 border-primary pl-4 py-3 bg-secondary-50 rounded-r-container">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-secondary-900">{ticket.title}</h4>
                          <p className="text-sm text-secondary-600 mt-1">
                            Status: <span className="capitalize font-medium">{ticket.status}</span> | 
                            Priority: <span className="capitalize font-medium">{ticket.priority}</span>
                          </p>
                        </div>
                        <span className="text-xs text-secondary-500">
                          {new Date(ticket._creationTime).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {myTickets.length > 5 && (
                    <button
                      onClick={() => setCurrentView("tickets")}
                      className="text-primary hover:text-primary-hover text-sm font-semibold transition-colors"
                    >
                      View all tickets →
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-secondary-600">No tickets found.</p>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-background relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-background-secondary border-r border-border shadow-sm
        transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex justify-end p-4 md:hidden">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-secondary-500 hover:text-secondary-700"
            aria-label="Close sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="mt-2 md:mt-6">
          <div className="px-4 space-y-1">
            <button
              onClick={() => handleNavClick("dashboard")}
              className={`w-full text-left px-4 py-2.5 rounded-container transition-colors font-medium text-sm ${
                currentView === "dashboard"
                  ? "bg-primary-50 text-primary border-l-4 border-primary"
                  : "text-secondary-700 hover:bg-secondary-50"
              }`}
            >
              Dashboard
            </button>
            
            <button
              onClick={() => handleNavClick("tickets")}
              className={`w-full text-left px-4 py-2.5 rounded-container transition-colors font-medium text-sm ${
                currentView === "tickets"
                  ? "bg-primary-50 text-primary border-l-4 border-primary"
                  : "text-secondary-700 hover:bg-secondary-50"
              }`}
            >
              {isEndUser ? "My Tickets" : "All Tickets"}
            </button>

            <button
              onClick={() => handleNavClick("create-ticket")}
              className={`w-full text-left px-4 py-2.5 rounded-container transition-colors font-medium text-sm ${
                currentView === "create-ticket"
                  ? "bg-primary-50 text-primary border-l-4 border-primary"
                  : "text-secondary-700 hover:bg-secondary-50"
              }`}
            >
              Create Ticket
            </button>

            <button
              onClick={() => handleNavClick("knowledge-base")}
              className={`w-full text-left px-4 py-2.5 rounded-container transition-colors font-medium text-sm ${
                currentView === "knowledge-base"
                  ? "bg-primary-50 text-primary border-l-4 border-primary"
                  : "text-secondary-700 hover:bg-secondary-50"
              }`}
            >
              Knowledge Base
            </button>

            {isAdmin && (
              <>
                <button
                  onClick={() => handleNavClick("users")}
                  className={`w-full text-left px-4 py-2.5 rounded-container transition-colors font-medium text-sm ${
                    currentView === "users"
                      ? "bg-primary-50 text-primary border-l-4 border-primary"
                      : "text-secondary-700 hover:bg-secondary-50"
                  }`}
                >
                  User Management
                </button>

                <button
                  onClick={() => handleNavClick("stats")}
                  className={`w-full text-left px-4 py-2.5 rounded-container transition-colors font-medium text-sm ${
                    currentView === "stats"
                      ? "bg-primary-50 text-primary border-l-4 border-primary"
                      : "text-secondary-700 hover:bg-secondary-50"
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
      <div className="flex-1 min-w-0 overflow-auto p-4 md:p-8">
        <button
          className="md:hidden mb-4 text-primary hover:text-primary-hover"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        {renderContent()}
      </div>
    </div>
  );
}
