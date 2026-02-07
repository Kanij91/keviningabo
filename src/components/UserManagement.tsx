import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );
}

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const currentUser = useQuery(api.users.getCurrentUser);
  const allUsers = useQuery(api.users.getAllUsers);
  const updateUserRole = useMutation(api.users.updateUserRole);
  const anonymizeUser = useMutation(api.users.anonymizeUser);

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

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await anonymizeUser({ userId: userToDelete as any });
      toast.success("User deleted and anonymized successfully");
      setUserToDelete(null);
    } catch (error) {
      toast.error("Failed to delete user");
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

      {/* Users Table */}
      <div className="overflow-x-auto">
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
                  <div className="flex items-center gap-2">
                    <select
                      value={user.role || "end-user"}
                      onChange={(e) => handleRoleChange(user._id, e.target.value as "admin" | "technician" | "end-user")}
                      className="form-select text-sm w-32"
                    >
                      <option value="end-user">End User</option>
                      <option value="technician">Technician</option>
                      <option value="admin">Admin</option>
                    </select>

                    <button
                      onClick={() => handleDeleteClick(user._id)}
                      disabled={currentUser?._id === user._id}
                      className={`p-2 rounded hover:bg-red-50 text-red-600 transition-colors ${
                        currentUser?._id === user._id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      title={currentUser?._id === user._id ? "You cannot delete yourself" : "Delete User"}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

      {userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm User Deletion</h3>
            <p className="text-gray-600 mb-6">
              This will permanently remove the user's personal data and anonymize their ticket history. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
