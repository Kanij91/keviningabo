import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function UserSetup() {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loggedInUser = useQuery(api.auth.loggedInUser);
  const createProfile = useMutation(api.users.createUserProfile);

  if (loggedInUser === undefined) {
    return <p>Loading...</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !loggedInUser?.email) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createProfile({
        email: loggedInUser.email,
        name,
        department,
        role: "end-user",
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
        <div className="card">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-6 text-center">
            Complete Your Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block text-sm font-semibold text-secondary-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-secondary-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={loggedInUser?.email || ""}
                disabled
                className="form-input bg-secondary-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-secondary-700 mb-2">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="form-input"
                placeholder="e.g., IT, HR, Finance"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="btn-primary w-full"
            >
              {isSubmitting ? "Creating Profile..." : "Complete Setup"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
