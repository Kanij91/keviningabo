import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { Dashboard } from "./components/Dashboard";
import { UserSetup } from "./components/UserSetup";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-primary border-b border-primary-700 shadow-sm">
        <div className="h-16 flex justify-between items-center px-6">
          <h2 className="text-white font-serif text-xl font-bold tracking-tight">ICT Help Desk System</h2>
          <Authenticated>
            <SignOutButton />
          </Authenticated>
        </div>
      </header>
      <main className="flex-1">
        <Content />
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const currentUser = useQuery(api.users.getCurrentUser);

  if (loggedInUser === undefined || currentUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Authenticated>
        {currentUser && currentUser.name ? (
          <Dashboard />
        ) : (
          <UserSetup />
        )}
      </Authenticated>
      
      <Unauthenticated>
        <div className="flex items-center justify-center min-h-96 p-8">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-primary mb-4 font-serif">ICT Help Desk System</h1>
              <p className="text-lg text-secondary-600">Sign in to access the system</p>
            </div>
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>
    </div>
  );
}
