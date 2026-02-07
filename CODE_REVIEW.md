# Code Review Report - ICT Helpdesk Application

## 1. Critical Issues (Fix Immediately)

### Security: Client-Side Role Assignment
**File:** `src/components/UserSetup.tsx`

**Issue:** The `role: "end-user"` is hardcoded in the frontend and sent to the backend. While seemingly harmless, relying on the client to define a user's role is a security risk. An attacker could intercept this request and change it to `"admin"`.

**Recommendation:** Remove the `role` field from the client-side mutation call. The backend mutation `createUserProfile` should automatically assign a default role (e.g., `"end-user"`) if one isn't provided or if the caller isn't an admin.

```typescript
// src/components/UserSetup.tsx

// BAD: Sending role from client
await createProfile({
  email: loggedInUser.email,
  name,
  department,
  role: "end-user", // ❌ Vulnerable if backend trusts this
});

// GOOD: Backend handles default role
await createProfile({
  email: loggedInUser.email,
  name,
  department,
});
```

### TypeScript: Avoid `any`
**File:** `src/components/TicketList.tsx` & `src/components/UserManagement.tsx`

**Issue:** The codebase uses `any` in critical places, bypassing type safety.
- `TicketList.tsx`: `const [selectedTicket, setSelectedTicket] = useState<any>(null);`
- `UserManagement.tsx`: `userId: userId as any`

**Recommendation:** Define proper interfaces for your data models.

```typescript
// src/lib/types.ts (Create this file)
import { Id } from "../../convex/_generated/dataModel";

export interface Ticket {
  _id: Id<"tickets">;
  _creationTime: number;
  title: string;
  description: string;
  status: "new" | "assigned" | "in-progress" | "on-hold" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  category: "hardware" | "software" | "network" | "account" | "other";
  requesterName: string;
  requesterEmail: string;
  assignedTechnician?: Id<"users">;
  resolutionNotes?: string;
}

// src/components/TicketList.tsx
import { Ticket } from "../lib/types";

const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
```

## 2. Refactoring Opportunities (Clean Up Later)

### DRY: Extract Constants and Helper Functions
**Files:** `src/components/TicketList.tsx`, `src/components/UserManagement.tsx`

**Issue:** Helper functions like `getPriorityColor`, `getStatusColor`, and `getRoleColor` are defined inside components. This logic is duplicated or trapped inside components.

**Recommendation:** Move these to a utility file.

```typescript
// src/lib/utils.ts
export const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    new: "text-primary bg-primary-50 border-primary-200",
    assigned: "text-purple-800 bg-purple-50 border-purple-200",
    // ... others
  };
  return colors[status] || "text-secondary-600 bg-secondary-100 border-secondary-200";
};
```

### DRY: Extract Inline Modal
**File:** `src/components/TicketList.tsx`

**Issue:** The ticket detail modal (lines ~220-330) is massive and defined inline within `TicketList`. This makes the parent component hard to read and the modal hard to reuse.

**Recommendation:** Extract it into a separate `TicketDetailModal` component.

```typescript
// src/components/TicketDetailModal.tsx
interface TicketDetailModalProps {
  ticket: Ticket;
  onClose: () => void;
  onUpdate: (id: Id<"tickets">, updates: Partial<Ticket>) => Promise<void>;
  isEndUser: boolean;
  technicians?: User[];
}

export function TicketDetailModal({ ticket, onClose, ...props }: TicketDetailModalProps) {
  // ... modal implementation
}
```

## 3. Performance Wins

### Memoize Expensive Calculations
**Files:** `src/components/TicketList.tsx`, `src/components/UserManagement.tsx`

**Issue:** Filtering logic runs on every render.
- `filteredTickets` in `TicketList.tsx`
- `filteredUsers` in `UserManagement.tsx`

**Recommendation:** Wrap these calculations in `useMemo`.

```typescript
// src/components/TicketList.tsx
import { useMemo } from "react";

const filteredTickets = useMemo(() => {
  return tickets?.filter((ticket) => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) || ...;
    // ... checks
    return matchesSearch && matchesStatus && matchesPriority;
  }) || [];
}, [tickets, searchTerm, statusFilter, priorityFilter]);
```

### Code Splitting with React.lazy
**File:** `src/components/Dashboard.tsx`

**Issue:** The dashboard imports all sub-components (`TicketList`, `CreateTicket`, etc.) upfront. Users likely only view one or two tabs per session.

**Recommendation:** Lazy load these components to reduce the initial bundle size.

```typescript
// src/components/Dashboard.tsx
import { Suspense, lazy } from "react";

const TicketList = lazy(() => import("./TicketList").then(m => ({ default: m.TicketList })));
const CreateTicket = lazy(() => import("./CreateTicket").then(m => ({ default: m.CreateTicket })));
// ... others

// Inside component
const renderContent = () => {
  return (
    <Suspense fallback={<div className="animate-spin ..."></div>}>
      {currentView === "tickets" && <TicketList />}
      {/* ... cases */}
    </Suspense>
  );
};
```

## 4. UI/UX Consistency

- **Mobile Sidebar:** The implementation in `Dashboard.tsx` is manual. Consider using a headless UI library (like Headless UI or Radix UI) for accessible dialogs and transitions, ensuring the backdrop click and focus management are robust.
- **Tailwind:** Usage is generally consistent. However, hardcoded colors (e.g., `text-emerald-800`) in helper functions should ideally use semantic names (e.g., `text-success-700`) defined in `tailwind.config.js` to ensure theme changes propagate everywhere.
