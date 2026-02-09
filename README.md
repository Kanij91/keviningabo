# ICT HelpDesk & Incident Management System

A robust and scalable ICT HelpDesk and Incident Management System designed to streamline organizational support workflows. This application enables efficient issue reporting, prioritization, tracking, and resolution, leveraging a modern, real-time backend architecture.

## 🚀 Key Features

*   **Ticket Management**: Comprehensive lifecycle management from creation to closure.
*   **Role-Based Access Control (RBAC)**: Distinct roles for Administrators, Technicians, and End-Users to ensure secure data access and workflow integrity.
*   **Knowledge Base**: Centralized repository for troubleshooting guides and documentation to empower self-service.
*   **Real-time Updates**: Instant reflection of ticket status changes, assignments, and comments using Convex's reactive backend.
*   **Responsive Design**: Mobile-friendly interface built with Tailwind CSS, ensuring accessibility across devices.
*   **Secure Authentication**: Robust user management via Convex Auth.

## 🛠️ Tech Stack

**Frontend**
*   **React 19**: Leveraging the latest React features for building interactive UIs.
*   **Vite**: Next-generation frontend tooling for fast development and optimized builds.
*   **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
*   **TypeScript**: Ensuring type safety and code reliability.

**Backend**
*   **Convex**: The open-source reactive backend platform (Serverless functions & database).
*   **Convex Auth**: Secure authentication with the Password provider.
*   **Node.js Environment**: Backend logic written in TypeScript.

## 🏁 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

*   **Node.js** (v18 or higher recommended)
*   **npm** (Node Package Manager)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ict-helpdesk.git
    cd ict-helpdesk
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    This command will start both the frontend (Vite) and the backend (Convex). On the first run, it will prompt you to log in to Convex and configure a new project automatically.

4.  **Open the application:**
    Visit `http://localhost:5173` in your browser.

## 📂 Project Structure

*   `src/`: Frontend application code (React components, hooks, styles).
    *   `src/components/`: Reusable UI components.
    *   `src/lib/`: Shared utilities and type definitions.
*   `convex/`: Backend application code.
    *   `convex/schema.ts`: Database schema definition.
    *   `convex/auth.ts`: Authentication configuration.
    *   `convex/tickets.ts`: Ticket management logic.
    *   `convex/users.ts`: User management logic.

## 👨‍💻 My Role: Tech Lead / Backend Engineer

As the Tech Lead and Backend Engineer, I was responsible for the end-to-end delivery of the project, focusing on architecture, scalability, and maintainability.

*   **Architected the full-stack solution**, ensuring a seamless integration between the React frontend and Convex backend.
*   **Designed the database schema** and API contracts for optimal performance and data integrity.
*   **Implemented core business logic**, including complex ticket routing, RBAC, and real-time updates.
*   **Established coding standards** and led the development process, ensuring high code quality through rigorous reviews.
*   **Optimized performance** by leveraging Convex's indexing and query capabilities.

## 🔮 Future Improvements

*   **Advanced Analytics Dashboard**: Visualizing support metrics and KPIs.
*   **SLA Tracking**: Automated monitoring and alerts for Service Level Agreements.
*   **Integration with External Tools**: Connecting with monitoring platforms like Datadog or Sentry.
*   **Enhanced Reporting**: Customizable reports for management.
