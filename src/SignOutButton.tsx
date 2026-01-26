"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";

export function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      className="px-4 py-2 rounded-container bg-white text-primary font-semibold hover:bg-primary-50 transition-colors shadow-sm hover:shadow text-sm"
      onClick={() => void signOut()}
    >
      Sign out
    </button>
  );
}
