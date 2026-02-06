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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleViewChange = (view: View) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  const NavButton = ({ view, label }: { view: View; label: string }) => (
    <button
      onClick={() => handleViewChange(view)}
      className={`w-full text-left px-4 py-3 md:py-2.5 rounded-container transition-colors font-medium text-base md:text-sm ${
        currentView === view
          ? "bg-primary-50 text-primary border-l-4 border-primary"
          : "text-secondary-700 hover:bg-secondary-50"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background relative">
      {/* Mobile Menu Toggle */}
      <div className="md:hidden bg-background-secondary border-b border-border p-4 flex justify-between items-center sticky top-0 z-20">
        <span className="font-semibold text-secondary-900">Menu</span>
        <button
          onClick={toggleMobileMenu}
          className="p-2 text-secondary-700 hover:bg-secondary-100 rounded-md"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } md:block absolute md:relative top-14 md:top-0 left-0 right-0 z-10 w-full md:w-64 bg-background-secondary border-b md:border-b-0 md:border-r border-border shadow-sm min-h-[calc(100vh-3.5rem)] md:min-h-screen`}
      >
        <nav className="mt-0 md:mt-6 p-4 md:p-0">
          <div className="md:px-4 space-y-1">
            <NavButton view="dashboard" label="Dashboard" />
            <NavButton view="tickets" label={isEndUser ? "My Tickets" : "All Tickets"} />
            <NavButton view="create-ticket" label="Create Ticket" />
            <NavButton view="knowledge-base" label="Knowledge Base" />

            {isAdmin && (
              <>
                <NavButton view="users" label="User Management" />
                <NavButton view="stats" label="Reports & Stats" />
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 min-w-0 overflow-auto p-4 md:p-8 ${isMobileMenuOpen ? 'hidden md:block' : 'block'}`}>
        {renderContent()}
      </div>
    </div>
  );
}
