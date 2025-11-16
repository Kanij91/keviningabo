import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function UserSetup() {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState<"admin" | "technician" | "end-user">("end-user");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loggedInUser = useQuery(api.auth.loggedInUser);
  const createProfile = useMutation(api.users.createUserProfile);

  if (loggedInUser === undefined) {
    return <p>Loading...</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting profile form...");

    if (!name.trim() || !loggedInUser?.email) return;

    setIsSubmitting(true);
    try {
      await createProfile({
        email: loggedInUser.email,
        name,
        department,
        role,
      });

      toast.success("Profile created successfully!");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to create profile");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-96 p-8">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Complete Your Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={loggedInUser?.email || ""}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role *
              </label>
              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as "admin" | "technician" | "end-user")
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="end-user">End User</option>
                <option value="technician">Technician</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., IT, HR, Finance"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              {isSubmitting ? "Creating Profile..." : "Complete Setup"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
