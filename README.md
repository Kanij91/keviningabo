ICT HelpDesk & Incident Management System

A scalable ICT HelpDesk and Incident Management System designed to streamline issue reporting, prioritization, tracking, and resolution within an organization. The system focuses on reliability, performance, and maintainability, with a modern Node.js-based backend.

Project Overview

This application enables users to:

Create and track support tickets

Manage incidents and priorities

Assign and resolve issues efficiently

Improve visibility into support workflows

The project was built with scalability and future extension in mind, following clean architecture and asynchronous, non-blocking backend patterns.

My Role

Role: Tech Lead / Backend Engineer

Led the project end-to-end from requirements to deployment

Designed the backend architecture and API contracts

Implemented core business logic and HTTP APIs

Reviewed code and guided development standards

Optimized queries and request handling for performance and reliability

Tech Stack

Backend: Node.js (Convex)

Language: TypeScript

Frontend: React + Vite

Authentication: Convex Auth

API: HTTP/REST endpoints

Tooling: Chef, npm

Architecture & Design

Modular backend structure for maintainability

Asynchronous, non-blocking request handling

Clear separation between authentication and business logic

Optimized data access with pagination and indexing

Role-based access control at the API level

Project Structure

app/ – Frontend (React + Vite)

convex/ – Backend logic, data models, and HTTP APIs

convex/router.ts – User-defined HTTP routes

convex/http.ts – Authentication and core routing

Running the Project Locally
npm install
npm run dev


This starts both the frontend and backend development servers.

Authentication

The app currently uses Convex Auth (Anonymous authentication) for development convenience. This can be replaced with stricter authentication methods before production deployment.

Deployment

The project is connected to a Convex deployment and can be deployed to production following Convex best practices.
See the official Convex documentation for deployment and scaling guidance.

Future Improvements

Advanced role-based permissions

Real-time notifications and updates

Enhanced reporting and analytics

Integration with external monitoring tools