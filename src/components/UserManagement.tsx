import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const allUsers = useQuery(api.users.getAllUsers);
  const updateUserRole = useMutation(api.users.updateUserRole);

  const filteredUsers = allUsers?.filter((user) => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  }) || [];

  const handleRoleChange = async (userId: string, newRole: "admin" | "technician" | "end-user") => {
    try {
      await updateUserRole({ userId: userId as any, role: newRole });
      toast.success("User role updated successfully");
    } catch (error) {
      toast.error("Failed to update user role");
      console.error(error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "text-red-800 bg-red-50 border-red-200";
      case "technician": return "text-primary bg-primary-50 border-primary-200";
      case "end-user": return "text-emerald-800 bg-emerald-50 border-emerald-200";
      default: return "text-secondary-600 bg-secondary-100 border-secondary-200";
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold text-secondary-900 mb-6">User Management</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-secondary-700 mb-2">Search Users</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="form-input"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-secondary-700 mb-2">Role</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="form-select"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="technician">Technician</option>
            <option value="end-user">End User</option>
          </select>
        </div>
      </div>

      {/* Users Table / Cards */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-secondary-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-background-secondary divide-y divide-border">
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-secondary-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-secondary-900">{user.name || "N/A"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-secondary-900">{user.email || "N/A"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`badge-status ${getRoleColor(user.role || "")}`}>
                    {user.role?.replace("-", " ") || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 font-medium">
                  {user.department || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                  <select
                    value={user.role || "end-user"}
                    onChange={(e) => handleRoleChange(user._id, e.target.value as "admin" | "technician" | "end-user")}
                    className="form-select text-sm"
                  >
                    <option value="end-user">End User</option>
                    <option value="technician">Technician</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredUsers.map((user) => (
          <div key={user._id} className="bg-secondary-50 p-4 rounded-container border border-border">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-secondary-900">{user.name || "N/A"}</h3>
              <span className={`badge-status ${getRoleColor(user.role || "")} text-xs`}>
                {user.role?.replace("-", " ") || "N/A"}
              </span>
            </div>
            <p className="text-sm text-secondary-600 mb-2">{user.email || "N/A"}</p>

            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-secondary-500">Department</span>
              <span className="font-medium text-secondary-900">{user.department || "N/A"}</span>
            </div>

            <div className="pt-3 border-t border-border">
              <label className="text-xs font-semibold text-secondary-700 block mb-1">Change Role</label>
              <select
                value={user.role || "end-user"}
                onChange={(e) => handleRoleChange(user._id, e.target.value as "admin" | "technician" | "end-user")}
                className="form-select text-sm w-full"
              >
                <option value="end-user">End User</option>
                <option value="technician">Technician</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-secondary-600">No users found.</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-secondary-50">
          <h3 className="text-lg font-semibold text-secondary-900">Total Users</h3>
          <p className="text-3xl font-bold text-primary">{allUsers?.length || 0}</p>
        </div>
        <div className="card bg-secondary-50">
          <h3 className="text-lg font-semibold text-secondary-900">Technicians</h3>
          <p className="text-3xl font-bold text-primary">
            {allUsers?.filter(u => u.role === "technician").length || 0}
          </p>
        </div>
        <div className="card bg-secondary-50">
          <h3 className="text-lg font-semibold text-secondary-900">Admins</h3>
          <p className="text-3xl font-bold text-red-800">
            {allUsers?.filter(u => u.role === "admin").length || 0}
          </p>
        </div>
      </div>
    </div>
  );
}
