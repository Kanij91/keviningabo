import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function Stats() {
  const ticketStats = useQuery(api.tickets.getTicketStats);

  if (!ticketStats) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-section">
      <div className="card">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-6">Reports & Statistics</h2>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="card">
            <h3 className="text-sm font-semibold text-primary mb-2">Total Tickets</h3>
            <p className="text-2xl font-bold text-primary">{ticketStats.total}</p>
          </div>
          <div className="card bg-primary-50">
            <h3 className="text-sm font-semibold text-primary mb-2">New</h3>
            <p className="text-2xl font-bold text-primary">{ticketStats.new}</p>
          </div>
          <div className="card bg-purple-50">
            <h3 className="text-sm font-semibold text-purple-800 mb-2">Assigned</h3>
            <p className="text-2xl font-bold text-purple-900">{ticketStats.assigned}</p>
          </div>
          <div className="card bg-amber-50">
            <h3 className="text-sm font-semibold text-amber-800 mb-2">In Progress</h3>
            <p className="text-2xl font-bold text-amber-900">{ticketStats.inProgress}</p>
          </div>
          <div className="card bg-emerald-50">
            <h3 className="text-sm font-semibold text-emerald-800 mb-2">Resolved</h3>
            <p className="text-2xl font-bold text-emerald-900">{ticketStats.resolved}</p>
          </div>
          <div className="card bg-secondary-50">
            <h3 className="text-sm font-semibold text-secondary-700 mb-2">Closed</h3>
            <p className="text-2xl font-bold text-secondary-900">{ticketStats.closed}</p>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tickets by Category</h3>
            <div className="space-y-3">
              {Object.entries(ticketStats.byCategory).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-gray-700 capitalize">{category}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${ticketStats.total > 0 ? (count / ticketStats.total) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tickets by Priority</h3>
            <div className="space-y-3">
              {Object.entries(ticketStats.byPriority).map(([priority, count]) => {
                const getColor = (p: string) => {
                  switch (p) {
                    case "critical": return "bg-red-600";
                    case "high": return "bg-orange-600";
                    case "medium": return "bg-yellow-600";
                    case "low": return "bg-green-600";
                    default: return "bg-gray-600";
                  }
                };

                return (
                  <div key={priority} className="flex justify-between items-center">
                    <span className="text-gray-700 capitalize">{priority}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className={`${getColor(priority)} h-2 rounded-full`}
                          style={{
                            width: `${ticketStats.total > 0 ? (count / ticketStats.total) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-secondary-50">
            <h4 className="text-lg font-semibold text-secondary-900 mb-2">Resolution Rate</h4>
            <p className="text-3xl font-bold text-emerald-800">
              {ticketStats.total > 0 
                ? Math.round(((ticketStats.resolved + ticketStats.closed) / ticketStats.total) * 100)
                : 0}%
            </p>
            <p className="text-sm text-secondary-600 mt-1">
              {ticketStats.resolved + ticketStats.closed} of {ticketStats.total} tickets resolved
            </p>
          </div>

          <div className="card bg-secondary-50">
            <h4 className="text-lg font-semibold text-secondary-900 mb-2">Open Tickets</h4>
            <p className="text-3xl font-bold text-orange-800">
              {ticketStats.new + ticketStats.assigned + ticketStats.inProgress}
            </p>
            <p className="text-sm text-secondary-600 mt-1">
              Tickets requiring attention
            </p>
          </div>

          <div className="card bg-secondary-50">
            <h4 className="text-lg font-semibold text-secondary-900 mb-2">Critical Issues</h4>
            <p className="text-3xl font-bold text-red-800">
              {ticketStats.byPriority.critical}
            </p>
            <p className="text-sm text-secondary-600 mt-1">
              High priority tickets
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
